// Widget Context Provider

import React, { createContext, useContext, useRef, useEffect, useMemo } from 'react';
import { widgetSubscriptionService } from '../services/widget/widget-subscription.service';
import { widgetActionsService } from '../services/widget/widget-actions.service';
import { createWidgetNamespace } from '../services/widget/css-namespace.service';
import type { WidgetContext as WidgetContextType, WidgetActionDescriptor } from '../types/widget-context.types';
import type { Widget } from '../types/dashboard.types';

interface WidgetContextProviderProps {
  widget: Widget;
  children: React.ReactNode;
  isEdit?: boolean;
  isPreview?: boolean;
  isMobile?: boolean;
}

const WidgetContext = createContext<WidgetContextType | null>(null);

export const WidgetContextProvider: React.FC<WidgetContextProviderProps> = ({
  widget,
  children,
  isEdit = false,
  isPreview = false,
  isMobile = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetNamespace = createWidgetNamespace(widget.typeFullFqn, widget.id);
  
  // Get action descriptors from widget config
  const actionDescriptorsBySourceId: { [actionSourceId: string]: WidgetActionDescriptor[] } =
    widget.config.actions || {};

  // Create actions API with navigation function
  const actionsApi = useMemo(() => {
    const navigate = (path: string) => {
      window.location.href = path;
    };
    return widgetActionsService.createActionsApi(actionDescriptorsBySourceId, navigate);
  }, [actionDescriptorsBySourceId]);

  const context = useMemo<WidgetContextType>(() => ({
    widget,
    widgetId: widget.id || '',
    settings: widget.config.settings || {},
    isEdit,
    isPreview,
    isMobile,
    widgetNamespace,
    subscriptionApi: widgetSubscriptionService.createSubscriptionApi(),
    actionsApi,
    datasources: widget.config.datasources || [],
    utils: {
      formatValue: (value: any, units?: string, decimals?: number) => {
        if (value === null || value === undefined) return '-';
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        if (isNaN(numValue)) return String(value);
        const formatted = decimals !== undefined 
          ? numValue.toFixed(decimals)
          : numValue.toString();
        return units ? `${formatted} ${units}` : formatted;
      },
      getEntityDetailsPageURL: (entityId: string, entityType: string) => {
        return `/${entityType}/${entityId}`;
      },
      customTranslation: (_key: string, defaultValue: string) => {
        // TODO: Implement translation
        return defaultValue;
      },
    },
  }), [widget, isEdit, isPreview, isMobile, widgetNamespace, actionsApi]);

  useEffect(() => {
    if (containerRef.current) {
      context.$container = containerRef.current;
      context.width = containerRef.current.offsetWidth;
      context.height = containerRef.current.offsetHeight;
    }
  }, [context]);

  return (
    <WidgetContext.Provider value={context}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = (): WidgetContextType => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgetContext must be used within WidgetContextProvider');
  }
  return context;
};

