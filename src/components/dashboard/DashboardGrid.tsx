// Dashboard Grid Component with react-grid-layout

import React, { useCallback, useMemo } from 'react';
import GridLayout from 'react-grid-layout';
import type { Layout, ItemCallback } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-grid-resizable/css/styles.css';
import { Box } from '@mui/material';
import WidgetContainer from './WidgetContainer';
import type { Widget } from '../../types/dashboard.types';

interface DashboardGridProps {
  widgets: Widget[];
  columns?: number;
  rowHeight?: number;
  margin?: [number, number];
  isEdit?: boolean;
  onLayoutChange?: (layout: Layout[]) => void;
  onWidgetResize?: (widgetId: string, size: { w: number; h: number }) => void;
  onWidgetMove?: (widgetId: string, position: { x: number; y: number }) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  columns = 24,
  rowHeight = 50,
  margin = [10, 10],
  isEdit = false,
  onLayoutChange,
  onWidgetResize,
  onWidgetMove,
}) => {
  // Convert widgets to grid layout format
  const layout = useMemo<Layout[]>(() => {
    return widgets
      .filter((w) => w.id)
      .map((widget) => ({
        i: widget.id!,
        x: widget.col || 0,
        y: widget.row || 0,
        w: widget.sizeX || 8,
        h: widget.sizeY || 6,
        minW: 2,
        minH: 2,
        isResizable: isEdit,
        isDraggable: isEdit,
      }));
  }, [widgets, isEdit]);

  // Handle layout change
  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      onLayoutChange?.(newLayout);
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
      <GridLayout
        className="layout"
        layout={layout}
        cols={columns}
        rowHeight={rowHeight}
        width={typeof window !== 'undefined' ? window.innerWidth : 1200}
        margin={margin}
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
      </GridLayout>
    </Box>
  );
};

export default DashboardGrid;

