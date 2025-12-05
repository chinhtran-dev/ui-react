// Hook for managing widget instance lifecycle

import { useEffect, useRef, useState } from 'react';
import { widgetLoaderService } from '../services/widget/widget-loader.service';
import { useWidgetType } from './useWidgetTypes';
import type { WidgetController, WidgetContext } from '../types/widget-context.types';
import type { Widget } from '../types/dashboard.types';

interface UseWidgetInstanceOptions {
  widget: Widget;
  context: WidgetContext;
}

export const useWidgetInstance = ({ widget, context }: UseWidgetInstanceOptions) => {
  const [controller, setController] = useState<WidgetController | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<WidgetController | null>(null);

  const { data: widgetType } = useWidgetType(widget.typeFullFqn);

  useEffect(() => {
    if (!widgetType) {
      return;
    }

    const loadWidget = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create widget info
        const widgetInfo = widgetLoaderService.createWidgetInfo(widgetType);

        // Load resources
        await widgetLoaderService.loadWidgetResources(widgetInfo);

        // Compile controller
        const compiledController = widgetLoaderService.compileController(
          widgetInfo.controllerScript,
          widgetInfo.fullFqn
        );

        // Inject dependencies
        const { injectWidgetDependencies } = await import('../services/widget/widget-compiler.service');
        await injectWidgetDependencies(context);

        // Create controller instance - compiledController is already an instance
        const instance = compiledController;
        controllerRef.current = instance;
        setController(instance);

        // Call onInit
        if (instance.onInit) {
          instance.onInit();
        }
      } catch (err) {
        console.error('Failed to load widget:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    loadWidget();

    // Cleanup on unmount
    return () => {
      if (controllerRef.current?.onDestroy) {
        try {
          controllerRef.current.onDestroy();
        } catch (err) {
          console.error('Error in widget onDestroy:', err);
        }
      }
    };
  }, [widget.typeFullFqn, widgetType]);

  // Handle data updates
  useEffect(() => {
    if (controller && context.data) {
      if (controller.onDataUpdated) {
        controller.onDataUpdated();
      }
    }
  }, [controller, context.data]);

  // Handle latest data updates
  useEffect(() => {
    if (controller && context.latestData) {
      if (controller.onLatestDataUpdated) {
        controller.onLatestDataUpdated();
      }
    }
  }, [controller, context.latestData]);

  // Handle resize
  useEffect(() => {
    if (controller && context.width && context.height) {
      if (controller.onResize) {
        controller.onResize();
      }
    }
  }, [controller, context.width, context.height]);

  // Handle edit mode changes
  useEffect(() => {
    if (controller && context.isEdit !== undefined) {
      if (controller.onEditModeChanged) {
        controller.onEditModeChanged(context.isEdit);
      }
    }
  }, [controller, context.isEdit]);

  // Handle mobile mode changes
  useEffect(() => {
    if (controller && context.isMobile !== undefined) {
      if (controller.onMobileModeChanged) {
        controller.onMobileModeChanged(context.isMobile);
      }
    }
  }, [controller, context.isMobile]);

  return {
    controller,
    isLoading,
    error,
    templateHtml: widgetType?.descriptor.templateHtml || '',
    templateCss: widgetType?.descriptor.templateCss || '',
  };
};

