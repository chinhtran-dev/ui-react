// Widget Compiler Service for compiling and executing widget controller scripts

import type { WidgetController, WidgetContext } from '../../types/widget-context.types';

// Note: VM2 has security vulnerabilities and doesn't work in browser.
// For browser environment, we'll use Function constructor as fallback.
// In production, consider using:
// - isolated-vm (more secure but requires native compilation)
// - Web Workers with strict CSP
// - Server-side compilation

// VM2 doesn't work in browser, always use Function fallback
// In Node.js environment, VM2 could be used but for now we use Function for consistency
const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  console.warn('Browser environment detected, using Function fallback for widget compilation');
}

class WidgetCompilerService {
  /**
   * Compile widget controller script into executable function
   */
  compileController(script: string, fullFqn: string): WidgetController {
    // Create a dummy context for compilation (to avoid errors when script accesses ctx)
    const dummyCtx = {
      settings: {},
      data: [],
      latestData: [],
      actionsApi: {},
      utils: {},
      datasources: [],
    };

    // Wrap the script in a function that returns the controller
    // The function receives ctx as parameter and assigns it to self.ctx
    // Replace dots and dashes with underscores for valid function name
    const functionName = `_${fullFqn.replace(/[.\-]/g, '_')}`;
    const wrappedScript = `
      return function ${functionName}(ctx) {
        var self = this;
        self.ctx = ctx || {};
        
        ${script}
        
        return self;
      };
    `;

    try {
      // Use Function constructor (works in browser)
      // Note: This is less secure than VM2 but necessary for browser environment
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const WidgetControllerClass = new Function(wrappedScript)();
      // Create instance with dummy context for compilation
      const instance = WidgetControllerClass.call({}, dummyCtx) as WidgetController;
      return instance;
    } catch (error) {
      console.error('Failed to compile widget controller:', error);
      // Return empty controller instead of throwing to prevent app crash
      return {
        onInit: () => {},
        onDataUpdated: () => {},
        onLatestDataUpdated: () => {},
        onResize: () => {},
        onEditModeChanged: () => {},
        onMobileModeChanged: () => {},
        onDestroy: () => {},
      } as WidgetController;
    }
  }

  /**
   * Create widget controller instance with context
   */
  createControllerInstance(
    controllerClass: any,
    context: WidgetContext
  ): WidgetController {
    try {
      const instance = new controllerClass(context);
      return instance as WidgetController;
    } catch (error) {
      console.error('Failed to create controller instance:', error);
      throw new Error(`Failed to create widget controller instance: ${error}`);
    }
  }

  /**
   * Inject dependencies into widget context
   */
  async injectDependencies(context: WidgetContext): Promise<void> {
    // Inject utility libraries
    // Using dynamic imports for browser compatibility
    try {
      const tinycolor = await import('tinycolor2');
      (context as any).tinycolor = tinycolor.default || tinycolor;
    } catch (e) {
      console.warn('tinycolor2 not available');
    }
    
    try {
      const moment = await import('moment');
      (context as any).moment = moment.default || moment;
    } catch (e) {
      console.warn('moment not available');
    }
    
    try {
      const jquery = await import('jquery');
      (context as any).$ = jquery.default || jquery;
      (context as any).jQuery = jquery.default || jquery;
    } catch (e) {
      console.warn('jquery not available');
    }
    
    // Inject CSS parser if available
    try {
      const cssjs = await import('cssjs');
      (context as any).cssjs = cssjs.default || cssjs;
    } catch (e) {
      console.warn('cssjs not available');
    }
  }
}

export const widgetCompilerService = new WidgetCompilerService();

// Export injectDependencies as a standalone function
export const injectWidgetDependencies = async (context: WidgetContext): Promise<void> => {
  await widgetCompilerService.injectDependencies(context);
};

