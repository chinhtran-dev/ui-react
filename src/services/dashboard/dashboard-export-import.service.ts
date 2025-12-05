// Dashboard export/import service

import type { Dashboard, DashboardConfiguration } from '../../types/dashboard.types';

export class DashboardExportImportService {
  /**
   * Export dashboard to JSON
   */
  exportDashboard(dashboard: Dashboard): string {
    const exportData = {
      name: dashboard.title,
      configuration: dashboard.configuration,
      // Add other exportable fields
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export dashboard to file
   */
  exportDashboardToFile(dashboard: Dashboard, filename?: string): void {
    const json = this.exportDashboard(dashboard);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${dashboard.title || 'dashboard'}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Import dashboard from JSON string
   */
  importDashboard(jsonString: string): Partial<Dashboard> {
    try {
      const data = JSON.parse(jsonString);
      return {
        title: data.name || data.title,
        configuration: data.configuration || {},
      };
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  }

  /**
   * Import dashboard from file
   */
  async importDashboardFromFile(file: File): Promise<Partial<Dashboard>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          const dashboard = this.importDashboard(jsonString);
          resolve(dashboard);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Validate dashboard configuration
   */
  validateDashboard(dashboard: Partial<Dashboard>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!dashboard.title) {
      errors.push('Dashboard title is required');
    }

    if (!dashboard.configuration) {
      errors.push('Dashboard configuration is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Clone dashboard configuration
   */
  cloneDashboard(dashboard: Dashboard, newTitle?: string): Partial<Dashboard> {
    const clonedConfig = this.deepCloneConfiguration(dashboard.configuration);
    return {
      title: newTitle || `${dashboard.title} (Copy)`,
      configuration: clonedConfig,
    };
  }

  /**
   * Deep clone dashboard configuration
   */
  private deepCloneConfiguration(
    configuration: DashboardConfiguration | undefined
  ): DashboardConfiguration {
    if (!configuration) {
      return {};
    }
    return JSON.parse(JSON.stringify(configuration));
  }
}

export const dashboardExportImportService = new DashboardExportImportService();

