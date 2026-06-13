const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  browser: {
    type: String,
    default: 'Unknown',
  },
  device: {
    type: String,
    default: 'Unknown',
  },
  country: {
    type: String,
    default: 'Unknown',
  },
  city: {
    type: String,
    default: 'Unknown',
  },
});

module.exports = mongoose.model('Visit', VisitSchema);
