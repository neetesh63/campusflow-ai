const { testGeminiAPI, generateCampusAIChat, generateAIStudyPlan, suggestLostFoundMatches } = require('../services/aiService');

/**
 * GET /api/ai/test
 */
async function handleAITest(req, res) {
  try {
    const result = await testGeminiAPI();
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to execute Gemini API test',
      error: error.message
    });
  }
}

/**
 * POST /api/ai/chat
 */
async function handleAIChat(req, res) {
  try {
    const { message, history } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty'
      });
    }

    const aiResult = await generateCampusAIChat(message, history || [], req.user || {});

    return res.json({
      success: true,
      message: 'AI response generated successfully',
      data: {
        userMessage: message,
        aiResponse: aiResult.response,
        source: aiResult.source,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI chat request',
      error: error.message
    });
  }
}

/**
 * POST /api/ai/study-plan
 */
async function handleAIStudyPlan(req, res) {
  try {
    const { subjects, dailyHours, examDate, weakSubjects, preferredTime, preparationLevel } = req.body;

    if (!subjects || !dailyHours) {
      return res.status(400).json({
        success: false,
        message: 'Subjects list and daily available study hours are required'
      });
    }

    const planResult = await generateAIStudyPlan({
      subjects,
      dailyHours,
      examDate,
      weakSubjects,
      preferredTime,
      preparationLevel
    });

    return res.json({
      success: true,
      message: 'AI study plan generated successfully',
      data: {
        plan: planResult.plan,
        source: planResult.source,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI study plan',
      error: error.message
    });
  }
}

/**
 * POST /api/ai/match-lost-found
 */
async function handleMatchLostFound(req, res) {
  try {
    const { lostItems, foundItems } = req.body;
    const matchResult = await suggestLostFoundMatches(lostItems || [], foundItems || []);

    return res.json({
      success: true,
      message: 'AI Lost & Found match suggestions generated',
      data: matchResult
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to process AI Lost & Found matching',
      error: error.message
    });
  }
}

module.exports = {
  handleAITest,
  handleAIChat,
  handleAIStudyPlan,
  handleMatchLostFound
};

