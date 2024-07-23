import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" component="h2" gutterBottom>
        403
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Unauthorized
      </Typography>
      <Typography variant="body1" gutterBottom>
        You do not have permission to view this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoBack}
        sx={{ mt: 2 }}
      >
        Go Back
      </Button>
    </Box>
  );
};

export default Unauthorized;
