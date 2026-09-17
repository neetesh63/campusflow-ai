const express = require('express');
const router = express.Router();
const {
  getPlacementOpportunities,
  getPlacementStats,
  getStudentApplications,
  getUpcomingDrives,
  applyForOpportunity,
  seedPlacementData,
  getPlacementProgress,
  updatePlacementProgress
} = require('../controllers/placementController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public & Authenticated Placement Endpoints
router.get('/', getPlacementOpportunities);
router.get('/opportunities', getPlacementOpportunities);
router.get('/stats', getPlacementStats);
router.get('/applications', authenticateUser, getStudentApplications);
router.get('/drives', getUpcomingDrives);
router.post('/apply', authenticateUser, applyForOpportunity);
router.post('/seed', seedPlacementData);
router.get('/progress', authenticateUser, getPlacementProgress);
router.put('/progress', authenticateUser, updatePlacementProgress);

module.exports = router;
