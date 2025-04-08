const mongoose = require('mongoose');

const BusinessDealSchema = new mongoose.Schema({
  dealNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dealType: {
    type: String,
    enum: ['chick-supply', 'feed-supply', 'medicine-supply', 'buyback', 'other'],
    required: true
  },
  dealDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  completionDate: {
    type: Date
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch'
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentTerms: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'cancelled'],
    default: 'pending'
  },
  payments: [{
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    method: {
      type: String
    },
    reference: {
      type: String
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Generate deal number automatically
BusinessDealSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const latestDeal = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let nextNumber = 1;
    
    if (latestDeal && latestDeal.dealNumber) {
      const lastNumber = parseInt(latestDeal.dealNumber.split('-')[1]);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
    
    this.dealNumber = `DEAL-${nextNumber.toString().padStart(5, '0')}`;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('BusinessDeal', BusinessDealSchema);