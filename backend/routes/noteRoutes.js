const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getNotes,
  getNotesBySubjectController,
  getNote,
  createNoteController,
  updateNoteController,
  deleteNoteController,
} = require("../controllers/noteController");

const {
  verifyToken,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// MULTER CONFIGURATION
// ===============================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/notes");
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1E9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },

});


// Only PDF files
const fileFilter = (req, file, cb) => {

  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF files are allowed."),
      false
    );
  }

};


const upload = multer({
  storage,
  fileFilter,
});


// ===============================
// GET ALL NOTES
// ===============================

router.get(
  "/",
  verifyToken,
  getNotes
);


// ===============================
// GET NOTES BY SUBJECT
// ===============================

router.get(
  "/subject/:subject",
  verifyToken,
  getNotesBySubjectController
);


// ===============================
// GET SINGLE NOTE
// ===============================

router.get(
  "/:id",
  verifyToken,
  getNote
);


// ===============================
// UPLOAD NOTE
// FACULTY + ADMIN ONLY
// ===============================

router.post(
  "/",
  verifyToken,
  upload.single("file"),
  createNoteController
);

// ===============================
// UPDATE NOTE
// FACULTY + ADMIN ONLY
// ===============================

router.put(
  "/:id",
  verifyToken,
  upload.single("file"),
  updateNoteController
);

// ===============================
// DELETE NOTE
// FACULTY + ADMIN ONLY
// ===============================

router.delete(
  "/:id",
  verifyToken,
  deleteNoteController
);


module.exports = router;