import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { styled, Menu, MenuItem, AppBar as MuiAppBar, Toolbar, Typography, ListItemIcon, IconButton, Divider, Switch, FormControlLabel } from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Face as ProfileIcon,
  Settings as SettingsIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon
} from '@mui/icons-material';
import { AuthContext } from 'contexts/AuthContext';
import config from 'utils/config';

const openedMixin = (theme) => ({
  width: config.sidebarWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: config.sidebarWidth,
    width: `calc(100% - ${config.sidebarWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const TopNavbar = ({ sidebarOpen, handleSidebar, handleLogin, handleThemeChange, darkModeActivated }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    handleLogin();
    handleClose();
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateTheme = () => {
    // Saving the theme preference to localStorage so it persists on page reload
    if (darkModeActivated) {
      localStorage.setItem('theme', JSON.stringify('light'));
    } else {
      localStorage.setItem('theme', JSON.stringify('dark'));
    }

    console.log(localStorage.getItem('theme'))

    handleClose();
    handleThemeChange();
  };


  return (
    <AppBar position="fixed" open={sidebarOpen}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleSidebar}
          edge="start"
          sx={{
            marginRight: 5,
            ...(sidebarOpen && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          <NavLink to='/' style={{ textDecoration: 'none', color: 'inherit' }}>
            RUS Billing
          </NavLink>
        </Typography>

        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>

            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <MenuItem onClick={handleUpdateTheme}>
              <ListItemIcon>
                {darkModeActivated ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </ListItemIcon>
              {darkModeActivated ? 'Light Mode' : 'Dark Mode'}
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default TopNavbar;
