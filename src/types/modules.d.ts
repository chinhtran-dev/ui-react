// Type declarations for third-party modules

declare module 'tinycolor2' {
  export default class TinyColor {
    constructor(color?: any);
    toHex(): string;
    toRgb(): { r: number; g: number; b: number; a?: number };
    [key: string]: any;
  }
}

declare module 'cssjs' {
  export default class CSSJS {
    cssPreviewNamespace?: string;
    testMode?: boolean;
    createStyleElement(namespace: string, css: string, mode?: string): void;
    [key: string]: any;
  }
}

