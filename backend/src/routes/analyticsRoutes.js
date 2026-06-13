const express = require('express');
const router = express.Router();
const { optionalProtect } = require('../middleware/auth');
const { getUrlAnalytics } = require('../controllers/analyticsController');

router.get('/:id', optionalProtect, getUrlAnalytics);

module.exports = router;
