const db = require("../config/db");

// =====================================
// CREATE NOTIFICATION
// =====================================

const createNotification = async (
  studentId,
  title,
  message,
  type = "general"
) => {
  const sql = `
    INSERT INTO notifications
    (
      student_id,
      title,
      message,
      type
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    studentId,
    title,
    message,
    type,
  ]);

  return result;
};


// =====================================
// GET ALL NOTIFICATIONS FOR A STUDENT
// =====================================

const getNotificationsByStudent = async (studentId) => {
  const sql = `
    SELECT *
    FROM notifications
    WHERE student_id = ?
    ORDER BY created_at DESC
  `;

  const [rows] = await db.query(sql, [studentId]);

  console.log(
    "Notifications found:",
    rows
  );

  return rows;
};


// =====================================
// GET UNREAD NOTIFICATION COUNT
// =====================================

const getUnreadCount = async (studentId) => {
  const sql = `
    SELECT COUNT(*) AS unreadCount
    FROM notifications
    WHERE student_id = ?
    AND is_read = FALSE
  `;

  const [rows] = await db.query(sql, [studentId]);

  return rows[0].unreadCount;
};


// =====================================
// MARK ONE NOTIFICATION AS READ
// =====================================

const markNotificationAsRead = async (
  id,
  studentId
) => {
  const sql = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ?
    AND student_id = ?
  `;

  const [result] = await db.query(
    sql,
    [id, studentId]
  );

  return result;
};


// =====================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================

const markAllNotificationsAsRead = async (
  studentId
) => {
  const sql = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE student_id = ?
  `;

  const [result] = await db.query(
    sql,
    [studentId]
  );

  return result;
};


// =====================================
// EXPORT
// =====================================

module.exports = {
  createNotification,
  getNotificationsByStudent,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};