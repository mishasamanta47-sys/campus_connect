const jwt = require("jsonwebtoken");
const db = require("../config/db");

const normalizeSemester = (value) => {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number" && Number.isInteger(value)) {
    return value;
  }

  const asString = String(value).trim();
  const match = asString.match(/(\d+)/);

  if (!match) return null;

  const numericValue = Number(match[1]);
  return Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 8 ? numericValue : null;
};

// ===============================
// VERIFY LOGIN TOKEN
// ===============================
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Check whether the user still exists
    const [users] = await db.query(
      `
      SELECT id, full_name, email, phone, department, semester, role, account_status
      FROM users
      WHERE id = ?
      `,
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "User account not found.",
      });
    }

    const user = users[0];
    const normalizedSemester = normalizeSemester(user.semester);

    if (
      (user.role === "faculty" || user.role === "student") &&
      user.account_status === "inactive"
    ) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact the administrator.",
      });
    }

    // Use the current database user details so student profile fields are always up to date.
    req.user = {
      ...decoded,
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      semester: normalizedSemester,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Verify Token Error:", error);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

// ===============================
// ADMIN ONLY
// ===============================
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required.",
    });
  }

  next();
};

// ===============================
// EXPORT
// ===============================
module.exports = {
  verifyToken,
  adminOnly,
};