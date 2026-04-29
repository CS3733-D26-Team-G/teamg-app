import { useCallback, useEffect, useState } from "react";

import { loadDashboardBootstrap } from "../../lib/activity-loaders";
import type { DashboardBootstrapData } from "../../types/activity";

interface UseDashboardBootstrapResult {
  data: DashboardBootstrapData | null;
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useDashboardBootstrap(): UseDashboardBootstrapResult {
  const [data, setData] = useState<DashboardBootstrapData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const nextData = await loadDashboardBootstrap();
      setData(nextData);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(message);
      console.error("Failed to load dashboard bootstrap:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const nextData = await loadDashboardBootstrap();

        if (cancelled) {
          return;
        }

        setData(nextData);
        setError(null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(message);
        console.error("Failed to load dashboard bootstrap:", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, error, loading, refresh };
}
