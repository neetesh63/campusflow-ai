const express = require('express');
const router = express.Router();
const { getNotices, createNotice, deleteNotice } = require('../controllers/noticeController');
const { authenticateUser, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getNotices);
router.post('/', authenticateUser, requireRole(['faculty', 'admin']), createNotice);
router.delete('/:id', authenticateUser, requireRole(['admin']), deleteNotice);

module.exports = router;
