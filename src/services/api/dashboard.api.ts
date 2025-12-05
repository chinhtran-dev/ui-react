// Dashboard API

import { apiClient } from './api-client';
import type { Dashboard, DashboardConfiguration, PageLink, PageData } from '../../types/dashboard.types';

export const dashboardApi = {
  getDashboard: async (id: string): Promise<Dashboard> => {
    const response = await apiClient.get<Dashboard>(`/dashboard/${id}`);
    return response.data;
  },

  getDashboards: async (pageLink?: PageLink): Promise<PageData<Dashboard>> => {
    const params = pageLink ? {
      page: pageLink.page,
      pageSize: pageLink.pageSize,
      textSearch: pageLink.textSearch,
      sortProperty: pageLink.sortOrder?.key,
      sortOrder: pageLink.sortOrder?.direction,
    } : {};
    const response = await apiClient.get<PageData<Dashboard>>('/dashboards', { params });
    return response.data;
  },

  getTenantDashboards: async (pageLink?: PageLink): Promise<PageData<Dashboard>> => {
    const params = pageLink ? {
      page: pageLink.page,
      pageSize: pageLink.pageSize,
      textSearch: pageLink.textSearch,
      sortProperty: pageLink.sortOrder?.key,
      sortOrder: pageLink.sortOrder?.direction,
    } : {};
    const response = await apiClient.get<PageData<Dashboard>>('/tenant/dashboards', { params });
    return response.data;
  },

  saveDashboard: async (dashboard: Dashboard): Promise<Dashboard> => {
    const response = await apiClient.post<Dashboard>('/dashboard', dashboard);
    return response.data;
  },

  updateDashboard: async (dashboard: Dashboard): Promise<Dashboard> => {
    const response = await apiClient.post<Dashboard>('/dashboard', dashboard);
    return response.data;
  },

  deleteDashboard: async (id: string): Promise<void> => {
    await apiClient.delete(`/dashboard/${id}`);
  },

  getDashboardConfiguration: async (id: string): Promise<DashboardConfiguration> => {
    const dashboard = await dashboardApi.getDashboard(id);
    return dashboard.configuration || {};
  },

  updateDashboardConfiguration: async (id: string, configuration: DashboardConfiguration): Promise<Dashboard> => {
    const dashboard = await dashboardApi.getDashboard(id);
    dashboard.configuration = configuration;
    return dashboardApi.updateDashboard(dashboard);
  },
};

