// Dashboard export/import dialog

import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { dashboardExportImportService } from '../../services/dashboard/dashboard-export-import.service';

interface DashboardExportImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport?: (dashboard: any) => void;
}

export const DashboardExportImportDialog: React.FC<DashboardExportImportDialogProps> = ({
  open,
  onClose,
  onImport,
}) => {
  const dashboard = useAppSelector((state) => state.dashboard.currentDashboard);
  const [tab, setTab] = useState(0);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (dashboard) {
      dashboardExportImportService.exportDashboardToFile(dashboard);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImportError(null);
    setImportSuccess(false);

    try {
      const importedDashboard = await dashboardExportImportService.importDashboardFromFile(file);
      const validation = dashboardExportImportService.validateDashboard(importedDashboard);

      if (!validation.valid) {
        setImportError(validation.errors.join(', '));
        return;
      }

      setImportSuccess(true);
      if (onImport) {
        onImport(importedDashboard);
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import dashboard');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    setTab(0);
    setImportError(null);
    setImportSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export / Import Dashboard</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Export" />
            <Tab label="Import" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Export the current dashboard to a JSON file.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
                disabled={!dashboard}
              >
                Export Dashboard
              </Button>
            </Box>
            {dashboard && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Dashboard: {dashboard.title}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="body1" gutterBottom>
              Import a dashboard from a JSON file.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              <Button
                variant="contained"
                startIcon={<FileUploadIcon />}
                onClick={handleImportClick}
              >
                Select File
              </Button>
            </Box>
            {importError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {importError}
              </Alert>
            )}
            {importSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Dashboard imported successfully!
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

