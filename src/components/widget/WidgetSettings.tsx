// Widget Settings Component

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import { DynamicForm } from './DynamicForm';
import type { Widget } from '../../types/dashboard.types';
import type { WidgetType } from '../../types/widget.types';

interface WidgetSettingsProps {
  open: boolean;
  widget: Widget | null;
  widgetType: WidgetType | null;
  onClose: () => void;
  onSave: (widget: Widget) => void;
}

const WidgetSettings: React.FC<WidgetSettingsProps> = ({
  open,
  widget,
  widgetType,
  onClose,
  onSave,
}) => {
  const [tab, setTab] = React.useState(0);

  if (!widget || !widgetType) {
    return null;
  }

  const handleSave = () => {
    onSave(widget);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Widget Settings: {widget.config.title || widgetType.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Settings" />
            <Tab label="Data" />
            <Tab label="Actions" />
            <Tab label="Advanced" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Box>
            {widgetType.descriptor?.settingsForm && widgetType.descriptor.settingsForm.length > 0 ? (
              <DynamicForm
                properties={widgetType.descriptor.settingsForm}
                model={widget.config.settings || {}}
                onChange={(newSettings) => {
                  widget.config.settings = newSettings;
                }}
                onSubmit={(newSettings) => {
                  widget.config.settings = newSettings;
                  handleSave();
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No settings form defined for this widget type.
              </Typography>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Data Sources
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Data source configuration will be rendered here
            </Typography>
            {/* TODO: Render datasource configuration */}
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Widget actions configuration will be rendered here
            </Typography>
            {/* TODO: Render actions configuration */}
          </Box>
        )}

        {tab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Advanced Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Advanced settings will be rendered here
            </Typography>
            {/* TODO: Render advanced settings */}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WidgetSettings;

