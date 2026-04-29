import { API_ENDPOINTS } from "../config";
import {
  ContentRowsSchema,
  ContentTagSummariesSchema,
  type ContentRow,
  type ContentTagSummary,
} from "../types/content";
import { invalidateCached, loadCached } from "./async-cache";

const CACHE_TTL_MS = 10_000;

export const CACHE_KEYS = {
  contentList: "content:list",
  contentTags: "content:tags",
  claimsList: "claims:list",
} as const;

export async function loadContentList(): Promise<ContentRow[]> {
  return loadCached(
    CACHE_KEYS.contentList,
    async () => {
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

      return parsed.data;
    },
    { ttlMs: CACHE_TTL_MS },
  );
}

export async function loadContentTags(): Promise<ContentTagSummary[]> {
  return loadCached(
    CACHE_KEYS.contentTags,
    async () => {
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
    },
    { ttlMs: CACHE_TTL_MS },
  );
}

export async function loadClaimsList<T>(): Promise<T[]> {
  return loadCached(
    CACHE_KEYS.claimsList,
    async () => {
      const res = await fetch(API_ENDPOINTS.CLAIM.ROOT, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch claims: ${res.status}`);
      }

      const data: unknown = await res.json();
      return Array.isArray(data) ? (data as T[]) : [];
    },
    { ttlMs: CACHE_TTL_MS },
  );
}

export function invalidateContentList() {
  invalidateCached(CACHE_KEYS.contentList);
}

export function invalidateContentTags() {
  invalidateCached(CACHE_KEYS.contentTags);
}

export function invalidateClaimsList() {
  invalidateCached(CACHE_KEYS.claimsList);
}
