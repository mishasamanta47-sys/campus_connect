const {
  getAllNotes,
  getNotesBySubject,
  getNoteById,
} = require("../models/noteModel");

// Get all notes
const getNotes = (req, res) => {
  getAllNotes((err, results) => {
    if (err) {
      console.error("Error fetching notes:", err);

      return res.status(500).json({
        message: "Failed to fetch notes",
      });
    }

    res.status(200).json({
      message: "Notes fetched successfully",
      notes: results,
    });
  });
};


// Get notes by subject
const getNotesBySubjectController = (req, res) => {
  const { subject } = req.params;

  getNotesBySubject(subject, (err, results) => {
    if (err) {
      console.error("Error fetching notes:", err);

      return res.status(500).json({
        message: "Failed to fetch notes",
      });
    }

    res.status(200).json({
      message: "Notes fetched successfully",
      notes: results,
    });
  });
};


// Get one note by ID
const getNote = (req, res) => {
  const { id } = req.params;

  getNoteById(id, (err, results) => {
    if (err) {
      console.error("Error fetching note:", err);

      return res.status(500).json({
        message: "Failed to fetch note",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note fetched successfully",
      note: results[0],
    });
  });
};


module.exports = {
  getNotes,
  getNotesBySubjectController,
  getNote,
};