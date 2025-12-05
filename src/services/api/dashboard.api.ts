// Dashboard API

import { apiClient } from './api-client';
import type { Dashboard, DashboardConfiguration, PageLink, PageData } from '../../types/dashboard.types';

export const dashboardApi = {
  getDashboard: async (id: string): Promise<Dashboard> => {
    try {
      const response = await apiClient.get<Dashboard>(`/dashboard/${id}`);
      const data = response.data;
      if (!hasWidgets(data)) {
        const mock = await loadMockDashboard();
        if (mock.id?.id === id || (mock.id as any) === id) {
          return mock;
        }
      }
      return data;
    } catch (e) {
      // Fallback to mock
      const mock = await loadMockDashboard();
      if (mock.id?.id === id || (mock.id as any) === id) {
        return mock;
      }
      throw e;
    }
  },

  getDashboards: async (pageLink?: PageLink): Promise<PageData<Dashboard>> => {
    try {
      const params = pageLink ? {
        page: pageLink.page,
        pageSize: pageLink.pageSize,
        textSearch: pageLink.textSearch,
        sortProperty: pageLink.sortOrder?.key,
        sortOrder: pageLink.sortOrder?.direction,
      } : {};
      const response = await apiClient.get<PageData<Dashboard>>('/dashboards', { params });
      const pageData = response.data;
      if (!pageData?.data?.length) {
        const mock = await loadMockDashboard();
        return {
          data: [mock],
          totalPages: 1,
          totalElements: 1,
          hasNext: false
        };
      }
      return pageData;
    } catch (_e) {
      // Fallback to mock list
      const mock = await loadMockDashboard();
      return {
        data: [mock],
        totalPages: 1,
        totalElements: 1,
        hasNext: false
      };
    }
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

async function loadMockDashboard(): Promise<Dashboard> {
  const mockUrl = new URL('../../mocks/dashboard.json', import.meta.url);
  const resp = await fetch(mockUrl);
  const data = (await resp.json()) as Dashboard;
  return normalizeDashboard(data);
}

function normalizeDashboard(d: Dashboard): Dashboard {
  const id = (d as any).id;
  const normalizedId = typeof id === 'string' ? { id, entityType: 'DASHBOARD' } : id;
  return {
    ...d,
    id: normalizedId,
    configuration: d.configuration || {},
  };
}

function hasWidgets(d?: Dashboard): boolean {
  const widgets = d?.configuration?.widgets;
  if (!widgets) return false;
  if (Array.isArray(widgets)) {
    return widgets.length > 0;
  }
  return Object.keys(widgets).length > 0;
}

