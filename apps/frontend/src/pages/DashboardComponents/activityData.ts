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
  console.log(rawData);
  const groups: { [key: string]: ActivityItem[] } = {};

  if (!Array.isArray(rawData)) return [];

  rawData.forEach((row) => {
    console.log("Row object:", row);
    // 1. Prisma returns ISO strings (e.g., 2026-04-21T...).
    // Ensure the key name exactly matches your Prisma schema ('timestamp')
    const dateObj = new Date(row.timestamp);

    // 2. The Sentinel Check: isNaN(date.getTime()) is true if the date is invalid
    const isValid = !isNaN(dateObj.getTime());

    // 3. Fallback logic: If the date is bad, we group it under "Recent Activity"
    // instead of letting "Invalid Date" leak into the UI.
    const dateLabel =
      isValid ? dateObj.toLocaleDateString() : "Recent Activity";

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }

    groups[dateLabel].push({
      id: row.uuid || row.id || Math.random().toString(),
      time:
        isValid ?
          dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "--:--",
      user:
        row.employee ?
          `${row.employee.first_name} ${row.employee.last_name}`
        : "System",
      action: row.action || "Action",
      resourceName: row.resourceName || "System Resource",
      resourceUuid: row.resourceUuid,
    });
  });

  return Object.entries(groups).map(([date, items]) => ({
    date,
    items,
  }));
}
