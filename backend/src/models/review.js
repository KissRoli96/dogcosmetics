const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    content: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    status: { type: String, enum: ['pending', 'published', 'rejected'], default: 'pending' }, // New status field
  });

module.exports = mongoose.model('Review', ReviewSchema);