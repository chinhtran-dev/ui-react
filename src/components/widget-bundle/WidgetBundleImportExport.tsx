// Widget Bundle Import/Export Component

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Alert,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useExportWidgetType, useImportWidgetType } from '../../hooks/useWidgetTypes';
import type { WidgetTypeDetails } from '../../types/widget.types';

interface WidgetBundleImportExportProps {
  open: boolean;
  onClose: () => void;
  bundleId?: string;
}

const WidgetBundleImportExport: React.FC<WidgetBundleImportExportProps> = ({
  open,
  onClose,
  // bundleId - reserved for future use
}) => {
  const [tab, setTab] = useState(0);
  const [importJson, setImportJson] = useState('');
  const [exportData, setExportData] = useState<string>('');
  const exportMutation = useExportWidgetType();
  const importMutation = useImportWidgetType();

  const handleExport = () => {
    // This would typically export the bundle with all its widgets
    // For now, this is a placeholder
    setExportData(JSON.stringify({ message: 'Export functionality coming soon' }, null, 2));
  };

  const handleImport = () => {
    try {
      const widgetType: WidgetTypeDetails = JSON.parse(importJson);
      importMutation.mutate(widgetType, {
        onSuccess: () => {
          setImportJson('');
          onClose();
        },
      });
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportJson(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import/Export Widget Bundle</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Import" icon={<UploadIcon />} iconPosition="start" />
            <Tab label="Export" icon={<DownloadIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Import a widget bundle from JSON file. The file should contain widget type definitions.
            </Alert>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Upload JSON File
                <input
                  type="file"
                  hidden
                  accept=".json"
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
            <TextField
              label="JSON Content"
              fullWidth
              multiline
              rows={10}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste JSON content here or upload a file..."
            />
            {importMutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {importMutation.error instanceof Error
                  ? importMutation.error.message
                  : 'Failed to import widget bundle'}
              </Alert>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Export widget bundle as JSON file.
            </Alert>
            <TextField
              label="Export Data"
              fullWidth
              multiline
              rows={10}
              value={exportData}
              InputProps={{
                readOnly: true,
              }}
              placeholder="Export data will appear here..."
            />
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{ mt: 2 }}
              disabled={exportMutation.isPending}
            >
              {exportMutation.isPending ? 'Exporting...' : 'Export Bundle'}
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {tab === 0 && (
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={!importJson || importMutation.isPending}
          >
            {importMutation.isPending ? 'Importing...' : 'Import'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default WidgetBundleImportExport;

