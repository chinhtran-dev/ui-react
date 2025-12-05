// Entity aliases service

import type { Dashboard, DashboardConfiguration, EntityAlias } from '../../types/dashboard.types';

export class EntityAliasesService {
  /**
   * Get all entity aliases from dashboard configuration
   */
  getAliases(dashboard: Dashboard | null): EntityAlias[] {
    if (!dashboard?.configuration?.entityAliases) {
      return [];
    }
    return Object.entries(dashboard.configuration.entityAliases).map(([id, alias]) => ({
      ...alias,
      id,
    }));
  }

  /**
   * Get alias by ID
   */
  getAlias(dashboard: Dashboard | null, aliasId: string): EntityAlias | null {
    if (!dashboard?.configuration?.entityAliases?.[aliasId]) {
      return null;
    }
    return {
      ...dashboard.configuration.entityAliases[aliasId],
      id: aliasId,
    };
  }

  /**
   * Add or update alias
   */
  setAlias(
    configuration: DashboardConfiguration,
    aliasId: string,
    alias: Partial<EntityAlias>
  ): DashboardConfiguration {
    if (!configuration.entityAliases) {
      configuration.entityAliases = {};
    }
    configuration.entityAliases[aliasId] = {
      ...alias,
      id: aliasId,
    } as EntityAlias;
    return configuration;
  }

  /**
   * Remove alias
   */
  removeAlias(configuration: DashboardConfiguration, aliasId: string): DashboardConfiguration {
    if (configuration.entityAliases) {
      delete configuration.entityAliases[aliasId];
    }
    return configuration;
  }

  /**
   * Check if alias exists
   */
  hasAlias(dashboard: Dashboard | null, aliasId: string): boolean {
    return !!dashboard?.configuration?.entityAliases?.[aliasId];
  }

  /**
   * Get alias name
   */
  getAliasName(dashboard: Dashboard | null, aliasId: string): string {
    const alias = this.getAlias(dashboard, aliasId);
    return alias?.alias || aliasId;
  }

  /**
   * Find alias by name
   */
  findAliasByName(dashboard: Dashboard | null, aliasName: string): EntityAlias | null {
    const aliases = this.getAliases(dashboard);
    return aliases.find((alias) => alias.alias === aliasName) || null;
  }

  /**
   * Validate alias configuration
   */
  validateAlias(alias: EntityAlias): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!alias.alias || alias.alias.trim() === '') {
      errors.push('Alias name is required');
    }

    if (!alias.filter) {
      errors.push('Filter is required');
    } else {
      if (!alias.filter.type) {
        errors.push('Filter type is required');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const entityAliasesService = new EntityAliasesService();

