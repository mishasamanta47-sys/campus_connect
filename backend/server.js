require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

// Database Connection
const db = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const subjectRoutes= require("./routes/subjectRoutes");
const academicRoutes = require("./routes/academicRoutes");
const adminRoutes = require("./routes/adminRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const placementRoutes = require("./routes/placementRoutes");
const app = express();

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

const allowedOrigins = [
  "https://campus-connect-xpr3.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

// =======================
// Middleware
// =======================
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

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
console.log("Event routes file loaded");
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/academic", academicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/placements", placementRoutes);

// =======================
// Home Route
// =======================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 EduNexus Backend is Running Successfully",
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