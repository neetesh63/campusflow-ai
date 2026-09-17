const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../controllers/analyticsController');
const { authenticateUser, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, requireRole(['admin', 'faculty']), getAnalyticsData);

module.exports = router;
