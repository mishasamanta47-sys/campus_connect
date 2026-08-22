const express = require("express");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

// Get user profile
router.get("/:id", getUserProfile);

// Update user profile
router.put("/:id", updateUserProfile);

module.exports = router;