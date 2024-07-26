import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const apiCall = async (method, endpoint, data = null, params = null) => {
  try {
    const token = localStorage.getItem('token');

    const config = {
      method: method,
      url: endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      config.data = data;
    }

    if (params) {
      config.params = params;
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    // Handle errors (e.g., unauthorized, network issues)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error request:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    throw error; // Re-throw the error so it can be caught and handled by the caller
  }
};

//** PREDEFINED API CALLS **//

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
export const getAllSolutionBillingAdjustments = () => apiCall('GET', '/v1/forms/solutionsBillingAdjustments');