// Widget Type hooks with React Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { widgetApi } from '../services/api/widget.api';
import type { WidgetType, WidgetTypeDetails } from '../types/widget.types';

// Cache for widget types
const widgetTypeCache = new Map<string, WidgetType>();

export const useWidgetType = (fullFqn: string) => {
  return useQuery({
    queryKey: ['widgetType', fullFqn],
    queryFn: async () => {
      // Check cache first
      if (widgetTypeCache.has(fullFqn)) {
        return widgetTypeCache.get(fullFqn)!;
      }
      const widgetType = await widgetApi.getWidgetType(fullFqn);
      widgetTypeCache.set(fullFqn, widgetType);
      return widgetType;
    },
    enabled: !!fullFqn,
    staleTime: Infinity, // Widget types don't change often
  });
};

export const useWidgetTypes = (widgetsBundleId?: string) => {
  return useQuery({
    queryKey: ['widgetTypes', widgetsBundleId],
    queryFn: () => widgetApi.getWidgetTypes(widgetsBundleId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSaveWidgetType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (widgetType: WidgetTypeDetails) => widgetApi.saveWidgetType(widgetType),
    onSuccess: (data) => {
      // Update cache
      widgetTypeCache.set(data.fqn, data);
      queryClient.invalidateQueries({ queryKey: ['widgetTypes'] });
      queryClient.setQueryData(['widgetType', data.fqn], data);
    },
  });
};

export const useDeleteWidgetType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => widgetApi.deleteWidgetType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgetTypes'] });
    },
  });
};

export const useExportWidgetType = () => {
  return useMutation({
    mutationFn: ({ id, includeResources }: { id: string; includeResources?: boolean }) =>
      widgetApi.exportWidgetType(id, includeResources),
  });
};

export const useImportWidgetType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (widgetType: WidgetTypeDetails) => widgetApi.importWidgetType(widgetType),
    onSuccess: (data) => {
      // Update cache
      widgetTypeCache.set(data.fqn, data);
      queryClient.invalidateQueries({ queryKey: ['widgetTypes'] });
      queryClient.setQueryData(['widgetType', data.fqn], data);
    },
  });
};

// Clear widget type cache
export const clearWidgetTypeCache = () => {
  widgetTypeCache.clear();
};

// Get widget type from cache
export const getCachedWidgetType = (fullFqn: string): WidgetType | undefined => {
  return widgetTypeCache.get(fullFqn);
};

