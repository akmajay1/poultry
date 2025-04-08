import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    totalChicks: 0,
    mortalityRate: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                  <Button variant="contained" color="secondary">
                    {t('view_reports')}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 