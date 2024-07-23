import React from 'react'
import { NavLink } from 'react-router-dom'
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

const SidebarItem = ({ text, url, icon, sidebarOpen }) => {
  return (
    <ListItem key={text} disablePadding sx={{ display: 'block' }}>
      <NavLink to={url} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: sidebarOpen ? 'initial' : 'center',
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: sidebarOpen ? 3 : 'auto',
              justifyContent: 'center',
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: sidebarOpen ? 1 : 0 }} />
        </ListItemButton>
      </NavLink>
    </ListItem>
  )
}

export default SidebarItem