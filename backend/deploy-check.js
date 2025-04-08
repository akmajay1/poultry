#!/usr/bin/env node

// This script checks if all necessary environment variables are set
// Useful for deployment validation

console.log('Starting deployment check...');

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

let missingVars = [];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.error('ERROR: Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`- ${varName}`);
  });
  console.error('Please set these variables in your deployment platform.');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set.');
  
  // Check MongoDB connection string format
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.error('ERROR: Invalid MongoDB connection string format.');
    console.error('It should start with mongodb:// or mongodb+srv://');
    process.exit(1);
  }
  
  console.log('✅ MongoDB connection string format is valid.');
  console.log('Deployment check passed! The application should be ready to run.');
} 