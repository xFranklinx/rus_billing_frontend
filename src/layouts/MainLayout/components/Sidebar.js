import React, { useContext } from 'react';
import { styled, Drawer as MuiDrawer, Divider, IconButton, List, ListSubheader, Box, Tooltip, Typography } from '@mui/material/';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SidebarItem from './SidebarItem';
import config from 'utils/config';
import sidebarLinks from 'utils/sidebarLinks';
import { AuthContext } from 'contexts/AuthContext';

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: config.sidebarWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Sidebar = ({ handleSidebar, sidebarOpen }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return null; // Render nothing or a placeholder if user is not yet loaded
  }

  return (
    <Drawer variant="permanent" open={sidebarOpen}>
      <DrawerHeader>
        <IconButton onClick={handleSidebar}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />

      <Box display="flex" flexDirection="column" height="100%">
        <Box flexGrow={1}>
          {Object.keys(sidebarLinks).map((section) => {
            if (section === 'Admin') return null; // Skip Admin section here
            return (
              <Box key={section}>
                <Divider />
                <List key={section}>
                  <Tooltip title={section} placement="top">
                    <ListSubheader sx={{ display: sidebarOpen ? 'block' : 'none' }}>
                      <Typography variant="overline">
                        {section}
                      </Typography>
                    </ListSubheader>
                  </Tooltip>
                  {sidebarLinks[section].map((item) => (
                    <SidebarItem
                      key={item.text}
                      text={item.text}
                      url={item.url}
                      icon={item.icon}
                      sidebarOpen={sidebarOpen}
                    />
                  ))}
                </List>
                <Divider />
              </Box>
            );
          })}
        </Box>

        {user.accountType === 'Admin' && (
          <Box>
            <Divider />
            <List>
              <ListSubheader sx={{ display: sidebarOpen ? 'block' : 'none' }}>
                Admin
              </ListSubheader>
              {sidebarLinks['Admin'].map((item) => (
                <SidebarItem
                  key={item.text}
                  text={item.text}
                  url={item.url}
                  icon={item.icon}
                  sidebarOpen={sidebarOpen}
                />
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
