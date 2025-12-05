// Responsive Dashboard Grid Component

import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import type { Layout, ItemCallback } from 'react-grid-layout';
import WidgetContainer from './WidgetContainer';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import type { Widget } from '../../types/dashboard.types';

interface ResponsiveDashboardGridProps {
  widgets: Widget[];
  isEdit?: boolean;
  onLayoutChange?: (layout: Layout[], allLayouts?: { [key: string]: Layout[] }) => void;
  onWidgetResize?: (widgetId: string, size: { w: number; h: number }) => void;
  onWidgetMove?: (widgetId: string, position: { x: number; y: number }) => void;
}

const ResponsiveDashboardGrid: React.FC<ResponsiveDashboardGridProps> = ({
  widgets,
  isEdit = false,
  onLayoutChange,
  onWidgetResize,
  onWidgetMove,
}) => {
  const { layouts, breakpoints, cols, ResponsiveGridLayout } = useResponsiveLayout({
    widgets,
    isEdit,
  });

  // Handle layout change
  const handleLayoutChange = useCallback(
    (layout: Layout[], allLayouts?: { [key: string]: Layout[] }) => {
      onLayoutChange?.(layout, allLayouts);
    },
    [onLayoutChange]
  );

  // Handle resize stop
  const handleResizeStop: ItemCallback = useCallback(
    (_layout, _oldItem, newItem) => {
      onWidgetResize?.(newItem.i, { w: newItem.w, h: newItem.h });
    },
    [onWidgetResize]
  );

  // Handle drag stop
  const handleDragStop: ItemCallback = useCallback(
    (_layout, _oldItem, newItem) => {
      onWidgetMove?.(newItem.i, { x: newItem.x, y: newItem.y });
    },
    [onWidgetMove]
  );

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={50}
        margin={[10, 10]}
        containerPadding={[0, 0]}
        isDraggable={isEdit}
        isResizable={isEdit}
        isBounded={false}
        compactType="vertical"
        preventCollision={false}
        onLayoutChange={handleLayoutChange}
        onResizeStop={handleResizeStop}
        onDragStop={handleDragStop}
        draggableHandle=".widget-drag-handle"
      >
        {widgets
          .filter((w) => w.id)
          .map((widget) => (
            <Box key={widget.id} sx={{ width: '100%', height: '100%' }}>
              <WidgetContainer widget={widget} isEdit={isEdit} />
            </Box>
          ))}
      </ResponsiveGridLayout>
    </Box>
  );
};

export default ResponsiveDashboardGrid;

