const {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
} = require("../models/eventModel");

// =======================
// GET PUBLISHED EVENTS
// =======================
const getEvents = async (req, res) => {
  try {
    const events = await getAllEvents();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};

// =======================
// GET SINGLE PUBLISHED EVENT
// =======================
const getEvent = async (req, res) => {
  try {
    const event = await getEventById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or not published",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
    });
  }
};

// =======================
// CREATE AND PUBLISH EVENT
// =======================
const addEvent = async (req, res) => {
  try {
    const role = req.user?.role;

    if (!["admin", "faculty", "teacher"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can publish events",
      });
    }

    const {
      title,
      description,
      event_date,
      event_time,
      location,
      organizer,
    } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({
        success: false,
        message: "Title and event date are required",
      });
    }

    const result = await createEvent(
      title,
      description || "",
      event_date,
      event_time || null,
      location || "",
      organizer || "",
      1
    );

    res.status(201).json({
      success: true,
      message: "Event published successfully",
      eventId: result.insertId,
    });
  } catch (error) {
    console.error("Publish event error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to publish event",
    });
  }
};

// =======================
// DELETE EVENT
// =======================
const removeEvent = async (req, res) => {
  try {
    const role = req.user?.role;

    if (!["admin", "faculty", "teacher"].includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can delete events",
      });
    }

    await deleteEvent(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  addEvent,
  removeEvent,
};