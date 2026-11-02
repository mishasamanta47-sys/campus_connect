const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const userModel = require("../models/userModel");
const { createNotification } = require("../models/notificationModel");

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

const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      department,
      semester,
      password,
    } = req.body;

    const normalizedSemester = normalizeSemester(semester);

    const profilePhoto = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    if (
      !fullName ||
      !email ||
      !phone ||
      !department ||
      !normalizedSemester ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const existingUsers = await userModel.findUserByEmail(
      email.trim().toLowerCase()
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [departmentRows] = await db.query(
      `SELECT id FROM departments WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) LIMIT 1`,
      [department.trim()]
    );

    const newUser = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      department: department.trim(),
      department_id: departmentRows[0]?.id || null,
      semester: normalizedSemester,
      password: hashedPassword,
      profile_photo: profilePhoto,

      // Public registration can create students only.
      role: "student",
      account_status: "pending",
    };
    await userModel.createUser(newUser);

try {
  await createNotification(
    5,
    "New Student Registration",
    `${newUser.fullName} has registered and is waiting for approval.`,
    "student_registration"
  );
} catch (notificationError) {
  console.error(
    "Failed to create admin notification:",
    notificationError
  );
}

    return res.status(201).json({
      success: true,
      message:
        "Registration submitted successfully. Please wait for admin approval before logging in.",
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const users = await userModel.findUserByEmail(
      email.trim().toLowerCase()
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const user = users[0];

    // Verify the password first
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Block students and faculty who are not active
    if (
      (user.role === "student" || user.role === "faculty") &&
      user.account_status !== "active"
    ) {
      if (user.account_status === "pending") {
        return res.status(403).json({
          success: false,
          message:
            "Your registration is awaiting admin approval. Please try again later.",
        });
      }

      if (user.account_status === "rejected") {
        return res.status(403).json({
          success: false,
          message:
            "Your registration was not approved. Please contact the administrator.",
        });
      }

      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive. Please contact the administrator.",
      });
    }

    // Create JWT only after successful authentication
    const normalizedUserSemester = normalizeSemester(user.semester);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        department: user.department,
        semester: normalizedUserSemester,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        semester: normalizedUserSemester,
        role: user.role,
        profilePhoto: user.profile_photo || null,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// ===============================
// EXPORT
// ===============================
module.exports = {
  register,
  login,
};