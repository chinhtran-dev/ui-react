// Main Layout Component

import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppToolbar from './AppToolbar';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppToolbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth={false}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;

