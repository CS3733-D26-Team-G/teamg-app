import { useState, useEffect, useCallback } from "react";
import {
  getExpiredContent,
  getAllContent,
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
  const [allContent, setAllContent] = useState<ExpiringContent[]>([]);
  const [criticalContent, setCriticalContent] = useState<ExpiringContent[]>([]);
  const [expiringContent, setExpiringContent] = useState<ExpiringContent[]>([]);
  const [expiredContent, setExpiredContent] = useState<ExpiringContent[]>([]);
  const [ownershipChanges, setOwnershipChanges] = useState<
    Array<{
      uuid: string;
      action: string;
      resourceUuid: string;
      resourceName: string;
      timestamp: string;
      employee?: {
        firstName: string;
        lastName: string;
      };
      title: string;
      notificationMessage: string;
    }>
  >([]);

  const [contentEdits, setContentEdits] = useState<
    Array<{
      uuid: string;
      action: string;
      resourceUuid: string;
      resourceName: string;
      timestamp: string;
      employee?: {
        firstName: string;
        lastName: string;
      };
      title: string;
      notificationMessage: string;
    }>
  >([]);
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
        getOwnershipChanges(),
        getContentEdits(),
      ]);

      const expiring = getExpiringContent(content);
      const critical = getCriticalContent(content);
      const expired = getExpiredContent(content);

      const formattedOwnership = ownership.map((change: any) => ({
        uuid: change.uuid,
        action: change.action,
        resourceUuid: change.resourceUuid,
        resourceName: change.resourceName,
        timestamp: change.timestamp,
        employee: change.employee,
        title: change.resourceName.split(" (")[0],
        notificationMessage: change.resourceName,
      }));

      const formattedEdits = edits.map((edit: any) => ({
        uuid: edit.uuid,
        action: edit.action,
        resourceUuid: edit.resourceUuid,
        resourceName: edit.resourceName,
        timestamp: edit.timestamp,
        employee: edit.employee,
        title: edit.resourceName,
        notificationMessage: `Content was edited${edit.employee ? ` by ${edit.employee.firstName} ${edit.employee.lastName}` : ""}`,
      }));

      setAllContent(content as unknown as ExpiringContent[]);
      setCriticalContent(critical);
      setExpiringContent(expiring);
      setExpiredContent(expired);
      setOwnershipChanges(formattedOwnership);
      setContentEdits(formattedEdits);

      const expiringCount = expiring.filter((c) => {
        const seconds = getExpiresInSeconds(c.expirationTime);
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

  const allAlerts = [
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
                    {alert.notificationMessage ||
                      getNotificationMessage(
                        alert.title,
                        alert.expirationTime instanceof Date ?
                          alert.expirationTime.toISOString()
                        : alert.expirationTime!,
                      )}
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
