const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const db = require("../config/db");

const countRowsForFaculty = async (tableName, possibleColumns, facultyId) => {
  if (!facultyId) {
    return 0;
  }

  try {
    const [columns] = await db.query(`SHOW COLUMNS FROM ${tableName}`);
    const fields = possibleColumns.filter((column) =>
      columns.some((item) => item.Field === column)
    );

    if (!fields.length) {
      return 0;
    }

    const whereClause = fields.map((field) => `${field} = ?`).join(" OR ");
    const [rows] = await db.query(
      `SELECT COUNT(*) AS total FROM ${tableName} WHERE ${whereClause}`,
      Array(fields.length).fill(facultyId)
    );

    return Number(rows[0]?.total || 0);
  } catch (error) {
    return 0;
  }
};

// ===============================
// CREATE FACULTY
// ===============================
const createFaculty = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      department_id,
      password,
    } = req.body;

    // Check required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !department_id ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    // Resolve department name from the departments table
    const [deptRows] = await db.query(
      "SELECT id, name, code FROM departments WHERE id = ?",
      [department_id]
    );

    if (!deptRows || deptRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected department does not exist.",
      });
    }

    const departmentName = deptRows[0].name;

    // Check if email already exists
    const existingUsers =
      await userModel.findUserByEmail(email);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create faculty (store both department name and department_id)
    const newFaculty = {
      fullName,
      email,
      phone,
      department: departmentName,
      department_id: Number(department_id),
      semester: "Faculty",
      password: hashedPassword,
    };

    const result =
      await userModel.createUser(newFaculty);

    // Change newly created user role to faculty
    await userModel.updateRole(
      result.insertId,
      "faculty"
    );

    return res.status(201).json({
      success: true,
      message: "Faculty account created successfully.",
      faculty: {
        id: result.insertId,
        fullName,
        email,
        department: departmentName,
        department_id: Number(department_id),
      },
    });

  } catch (error) {
    console.error(
      "Create Faculty Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error while creating faculty.",
    });
  }
};


// ===============================
// GET FACULTY DASHBOARD STATS
// ===============================
const getFacultyStats = async (req, res) => {
  try {
    const facultyId = req.user?.id;

    const [notesTotal, assignmentsTotal, eventsTotal, announcementsTotal] = await Promise.all([
      countRowsForFaculty("notes", ["uploaded_by", "created_by"], facultyId),
      countRowsForFaculty("assignments", ["faculty_id", "created_by", "uploaded_by"], facultyId),
      countRowsForFaculty("events", ["created_by", "faculty_id", "uploaded_by"], facultyId),
      countRowsForFaculty("announcements", ["created_by", "faculty_id"], facultyId),
    ]);

    return res.status(200).json({
      success: true,
      notes: notesTotal,
      assignments: assignmentsTotal,
      events: eventsTotal,
      announcements: announcementsTotal,
    });

  } catch (error) {
    console.error(
      "Faculty Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load faculty statistics.",
    });
  }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
  createFaculty,
  getFacultyStats,
};