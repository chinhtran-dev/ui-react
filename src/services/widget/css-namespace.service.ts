// CSS Namespace Service for isolating widget CSS

/**
 * Create a unique namespace for widget CSS
 */
export function createWidgetNamespace(fullFqn: string, widgetId?: string): string {
  const hash = hashCode(`${fullFqn}-${widgetId || ''}`);
  return `widget-${fullFqn.replace(/\./g, '-')}-${hash}`;
}

/**
 * Hash function for generating unique identifiers
 */
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Apply namespace to CSS rules
 */
export function namespaceCSS(css: string, namespace: string): string {
  if (!css || !namespace) {
    return css;
  }

  // Simple CSS namespace implementation
  // This wraps all CSS selectors with the namespace class
  
  // Match CSS rules (selector { ... })
  // Improved regex to handle nested braces and comments
  const ruleRegex = /([^{}@]+)\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g;
  let namespacedCSS = css.replace(ruleRegex, (match, selector, rules) => {
    const trimmedSelector = selector.trim();
    
    // Skip @ rules (media queries, keyframes, etc.)
    if (trimmedSelector.startsWith('@')) {
      return match;
    }
    
    // Skip empty selectors
    if (!trimmedSelector) {
      return match;
    }

    // Apply namespace to selectors
    const namespacedSelector = trimmedSelector
      .split(',')
      .map((sel: string) => {
        const trimmed = sel.trim();
        // Don't namespace if it already starts with the namespace
        if (trimmed.startsWith(`.${namespace}`)) {
          return trimmed;
        }
        // Handle :root, html, body
        if (trimmed.match(/^(:root|html|body)(\s|$)/)) {
          return trimmed.replace(/^(:root|html|body)(\s|$)/, `$1 .${namespace}$2`);
        }
        // Add namespace class - ensure it's a descendant selector
        return `.${namespace} ${trimmed}`;
      })
      .join(', ');

    return `${namespacedSelector} {${rules}}`;
  });

  return namespacedCSS;
}

/**
 * Inject namespaced CSS into the document
 */
export function injectNamespacedCSS(css: string, namespace: string): HTMLStyleElement {
  // Remove existing style if any
  removeNamespacedCSS(namespace);
  
  const namespacedCSS = namespaceCSS(css, namespace);
  const styleElement = document.createElement('style');
  styleElement.id = `widget-style-${namespace}`;
  styleElement.setAttribute('data-widget-namespace', namespace);
  styleElement.textContent = namespacedCSS;
  document.head.appendChild(styleElement);
  return styleElement;
}

/**
 * Remove namespaced CSS from the document
 */
export function removeNamespacedCSS(namespace: string): void {
  const styleElement = document.getElementById(`widget-style-${namespace}`);
  if (styleElement) {
    styleElement.remove();
  }
}

