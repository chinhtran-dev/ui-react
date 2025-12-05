// Dashboard slice for Redux

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Dashboard, DashboardConfiguration, Widget, WidgetLayouts } from '../../types/dashboard.types';

interface DashboardState {
  currentDashboard: Dashboard | null;
  dashboardConfiguration: DashboardConfiguration | null;
  widgets: Widget[];
  widgetLayouts: WidgetLayouts;
  isEdit: boolean;
  isEditingWidget: boolean;
  isMobile: boolean;
  selectedWidgetId: string | null;
}

const initialState: DashboardState = {
  currentDashboard: null,
  dashboardConfiguration: null,
  widgets: [],
  widgetLayouts: {},
  isEdit: false,
  isEditingWidget: false,
  isMobile: false,
  selectedWidgetId: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboard: (state, action: PayloadAction<Dashboard>) => {
      state.currentDashboard = action.payload;
      state.dashboardConfiguration = action.payload.configuration || {};
      // Convert widgets array or object to plain array
      if (action.payload.configuration?.widgets) {
        const widgets = Array.isArray(action.payload.configuration.widgets)
          ? action.payload.configuration.widgets
          : Object.values(action.payload.configuration.widgets);
        state.widgets = widgets;
      }
      // WidgetLayouts should be from configuration, not states
      // For now, initialize as empty object
      state.widgetLayouts = {};
    },
    setDashboardConfiguration: (state, action: PayloadAction<DashboardConfiguration>) => {
      state.dashboardConfiguration = action.payload;
    },
    addWidget: (state, action: PayloadAction<Widget>) => {
      const widget = action.payload;
      if (widget.id) {
        state.widgets.push(widget);
      }
    },
    updateWidget: (state, action: PayloadAction<{ id: string; updates: Partial<Widget> }>) => {
      const { id, updates } = action.payload;
      const idx = state.widgets.findIndex((w) => w.id === id);
      if (idx > -1) {
        state.widgets[idx] = { ...state.widgets[idx], ...updates };
      }
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter((w) => w.id !== action.payload);
      if (state.selectedWidgetId === action.payload) {
        state.selectedWidgetId = null;
      }
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEdit = action.payload;
    },
    setEditingWidget: (state, action: PayloadAction<boolean>) => {
      state.isEditingWidget = action.payload;
    },
    setSelectedWidget: (state, action: PayloadAction<string | null>) => {
      state.selectedWidgetId = action.payload;
    },
    setMobileMode: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

export const {
  setDashboard,
  setDashboardConfiguration,
  addWidget,
  updateWidget,
  removeWidget,
  setEditMode,
  setEditingWidget,
  setSelectedWidget,
  setMobileMode,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

