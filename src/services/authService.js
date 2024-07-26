import axios from "axios"

const API_URL = `${process.env.REACT_APP_API_URL}/v1/users`

const register = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData)
    return response.data

  } catch (error) {
    return error.response.data
  }
}

const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData)

    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }

    return response.data

  } catch (error) {
    return error.response.data
  }
}

const logout = () => {
  localStorage.removeItem('token');
};

export default { register, login, logout };