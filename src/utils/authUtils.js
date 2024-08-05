import authService from 'services/authService';
import logger from 'utils/logger';

export const isTokenValid = (token) => {
  if (!token) {
    logger.info('No token provided for validation');
    return false;
  }
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const isValid = decodedToken.exp * 1000 > Date.now();
    logger.info(`Token validation result: ${isValid}`);
    return isValid;
  } catch (error) {
    logger.error('Error decoding token:', error);
    return false;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  authService.logout();
  logger.info('Auth data cleared');
};