import { useState, useEffect, useCallback, useMemo } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import NotificationBarComponent from "./NotificationBar";

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
  Card,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useDashboardBootstrap } from "../../dashboard/useDashboardBootstrap.ts";
import { useContentInfo } from "./NotificationBar";

// Custom hook to get total alerts count for the bell
function useTotalAlerts() {
  const {
    visibleCriticalContent,
    visibleExpiringContent,
    visibleOwnershipChanges,
    visibleContentEdits,
    visibleClaimActions,
  } = useContentInfo();

  const total = useMemo(() => {
    return (
      visibleCriticalContent.length +
      visibleExpiringContent.length +
      visibleOwnershipChanges.length +
      visibleContentEdits.length +
      visibleClaimActions.length
    );
  }, [
    visibleCriticalContent.length,
    visibleExpiringContent.length,
    visibleOwnershipChanges.length,
    visibleContentEdits.length,
    visibleClaimActions.length,
  ]);

  return total;
}

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const totalAlertsCount = useTotalAlerts();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const getAlertIcon = () => {
    if (totalAlertsCount <= 0) {
      return <NotificationsIcon />;
    } else {
      return <NotificationsActiveIcon />;
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ color: "white" }}
      >
        <Badge
          badgeContent={totalAlertsCount}
          color={totalAlertsCount > 0 ? "error" : "warning"}
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
        PaperProps={{
          sx: {
            width: "400px",
            maxHeight: "500px",
            borderRadius: 2,
            overflow: "auto",
          },
        }}
      >
        <NotificationBarComponent showFilters={false} />
      </Popover>
    </>
  );
}
