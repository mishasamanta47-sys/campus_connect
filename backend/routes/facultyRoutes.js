const express = require("express");

const router = express.Router();

const {
  createFaculty,
  getFacultyStats,
} = require("../controllers/facultyController");

const {
  verifyToken,
  adminOnly,
} = require("../middleware/authMiddleware");


// ===============================
// CREATE FACULTY
// ADMIN ONLY
// ===============================
router.post(
  "/create",
  verifyToken,
  adminOnly,
  createFaculty
);


// ===============================
// FACULTY DASHBOARD STATS
// ===============================
router.get(
  "/stats",
  verifyToken,
  getFacultyStats
);


module.exports = router;