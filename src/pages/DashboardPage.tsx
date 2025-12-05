// Dashboard Page Component

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, IconButton, Toolbar } from '@mui/material';
import {
  Settings as SettingsIcon,
  AccessTime as AccessTimeIcon,
  FilterList as FilterListIcon,
  Label as LabelIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setDashboard } from '../store/slices/dashboard.slice';
import { dashboardApi } from '../services/api/dashboard.api';
import ResponsiveDashboardGrid from '../components/dashboard/ResponsiveDashboardGrid';
import { useDashboardLayout } from '../hooks/useDashboardLayout';
import { DashboardStatesDialog } from '../components/dashboard/DashboardStatesDialog';
import { EntityAliasesDialog } from '../components/dashboard/EntityAliasesDialog';
import { FiltersDialog } from '../components/dashboard/FiltersDialog';
import { TimewindowDialog } from '../components/dashboard/TimewindowDialog';
import { DashboardExportImportDialog } from '../components/dashboard/DashboardExportImportDialog';
import { useTimewindow } from '../hooks/useTimewindow';
import type { Layout } from 'react-grid-layout';

const DashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentDashboard, widgets, isEdit } = useAppSelector((state) => state.dashboard);
  const { handleLayoutChange, handleWidgetResize, handleWidgetMove } = useDashboardLayout();
  const { formatted: timewindowFormatted } = useTimewindow();

  const [statesDialogOpen, setStatesDialogOpen] = useState(false);
  const [aliasesDialogOpen, setAliasesDialogOpen] = useState(false);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [timewindowDialogOpen, setTimewindowDialogOpen] = useState(false);
  const [exportImportDialogOpen, setExportImportDialogOpen] = useState(false);

  // Load dashboard
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['dashboard', id],
    queryFn: () => (id ? dashboardApi.getDashboard(id) : null),
    enabled: !!id,
  });

  // Update Redux store when dashboard loads
  useEffect(() => {
    if (dashboard) {
      dispatch(setDashboard(dashboard));
    }
  }, [dashboard, dispatch]);

  // Handle layout change and save
  const onLayoutChange = useCallback(
    (layout: Layout[]) => {
      handleLayoutChange(layout);
      // Auto-save after layout change (debounced in real implementation)
      // In production, this would be debounced
    },
    [handleLayoutChange]
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load dashboard. Please try again later.
      </Alert>
    );
  }

  if (!currentDashboard) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Alert severity="info">No dashboard selected. Please select a dashboard.</Alert>
      </Box>
    );
  }

  const widgetArray = Array.from(widgets.values());

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 200px)', minHeight: '600px' }}>
      <Toolbar
        variant="dense"
        sx={{
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          mb: 2,
        }}
      >
        <Typography variant="h5">{currentDashboard.title}</Typography>
        <Box>
          <IconButton
            size="small"
            onClick={() => setTimewindowDialogOpen(true)}
            title={`Time Window: ${timewindowFormatted}`}
          >
            <AccessTimeIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setStatesDialogOpen(true)}
            title="Dashboard States"
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setAliasesDialogOpen(true)}
            title="Entity Aliases"
          >
            <LabelIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setFiltersDialogOpen(true)}
            title="Filters"
          >
            <FilterListIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setExportImportDialogOpen(true)}
            title="Export / Import"
          >
            <FileDownloadIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Box sx={{ width: '100%', height: '100%' }}>
        {widgetArray.length > 0 ? (
          <ResponsiveDashboardGrid
            widgets={widgetArray}
            isEdit={isEdit}
            onLayoutChange={onLayoutChange}
            onWidgetResize={handleWidgetResize}
            onWidgetMove={handleWidgetMove}
          />
        ) : (
          <Alert severity="info">No widgets in this dashboard. Add widgets to get started.</Alert>
        )}
      </Box>

      <DashboardStatesDialog
        open={statesDialogOpen}
        onClose={() => setStatesDialogOpen(false)}
      />
      <EntityAliasesDialog
        open={aliasesDialogOpen}
        onClose={() => setAliasesDialogOpen(false)}
      />
      <FiltersDialog
        open={filtersDialogOpen}
        onClose={() => setFiltersDialogOpen(false)}
      />
      <TimewindowDialog
        open={timewindowDialogOpen}
        onClose={() => setTimewindowDialogOpen(false)}
      />
      <DashboardExportImportDialog
        open={exportImportDialogOpen}
        onClose={() => setExportImportDialogOpen(false)}
        onImport={(importedDashboard) => {
          // Handle import - update dashboard
          console.log('Imported dashboard:', importedDashboard);
        }}
      />
    </Box>
  );
};

export default DashboardPage;

