import { API_ENDPOINTS } from "../config";
import {
  ContentRowsSchema,
  ContentTagSummariesSchema,
  type ContentRow,
  type ContentTagSummary,
} from "../types/content";
import {
  fetchCachedQuery,
  invalidateCached,
  markCachedStale,
  patchCachedData,
  prefetchCachedQuery,
  refreshCachedQuery,
  type CacheOptions,
  useCachedQuery,
} from "./async-cache";

const CONTENT_LIST_CACHE_OPTIONS: CacheOptions<ContentRow[]> = {
  staleTimeMs: 5 * 60_000,
  cacheTimeMs: 30 * 60_000,
  persist: true,
  scope: "user",
};

const CONTENT_TAGS_CACHE_OPTIONS: CacheOptions<ContentTagSummary[]> = {
  staleTimeMs: 30 * 60_000,
  cacheTimeMs: 12 * 60 * 60_000,
  persist: true,
  scope: "user",
};

const CLAIMS_LIST_CACHE_OPTIONS: CacheOptions<unknown[]> = {
  staleTimeMs: 0, // always treat as stale so pages get fresh data
  cacheTimeMs: 5 * 60_000,
  persist: false, // don't persist across sessions
  scope: "user",
};

export const CACHE_KEYS = {
  contentList: "content:list",
  contentTags: "content:tags",
  claimsList: "claims:list",
} as const;

async function fetchContentList(): Promise<ContentRow[]> {
  const res = await fetch(API_ENDPOINTS.CONTENT.ROOT, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch content: ${res.status}`);
  }

  const data: unknown = await res.json();
  const parsed = ContentRowsSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data.map((row) => ({
    ...row,
    isLocked: row.editLock != null,
  }));
}

async function fetchContentTags(): Promise<ContentTagSummary[]> {
  const res = await fetch(API_ENDPOINTS.CONTENT.TAG.GET_ALL, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch tags: ${res.status}`);
  }

  const data: unknown = await res.json();
  const parsed = ContentTagSummariesSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data;
}

async function fetchClaimsList<T>(): Promise<T[]> {
  const res = await fetch(API_ENDPOINTS.CLAIM.ROOT, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch claims: ${res.status}`);
  }

  const data: unknown = await res.json();
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function loadContentList(): Promise<ContentRow[]> {
  return fetchCachedQuery(
    CACHE_KEYS.contentList,
    fetchContentList,
    CONTENT_LIST_CACHE_OPTIONS,
  );
}

export function useContentListQuery() {
  return useCachedQuery(
    CACHE_KEYS.contentList,
    fetchContentList,
    CONTENT_LIST_CACHE_OPTIONS,
  );
}

export function prefetchContentList() {
  return prefetchCachedQuery(
    CACHE_KEYS.contentList,
    fetchContentList,
    CONTENT_LIST_CACHE_OPTIONS,
  );
}

export async function loadContentTags(): Promise<ContentTagSummary[]> {
  return fetchCachedQuery(
    CACHE_KEYS.contentTags,
    fetchContentTags,
    CONTENT_TAGS_CACHE_OPTIONS,
  );
}

export function useContentTagsQuery() {
  return useCachedQuery(
    CACHE_KEYS.contentTags,
    fetchContentTags,
    CONTENT_TAGS_CACHE_OPTIONS,
  );
}

export function prefetchContentTags() {
  return prefetchCachedQuery(
    CACHE_KEYS.contentTags,
    fetchContentTags,
    CONTENT_TAGS_CACHE_OPTIONS,
  );
}

export async function loadClaimsList<T>(): Promise<T[]> {
  return fetchCachedQuery(
    CACHE_KEYS.claimsList,
    fetchClaimsList<T>,
    CLAIMS_LIST_CACHE_OPTIONS as CacheOptions<T[]>,
  );
}

/**
 * Reactive hook for claims — always refreshes on mount so Risk Review
 * and Approval pages see the latest statuses from the server.
 */
export function useClaimsListQuery<T = unknown>() {
  return useCachedQuery(
    CACHE_KEYS.claimsList,
    fetchClaimsList<T>,
    CLAIMS_LIST_CACHE_OPTIONS as CacheOptions<T[]>,
  );
}

export function invalidateContentList() {
  invalidateCached(CACHE_KEYS.contentList);
}

export function markContentListStale() {
  markCachedStale(CACHE_KEYS.contentList);
}

export function patchContentList(
  updater: (rows: ContentRow[] | undefined) => ContentRow[] | undefined,
) {
  patchCachedData(CACHE_KEYS.contentList, updater, CONTENT_LIST_CACHE_OPTIONS);
}

export function patchContentRow(
  uuid: string,
  updater: (row: ContentRow) => ContentRow,
) {
  patchContentList((rows) =>
    rows?.map((row) => (row.uuid === uuid ? updater(row) : row)),
  );
}

export function removeContentRow(uuid: string) {
  patchContentList((rows) => rows?.filter((row) => row.uuid !== uuid));
}

export function invalidateContentTags() {
  invalidateCached(CACHE_KEYS.contentTags);
}

export function invalidateClaimsList() {
  invalidateCached(CACHE_KEYS.claimsList);
}

export function markClaimsListStale() {
  markCachedStale(CACHE_KEYS.claimsList);
}
