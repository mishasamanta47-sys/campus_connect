require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Database Connection
const db = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();



// =======================
// Middleware
// =======================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =======================
// Connect Database
// =======================
db;

// =======================
// API Routes
// =======================
app.use("/api", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/users", userRoutes);

// =======================
// Home Route
// =======================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 CampusConnect Backend is Running Successfully",
  });
});

// =======================
// 404 Route
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("====================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log("====================================");
});