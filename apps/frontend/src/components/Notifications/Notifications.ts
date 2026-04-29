import { API_ENDPOINTS } from "../../config.ts";
import { useAuth } from "../../auth/AuthContext.tsx";

export async function getAllContent() {
  const response = await fetch(API_ENDPOINTS.CONTENT.ROOT, {
    credentials: "include",
  });

  const content = await response.json();
  return content;
}

export function getExpiresInSeconds(expirationTime: string | null): number {
  if (!expirationTime) return -1;
  return Math.floor((new Date(expirationTime).getTime() - Date.now()) / 1000);
}

export function getExpiringContent(content: any[]) {
  const now = new Date();

  return content
    .filter((item) => {
      if (!item.expiration_time) return false;
      const expiresInSeconds = getExpiresInSeconds(item.expiration_time);
      return expiresInSeconds <= 432000 && expiresInSeconds > 0;
    })
    .map((item) => ({
      ...item,
      expiresInSeconds: getExpiresInSeconds(item.expiration_time),
      expiresAt: new Date(item.expiration_time),
      isExpired: false,
      status: getExpirationStatus(getExpiresInSeconds(item.expiration_time)),
    }))
    .sort((a, b) => a.expiresInSeconds - b.expiresInSeconds);
}

export function getExpirationStatus(
  expiresInSeconds: number,
): "critical" | "warning" | "info" | "expired" {
  if (expiresInSeconds <= 0) return "expired";
  if (expiresInSeconds <= 3600) return "critical";
  if (expiresInSeconds <= 86400) return "warning";
  if (expiresInSeconds <= 432000) return "info";
  return "info";
}

export function getCriticalContent(content: any[]) {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  return content.filter((item) => {
    if (!item.expiration_time) return false;
    const expiresAt = new Date(item.expiration_time);
    return expiresAt > now && expiresAt <= oneHourLater;
  });
}

export function getExpiredContent(content: any[]) {
  const now = new Date();

  return content.filter((item) => {
    if (!item.expiration_time) return false;
    const expiresAt = new Date(item.expiration_time);
    return expiresAt <= now;
  });
}

export async function getNormalEdit() {
  try {
    const response = await fetch(`${API_ENDPOINTS.ACTIVITY}?category=content`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.status}`);
    }

    const activities = await response.json();

    return activities;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function getVerboseNotifications() {
  try {
    const response = await fetch(`${API_ENDPOINTS.ACTIVITY}?category=verbose`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch verbose notifications: ${response.status}`,
      );
    }

    const activities = await response.json();

    return activities;
  } catch (error) {
    console.error("Error fetching verbose notifications:", error);
    return [];
  }
}

export async function getOwnershipChanges() {
  const activities = await getVerboseNotifications();
  return activities
    .filter((item: any) => item.action === "OWNERSHIP_CHANGE")
    .map((item: any) => ({
      ...item,
      action: "OWNERSHIP_CHANGE",

      notification_message: item.resourceName,
    }));
}

export async function getContentEdits() {
  const activities = await getNormalEdit();
  return activities.filter((item: any) => item.action === "EDIT_CONTENT");
}
