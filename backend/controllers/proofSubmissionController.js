const ProofSubmission = require('../models/ProofSubmission');
const FraudDetection = require('../models/FraudDetection');
const crypto = require('crypto');
const ExifParser = require('exif-parser');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Generate perceptual hash using Sharp
const generateImageHash = async (imageBuffer) => {
  if (!imageBuffer || imageBuffer.length === 0) {
    throw new Error('Invalid image buffer');
  }
  try {
    // Resize image to a small square for consistent hashing
    const resizedImage = await sharp(imageBuffer)
      .resize(8, 8, { fit: 'fill' })
      .greyscale()
      .raw()
      .toBuffer();
      
    // Compute average pixel value
    let sum = 0;
    for (let i = 0; i < resizedImage.length; i++) {
      sum += resizedImage[i];
    }
    const avg = sum / resizedImage.length;
    
    // Generate binary hash based on comparison to average
    let hash = '';
    for (let i = 0; i < resizedImage.length; i++) {
      hash += resizedImage[i] >= avg ? '1' : '0';
    }
    
    // Convert binary string to hexadecimal for storage
    const binaryChunks = hash.match(/.{1,4}/g) || [];
    const hexHash = binaryChunks.map(chunk => parseInt(chunk, 2).toString(16)).join('');
    
    return hexHash;
  } catch (error) {
    throw new Error(`Failed to generate perceptual image hash: ${error.message}`);
  }
};

// Helper function for calculating Hamming distance between two hashes
const calculateHashSimilarity = (hash1, hash2) => {
  // Convert hex strings to binary
  const binary1 = hash1.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('');
  const binary2 = hash2.split('').map(h => parseInt(h, 16).toString(2).padStart(4, '0')).join('');
  
  // Calculate Hamming distance (count of different bits)
  let distance = 0;
  for (let i = 0; i < binary1.length; i++) {
    if (binary1[i] !== binary2[i]) distance++;
  }
  
  // Calculate similarity (0 to 1)
  return 1 - (distance / binary1.length);
};

// Extract EXIF data
const extractEXIFData = (imageBuffer) => {
  try {
    const parser = ExifParser.create(imageBuffer);
    return parser.parse();
  } catch (error) {
    return { error: 'EXIF parsing failed' };
  }
};

// Helper function to validate timestamp
const isValidTimestamp = (timestamp) => {
  const submissionTime = new Date(timestamp);
  const now = new Date();
  const timeDiff = Math.abs(now - submissionTime);
  // Allow submissions within last 24 hours only
  return timeDiff <= 24 * 60 * 60 * 1000;
};

// Helper function to check for similar images
const findSimilarSubmissions = async (imageHash, userId, batchId) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  // Find submissions from the last 24 hours for this user and batch
  const recentSubmissions = await ProofSubmission.find({
    user: userId,
    batchId,
    'metadata.timestamp': { $gte: twentyFourHoursAgo }
  });
  
  // Check for similar hashes (similarity threshold of 0.85 or 85%)
  const similarityThreshold = 0.85;
  const similarSubmissions = recentSubmissions.filter(submission => {
    const similarity = calculateHashSimilarity(imageHash, submission.imageHash);
    // Attach similarity score to submission for later use
    submission.similarityScore = similarity;
    return similarity >= similarityThreshold;
  });
  
  return similarSubmissions;
};

// Validate image file
const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG and PNG images are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds limit. Maximum size is 5MB.');
  }
};

// Submit proof with fraud detection
const submitProof = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    validateImageFile(req.file);

    const { batchId, chicksCount, notes } = req.body;
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageHash = await generateImageHash(imageBuffer);
    const exifData = extractEXIFData(imageBuffer);
    
    // Validate required fields
    if (!batchId || !chicksCount || !req.body.timestamp || 
        !req.body.latitude || !req.body.longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate timestamp
    if (!isValidTimestamp(req.body.timestamp)) {
      return res.status(400).json({ message: 'Invalid timestamp' });
    }

    // Validate coordinates
    if (isNaN(req.body.latitude) || isNaN(req.body.longitude) ||
        req.body.latitude < -90 || req.body.latitude > 90 ||
        req.body.longitude < -180 || req.body.longitude > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    // Check for similar submissions
    const similarSubmissions = await findSimilarSubmissions(imageHash, req.user._id, batchId);
    
    // Create proof submission
    const submission = await ProofSubmission.create({
      user: req.user._id,
      batchId,
      imageUrl: req.file.filename,
      imageHash,
      metadata: {
        timestamp: req.body.timestamp,
        location: {
          latitude: req.body.latitude,
          longitude: req.body.longitude
        },
        deviceInfo: req.body.deviceInfo
      },
      chicksCount: {
        total: parseInt(chicksCount.total),
        deceased: parseInt(chicksCount.deceased)
      },
      notes
    });

    // Create fraud detection entry if similar submissions found
    if (similarSubmissions.length > 0) {
      await FraudDetection.create({
        submission: submission._id,
        user: req.user._id,
        flagType: 'duplicate-image',
        similarSubmissions: similarSubmissions.map(sub => ({
          submission: sub._id,
          similarityScore: sub.similarityScore || 1.0
        })),
        details: `Found ${similarSubmissions.length} similar submissions within 24 hours`,
        status: 'pending'
      });

      submission.status = 'flagged';
      await submission.save();
    }

    res.status(201).json({
      message: 'Proof submitted successfully',
      submission,
      isFlagged: similarSubmissions.length > 0
    });
  } catch (error) {
    console.error('Proof submission error:', error);
    res.status(500).json({ message: 'Error submitting proof' });
  }
};

// Get submissions for a batch
const getBatchSubmissions = async (req, res) => {
  try {
    const { batchId } = req.params;
    const submissions = await ProofSubmission.find({ batchId })
      .populate('user', 'username name')
      .sort('-createdAt');

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching batch submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
};

// Get fraud detection reports
const getFraudReports = async (req, res) => {
  try {
    const reports = await FraudDetection.find()
      .populate('submission')
      .populate('user', 'username name')
      .sort('-createdAt');

    res.json(reports);
  } catch (error) {
    console.error('Error fetching fraud reports:', error);
    res.status(500).json({ message: 'Error fetching fraud reports' });
  }
};

module.exports = {
  submitProof,
  getBatchSubmissions,
  getFraudReports
};