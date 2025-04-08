import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];

export default function ProofSubmissionForm() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    batchId: '',
    totalChicks: '',
    deceasedChicks: '',
    notes: '',
    image: null
  });

  const validateForm = () => {
    if (!formData.batchId.trim()) {
      setError('Batch ID is required');
      return false;
    }
    if (!formData.totalChicks || isNaN(formData.totalChicks)) {
      setError('Total chicks must be a valid number');
      return false;
    }
    if (!formData.deceasedChicks || isNaN(formData.deceasedChicks)) {
      setError('Deceased chicks must be a valid number');
      return false;
    }
    if (!formData.image) {
      setError('Please select an image');
      return false;
    }
    return true;
  };

  const validateImage = (file) => {
    if (!file) return false;
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError('Invalid file type. Only JPEG and PNG images are allowed');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit');
      return false;
    }
    return true;
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (validateImage(file)) {
      setFormData({ ...formData, image: file });
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    try {
      setLoading(true);
      const formPayload = new FormData();
      formPayload.append('batchId', formData.batchId);
      formPayload.append('chicksCount', JSON.stringify({
        total: parseInt(formData.totalChicks),
        deceased: parseInt(formData.deceasedChicks)
      }));
      formPayload.append('notes', formData.notes);
      formPayload.append('image', formData.image);
      formPayload.append('timestamp', new Date().toISOString());

      // Get current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      formPayload.append('latitude', position.coords.latitude);
      formPayload.append('longitude', position.coords.longitude);

      const response = await axios.post('/api/proof-submissions', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess(true);
      setFormData({
        batchId: '',
        totalChicks: '',
        deceasedChicks: '',
        notes: '',
        image: null
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proof');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {t('submitProof')}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{t('proofSubmitted')}</Alert>}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label={t('batchId')}
              value={formData.batchId}
              onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              type="number"
              label={t('totalChicks')}
              value={formData.totalChicks}
              onChange={(e) => setFormData({ ...formData, totalChicks: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              type="number"
              label={t('deceasedChicks')}
              value={formData.deceasedChicks}
              onChange={(e) => setFormData({ ...formData, deceasedChicks: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('notes')}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="proof-image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="proof-image">
              <Button variant="outlined" component="span" fullWidth>
                {formData.image ? t('changeImage') : t('uploadImage')}
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : t('submit')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}