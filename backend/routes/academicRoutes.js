const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

const ensureAcademicTables = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS student_marks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      department VARCHAR(255) NOT NULL,
      semester INT NOT NULL,
      subject VARCHAR(255) NOT NULL,
      subject_id INT NULL,
      marks DECIMAL(5,2) NOT NULL DEFAULT 0,
      max_marks DECIMAL(5,2) NOT NULL DEFAULT 100,
      recorded_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_student_subject_semester (student_id, department, semester, subject)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS student_attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      department VARCHAR(255) NOT NULL,
      semester INT NOT NULL,
      subject VARCHAR(255) NOT NULL,
      subject_id INT NULL,
      attendance_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
      recorded_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_student_subject_attendance (student_id, department, semester, subject)
    )
  `);
};

const toSemesterNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number" && Number.isInteger(value)) {
    return value >= 1 && value <= 8 ? value : null;
  }

  const asString = String(value).trim();
  const match = asString.match(/(\d+)/);

  if (!match) return null;

  const semester = Number(match[1]);
  return Number.isInteger(semester) && semester >= 1 && semester <= 8 ? semester : null;
};

// GET SUBJECTS FOR THE LOGGED-IN STUDENT
router.get("/my-subjects", verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    const [students] = await db.query(
      `SELECT department, semester, department_id
       FROM users
       WHERE id = ? AND role = 'student'`,
      [studentId]
    );

    if (students.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Student access required.",
      });
    }

    const { department, semester, department_id } = students[0];
    let resolvedDepartmentId = Number(department_id);

    if (!resolvedDepartmentId || Number.isNaN(resolvedDepartmentId)) {
      const [departments] = await db.query(
        `SELECT id
         FROM departments
         WHERE LOWER(TRIM(name)) = LOWER(TRIM(?))
         LIMIT 1`,
        [department]
      );

      resolvedDepartmentId = Number(departments[0]?.id || 0);
    }

    const semesterNumber = toSemesterNumber(semester);

    if (!semesterNumber || semesterNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Student semester is invalid.",
      });
    }

    if (!resolvedDepartmentId) {
      return res.status(404).json({
        success: false,
        message: "Department not found for this student.",
      });
    }

    const [subjects] = await db.query(
      `SELECT id, name, code, semester
       FROM subjects
       WHERE department_id = ? AND semester = ?
       ORDER BY name ASC`,
      [resolvedDepartmentId, semesterNumber]
    );

    return res.status(200).json({
      success: true,
      department: department || "",
      semester: semesterNumber,
      subjects,
    });
  } catch (error) {
    console.error("My Subjects Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your subjects.",
    });
  }
});

router.get("/faculty-students", verifyToken, async (req, res) => {
  try {
    await ensureAcademicTables();

    if (!req.user || !["admin", "faculty"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Faculty access required.",
      });
    }

    const department = String(req.query.department || "").trim();
    const semester = toSemesterNumber(req.query.semester);

    if (!department || !semester) {
      return res.status(400).json({
        success: false,
        message: "Department and semester are required.",
      });
    }

    if (req.user.role === "faculty" && req.user.department && department !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own department students.",
      });
    }

    const [students] = await db.query(
      `SELECT id, full_name, email, department, semester
       FROM users
       WHERE role = 'student'
         AND department = ?
         AND semester = ?
       ORDER BY full_name ASC`,
      [department, semester]
    );

    return res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Faculty students error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load students.",
    });
  }
});

router.get("/subject-list", verifyToken, async (req, res) => {
  try {
    const department = String(req.query.department || "").trim();
    const semester = toSemesterNumber(req.query.semester);

    if (!department || !semester) {
      return res.status(400).json({
        success: false,
        message: "Department and semester are required.",
      });
    }

    const [departmentRows] = await db.query(
      `SELECT id FROM departments WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1`,
      [department]
    );

    if (departmentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    const [subjects] = await db.query(
      `SELECT id, name, code, semester
       FROM subjects
       WHERE department_id = ? AND semester = ?
       ORDER BY name ASC`,
      [departmentRows[0].id, semester]
    );

    return res.status(200).json({
      success: true,
      subjects,
    });
  } catch (error) {
    console.error("Subject list error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load subjects.",
    });
  }
});

router.get("/faculty-records", verifyToken, async (req, res) => {
  try {
    await ensureAcademicTables();

    if (!req.user || !["admin", "faculty"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Faculty access required.",
      });
    }

    const department = String(req.query.department || "").trim();
    const semester = toSemesterNumber(req.query.semester);
    const subject = String(req.query.subject || "").trim();

    if (!department || !semester || !subject) {
      return res.status(400).json({
        success: false,
        message: "Department, semester, and subject are required.",
      });
    }

    const [marksRows] = await db.query(
      `SELECT student_id, marks, max_marks
       FROM student_marks
       WHERE department = ? AND semester = ? AND subject = ?`,
      [department, semester, subject]
    );

    const [attendanceRows] = await db.query(
      `SELECT student_id, attendance_percentage
       FROM student_attendance
       WHERE department = ? AND semester = ? AND subject = ?`,
      [department, semester, subject]
    );

    const records = {};

    marksRows.forEach((row) => {
      records[row.student_id] = {
        ...records[row.student_id],
        marks: Number(row.marks),
        max_marks: Number(row.max_marks),
      };
    });

    attendanceRows.forEach((row) => {
      records[row.student_id] = {
        ...records[row.student_id],
        attendance: Number(row.attendance_percentage),
      };
    });

    return res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    console.error("Faculty records fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load records.",
    });
  }
});

router.post("/faculty-records", verifyToken, async (req, res) => {
  try {
    await ensureAcademicTables();

    if (!req.user || !["admin", "faculty"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Faculty access required.",
      });
    }

    const { department, semester, subject, records } = req.body || {};
    const semesterNumber = toSemesterNumber(semester);
    const cleanDepartment = String(department || "").trim();
    const cleanSubject = String(subject || "").trim();

    if (!cleanDepartment || !semesterNumber || !cleanSubject || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Department, semester, subject, and student records are required.",
      });
    }

    if (req.user.role === "faculty" && req.user.department && cleanDepartment !== req.user.department) {
      return res.status(403).json({
        success: false,
        message: "You can only update records for your own department.",
      });
    }

    for (const item of records) {
      const studentId = Number(item.student_id);
      const marks = Number(item.marks ?? 0);
      const maxMarks = Number(item.max_marks ?? 100);
      const attendance = Number(item.attendance ?? 0);

      if (!studentId) {
        continue;
      }

      const [studentRows] = await db.query(
        `SELECT id, department, semester FROM users WHERE id = ? AND role = 'student' LIMIT 1`,
        [studentId]
      );

      if (studentRows.length === 0) {
        continue;
      }

      if (studentRows[0].department !== cleanDepartment || Number(studentRows[0].semester) !== semesterNumber) {
        continue;
      }

      await db.query(
        `INSERT INTO student_marks (student_id, department, semester, subject, subject_id, marks, max_marks, recorded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           marks = VALUES(marks),
           max_marks = VALUES(max_marks),
           subject_id = VALUES(subject_id),
           recorded_by = VALUES(recorded_by),
           created_at = CURRENT_TIMESTAMP`,
        [studentId, cleanDepartment, semesterNumber, cleanSubject, null, Number.isFinite(marks) ? marks : 0, Number.isFinite(maxMarks) && maxMarks > 0 ? maxMarks : 100, req.user.id]
      );

      await db.query(
        `INSERT INTO student_attendance (student_id, department, semester, subject, subject_id, attendance_percentage, recorded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           attendance_percentage = VALUES(attendance_percentage),
           subject_id = VALUES(subject_id),
           recorded_by = VALUES(recorded_by),
           created_at = CURRENT_TIMESTAMP`,
        [studentId, cleanDepartment, semesterNumber, cleanSubject, null, Number.isFinite(attendance) ? attendance : 0, req.user.id]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Marks and attendance saved successfully.",
    });
  } catch (error) {
    console.error("Save faculty records error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save marks and attendance.",
    });
  }
});

router.get("/student-records", verifyToken, async (req, res) => {
  try {
    await ensureAcademicTables();

    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Student access required.",
      });
    }

    const department = String(req.user.department || "").trim();
    const semester = toSemesterNumber(req.user.semester);

    if (!department || !semester) {
      return res.status(400).json({
        success: false,
        message: "Department or semester is missing from your profile.",
      });
    }

    const [marksRows] = await db.query(
      `SELECT subject, marks, max_marks
       FROM student_marks
       WHERE student_id = ? AND department = ? AND semester = ?
       ORDER BY subject ASC`,
      [req.user.id, department, semester]
    );

    const [attendanceRows] = await db.query(
      `SELECT subject, attendance_percentage
       FROM student_attendance
       WHERE student_id = ? AND department = ? AND semester = ?
       ORDER BY subject ASC`,
      [req.user.id, department, semester]
    );

    const attendanceMap = {};
    attendanceRows.forEach((row) => {
      attendanceMap[row.subject] = Number(row.attendance_percentage);
    });

    const records = marksRows.map((row) => ({
      subject: row.subject,
      marks: Number(row.marks),
      max_marks: Number(row.max_marks),
      attendance: attendanceMap[row.subject] ?? 0,
    }));

    return res.status(200).json({
      success: true,
      records,
      department,
      semester,
    });
  } catch (error) {
    console.error("Student records fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load marks and attendance.",
    });
  }
});

module.exports = router;