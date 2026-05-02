import { useState, useEffect, useCallback, useMemo } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import NotificationBar, { totalAlerts } from "./NotificationBar";

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

const getAlertIcon = () => {
  const counts = totalAlerts();
  if (counts <= 0) {
    return <NotificationsIcon />;
  } else {
    return <NotificationsActiveIcon />;
  }
};
export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ color: "white" }}
      >
        <Badge
          badgeContent={totalAlerts()}
          color={totalAlerts() > 0 ? "error" : "warning"}
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
        <NotificationBar />
      </Popover>
    </>
  );
}
