const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  batchNumber: {
    type: String,
    required: true,
    unique: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedEndDate: {
    type: Date
  },
  chicksCount: {
    type: Number,
    required: true
  },
  chicksType: {
    type: String,
    required: true
  },
  assignedTo: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    count: {
      type: Number,
      required: true
    },
    assignedDate: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  notes: {
    type: String
  },
  mortalityRate: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Batch', BatchSchema);