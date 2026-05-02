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

import {
  Box,
  IconButton,
  List,
  ListItem,
  Typography,
  Chip,
  CircularProgress,
  Button,
  Badge,
} from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";

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
  timestamp?: string;
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

export function useContentInfo() {
  const { data, loading, refresh } = useDashboardBootstrap();

  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(DISMISSED_NOTIFICATIONS_KEY);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
    return new Set();
  });

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
  const ownershipChanges = useMemo(
    () => getOwnershipChanges(data?.activityVerbose ?? []),
    [data?.activityVerbose],
  );
  const contentEdits = useMemo(
    () => getContentEdits(data?.activityContent ?? []),
    [data?.activityContent],
  );
  const claimActions = useMemo(() => {
    const claimActivities =
      (data as any)?.activityClaim ?? data?.activityAll ?? [];
    return getClaimActions(claimActivities);
  }, [data]);

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

export function useNotificationFilter() {
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const setFilter = useCallback((filter: string) => {
    setCurrentFilter(filter);
  }, []);

  const clearFilter = useCallback(() => {
    setCurrentFilter("all");
  }, []);

  const closeFilters = useCallback(() => {
    setShowFilters(false);
  }, []);

  return {
    currentFilter,
    showFilters,
    setFilter,
    toggleFilters,
    clearFilter,
    closeFilters,
    isFiltering: currentFilter !== "all",
  };
}
export default function NotificationBarComponent() {
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

  // Use the filter hook
  const { currentFilter, setFilter, isFiltering } = useNotificationFilter();

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
      timestamp:
        typeof c.expirationTime === "string" ?
          c.expirationTime
        : c.expirationTime?.toString(),
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
      timestamp:
        typeof c.expirationTime === "string" ?
          c.expirationTime
        : c.expirationTime?.toString(),
    })),
    ...visibleOwnershipChanges.map((o) => ({
      uuid: o.uuid,
      title: o.title,
      alertType: "ownership" as const,
      notificationMessage: o.notificationMessage,
      expirationTime: null,
      timestamp: o.timestamp,
    })),
    ...visibleContentEdits.map((e) => ({
      uuid: e.uuid,
      title: e.title,
      alertType: "edit" as const,
      notificationMessage: e.notificationMessage,
      expirationTime: null,
      timestamp: e.timestamp,
    })),
    ...visibleClaimActions.map((c) => ({
      uuid: c.uuid,
      title: c.title,
      alertType: "claim" as const,
      notificationMessage: c.notificationMessage,
      expirationTime: null,
      timestamp: c.timestamp,
    })),
  ];

  // Filter alerts based on current filter
  const getFilteredAlerts = useCallback(() => {
    switch (currentFilter) {
      case "critical":
        return allAlerts.filter((alert) => alert.alertType === "critical");
      case "expiring":
        return allAlerts.filter(
          (alert) =>
            alert.alertType === "critical" || alert.alertType === "expiring",
        );
      case "claim":
        return allAlerts.filter((alert) => alert.alertType === "claim");
      case "ownership":
        return allAlerts.filter((alert) => alert.alertType === "ownership");
      case "edit":
        return allAlerts.filter((alert) => alert.alertType === "edit");
      default:
        return allAlerts;
    }
  }, [allAlerts, currentFilter]);

  const displayedAlerts = getFilteredAlerts();
  const totalAlerts = counts.total;

  const handleDismiss = (uuid: string, title: string, alertType: string) => {
    dismissAlert(uuid, alertType);
  };

  const handleDismissAll = () => {
    dismissAllAlerts();
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

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          mt: 2,
          mx: 2,
          minWidth: 0,
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
        <Box sx={{ display: "flex", gap: 1 }}>
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
      </Box>

      {/* Filter Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 1,
          px: 1,
        }}
      >
        <Button
          size="small"
          variant={currentFilter === "all" ? "contained" : "outlined"}
          onClick={() => setFilter("all")}
        >
          All ({allAlerts.length})
        </Button>
        <Button
          size="small"
          variant={currentFilter === "critical" ? "contained" : "outlined"}
          onClick={() => setFilter("critical")}
          color="error"
        >
          Critical ({visibleCriticalContent.length})
        </Button>
        <Button
          size="small"
          variant={currentFilter === "expiring" ? "contained" : "outlined"}
          onClick={() => setFilter("expiring")}
          color="warning"
        >
          Expiring (
          {visibleExpiringContent.length + visibleCriticalContent.length})
        </Button>
        <Button
          size="small"
          variant={currentFilter === "claim" ? "contained" : "outlined"}
          onClick={() => setFilter("claim")}
          color="primary"
        >
          Claims ({visibleClaimActions.length})
        </Button>
        <Button
          size="small"
          variant={currentFilter === "ownership" ? "contained" : "outlined"}
          onClick={() => setFilter("ownership")}
          color="info"
        >
          Ownership ({visibleOwnershipChanges.length})
        </Button>
        <Button
          size="small"
          variant={currentFilter === "edit" ? "contained" : "outlined"}
          onClick={() => setFilter("edit")}
          color="secondary"
        >
          Edits ({visibleContentEdits.length})
        </Button>
      </Box>

      {/* Results Count */}
      {isFiltering && displayedAlerts.length > 0 && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mb: 1, px: 2 }}
        >
          Showing {displayedAlerts.length} of {allAlerts.length} notifications
        </Typography>
      )}

      {/* Content Area */}
      <Box sx={{ flex: 1, overflowY: "auto", minHeight: 0, px: 1 }}>
        {loading ?
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        : displayedAlerts.length <= 0 ?
          <Typography
            sx={{ p: 2, textAlign: "center" }}
            color="textSecondary"
          >
            {isFiltering ?
              "No matching notifications"
            : "No current notifications"}
          </Typography>
        : <List sx={{ p: 0 }}>
            {displayedAlerts.map((alert) => (
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
                {alert.timestamp && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ mt: 0.5, fontSize: "10px" }}
                  >
                    {new Date(alert.timestamp).toLocaleString()}
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        }
      </Box>
    </Box>
  );
}
