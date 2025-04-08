import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  CircularProgress
} from '@mui/material';
import { Menu as MenuIcon, ExitToApp as LogoutIcon, AddAPhoto as AddPhotoIcon, Assessment as ReportIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API base URL - use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    totalChicks: 0,
    mortalityRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        
        const response = await axios.get(`${API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
        
        // If unauthorized (401), redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSubmitProof = () => {
    navigate('/submit-proof');
  };
  
  const handleViewReports = () => {
    navigate('/fraud-reports');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('dashboard')}
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            {t('logout')}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Stats Overview */}
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {t('total_batches')}
                </Typography>
                <Typography variant="h4">{stats.totalBatches}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {t('active_batches')}
                </Typography>
                <Typography variant="h4">{stats.activeBatches}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {t('total_chicks')}
                </Typography>
                <Typography variant="h4">{stats.totalChicks}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  {t('mortality_rate')}
                </Typography>
                <Typography variant="h4">{stats.mortalityRate}%</Typography>
              </Paper>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('quick_actions')}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={handleSubmitProof}
                        startIcon={<AddPhotoIcon />}
                      >
                        {t('submit_proof')}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={handleViewReports}
                        startIcon={<ReportIcon />}
                      >
                        {t('view_reports')}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
