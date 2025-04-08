const crypto = require('crypto');
const exif = require('exif-parser');
const ProofSubmission = require('../models/ProofSubmission');
const FraudDetection = require('../models/FraudDetection');

const calculateImageHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

const extractExifData = (buffer) => {
  if (!buffer || buffer.length === 0) {
    throw new Error('Invalid image buffer');
  }

  try {
    const parser = exif.create(buffer);
    const result = parser.parse();
    
    if (!result || !result.tags) {
      throw new Error('Invalid EXIF data structure');
    }
    
    return result;
  } catch (error) {
    console.error('EXIF Parsing Error:', error.message);
    return { 
      error: 'EXIF parsing failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
};

const compareSubmissions = async (submission) => {
  return checkForFraud(submission);
};

const checkForFraud = async (submission) => {
  try {
    // Check perceptual hash matches
    const hashMatches = await ProofSubmission.find({
      'imageHash.perceptual': submission.imageHash.perceptual,
      user: submission.user,
      batchId: submission.batchId,
      _id: { $ne: submission._id }
    });

    // Check EXIF data consistency
    const exifMatches = await ProofSubmission.find({
      'metadata.device': submission.metadata.device,
      'metadata.gps': submission.metadata.gps,
      user: submission.user,
      batchId: submission.batchId,
      _id: { $ne: submission._id }
    });

    // Check timestamp sequence
    const timeSequence = await ProofSubmission.find({
      batchId: submission.batchId,
      'metadata.timestamp': {
        $gt: submission.metadata.timestamp
      }
    }).sort('metadata.timestamp');

    const matches = [];

    if (hashMatches.length > 0) {
      matches.push(...hashMatches.map(match => ({
        type: 'perceptual_hash_match',
        submissionId: match._id
      })));
    }

    // Validate against farm location coordinates
const FARM_COORDINATES = {
  latitude: 18.5204, 
  longitude: 73.8567,
  radius: 0.1 // 10km radius
};

const locationValid = submission.metadata.location && 
  typeof submission.metadata.location.latitude === 'number' && 
  typeof submission.metadata.location.longitude === 'number' && 
  Math.abs(submission.metadata.location.latitude - FARM_COORDINATES.latitude) <= FARM_COORDINATES.radius &&
  Math.abs(submission.metadata.location.longitude - FARM_COORDINATES.longitude) <= FARM_COORDINATES.radius;

if (!locationValid) {
  matches.push({
    type: 'location_mismatch',
    coordinates: submission.metadata.location
  });
}

if (exifMatches.length > 0) {
      matches.push(...exifMatches.map(match => ({
        type: 'metadata_match',
        submissionId: match._id
      })));
    }

    if (timeSequence.length > 0) {
      matches.push({
        type: 'timestamp_anomaly',
        sequence: timeSequence.map(ts => ts._id)
      });
    }

    if (matches.length > 0) {
      const fraudRecord = new FraudDetection({
        userId: submission.user,
        proofSubmission: submission._id,
        matchedSubmissions: matches,
        detectionDate: new Date(),
        status: 'pending review'
      });

      await fraudRecord.save();
      return fraudRecord;
    }

    return null;
  } catch (error) {
    console.error('Fraud check error:', error);
    return null;
  }
};

const calculateHashSimilarity = (hash1, hash2) => {
  const maxLength = Math.max(hash1.length, hash2.length);
  let matches = 0;
  for (let i = 0; i < maxLength; i++) {
    if (hash1[i] === hash2[i]) matches++;
  }
  return matches / maxLength;
};

const calculateExifSimilarity = (exif1, exif2) => {
  let score = 0;
  const totalFields = Object.keys(exif1.tags || {}).length;
  
  for (const [key, value] of Object.entries(exif1.tags || {})) {
    if (exif2.tags?.[key] === value) score += 1;
  }

  return totalFields > 0 ? score / totalFields : 0;
};

const generateDailyReport = async () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 1);

  const fraudCases = await FraudDetection.find({
    detectionDate: { $gte: startDate }
  }).populate('user proofSubmission');

  const reportData = fraudCases.map(fraudCase => ({
    userId: case.user._id,
    submissionId: case.proofSubmission._id,
    detectionType: case.matchedSubmissions.map(m => m.type).join(', '),
    status: case.status
  }));

  return {
    date: new Date().toISOString().split('T')[0],
    totalCases: fraudCases.length,
    cases: reportData
  };
};

module.exports = {
  calculateImageHash,
  extractExifData,
  checkForFraud,
  compareSubmissions,
  generateDailyReport
};