// Resource Loader Service for loading widget resources (HTML, CSS, JS modules)

class ResourceLoaderService {
  private loadedResources: Map<string, Promise<void>> = new Map();
  private loadedModules: Map<string, any> = new Map();

  /**
   * Load a CSS resource
   */
  async loadCSS(url: string): Promise<void> {
    if (this.loadedResources.has(url)) {
      return this.loadedResources.get(url)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
      document.head.appendChild(link);
    });

    this.loadedResources.set(url, promise);
    return promise;
  }

  /**
   * Load a JavaScript resource
   */
  async loadJS(url: string): Promise<void> {
    if (this.loadedResources.has(url)) {
      return this.loadedResources.get(url)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load JS: ${url}`));
      document.head.appendChild(script);
    });

    this.loadedResources.set(url, promise);
    return promise;
  }

  /**
   * Load a JavaScript module (ES6 module)
   */
  async loadModule(url: string): Promise<any> {
    if (this.loadedModules.has(url)) {
      return this.loadedModules.get(url);
    }

    try {
      const module = await import(/* @vite-ignore */ url);
      this.loadedModules.set(url, module);
      return module;
    } catch (error) {
      throw new Error(`Failed to load module: ${url} - ${error}`);
    }
  }

  /**
   * Load multiple resources
   */
  async loadResources(resources: Array<{ url: string; isModule?: boolean }>): Promise<void> {
    const promises = resources.map((resource) => {
      if (resource.isModule) {
        return this.loadModule(resource.url).then(() => {});
      } else {
        // Determine if it's CSS or JS by extension
        if (resource.url.endsWith('.css')) {
          return this.loadCSS(resource.url);
        } else {
          return this.loadJS(resource.url);
        }
      }
    });

    await Promise.all(promises);
  }

  /**
   * Clear loaded resources cache
   */
  clearCache(): void {
    this.loadedResources.clear();
    this.loadedModules.clear();
  }
}

export const resourceLoaderService = new ResourceLoaderService();

