import { useMemo } from "react";

import { useDashboardBootstrapQuery } from "../../lib/activity-loaders";

interface UseDashboardBootstrapResult {
  data: ReturnType<typeof useDashboardBootstrapQuery>["data"] | null;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useDashboardBootstrap(): UseDashboardBootstrapResult {
  const query = useDashboardBootstrapQuery();

  return useMemo(
    () => ({
      data: query.data ?? null,
      error: query.error?.message ?? null,
      loading: query.loading,
      refresh: () => query.refresh().then(() => undefined),
    }),
    [query],
  );
}
