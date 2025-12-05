// Widget Loader Service for loading and preparing widgets

import { resourceLoaderService } from './resource-loader.service';
import { widgetCompilerService } from './widget-compiler.service';
import type { WidgetType } from '../../types/widget.types';
import type { WidgetController, WidgetInfo } from '../../types/widget-context.types';

class WidgetLoaderService {
  /**
   * Load widget type and prepare widget info
   */
  async loadWidgetType(fullFqn: string): Promise<WidgetType> {
    // This will use React Query hook, but for service we need direct API call
    // For now, we'll return a promise that can be used with React Query
    const response = await fetch(`/api/widgetType/${fullFqn}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load widget type: ${fullFqn}`);
    }
    
    return response.json();
  }

  /**
   * Load widget resources (HTML, CSS, JS modules)
   */
  async loadWidgetResources(widgetInfo: WidgetInfo): Promise<void> {
    if (widgetInfo.resources && widgetInfo.resources.length > 0) {
      await resourceLoaderService.loadResources(widgetInfo.resources);
    }
  }

  /**
   * Compile widget controller script
   */
  compileController(script: string, fullFqn: string): WidgetController {
    return widgetCompilerService.compileController(script, fullFqn);
  }

  /**
   * Create widget info from widget type
   */
  createWidgetInfo(widgetType: WidgetType): WidgetInfo {
    const descriptor = widgetType.descriptor;
    
    if (!descriptor) {
      throw new Error(`Widget type ${widgetType.fqn} has no descriptor`);
    }
    
    return {
      widgetType,
      fullFqn: widgetType.fqn,
      widgetName: widgetType.name,
      templateHtml: descriptor.templateHtml || '',
      templateCss: descriptor.templateCss || '',
      controllerScript: typeof descriptor.controllerScript === 'string'
        ? descriptor.controllerScript
        : descriptor.controllerScript?.body || '',
      resources: descriptor.resources || [],
      defaultConfig: descriptor.defaultConfig || '{}',
      sizeX: descriptor.sizeX || 8,
      sizeY: descriptor.sizeY || 6,
    };
  }

  /**
   * Load complete widget (type + resources + compile)
   */
  async loadWidget(fullFqn: string): Promise<{
    widgetInfo: WidgetInfo;
    controller: WidgetController;
  }> {
    // Load widget type
    const widgetType = await this.loadWidgetType(fullFqn);
    
    // Create widget info
    const widgetInfo = this.createWidgetInfo(widgetType);
    
    // Load resources
    await this.loadWidgetResources(widgetInfo);
    
    // Compile controller
    const controller = this.compileController(
      widgetInfo.controllerScript,
      widgetInfo.fullFqn
    );
    
    return {
      widgetInfo,
      controller,
    };
  }
}

export const widgetLoaderService = new WidgetLoaderService();

