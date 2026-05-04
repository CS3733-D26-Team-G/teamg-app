import { useEffect, useRef, useState } from "react";

type QueryStatus = "idle" | "loading" | "success" | "error";
type QueryScope = "global" | "user";

export interface CacheOptions<T> {
  ttlMs?: number;
  staleTimeMs?: number;
  cacheTimeMs?: number;
  persist?: boolean;
  scope?: QueryScope;
  serialize?: (value: T) => unknown;
  deserialize?: (value: unknown) => T;
}

export interface CachedQuerySnapshot<T> {
  data: T | undefined;
  error: Error | null;
  loading: boolean;
  fetching: boolean;
  status: QueryStatus;
  updatedAt: number;
  isStale: boolean;
}

interface PersistedCacheRecord {
  data: unknown;
  updatedAt: number;
}

interface NormalizedCacheOptions<T> {
  staleTimeMs: number;
  cacheTimeMs: number;
  persist: boolean;
  scope: QueryScope;
  serialize?: (value: T) => unknown;
  deserialize?: (value: unknown) => T;
}

interface CacheEntry<T> {
  key: string;
  data: T | undefined;
  error: Error | null;
  status: QueryStatus;
  updatedAt: number;
  promise: Promise<T> | null;
  options: NormalizedCacheOptions<T>;
  hydrated: boolean;
  subscribers: Set<() => void>;
  gcTimer: ReturnType<typeof setTimeout> | null;
}

const DEFAULT_STALE_TIME_MS = 0;
const DEFAULT_CACHE_TIME_MS = 0;
const PERSIST_PREFIX = "query-cache";
const PERSIST_REGISTRY_PREFIX = "query-cache-registry";

const cacheEntries = new Map<string, CacheEntry<unknown>>();
let currentIdentity = "anonymous";

function getNormalizedOptions<T>(
  options: CacheOptions<T> = {},
): NormalizedCacheOptions<T> {
  const staleTimeMs =
    options.staleTimeMs ?? options.ttlMs ?? DEFAULT_STALE_TIME_MS;
  const cacheTimeMs =
    options.cacheTimeMs ?? options.ttlMs ?? DEFAULT_CACHE_TIME_MS;

  return {
    staleTimeMs,
    cacheTimeMs,
    persist: options.persist ?? false,
    scope: options.scope ?? "global",
    serialize: options.serialize,
    deserialize: options.deserialize,
  };
}

function getScopeIdentity(scope: QueryScope) {
  // User-scoped cache keys include the authenticated employee so persisted rows
  // cannot bleed between accounts in the same browser session.
  return scope === "user" ? currentIdentity : "global";
}

function getStorageKey(key: string, scope: QueryScope) {
  return `${PERSIST_PREFIX}:${getScopeIdentity(scope)}:${key}`;
}

function getRegistryKey(scopeIdentity: string) {
  return `${PERSIST_REGISTRY_PREFIX}:${scopeIdentity}`;
}

function readRegistry(scopeIdentity: string) {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const raw = window.sessionStorage.getItem(getRegistryKey(scopeIdentity));
    if (!raw) {
      return new Set<string>();
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set<string>();
  } catch {
    return new Set<string>();
  }
}

function writeRegistry(scopeIdentity: string, entries: Set<string>) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (entries.size === 0) {
      window.sessionStorage.removeItem(getRegistryKey(scopeIdentity));
      return;
    }

    window.sessionStorage.setItem(
      getRegistryKey(scopeIdentity),
      JSON.stringify(Array.from(entries)),
    );
  } catch {
    // Ignore storage write failures.
  }
}

function persistEntry<T>(entry: CacheEntry<T>) {
  if (!entry.options.persist || entry.data === undefined) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  try {
    const storageKey = getStorageKey(entry.key, entry.options.scope);
    const payload: PersistedCacheRecord = {
      data:
        entry.options.serialize ?
          entry.options.serialize(entry.data)
        : entry.data,
      updatedAt: entry.updatedAt,
    };

    window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
    const scopeIdentity = getScopeIdentity(entry.options.scope);
    const registry = readRegistry(scopeIdentity);
    registry.add(entry.key);
    writeRegistry(scopeIdentity, registry);
  } catch {
    // Ignore storage write failures.
  }
}

function removePersistedEntry(key: string, scope: QueryScope) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const scopeIdentity = getScopeIdentity(scope);
    window.sessionStorage.removeItem(getStorageKey(key, scope));
    const registry = readRegistry(scopeIdentity);
    registry.delete(key);
    writeRegistry(scopeIdentity, registry);
  } catch {
    // Ignore storage removal failures.
  }
}

function clearPersistedScope(scopeIdentity: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const registry = readRegistry(scopeIdentity);
    registry.forEach((key) => {
      window.sessionStorage.removeItem(
        `${PERSIST_PREFIX}:${scopeIdentity}:${key}`,
      );
    });
    window.sessionStorage.removeItem(getRegistryKey(scopeIdentity));
  } catch {
    // Ignore storage cleanup failures.
  }
}

function hydrateEntry<T>(entry: CacheEntry<T>) {
  if (
    entry.hydrated ||
    !entry.options.persist ||
    typeof window === "undefined"
  ) {
    entry.hydrated = true;
    return;
  }

  entry.hydrated = true;

  try {
    const raw = window.sessionStorage.getItem(
      getStorageKey(entry.key, entry.options.scope),
    );
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw) as PersistedCacheRecord;
    const ageMs = Date.now() - parsed.updatedAt;
    if (ageMs > entry.options.cacheTimeMs) {
      removePersistedEntry(entry.key, entry.options.scope);
      return;
    }

    entry.data =
      entry.options.deserialize ?
        entry.options.deserialize(parsed.data)
      : (parsed.data as T);
    entry.updatedAt = parsed.updatedAt;
    entry.status = "success";
    entry.error = null;
  } catch {
    removePersistedEntry(entry.key, entry.options.scope);
  }
}

function isWithinWindow(updatedAt: number, windowMs: number) {
  if (updatedAt <= 0) {
    return false;
  }

  if (windowMs <= 0) {
    return false;
  }

  return Date.now() - updatedAt <= windowMs;
}

function isFresh<T>(entry: CacheEntry<T>) {
  return (
    entry.data !== undefined &&
    isWithinWindow(entry.updatedAt, entry.options.staleTimeMs)
  );
}

function hasCachedValue<T>(entry: CacheEntry<T>) {
  if (entry.data === undefined) {
    return false;
  }

  if (entry.options.cacheTimeMs <= 0) {
    return false;
  }

  return isWithinWindow(entry.updatedAt, entry.options.cacheTimeMs);
}

function notifyEntry<T>(entry: CacheEntry<T>) {
  entry.subscribers.forEach((subscriber) => subscriber());
}

function scheduleGc<T>(entry: CacheEntry<T>) {
  if (entry.subscribers.size > 0 || entry.options.cacheTimeMs <= 0) {
    return;
  }

  if (entry.gcTimer) {
    clearTimeout(entry.gcTimer);
  }

  entry.gcTimer = setTimeout(() => {
    const latest = cacheEntries.get(entry.key) as CacheEntry<T> | undefined;
    if (!latest || latest.subscribers.size > 0) {
      return;
    }

    cacheEntries.delete(entry.key);
  }, entry.options.cacheTimeMs);
}

function clearGc<T>(entry: CacheEntry<T>) {
  if (!entry.gcTimer) {
    return;
  }

  clearTimeout(entry.gcTimer);
  entry.gcTimer = null;
}

function getOrCreateEntry<T>(
  key: string,
  options: CacheOptions<T> = {},
): CacheEntry<T> {
  const normalized = getNormalizedOptions(options);
  const existing = cacheEntries.get(key) as CacheEntry<T> | undefined;

  if (existing) {
    existing.options = normalized;
    clearGc(existing);
    hydrateEntry(existing);
    return existing;
  }

  const entry: CacheEntry<T> = {
    key,
    data: undefined,
    error: null,
    status: "idle",
    updatedAt: 0,
    promise: null,
    options: normalized,
    hydrated: false,
    subscribers: new Set(),
    gcTimer: null,
  };

  cacheEntries.set(key, entry as CacheEntry<unknown>);
  hydrateEntry(entry);
  return entry;
}

function getSnapshotFromEntry<T>(entry: CacheEntry<T>): CachedQuerySnapshot<T> {
  const hasData = entry.data !== undefined && hasCachedValue(entry);

  return {
    data: hasData ? entry.data : undefined,
    error: entry.error,
    loading: !hasData && entry.status === "loading",
    fetching: entry.promise !== null,
    status: entry.status,
    updatedAt: entry.updatedAt,
    isStale: entry.data !== undefined && !isFresh(entry),
  };
}

function startFetch<T>(
  entry: CacheEntry<T>,
  loader: () => Promise<T>,
): Promise<T> {
  if (entry.promise) {
    return entry.promise;
  }

  if (entry.data === undefined || !hasCachedValue(entry)) {
    entry.status = "loading";
  }
  entry.error = null;
  notifyEntry(entry);

  const request = loader();
  entry.promise = request;

  request
    .then((value) => {
      entry.data = value;
      entry.updatedAt = Date.now();
      entry.status = "success";
      entry.error = null;
      persistEntry(entry);
    })
    .catch((error: unknown) => {
      entry.error = error instanceof Error ? error : new Error(String(error));
      entry.status = "error";
    })
    .finally(() => {
      if (entry.promise === request) {
        entry.promise = null;
      }
      notifyEntry(entry);
    });

  return request;
}

export function getCachedSnapshot<T>(
  key: string,
  options: CacheOptions<T> = {},
): CachedQuerySnapshot<T> {
  const entry = getOrCreateEntry<T>(key, options);
  return getSnapshotFromEntry(entry);
}

export function subscribeCached<T>(
  key: string,
  subscriber: () => void,
  options: CacheOptions<T> = {},
) {
  const entry = getOrCreateEntry<T>(key, options);
  clearGc(entry);
  entry.subscribers.add(subscriber);

  return () => {
    entry.subscribers.delete(subscriber);
    scheduleGc(entry);
  };
}

export function fetchCachedQuery<T>(
  key: string,
  loader: () => Promise<T>,
  options: CacheOptions<T> = {},
): Promise<T> {
  const entry = getOrCreateEntry<T>(key, options);

  if (isFresh(entry)) {
    return Promise.resolve(entry.data as T);
  }

  if (hasCachedValue(entry)) {
    // Serve usable cached data immediately and refresh it in the background.
    void startFetch(entry, loader);
    return Promise.resolve(entry.data as T);
  }

  return startFetch(entry, loader);
}

export function prefetchCachedQuery<T>(
  key: string,
  loader: () => Promise<T>,
  options: CacheOptions<T> = {},
): Promise<void> {
  return fetchCachedQuery(key, loader, options).then(() => undefined);
}

export function refreshCachedQuery<T>(
  key: string,
  loader: () => Promise<T>,
  options: CacheOptions<T> = {},
): Promise<T> {
  const entry = getOrCreateEntry<T>(key, options);
  entry.updatedAt = 0;
  return startFetch(entry, loader);
}

export function invalidateCached(key: string) {
  const entry = cacheEntries.get(key);
  if (!entry) {
    return;
  }

  clearGc(entry);
  removePersistedEntry(key, entry.options.scope);
  entry.data = undefined;
  entry.error = null;
  entry.status = entry.promise ? "loading" : "idle";
  entry.updatedAt = 0;
  if (entry.subscribers.size === 0) {
    cacheEntries.delete(key);
  }
  notifyEntry(entry);
}

export function markCachedStale(key: string) {
  const entry = cacheEntries.get(key);
  if (!entry) {
    return;
  }

  entry.updatedAt = 0;
  notifyEntry(entry);
}

export function patchCachedData<T>(
  key: string,
  updater: (value: T | undefined) => T | undefined,
  options: CacheOptions<T> = {},
) {
  const entry = getOrCreateEntry<T>(key, options);
  const nextValue = updater(entry.data);

  if (nextValue === undefined) {
    entry.data = undefined;
    entry.status = entry.promise ? "loading" : "idle";
    entry.updatedAt = 0;
    removePersistedEntry(key, entry.options.scope);
  } else {
    entry.data = nextValue;
    entry.status = "success";
    entry.updatedAt = Date.now();
    entry.error = null;
    persistEntry(entry);
  }

  notifyEntry(entry);
}

export function clearCachedEntries(keys: string[]) {
  keys.forEach((key) => invalidateCached(key));
}

export function setCacheIdentity(identity: string | null) {
  const nextIdentity = identity ?? "anonymous";
  if (nextIdentity === currentIdentity) {
    return;
  }

  const previousIdentity = currentIdentity;
  currentIdentity = nextIdentity;

  // Drop in-memory user-scoped entries immediately; their subscribers will
  // rehydrate under the new identity on the next read.
  Array.from(cacheEntries.entries()).forEach(([key, entry]) => {
    if (entry.options.scope === "user") {
      clearGc(entry);
      cacheEntries.delete(key);
      notifyEntry(entry);
    }
  });

  clearPersistedScope(previousIdentity);
}

export async function loadCached<T>(
  key: string,
  loader: () => Promise<T>,
  options: CacheOptions<T> = {},
): Promise<T> {
  return fetchCachedQuery(key, loader, options);
}

export async function dedupeAsync<T>(
  key: string,
  loader: () => Promise<T>,
): Promise<T> {
  const entry = getOrCreateEntry<T>(key, {
    staleTimeMs: 0,
    cacheTimeMs: 0,
    persist: false,
    scope: "global",
  });

  if (entry.promise) {
    return entry.promise;
  }

  return startFetch(entry, loader);
}

export function useCachedQuery<T>(
  key: string,
  loader: () => Promise<T>,
  options: CacheOptions<T> = {},
) {
  const loaderRef = useRef(loader);
  const optionsRef = useRef(options);
  const [snapshot, setSnapshot] = useState<CachedQuerySnapshot<T>>(() =>
    getCachedSnapshot(key, options),
  );

  useEffect(() => {
    loaderRef.current = loader;
    optionsRef.current = options;
  }, [loader, options]);

  useEffect(() => {
    const readSnapshot = () => getCachedSnapshot(key, optionsRef.current);
    setSnapshot(readSnapshot());

    const unsubscribe = subscribeCached<T>(
      key,
      () => setSnapshot(readSnapshot()),
      optionsRef.current,
    );

    void fetchCachedQuery(
      key,
      () => loaderRef.current(),
      optionsRef.current,
    ).catch(() => {
      // Consumers read errors from the shared snapshot.
    });

    return unsubscribe;
  }, [
    key,
    options.ttlMs,
    options.staleTimeMs,
    options.cacheTimeMs,
    options.persist,
    options.scope,
    options.serialize,
    options.deserialize,
  ]);

  return {
    ...snapshot,
    refresh: () =>
      refreshCachedQuery(key, () => loaderRef.current(), optionsRef.current),
  };
}
