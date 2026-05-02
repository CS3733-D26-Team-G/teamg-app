import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getExpiredContent,
  getExpiresInSeconds,
  getExpiringContent,
  getCriticalContent,
  getContentEdits,
  getOwnershipChanges,
  getClaimActions,
} from "./Notifications.ts";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  Typography,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useDashboardBootstrap } from "../../dashboard/useDashboardBootstrap.ts";

interface NotificationCounts {
  critical: number;
  expiring: number;
  expired: number;
  ownership: number;
  edits: number;
  claims: number;
  total: number;
}

interface AlertItem {
  uuid: string;
  title: string;
  alertType: "critical" | "expiring" | "ownership" | "edit" | "claim";
  notificationMessage: string;
  expirationTime: string | Date | null;
}

const DISMISSED_NOTIFICATIONS_KEY = "dismissed_notifications";

function getNotificationMessage(
  title: string,
  expirationTime: string | Date | null,
): string {
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

function formatClaimTitle(resourceName: string, action: string): string {
  if (resourceName && resourceName !== "Claim") {
    return resourceName;
  }

  switch (action) {
    case "CREATE_CLAIM":
      return "New Claim Created";
    case "EDIT_CLAIM":
      return "Claim Updated";
    case "DELETE_CLAIM":
      return "Claim Deleted";
    default:
      return "Claim Activity";
  }
}

function useContentInfo() {
  const { data, loading, refresh } = useDashboardBootstrap();

  // Load dismissed notifications from localStorage on init
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
    return new Set();
  });

  // Save dismissed notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      DISMISSED_NOTIFICATIONS_KEY,
      JSON.stringify(Array.from(dismissedAlerts)),
    );
  }, [dismissedAlerts]);

  const dismissAlert = useCallback((uuid: string, type: string) => {
    setDismissedAlerts((prev) => {
      const newSet = new Set(prev);
      newSet.add(`${type}:${uuid}`);
      return newSet;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      void refresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  // Get raw data from different activity categories
  const criticalContent = useMemo(
    () => getCriticalContent(data?.contentList ?? []),
    [data?.contentList],
  );
  const expiringContent = useMemo(
    () => getExpiringContent(data?.contentList ?? []),
    [data?.contentList],
  );
  const expiredContent = useMemo(
    () => getExpiredContent(data?.contentList ?? []),
    [data?.contentList],
  );

  // Activity data from different categories
  // activityVerbose includes OWNERSHIP_CHANGE actions
  const ownershipChanges = useMemo(
    () => getOwnershipChanges(data?.activityVerbose ?? []),
    [data?.activityVerbose],
  );

  // activityContent includes content edits
  const contentEdits = useMemo(
    () => getContentEdits(data?.activityContent ?? []),
    [data?.activityContent],
  );

  const claimActions = useMemo(() => {
    const claimActivities =
      (data as any)?.activityClaim ?? // If separate claim activity exists
      data?.activityAll ?? // Fall back to all activities
      [];

    console.log(
      "Processing claim actions from:",
      claimActivities.length,
      "activities",
    );
    return getClaimActions(claimActivities);
  }, [data]);

  // Filter out dismissed alerts
  const visibleCriticalContent = useMemo(
    () =>
      criticalContent.filter(
        (item) => !dismissedAlerts.has(`critical:${item.uuid}`),
      ),
    [criticalContent, dismissedAlerts],
  );
  const visibleExpiringContent = useMemo(
    () =>
      expiringContent.filter(
        (item) => !dismissedAlerts.has(`expiring:${item.uuid}`),
      ),
    [dismissedAlerts, expiringContent],
  );
  const visibleOwnershipChanges = useMemo(
    () =>
      ownershipChanges.filter(
        (item) => !dismissedAlerts.has(`ownership:${item.uuid}`),
      ),
    [dismissedAlerts, ownershipChanges],
  );
  const visibleContentEdits = useMemo(
    () =>
      contentEdits.filter((item) => !dismissedAlerts.has(`edit:${item.uuid}`)),
    [contentEdits, dismissedAlerts],
  );
  const visibleClaimActions = useMemo(
    () =>
      claimActions.filter((item) => !dismissedAlerts.has(`claim:${item.uuid}`)),
    [claimActions, dismissedAlerts],
  );

  // Dismiss all visible alerts
  const dismissAllAlerts = useCallback(() => {
    setDismissedAlerts((prev) => {
      const newSet = new Set(prev);
      visibleCriticalContent.forEach((item) =>
        newSet.add(`critical:${item.uuid}`),
      );
      visibleExpiringContent.forEach((item) =>
        newSet.add(`expiring:${item.uuid}`),
      );
      visibleOwnershipChanges.forEach((item) =>
        newSet.add(`ownership:${item.uuid}`),
      );
      visibleContentEdits.forEach((item) => newSet.add(`edit:${item.uuid}`));
      visibleClaimActions.forEach((item) => newSet.add(`claim:${item.uuid}`));
      return newSet;
    });
  }, [
    visibleCriticalContent,
    visibleExpiringContent,
    visibleOwnershipChanges,
    visibleContentEdits,
    visibleClaimActions,
  ]);

  const counts = useMemo<NotificationCounts>(() => {
    const expiringCount = visibleExpiringContent.filter((content) => {
      const seconds = getExpiresInSeconds(content.expirationTime);
      return seconds <= 432000 && seconds > 3600;
    }).length;

    return {
      critical: visibleCriticalContent.length,
      expiring: expiringCount,
      expired: expiredContent.length,
      ownership: visibleOwnershipChanges.length,
      edits: visibleContentEdits.length,
      claims: visibleClaimActions.length,
      total:
        visibleCriticalContent.length +
        expiringCount +
        visibleOwnershipChanges.length +
        visibleContentEdits.length +
        visibleClaimActions.length,
    };
  }, [
    expiredContent.length,
    visibleContentEdits.length,
    visibleCriticalContent.length,
    visibleExpiringContent,
    visibleOwnershipChanges.length,
    visibleClaimActions.length,
  ]);

  return {
    visibleCriticalContent,
    visibleExpiringContent,
    visibleOwnershipChanges,
    visibleContentEdits,
    visibleClaimActions,
    counts,
    loading,
    dismissAlert,
    dismissAllAlerts,
  };
}

export default function NotificationsBell() {
  const {
    visibleCriticalContent,
    visibleExpiringContent,
    visibleOwnershipChanges,
    visibleContentEdits,
    visibleClaimActions,
    counts,
    loading,
    dismissAlert,
    dismissAllAlerts,
  } = useContentInfo();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const allAlerts: AlertItem[] = [
    ...visibleCriticalContent.map((c) => ({
      uuid: c.uuid,
      title: c.title || "",
      alertType: "critical" as const,
      notificationMessage: getNotificationMessage(
        c.title || "",
        c.expirationTime,
      ),
      expirationTime: c.expirationTime,
    })),
    ...visibleExpiringContent.map((c) => ({
      uuid: c.uuid,
      title: c.title || "",
      alertType: "expiring" as const,
      notificationMessage: getNotificationMessage(
        c.title || "",
        c.expirationTime,
      ),
      expirationTime: c.expirationTime,
    })),
    ...visibleOwnershipChanges.map((o) => ({
      uuid: o.uuid,
      title: o.title,
      alertType: "ownership" as const,
      notificationMessage: o.notificationMessage,
      expirationTime: null,
    })),
    ...visibleContentEdits.map((e) => ({
      uuid: e.uuid,
      title: e.title,
      alertType: "edit" as const,
      notificationMessage: e.notificationMessage,
      expirationTime: null,
    })),
    ...visibleClaimActions.map((c) => ({
      uuid: c.uuid,
      title: c.title,
      alertType: "claim" as const,
      notificationMessage: c.notificationMessage,
      expirationTime: null,
    })),
  ];

  const open = Boolean(anchorEl);
  const totalAlerts = counts.total;

  const handleDismiss = (uuid: string, title: string, alertType: string) => {
    dismissAlert(uuid, alertType);
    console.log(`"${title}" alert dismissed.`);
  };

  const handleDismissAll = () => {
    dismissAllAlerts();
    console.log("All notifications dismissed.");
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
      case "claim":
        return "primary";
      default:
        return "default";
    }
  };

  const getAlertIcon = () => {
    return totalAlerts <= 0 ?
        <NotificationsIcon />
      : <NotificationsActiveIcon />;
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ color: "white" }}
      >
        <Badge
          badgeContent={totalAlerts}
          color={counts.critical > 0 ? "error" : "warning"}
        >
          {getAlertIcon()}
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, width: 400 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              Notifications
              {totalAlerts > 0 && (
                <Chip
                  label={totalAlerts}
                  size="small"
                  color={counts.critical > 0 ? "error" : "warning"}
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            {totalAlerts > 0 && (
              <Button
                size="small"
                onClick={handleDismissAll}
                sx={{ textTransform: "none" }}
              >
                Dismiss All
              </Button>
            )}
          </Box>

          {loading ?
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          : allAlerts.length <= 0 ?
            <Typography
              sx={{ p: 2, textAlign: "center" }}
              color="textSecondary"
            >
              No current notifications
            </Typography>
          : <List sx={{ p: 0 }}>
              {allAlerts.slice(0, 10).map((alert) => (
                <ListItem
                  key={`${alert.alertType}-${alert.uuid}`}
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    borderBottom: "1px solid #e0e0e0",
                    py: 2,
                    px: 2,
                  }}
                >
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={1}
                    sx={{ minHeight: 32 }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      flex={1}
                      minWidth={0}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          flex: 1,
                        }}
                      >
                        {alert.title}
                      </Typography>
                      <Chip
                        label={alert.alertType}
                        size="small"
                        color={getAlertColor(alert.alertType) as any}
                        variant="outlined"
                        sx={{ flexShrink: 0 }}
                      />
                    </Box>
                    <IconButton
                      onClick={() =>
                        handleDismiss(alert.uuid, alert.title, alert.alertType)
                      }
                      size="small"
                      sx={{
                        "flexShrink": 0,
                        "ml": 1,
                        "&:hover": { backgroundColor: "#e0e0e0" },
                      }}
                    >
                      <ClearOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ mt: 0.5, width: "100%" }}
                  >
                    {alert.notificationMessage}
                  </Typography>
                </ListItem>
              ))}
              {allAlerts.length > 10 && (
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ p: 1, textAlign: "center", display: "block" }}
                >
                  +{allAlerts.length - 10} more notifications
                </Typography>
              )}
            </List>
          }
        </Box>
      </Popover>
    </>
  );
}
