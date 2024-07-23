import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AutoGraph as AutoGraphIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'; // Import relevant MUI icons

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Welcome to RUS Billing Optimization & Automation
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Your hub for monitoring and optimizing billing processes.
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Key Metrics
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SvgIcon component={TrendingUpIcon} />
                  </ListItemIcon>
                  <ListItemText primary="Revenue Trends" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SvgIcon component={PeopleIcon} />
                  </ListItemIcon>
                  <ListItemText primary="Customer Overview" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Process Automation
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SvgIcon component={AutoGraphIcon} />
                  </ListItemIcon>
                  <ListItemText primary="Invoice Generation" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SvgIcon component={SettingsIcon} />
                  </ListItemIcon>
                  <ListItemText primary="Payment Processing" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
