const express = require("express");

const router = express.Router();
console.log(" NOTIFICATION ROUTES LOADED");

const {
  getNotifications,
  getUnreadNotificationsCount,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");

// Mark all notifications as read
router.put("/read-all", markAllAsRead);

// Mark one notification as read
router.put("/:id/read", markAsRead);

// Get unread notification count
router.get("/:studentId/unread", getUnreadNotificationsCount);

// Get all notifications for a student
router.get("/:studentId", getNotifications);
// Get all notifications for a student
router.get("/:studentId", getNotifications);

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Notification routes are working!"
  });
});


module.exports = router;