const {
  getNotificationsByStudent,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../models/notificationModel");

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const { studentId } = req.params;

    const notifications = await getNotificationsByStudent(studentId);

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// Get unread notification count
const getUnreadNotificationsCount = async (req, res) => {
  try {
    const { studentId } = req.params;

    const unreadCount = await getUnreadCount(studentId);

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    console.error("Get unread count error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get unread notification count",
      error: error.message,
    });
  }
};

// Mark one notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    const result = await markNotificationAsRead(id, studentId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const { studentId } = req.body;

    await markAllNotificationsAsRead(studentId);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  getUnreadNotificationsCount,
  markAsRead,
  markAllAsRead,
};