// Widget Subscription Service for managing data subscriptions

import type {
  WidgetSubscriptionOptions,
  WidgetSubscriptionApi,
  DatasourceData,
  WidgetTimewindow,
} from '../../types/widget-context.types';
import type { Datasource, Timewindow } from '../../types/dashboard.types';

interface WidgetSubscription {
  id: string;
  options: WidgetSubscriptionOptions;
  data?: DatasourceData[];
  latestData?: DatasourceData[];
  timeWindow?: WidgetTimewindow;
  loading: boolean;
  error?: Error;
}

class WidgetSubscriptionService {
  private subscriptions: Map<string, WidgetSubscription> = new Map();
  private subscriptionCounter = 0;
  private wsSubscribers: Map<string, (data: any) => void> = new Map();

  /**
   * Create a new subscription
   */
  createSubscription(options: WidgetSubscriptionOptions): string {
    const id = `subscription-${++this.subscriptionCounter}`;
    
    const subscription: WidgetSubscription = {
      id,
      options,
      loading: true,
    };

    this.subscriptions.set(id, subscription);
    
    // Start data subscription
    this.startSubscription(id, options);
    
    return id;
  }

  /**
   * Remove a subscription
   */
  removeSubscription(id: string): void {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      // Cleanup subscription
      this.stopSubscription(id);
      this.subscriptions.delete(id);
      this.wsSubscribers.delete(id);
    }
  }

  /**
   * Start data subscription
   */
  private async startSubscription(id: string, options: WidgetSubscriptionOptions): Promise<void> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      return;
    }

    try {
      subscription.loading = true;
      subscription.error = undefined;

      // Fetch initial data
      if (options.datasources && options.datasources.length > 0) {
        const data = await this.fetchWidgetData(options);
        subscription.data = data;
      }

      // Subscribe to real-time updates via WebSocket if available
      if (options.timewindow?.realtime) {
        this.subscribeWebSocket(id, options);
      }

      subscription.loading = false;
    } catch (error) {
      console.error('Subscription error:', error);
      subscription.error = error instanceof Error ? error : new Error('Subscription failed');
      subscription.loading = false;
    }
  }

  /**
   * Stop subscription
   */
  private stopSubscription(id: string): void {
    // Unsubscribe from WebSocket
    if (this.wsSubscribers.has(id)) {
      this.wsSubscribers.delete(id);
    }
  }

  /**
   * Fetch widget data from API
   */
  private async fetchWidgetData(options: WidgetSubscriptionOptions): Promise<DatasourceData[]> {
    if (!options.datasources || options.datasources.length === 0) {
      return [];
    }

    const results: DatasourceData[] = [];

    for (const datasource of options.datasources) {
      try {
        // Determine data type based on widget type
        const widgetType = options.type || 'timeseries';
        
        if (widgetType === 'latest') {
          // Fetch latest values
          const latestData = await this.fetchLatestValues(datasource);
          results.push({
            datasource,
            data: [],
            latestValues: latestData,
          });
        } else if (widgetType === 'timeseries') {
          // Fetch time-series data
          const timeSeriesData = await this.fetchTimeSeriesData(datasource, options.timewindow);
          results.push({
            datasource,
            data: timeSeriesData,
          });
        } else if (widgetType === 'alarm') {
          // Fetch alarm data
          const alarmData = await this.fetchAlarmData(datasource, options.timewindow);
          results.push({
            datasource,
            data: alarmData,
          });
        }
      } catch (error) {
        console.error(`Failed to fetch data for datasource ${datasource.name}:`, error);
        results.push({
          datasource,
          data: [],
        });
      }
    }

    return results;
  }

  /**
   * Fetch latest values
   */
  private async fetchLatestValues(_datasource: Datasource): Promise<{ [key: string]: any }> {
    // TODO: Implement actual API call
    // This should call /api/plugins/telemetry/{entityType}/{entityId}/values/attributes
    return {};
  }

  /**
   * Fetch time-series data
   */
  private async fetchTimeSeriesData(
    _datasource: Datasource,
    _timewindow?: Timewindow
  ): Promise<any[]> {
    // TODO: Implement actual API call
    // This should call /api/plugins/telemetry/{entityType}/{entityId}/values/timeseries
    return [];
  }

  /**
   * Fetch alarm data
   */
  private async fetchAlarmData(
    _datasource: Datasource,
    _timewindow?: Timewindow
  ): Promise<any[]> {
    // TODO: Implement actual API call
    // This should call /api/alarms
    return [];
  }

  /**
   * Subscribe to WebSocket for real-time updates
   */
  private subscribeWebSocket(_id: string, _options: WidgetSubscriptionOptions): void {
    // TODO: Implement WebSocket connection
    // Connect to ThingsBoard WebSocket API for real-time telemetry updates
    // For now, this is a placeholder
    console.log('WebSocket subscription placeholder');
  }

  /**
   * Update subscription timewindow
   */
  updateTimewindow(id: string, timewindow: Timewindow): void {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      subscription.options.timewindow = timewindow;
      // Restart subscription with new timewindow
      this.startSubscription(id, subscription.options);
    }
  }

  /**
   * Get subscription data
   */
  getSubscriptionData(id: string): DatasourceData[] | undefined {
    return this.subscriptions.get(id)?.data;
  }

  /**
   * Get subscription latest data
   */
  getSubscriptionLatestData(id: string): DatasourceData[] | undefined {
    return this.subscriptions.get(id)?.latestData;
  }

  /**
   * Create subscription API for widget context
   */
  createSubscriptionApi(): WidgetSubscriptionApi {
    return {
      createSubscription: (options: WidgetSubscriptionOptions) => {
        return this.createSubscription(options);
      },
      removeSubscription: (id: string) => {
        this.removeSubscription(id);
      },
      createSubscriptionFromInfo: (info: any) => {
        return this.createSubscription({
          datasources: info.datasources,
          timewindow: info.timewindow,
          type: info.type,
        });
      },
    };
  }
}

export const widgetSubscriptionService = new WidgetSubscriptionService();
