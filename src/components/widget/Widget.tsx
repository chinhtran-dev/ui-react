// Widget Component - Main widget rendering component

import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { WidgetContextProvider, useWidgetContext } from '../../contexts/WidgetContext';
import { useWidgetInstance } from '../../hooks/useWidgetInstance';
import { useWidgetSubscription } from '../../hooks/useWidgetSubscription';
import {
  injectNamespacedCSS,
  removeNamespacedCSS,
  createWidgetNamespace,
} from '../../services/widget/css-namespace.service';
import type { Widget } from '../../types/dashboard.types';

interface WidgetProps {
  widget: Widget;
  isEdit?: boolean;
  isPreview?: boolean;
  isMobile?: boolean;
}

const WidgetContent: React.FC = () => {
  const context = useWidgetContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const { controller, isLoading, error, templateHtml, templateCss } = useWidgetInstance({
    widget: context.widget,
    context,
  });
  
  // Subscribe to widget data
  const { data, latestData } = useWidgetSubscription({
    widget: context.widget,
    enabled: !context.isEdit,
  });

  // Update context with subscription data
  useEffect(() => {
    if (data) {
      context.data = data;
    }
    if (latestData) {
      context.latestData = latestData;
    }
  }, [data, latestData, context]);

  // Inject CSS with namespace
  useEffect(() => {
    if (templateCss && context.widgetNamespace) {
      injectNamespacedCSS(templateCss, context.widgetNamespace);
      
      return () => {
        removeNamespacedCSS(context.widgetNamespace!);
      };
    }
  }, [templateCss, context.widgetNamespace]);

  // Render HTML template
  useEffect(() => {
    if (contentRef.current && templateHtml && controller) {
      // Set namespace class on container
      if (context.widgetNamespace) {
        contentRef.current.className = context.widgetNamespace;
      }
      
      // Render HTML (be careful with XSS)
      contentRef.current.innerHTML = templateHtml;
    }
  }, [templateHtml, controller, context.widgetNamespace]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load widget: {error.message}
      </Alert>
    );
  }

  return (
    <Box
      ref={contentRef}
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
    />
  );
};

const Widget: React.FC<WidgetProps> = ({ widget, isEdit = false, isPreview = false, isMobile = false }) => {
  const namespace = createWidgetNamespace(widget.typeFullFqn, widget.id);

  return (
    <WidgetContextProvider
      widget={widget}
      isEdit={isEdit}
      isPreview={isPreview}
      isMobile={isMobile}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
        className={namespace}
      >
        <WidgetContent />
      </Box>
    </WidgetContextProvider>
  );
};

export default Widget;

