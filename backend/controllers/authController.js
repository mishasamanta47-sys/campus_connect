const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Register
const register = async (req, res) => {
  try {
    const { fullName, email, phone, department, semester, password } = req.body;

    if (!fullName || !email || !phone || !department || !semester || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    userModel.findUserByEmail(email, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        fullName,
        email,
        phone,
        department,
        semester,
        password: hashedPassword,
      };

      userModel.createUser(newUser, (err) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.status(201).json({
          message: "Registration Successful",
        });
      });
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login
const login = (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, async (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        department: user.department,
        semester: user.semester,
        role: user.role
      },
    });
  });
};

module.exports = {
  register,
  login,
};