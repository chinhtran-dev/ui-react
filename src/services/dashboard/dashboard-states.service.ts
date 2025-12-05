// Dashboard states service

import type { Dashboard, DashboardConfiguration, DashboardState } from '../../types/dashboard.types';

export class DashboardStatesService {
  /**
   * Get all states from dashboard configuration
   */
  getStates(dashboard: Dashboard | null): DashboardState[] {
    if (!dashboard?.configuration?.states) {
      return [];
    }
    return Object.entries(dashboard.configuration.states).map(([id, state]) => ({
      ...state,
      id,
    }));
  }

  /**
   * Get state by ID
   */
  getState(dashboard: Dashboard | null, stateId: string): DashboardState | null {
    if (!dashboard?.configuration?.states?.[stateId]) {
      return null;
    }
    return {
      ...dashboard.configuration.states[stateId],
      id: stateId,
    };
  }

  /**
   * Get root state
   */
  getRootState(dashboard: Dashboard | null): DashboardState | null {
    const states = this.getStates(dashboard);
    return states.find((state) => state.root) || null;
  }

  /**
   * Add or update state
   */
  setState(
    configuration: DashboardConfiguration,
    stateId: string,
    state: Partial<DashboardState>
  ): DashboardConfiguration {
    if (!configuration.states) {
      configuration.states = {};
    }
    configuration.states[stateId] = {
      ...state,
      id: stateId,
    } as DashboardState;
    return configuration;
  }

  /**
   * Remove state
   */
  removeState(configuration: DashboardConfiguration, stateId: string): DashboardConfiguration {
    if (configuration.states) {
      delete configuration.states[stateId];
    }
    return configuration;
  }

  /**
   * Set root state
   */
  setRootState(configuration: DashboardConfiguration, stateId: string): DashboardConfiguration {
    if (!configuration.states) {
      return configuration;
    }
    // Unset all root flags
    Object.keys(configuration.states).forEach((id) => {
      if (configuration.states![id]) {
        configuration.states![id].root = false;
      }
    });
    // Set new root
    if (configuration.states[stateId]) {
      configuration.states[stateId].root = true;
    }
    return configuration;
  }

  /**
   * Check if state exists
   */
  hasState(dashboard: Dashboard | null, stateId: string): boolean {
    return !!dashboard?.configuration?.states?.[stateId];
  }

  /**
   * Get state name
   */
  getStateName(dashboard: Dashboard | null, stateId: string): string {
    const state = this.getState(dashboard, stateId);
    return state?.name || stateId;
  }
}

export const dashboardStatesService = new DashboardStatesService();

