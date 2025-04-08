import React from 'react';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';
import LoginForm from './LoginForm';

export default function LandingPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Shree Pratap Poultry Farm
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Comprehensive Poultry Management Solutions
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom>For Farmers</Typography>
            <Typography paragraph>
              Track chick mortality rates, submit daily proofs, and manage your
              poultry operations efficiently.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom>For Administrators</Typography>
            <Typography paragraph>
              Monitor business metrics, manage invoices, and oversee farm
              operations through our comprehensive dashboard.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" gutterBottom>Get Started</Typography>
        <LoginForm />
      </Box>
    </Container>
  );
}