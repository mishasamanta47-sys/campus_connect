const db = require("../config/db");

// Create an assignment with an optional PDF or image attachment
const createAssignment = async (assignment) => {
  const {
    title,
    description,
    subject,
    department,
    semester,
    due_date,
    total_marks,
    faculty_id,
    status,
    attachment_path,
    attachment_name,
  } = assignment;

  const [result] = await db.query(
    `INSERT INTO assignments (
      title,
      description,
      subject,
      department,
      semester,
      due_date,
      total_marks,
      faculty_id,
      status,
      attachment_path,
      attachment_name
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description || "",
      subject,
      department,
      semester,
      due_date,
      total_marks || 100,
      faculty_id,
      status || "draft",
      attachment_path || null,
      attachment_name || null,
    ]
  );

  return result.insertId;
};

// Get published assignments for a student's department and semester
const getPublishedAssignments = async (department, semester) => {
  const [rows] = await db.query(
    `SELECT
      id,
      title,
      description,
      subject,
      department,
      semester,
      due_date,
      total_marks,
      faculty_id,
      attachment_path,
      attachment_name,
      created_at
    FROM assignments
    WHERE department = ?
      AND semester = ?
      AND status = 'published'
    ORDER BY due_date ASC`,
    [department, semester]
  );

  return rows;
};

// Get all assignments created by a particular faculty member
const getFacultyAssignments = async (facultyId) => {
  const [rows] = await db.query(
    `SELECT
      id,
      title,
      description,
      subject,
      department,
      semester,
      due_date,
      total_marks,
      faculty_id,
      status,
      attachment_path,
      attachment_name,
      created_at
    FROM assignments
    WHERE faculty_id = ?
    ORDER BY created_at DESC`,
    [facultyId]
  );

  return rows;
};

const updateAssignmentById = async (id, facultyId, data) => {
  const fields = [];
  const values = [];

  [
    "title",
    "description",
    "subject",
    "department",
    "semester",
    "due_date",
    "total_marks",
    "status",
    "attachment_path",
    "attachment_name",
  ].forEach((field) => {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field]);
    }
  });

  if (fields.length === 0) {
    return false;
  }

  values.push(id, facultyId);

  const [result] = await db.query(
    `UPDATE assignments
     SET ${fields.join(", ")}
     WHERE id = ? AND faculty_id = ?`,
    values
  );

  return result.affectedRows > 0;
};

const deleteAssignmentById = async (id, facultyId) => {
  const [result] = await db.query(
    `DELETE FROM assignments
     WHERE id = ? AND faculty_id = ?`,
    [id, facultyId]
  );

  return result.affectedRows > 0;
};

module.exports = {
  createAssignment,
  getPublishedAssignments,
  getFacultyAssignments,
  updateAssignmentById,
  deleteAssignmentById,
};