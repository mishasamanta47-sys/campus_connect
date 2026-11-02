const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
//hvujvgv
// ===============================
// Get User Profile
// ===============================
const getUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const results = await userModel.findUserById(userId);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = results[0];

    delete user.password;

    return res.json({
      success: true,
      user: {
        ...user,
        profilePhoto: user.profile_photo || null,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);

    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
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

  const db = require("../config/db");
  const values = [
    fullName,
    phone,
    department,
    semester,
    skills || null,
  ];

  let sql = `
    UPDATE users
    SET
      full_name = ?,
      phone = ?,
      department = ?,
      semester = ?,
      skills = ?
  `;

  if (req.file) {
    sql += ", profile_photo = ?";
    values.push(`/uploads/${req.file.filename}`);
  }

  sql += " WHERE id = ?";
  values.push(userId);

  db.query(sql, values, (err, result) => {
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

    const profilePhoto = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.profilePhoto && req.body.profilePhoto !== "remove"
        ? req.body.profilePhoto
        : null;

    res.json({
      success: true,
      message: "Profile updated successfully",
      profilePhoto,
    });
  });
};


// ===============================
// Export
// ===============================
module.exports = {
  getUserProfile,
  updateUserProfile,
};