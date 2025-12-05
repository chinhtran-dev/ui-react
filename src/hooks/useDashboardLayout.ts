// Hook for managing dashboard layout

import { useCallback, useMemo } from 'react';
import type { Layout } from 'react-grid-layout';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateWidget, setDashboardConfiguration } from '../store/slices/dashboard.slice';
import type { Widget, DashboardConfiguration } from '../types/dashboard.types';

export const useDashboardLayout = () => {
  const dispatch = useAppDispatch();
  const { currentDashboard, dashboardConfiguration, widgets } = useAppSelector(
    (state) => state.dashboard
  );

  // Convert widgets to layout format
  const layout = useMemo<Layout[]>(() => {
    return Array.from(widgets.values())
      .filter((w) => w.id)
      .map((widget) => ({
        i: widget.id!,
        x: widget.col || 0,
        y: widget.row || 0,
        w: widget.sizeX || 8,
        h: widget.sizeY || 6,
        minW: 2,
        minH: 2,
      }));
  }, [widgets]);

  // Handle layout change
  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      if (!currentDashboard || !dashboardConfiguration) {
        return;
      }

      // Update widgets from layout
      newLayout.forEach((item) => {
        const widget = widgets.get(item.i);
        if (widget) {
          dispatch(
            updateWidget({
              id: item.i,
              updates: {
                col: item.x,
                row: item.y,
                sizeX: item.w,
                sizeY: item.h,
              },
            })
          );
        }
      });

      // Update dashboard configuration
      const updatedWidgets = Array.from(widgets.values()).map((widget) => {
        const layoutItem = newLayout.find((item) => item.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            col: layoutItem.x,
            row: layoutItem.y,
            sizeX: layoutItem.w,
            sizeY: layoutItem.h,
          };
        }
        return widget;
      });

      const updatedConfig: DashboardConfiguration = {
        ...dashboardConfiguration,
        widgets: updatedWidgets.reduce((acc, widget) => {
          if (widget.id) {
            acc[widget.id] = widget;
          }
          return acc;
        }, {} as { [id: string]: Widget }),
      };

      dispatch(setDashboardConfiguration(updatedConfig));
    },
    [currentDashboard, dashboardConfiguration, widgets, dispatch]
  );

  // Handle widget resize
  const handleWidgetResize = useCallback(
    (widgetId: string, size: { w: number; h: number }) => {
      dispatch(
        updateWidget({
          id: widgetId,
          updates: {
            sizeX: size.w,
            sizeY: size.h,
          },
        })
      );
    },
    [dispatch]
  );

  // Handle widget move
  const handleWidgetMove = useCallback(
    (widgetId: string, position: { x: number; y: number }) => {
      dispatch(
        updateWidget({
          id: widgetId,
          updates: {
            col: position.x,
            row: position.y,
          },
        })
      );
    },
    [dispatch]
  );

  return {
    layout,
    handleLayoutChange,
    handleWidgetResize,
    handleWidgetMove,
  };
};

