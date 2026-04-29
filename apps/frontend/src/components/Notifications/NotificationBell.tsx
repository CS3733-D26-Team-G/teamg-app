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
import { NotificationsActive } from "@mui/icons-material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useNavigate } from "react-router-dom";
import NotificationPage from "./NotificationPage.tsx";

import {
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  Typography,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

interface ExpiringContent {
  uuid: string;
  title: string;
  expiration_time: string;
  expires_in_seconds: number;
  status: "active" | "expiring_soon" | "critical" | "expired";
  notification_message: string | null;
  formatted_time_remaining?: string;
}

interface ActivityNotification {
  uuid: string;
  action: string;
  resourceUuid: string;
  resourceName: string;
  timestamp: string;
  employee?: {
    first_name: string;
    last_name: string;
  };
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
    ActivityNotification[]
  >([]);
  const [contentEdits, setContentEdits] = useState<ActivityNotification[]>([]);
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
      // Handle content expiration alerts (critical/expiring)
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

      // Handle ownership change alerts
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

      // Handle content edit alerts
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

      // Fetch all data in parallel
      const [content, ownership, edits] = await Promise.all([
        getAllContent(),
        getOwnershipChanges(),
        getContentEdits(),
      ]);

      // Calculate expiration data
      const expiring = getExpiringContent(content);
      const critical = getCriticalContent(content);
      const expired = getExpiredContent(content);

      setAllContent(content);
      setCriticalContent(critical);
      setExpiringContent(expiring);
      setExpiredContent(expired);
      setOwnershipChanges(ownership);
      setContentEdits(edits);

      // Calculate counts
      const expiringCount = expiring.filter((c) => {
        const seconds = getExpiresInSeconds(c.expiration_time);
        return seconds <= 432000 && seconds > 3600;
      }).length;

      const totalAlerts =
        critical.length + expiringCount + ownership.length + edits.length;

      setCounts({
        critical: critical.length,
        expiring: expiringCount,
        expired: expired.length,
        ownership: ownership.length,
        edits: edits.length,
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
    refresh,
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
      title: o.resourceName,
      alertType: "ownership" as const,
      notification_message: `Ownership changed${o.employee ? ` by ${o.employee.first_name} ${o.employee.last_name}` : ""}`,
      expiration_time: null,
    })),
    ...contentEdits.map((e) => ({
      uuid: e.uuid,
      title: e.resourceName,
      alertType: "edit" as const,
      notification_message: `Content was edited${e.employee ? ` by ${e.employee.first_name} ${e.employee.last_name}` : ""}`,
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
    return totalAlerts <= 0 ? <NotificationsIcon /> : <NotificationsActive />;
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
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
            <NotificationPage />
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
                    {alert.notification_message ||
                      getNotificationMessage(
                        alert.title,
                        alert.expiration_time!,
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
