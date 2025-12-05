// Widget types

import type { BaseEntity, TenantId, PageLink, PageData } from './common.types';

export type { PageLink, PageData };

export interface WidgetType extends BaseEntity {
  tenantId: TenantId;
  fqn: string;
  name: string;
  descriptor: WidgetTypeDescriptor;
  image?: string;
  deprecated: boolean;
  scada: boolean;
  description?: string;
  tags?: string[];
}

export interface WidgetTypeDescriptor {
  type: 'timeseries' | 'latest' | 'rpc' | 'alarm' | 'static';
  resources: WidgetResource[];
  templateHtml: string;
  templateCss: string;
  controllerScript: string | {
    body: string;
    modules?: { [alias: string]: string };
  };
  settingsForm?: FormProperty[];
  dataKeySettingsForm?: FormProperty[];
  latestDataKeySettingsForm?: FormProperty[];
  settingsDirective?: string;
  dataKeySettingsDirective?: string;
  latestDataKeySettingsDirective?: string;
  hasBasicMode?: boolean;
  basicModeDirective?: string;
  defaultConfig: string;
  sizeX: number;
  sizeY: number;
}

export interface WidgetResource {
  url: string;
  isModule?: boolean;
}

export const FormPropertyType = {
  TEXT: 'text',
  NUMBER: 'number',
  PASSWORD: 'password',
  TEXTAREA: 'textarea',
  SWITCH: 'switch',
  SELECT: 'select',
  RADIOS: 'radios',
  DATETIME: 'datetime',
  IMAGE: 'image',
  JAVASCRIPT: 'javascript',
  JSON: 'json',
  HTML: 'html',
  CSS: 'css',
  MARKDOWN: 'markdown',
  COLOR: 'color',
  COLOR_SETTINGS: 'color_settings',
  FONT: 'font',
  UNITS: 'units',
  ICON: 'icon',
  FIELDSET: 'fieldset',
  ARRAY: 'array',
  HTML_SECTION: 'htmlSection',
} as const;

export type FormPropertyType = typeof FormPropertyType[keyof typeof FormPropertyType];

export interface FormSelectItem {
  value: any;
  label: string;
}

export interface FormProperty {
  id: string;
  name: string;
  type: FormPropertyType;
  default?: any;
  required?: boolean;
  hint?: string;
  group?: string;
  subLabel?: string;
  divider?: boolean;
  fieldSuffix?: string;
  disabled?: boolean;
  visible?: boolean;
  // Textarea
  rows?: number;
  // Number
  min?: number;
  max?: number;
  step?: number;
  // Select
  multiple?: boolean;
  allowEmptyOption?: boolean;
  items?: FormSelectItem[];
  minItems?: number;
  maxItems?: number;
  // Radios
  direction?: 'row' | 'column';
  // DateTime
  allowClear?: boolean;
  dateTimeType?: 'date' | 'time' | 'datetime';
  // Fieldset
  properties?: FormProperty[];
  // Array
  arrayItemName?: string;
  arrayItemType?: FormPropertyType;
  // HTML Section
  htmlContent?: string;
  htmlClassList?: string[];
  // Condition
  condition?: string;
  conditionFunction?: (property: FormProperty, model: any) => boolean;
  [key: string]: any;
}

export interface WidgetsBundle extends BaseEntity {
  tenantId: TenantId;
  alias: string;
  title: string;
  image?: string;
  description?: string;
  scada: boolean;
}

export interface WidgetTypeDetails extends WidgetType {
  widgetsBundleId?: {
    id: string;
  };
}

