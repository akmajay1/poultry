const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Placeholder for future proof-related routes that are different from proof submissions
router.get('/', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Proofs route placeholder',
    info: 'This route will be implemented in future versions'
  });
});

module.exports = router; 