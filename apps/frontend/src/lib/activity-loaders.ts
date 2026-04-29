import { API_ENDPOINTS } from "../config";
import { loadContentList } from "./api-loaders";
import { invalidateCached, loadCached } from "./async-cache";
import type {
  ActivityCategory,
  ActivityRow,
  DashboardBootstrapData,
  PositionCounts,
} from "../types/activity";

const CACHE_TTL_MS = 10_000;

const CACHE_KEYS = {
  activity: {
    all: "activity:all",
    content: "activity:content",
    verbose: "activity:verbose",
    auth: "activity:auth",
  },
  dashboardBootstrap: "dashboard:bootstrap",
  contentPositionCounts: "stats:content:position",
  employeeCounts: "stats:employee:count",
} as const;

function getActivityCacheKey(category: ActivityCategory) {
  return CACHE_KEYS.activity[category];
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error(`Unauthorized request for ${url}`);
  }

  if (!res.ok) {
    throw new Error(`Request failed for ${url}: ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function loadActivity(
  category: ActivityCategory,
): Promise<ActivityRow[]> {
  return loadCached(
    getActivityCacheKey(category),
    async () => {
      const url =
        category === "all" ?
          API_ENDPOINTS.ACTIVITY
        : `${API_ENDPOINTS.ACTIVITY}?category=${category}`;

      return fetchJson<ActivityRow[]>(url);
    },
    { ttlMs: CACHE_TTL_MS },
  );
}

export async function loadContentPositionCounts(): Promise<PositionCounts> {
  return loadCached(
    CACHE_KEYS.contentPositionCounts,
    () => fetchJson<PositionCounts>(API_ENDPOINTS.CONTENT.COUNT_POSITION),
    { ttlMs: CACHE_TTL_MS },
  );
}

export async function loadEmployeeCounts(): Promise<PositionCounts> {
  return loadCached(
    CACHE_KEYS.employeeCounts,
    () =>
      fetchJson<PositionCounts>(
        `${API_ENDPOINTS.ACTIVITY.replace("/activity", "")}/stats/employee/count`,
      ),
    { ttlMs: CACHE_TTL_MS },
  );
}

export async function loadDashboardBootstrap(): Promise<DashboardBootstrapData> {
  return loadCached(
    CACHE_KEYS.dashboardBootstrap,
    async () => {
      const [
        activityAll,
        activityContent,
        activityVerbose,
        contentCounts,
        employeeCounts,
        contentList,
      ] = await Promise.all([
        loadActivity("all"),
        loadActivity("content"),
        loadActivity("verbose"),
        loadContentPositionCounts(),
        loadEmployeeCounts(),
        loadContentList(),
      ]);

      return {
        activityAll,
        activityContent,
        activityVerbose,
        contentCounts,
        employeeCounts,
        contentList,
      };
    },
    { ttlMs: CACHE_TTL_MS },
  );
}

export function invalidateActivity(category?: ActivityCategory) {
  if (category) {
    invalidateCached(getActivityCacheKey(category));
    return;
  }

  invalidateCached(CACHE_KEYS.activity.all);
  invalidateCached(CACHE_KEYS.activity.content);
  invalidateCached(CACHE_KEYS.activity.verbose);
  invalidateCached(CACHE_KEYS.activity.auth);
}

export function invalidateDashboardBootstrap() {
  invalidateCached(CACHE_KEYS.dashboardBootstrap);
  invalidateActivity();
  invalidateCached(CACHE_KEYS.contentPositionCounts);
  invalidateCached(CACHE_KEYS.employeeCounts);
}
