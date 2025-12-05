// Widget Container Component

import React, { Suspense } from 'react';
import { Box, IconButton, Paper, CircularProgress } from '@mui/material';
import {
  DragIndicator as DragIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';
import type { Widget as WidgetType } from '../../types/dashboard.types';

// Dynamic import to avoid type conflicts
const WidgetComponent = React.lazy(() => import('../widget/Widget'));

interface WidgetContainerProps {
  widget: WidgetType;
  isEdit?: boolean;
  onEdit?: (widget: WidgetType) => void;
  onDelete?: (widgetId: string) => void;
  onFullscreen?: (widget: WidgetType) => void;
  onSettings?: (widget: WidgetType) => void;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({
  widget,
  isEdit = false,
  onEdit,
  onDelete,
  onFullscreen,
  onSettings,
}) => {
  return (
    <Paper
      elevation={isEdit ? 3 : 1}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        '&:hover .widget-actions': {
          opacity: 1,
        },
      }}
    >
      {/* Drag Handle */}
      {isEdit && (
        <Box
          className="widget-drag-handle"
          sx={{
            position: 'absolute',
            top: 4,
            left: 4,
            zIndex: 10,
            cursor: 'move',
            opacity: 0.7,
            '&:hover': {
              opacity: 1,
            },
          }}
        >
          <DragIcon fontSize="small" color="action" />
        </Box>
      )}

      {/* Widget Actions */}
      {isEdit && (
        <Box
          className="widget-actions"
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 10,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transition: 'opacity 0.2s',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 1,
            padding: 0.5,
          }}
        >
          {onSettings && (
            <IconButton
              size="small"
              onClick={() => onSettings(widget)}
              aria-label="widget settings"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onEdit && (
            <IconButton
              size="small"
              onClick={() => onEdit(widget)}
              aria-label="edit widget"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onFullscreen && (
            <IconButton
              size="small"
              onClick={() => onFullscreen(widget)}
              aria-label="fullscreen widget"
            >
              <FullscreenIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              onClick={() => widget.id && onDelete(widget.id)}
              aria-label="delete widget"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}

      {/* Widget Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          padding: isEdit ? 1 : 0,
        }}
      >
        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          }
        >
          <WidgetComponent widget={widget} isEdit={isEdit} />
        </Suspense>
      </Box>
    </Paper>
  );
};

export default WidgetContainer;

