const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getProfile, updateProfile } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, updateProfile);

module.exports = router;
