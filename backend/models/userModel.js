const db = require("../config/db");

// ===============================
// Create a new user
// ===============================
const createUser = (user, callback) => {
  const sql = `
    INSERT INTO users
    (full_name, email, phone, department, semester, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user.fullName,
      user.email,
      user.phone,
      user.department,
      user.semester,
      user.password,
    ],
    callback
  );
};


// ===============================
// Find user by email
// ===============================
const findUserByEmail = (email, callback) => {
  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], callback);
};


// ===============================
// Find user by ID
// ===============================
const findUserById = (id, callback) => {
  const sql = `
    SELECT *
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [id], callback);
};


// ===============================
// Update user profile
// ===============================
const updateUser = (id, user, callback) => {
  const sql = `
    UPDATE users
    SET
      full_name = ?,
      phone = ?,
      department = ?,
      semester = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      user.full_name,
      user.phone,
      user.department,
      user.semester,
      id,
    ],
    callback
  );
};


// ===============================
// Export functions
// ===============================
module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
};