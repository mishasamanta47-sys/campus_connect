const db = require("../config/db");

// Create a new user
const createUser = async (user) => {
  const role = user.role || "student";
  const accountStatus =
    user.account_status || (role === "student" ? "pending" : "active");

  const sql = `
    INSERT INTO users
    (
      full_name,
      email,
      phone,
      department,
      department_id,
      semester,
      password,
      role,
      account_status,
      profile_photo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    user.fullName,
    user.email,
    user.phone,
    user.department,
    user.department_id || null,
    user.semester,
    user.password,
    role,
    accountStatus,
    user.profile_photo || null,
  ]);

  return result;
};


// ===============================
// Find user by email
// ===============================
const findUserByEmail = async (email) => {
  const sql = `
    SELECT *
    FROM users
    WHERE email = ?
  `;

  const [rows] = await db.query(sql, [email]);

  return rows;
};


// ===============================
// Find user by ID
// ===============================
const findUserById = async (id) => {
  const sql = `
    SELECT *
    FROM users
    WHERE id = ?
  `;

  const [rows] = await db.query(sql, [id]);

  return rows;
};


// ===============================
// Update user profile
// ===============================
const updateUser = async (id, user) => {
  const sql = `
    UPDATE users
    SET
      full_name = ?,
      phone = ?,
      department = ?,
      semester = ?,
      profile_photo = ?
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [
    user.full_name,
    user.phone,
    user.department,
    user.semester,
    user.profile_photo || null,
    id,
  ]);

  return result;
};

// ===============================
// Update user role
// ===============================
const updateRole = async (id, role) => {
  const sql = `
    UPDATE users
    SET role = ?
    WHERE id = ?
  `;

  const [result] = await db.query(sql, [
    role,
    id,
  ]);

  return result;
};


// ===============================
// Export functions
// ===============================
module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  updateRole,
};