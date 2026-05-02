import { API_ENDPOINTS } from "../config";
import { loadContentList } from "./api-loaders";
import {
  fetchCachedQuery,
  invalidateCached,
  markCachedStale,
  patchCachedData,
  prefetchCachedQuery,
  type CacheOptions,
  useCachedQuery,
} from "./async-cache";
import type {
  ActivityCategory,
  ActivityRow,
  ActivitySummary,
  DashboardBootstrapData,
  FileTypeCount,
  PositionCounts,
} from "../types/activity";
import type { EmployeeRecord } from "../types/employee";

const ACTIVITY_CACHE_OPTIONS: CacheOptions<ActivityRow[]> = {
  staleTimeMs: 30_000,
  cacheTimeMs: 10 * 60_000,
  persist: true,
  scope: "user",
};

const COUNTS_CACHE_OPTIONS: CacheOptions<PositionCounts> = {
  staleTimeMs: 60_000,
  cacheTimeMs: 10 * 60_000,
  persist: true,
  scope: "user",
};

const FILE_TYPE_COUNTS_CACHE_OPTIONS: CacheOptions<FileTypeCount[]> = {
  staleTimeMs: 60_000,
  cacheTimeMs: 10 * 60_000,
  persist: true,
  scope: "user",
};

const DASHBOARD_CACHE_OPTIONS: CacheOptions<DashboardBootstrapData> = {
  staleTimeMs: 60_000,
  cacheTimeMs: 10 * 60_000,
  persist: true,
  scope: "user",
};

const CACHE_KEYS = {
  activity: {
    all: "activity:all",
    content: "activity:content",
    verbose: "activity:verbose",
    auth: "activity:auth",
  },
  dashboardBootstrap: "dashboard:bootstrap",
  contentPositionCounts: "stats:content:position",
  contentFileTypeCounts: "stats:content:file-type",
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

function fetchActivity(category: ActivityCategory) {
  return async (): Promise<ActivityRow[]> => {
    const url =
      category === "all" ?
        API_ENDPOINTS.ACTIVITY
      : `${API_ENDPOINTS.ACTIVITY}?category=${category}`;

    return fetchJson<ActivityRow[]>(url);
  };
}

async function fetchContentPositionCounts() {
  return fetchJson<PositionCounts>(API_ENDPOINTS.CONTENT.COUNT_POSITION);
}

async function fetchContentFileTypeCounts() {
  return fetchJson<FileTypeCount[]>(API_ENDPOINTS.CONTENT.COUNT_FILE_TYPE);
}

async function fetchEmployeeCounts() {
  return fetchJson<PositionCounts>(
    `${API_ENDPOINTS.ACTIVITY.replace("/activity", "")}/stats/employee/count`,
  );
}

async function fetchEmployees(): Promise<EmployeeRecord[]> {
  return fetchJson<EmployeeRecord[]>(API_ENDPOINTS.EMPLOYEE.ROOT);
}

async function fetchActivityActionSummary(params?: {
  position?: string;
  employeeUuid?: string;
}) {
  const query = new URLSearchParams();

  if (params?.position) {
    query.set("position", params.position);
  }
  if (params?.employeeUuid) {
    query.set("employeeUuid", params.employeeUuid);
  }

  const queryString = query.toString();

  return fetchJson<ActivitySummary>(
    `${API_ENDPOINTS.STATS.ACTIVITY_ACTION_SUMMARY}${
      queryString ? `?${queryString}` : ""
    }`,
  );
}

async function fetchDashboardBootstrap(params?: {
  position?: string;
  employeeUuid?: string;
}): Promise<DashboardBootstrapData> {
  const [
    activityAll,
    activityContent,
    activityVerbose,
    contentCounts,
    fileTypeCounts,
    employeeCounts,
    contentList,
    employees,
    activitySummary,
  ] = await Promise.all([
    loadActivity("all"),
    loadActivity("content"),
    loadActivity("verbose"),
    loadContentPositionCounts(),
    loadContentFileTypeCounts(),
    loadEmployeeCounts(),
    loadContentList(),
    loadEmployees(),
    loadActivityActionSummary(params),
  ]);

  return {
    activityAll,
    activityContent,
    activityVerbose,
    contentCounts,
    fileTypeCounts,
    employeeCounts,
    contentList,
    employees,
    activitySummary,
  };
}

export async function loadActivity(
  category: ActivityCategory,
): Promise<ActivityRow[]> {
  return fetchCachedQuery(
    getActivityCacheKey(category),
    fetchActivity(category),
    ACTIVITY_CACHE_OPTIONS,
  );
}

export function useActivityQuery(category: ActivityCategory) {
  return useCachedQuery(
    getActivityCacheKey(category),
    fetchActivity(category),
    ACTIVITY_CACHE_OPTIONS,
  );
}

export function prefetchActivity(category: ActivityCategory) {
  return prefetchCachedQuery(
    getActivityCacheKey(category),
    fetchActivity(category),
    ACTIVITY_CACHE_OPTIONS,
  );
}

export async function loadContentPositionCounts(): Promise<PositionCounts> {
  return fetchCachedQuery(
    CACHE_KEYS.contentPositionCounts,
    fetchContentPositionCounts,
    COUNTS_CACHE_OPTIONS,
  );
}

export async function loadContentFileTypeCounts(): Promise<FileTypeCount[]> {
  return fetchCachedQuery(
    CACHE_KEYS.contentFileTypeCounts,
    fetchContentFileTypeCounts,
    FILE_TYPE_COUNTS_CACHE_OPTIONS,
  );
}

export async function loadEmployeeCounts(): Promise<PositionCounts> {
  return fetchCachedQuery(
    CACHE_KEYS.employeeCounts,
    fetchEmployeeCounts,
    COUNTS_CACHE_OPTIONS,
  );
}

// Loads fetched data for all employees
export async function loadEmployees(): Promise<EmployeeRecord[]> {
  return fetchCachedQuery("employee:list", fetchEmployees, {
    staleTimeMs: 60_000,
    cacheTimeMs: 10 * 60_000,
    persist: true,
    scope: "user",
  });
}

// Loads fetched data for "Employee activity" dashboard chart
export async function loadActivityActionSummary(params?: {
  position?: string;
  employeeUuid?: string;
}): Promise<ActivitySummary> {
  const cacheKey = [
    "stats:activity:action-summary",
    params?.position ?? "all-positions",
    params?.employeeUuid ?? "all-employees",
  ].join(":");

  return fetchCachedQuery(cacheKey, () => fetchActivityActionSummary(params), {
    staleTimeMs: 30_000,
    cacheTimeMs: 10 * 60_000,
    persist: true,
    scope: "user",
  });
}

export async function loadDashboardBootstrap(params?: {
  position?: string;
  employeeUuid?: string;
}): Promise<DashboardBootstrapData> {
  const cacheKey = [
    CACHE_KEYS.dashboardBootstrap,
    params?.position ?? "all-positions",
    params?.employeeUuid ?? "all-employees",
  ].join(":");

  return fetchCachedQuery(
    cacheKey,
    () => fetchDashboardBootstrap(params),
    DASHBOARD_CACHE_OPTIONS,
  );
}

export function useDashboardBootstrapQuery(params?: {
  position?: string;
  employeeUuid?: string;
}) {
  const cacheKey = [
    CACHE_KEYS.dashboardBootstrap,
    params?.position ?? "all-positions",
    params?.employeeUuid ?? "all-employees",
  ].join(":");

  return useCachedQuery(
    cacheKey,
    () => fetchDashboardBootstrap(params),
    DASHBOARD_CACHE_OPTIONS,
  );
}

export function patchDashboardBootstrap(
  updater: (
    data: DashboardBootstrapData | undefined,
  ) => DashboardBootstrapData | undefined,
) {
  patchCachedData(
    CACHE_KEYS.dashboardBootstrap,
    updater,
    DASHBOARD_CACHE_OPTIONS,
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

export function markActivityStale(category?: ActivityCategory) {
  if (category) {
    markCachedStale(getActivityCacheKey(category));
    return;
  }

  markCachedStale(CACHE_KEYS.activity.all);
  markCachedStale(CACHE_KEYS.activity.content);
  markCachedStale(CACHE_KEYS.activity.verbose);
  markCachedStale(CACHE_KEYS.activity.auth);
}

export function invalidateDashboardBootstrap() {
  invalidateCached(CACHE_KEYS.dashboardBootstrap);
}

export function markDashboardBootstrapStale() {
  markCachedStale(CACHE_KEYS.dashboardBootstrap);
}

export function invalidateDashboardStats() {
  invalidateCached(CACHE_KEYS.contentPositionCounts);
  invalidateCached(CACHE_KEYS.employeeCounts);
}

export function markDashboardStatsStale() {
  markCachedStale(CACHE_KEYS.contentPositionCounts);
  markCachedStale(CACHE_KEYS.employeeCounts);
}
