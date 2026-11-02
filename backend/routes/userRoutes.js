const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

// Get user profile
router.get("/:id", getUserProfile);

// Update user profile
router.put("/:id", upload.single("profileImage"), updateUserProfile);

module.exports = router;