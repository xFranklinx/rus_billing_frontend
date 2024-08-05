import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { createTheme, ThemeProvider, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, MenuItem, Select, InputLabel, FormControl, FormHelperText, Alert } from '@mui/material/';
import rusLogo from 'static/randstad_staffing_logo.jpg';
import { AuthContext } from 'contexts/AuthContext';
// import { getUsers, apiCall } from 'utils/handleApiCall';
import logger from 'utils/logger';

const defaultTheme = createTheme();

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, googleLogin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  const [detailedError, setDetailedError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error) {
      switch (error) {
        case 'google_auth_failed':
          setError('Google authentication failed. Please try again.');
          break;
        case 'google_auth_no_user':
          setError('No user found with this Google account. Please register first.');
          break;
        case 'auth_failed':
          setError('Authentication failed. Please try again.');
          break;
        case 'no_token':
          setError('No authentication token received. Please try again.');
          break;
        default:
          setError('An unknown error occurred. Please try again.');
      }
    }
  }, [location]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await getUsers();
  //       setUsers(response.data);
  //       logger.debug('Users fetched successfully', response.data);
  //     } catch (error) {
  //       logger.error('Failed to fetch users:', error);
  //       setError('Failed to load users. Please try again later.');
  //       setDetailedError(JSON.stringify(error, null, 2));
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/v1/auth/google`;
  };

  const handleUserChange = (event) => {
    const userId = event.target.value;
    const user = users.find(u => u._id === userId);
    if (user) {
      setEmail(user.email);
      setPassword('password123'); // Assuming password is available. Usually, this wouldn't be exposed.
    }
    setSelectedUser(userId);
  };

  // const loginApiWrapper = async (endpoint, method, data) => {
  //   try {
  //     console.log('Sending API request:', { endpoint, method, data });
  //     const response = await apiCall(method, endpoint, data);
  //     console.log('API Response:', response);
  //     return { success: true, data: response };
  //   } catch (error) {
  //     console.error('API Error:', error);
  //     let detailedError = 'An unexpected error occurred';

  //     if (error.response) {
  //       detailedError = `Server Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
  //     } else if (error.request) {
  //       detailedError = 'No response received from server. Please check your network connection.';
  //     } else {
  //       detailedError = `Request Error: ${error.message}`;
  //     }

  //     return { success: false, error: detailedError };
  //   }
  // };


  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setError('');
  //   setDetailedError('');
  //   setLoading(true);
  //   try {
  //     logger.info('Attempting login with:', { email });
  //     const result = await loginApiWrapper('/v1/auth/login', 'POST', { email, password });
  //     logger.debug('Login result:', result);
  //     if (result.success && result.data && result.data.token) {
  //       const authStatus = await login(result.data);
  //       if (authStatus) {
  //         logger.info('User logged in successfully');
  //         handleLogin();
  //       } else {
  //         logger.warn('Authentication failed after successful API call');
  //         setError('Login failed. Please check your credentials and try again.');
  //         setDetailedError('Authentication failed after successful API call.');
  //       }
  //     } else {
  //       logger.warn('Login failed', result.error);
  //       setError('Login failed. Please check the detailed error below.');
  //       setDetailedError(result.error || 'Unknown error occurred');
  //     }
  //   } catch (error) {
  //     logger.error('Login error:', error);
  //     setError('An unexpected error occurred. Please check the detailed error below.');
  //     setDetailedError(error.message || 'Unknown error occurred');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={rusLogo} alt="RUS Logo" />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          {detailedError && (
            <Alert severity="warning" sx={{ mt: 2, width: '100%' }}>
              <Typography variant="body2">Detailed Error (Dev Only):</Typography>
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '200px', overflow: 'auto' }}>
                {detailedError}
              </pre>
            </Alert>
          )}
          <Box component="form" noValidate sx={{ mt: 1 }}>
            {/* <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}> */}
            {/* <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button> */}

            <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              onClick={handleGoogleLogin}
              startIcon={<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" style={{ width: '18px', height: '18px' }} />}
            >
              Sign in with Google
            </Button>

            {/* <FormControl sx={{ mt: 15 }} fullWidth margin="normal">
              <InputLabel id="select-user-label">Select User</InputLabel>
              <Select
                labelId="select-user-label"
                id="select-user"
                value={selectedUser}
                label="Select User"
                onChange={handleUserChange}
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} - {user.accountType}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText><Typography variant='overline'>Select a user to auto-fill email and password</Typography></FormHelperText>
            </FormControl> */}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;