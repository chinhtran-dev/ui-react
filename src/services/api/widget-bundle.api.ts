// Widget Bundle API

import { apiClient } from './api-client';
import type { WidgetsBundle, PageLink, PageData } from '../../types/widget.types';

export const widgetBundleApi = {
  getWidgetsBundles: async (): Promise<WidgetsBundle[]> => {
    const response = await apiClient.get<WidgetsBundle[]>('/widgetsBundles');
    return response.data;
  },

  getWidgetsBundlesPage: async (pageLink?: PageLink, tenantOnly = false): Promise<PageData<WidgetsBundle>> => {
    const params = {
      ...(pageLink ? {
        page: pageLink.page,
        pageSize: pageLink.pageSize,
        textSearch: pageLink.textSearch,
        sortProperty: pageLink.sortOrder?.key,
        sortOrder: pageLink.sortOrder?.direction,
      } : {}),
      tenantOnly,
    };
    const response = await apiClient.get<PageData<WidgetsBundle>>('/widgetsBundles', { params });
    return response.data;
  },

  getWidgetsBundle: async (id: string): Promise<WidgetsBundle> => {
    const response = await apiClient.get<WidgetsBundle>(`/widgetsBundle/${id}`);
    return response.data;
  },

  saveWidgetsBundle: async (bundle: WidgetsBundle): Promise<WidgetsBundle> => {
    const response = await apiClient.post<WidgetsBundle>('/widgetsBundle', bundle);
    return response.data;
  },

  updateWidgetsBundle: async (bundle: WidgetsBundle): Promise<WidgetsBundle> => {
    const response = await apiClient.post<WidgetsBundle>('/widgetsBundle', bundle);
    return response.data;
  },

  deleteWidgetsBundle: async (id: string): Promise<void> => {
    await apiClient.delete(`/widgetsBundle/${id}`);
  },

  getBundleWidgetTypes: async (bundleId: string): Promise<any[]> => {
    const response = await apiClient.get<any[]>(`/widgetTypes`, {
      params: { widgetsBundleId: bundleId },
    });
    return response.data;
  },

  updateWidgetsBundleWidgetTypes: async (bundleId: string, widgetTypeIds: string[]): Promise<void> => {
    await apiClient.post(`/widgetsBundle/${bundleId}/widgetTypes`, widgetTypeIds);
  },

  updateWidgetsBundleWidgetFqns: async (bundleId: string, widgetTypeFqns: string[]): Promise<void> => {
    await apiClient.post(`/widgetsBundle/${bundleId}/widgetTypeFqns`, widgetTypeFqns);
  },
};

