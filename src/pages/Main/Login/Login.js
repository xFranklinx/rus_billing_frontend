import React, { useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container, MenuItem, Select, InputLabel, FormControl, FormHelperText } from '@mui/material/';
import rusLogo from 'static/randstad_staffing_logo.jpg';
import { AuthContext } from 'contexts/AuthContext';

const defaultTheme = createTheme();

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:5000/api/v1/users');
      const data = await response.json();
      setUsers(data.data); // Adjust based on your API response structure
    };
    fetchUsers();
  }, []);

  const handleUserChange = (event) => {
    const userId = event.target.value;
    const user = users.find(u => u._id === userId);
    if (user) {
      setEmail(user.email);
      setPassword('password123'); // Assuming password is available. Usually, this wouldn't be exposed.
    }
    setSelectedUser(userId);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authStatus = await login({ email, password });
    if (authStatus) {
      handleLogin();
    }
  };

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
          <Box noValidate sx={{ mt: 1 }}>
            <TextField
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
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>

            <FormControl sx={{ mt: 15 }} fullWidth margin="normal">
              <InputLabel id="select-user-label">Select User</InputLabel>
              <Select
                labelId="select-user-label"
                id="select-user"
                value={selectedUser}
                label="Select User"  // Add this line to properly link the label with the Select component
                onChange={handleUserChange}
              >
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} - {user.accountType}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText><Typography variant='overline'>Select a user to auto-fill email and password</Typography></FormHelperText>
            </FormControl>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
