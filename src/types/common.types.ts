// Common types for ThingsBoard React UI

export interface BaseEntity {
  id: {
    id: string;
    entityType: string;
  };
  createdTime: number;
}

export interface TenantId {
  id: string;
}

export interface UserId {
  id: string;
}

export interface PageLink {
  page: number;
  pageSize: number;
  textSearch?: string;
  sortOrder?: {
    key: string;
    direction: 'ASC' | 'DESC';
  };
}

export interface PageData<T> {
  data: T[];
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface AuthUser {
  id: UserId;
  tenantId: TenantId;
  customerId?: {
    id: string;
  };
  email: string;
  firstName: string;
  lastName: string;
  authority: 'SYS_ADMIN' | 'TENANT_ADMIN' | 'CUSTOMER_USER' | 'REFRESH_TOKEN';
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

