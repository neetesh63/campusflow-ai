const express = require('express');
const router = express.Router();
const { handleAITest, handleAIChat, handleAIStudyPlan, handleMatchLostFound } = require('../controllers/aiController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Public test endpoint for Gemini API verification: GET /api/ai/test
router.get('/test', handleAITest);

// Authenticated AI endpoints
router.post('/chat', authenticateUser, handleAIChat);
router.post('/study-plan', authenticateUser, handleAIStudyPlan);
router.post('/match-lost-found', authenticateUser, handleMatchLostFound);

module.exports = router;

