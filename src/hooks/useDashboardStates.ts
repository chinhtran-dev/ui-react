// Hook for managing dashboard states

import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { dashboardStatesService } from '../services/dashboard/dashboard-states.service';

export function useDashboardStates() {
  const dashboard = useAppSelector((state) => state.dashboard.currentDashboard);

  const states = useMemo(() => {
    return dashboardStatesService.getStates(dashboard);
  }, [dashboard]);

  const rootState = useMemo(() => {
    return dashboardStatesService.getRootState(dashboard);
  }, [dashboard]);

  const getState = (stateId: string) => {
    return dashboardStatesService.getState(dashboard, stateId);
  };

  const getStateName = (stateId: string) => {
    return dashboardStatesService.getStateName(dashboard, stateId);
  };

  const hasState = (stateId: string) => {
    return dashboardStatesService.hasState(dashboard, stateId);
  };

  return {
    states,
    rootState,
    getState,
    getStateName,
    hasState,
  };
}

