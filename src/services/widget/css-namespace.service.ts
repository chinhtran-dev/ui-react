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
  // More sophisticated parsing can be added later
  
  // Match CSS rules (selector { ... })
  const ruleRegex = /([^{]+)\{([^}]+)\}/g;
  let namespacedCSS = css.replace(ruleRegex, (match, selector, rules) => {
    // Skip @ rules (media queries, keyframes, etc.)
    if (selector.trim().startsWith('@')) {
      return match;
    }

    // Apply namespace to selectors
    const namespacedSelector = selector
      .split(',')
      .map((sel: string) => {
        const trimmed = sel.trim();
        // Don't namespace if it already starts with the namespace
        if (trimmed.startsWith(`.${namespace}`)) {
          return trimmed;
        }
        // Don't namespace :root, html, body at the start
        if (trimmed.match(/^(:root|html|body)\s/)) {
          return trimmed.replace(/^(:root|html|body)\s/, `$1 .${namespace} `);
        }
        // Add namespace class
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
  const namespacedCSS = namespaceCSS(css, namespace);
  const styleElement = document.createElement('style');
  styleElement.id = `widget-style-${namespace}`;
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

