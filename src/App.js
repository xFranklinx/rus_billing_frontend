import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout/MainLayout';
import { Login } from 'pages';
import { AuthSuccessHandler } from 'components'
import { AuthContext, AuthProvider } from 'contexts/AuthContext';
import { ThemeProvider } from 'contexts/ThemeContext';
import { isTokenValid } from 'utils/authUtils';
import ErrorBoundary from 'components/ErrorBoundary';
import logger from 'utils/logger';

const AppContent = () => {
  const { user, logout, loading } = useContext(AuthContext);

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('token');
      if (token && !isTokenValid(token)) {
        logger.info('Token expired, logging out user');
        logout();
      }
    };

    // Only start the interval if the user is logged in
    let intervalId;
    if (user) {
      intervalId = setInterval(checkTokenValidity, 60000); // Check every minute
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user, logout]);

  if (loading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/auth/success" element={<AuthSuccessHandler />} />
          <Route
            path="/*"
            element={user ? <MainLayout /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;