require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const proofSubmissionRoutes = require('./routes/proofSubmission');

// Import initialization script
const initializeDefaultUsers = require('./utils/initUsers');
const proofRoutes = require('./routes/proofs');
const invoiceRoutes = require('./routes/invoices');
const businessRoutes = require('./routes/business');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/proof', proofSubmissionRoutes);

// Health check route
app.get('/api/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
app.use('/api/proofs', proofRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/business', businessRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  // Initialize default users
  await initializeDefaultUsers();
  // Initialize fraud detection system
  require('./utils/reportScheduler')();
  // Create default admin user if it doesn't exist
  require('./utils/createDefaultUsers')();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes