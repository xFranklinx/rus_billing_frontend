import axios from 'axios';
import authService from 'services/authService';
import logger from 'utils/logger'

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token) => {
  try {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      logger.info('Auth token set successfully');
      logger.debug('Token:', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      logger.info('Auth token removed');
    }
  } catch (error) {
    logger.error('Error setting auth token:', error);
    throw error;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await authService.refreshToken();
        setAuthToken(newToken);
        return api(originalRequest);
      } catch (refreshError) {
        setAuthToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const apiCall = async (method, endpoint, data = null, params = null) => {
  try {
    const config = {
      method,
      url: endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      params,
    };

    const response = await api(config);
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Initialize token on app load
setAuthToken(localStorage.getItem('token'));

// AUTH
export const googleAuth = () => apiCall('GET', '/v1/auth/google');

// USERS
export const getUsers = () => apiCall('GET', '/v1/users');
export const createUser = (userData) => apiCall('POST', '/v1/users', userData);
export const getUser = (userId) => apiCall('GET', `/v1/users/${userId}`);
export const updateUser = (userId, userData) => apiCall('PUT', `/v1/users/${userId}`, userData);
export const deleteUser = (userId) => apiCall('DELETE', `/v1/users/${userId}`);
export const getLeadsAndManagers = () => apiCall('GET', '/v1/users/leadsAndManagers');

// CUSTOMERS
export const getCustomers = () => apiCall('GET', '/v1/customers');
export const createCustomer = (customerData) => apiCall('POST', '/v1/customers', customerData);
export const getCustomer = (customerId) => apiCall('GET', `/v1/customers/${customerId}`);
export const updateCustomer = (customerId, customerData) => apiCall('PUT', `/v1/customers/${customerId}`, customerData);
export const deleteCustomer = (customerId) => apiCall('DELETE', `/v1/customers/${customerId}`);

// FORMS
export const getAllBillingAdjustments = (params) => apiCall('GET', '/v1/forms/billingAdjustments', null, params);
export const createBillingAdjustment = (adjustmentData, params) => apiCall('POST', '/v1/forms/billingAdjustments', adjustmentData, params);
export const updateBillingAdjustment = (adjustmentId, adjustmentData, params) => apiCall('PUT', `/v1/forms/billingAdjustments/${adjustmentId}`, adjustmentData, params);
export const getBillingAdjustmentById = (adjustmentId) => apiCall('GET', `/v1/forms/billingAdjustments/${adjustmentId}`);