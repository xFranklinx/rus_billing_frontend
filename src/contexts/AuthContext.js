import React, { createContext, useState, useEffect, useMemo } from 'react';
import authService from 'services/authService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: decodedToken.id,
          email: decodedToken.email,
          accountType: decodedToken.accountType,
        });
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    } else {
      console.log('No token found in localStorage');
    }
    setLoading(false); // Ensure this is set after the token is processed
  }, []);

  const login = async (userData) => {
    try {
      const data = await authService.login(userData);
      localStorage.setItem('token', data.token); // Ensure the token is stored
      const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
      console.log('Decoded Token in login:', decodedToken); // Log the decoded token
      setUser({
        id: decodedToken.id,
        email: decodedToken.email,
        accountType: decodedToken.accountType,
      });
      return true; // Indicate successful login
    } catch (error) {
      console.error('Login failed', error);
      return false; // Indicate failed login
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
