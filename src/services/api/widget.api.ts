// Widget API

import { apiClient } from './api-client';
import type { WidgetType, WidgetTypeDetails } from '../../types/widget.types';

// Load mock widgets data
async function loadMockWidgets(): Promise<WidgetType[]> {
  try {
    const response = await fetch(new URL('../../mocks/widgets.json', import.meta.url));
    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.warn('Failed to load mock widgets:', error);
    return [];
  }
}

export const widgetApi = {
  getWidgetType: async (fullFqn: string): Promise<WidgetType> => {
    try {
      const response = await apiClient.get<WidgetType>(`/widgetType/${fullFqn}`);
      // Check if response has valid data with descriptor
      if (response.data && response.data.descriptor) {
        return response.data;
      }
      // If response is empty or invalid, fall through to mock
      throw new Error('Invalid widget type response');
    } catch (error) {
      // Fallback to mock data
      console.warn(`Widget type ${fullFqn} not found in API, using mock data`);
      const mockWidgets = await loadMockWidgets();
      const mockWidget = mockWidgets.find((w) => w.fqn === fullFqn);
      if (mockWidget) {
        return mockWidget;
      }
      throw new Error(`Widget type ${fullFqn} not found`);
    }
  },

  getWidgetTypes: async (widgetsBundleId?: string): Promise<WidgetType[]> => {
    const params = widgetsBundleId ? { widgetsBundleId } : {};
    const response = await apiClient.get<WidgetType[]>('/widgetTypes', { params });
    return response.data;
  },

  saveWidgetType: async (widgetType: WidgetTypeDetails): Promise<WidgetType> => {
    const response = await apiClient.post<WidgetType>('/widgetType', widgetType);
    return response.data;
  },

  deleteWidgetType: async (id: string): Promise<void> => {
    await apiClient.delete(`/widgetType/${id}`);
  },

  exportWidgetType: async (id: string, includeResources = false): Promise<WidgetTypeDetails> => {
    const response = await apiClient.get<WidgetTypeDetails>(`/widgetType/${id}`, {
      params: { inlineImages: includeResources },
    });
    return response.data;
  },

  importWidgetType: async (widgetType: WidgetTypeDetails): Promise<WidgetType> => {
    const response = await apiClient.post<WidgetType>('/widgetType', widgetType);
    return response.data;
  },
};

