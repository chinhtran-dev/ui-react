// Main App Component

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box } from '@mui/material';
import { queryClient } from './services/api/react-query.config';
import { store } from './store/store';
import MainLayout from './components/layout/MainLayout';

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WidgetBundlesPage = lazy(() => import('./pages/WidgetBundlesPage'));
const WidgetBundleDetailPage = lazy(() => import('./pages/WidgetBundleDetailPage'));

// Loading component
const PageLoader: React.FC = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="400px"
  >
    <CircularProgress />
  </Box>
);

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppContent: React.FC = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route
        path="/dashboard/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route
        path="/widget-bundles"
        element={
          <Suspense fallback={<PageLoader />}>
            <WidgetBundlesPage />
          </Suspense>
        }
      />
      <Route
        path="/widget-bundles/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <WidgetBundleDetailPage />
          </Suspense>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Routes>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
