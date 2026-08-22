const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

// ===============================
// Get User Profile
// ===============================
const getUserProfile = (req, res) => {
  const userId = req.params.id;

  userModel.findUserById(userId, (err, results) => {
    if (err) {
      console.error("Database Error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = results[0];

    // Never send password to frontend
    delete user.password;

    res.json({
      success: true,
      user,
    });
  });
};


// ===============================
// Update User Profile
// ===============================
const updateUserProfile = (req, res) => {
  const userId = req.params.id;

  const {
    fullName,
    phone,
    department,
    semester,
    skills,
  } = req.body;

  const sql = `
    UPDATE users
    SET
      full_name = ?,
      phone = ?,
      department = ?,
      semester = ?,
      skills = ?
    WHERE id = ?
  `;

  const db = require("../config/db");

  db.query(
    sql,
    [
      fullName,
      phone,
      department,
      semester,
      skills,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.error("Update Error:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to update profile",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
      });
    }
  );
};


// ===============================
// Export
// ===============================
module.exports = {
  getUserProfile,
  updateUserProfile,
};