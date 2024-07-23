import React, { useState, useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { styled, Box, CssBaseline } from '@mui/material/';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import {
  Home,
  Dashboard,
  Customers,
  // Automations
  InvoiceEmailScheduler,
  Morph,
  SqlVision,
  VOP,
  // Forms
  SolutionsAdjustments,
  // Admin
  Users,
  // Errors
  Unauthorized,
  NotFound404
} from 'pages';
import ProtectedRoute from 'components/ProtectedRoute';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));


const MainLayout = ({ handleLogin, handleThemeChange, darkModeActivated }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopNavbar sidebarOpen={sidebarOpen} handleSidebar={handleSidebar} handleLogin={handleLogin} handleThemeChange={handleThemeChange} darkModeActivated={darkModeActivated} />
      <Sidebar sidebarOpen={sidebarOpen} handleSidebar={handleSidebar} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />

        <Routes>
          {/* Main */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />

          {/* Automations */}
          <Route path="/automations/invoice-email-scheduler" element={<InvoiceEmailScheduler />} />
          <Route path="/automations/morph" element={<Morph />} />
          <Route path="/automations/sql-vision" element={<SqlVision />} />
          <Route path="/automations/vop" element={<VOP />} />

          {/* Forms */}
          <Route path="/forms/solutions-adjustments" element={<SolutionsAdjustments />} />

          {/* Admin */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/users" element={<Users />} />
          </Route>

          {/* Errors */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default MainLayout;