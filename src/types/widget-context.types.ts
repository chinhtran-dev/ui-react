// Widget Context types

import type { Widget, Datasource, Timewindow } from './dashboard.types';
import type { WidgetType } from './widget.types';

export interface WidgetContext {
  // Widget instance
  widget: Widget;
  widgetId: string;
  
  // Settings
  settings: any;
  
  // Data APIs
  data?: DatasourceData[];
  latestData?: DatasourceData[];
  hiddenData?: Array<{ data: DataSet }>;
  
  // Subscription APIs
  subscriptionApi?: WidgetSubscriptionApi;
  
  // Action APIs
  actionsApi?: WidgetActionsApi;
  
  // Control APIs (RPC)
  controlApi?: RpcApi;
  
  // Utilities
  utils?: WidgetUtils;
  
  // DOM references
  $container?: HTMLElement;
  $containerParent?: HTMLElement;
  $widgetElement?: HTMLElement;
  
  // Dimensions
  width?: number;
  height?: number;
  
  // State
  isEdit?: boolean;
  isPreview?: boolean;
  isMobile?: boolean;
  
  // Time window
  timeWindow?: WidgetTimewindow;
  
  // Datasources
  datasources?: Datasource[];
  
  // Active entity info
  activeEntityInfo?: SubscriptionEntityInfo;
  
  // Widget namespace for CSS isolation
  widgetNamespace?: string;
}

export interface DatasourceData {
  datasource: Datasource;
  data: DataSet[];
  latestValues?: { [key: string]: any };
}

export interface DataSet {
  [key: string]: DataKeyValue[];
}

export interface DataKeyValue {
  ts: number;
  value: any;
}

export interface WidgetSubscriptionApi {
  createSubscription: (options: WidgetSubscriptionOptions) => string;
  removeSubscription: (id: string) => void;
  createSubscriptionFromInfo: (info: SubscriptionInfo) => string;
}

export interface WidgetActionsApi {
  actionDescriptorsBySourceId: { [actionSourceId: string]: WidgetActionDescriptor[] };
  [actionSourceId: string]: WidgetActionDescriptor[] | ((event: any, ...args: any[]) => void) | any;
}

export interface RpcApi {
  sendOneWayCommand: (
    method: string,
    params?: any,
    timeout?: number,
    persistent?: boolean,
    retries?: number,
    additionalInfo?: any,
    requestUUID?: string
  ) => Promise<any>;
  sendTwoWayCommand: (
    method: string,
    params?: any,
    timeout?: number,
    persistent?: boolean,
    retries?: number,
    additionalInfo?: any,
    requestUUID?: string
  ) => Promise<any>;
  completedCommand: () => Promise<any>;
}

export interface WidgetUtils {
  formatValue: (value: any, units?: string, decimals?: number) => string;
  getEntityDetailsPageURL: (entityId: string, entityType: string) => string;
  customTranslation: (key: string, defaultValue: string) => string;
}

export interface WidgetTimewindow {
  realtime?: {
    timewindowMs: number;
  };
  history?: {
    timewindowMs: number;
    intervalMs: number;
    aggregationType: string;
    limit: number;
  };
}

export interface WidgetSubscriptionOptions {
  type?: string;
  datasources?: Datasource[];
  useDashboardTimewindow?: boolean;
  timewindow?: Timewindow;
  [key: string]: any;
}

export interface SubscriptionInfo {
  datasources: Datasource[];
  timewindow?: Timewindow;
  type?: string;
}

export interface WidgetActionDescriptor {
  name: string;
  displayName?: string;
  icon?: string;
  actionType?: 'openLink' | 'navigate' | 'rpc' | 'updateDashboardState' | 'custom';
  url?: string;
  openInNewTab?: boolean;
  dashboardId?: string;
  dashboardStateId?: string;
  [key: string]: any;
}

export interface SubscriptionEntityInfo {
  entityName: string;
  entityLabel: string;
  entityDescription: string;
}

export interface WidgetController {
  onInit?: () => void;
  onDataUpdated?: () => void;
  onLatestDataUpdated?: () => void;
  onResize?: () => void;
  onEditModeChanged?: (isEdit: boolean) => void;
  onMobileModeChanged?: (isMobile: boolean) => void;
  onDestroy?: () => void;
  actionSources?: () => { [actionSourceId: string]: WidgetActionSource };
  typeParameters?: () => WidgetTypeParameters;
  useCustomDatasources?: () => boolean;
  getSettingsForm?: () => FormProperty[];
  getDataKeySettingsForm?: () => FormProperty[];
  getLatestDataKeySettingsForm?: () => FormProperty[];
}

export interface WidgetActionSource {
  name: string;
  multiple?: boolean;
  hasShowCondition?: boolean;
}

export interface WidgetTypeParameters {
  useCustomDatasources?: boolean;
  maxDatasources?: number;
  maxDataKeys?: number;
  dataKeysOptional?: boolean;
  stateData?: boolean;
  [key: string]: any;
}

export interface FormProperty {
  id: string;
  name: string;
  type: string;
  default?: any;
  required?: boolean;
  [key: string]: any;
}

export interface WidgetInfo {
  widgetType: WidgetType;
  fullFqn: string;
  widgetName: string;
  templateHtml: string;
  templateCss: string;
  controllerScript: string;
  resources: WidgetResource[];
  defaultConfig: string;
  sizeX: number;
  sizeY: number;
}

export interface WidgetResource {
  url: string;
  isModule?: boolean;
}

