// Widget API

import { apiClient } from './api-client';
import type { WidgetType, WidgetTypeDetails } from '../../types/widget.types';

export const widgetApi = {
  getWidgetType: async (fullFqn: string): Promise<WidgetType> => {
    const response = await apiClient.get<WidgetType>(`/widgetType/${fullFqn}`);
    return response.data;
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

