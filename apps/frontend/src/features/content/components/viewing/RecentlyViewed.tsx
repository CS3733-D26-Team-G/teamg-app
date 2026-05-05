const MAX_RECENT = 25;

interface RecentEntry {
  uuid: string;
  viewedAt: number;
}

function storageKey(employeeUuid: string): string {
  return `recently_viewed_${employeeUuid}`;
}

/** Records a view for the given content uuid, deduplicating and capping at MAX_RECENT. */
export function recordRecentlyViewed(employeeUuid: string, uuid: string): void {
  try {
    const key = storageKey(employeeUuid);
    const existing: RecentEntry[] = JSON.parse(
      localStorage.getItem(key) ?? "[]",
    );

    // remove any previous entry for this uuid so it moves to the top
    const deduped = existing.filter((e) => e.uuid !== uuid);

    const updated: RecentEntry[] = [
      { uuid, viewedAt: Date.now() },
      ...deduped,
    ].slice(0, MAX_RECENT);

    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — fail silently
  }
}

/** Clears all recently viewed entries for the given employee. */
export function clearRecentlyViewed(employeeUuid: string): void {
  try {
    localStorage.removeItem(storageKey(employeeUuid));
  } catch {
    // localStorage unavailable — fail silently
  }
}

/** Returns an ordered list of recently viewed entries, most recent first. */
export function getRecentlyViewed(employeeUuid: string): RecentEntry[] {
  try {
    const key = storageKey(employeeUuid);
    return JSON.parse(localStorage.getItem(key) ?? "[]") as RecentEntry[];
  } catch {
    return [];
  }
}
