const express = require("express");
const db = require("../config/db");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

const normalizeAnnouncement = (row) => ({
  ...row,
  is_important: Boolean(Number(row.is_important) === 1 || row.is_important === true),
});

const ensureAnnouncementsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      department VARCHAR(255) NULL,
      semester INT NULL,
      created_by INT NOT NULL,
      created_by_role VARCHAR(30) NOT NULL,
      is_important TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

router.get("/", verifyToken, async (req, res) => {
  try {
    await ensureAnnouncementsTable();

    const [rows] = await db.query(
      `SELECT *
       FROM announcements
       ORDER BY is_important DESC, created_at DESC`
    );

    return res.status(200).json({
      success: true,
      announcements: rows.map(normalizeAnnouncement),
    });
  } catch (error) {
    console.error("Fetch announcements error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch announcements.",
    });
  }
});

router.get("/student", verifyToken, async (req, res) => {
  try {
    await ensureAnnouncementsTable();

    const userDepartment = (req.user.department || "").trim();
    const userSemester = Number(req.user.semester || 0);

    const [rows] = await db.query(
      `SELECT *
       FROM announcements
       WHERE (
         department IS NULL
         OR department = ''
         OR department = 'All'
         OR department = ?
       )
       AND (
         semester IS NULL
         OR semester = 0
         OR semester = ?
       )
       ORDER BY is_important DESC, created_at DESC`,
      [userDepartment, userSemester]
    );

    return res.status(200).json({
      success: true,
      announcements: rows.map(normalizeAnnouncement),
    });
  } catch (error) {
    console.error("Fetch student announcements error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load semester announcements.",
    });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    await ensureAnnouncementsTable();

    if (!req.user || !["admin", "faculty"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only admins and faculty can publish announcements.",
      });
    }

    const { title, message, department, semester, is_important } = req.body || {};
    const cleanTitle = String(title || "").trim();
    const cleanMessage = String(message || "").trim();

    if (!cleanTitle || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    const targetDepartment =
      req.user.role === "faculty"
        ? (req.user.department || "")
        : String(department || "All").trim() || "All";

    const targetSemester =
      req.user.role === "faculty"
        ? Number(req.user.semester || 0)
        : Number(semester || 0);

    if (req.user.role === "faculty" && !req.user.department) {
      return res.status(400).json({
        success: false,
        message: "Your department is missing from your profile.",
      });
    }

    if (!Number.isInteger(targetSemester) || targetSemester < 0 || targetSemester > 8) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 8, or leave blank for all semesters.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO announcements
       (title, message, department, semester, created_by, created_by_role, is_important)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanTitle,
        cleanMessage,
        targetDepartment || "All",
        targetSemester,
        req.user.id,
        req.user.role,
        is_important ? 1 : 0,
      ]
    );

    const [rows] = await db.query(`SELECT * FROM announcements WHERE id = ?`, [result.insertId]);

    return res.status(201).json({
      success: true,
      message: "Announcement published successfully.",
      announcement: normalizeAnnouncement(rows[0]),
    });
  } catch (error) {
    console.error("Create announcement error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to publish announcement.",
    });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT created_by, created_by_role
       FROM announcements
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    const announcement = rows[0];
    const allowed = req.user.role === "admin" || Number(announcement.created_by) === Number(req.user.id);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this announcement.",
      });
    }

    await db.query(`DELETE FROM announcements WHERE id = ?`, [id]);

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error("Delete announcement error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete announcement.",
    });
  }
});

module.exports = router;
