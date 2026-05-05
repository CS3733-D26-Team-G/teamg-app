import type { ActivityRow } from "../../../types/activity.ts";
import type { ContentRow } from "../../../types/content.ts";
import type { InsuranceClaimType } from "@repo/db";
import type {
  InsuranceClaimCreatePayload,
  InsuranceClaimRecord,
} from "../../../types/claim.ts";

export interface NotificationActivity {
  uuid: string;
  action: string;
  resourceUuid: string;
  resourceName: string;
  timestamp: string;
  employee?: ActivityRow["employee"];
  title: string;
  notificationMessage: string;
}

export async function getAllContent(): Promise<ContentRow[]> {
  throw new Error("Not implemented");
}

export function getExpiresInSeconds(
  expirationTime: string | Date | null,
): number {
  if (!expirationTime) return -1;
  return Math.floor((new Date(expirationTime).getTime() - Date.now()) / 1000);
}

export function getExpiringContent(content: ContentRow[]) {
  return content
    .filter((item) => {
      if (!item.expirationTime) return false;
      const expiresInSeconds = getExpiresInSeconds(item.expirationTime);
      return expiresInSeconds <= 432000 && expiresInSeconds > 0;
    })
    .map((item) => ({
      ...item,
      expiresInSeconds: getExpiresInSeconds(item.expirationTime),
      expiresAt: new Date(item.expirationTime),
      isExpired: false,
      expirationStatus: getExpirationStatus(
        getExpiresInSeconds(item.expirationTime),
      ), // Changed to expirationStatus
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

export function getCriticalContent(content: ContentRow[]) {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  return content.filter((item) => {
    if (!item.expirationTime) return false;
    const expiresAt = new Date(item.expirationTime);
    return expiresAt > now && expiresAt <= oneHourLater;
  });
}

export function getExpiredContent(content: ContentRow[]) {
  const now = new Date();

  return content.filter((item) => {
    if (!item.expirationTime) return false;
    const expiresAt = new Date(item.expirationTime);
    return expiresAt <= now;
  });
}

export function getOwnershipChanges(
  activities: ActivityRow[],
): NotificationActivity[] {
  return activities
    .filter((item) => item.action === "OWNERSHIP_CHANGE")
    .map((item) => ({
      uuid: item.uuid,
      action: "OWNERSHIP_CHANGE",
      resourceUuid: item.resourceUuid ?? "",
      resourceName: item.resourceName ?? "",
      timestamp: item.timestamp,
      employee: item.employee,
      title: (item.resourceName ?? "").split(" (")[0] ?? "",
      notificationMessage: item.resourceName ?? "",
    }));
}

export function getContentEdits(
  activities: ActivityRow[],
): NotificationActivity[] {
  return activities
    .filter((item) => item.action === "EDIT_CONTENT")
    .map((item) => ({
      uuid: item.uuid,
      action: item.action,
      resourceUuid: item.resourceUuid ?? "",
      resourceName: item.resourceName ?? "",
      timestamp: item.timestamp,
      employee: item.employee,
      title: item.resourceName ?? "",
      notificationMessage: `Content was edited${
        item.employee ?
          ` by ${item.employee.firstName} ${item.employee.lastName}`
        : ""
      }`,
    }));
}

export function getClaimCreate(
  activities: ActivityRow[],
): NotificationActivity[] {
  return activities
    .filter((item) => item.action === "CREATE_CLAIM")
    .map((item) => ({
      uuid: item.uuid,
      action: item.action,
      resourceUuid: item.resourceUuid ?? "",
      resourceName: item.resourceName ?? "Claim",
      timestamp: item.timestamp,
      employee: item.employee,
      title: item.resourceName ?? "Claim Created",
      notificationMessage: `Claim created${item.employee ? ` by ${item.employee.firstName} ${item.employee.lastName}` : ""}`,
    }));
}

export function getClaimEdit(
  activities: ActivityRow[],
): NotificationActivity[] {
  return activities
    .filter((item) => item.action === "EDIT_CLAIM")
    .map((item) => ({
      uuid: item.uuid,
      action: item.action,
      resourceUuid: item.resourceUuid ?? "",
      resourceName: item.resourceName ?? "Claim",
      timestamp: item.timestamp,
      employee: item.employee,
      title: item.resourceName ?? "Claim Edited",
      notificationMessage: `Claim edited${item.employee ? ` by ${item.employee.firstName} ${item.employee.lastName}` : ""}`,
    }));
}

export function getClaimDelete(
  activities: ActivityRow[],
): NotificationActivity[] {
  return activities
    .filter((item) => item.action === "DELETE_CLAIM")
    .map((item) => ({
      uuid: item.uuid,
      action: item.action,
      resourceUuid: item.resourceUuid ?? "",
      resourceName: item.resourceName ?? "Claim",
      timestamp: item.timestamp,
      employee: item.employee,
      title: item.resourceName ?? "Claim Deleted",
      notificationMessage: `Claim deleted${item.employee ? ` by ${item.employee.firstName} ${item.employee.lastName}` : ""}`,
    }));
}
