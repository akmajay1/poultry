import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import { Menu as MenuIcon, ExitToApp as LogoutIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API base URL - use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FraudReports = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }
        
        const response = await axios.get(`${API_URL}/api/proof/fraud-reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching fraud reports:', error);
        setError('Failed to load fraud reports. Please try again.');
        
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

    fetchReports();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            onClick={() => navigate('/dashboard')}
          >
            <BackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('fraud_reports')}
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
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : reports.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">No fraud reports found</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              There are currently no fraud detection reports in the system.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('user')}</TableCell>
                  <TableCell>{t('detection_type')}</TableCell>
                  <TableCell>{t('submission_date')}</TableCell>
                  <TableCell>{t('location_validation')}</TableCell>
                  <TableCell>{t('status')}</TableCell>
                  <TableCell>{t('actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report._id}>
                    <TableCell>{report.userId}</TableCell>
                    <TableCell>{report.flagType}</TableCell>
                    <TableCell>{formatDate(report.createdAt)}</TableCell>
                    <TableCell>
                      {report.locationValid 
                        ? <span style={{ color: 'green' }}>{t('location_valid')}</span> 
                        : <span style={{ color: 'red' }}>{t('location_mismatch')}</span>}
                    </TableCell>
                    <TableCell>
                      <span style={{ 
                        color: report.status === 'pending' ? 'orange' : 
                               report.status === 'confirmed' ? 'red' : 'green'
                      }}>
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => alert('Report details view coming soon!')}
                      >
                        {t('view_details')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default FraudReports;