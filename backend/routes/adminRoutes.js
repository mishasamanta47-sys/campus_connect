const express = require("express");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

const {
  verifyToken,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================
// ADMIN DASHBOARD STATISTICS
// GET /api/admin/dashboard/stats
// =====================================

router.get(
  "/dashboard/stats",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT
         (
  SELECT COUNT(*)
  FROM users
  WHERE role = 'student'
    AND account_status = 'active'
) AS totalStudents,

          (
  SELECT COUNT(*)
  FROM users
  WHERE role = 'student'
    AND account_status = 'pending'
) AS pendingStudents,

          (
            SELECT COUNT(*)
            FROM users
            WHERE role = 'faculty'
          ) AS totalFaculty,

          (
            SELECT COUNT(*)
            FROM users
            WHERE role = 'faculty'
              AND account_status = 'active'
          ) AS activeFaculty,

          (
            SELECT COUNT(*)
            FROM users
            WHERE role = 'faculty'
              AND account_status = 'inactive'
          ) AS inactiveFaculty,

          (
            SELECT COUNT(*)
            FROM notes
          ) AS totalNotes,

          (
            SELECT COUNT(*)
            FROM events
          ) AS totalEvents
      `);

      return res.status(200).json({
        success: true,
        stats: rows[0],
      });
    } catch (error) {
      console.error("Dashboard Stats Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to load dashboard statistics.",
      });
    }
  }
);

// =====================================
// GET ALL FACULTY
// GET /api/admin/faculty
// =====================================

router.get(
  "/faculty",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const [faculty] = await db.query(`
        SELECT
          u.id,
          u.full_name,
          u.email,
          u.phone,
          u.department,
          u.semester,
          u.role,
          u.account_status,
          u.created_at,
          COUNT(n.id) AS notes_uploaded
        FROM users u
        LEFT JOIN notes n
          ON n.uploaded_by = u.id
        WHERE u.role = 'faculty'
        GROUP BY
          u.id,
          u.full_name,
          u.email,
          u.phone,
          u.department,
          u.semester,
          u.role,
          u.account_status,
          u.created_at
        ORDER BY u.id DESC
      `);

      return res.status(200).json({
        success: true,
        faculty,
      });
    } catch (error) {
      console.error("Get Faculty Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch faculty.",
      });
    }
  }
);

// =====================================
// RESET FACULTY PASSWORD
// PUT /api/admin/faculty/:id/reset-password
// =====================================

router.put(
  "/faculty/:id/reset-password",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).json({
          success: false,
          message: "New password is required.",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters.",
        });
      }

      const [faculty] = await db.query(
        `
        SELECT id
        FROM users
        WHERE id = ?
          AND role = 'faculty'
        `,
        [id]
      );

      if (faculty.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found.",
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      await db.query(
        `
        UPDATE users
        SET password = ?
        WHERE id = ?
          AND role = 'faculty'
        `,
        [hashedPassword, id]
      );

      return res.status(200).json({
        success: true,
        message: "Faculty password reset successfully.",
      });
    } catch (error) {
      console.error(
        "Reset Faculty Password Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to reset faculty password.",
      });
    }
  }
);

// =====================================
// ACTIVATE / DEACTIVATE FACULTY
// PUT /api/admin/faculty/:id/status
// =====================================

router.put(
  "/faculty/:id/status",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { account_status } = req.body;

      if (
        !["active", "inactive"].includes(account_status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Status must be active or inactive.",
        });
      }

      const [faculty] = await db.query(
        `
        SELECT id
        FROM users
        WHERE id = ?
          AND role = 'faculty'
        `,
        [id]
      );

      if (faculty.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found.",
        });
      }

      await db.query(
        `
        UPDATE users
        SET account_status = ?
        WHERE id = ?
          AND role = 'faculty'
        `,
        [account_status, id]
      );

      return res.status(200).json({
        success: true,
        message:
          account_status === "inactive"
            ? "Faculty account deactivated successfully."
            : "Faculty account reactivated successfully.",
        account_status,
      });
    } catch (error) {
      console.error(
        "Update Faculty Status Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to update faculty account status.",
      });
    }
  }
);

// =====================================
// GET FACULTY DETAILS BY ID
// GET /api/admin/faculty/:id
// =====================================

router.get(
  "/faculty/:id",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      const [faculty] = await db.query(
        `
        SELECT
          u.id,
          u.full_name,
          u.email,
          u.phone,
          u.department,
          u.semester,
          u.role,
          u.account_status,
          u.created_at,
          COUNT(n.id) AS notes_uploaded
        FROM users u
        LEFT JOIN notes n
          ON n.uploaded_by = u.id
        WHERE u.id = ?
          AND u.role = 'faculty'
        GROUP BY
          u.id,
          u.full_name,
          u.email,
          u.phone,
          u.department,
          u.semester,
          u.role,
          u.account_status,
          u.created_at
        `,
        [id]
      );

      if (faculty.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found.",
        });
      }

      const [notes] = await db.query(
        `
        SELECT *
        FROM notes
        WHERE uploaded_by = ?
        ORDER BY created_at DESC
        `,
        [id]
      );

      return res.status(200).json({
        success: true,
        faculty: faculty[0],
        notes,
      });
    } catch (error) {
      console.error(
        "Get Faculty Details Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch faculty details.",
      });
    }
  }
);

// =====================================
// UPDATE FACULTY INFORMATION
// PUT /api/admin/faculty/:id
// =====================================

router.put(
  "/faculty/:id",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        fullName,
        email,
        phone,
        department,
      } = req.body;

      if (!fullName || !email || !department) {
        return res.status(400).json({
          success: false,
          message:
            "Full name, email and department are required.",
        });
      }

      const [faculty] = await db.query(
        `
        SELECT id
        FROM users
        WHERE id = ?
          AND role = 'faculty'
        `,
        [id]
      );

      if (faculty.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found.",
        });
      }

      const [existingEmail] = await db.query(
        `
        SELECT id
        FROM users
        WHERE email = ?
          AND id != ?
        `,
        [email, id]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "This email is already being used by another user.",
        });
      }

      await db.query(
        `
        UPDATE users
        SET
          full_name = ?,
          email = ?,
          phone = ?,
          department = ?
        WHERE id = ?
          AND role = 'faculty'
        `,
        [
          fullName,
          email,
          phone || null,
          department,
          id,
        ]
      );

      return res.status(200).json({
        success: true,
        message:
          "Faculty information updated successfully.",
      });
    } catch (error) {
      console.error(
        "Update Faculty Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update faculty information.",
      });
    }
  }
);
router.get("/students", verifyToken, adminOnly, async (req, res) => {
  try {
   const [students] = await db.query(`
  SELECT id, full_name, email, department, semester, created_at
  FROM users
  WHERE role = 'student'
    AND account_status = 'active'
  ORDER BY id DESC
`);

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Fetch Students Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch students.",
    });
  }
});

router.put(
  "/students/:id/status",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const studentId = Number(req.params.id);
      const { account_status } = req.body;

      if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID.",
        });
      }

      if (!["active", "inactive"].includes(account_status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be active or inactive.",
        });
      }

      const [result] = await db.query(
        `UPDATE users
         SET account_status = ?
         WHERE id = ? AND role = 'student'`,
        [account_status, studentId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Student account ${account_status} successfully.`,
        account_status,
      });
    } catch (error) {
      console.error("Update Student Status Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update student account status.",
      });
    }
  }
);

// Get complete details of one student
router.get(
  "/students/:id",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const studentId = Number(req.params.id);

      if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID.",
        });
      }

      const [students] = await db.query(
        `SELECT
          id,
          full_name,
          email,
          phone,
          department,
          semester,
          role,
          created_at,
          account_status
        FROM users
        WHERE id = ? AND role = 'student'
        LIMIT 1`,
        [studentId]
      );

      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      return res.status(200).json({
        success: true,
        student: students[0],
      });
    } catch (error) {
      console.error("Student Details Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch student details.",
      });
    }
  }
);

// =====================================
// RESET STUDENT PASSWORD
// PUT /api/admin/students/:id/reset-password
// =====================================

router.put(
  "/students/:id/reset-password",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const studentId = Number(req.params.id);
      const { newPassword } = req.body;

      if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID.",
        });
      }

      if (typeof newPassword !== "string" || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "New password is required.",
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters.",
        });
      }

      const [students] = await db.query(
        `SELECT id
         FROM users
         WHERE id = ? AND role = 'student'`,
        [studentId]
      );

      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.query(
        `UPDATE users
         SET password = ?
         WHERE id = ? AND role = 'student'`,
        [hashedPassword, studentId]
      );

      return res.status(200).json({
        success: true,
        message: "Student password reset successfully.",
      });
    } catch (error) {
      console.error("Reset Student Password Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to reset student password.",
      });
    }
  }
);

router.put(
  "/students/:id",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const studentId = Number(req.params.id);
      const {
        full_name,
        email,
        phone,
        department,
        semester,
      } = req.body;

      if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID.",
        });
      }

      if (
        !full_name?.trim() ||
        !email?.trim() ||
        !department?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and department are required.",
        });
      }

      const [students] = await db.query(
        "SELECT id FROM users WHERE id = ? AND role = 'student'",
        [studentId]
      );

      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const [existingEmail] = await db.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [email.trim().toLowerCase(), studentId]
      );

      if (existingEmail.length > 0) {
        return res.status(409).json({
          success: false,
          message: "This email is already used by another user.",
        });
      }

      await db.query(
        `UPDATE users
         SET full_name = ?, email = ?, phone = ?,
             department = ?, semester = ?
         WHERE id = ? AND role = 'student'`,
        [
          full_name.trim(),
          email.trim().toLowerCase(),
          phone?.trim() || null,
          department.trim(),
          semester ?? null,
          studentId,
        ]
      );

      return res.status(200).json({
        success: true,
        message: "Student details updated successfully.",
      });
    } catch (error) {
      console.error("Edit Student Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update student details.",
      });
    }
  }
);

/* =====================================
   STUDENT REGISTRATION APPROVAL
===================================== */

// Get pending student requests
router.get(
  "/student-requests",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const [students] = await db.query(`
        SELECT
          id,
          full_name,
          email,
          phone,
          department,
          semester,
          created_at,
          account_status
        FROM users
        WHERE role = 'student'
          AND account_status = 'pending'
        ORDER BY created_at ASC
      `);

      return res.status(200).json({
        success: true,
        students,
      });
    } catch (error) {
      console.error("Pending Student Requests Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to load student requests.",
      });
    }
  }
);

// Approve a student
router.put(
  "/student-requests/:id/approve",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const studentId = Number(req.params.id);

      if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID.",
        });
      }

      const [result] = await db.query(
        `UPDATE users
         SET account_status = 'active'
         WHERE id = ?
           AND role = 'student'
           AND account_status = 'pending'`,
        [studentId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Pending student request not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Student approved successfully.",
      });
    } catch (error) {
      console.error("Approve Student Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to approve student.",
      });
    }
  }
);

// Reject a student
router.put(
  "/student-requests/:id/reject",
  verifyToken,
  adminOnly,
  async (req, res) => {
    try {
      const studentId = Number(req.params.id);

      if (!Number.isInteger(studentId) || studentId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID.",
        });
      }

      const [result] = await db.query(
        `UPDATE users
         SET account_status = 'rejected'
         WHERE id = ?
           AND role = 'student'
           AND account_status = 'pending'`,
        [studentId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Pending student request not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Student request rejected.",
      });
    } catch (error) {
      console.error("Reject Student Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to reject student request.",
      });
    }
  }
);
// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;