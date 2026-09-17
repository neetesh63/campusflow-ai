const express = require('express');
const router = express.Router();
const { getAttendanceRecords, markAttendance } = require('../controllers/attendanceController');
const { authenticateUser, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getAttendanceRecords);
router.post('/mark', authenticateUser, requireRole(['faculty', 'admin']), markAttendance);

module.exports = router;
