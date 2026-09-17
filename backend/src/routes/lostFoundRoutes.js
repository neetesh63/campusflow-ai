const express = require('express');
const router = express.Router();
const {
  getItems,
  createItem,
  updateItemStatus,
  createContactRequest,
  findMatches
} = require('../controllers/lostFoundController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', authenticateUser, getItems);
router.post('/', authenticateUser, createItem);
router.put('/:id/status', authenticateUser, updateItemStatus);
router.post('/:id/contact', authenticateUser, createContactRequest);
router.post('/match', authenticateUser, findMatches);

module.exports = router;
