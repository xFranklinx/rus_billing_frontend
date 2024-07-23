import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import MainLayout from 'layouts/MainLayout/MainLayout'
import { Login } from 'pages'
import { AuthProvider } from 'contexts/AuthContext'
import { ThemeProvider } from '@mui/material'
import { lightTheme, darkTheme } from 'utils/theme'
import { jwtDecode } from 'jwt-decode'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = () => {
    setIsAuthenticated(!isAuthenticated)
  }

  // Check if the token is still valid on page load. If it is, set the isAuthenticated state to true. Otherwise, remove the token from local storage.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        if (decodedToken.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <Router>
          {isAuthenticated ? <MainLayout handleLogin={handleLogin} handleThemeChange={handleThemeChange} darkMode={darkMode} /> : <Login handleLogin={handleLogin} />}
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App