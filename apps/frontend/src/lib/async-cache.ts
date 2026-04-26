const inflightRequests = new Map<string, Promise<unknown>>();

export async function dedupeAsync<T>(
  key: string,
  loader: () => Promise<T>,
): Promise<T> {
  const existing = inflightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const request = loader();
  inflightRequests.set(key, request);

  try {
    return await request;
  } finally {
    if (inflightRequests.get(key) === request) {
      inflightRequests.delete(key);
    }
  }
}
