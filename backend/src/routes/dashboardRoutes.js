const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/stats', authenticateUser, getDashboardStats);

module.exports = router;
