import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  Paper,
  Popover,
  PopoverRoot,
} from "@mui/material";
import {
  NotificationsActive,
  Edit,
  AssignmentInd,
  Schedule,
  CheckCircle,
  Delete,
} from "@mui/icons-material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import type { To } from "react-router";
import theme from "../../theme.tsx";

// import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: "EXPIRATION" | "EDIT" | "OWNERSHIP_CHANGE";
  contentUuid: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  metadata?: any;
}

function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 36000000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setSnackbar({
        open: true,
        message: "All notifications marked as read",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to mark all as read",
        severity: "error",
      });
    }
  };

  const handleEditContent = async (contentUuid: string) => {
    // Navigate to edit page or open modal
    window.location.href = `/content/edit/${contentUuid}`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "EXPIRATION":
        return <Schedule color="warning" />;
      case "EDIT":
        return <Edit color="info" />;
      case "OWNERSHIP_CHANGE":
        return <AssignmentInd color="secondary" />;
      default:
        return <NotificationsActive />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "EXPIRATION":
        return "warning";
      case "EDIT":
        return "info";
      case "OWNERSHIP_CHANGE":
        return "secondary";
      default:
        return "primary";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread" && n.read) return false;
    if (typeFilter !== "all" && n.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button
        variant="contained"
        onClick={handleOpen}
      >
        More
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            maxWidth: 800,
            width: "100%",
            maxHeight: "80vh",
            overflow: "auto",
          },
        }}
      >
        {/* All content must be INSIDE the Popover */}
        <Box sx={{ p: 3 }}>
          <Paper
            elevation={0}
            sx={{ p: 2, mb: 3, bgcolor: "background.default" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h5">Notifications</Typography>
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} unread`}
                    color="primary"
                    size="small"
                  />
                )}
              </Box>
              {unreadCount > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </Box>

            <Tabs
              value={filter}
              onChange={(_, v) => setFilter(v)}
              sx={{ mb: 2 }}
            >
              <Tab
                label="All"
                value="all"
              />
              <Tab
                label="Unread"
                value="unread"
              />
            </Tabs>

            <Tabs
              value={typeFilter}
              onChange={(_, v) => setTypeFilter(v)}
            >
              <Tab
                label="All Types"
                value="all"
              />
              <Tab
                label="Expirations"
                value="EXPIRATION"
              />
              <Tab
                label="Edits"
                value="EDIT"
              />
              <Tab
                label="Ownership Changes"
                value="OWNERSHIP_CHANGE"
              />
            </Tabs>
          </Paper>

          {/* Notifications List */}
          <List>
            {filteredNotifications.length === 0 ?
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography color="textSecondary">
                  No notifications to display
                </Typography>
              </Paper>
            : filteredNotifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      "bgcolor":
                        notification.read ? "transparent" : "action.hover",
                      "borderRadius": 1,
                      "mb": 1,
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                    secondaryAction={
                      !notification.read && (
                        <Button
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: `${getNotificationColor(notification.type)}.light`,
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight={notification.read ? "normal" : "bold"}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.type.replace("_", " ")}
                            size="small"
                            color={
                              getNotificationColor(notification.type) as any
                            }
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            {notification.message}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              mt: 1,
                            }}
                          >
                            {notification.type === "EDIT" && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  handleEditContent(notification.contentUuid)
                                }
                              >
                                View Changes
                              </Button>
                            )}
                            {notification.type === "EXPIRATION" && (
                              <Button
                                size="small"
                                variant="outlined"
                                color="warning"
                                onClick={() =>
                                  handleEditContent(notification.contentUuid)
                                }
                              >
                                Renew Content
                              </Button>
                            )}
                            {notification.type === "OWNERSHIP_CHANGE" && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  handleEditContent(notification.contentUuid)
                                }
                              >
                                View Content
                              </Button>
                            )}
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))
            }
          </List>
        </Box>
      </Popover>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default NotificationPage;
