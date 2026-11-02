const db = require("../config/db");

// Get Profile
exports.getProfile = (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT
      id,
      full_name,
      email,
      phone,
      department,
      semester,
      skills,
      profile_photo,
      role
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        ...result[0],
        profilePhoto: result[0].profile_photo || null,
      },
    });
  });
};

// Update Profile
exports.updateProfile = (req, res) => {
  const userId = req.params.id;

  const {
    full_name,
    phone,
    department,
    semester,
    skills,
  } = req.body;

  let sql = `
    UPDATE users
    SET
      full_name = ?,
      phone = ?,
      department = ?,
      semester = ?,
      skills = ?
  `;

  const values = [
    full_name,
    phone,
    department,
    semester,
    skills || null,
  ];

  if (req.file) {
    sql += ", profile_photo = ?";
    values.push(`/uploads/${req.file.filename}`);
  }

  sql += " WHERE id = ?";
  values.push(userId);

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Update Failed",
        error: err,
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