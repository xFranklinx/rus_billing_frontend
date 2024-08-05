import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../utils/handleApiCall';
import logger from '../utils/logger';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setAuthToken(token);
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: decodedToken.id,
          email: decodedToken.email,
          accountType: decodedToken.accountType,
        });
        logger.info('User authenticated from stored token');
      } catch (error) {
        logger.error('Error setting stored token:', error);
        setAuthToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (loginData) => {
    try {
      if (!loginData || !loginData.token) {
        logger.error('Login failed: No token received');
        return false;
      }

      setAuthToken(loginData.token);
      const decodedToken = JSON.parse(atob(loginData.token.split('.')[1]));
      setUser({
        id: decodedToken.id,
        email: decodedToken.email,
        accountType: decodedToken.accountType,
      });

      logger.info('User logged in successfully');
      return true;
    } catch (error) {
      logger.error('Login failed', error);
      return false;
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    logger.info('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };