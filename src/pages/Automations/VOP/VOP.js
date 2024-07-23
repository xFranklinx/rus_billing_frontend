import * as React from 'react';
import { Divider, Tabs, Tab, Box, Fab, Menu, MenuItem } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import ConsolidatedList from './components/ConsolidatedList';
import RunHistory from './components/RunHistory';
import AddIcon from '@mui/icons-material/Add';

const VOP = () => {
  const [value, setValue] = React.useState('consolidatedList');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFabClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menuItem) => {
    console.log(`${menuItem} clicked`);
    // Perform actions based on the menu item clicked
    handleMenuClose();
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1', bgcolor: 'background.paper' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="Consolidated List" value="consolidatedList" />
            <Tab label="Run History" value="runHistory" />
            <Tab label="New Run" value="newRun" />
          </TabList>
        </Box>

        <TabPanel value="consolidatedList">
          <ConsolidatedList />
        </TabPanel>

        <TabPanel value="runHistory">
          <RunHistory />
        </TabPanel>

        <TabPanel value="newRun">Item Three</TabPanel>
      </TabContext>

      <Fab color="primary" aria-label="add" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={handleFabClick}>
        <AddIcon />
      </Fab>
      <Menu
        id="fab-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick('New Run')}>New Run</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('View Historical')}>View Historical</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('Settings')}>Settings</MenuItem>
      </Menu>
    </Box>
  );
}

export default VOP;
