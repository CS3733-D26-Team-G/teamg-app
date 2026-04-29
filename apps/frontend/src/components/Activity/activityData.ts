export interface ActivityItem {
  id: string | number;
  time: string;
  user: string;
  action: string;
  resourceUuid?: string;
  resourceName?: string;
  avatarUrl?: string;
}

export interface ActivityItem {
  id: string | number;
  time: string;
  user: string;
  action: string;
  resourceUuid?: string;
  resourceName?: string;
  avatarUrl?: string;
  employeeUuid?: string;
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
  if (!Array.isArray(rawData)) return [];

  const groups: { [key: string]: ActivityItem[] } = {};

  rawData.forEach((row, index) => {
    // 1. Try parsing
    const d = new Date(row.timestamp);
    const timestampValue = d.getTime();

    // 2. Strict validation: Is it a number and not NaN?
    const isValid =
      typeof timestampValue === "number" && !isNaN(timestampValue);

    // 3. Create the Label - AVOID toLocaleDateString() for the check
    let dateLabel: string;

    if (isValid) {
      const formatted = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // DOUBLE CHECK: If the browser still spits out "Invalid Date"
      dateLabel = formatted === "Invalid Date" ? "Recent Activity" : formatted;
    } else {
      dateLabel = "Recent Activity";
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }

    groups[dateLabel].push({
      id: row.uuid || row.id || `row-${index}`,
      time:
        isValid ?
          d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "--:--",
      user:
        row.employee ?
          `${row.employee.first_name} ${row.employee.last_name}`
        : "System",
      action: row.action || "Action",
      resourceName: row.resourceName || undefined,
      resourceUuid: row.resourceUuid,
    });
  });

  return Object.entries(groups).map(([date, items]) => ({
    date,
    items,
  }));
}
