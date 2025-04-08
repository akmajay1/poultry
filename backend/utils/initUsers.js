const mongoose = require('mongoose');
const User = require('../models/User');

const initializeDefaultUsers = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ username: 'akhilesh' });
    if (!adminExists) {
      await User.create({
        username: 'akhilesh',
        password: 'Pratap2425,',
        role: 'admin',
        name: 'Akhilesh Admin',
        contactNumber: '+91-XXXXXXXXXX' // Replace with actual number
      });
      console.log('Admin user created successfully');
    }

    // Check if test customer exists
    const customerExists = await User.findOne({ username: 'my lifeline' });
    if (!customerExists) {
      await User.create({
        username: 'my lifeline',
        password: 'customer123', // Default password for test customer
        role: 'customer',
        name: 'Test Customer',
        farmLocation: 'Test Farm Location',
        contactNumber: '+91-XXXXXXXXXX' // Replace with actual number
      });
      console.log('Test customer created successfully');
    }
  } catch (error) {
    console.error('Error initializing default users:', error);
  }
};

module.exports = initializeDefaultUsers;