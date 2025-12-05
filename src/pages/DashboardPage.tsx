// Dashboard Page Component

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  AccessTime as AccessTimeIcon,
  FilterList as FilterListIcon,
  Label as LabelIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
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
import { setEditMode } from '../store/slices/dashboard.slice';
import { Switch, FormControlLabel } from '@mui/material';

const DashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentDashboard, widgets, isEdit } = useAppSelector((state) => state.dashboard);
  const { handleLayoutChange, handleWidgetResize, handleWidgetMove } = useDashboardLayout();
  const { formatted: timewindowFormatted } = useTimewindow();
  const toggleEdit = useCallback(() => {
    dispatch(setEditMode(!isEdit));
  }, [dispatch, isEdit]);

  const [statesDialogOpen, setStatesDialogOpen] = useState(false);
  const [aliasesDialogOpen, setAliasesDialogOpen] = useState(false);
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [timewindowDialogOpen, setTimewindowDialogOpen] = useState(false);
  const [exportImportDialogOpen, setExportImportDialogOpen] = useState(false);

  // Load dashboard list for selection
  const {
    data: dashboards,
    isLoading: isListLoading,
    error: listError,
  } = useQuery({
    queryKey: ['dashboards', 'list'],
    queryFn: () => dashboardApi.getDashboards(),
  });

  // Auto-select first dashboard if none selected
  useEffect(() => {
    if (!id && dashboards?.data?.length) {
      const first = dashboards.data[0];
      const dashId = typeof first.id === 'string' ? first.id : first.id?.id;
      if (dashId) {
        navigate(`/dashboard/${dashId}`, { replace: true });
      }
    }
  }, [id, dashboards, navigate]);

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

  const dashboardOptions = dashboards?.data || [];
  const selectedId = id || '';

  const widgetArray = currentDashboard ? widgets : [];

  return (
    <Box sx={{ width: '100%', height: 'calc(100vh - 200px)', minHeight: '600px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel id="dashboard-select-label">Select Dashboard</InputLabel>
          <Select
            labelId="dashboard-select-label"
            value={selectedId}
            label="Select Dashboard"
            onChange={(e) => {
              const value = e.target.value as string;
              if (value) {
                navigate(`/dashboard/${value}`);
              }
            }}
            disabled={isListLoading}
          >
            {dashboardOptions.map((d) => {
              const dashId = typeof d.id === 'string' ? d.id : d.id?.id;
              return (
                <MenuItem key={dashId || 'unknown'} value={dashId || ''}>
                  {d.title || 'Untitled dashboard'}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {listError && <Alert severity="error">Failed to load dashboards list</Alert>}
      </Box>

      {!currentDashboard ? (
        <Alert severity="info">No dashboard selected. Please select a dashboard.</Alert>
      ) : (
        <>
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
                <FormControlLabel
                  control={<Switch checked={isEdit} onChange={toggleEdit} size="small" />}
                  label="Edit layout"
                  sx={{ mr: 1 }}
                />
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
        </>
      )}
    </Box>
  );
};

export default DashboardPage;

