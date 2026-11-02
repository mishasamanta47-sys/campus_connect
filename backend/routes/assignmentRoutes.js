const express = require("express");
const router = express.Router();

const {
  addAssignment,
  getMyAssignments,
  getStudentAssignments,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Faculty: create or publish an assignment with an optional attachment
router.post(
  "/",
  verifyToken,
  upload.single("attachment"),
  addAssignment
);

// Faculty: view their own assignments
router.get("/my", verifyToken, getMyAssignments);

// Faculty: update their own assignment
router.put("/:id", verifyToken, updateAssignment);

// Faculty: delete their own assignment
router.delete("/:id", verifyToken, deleteAssignment);

// Student: view published assignments for their department and semester
router.get("/student", verifyToken, getStudentAssignments);

module.exports = router;