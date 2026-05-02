import React, { useState } from "react";
import "./Sidebar.css";
import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Avatar,
} from "@mui/material";
import { Link } from "react-router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import WarningIcon from "@mui/icons-material/Warning";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import SpeedIcon from "@mui/icons-material/Speed";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { API_ENDPOINTS } from "../config.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.tsx";
//import Typography from "@mui/material/Typography";
import { useProfile } from "../profile/ProfileContext.tsx";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const [adminOpen, setAdminOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { clearSession, session } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const isAdmin = session?.permissions.can_manage_employees ?? false;
  const isUnderwriter = session?.position === "UNDERWRITER";
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    current: boolean,
  ) => {
    if (!isOpen) setIsOpen(true);
    setter(!current);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        clearSession();
        localStorage.clear();
        navigate("/");
      } else {
        console.error("Logout Failed");
      }
    } catch (e) {
      setError("Network error. Check your connection.");
      console.error(e);
    }
  };

  if (isProfileLoading || !profile) return null;

  // Shared styles for sidebar items — white text on the dark gradient
  const iconSx = { color: "rgba(255,255,255,0.75)" };
  const textSx = {
    color: "rgba(255,255,255,0.9)",
    fontWeight: 500,
    fontFamily: "Rubik, sans-serif",
  };
  const itemHoverSx = {
    "borderRadius": "8px",
    "mx": 0.5,
    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
    "&.Mui-selected": { backgroundColor: "rgba(255,255,255,0.15)" },
  };

  return (
    <Box
      className="Sidebar"
      sx={{
        width: isOpen ? "240px" : "64px",
        transition: "width 0.3s",
        position: "sticky",
        top: 0,
        background: "transparent",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Logo + collapse toggle ─────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          padding: "10px 8px",
          minHeight: 64,
        }}
      >
        <Box
          component="img"
          src={"/hanover_logo.png"}
          alt="Hanover Logo"
          sx={{
            width: "140px",
            mx: "auto",
            my: 1,
            display: isOpen ? "block" : "none",
            imageRendering: "crisp-edges",
            filter: "brightness(0) invert(1)",
          }}
        />
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{ color: "rgba(255,255,255,0.75)" }}
        >
          {isOpen ?
            <KeyboardDoubleArrowLeftIcon />
          : <KeyboardDoubleArrowRightIcon />}
        </IconButton>
      </Box>

      {/* ── Nav items ──────────────────────────────────────────────────── */}
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.25,
          px: 0.5,
          mt: 0.5,
        }}
      >
        {/* Dashboard */}
        <ListItemButton
          component={Link}
          to="/dashboard"
          sx={{ ...itemHoverSx, px: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
            <DashboardIcon sx={iconSx} />
          </ListItemIcon>
          {isOpen && (
            <ListItemText
              primary="Dashboard"
              slotProps={{ primary: { sx: textSx } }}
            />
          )}
        </ListItemButton>

        {/* Admin management submenu */}
        {isAdmin ?
          <>
            <ListItemButton
              id="tutorial-management-menu"
              onClick={() => handleToggle(setAdminOpen, adminOpen)}
              sx={{ ...itemHoverSx, px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
                <AdminPanelSettingsIcon
                  sx={{ color: "rgba(255,255,255,0.75)" }}
                />
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary="Management"
                  slotProps={{ primary: { sx: textSx } }}
                />
              )}
              {isOpen &&
                (adminOpen ?
                  <ExpandLess sx={{ color: "rgba(255,255,255,0.55)" }} />
                : <ExpandMore sx={{ color: "rgba(255,255,255,0.55)" }} />)}
            </ListItemButton>

            <Collapse
              in={adminOpen && isOpen}
              timeout="auto"
              unmountOnExit
            >
              <List
                component="div"
                disablePadding
              >
                <ListItemButton
                  component={Link}
                  to="/employee-management"
                  sx={{ ...itemHoverSx, pl: 4 }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                    <PeopleIcon
                      fontSize="small"
                      sx={{ color: "rgba(255,255,255,0.65)" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Employees"
                    slotProps={{
                      primary: { sx: { ...textSx, fontSize: "0.9rem" } },
                    }}
                  />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to="/content-management"
                  sx={{ ...itemHoverSx, pl: 4 }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                    <LibraryBooksIcon
                      fontSize="small"
                      sx={{ color: "rgba(255,255,255,0.65)" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Content"
                    slotProps={{
                      primary: { sx: { ...textSx, fontSize: "0.9rem" } },
                    }}
                  />
                </ListItemButton>

                {/* Approvals */}
                <ListItemButton
                  component={Link}
                  to="/approvals"
                  sx={{ ...itemHoverSx, pl: 4 }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                    <HowToRegIcon
                      fontSize="small"
                      sx={{ color: "rgba(255,255,255,0.65)" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Approvals"
                    slotProps={{
                      primary: { sx: { ...textSx, fontSize: "0.9rem" } },
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        : <ListItemButton
            component={Link}
            to="/library"
            sx={{ ...itemHoverSx, px: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
              <LibraryBooksIcon sx={iconSx} />
            </ListItemIcon>
            {isOpen && (
              <ListItemText
                primary="Content Manager"
                slotProps={{ primary: { sx: textSx } }}
              />
            )}
          </ListItemButton>
        }

        {isUnderwriter ?
          <>
            <ListItemButton
              component={Link}
              to="/risk-review"
              sx={{ ...itemHoverSx, px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
                <WarningIcon sx={iconSx} />
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary="Risk Review"
                  slotProps={{ primary: { sx: textSx } }}
                />
              )}
            </ListItemButton>
          </>
        : null}

        {!isUnderwriter && !isAdmin ?
          <>
            <ListItemButton
              component={Link}
              to="/claims"
              sx={{ ...itemHoverSx, px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
                <WarningIcon sx={iconSx} />
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary="Make a Claim"
                  slotProps={{ primary: { sx: textSx } }}
                />
              )}
            </ListItemButton>
          </>
        : null}

        {/* Activity */}
        <ListItemButton
          component={Link}
          to="/activity"
          sx={{ ...itemHoverSx, px: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
            <SpeedIcon sx={iconSx} />
          </ListItemIcon>
          {isOpen && (
            <ListItemText
              primary="Activity"
              slotProps={{ primary: { sx: textSx } }}
            />
          )}
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/calendar"
          sx={{ ...itemHoverSx, pl: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
            <CalendarMonthIcon sx={iconSx} />
          </ListItemIcon>
          {isOpen && (
            <ListItemText
              primary="Calendar"
              slotProps={{ primary: { sx: textSx } }}
            />
          )}
        </ListItemButton>
      </List>

      {/* ── Profile / account button ────────────────────────────────────── */}
      <Box sx={{ mt: "auto", px: isOpen ? 1 : 0, pb: 2 }}>
        <ListItemButton
          id={"resources-button"}
          sx={{
            "px": 2,
            "border": isOpen ? "1px solid rgba(255,255,255,0.2)" : "none",
            "borderRadius": "50px",
            "boxShadow": isOpen ? "0 2px 8px rgba(0,0,0,0.3)" : 0,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
          onClick={handleClick}
          aria-controls={open ? "resources-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
            <Avatar
              src={profile.avatar ?? undefined}
              sx={{ width: 32, height: 32 }}
            />
          </ListItemIcon>
          {isOpen && (
            <ListItemText
              primary={profile.firstName ?? ""}
              slotProps={{
                primary: { sx: { color: "white", fontWeight: 600 } },
              }}
            />
          )}
          {isOpen && (
            <KeyboardArrowUpIcon sx={{ color: "rgba(255,255,255,0.65)" }} />
          )}
        </ListItemButton>
      </Box>

      <Menu
        id={"resources-menu"}
        anchorEl={anchorElement}
        open={open}
        slotProps={{
          list: { "aria-labelledby": "resources-menu" },
          paper: { sx: { border: "1px solid", borderColor: "gray" } },
        }}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{ mt: -1.5 }}
      >
        <MenuItem
          component={Link}
          to="/profile"
          onClick={handleClose}
        >
          My Account
        </MenuItem>
        <MenuItem
          component={Link}
          to="/settings"
          onClick={handleClose}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            void handleLogout();
          }}
        >
          Log Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
