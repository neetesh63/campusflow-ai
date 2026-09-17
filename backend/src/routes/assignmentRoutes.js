const express = require('express');
const router = express.Router();
const {
  getAssignments,
  createAssignment,
  submitAssignment,
  getPersonalAssignments,
  createPersonalAssignment,
  updatePersonalAssignmentStatus,
  generateAssignmentStudySchedule
} = require('../controllers/assignmentController');
const { authenticateUser, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getAssignments);
router.post('/', authenticateUser, requireRole(['faculty', 'admin']), createAssignment);
router.post('/submit', authenticateUser, requireRole(['student']), submitAssignment);

// Student Personal Planner Routes
router.get('/personal', authenticateUser, getPersonalAssignments);
router.post('/personal', authenticateUser, createPersonalAssignment);
router.put('/personal/:id/status', authenticateUser, updatePersonalAssignmentStatus);
router.post('/schedule-ai', authenticateUser, generateAssignmentStudySchedule);

module.exports = router;

