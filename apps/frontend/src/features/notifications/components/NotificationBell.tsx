import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getExpiredContent,
  getExpiresInSeconds,
  getExpiringContent,
  getCriticalContent,
  getContentEdits,
  getOwnershipChanges,
} from "./Notifications.ts";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import NotificationPage from "./NotificationPage.tsx";

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
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useDashboardBootstrap } from "../../dashboard/useDashboardBootstrap.ts";

interface ExpiringContent {
  uuid: string;
  title: string;
  expirationTime: string | Date;
  expiresInSeconds?: number;
  status?: string;
  notificationMessage?: string | null;
  formatted_time_remaining?: string;
}

interface NotificationCounts {
  critical: number;
  expiring: number;
  expired: number;
  ownership: number;
  edits: number;
  total: number;
}

interface AlertItem {
  uuid: string;
  title: string;
  alertType: "critical" | "expiring" | "ownership" | "edit";
  notificationMessage?: string | null;
  expirationTime: string | Date | null;
}

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

function useContentInfo() {
  const { data, loading, refresh } = useDashboardBootstrap();
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const dismissAlert = useCallback((uuid: string, type: string) => {
    setDismissedAlerts((prev) => {
      const key = `${type}:${uuid}`;
      return prev.includes(key) ? prev : [...prev, key];
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      void refresh();
    }, 3600000);
    return () => clearInterval(interval);
  }, [refresh]);

  const allContent = useMemo(
    () => (data?.contentList ?? []) as unknown as ExpiringContent[],
    [data?.contentList],
  );
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

  const visibleCriticalContent = useMemo(
    () =>
      criticalContent.filter(
        (item) => !dismissedAlerts.includes(`critical:${item.uuid}`),
      ),
    [criticalContent, dismissedAlerts],
  );
  const visibleExpiringContent = useMemo(
    () =>
      expiringContent.filter(
        (item) => !dismissedAlerts.includes(`expiring:${item.uuid}`),
      ),
    [dismissedAlerts, expiringContent],
  );
  const visibleOwnershipChanges = useMemo(
    () =>
      ownershipChanges.filter(
        (item) => !dismissedAlerts.includes(`ownership:${item.uuid}`),
      ),
    [dismissedAlerts, ownershipChanges],
  );
  const visibleContentEdits = useMemo(
    () =>
      contentEdits.filter(
        (item) => !dismissedAlerts.includes(`edit:${item.uuid}`),
      ),
    [contentEdits, dismissedAlerts],
  );

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
      total:
        visibleCriticalContent.length +
        expiringCount +
        visibleOwnershipChanges.length +
        visibleContentEdits.length,
    };
  }, [
    expiredContent.length,
    visibleContentEdits.length,
    visibleCriticalContent.length,
    visibleExpiringContent,
    visibleOwnershipChanges.length,
  ]);

  return {
    allContent,
    criticalContent: visibleCriticalContent,
    expiringContent: visibleExpiringContent,
    expiredContent,
    ownershipChanges: visibleOwnershipChanges,
    contentEdits: visibleContentEdits,
    counts,
    loading,
    dismissAlert,
    refresh,
  };
}

export default function NotificationsBell() {
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

  const allAlerts: AlertItem[] = [
    ...criticalContent.map((c) => ({ ...c, alertType: "critical" as const })),
    ...expiringContent.map((c) => ({ ...c, alertType: "expiring" as const })),
    ...ownershipChanges.map((o) => ({
      uuid: o.uuid,
      title: o.title,
      alertType: "ownership" as const,
      notificationMessage: o.notificationMessage,
      expirationTime: null,
    })),
    ...contentEdits.map((e) => ({
      uuid: e.uuid,
      title: e.title,
      alertType: "edit" as const,
      notificationMessage: e.notificationMessage,
      expirationTime: null,
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
            {/*<NotificationPage />*/}
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
                  }}
                >
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                      >
                        {alert.title}
                      </Typography>
                      <Chip
                        label={alert.alertType}
                        size="small"
                        color={getAlertColor(alert.alertType) as any}
                        variant="outlined"
                      />
                    </Box>
                    <IconButton
                      onClick={() =>
                        handleDismiss(alert.uuid, alert.title, alert.alertType)
                      }
                      size="small"
                      sx={{
                        "&:hover": {
                          backgroundColor: "#e0e0e0",
                        },
                      }}
                    >
                      <ClearOutlinedIcon />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ mt: 0.5 }}
                  >
                    {alert.notificationMessage ??
                      getNotificationMessage(alert.title, alert.expirationTime)}
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
