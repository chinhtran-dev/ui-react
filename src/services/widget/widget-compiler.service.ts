// Widget Compiler Service for compiling and executing widget controller scripts

import { VM } from 'vm2';
import type { WidgetController, WidgetContext } from '../../types/widget-context.types';

// Note: VM2 has security vulnerabilities. In production, consider using:
// - isolated-vm (more secure but requires native compilation)
// - Web Workers with strict CSP
// - Server-side compilation

class WidgetCompilerService {
  /**
   * Compile widget controller script into executable function
   */
  compileController(script: string, fullFqn: string): WidgetController {
    // Wrap the script in a function that returns the controller
    const wrappedScript = `
      return function _${fullFqn.replace(/\./g, '_')}(ctx) {
        var self = this;
        self.ctx = ctx;
        
        ${script}
      };
    `;

    try {
      // Create VM with limited access
      const vm = new VM({
        timeout: 5000, // 5 second timeout
        sandbox: {
          // Provide minimal global objects
          console: {
            log: (...args: any[]) => console.log('[Widget]', ...args),
            error: (...args: any[]) => console.error('[Widget]', ...args),
            warn: (...args: any[]) => console.warn('[Widget]', ...args),
          },
        },
      });

      // Compile the function
      const WidgetControllerClass = vm.run(wrappedScript);
      return new WidgetControllerClass() as WidgetController;
    } catch (error) {
      console.error('Failed to compile widget controller:', error);
      throw new Error(`Widget compilation failed: ${error}`);
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

