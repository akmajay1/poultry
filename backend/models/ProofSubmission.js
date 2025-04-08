const mongoose = require('mongoose');

const ProofSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageHash: {
    type: String,
    required: true
  },
  metadata: {
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: {
      latitude: {
        type: Number
      },
      longitude: {
        type: Number
      }
    },
    deviceInfo: {
      type: String
    }
  },
  chicksCount: {
    total: {
      type: Number,
      required: true
    },
    deceased: {
      type: Number,
      required: true
    }
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'flagged', 'rejected'],
    default: 'pending'
  },
  flaggedReason: {
    type: String
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('ProofSubmission', ProofSubmissionSchema);