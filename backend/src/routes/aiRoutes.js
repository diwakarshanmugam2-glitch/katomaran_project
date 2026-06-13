const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/ai/chat
// @desc    Interact with the AI assistant
// @access  Private
router.post('/chat', auth, aiController.chat);

module.exports = router;
