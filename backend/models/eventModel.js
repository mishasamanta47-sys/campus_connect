const db = require("../config/db");

// =======================
// GET ALL PUBLISHED EVENTS
// =======================
const getAllEvents = async () => {
  const [rows] = await db.query(
    `SELECT
      id,
      title,
      description,
      event_date,
      event_time,
      location,
      organizer,
      is_published,
      created_at
     FROM events
     WHERE is_published = 1
     ORDER BY event_date ASC`
  );

  return rows;
};

// =======================
// GET SINGLE PUBLISHED EVENT
// =======================
const getEventById = async (id) => {
  const [rows] = await db.query(
    `SELECT
      id,
      title,
      description,
      event_date,
      event_time,
      location,
      organizer,
      is_published,
      created_at
     FROM events
     WHERE id = ? AND is_published = 1`,
    [id]
  );

  return rows[0];
};

// =======================
// ADD EVENT
// =======================
const createEvent = async (
  title,
  description,
  event_date,
  event_time,
  location,
  organizer,
  is_published = 0
) => {
  const [result] = await db.query(
    `INSERT INTO events
      (title, description, event_date, event_time, location, organizer, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      event_date,
      event_time,
      location,
      organizer,
      is_published,
    ]
  );

  return result;
};

// =======================
// DELETE EVENT
// =======================
const deleteEvent = async (id) => {
  const [result] = await db.query(
    `DELETE FROM events WHERE id = ?`,
    [id]
  );

  return result;
};

// =======================
// EXPORT
// =======================
module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
};