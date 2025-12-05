// Hook for responsive dashboard layout

import { useMemo } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layout } from 'react-grid-layout';
import type { Widget } from '../types/dashboard.types';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface UseResponsiveLayoutOptions {
  widgets: Widget[];
  breakpoints?: { [key: string]: number };
  cols?: { [key: string]: number };
  isEdit?: boolean;
}

export const useResponsiveLayout = ({
  widgets,
  breakpoints = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
  },
  cols = {
    lg: 24,
    md: 20,
    sm: 16,
    xs: 12,
    xxs: 8,
  },
  isEdit = false,
}: UseResponsiveLayoutOptions) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Convert widgets to layouts for each breakpoint
  const layouts = useMemo(() => {
    const baseLayout: Layout[] = widgets
      .filter((w) => w.id)
      .map((widget) => ({
        i: widget.id!,
        x: widget.col || 0,
        y: widget.row || 0,
        // default footprint from config, but allow shrinking down to 1x1
        w: Math.max(1, Math.round(widget.sizeX || 8)),
        h: Math.max(1, Math.round(widget.sizeY || 6)),
        minW: 1,
        minH: 1,
        isResizable: isEdit,
        isDraggable: isEdit,
      }));

    // For now, use same layout for all breakpoints
    // Can be enhanced to have different layouts per breakpoint
    return {
      lg: baseLayout,
      md: baseLayout,
      sm: baseLayout,
      xs: baseLayout,
      xxs: baseLayout,
    };
  }, [widgets, isEdit]);

  return {
    layouts,
    breakpoints,
    cols,
    isMobile,
    isTablet,
    ResponsiveGridLayout,
  };
};

