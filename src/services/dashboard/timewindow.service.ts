// Timewindow service

import type { Timewindow } from '../../types/dashboard.types';

export interface TimewindowOptions {
  realtime?: {
    timewindowMs: number;
  };
  history?: {
    timewindowMs: number;
    intervalMs: number;
    aggregationType: string;
    limit: number;
  };
  aggregation?: {
    type: string;
    limit: number;
    interval: number;
  };
}

export class TimewindowService {
  /**
   * Get default timewindow
   */
  defaultTimewindow(): Timewindow {
    return {
      realtime: {
        timewindowMs: 60000, // 1 minute
      },
    };
  }

  /**
   * Create realtime timewindow
   */
  createRealtimeTimewindow(timewindowMs: number): Timewindow {
    return {
      realtime: {
        timewindowMs,
      },
    };
  }

  /**
   * Create history timewindow
   */
  createHistoryTimewindow(
    timewindowMs: number,
    intervalMs: number,
    aggregationType: string = 'NONE',
    limit: number = 100
  ): Timewindow {
    return {
      history: {
        timewindowMs,
        intervalMs,
        aggregationType,
        limit,
      },
    };
  }

  /**
   * Check if timewindow is realtime
   */
  isRealtime(timewindow: Timewindow | undefined): boolean {
    return !!timewindow?.realtime;
  }

  /**
   * Check if timewindow is history
   */
  isHistory(timewindow: Timewindow | undefined): boolean {
    return !!timewindow?.history;
  }

  /**
   * Get timewindow duration in milliseconds
   */
  getDuration(timewindow: Timewindow | undefined): number {
    if (timewindow?.realtime) {
      return timewindow.realtime.timewindowMs;
    }
    if (timewindow?.history) {
      return timewindow.history.timewindowMs;
    }
    return 0;
  }

  /**
   * Get timewindow interval in milliseconds
   */
  getInterval(timewindow: Timewindow | undefined): number {
    if (timewindow?.history) {
      return timewindow.history.intervalMs;
    }
    return 0;
  }

  /**
   * Format timewindow for display
   */
  formatTimewindow(timewindow: Timewindow | undefined): string {
    if (!timewindow) {
      return 'No timewindow';
    }

    if (timewindow.realtime) {
      const ms = timewindow.realtime.timewindowMs;
      if (ms < 1000) {
        return `${ms}ms`;
      }
      if (ms < 60000) {
        return `${ms / 1000}s`;
      }
      if (ms < 3600000) {
        return `${ms / 60000}m`;
      }
      return `${ms / 3600000}h`;
    }

    if (timewindow.history) {
      const duration = this.formatDuration(timewindow.history.timewindowMs);
      const interval = this.formatDuration(timewindow.history.intervalMs);
      return `${duration} (${interval} interval)`;
    }

    return 'Unknown';
  }

  /**
   * Format duration in milliseconds to human readable string
   */
  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    if (ms < 60000) {
      return `${ms / 1000}s`;
    }
    if (ms < 3600000) {
      return `${ms / 60000}m`;
    }
    if (ms < 86400000) {
      return `${ms / 3600000}h`;
    }
    return `${ms / 86400000}d`;
  }
}

export const timewindowService = new TimewindowService();

