const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  register,
  login,
} = require("../controllers/authController");

// Register Route
router.post("/register", upload.single("profileImage"), register);

// Login Route
router.post("/login", login);

module.exports = router;