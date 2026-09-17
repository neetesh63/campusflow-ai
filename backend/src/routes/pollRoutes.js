const express = require('express');
const router = express.Router();
const { getPolls, createPoll, votePoll } = require('../controllers/pollController');
const { authenticateUser, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getPolls);
router.post('/', authenticateUser, requireRole(['faculty', 'admin']), createPoll);
router.post('/:id/vote', authenticateUser, votePoll);

module.exports = router;
