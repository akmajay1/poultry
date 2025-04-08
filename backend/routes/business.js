const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Placeholder for future business-related routes
router.get('/', function(req, res) {
  res.status(200).json({
    message: 'Business route placeholder',
    info: 'This route will be implemented in future versions'
  });
});

module.exports = router; 