const express = require('express');
const router = express.Router();
const { testSupabaseConnection } = require('../controllers/supabaseController');

// GET /api/supabase/test
router.get('/test', testSupabaseConnection);

module.exports = router;
