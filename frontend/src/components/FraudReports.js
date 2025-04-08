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
  IconButton
} from '@mui/material';
import { Menu as MenuIcon, ExitToApp as LogoutIcon, ArrowBack as BackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// API base URL - use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Mock data for demo mode
const MOCK_REPORTS = [
  {
    id: 1,
    user: 'farmer123',
    detectionType: 'Image similarity (85%)',
    submissionDate: '2023-04-05',
    locationValidation: false,
    status: 'pending review'
  },
  {
    id: 2,
    user: 'farmer456',
    detectionType: 'Location mismatch',
    submissionDate: '2023-04-06',
    locationValidation: false,
    status: 'confirmed'
  },
  {
    id: 3,
    user: 'farmer789',
    detectionType: 'Metadata match (92%)',
    submissionDate: '2023-04-07',
    locationValidation: true,
    status: 'pending review'
  }
];

const FraudReports = ({ isDemo = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      // Use mock data in demo mode
      if (isDemo || window.location.hostname.includes('vercel.app')) {
        console.log('Demo mode: Using mock fraud reports');
        setReports(MOCK_REPORTS);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/proof/fraud-reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching fraud reports:', error);
        // Fallback to mock data on error
        setReports(MOCK_REPORTS);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
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
          <Typography>Loading...</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('user')}</TableCell>
                    <TableCell>{t('detection_type')}</TableCell>
                    <TableCell>{t('submission_date')}</TableCell>
                    <TableCell>{t('location_validation')}</TableCell>
                    <TableCell>{t('status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.user}</TableCell>
                      <TableCell>{report.detectionType}</TableCell>
                      <TableCell>{report.submissionDate}</TableCell>
                      <TableCell>
                        {report.locationValidation 
                          ? <span style={{ color: 'green' }}>{t('location_valid')}</span> 
                          : <span style={{ color: 'red' }}>{t('location_mismatch')}</span>}
                      </TableCell>
                      <TableCell>{report.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {isDemo && (
              <Paper sx={{ p: 3, mt: 2, bgcolor: '#fff9c4' }}>
                <Typography variant="h6" color="primary">
                  Demo Mode Active
                </Typography>
                <Typography paragraph>
                  This is a demonstration with mock data. In a production environment, this would display actual fraud detection reports from your system.
                </Typography>
              </Paper>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default FraudReports;