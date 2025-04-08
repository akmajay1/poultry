import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTranslation } from 'react-i18next';

// Components
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import FraudReports from './components/FraudReports';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  useTranslation();
  const [isVercelDeployment, setIsVercelDeployment] = useState(false);

  useEffect(() => {
    // Check if running on Vercel
    if (window.location.hostname.includes('vercel.app')) {
      setIsVercelDeployment(true);
      console.log('Running on Vercel - demo mode enabled');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage isDemo={isVercelDeployment} />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard isDemo={isVercelDeployment} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fraud-reports" 
            element={
              <ProtectedRoute>
                <FraudReports isDemo={isVercelDeployment} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 