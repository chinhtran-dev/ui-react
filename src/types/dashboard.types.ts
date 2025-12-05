// Dashboard types

import type { BaseEntity, TenantId, PageLink, PageData } from './common.types';

export type { PageLink, PageData };

export interface Dashboard extends BaseEntity {
  tenantId: TenantId;
  title: string;
  image?: string;
  assignedCustomers?: Array<{
    customerId: {
      id: string;
    };
    public: boolean;
  }>;
  configuration?: DashboardConfiguration;
}

export interface DashboardConfiguration {
  timewindow?: Timewindow;
  settings?: DashboardSettings;
  widgets?: { [id: string]: Widget } | Widget[];
  states?: { [id: string]: DashboardState };
  entityAliases?: EntityAliases;
  filters?: Filters;
  [key: string]: any;
}

export interface DashboardSettings {
  stateControllerId?: string;
  showTitle?: boolean;
  titleColor?: string;
  showDashboardLogo?: boolean;
  dashboardLogoUrl?: string;
  titleFont?: Font;
  showToolbar?: boolean;
  toolbarAlwaysOpen?: boolean;
  [key: string]: any;
}

export interface Timewindow {
  realtime?: {
    timewindowMs: number;
  };
  history?: {
    timewindowMs: number;
    intervalMs: number;
    aggregationType: string;
    limit: number;
  };
  aggregation?: {
    type: string;
    limit: number;
    interval: number;
  };
}

export interface Widget {
  id?: string;
  typeFullFqn: string;
  type: string;
  sizeX: number;
  sizeY: number;
  row: number;
  col: number;
  config: WidgetConfig;
}

export interface WidgetConfig {
  title?: string;
  datasources?: Datasource[];
  timewindow?: Timewindow;
  settings?: any;
  [key: string]: any;
}

export interface Datasource {
  type: string;
  name: string;
  entityAliasId: string;
  dataKeys: DataKey[];
}

export interface DataKey {
  name: string;
  type: string;
  label?: string;
  color?: string;
  settings?: any;
}

export interface DashboardState {
  id: string;
  name: string;
  root: boolean;
  layouts: DashboardStateLayouts;
}

export interface DashboardStateLayouts {
  [layoutId: string]: DashboardStateLayout;
}

export interface DashboardStateLayout {
  widgets: { [widgetId: string]: WidgetLayout };
}

export interface EntityAliases {
  [id: string]: EntityAlias;
}

export interface EntityAlias {
  id: string;
  alias: string;
  filter: EntityAliasFilter;
}

export interface EntityAliasFilter {
  type?: AliasFilterType;
  resolveMultiple?: boolean;
  singleEntity?: EntityId;
  entityType?: EntityType;
  entityList?: string[];
  entityNameFilter?: string;
  stateEntityParamName?: string;
  defaultStateEntity?: EntityId;
  assetTypes?: string[];
  deviceTypes?: string[];
  edgeTypes?: string[];
  entityViewTypes?: string[];
  assetNameFilter?: string;
  deviceNameFilter?: string;
  edgeNameFilter?: string;
  entityViewNameFilter?: string;
  rootStateEntity?: boolean;
  rootEntity?: EntityId;
  relationType?: string;
  direction?: string;
  filters?: Array<any>;
  maxLevel?: number;
  fetchLastLevelOnly?: boolean;
  [key: string]: any;
}

export const AliasFilterType = {
  SINGLE_ENTITY: 'singleEntity',
  ENTITY_LIST: 'entityList',
  ENTITY_NAME: 'entityName',
  ENTITY_TYPE: 'entityType',
  STATE_ENTITY: 'stateEntity',
  ASSET_TYPE: 'assetType',
  DEVICE_TYPE: 'deviceType',
  EDGE_TYPE: 'edgeType',
  ENTITY_VIEW_TYPE: 'entityViewType',
  API_USAGE_STATE: 'apiUsageState',
  RELATIONS_QUERY: 'relationsQuery',
  ASSET_SEARCH_QUERY: 'assetSearchQuery',
  DEVICE_SEARCH_QUERY: 'deviceSearchQuery',
  EDGE_SEARCH_QUERY: 'edgeSearchQuery',
  ENTITY_VIEW_SEARCH_QUERY: 'entityViewSearchQuery',
} as const;

export type AliasFilterType = typeof AliasFilterType[keyof typeof AliasFilterType];

export interface EntityId {
  id: string;
  entityType: EntityType;
}

export const EntityType = {
  TENANT: 'TENANT',
  TENANT_PROFILE: 'TENANT_PROFILE',
  CUSTOMER: 'CUSTOMER',
  USER: 'USER',
  DASHBOARD: 'DASHBOARD',
  ASSET: 'ASSET',
  DEVICE: 'DEVICE',
  ENTITY_VIEW: 'ENTITY_VIEW',
  ALARM: 'ALARM',
  RULE_CHAIN: 'RULE_CHAIN',
  RULE_NODE: 'RULE_NODE',
  EDGE: 'EDGE',
  WIDGETS_BUNDLE: 'WIDGETS_BUNDLE',
  WIDGET_TYPE: 'WIDGET_TYPE',
  API_USAGE_STATE: 'API_USAGE_STATE',
  TB_RESOURCE: 'TB_RESOURCE',
  OTA_PACKAGE: 'OTA_PACKAGE',
  RPC: 'RPC',
  QUEUE: 'QUEUE',
  NOTIFICATION: 'NOTIFICATION',
  NOTIFICATION_TEMPLATE: 'NOTIFICATION_TEMPLATE',
  NOTIFICATION_REQUEST: 'NOTIFICATION_REQUEST',
  NOTIFICATION_RULE: 'NOTIFICATION_RULE',
} as const;

export type EntityType = typeof EntityType[keyof typeof EntityType];

export interface Filters {
  [id: string]: EntityFilter;
}

export interface EntityFilter {
  type: string;
  multiple?: boolean;
  [key: string]: any;
}

export interface Font {
  family: string;
  size: number;
  style: 'normal' | 'italic' | 'oblique';
  weight: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  lineHeight: number;
}

export interface WidgetLayouts {
  [stateId: string]: {
    [widgetId: string]: WidgetLayout;
  };
}

export interface WidgetLayout {
  sizeX: number;
  sizeY: number;
  row: number;
  col: number;
  [key: string]: any;
}

