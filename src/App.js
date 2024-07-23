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
  const [darkModeActivated, setDarkModeActivated] = useState(false);

  const handleThemeChange = () => {
    setDarkModeActivated(!darkModeActivated);
  };

  const handleLogin = () => {
    setIsAuthenticated(!isAuthenticated)
  }

  useEffect(() => {
    // Retrieve the theme preference from localStorage
    // Theme is saved from the TopNavbar component in MainLayout.js when the user toggles the theme switch
    const retrieveTheme = () => {
      const darkModeActivated = localStorage.getItem('theme');
      if (darkModeActivated) {
        setDarkModeActivated(JSON.parse(darkModeActivated));
      }
    }
    retrieveTheme()

    // Check if the token is still valid on page load. If it is, set the isAuthenticated state to true. Otherwise, remove the token from local storage.
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
      <ThemeProvider theme={darkModeActivated ? darkTheme : lightTheme}>
        <Router>
          {isAuthenticated ? <MainLayout handleLogin={handleLogin} handleThemeChange={handleThemeChange} darkModeActivated={darkModeActivated} /> : <Login handleLogin={handleLogin} />}
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App