const express = require('express');
const router = express.Router();
const { getComplaints, createComplaint, updateComplaintStatus, reopenComplaint } = require('../controllers/complaintController');
const { authenticateUser, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getComplaints);
router.post('/', authenticateUser, requireRole(['student', 'admin']), createComplaint);
router.put('/:id/status', authenticateUser, requireRole(['faculty', 'admin']), updateComplaintStatus);
router.patch('/:id/reopen', authenticateUser, requireRole(['student', 'admin']), reopenComplaint);

module.exports = router;

