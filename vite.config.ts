import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - prioritize splitting large dependencies first
          if (id.includes('node_modules')) {
            // Material-UI - split first (largest dependency)
            if (id.includes('@mui/material')) {
              return 'mui-core';
            }
            
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            
            if (id.includes('@mui/system') || id.includes('@emotion')) {
              return 'mui-system';
            }
            
            // React Grid Layout
            if (id.includes('react-grid-layout')) {
              return 'grid-layout-vendor';
            }
            
            // React core (after MUI)
            if (id.includes('react/') && !id.includes('react-dom')) {
              return 'react-core';
            }
            
            // React DOM
            if (id.includes('react-dom')) {
              return 'react-dom';
            }
            
            // Redux
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'redux-vendor';
            }
            
            // React Query
            if (id.includes('@tanstack/react-query')) {
              return 'react-query-vendor';
            }
            
            // Router
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            
            // Axios
            if (id.includes('axios')) {
              return 'axios-vendor';
            }
            
            // Widget dependencies (VM2, jquery, moment, etc.)
            if (id.includes('vm2') || id.includes('jquery') || id.includes('moment') || 
                id.includes('tinycolor2') || id.includes('cssjs')) {
              return 'widget-deps';
            }
            
            // Other node_modules
            return 'vendor';
          }
          
          // Dashboard components
          if (id.includes('/components/dashboard')) {
            return 'dashboard-components';
          }
          
          // Widget-related code
          if (id.includes('/services/widget') || id.includes('/components/widget') || 
              id.includes('/contexts/WidgetContext') || id.includes('/hooks/useWidgetInstance')) {
            return 'widget-core';
          }
          
          // API services
          if (id.includes('/services/api')) {
            return 'api-services';
          }
          
          // Store/Redux
          if (id.includes('/store')) {
            return 'store';
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000, // Increase limit to 2MB (MUI + React are large)
  },
})
