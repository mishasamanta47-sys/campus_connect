const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

// Get Profile
router.get("/:id", getProfile);

// Update Profile
router.put("/:id", updateProfile);

module.exports = router;