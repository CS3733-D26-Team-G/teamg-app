import { useState, useEffect, useCallback } from "react";
import {
  getExpiredContent,
  getAllContent,
  getExpiresInSeconds,
  getExpiringContent,
  getCriticalContent,
  getContentEdits,
  getOwnershipChanges,
} from "../../features/notifications/components/Notifications.ts";
import type { ContentRow } from "../../types/content.ts";
import type { ActivityRow } from "../../types/activity.ts";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

interface ExpiringContentItem extends ContentRow {
  expiresInSeconds: number;
  expiresAt: Date;
  isExpired: boolean;
  expirationStatus: "critical" | "warning" | "info" | "expired";
}

interface FormattedNotification {
  uuid: string;
  action: string;
  resourceUuid: string;
  resourceName: string;
  timestamp: string;
  employee?: {
    first_name: string;
    last_name: string;
  };
  title: string;
  notification_message: string;
}

interface NotificationCounts {
  critical: number;
  expiring: number;
  expired: number;
  ownership: number;
  edits: number;
  total: number;
}

function getNotificationMessage(title: string, expirationTime: string): string {
  const seconds = getExpiresInSeconds(expirationTime);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  if (seconds <= 0) return `"${title}" has expired`;
  if (seconds <= 3600)
    return `URGENT: "${title}" expires in ${minutes} minutes!`;
  if (seconds <= 86400) return `"${title}" expires in ${hours} hours`;
  if (seconds <= 432000) return `"${title}" expires in ${days} days`;
  return `"${title}" expires soon`;
}

function useContentInfo() {
  const [allContent, setAllContent] = useState<ContentRow[]>([]);
  const [criticalContent, setCriticalContent] = useState<ContentRow[]>([]);
  const [expiringContent, setExpiringContent] = useState<ExpiringContentItem[]>(
    [],
  );
  const [expiredContent, setExpiredContent] = useState<ContentRow[]>([]);
  const [ownershipChanges, setOwnershipChanges] = useState<
    FormattedNotification[]
  >([]);
  const [contentEdits, setContentEdits] = useState<FormattedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<NotificationCounts>({
    critical: 0,
    expiring: 0,
    expired: 0,
    ownership: 0,
    edits: 0,
    total: 0,
  });

  const dismissAlert = useCallback(
    (uuid: string, type: string) => {
      if (type === "critical" || type === "expiring") {
        setAllContent((prev) => prev.filter((item) => item.uuid !== uuid));
        setCriticalContent((prev) => prev.filter((item) => item.uuid !== uuid));
        setExpiringContent((prev) => prev.filter((item) => item.uuid !== uuid));

        setCounts((prev) => ({
          ...prev,
          critical:
            prev.critical -
            (criticalContent.find((item) => item.uuid === uuid) ? 1 : 0),
          expiring:
            prev.expiring -
            (expiringContent.find((item) => item.uuid === uuid) ? 1 : 0),
          total: prev.total - 1,
        }));
      }

      if (type === "ownership") {
        setOwnershipChanges((prev) =>
          prev.filter((item) => item.uuid !== uuid),
        );
        setCounts((prev) => ({
          ...prev,
          ownership: prev.ownership - 1,
          total: prev.total - 1,
        }));
      }

      if (type === "edit") {
        setContentEdits((prev) => prev.filter((item) => item.uuid !== uuid));
        setCounts((prev) => ({
          ...prev,
          edits: prev.edits - 1,
          total: prev.total - 1,
        }));
      }
    },
    [criticalContent, expiringContent],
  );

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);

      const [content, ownership, edits] = await Promise.all([
        getAllContent(),
        getOwnershipChanges([] as ActivityRow[]), // Pass empty array as fallback
        getContentEdits([] as ActivityRow[]), // Pass empty array as fallback
      ]);

      // Ensure content is an array
      const contentArray = Array.isArray(content) ? content : [];

      const expiring = getExpiringContent(contentArray);
      const critical = getCriticalContent(contentArray);
      const expired = getExpiredContent(contentArray);

      const formattedOwnership: FormattedNotification[] = ownership.map(
        (change) => ({
          uuid: change.uuid,
          action: change.action,
          resourceUuid: change.resourceUuid,
          resourceName: change.resourceName,
          timestamp: change.timestamp,
          employee:
            change.employee ?
              {
                first_name: change.employee.firstName,
                last_name: change.employee.lastName,
              }
            : undefined,
          title: change.resourceName.split(" (")[0],
          notification_message: change.resourceName,
        }),
      );

      const formattedEdits: FormattedNotification[] = edits.map((edit) => ({
        uuid: edit.uuid,
        action: edit.action,
        resourceUuid: edit.resourceUuid,
        resourceName: edit.resourceName,
        timestamp: edit.timestamp,
        employee:
          edit.employee ?
            {
              first_name: edit.employee.firstName,
              last_name: edit.employee.lastName,
            }
          : undefined,
        title: edit.resourceName,
        notification_message: `Content was edited${edit.employee ? ` by ${edit.employee.firstName} ${edit.employee.lastName}` : ""}`,
      }));

      setAllContent(contentArray);
      setCriticalContent(critical);
      setExpiringContent(expiring);
      setExpiredContent(expired);
      setOwnershipChanges(formattedOwnership);
      setContentEdits(formattedEdits);

      const expiringCount = expiring.filter((c) => {
        const seconds = c.expiresInSeconds;
        return seconds <= 432000 && seconds > 3600;
      }).length;

      const totalAlerts =
        critical.length +
        expiringCount +
        formattedOwnership.length +
        formattedEdits.length;

      setCounts({
        critical: critical.length,
        expiring: expiringCount,
        expired: expired.length,
        ownership: formattedOwnership.length,
        edits: formattedEdits.length,
        total: totalAlerts,
      });
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    const interval = setInterval(fetchContent, 3600000);
    return () => clearInterval(interval);
  }, [fetchContent]);

  return {
    allContent,
    criticalContent,
    expiringContent,
    expiredContent,
    ownershipChanges,
    contentEdits,
    counts,
    loading,
    dismissAlert,
    refresh: fetchContent,
  };
}

export default function ContentBar() {
  const {
    criticalContent,
    expiringContent,
    ownershipChanges,
    contentEdits,
    counts,
    loading,
    dismissAlert,
  } = useContentInfo();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const allAlerts = [
    ...criticalContent.map((c) => ({
      uuid: c.uuid,
      title: c.title || c.contentOwner || "",
      alertType: "critical" as const,
      notification_message: getNotificationMessage(
        c.title || c.contentOwner || "",
        String(c.expirationTime) || "",
      ),
      expiration_time: c.expirationTime,
    })),
    ...expiringContent.map((c) => ({
      uuid: c.uuid,
      title: c.title || c.contentOwner || "",
      alertType: "expiring" as const,
      notification_message: getNotificationMessage(
        c.title || c.contentOwner || "",
        String(c.expirationTime) || "",
      ),
      expiration_time: c.expirationTime,
    })),
    ...ownershipChanges.map((o) => ({
      uuid: o.uuid,
      title: o.title,
      alertType: "ownership" as const,
      notification_message: o.notification_message,
      expiration_time: null,
    })),
    ...contentEdits.map((e) => ({
      uuid: e.uuid,
      title: e.title,
      alertType: "edit" as const,
      notification_message: e.notification_message,
      expiration_time: null,
    })),
  ];

  const open = Boolean(anchorEl);
  const totalAlerts = counts.total;

  const handleDismiss = (uuid: string, title: string, alertType: string) => {
    dismissAlert(uuid, alertType);
    console.log(`"${title}" alert dismissed.`);
  };

  const getAlertColor = (alertType: string) => {
    switch (alertType) {
      case "critical":
        return "error";
      case "expiring":
        return "warning";
      case "ownership":
        return "info";
      case "edit":
        return "secondary";
      default:
        return "default";
    }
  };

  const getAlertIcon = () => {
    return totalAlerts <= 0 ?
        <NotificationsIcon />
      : <NotificationsActiveIcon />;
  };
}
