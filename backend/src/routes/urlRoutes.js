const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const {
  createUrl,
  getUrls,
  updateUrl,
  deleteUrl,
  bulkShorten,
} = require('../controllers/urlController');

// Multer memory storage configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // limit to 5MB
});

router.route('/')
  .post(protect, createUrl)
  .get(protect, getUrls);

router.route('/:id')
  .put(protect, updateUrl)
  .delete(protect, deleteUrl);

router.post('/bulk', protect, upload.single('file'), bulkShorten);

module.exports = router;
