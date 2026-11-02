const {
  createAssignment,
  getPublishedAssignments,
  getFacultyAssignments,
  updateAssignmentById,
  deleteAssignmentById,
} = require("../models/assignmentModel");

const normalizeSemesterValue = (value) => {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number" && Number.isInteger(value)) {
    return value >= 1 && value <= 8 ? value : null;
  }

  const asString = String(value).trim();
  const match = asString.match(/(\d+)/);

  if (!match) return null;

  const numericValue = Number(match[1]);
  return Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 8 ? numericValue : null;
};

// CREATE OR PUBLISH ASSIGNMENT
const addAssignment = async (req, res) => {
  let uploadedFilePath = null;

  try {
    const role = req.user?.role;
    const facultyId = req.user?.id ?? req.user?.userId;

    if (role !== "faculty") {
      return res.status(403).json({
        success: false,
        message: "Only faculty members can create assignments.",
      });
    }

    if (!facultyId) {
      return res.status(401).json({
        success: false,
        message: "Faculty ID not found in login token.",
      });
    }

    if (req.file) {
      uploadedFilePath = req.file.filename;
    }

    const {
      title,
      description,
      subject,
      department,
      semester,
      due_date,
      total_marks,
      status,
    } = req.body;

    if (
      !title?.trim() ||
      !subject?.trim() ||
      !department?.trim() ||
      !semester ||
      !due_date
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, subject, department, semester, and due date are required.",
      });
    }

    const semesterNumber = Number(semester);
    const marks = Number(total_marks ?? 100);

    if (
      !Number.isInteger(semesterNumber) ||
      semesterNumber < 1 ||
      semesterNumber > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 8.",
      });
    }

    if (!Number.isInteger(marks) || marks < 1) {
      return res.status(400).json({
        success: false,
        message: "Total marks must be a positive whole number.",
      });
    }

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be draft or published.",
      });
    }

    const assignmentId = await createAssignment({
      title: title.trim(),
      description: description || "",
      subject: subject.trim(),
      department: department.trim(),
      semester: semesterNumber,
      due_date,
      total_marks: marks,
      faculty_id: facultyId,
      status,
      attachment_path: uploadedFilePath,
      attachment_name: req.file?.originalname || null,
    });

    return res.status(201).json({
      success: true,
      message:
        status === "published"
          ? "Assignment published successfully."
          : "Assignment saved as draft.",
      assignmentId,
    });
  } catch (error) {
    console.error("Create assignment error:", error);

    // Remove an uploaded file if saving the assignment failed.
    if (uploadedFilePath) {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        uploadedFilePath
      );

      fs.unlink(filePath, () => {});
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create assignment.",
    });
  }
};

// GET ASSIGNMENTS CREATED BY LOGGED-IN FACULTY
const getMyAssignments = async (req, res) => {
  try {
    if (req.user?.role !== "faculty") {
      return res.status(403).json({
        success: false,
        message: "Only faculty members can access this list.",
      });
    }

    const facultyId = req.user?.id ?? req.user?.userId;

    if (!facultyId) {
      return res.status(401).json({
        success: false,
        message: "Faculty ID not found in login token.",
      });
    }

    const assignments = await getFacultyAssignments(facultyId);

    return res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Get faculty assignments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments.",
    });
  }
};

// GET PUBLISHED ASSIGNMENTS FOR LOGGED-IN STUDENT
const getStudentAssignments = async (req, res) => {
  try {
    if (req.user?.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can access this list.",
      });
    }

    const department = req.user?.department;
    const semester = normalizeSemesterValue(req.user?.semester);

    if (
      !department ||
      !Number.isInteger(semester) ||
      semester < 1 ||
      semester > 8
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Department or semester is missing from your profile.",
      });
    }

    const assignments = await getPublishedAssignments(
      department,
      semester
    );

    return res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error("Get student assignments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments.",
    });
  }
};

const updateAssignment = async (req, res) => {
  try {
    if (req.user?.role !== "faculty") {
      return res.status(403).json({
        success: false,
        message: "Only faculty members can update assignments.",
      });
    }

    const assignmentId = Number(req.params.id);
    const facultyId = req.user?.id ?? req.user?.userId;

    if (!assignmentId || !facultyId) {
      return res.status(400).json({
        success: false,
        message: "Assignment ID and faculty ID are required.",
      });
    }

    const {
      title,
      description,
      subject,
      department,
      semester,
      due_date,
      total_marks,
      status,
    } = req.body;

    const updatedData = {};

    if (title !== undefined) updatedData.title = String(title).trim();
    if (description !== undefined) updatedData.description = String(description).trim();
    if (subject !== undefined) updatedData.subject = String(subject).trim();
    if (department !== undefined) updatedData.department = String(department).trim();
    if (semester !== undefined) updatedData.semester = Number(semester);
    if (due_date !== undefined) updatedData.due_date = due_date;
    if (total_marks !== undefined) updatedData.total_marks = Number(total_marks);
    if (status !== undefined) updatedData.status = status;

    if (updatedData.semester && (!Number.isInteger(updatedData.semester) || updatedData.semester < 1 || updatedData.semester > 8)) {
      return res.status(400).json({
        success: false,
        message: "Semester must be between 1 and 8.",
      });
    }

    if (updatedData.total_marks !== undefined && (!Number.isInteger(updatedData.total_marks) || updatedData.total_marks < 1)) {
      return res.status(400).json({
        success: false,
        message: "Total marks must be a positive whole number.",
      });
    }

    if (updatedData.status && !["draft", "published"].includes(updatedData.status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be draft or published.",
      });
    }

    const success = await updateAssignmentById(assignmentId, facultyId, updatedData);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found or you do not have permission to update it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assignment updated successfully.",
    });
  } catch (error) {
    console.error("Update assignment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update assignment.",
    });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    if (req.user?.role !== "faculty") {
      return res.status(403).json({
        success: false,
        message: "Only faculty members can delete assignments.",
      });
    }

    const assignmentId = Number(req.params.id);
    const facultyId = req.user?.id ?? req.user?.userId;

    if (!assignmentId || !facultyId) {
      return res.status(400).json({
        success: false,
        message: "Assignment ID and faculty ID are required.",
      });
    }

    const success = await deleteAssignmentById(assignmentId, facultyId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found or you do not have permission to delete it.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete assignment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete assignment.",
    });
  }
};

module.exports = {
  addAssignment,
  getMyAssignments,
  getStudentAssignments,
  updateAssignment,
  deleteAssignment,
};