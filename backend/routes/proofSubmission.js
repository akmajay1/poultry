const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const {
  submitProof,
  getBatchSubmissions,
  getFraudReports
} = require('../controllers/proofSubmissionController');
const {
  calculateImageHash,
  extractExifData,
  compareSubmissions
} = require('../controllers/fraudDetectionController');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Submit proof with image
router.post(
  '/submit',
  authenticateToken,
  upload.single('image'),
  async (req, res, next) => {
    try {
      const imageBuffer = req.file.buffer;
      
      // Generate cryptographic hash
      const imageHash = calculateImageHash(imageBuffer);
      
      // Extract EXIF metadata
      const exifData = extractExifData(imageBuffer);
      
      // Add to request for controller
      req.imageHash = imageHash;
      req.exifData = exifData.error ? null : exifData;
      
      // Process submission
      await submitProof(req, res, next);
      
      // Perform fraud detection check
      const submission = await ProofSubmission.findOne({ imageHash }).sort({ createdAt: -1 });
      if (submission) {
        await compareSubmissions(submission);
      }
    } catch (error) {
      next(error);
    }
  }
);

// Get all submissions for a batch
router.get(
  '/batch/:batchId',
  authenticateToken,
  getBatchSubmissions
);

// Get fraud detection reports (admin only)
router.get(
  '/fraud-reports',
  authenticateToken,
  isAdmin,
  getFraudReports
);

module.exports = router;