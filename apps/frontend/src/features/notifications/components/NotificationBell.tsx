import { useState } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import NotificationBarComponent from "./NotificationBar";

import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useContentInfo } from "./NotificationBar";
import { useNotificationFilterToggle } from "./NotificationsSettingsToggle.tsx";
import React from "react";

// Custom hook to get filtered total alerts count
function useFilteredTotalAlerts() {
  const {
    visibleCriticalContent,
    visibleExpiringContent,
    visibleOwnershipChanges,
    visibleContentEdits,
    visibleClaimActions,
  } = useContentInfo();

  const { hideEdits } = useNotificationFilterToggle();

  const total = React.useMemo(() => {
    let total = 0;
    total += visibleCriticalContent.length;
    total += visibleExpiringContent.length;
    total += visibleClaimActions.length;

    if (!hideEdits) {
      total += visibleContentEdits.length;
      total += visibleOwnershipChanges.length;
    }

    return total;
  }, [
    visibleCriticalContent.length,
    visibleExpiringContent.length,
    visibleOwnershipChanges.length,
    visibleContentEdits.length,
    visibleClaimActions.length,
    hideEdits,
  ]);

  return total;
}

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const totalAlertsCount = useFilteredTotalAlerts();

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
        <NotificationBarComponent />
      </Popover>
    </>
  );
}
