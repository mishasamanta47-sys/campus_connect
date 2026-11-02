const { verifyToken } = require("../middleware/authMiddleware");
const express = require("express");

const {
  getEvents,
  getEvent,
  addEvent,
  removeEvent,
} = require("../controllers/eventController");

const db = require("../config/db");

const router = express.Router();

// =====================================================
// TEST ROUTE
// =====================================================
router.get("/test", (req, res) => {
  console.log("Event routes test endpoint hit");

  res.json({
    success: true,
    message: "Event routes are working!",
  });
});

// =====================================================
// GET ALL EVENTS
// =====================================================
router.get("/", getEvents);

// =====================================================
// REGISTER FOR EVENT
// =====================================================
router.post("/register", async (req, res) => {
  try {
    const {
      event_id,
      event_title,
      student_id,
      student_name,
      student_email,
    } = req.body;

    console.log("Received registration data:", req.body);

    // Check required fields
    if (
      !event_id ||
      !event_title ||
      !student_id ||
      !student_name ||
      !student_email
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check whether the event actually exists
    const [event] = await db.query(
      `SELECT id, title, event_date, event_time, location, organizer
       FROM events
       WHERE id = ?`,
      [event_id]
    );

    if (event.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if student already registered
    const [existing] = await db.query(
      `SELECT id
       FROM event_registrations
       WHERE event_id = ? AND student_id = ?`,
      [event_id, student_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // Insert registration
    const [result] = await db.query(
      `INSERT INTO event_registrations
       (
         event_id,
         event_title,
         student_id,
         student_name,
         student_email
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        event_id,
        event_title,
        student_id,
        student_name,
        student_email,
      ]
    );

    console.log("Event registration successful:", result.insertId);

    res.status(201).json({
      success: true,
      message: "Event registration successful!",
      registrationId: result.insertId,
    });

  } catch (error) {
    console.error("Event registration error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET REGISTERED EVENTS FOR A STUDENT
// =====================================================
router.get("/registered/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    console.log("Fetching registered events for student:", studentId);

    const [registrations] = await db.query(
      `SELECT
        er.id,
        er.event_id,
        er.event_title,
        er.student_id,
        er.student_name,
        er.student_email,
        er.registered_at,
        e.event_date,
        e.event_time,
        e.location,
        e.organizer
       FROM event_registrations er
       LEFT JOIN events e
         ON er.event_id = e.id
       WHERE er.student_id = ?
       ORDER BY er.registered_at DESC`,
      [studentId]
    );

    console.log("Registered events:", registrations);

    res.status(200).json({
      success: true,
      registrations,
    });

  } catch (error) {
    console.error("Get registered events error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET SINGLE EVENT
// =====================================================
router.get("/:id", getEvent);

// =====================================================
// CREATE EVENT
// =====================================================
router.post("/", verifyToken, addEvent);


// =====================================================
// DELETE EVENT
// =====================================================
router.delete("/:id", verifyToken, removeEvent);

// =====================================================
// EXPORT ROUTER
// =====================================================
module.exports = router;