// Widget Actions Service for handling widget actions (RPC, navigation, etc.)

import type { WidgetActionsApi, WidgetActionDescriptor } from '../../types/widget-context.types';

class WidgetActionsService {
  /**
   * Create actions API for widget context
   */
  createActionsApi(
    actionDescriptorsBySourceId: { [actionSourceId: string]: WidgetActionDescriptor[] },
    navigate: (path: string) => void
  ): WidgetActionsApi {
    const api: WidgetActionsApi = {
      actionDescriptorsBySourceId,
    };

    // Add action handlers
    Object.keys(actionDescriptorsBySourceId).forEach((sourceId) => {
      api[sourceId] = (event: any, ...args: any[]) => {
        this.handleAction(sourceId, event, args, navigate);
      };
    });

    return api;
  }

  /**
   * Handle widget action
   */
  private handleAction(
    actionSourceId: string,
    event: any,
    args: any[],
    navigate: (path: string) => void
  ): void {
    // Get action descriptor
    const descriptors = this.getActionDescriptors(actionSourceId);
    if (!descriptors || descriptors.length === 0) {
      console.warn(`No action descriptors found for ${actionSourceId}`);
      return;
    }

    // For now, handle the first action
    // In production, this would be more sophisticated
    const action = descriptors[0];
    
    // Handle different action types
    if (action.actionType === 'openLink') {
      this.handleOpenLink(action, event, args);
    } else if (action.actionType === 'navigate') {
      this.handleNavigate(action, navigate);
    } else if (action.actionType === 'rpc') {
      this.handleRpc(action, event, args);
    } else if (action.actionType === 'updateDashboardState') {
      this.handleUpdateDashboardState(action, event, args);
    }
  }

  /**
   * Get action descriptors for a source
   */
  private getActionDescriptors(_actionSourceId: string): WidgetActionDescriptor[] {
    // This would come from widget config
    return [];
  }

  /**
   * Handle open link action
   */
  private handleOpenLink(action: WidgetActionDescriptor, event: any, args: any[]): void {
    if (action.url) {
      const url = this.interpolateUrl(action.url, event, args);
      if (action.openInNewTab) {
        window.open(url, '_blank');
      } else {
        window.location.href = url;
      }
    }
  }

  /**
   * Handle navigate action
   */
  private handleNavigate(action: WidgetActionDescriptor, navigate: (path: string) => void): void {
    if (action.dashboardStateId) {
      // Navigate to dashboard state
      navigate(`/dashboard/${action.dashboardId}?state=${action.dashboardStateId}`);
    } else if (action.dashboardId) {
      navigate(`/dashboard/${action.dashboardId}`);
    }
  }

  /**
   * Handle RPC action
   */
  private handleRpc(action: WidgetActionDescriptor, _event: any, _args: any[]): void {
    // RPC actions would be handled by controlApi
    console.log('RPC action:', action);
  }

  /**
   * Handle update dashboard state action
   */
  private handleUpdateDashboardState(
    action: WidgetActionDescriptor,
    _event: any,
    _args: any[]
  ): void {
    // Update dashboard state
    console.log('Update dashboard state:', action);
  }

  /**
   * Interpolate URL with entity data
   */
  private interpolateUrl(url: string, _event: any, _args: any[]): string {
    // Simple URL interpolation
    // In production, this would support ThingsBoard entity variables
    return url;
  }
}

export const widgetActionsService = new WidgetActionsService();

