const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  registerForEvent,
  cancelEventRegistration,
  getMyRegistrations
} = require('../controllers/eventController');
const { authenticateUser, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getEvents);
router.get('/my-registrations', authenticateUser, getMyRegistrations);
router.post('/', authenticateUser, requireRole(['faculty', 'admin']), createEvent);
router.post('/:id/register', authenticateUser, registerForEvent);
router.post('/:id/cancel', authenticateUser, cancelEventRegistration);

module.exports = router;

