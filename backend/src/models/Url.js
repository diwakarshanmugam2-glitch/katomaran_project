const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  customAlias: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  totalClicks: {
    type: Number,
    default: 0,
  },
  lastVisited: {
    type: Date,
    default: null,
  },
  isPublicStats: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Url', UrlSchema);
