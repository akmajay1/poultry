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
  Box
} from '@mui/material';
import { Menu as MenuIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API base URL - use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Mock data for demo mode
const MOCK_DATA = {
  totalBatches: 24,
  activeBatches: 12,
  totalChicks: 5600,
  mortalityRate: 3.2
};

const Dashboard = ({ isDemo = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    totalChicks: 0,
    mortalityRate: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      // If demo mode is enabled, use mock data
      if (isDemo || window.location.hostname.includes('vercel.app')) {
        console.log('Demo mode: Using mock data');
        setStats(MOCK_DATA);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data on error
        setStats(MOCK_DATA);
      }
    };

    fetchDashboardData();
  }, [isDemo]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
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
                    <Button variant="contained" color="primary">
                      {t('submit_proof')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={() => navigate('/fraud-reports')}
                    >
                      {t('view_reports')}
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {isDemo && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 2, bgcolor: '#fff9c4' }}>
                <Typography variant="h6" color="primary">
                  Demo Mode Active
                </Typography>
                <Typography paragraph>
                  This is a demonstration with mock data. In a production environment, this dashboard would display real-time 
                  data from your poultry farm operations.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
