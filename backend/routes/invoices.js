const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Placeholder for future invoice-related routes
router.get('/', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Invoices route placeholder',
    info: 'This route will be implemented in future versions'
  });
});

module.exports = router; 