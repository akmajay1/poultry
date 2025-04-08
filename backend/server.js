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
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint for easy verification
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Pratap Poultry Farm API',
    version: '1.0.0',
    status: 'running',
    endpoints: ['/api/auth', '/api/proof', '/api/proofs', '/api/invoices', '/api/business']
  });
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

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Print connection string (without password) for debugging
    const dbConnString = process.env.MONGODB_URI;
    const redactedConnString = dbConnString ? 
      dbConnString.replace(/:([^:@]+)@/, ':****@') : 
      'No connection string found';
    
    console.log(`Attempting MongoDB connection to: ${redactedConnString}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Initialize default users
    try {
      await initializeDefaultUsers();
      console.log('Default users initialized');
    } catch (err) {
      console.error('Error initializing default users:', err);
    }
    
    // Initialize fraud detection system
    try {
      require('./utils/reportScheduler')();
      console.log('Report scheduler initialized');
    } catch (err) {
      console.error('Error initializing report scheduler:', err);
    }
    
    // Create default admin user if it doesn't exist
    try {
      require('./utils/createDefaultUsers')();
      console.log('Default admin user checked/created');
    } catch (err) {
      console.error('Error creating default users:', err);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Don't exit the process in production, retry instead
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      console.log('Will retry connection in 5 seconds...');
      setTimeout(connectDB, 5000);
    }
  }
};

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Connect to MongoDB after server starts
  connectDB();
});

module.exports = app; // For testing purposes