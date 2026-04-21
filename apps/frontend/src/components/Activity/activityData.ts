export interface ActivityItem {
  id: string | number;
  time: string;
  user: string;
  action: string;
  resourceUuid?: string; // UUID for content or employees
  resourceName?: string; // Name for content or employees
}

export interface ActivityGroup {
  date: string;
  items: ActivityItem[];
}

/**
 * Transforms raw backend activity logs into grouped data for the Timeline UI.
 * Handles "Invalid Date" errors by checking timestamp validity.
 */
export function transformBackendData(rawData: any): ActivityGroup[] {
  const groups: { [key: string]: ActivityItem[] } = {};

  // If rawData is not an array (e.g., it's a string, null, or an error object), return empty
  if (!Array.isArray(rawData)) {
    console.error("transformBackendData received non-array data:", rawData);
    return [];
  }

  rawData.forEach((row) => {
    // ... rest of your existing logic ...
  });

  return Object.entries(groups).map(([date, items]) => ({
    date,
    items,
  }));
}
