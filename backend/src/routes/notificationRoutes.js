const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
} = require('../controllers/notificationController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getNotifications);
router.patch('/read-all', authenticateUser, markAllAsRead);
router.patch('/:id/read', authenticateUser, markAsRead);
router.post('/', authenticateUser, createNotification);

module.exports = router;
