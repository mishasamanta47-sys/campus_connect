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
      user: result[0],
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

  db.query(
    sql,
    [
      full_name,
      phone,
      department,
      semester,
      skills,
      userId,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Update Failed",
          error: err,
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
      });
    }
  );
};