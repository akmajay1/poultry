import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import axios from 'axios';

// API base URL - use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Attempting login with:', formData);
    console.log('API URL:', API_URL);
    
    try {
      // For Vercel deployment without backend, just bypass authentication
      if (window.location.hostname.includes('vercel.app')) {
        console.log('Vercel deployment detected - bypassing authentication');
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          username: formData.username || 'demo-user',
          role: 'admin',
          name: 'Demo User'
        }));
        navigate('/dashboard');
        return;
      }
      
      // Real API call for local development
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      console.log('Login response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // For debugging purposes
  const handleTestLogin = () => {
    // Just for testing - navigate directly
    console.log('Test login - bypassing authentication');
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify({
      id: '1',
      username: 'demo-user',
      role: 'admin',
      name: 'Demo User'
    }));
    navigate('/dashboard');
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: '400px', mx: 'auto' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="language-select-label">{t('language')}</InputLabel>
          <Select
            labelId="language-select-label"
            value={i18n.language}
            label={t('language')}
            onChange={handleLanguageChange}
          >
            <MenuItem value="en">{t('english')}</MenuItem>
            <MenuItem value="hi">{t('hindi')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h5" component="h2" gutterBottom>
        {t('login')}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label={t('username')}
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label={t('password')}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : t('submit')}
        </Button>
        
        {/* For development testing only */}
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleTestLogin}
        >
          Test Login (Bypass Auth)
        </Button>
      </form>
    </Paper>
  );
};

export default LoginForm;
