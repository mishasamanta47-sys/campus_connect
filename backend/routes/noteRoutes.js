const express = require("express");

const {
  getNotes,
  getNotesBySubjectController,
  getNote,
} = require("../controllers/noteController");

const router = express.Router();

// Get all notes
router.get("/", getNotes);

// Get notes by subject
router.get("/subject/:subject", getNotesBySubjectController);

// Get one note by ID
router.get("/:id", getNote);

module.exports = router;