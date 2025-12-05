// Widget Bundle hooks with React Query

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { widgetBundleApi } from '../services/api/widget-bundle.api';
import type { WidgetsBundle, PageLink } from '../types/widget.types';

export const useWidgetBundles = () => {
  return useQuery({
    queryKey: ['widgetBundles'],
    queryFn: () => widgetBundleApi.getWidgetsBundles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWidgetBundlesPage = (pageLink?: PageLink, tenantOnly = false) => {
  return useQuery({
    queryKey: ['widgetBundles', 'page', pageLink, tenantOnly],
    queryFn: () => widgetBundleApi.getWidgetsBundlesPage(pageLink, tenantOnly),
  });
};

export const useWidgetBundle = (id: string) => {
  return useQuery({
    queryKey: ['widgetBundle', id],
    queryFn: () => widgetBundleApi.getWidgetsBundle(id),
    enabled: !!id,
  });
};

export const useSaveWidgetBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bundle: WidgetsBundle) => widgetBundleApi.saveWidgetsBundle(bundle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgetBundles'] });
    },
  });
};

export const useUpdateWidgetBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bundle: WidgetsBundle) => widgetBundleApi.updateWidgetsBundle(bundle),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['widgetBundles'] });
      queryClient.invalidateQueries({ queryKey: ['widgetBundle', data.id.id] });
    },
  });
};

export const useDeleteWidgetBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => widgetBundleApi.deleteWidgetsBundle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgetBundles'] });
    },
  });
};

export const useBundleWidgetTypes = (bundleId: string) => {
  return useQuery({
    queryKey: ['bundleWidgetTypes', bundleId],
    queryFn: () => widgetBundleApi.getBundleWidgetTypes(bundleId),
    enabled: !!bundleId,
  });
};

export const useUpdateWidgetsBundleWidgetFqns = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bundleId, widgetTypeFqns }: { bundleId: string; widgetTypeFqns: string[] }) =>
      widgetBundleApi.updateWidgetsBundleWidgetFqns(bundleId, widgetTypeFqns),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bundleWidgetTypes', variables.bundleId] });
      queryClient.invalidateQueries({ queryKey: ['widgetBundle', variables.bundleId] });
    },
  });
};
