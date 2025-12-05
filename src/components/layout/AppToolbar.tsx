// Application Toolbar Component

import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, Extension as ExtensionIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';

const AppToolbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ThingsBoard
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
            variant={location.pathname === '/dashboard' ? 'outlined' : 'text'}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            startIcon={<ExtensionIcon />}
            onClick={() => navigate('/widget-bundles')}
            variant={location.pathname === '/widget-bundles' ? 'outlined' : 'text'}
          >
            Widget Bundles
          </Button>
        </Box>
        {/* Auth menu removed for dashboard-only mode */}
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;

