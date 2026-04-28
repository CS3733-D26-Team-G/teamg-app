import { useState, useEffect, useCallback } from "react";
import {
  getExpiredContent,
  getAllContent,
  getExpiresInSeconds,
  getExpiringContent,
  getCriticalContent,
} from "./ExpiringContent.ts";
import { NotificationsActive } from "@mui/icons-material";

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

interface ExpirationCounts {
  critical: number;
  expiring: number;
  expired: number;
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
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<ExpirationCounts>({
    critical: 0,
    expiring: 0,
    expired: 0,
    total: 0,
  });

  const dismissAlert = useCallback(
    (uuid: string) => {
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
    },
    [criticalContent, expiringContent],
  );

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const content = await getAllContent();

      // Calculate expiration data
      const expiring = getExpiringContent(content);
      const critical = getCriticalContent(content);
      const expired = getExpiredContent(content);

      setAllContent(content);
      setCriticalContent(critical);
      setExpiringContent(expiring);
      setExpiredContent(expired);
      setCounts({
        critical: critical.length,
        expiring: expiring.filter((c) => {
          const seconds = getExpiresInSeconds(c.expiration_time);
          return seconds <= 432000 && seconds > 3600;
        }).length,
        expired: expired.length,
        total: expiring.length + expired.length,
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

  const allAlerts = [...criticalContent, ...expiringContent];
  const open = Boolean(anchorEl);
  const totalAlerts = counts.critical + counts.expiring;

  const handleDismiss = (uuid: string, title: string, status: string) => {
    dismissAlert(uuid);
    console.log(
      `"${title}" alert dismissed. You won't see this reminder again.`,
    );
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
          {totalAlerts <= 0 ?
            <NotificationsIcon />
          : <NotificationsActive />}
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
          <Typography variant="h6">
            Expiring Content
            {totalAlerts > 0 && (
              <Chip
                label={totalAlerts}
                size="small"
                color={counts.critical > 0 ? "error" : "warning"}
                sx={{ ml: 1 }}
              />
            )}
          </Typography>

          {loading ?
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          : allAlerts.length <= 0 ?
            <Typography
              sx={{ p: 2, textAlign: "center" }}
              color="textSecondary"
            >
              No expiring content
            </Typography>
          : <List sx={{ p: 0 }}>
              {allAlerts.map((alert) => (
                <ListItem
                  key={alert.uuid}
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
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                    >
                      {alert.title}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        handleDismiss(alert.uuid, alert.title, alert.status)
                      }
                    >
                      Dismiss
                    </Button>
                  </Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ mt: 0.5 }}
                  >
                    {alert.notification_message ||
                      getNotificationMessage(
                        alert.title,
                        alert.expiration_time,
                      )}
                  </Typography>
                </ListItem>
              ))}
            </List>
          }
        </Box>
      </Popover>
    </>
  );
}
