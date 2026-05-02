import type { ActivityRow } from "../../types/activity.ts";
import type { ContentRow } from "../../types/content.ts";
import type { InsuranceClaimType } from "@repo/db";
import type {
  InsuranceClaimCreatePayload,
  InsuranceClaimRecord,
} from "../../types/claim.ts";

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
      ),
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

function getClaimNotificationMessage(
  action: string,
  employee?: { firstName: string; lastName: string },
  claimType?: string,
): string {
  const employeeInfo =
    employee ? ` by ${employee.firstName} ${employee.lastName}` : "";
  const claimTypeInfo =
    claimType ? ` ${claimType.toLowerCase()} claim` : " claim";

  switch (action) {
    case "CREATE_CLAIM":
      return `${claimTypeInfo.charAt(0).toUpperCase() + claimTypeInfo.slice(1)} was created${employeeInfo}`;
    case "EDIT_CLAIM":
      return `${claimTypeInfo.charAt(0).toUpperCase() + claimTypeInfo.slice(1)} was edited${employeeInfo}`;
    case "DELETE_CLAIM":
      return `${claimTypeInfo.charAt(0).toUpperCase() + claimTypeInfo.slice(1)} was deleted${employeeInfo}`;
    case "UPDATE_CLAIM_STATUS":
      return `${claimTypeInfo.charAt(0).toUpperCase() + claimTypeInfo.slice(1)} status was updated${employeeInfo}`;
    default:
      return `Claim action ${action} performed${employeeInfo}`;
  }
}

export function getClaimActions(
  claims: InsuranceClaimRecord[],
  previousClaims?: InsuranceClaimRecord[],
): NotificationActivity[] {
  const notifications: NotificationActivity[] = [];

  // Handle new claims (created)
  if (previousClaims) {
    // Find newly created claims
    const newClaims = claims.filter(
      (claim) => !previousClaims.some((prev) => prev.uuid === claim.uuid),
    );

    newClaims.forEach((claim) => {
      notifications.push({
        uuid: claim.uuid,
        action: "CREATE_CLAIM",
        resourceUuid: claim.uuid,
        resourceName: `Claim #${claim.uuid.slice(0, 8)} - ${claim.claimType || "Insurance"}`,
        timestamp: String(claim.createdAt || new Date().toISOString()),
        employee:
          claim.requestor ?
            {
              firstName: claim.requestor.firstName,
              lastName: claim.requestor.lastName,
              uuid: claim.requestor.uuid,
              avatar: null,
            }
          : undefined,
        title: `New ${claim.claimType || "Insurance"} Claim - ${claim.requestor?.firstName} ${claim.requestor?.lastName}`,
        notificationMessage: getClaimNotificationMessage(
          "CREATE_CLAIM",
          claim.requestor,
          claim.claimType,
        ),
      });
    });

    // Find updated claims (existing claims with changes)
    const updatedClaims = claims.filter((claim) => {
      const prevClaim = previousClaims.find((prev) => prev.uuid === claim.uuid);
      if (!prevClaim) return false;

      // Check if claim has been modified
      return (
        JSON.stringify(claim.contents) !== JSON.stringify(prevClaim.contents) ||
        claim.status !== prevClaim.status ||
        claim.incidentDescription !== prevClaim.incidentDescription ||
        claim.incidentDate !== prevClaim.incidentDate
      );
    });

    updatedClaims.forEach((claim) => {
      const prevClaim = previousClaims.find((prev) => prev.uuid === claim.uuid);
      const isStatusUpdate = prevClaim && claim.status !== prevClaim.status;
      const action = isStatusUpdate ? "UPDATE_CLAIM_STATUS" : "EDIT_CLAIM";

      notifications.push({
        uuid: claim.uuid,
        action: action,
        resourceUuid: claim.uuid,
        resourceName: `Claim #${claim.uuid.slice(0, 8)} - ${claim.claimType || "Insurance"}`,
        timestamp: String(claim.updatedAt || new Date().toISOString()),
        employee:
          claim.requestor ?
            {
              firstName: claim.requestor.firstName,
              lastName: claim.requestor.lastName,
              uuid: claim.requestor.uuid,
              avatar: null,
            }
          : undefined,
        title: `${claim.claimType || "Insurance"} Claim ${isStatusUpdate ? "Status Update" : "Updated"} - ${claim.requestor?.firstName} ${claim.requestor?.lastName}`,
        notificationMessage: getClaimNotificationMessage(
          action,
          claim.requestor,
          claim.claimType,
        ),
      });
    });

    // Find deleted claims
    const deletedClaims = previousClaims.filter(
      (prev) => !claims.some((claim) => claim.uuid === prev.uuid),
    );

    deletedClaims.forEach((claim) => {
      notifications.push({
        uuid: claim.uuid,
        action: "DELETE_CLAIM",
        resourceUuid: claim.uuid,
        resourceName: `Claim #${claim.uuid.slice(0, 8)} - ${claim.claimType || "Insurance"}`,
        timestamp: new Date().toISOString(),
        employee:
          claim.requestor ?
            {
              firstName: claim.requestor.firstName,
              lastName: claim.requestor.lastName,
              uuid: claim.requestor.uuid,
              avatar: null,
            }
          : undefined,
        title: `Deleted ${claim.claimType || "Insurance"} Claim - ${claim.requestor?.firstName} ${claim.requestor?.lastName}`,
        notificationMessage: getClaimNotificationMessage(
          "DELETE_CLAIM",
          claim.requestor,
          claim.claimType,
        ),
      });
    });
  } else {
    // If no previous claims provided, treat all as new
    claims.forEach((claim) => {
      notifications.push({
        uuid: claim.uuid,
        action: "CREATE_CLAIM",
        resourceUuid: claim.uuid,
        resourceName: `Claim #${claim.uuid.slice(0, 8)} - ${claim.claimType || "Insurance"}`,
        timestamp: String(claim.createdAt || new Date().toISOString()),
        employee:
          claim.requestor ?
            {
              firstName: claim.requestor.firstName,
              lastName: claim.requestor.lastName,
              uuid: claim.requestor.uuid,
              avatar: null,
            }
          : undefined,
        title: `${claim.claimType || "Insurance"} Claim - ${claim.requestor?.firstName} ${claim.requestor?.lastName}`,
        notificationMessage: getClaimNotificationMessage(
          "CREATE_CLAIM",
          claim.requestor,
          claim.claimType,
        ),
      });
    });
  }

  // Sort notifications by timestamp (newest first)
  return notifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

// Alternative version that works with ActivityRow (if you store claim actions as activities)
export function getClaimActionsFromActivities(
  activities: ActivityRow[],
): NotificationActivity[] {
  return activities
    .filter(
      (item) =>
        item.action === "CREATE_CLAIM" ||
        item.action === "EDIT_CLAIM" ||
        item.action === "DELETE_CLAIM" ||
        item.action === "UPDATE_CLAIM_STATUS",
    )
    .map((item) => {
      // Extract claim type from resourceName if available
      const claimType =
        item.resourceName?.includes("-") ?
          item.resourceName.split("-")[1]?.trim()
        : "Insurance";

      return {
        uuid: item.uuid,
        action: item.action,
        resourceUuid: item.resourceUuid ?? "",
        resourceName: item.resourceName ?? "",
        timestamp: item.timestamp,
        employee: item.employee,
        title: `${claimType} Claim ${item.action.replace("_CLAIM", "").toLowerCase()}d`,
        notificationMessage: getClaimNotificationMessage(
          item.action,
          item.employee || undefined,
          claimType,
        ),
      };
    });
}
