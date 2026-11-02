const fs = require("fs");
const path = require("path");
const db = require("../config/db");
const userModel = require("../models/userModel");

const {
  createNotification,
} = require("../models/notificationModel");

const {
  getAllNotes,
  getNotesBySubject,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("../models/noteModel");


// ======================================================
// GET ALL NOTES
// ======================================================

const getNotes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    // Faculty and Admin can see all notes
    if (
      req.user.role === "faculty" ||
      req.user.role === "admin"
    ) {
      const results = await getAllNotes();

      return res.status(200).json({
        success: true,
        message: "Notes fetched successfully",
        notes: results,
      });
    }

    // Student
    const users = await userModel.findUserById(req.user.id);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    const student = users[0];

    const semester = student.semester;
    const department = student.department;

    if (!semester) {
      return res.status(400).json({
        success: false,
        message: "Student semester not found.",
      });
    }

    // Students only see notes for
    // their own department and semester
    const results = await getAllNotes(
      semester,
      department
    );

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes: results,
    });

  } catch (error) {
    console.error(
      "Error fetching notes:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};


// ======================================================
// GET NOTES BY SUBJECT
// ======================================================

const getNotesBySubjectController = async (
  req,
  res
) => {
  try {
    const { subject } = req.params;

    const results =
      await getNotesBySubject(subject);

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes: results,
    });

  } catch (error) {
    console.error(
      "Error fetching notes by subject:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};


// ======================================================
// GET SINGLE NOTE
// ======================================================

const getNote = async (req, res) => {
  try {
    const { id } = req.params;

    const results =
      await getNoteById(id);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      note: results[0],
    });

  } catch (error) {
    console.error(
      "Error fetching note:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch note",
      error: error.message,
    });
  }
};


// ======================================================
// CREATE / UPLOAD NOTE
// ======================================================

const createNoteController = async (
  req,
  res
) => {
  try {

    // --------------------------------------------------
    // CHECK ROLE
    // --------------------------------------------------

    if (
      !req.user ||
      !["faculty", "admin"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Faculty or admin access required.",
      });
    }


    // --------------------------------------------------
    // GET FORM DATA
    // --------------------------------------------------

    const {
      title,
      subject,
      semester,
      description,
    } = req.body;


    // --------------------------------------------------
    // GET LOGGED-IN USER
    // --------------------------------------------------

    const users =
      await userModel.findUserById(
        req.user.id
      );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = users[0];


    // --------------------------------------------------
    // FACULTY INFORMATION
    // --------------------------------------------------

    const department =
      user.department;

    const uploadedBy =
      user.id;

    const uploadedByName =
      user.full_name;


    // --------------------------------------------------
    // VALIDATE FORM
    // --------------------------------------------------

    if (
      !title ||
      !subject ||
      !semester ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all note fields.",
      });
    }


    // --------------------------------------------------
    // CHECK PDF FILE
    // --------------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a PDF file.",
      });
    }


    // --------------------------------------------------
    // FILE URL
    // --------------------------------------------------

    const file_url =
      `/uploads/notes/${req.file.filename}`;


    // --------------------------------------------------
    // SAVE NOTE IN DATABASE
    // --------------------------------------------------

    const result =
      await createNote({
        title,
        subject,
        semester,
        description,
        file_url,

        // Faculty information
        department,
        uploaded_by: uploadedBy,
        uploaded_by_name: uploadedByName,
      });


    // --------------------------------------------------
    // FIND MATCHING STUDENTS
    // --------------------------------------------------

    const [students] =
      await db.query(
        `
        SELECT id
        FROM users
        WHERE role = 'student'
          AND department = ?
          AND semester = ?
        `,
        [
          department,
          semester,
        ]
      );


    // --------------------------------------------------
    // SEND NOTIFICATION
    // --------------------------------------------------

    for (const student of students) {

      await createNotification(
        student.id,

        "New Notes Uploaded",

        `${uploadedByName} uploaded ${subject} notes.`,

        "notes"
      );
    }


    // --------------------------------------------------
    // SUCCESS RESPONSE
    // --------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Note uploaded successfully.",

      noteId:
        result.insertId,

      file_url,

      uploaded_by:
        uploadedBy,

      uploaded_by_name:
        uploadedByName,
    });

  } catch (error) {

    console.error(
      "Error creating note:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload note.",
      error: error.message,
    });
  }
};


// ======================================================
// UPDATE NOTE
// ======================================================

const updateNoteController = async (req, res) => {
  try {
    if (!req.user || !["faculty", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Faculty or admin access required.",
      });
    }

    const { id } = req.params;
    const existingNoteResult = await getNoteById(id);

    if (existingNoteResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    const existingNote = existingNoteResult[0];
    const { title, subject, semester, description } = req.body;

    if (!title || !subject || !semester || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all note fields.",
      });
    }

    const updatedValues = {
      title,
      subject,
      semester,
      department: req.user.department || existingNote.department,
      description,
    };

    if (req.file) {
      const oldFilePath = existingNote.file_url
        ? path.join(__dirname, "..", existingNote.file_url.replace(/^\/+/, ""))
        : null;

      if (oldFilePath && fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      updatedValues.file_url = `/uploads/notes/${req.file.filename}`;
    }

    const result = await updateNote(id, updatedValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully.",
      note: {
        ...existingNote,
        ...updatedValues,
        file_url: updatedValues.file_url || existingNote.file_url,
      },
    });
  } catch (error) {
    console.error("Error updating note:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update note.",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE NOTE
// ======================================================

const deleteNoteController = async (req, res) => {
  try {
    if (!req.user || !["faculty", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Faculty or admin access required.",
      });
    }

    const { id } = req.params;
    const existingNoteResult = await getNoteById(id);

    if (existingNoteResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    const existingNote = existingNoteResult[0];

    if (existingNote.file_url) {
      const filePath = path.join(__dirname, "..", existingNote.file_url.replace(/^\/+/, ""));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const result = await deleteNote(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting note:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete note.",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
  getNotes,
  getNotesBySubjectController,
  getNote,
  createNoteController,
  updateNoteController,
  deleteNoteController,
};