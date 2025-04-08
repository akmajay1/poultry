import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Card,
  CardMedia,
  FormHelperText
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ProofSubmissionForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
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
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
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
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        formPayload.append('latitude', position.coords.latitude);
        formPayload.append('longitude', position.coords.longitude);
      } catch (geoError) {
        setError('Location access is required. Please enable location services and try again.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.post(`${API_URL}/api/proof`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
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
      setImagePreview(null);
      
      // After 3 seconds, redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Error submitting proof:', err);
      if (err.response?.status === 401) {
        // Unauthorized - redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
      } else {
        setError(err.response?.data?.message || 'Failed to submit proof. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center">
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
            <FormHelperText>
              {t('imageRequirements')} (JPEG or PNG, max 5MB)
            </FormHelperText>
          </Grid>
          
          {imagePreview && (
            <Grid item xs={12}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={imagePreview}
                  alt="Proof image preview"
                  sx={{ objectFit: 'contain' }}
                />
              </Card>
            </Grid>
          )}
          
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
          
          <Grid item xs={12}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/dashboard')}
              sx={{ mt: 1 }}
            >
              {t('cancel')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}