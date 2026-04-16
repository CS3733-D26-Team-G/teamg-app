import React, { useState, useEffect } from "react";
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
import SpeedIcon from "@mui/icons-material/Speed";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { API_ENDPOINTS } from "../config.ts";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const [adminOpen, setAdminOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const [formsOpen, setFormsOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("account_type") === "ADMIN",
  );

  useEffect(() => {
    const checkAdminStatus = () => {
      setIsAdmin(localStorage.getItem("account_type") === "ADMIN");
    };

    window.addEventListener("storage", checkAdminStatus);

    const interval = setInterval(checkAdminStatus, 1000);

    return () => {
      window.removeEventListener("storage", checkAdminStatus);
      clearInterval(interval);
    };
  }, []);

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
        navigate("/");
      } else {
        console.error("Logout Failed");
      }
    } catch (e) {
      setError("Network error. Check your connection.");
      console.error(e);
    }
  };

  return (
    <div
      className={"Sidebar"}
      style={{
        width: isOpen ? "240px" : "64px",
        transition: "width 0.3s",
        position: "sticky",
        top: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
          padding: "8px",
        }}
      >
        <img
          src={"/hanover_logo.png"}
          alt="Hanover Logo"
          style={{
            width: "140px",
            display: isOpen ? "block" : "none",
            imageRendering: "crisp-edges",
          }}
        />
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ?
            <KeyboardDoubleArrowLeftIcon />
          : <KeyboardDoubleArrowRightIcon />}
        </IconButton>
      </Box>

      <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <ListItemButton
          component={Link}
          to="/dashboard"
          sx={{ px: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
            <DashboardIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Dashboard" />}
        </ListItemButton>

        {isAdmin ?
          <>
            <ListItemButton
              onClick={() => handleToggle(setAdminOpen, adminOpen)}
              sx={{ px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
                <AdminPanelSettingsIcon color="primary" />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Management" />}
              {isOpen && (adminOpen ? <ExpandLess /> : <ExpandMore />)}
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
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                    <PeopleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Employees" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/content-management"
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                    <LibraryBooksIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Content" />
                </ListItemButton>
              </List>
            </Collapse>
          </>
        : <>
            <ListItemButton
              component={Link}
              to="/library"
              sx={{ px: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
                <LibraryBooksIcon />
              </ListItemIcon>
              {isOpen && <ListItemText primary="Content Manager" />}
            </ListItemButton>
          </>
        }

        <ListItemButton
          component={Link}
          to="/activity"
          sx={{ px: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
            <SpeedIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Activity" />}
        </ListItemButton>
      </List>

      <Box sx={{ mt: "auto", px: isOpen ? 2 : 0, pb: 2 }}>
        <ListItemButton
          id={"resources-button"}
          sx={{
            px: 2,
            border: isOpen ? "1px solid lightgray" : null,
            borderRadius: "50px",
            boxShadow: 2,
          }}
          onClick={handleClick}
          aria-controls={open ? "resources-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
            <Avatar sx={{ width: 32, height: 32 }} />
          </ListItemIcon>
          {isOpen && (
            <ListItemText primary={localStorage.getItem("employee_position")} />
          )}
          {isOpen && <KeyboardArrowUpIcon />}
        </ListItemButton>
      </Box>
      <Menu
        id={"resources-menu"}
        anchorEl={anchorElement}
        open={open}
        slotProps={{
          list: { "aria-labelledby": "resources-menu" },
        }}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
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
            handleLogout();
          }}
        >
          Log Out
        </MenuItem>
      </Menu>
    </div>
  );
}
