const inflightRequests = new Map<string, Promise<unknown>>();
const resolvedCache = new Map<string, { value: unknown; expiresAt: number }>();

interface CacheOptions {
  ttlMs?: number;
}

export async function loadCached<T>(
  key: string,
  loader: () => Promise<T>,
  options: CacheOptions = {},
): Promise<T> {
  const now = Date.now();
  const ttlMs = options.ttlMs ?? 0;
  const cached = resolvedCache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  if (cached) {
    resolvedCache.delete(key);
  }

  const existing = inflightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const request = loader();
  inflightRequests.set(key, request);

  try {
    const value = await request;

    if (ttlMs > 0) {
      resolvedCache.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
    } else {
      resolvedCache.delete(key);
    }

    return value;
  } finally {
    if (inflightRequests.get(key) === request) {
      inflightRequests.delete(key);
    }
  }
}

export function invalidateCached(key: string) {
  inflightRequests.delete(key);
  resolvedCache.delete(key);
}

export async function dedupeAsync<T>(
  key: string,
  loader: () => Promise<T>,
): Promise<T> {
  return loadCached(key, loader);
}
