// Hook for managing entity aliases

import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { entityAliasesService } from '../services/dashboard/entity-aliases.service';

export function useEntityAliases() {
  const dashboard = useAppSelector((state) => state.dashboard.currentDashboard);

  const aliases = useMemo(() => {
    return entityAliasesService.getAliases(dashboard);
  }, [dashboard]);

  const getAlias = (aliasId: string) => {
    return entityAliasesService.getAlias(dashboard, aliasId);
  };

  const getAliasName = (aliasId: string) => {
    return entityAliasesService.getAliasName(dashboard, aliasId);
  };

  const hasAlias = (aliasId: string) => {
    return entityAliasesService.hasAlias(dashboard, aliasId);
  };

  const findAliasByName = (aliasName: string) => {
    return entityAliasesService.findAliasByName(dashboard, aliasName);
  };

  return {
    aliases,
    getAlias,
    getAliasName,
    hasAlias,
    findAliasByName,
  };
}

