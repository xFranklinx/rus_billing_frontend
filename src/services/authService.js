import axios from "axios";
import { setAuthToken } from "utils/handleApiCall";

const API_URL = `${process.env.REACT_APP_API_URL}/v1/auth`;
console.log(`API_URL: ${API_URL}`);

const register = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);

    if (response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

const logout = () => {
  setAuthToken(null);
};

const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken: localStorage.getItem('refreshToken'),
    });

    if (response.data.token) {
      setAuthToken(response.data.token);
      return response.data.token;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export default { register, login, logout, refreshToken };