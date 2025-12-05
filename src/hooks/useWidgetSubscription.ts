// Hook for widget data subscription

import { useEffect, useState, useCallback } from 'react';
import { widgetSubscriptionService } from '../services/widget/widget-subscription.service';
import type { WidgetSubscriptionOptions, DatasourceData } from '../types/widget-context.types';
import type { Widget, Timewindow } from '../types/dashboard.types';

interface UseWidgetSubscriptionOptions {
  widget: Widget;
  enabled?: boolean;
}

export const useWidgetSubscription = ({
  widget,
  enabled = true,
}: UseWidgetSubscriptionOptions) => {
  const [data, setData] = useState<DatasourceData[]>([]);
  const [latestData, setLatestData] = useState<DatasourceData[]>([]);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  // Create subscription
  useEffect(() => {
    if (!enabled || !widget.config.datasources || widget.config.datasources.length === 0) {
      return;
    }

    const options: WidgetSubscriptionOptions = {
      type: widget.type,
      datasources: widget.config.datasources,
      timewindow: widget.config.timewindow,
      useDashboardTimewindow: widget.config.useDashboardTimewindow,
    };

    const id = widgetSubscriptionService.createSubscription(options);
    setSubscriptionId(id);

    // Poll for data updates (in production, this would be WebSocket)
    const interval = setInterval(() => {
      const subscriptionData = widgetSubscriptionService.getSubscriptionData(id);
      if (subscriptionData) {
        setData(subscriptionData);
      }
      const latest = widgetSubscriptionService.getSubscriptionLatestData(id);
      if (latest) {
        setLatestData(latest);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      widgetSubscriptionService.removeSubscription(id);
    };
  }, [widget.id, widget.config.datasources, widget.config.timewindow, enabled]);

  // Update timewindow
  const updateTimewindow = useCallback(
    (timewindow: Timewindow) => {
      if (subscriptionId) {
        widgetSubscriptionService.updateTimewindow(subscriptionId, timewindow);
      }
    },
    [subscriptionId]
  );

  return {
    data,
    latestData,
    updateTimewindow,
  };
};

