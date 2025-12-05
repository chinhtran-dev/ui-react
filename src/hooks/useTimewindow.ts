// Hook for managing timewindow

import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { timewindowService } from '../services/dashboard/timewindow.service';

export function useTimewindow() {
  const dashboard = useAppSelector((state) => state.dashboard.currentDashboard);
  const timewindow = useMemo(() => {
    return dashboard?.configuration?.timewindow || timewindowService.defaultTimewindow();
  }, [dashboard]);

  const isRealtime = useMemo(() => {
    return timewindowService.isRealtime(timewindow);
  }, [timewindow]);

  const isHistory = useMemo(() => {
    return timewindowService.isHistory(timewindow);
  }, [timewindow]);

  const duration = useMemo(() => {
    return timewindowService.getDuration(timewindow);
  }, [timewindow]);

  const interval = useMemo(() => {
    return timewindowService.getInterval(timewindow);
  }, [timewindow]);

  const formatted = useMemo(() => {
    return timewindowService.formatTimewindow(timewindow);
  }, [timewindow]);

  return {
    timewindow,
    isRealtime,
    isHistory,
    duration,
    interval,
    formatted,
    service: timewindowService,
  };
}

