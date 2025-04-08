const mongoose = require('mongoose');

const FraudDetectionSchema = new mongoose.Schema({
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProofSubmission',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flagType: {
    type: String,
    enum: ['duplicate-image', 'timestamp-manipulation', 'location-mismatch', 'other'],
    required: true
  },
  similarSubmissions: [{
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProofSubmission'
    },
    similarityScore: {
      type: Number,
      min: 0,
      max: 1
    }
  }],
  details: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'confirmed', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  actionTaken: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('FraudDetection', FraudDetectionSchema);