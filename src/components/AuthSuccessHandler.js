import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import logger from '../utils/logger';

const AuthSuccess = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      logger.info('AuthSuccess component mounted');
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      if (token) {
        logger.info('Token received from Google Auth');
        try {
          const success = await login({ token });
          if (success) {
            logger.info('Google Auth login successful');
            navigate('/');
          } else {
            logger.error('Failed to log in with received token');
            navigate('/login?error=auth_failed');
          }
        } catch (error) {
          logger.error('Error during login:', error);
          navigate('/login?error=auth_error');
        }
      } else {
        logger.error('No token received from Google Auth');
        navigate('/login?error=no_token');
      }
    };

    handleAuthSuccess();
  }, [login, navigate, location]);

  return <div>Processing authentication...</div>;
};

export default AuthSuccess;