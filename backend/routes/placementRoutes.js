const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getPlacements,
  getStudentPlacements,
  createPlacement,
  deletePlacement,
} = require("../controllers/placementController");

const router = express.Router();

router.get("/", verifyToken, getPlacements);
router.get("/student", verifyToken, getStudentPlacements);
router.post("/", verifyToken, upload.single("file"), createPlacement);
router.delete("/:id", verifyToken, deletePlacement);

module.exports = router;
