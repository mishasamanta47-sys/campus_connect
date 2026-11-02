const express = require("express");
const db = require("../config/db");
const { verifyToken, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const getSemesterNumber = (value) => {
  const semester = Number(value);
  return Number.isInteger(semester) ? semester : null;
};

const validateSubjectPayload = ({ department_id, semester, name, code }) => {
  const errors = [];

  if (!department_id || Number(department_id) <= 0) {
    errors.push("Department is required.");
  }

  const semesterNumber = getSemesterNumber(semester);
  if (!semesterNumber || semesterNumber < 1 || semesterNumber > 8) {
    errors.push("Semester must be between 1 and 8.");
  }

  if (!name || !String(name).trim()) {
    errors.push("Subject name is required.");
  }

  if (!code || !String(code).trim()) {
    errors.push("Subject code is required.");
  }

  return { semesterNumber, errors };
};

// =====================================
// GET ALL SUBJECTS
// =====================================

router.get("/", async (req, res) => {
  try {
    const [subjects] = await db.query(`
      SELECT
        s.id,
        s.name,
        s.code,
        s.semester,
        d.id AS department_id,
        d.name AS department,
        d.code AS department_code
      FROM subjects s
      JOIN departments d
        ON s.department_id = d.id
      ORDER BY
        d.name ASC,
        s.semester ASC,
        s.name ASC
    `);

    res.status(200).json({
      success: true,
      subjects,
    });

  } catch (error) {
    console.error(
      "Subject Fetch Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects.",
    });
  }
});

// =====================================
// CREATE SUBJECT
// =====================================

router.post("/", verifyToken, adminOnly, async (req, res) => {
  try {
    const { department_id, semester, name, code } = req.body || {};
    const { semesterNumber, errors } = validateSubjectPayload({
      department_id,
      semester,
      name,
      code,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    const [departmentRows] = await db.query(
      "SELECT id FROM departments WHERE id = ?",
      [Number(department_id)]
    );

    if (departmentRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected department does not exist.",
      });
    }

    const payloadName = String(name).trim();
    const payloadCode = String(code).trim();

    const [existing] = await db.query(
      `SELECT id
       FROM subjects
       WHERE department_id = ?
         AND semester = ?
         AND LOWER(name) = LOWER(?)
       LIMIT 1`,
      [Number(department_id), semesterNumber, payloadName]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This subject already exists for the selected department and semester.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO subjects (department_id, semester, name, code)
       VALUES (?, ?, ?, ?)`,
      [Number(department_id), semesterNumber, payloadName, payloadCode]
    );

    const [newSubject] = await db.query(
      `SELECT s.id, s.name, s.code, s.semester, d.id AS department_id, d.name AS department
       FROM subjects s
       JOIN departments d ON s.department_id = d.id
       WHERE s.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Subject added successfully.",
      subject: newSubject[0],
    });
  } catch (error) {
    console.error("Create Subject Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add subject.",
    });
  }
});

// =====================================
// UPDATE SUBJECT
// =====================================

router.put("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { department_id, semester, name, code } = req.body || {};
    const { semesterNumber, errors } = validateSubjectPayload({
      department_id,
      semester,
      name,
      code,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors[0],
      });
    }

    const [departmentRows] = await db.query(
      "SELECT id FROM departments WHERE id = ?",
      [Number(department_id)]
    );

    if (departmentRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Selected department does not exist.",
      });
    }

    const payloadName = String(name).trim();
    const payloadCode = String(code).trim();

    const [existing] = await db.query(
      `SELECT id
       FROM subjects
       WHERE department_id = ?
         AND semester = ?
         AND LOWER(name) = LOWER(?)
         AND id != ?
       LIMIT 1`,
      [Number(department_id), semesterNumber, payloadName, Number(id)]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This subject already exists for the selected department and semester.",
      });
    }

    await db.query(
      `UPDATE subjects
       SET department_id = ?, semester = ?, name = ?, code = ?
       WHERE id = ?`,
      [Number(department_id), semesterNumber, payloadName, payloadCode, Number(id)]
    );

    res.status(200).json({
      success: true,
      message: "Subject updated successfully.",
    });
  } catch (error) {
    console.error("Update Subject Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update subject.",
    });
  }
});

// =====================================
// DELETE SUBJECT
// =====================================

router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM subjects WHERE id = ?", [Number(id)]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Subject Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete subject.",
    });
  }
});

// =====================================
// GET SUBJECTS BY DEPARTMENT + SEMESTER
// =====================================

router.get(
  "/department/:departmentId/semester/:semester",
  async (req, res) => {
    try {
      const {
        departmentId,
        semester,
      } = req.params;

      const semesterNumber = getSemesterNumber(semester);
      if (!semesterNumber || semesterNumber < 1 || semesterNumber > 8) {
        return res.status(400).json({
          success: false,
          message: "Semester must be between 1 and 8.",
        });
      }

      const [subjects] = await db.query(
        `
        SELECT
          id,
          name,
          code,
          semester,
          department_id
        FROM subjects
        WHERE department_id = ?
          AND semester = ?
        ORDER BY name ASC
        `,
        [departmentId, semesterNumber]
      );

      res.status(200).json({
        success: true,
        subjects,
      });

    } catch (error) {
      console.error(
        "Subject Filter Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Failed to fetch filtered subjects.",
      });
    }
  }
);


module.exports = router;