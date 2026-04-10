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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
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

  return (
    <div
      className={"Sidebar"}
      style={{
        width: isOpen ? "240px" : "64px",
        transition: "width 0.3s",
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
              {isOpen && <ListItemText primary="Library" />}
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

        <ListItemButton
          component={Link}
          to="/settings"
          sx={{ px: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
            <SettingsIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Settings" />}
        </ListItemButton>
      </List>

      <Box sx={{ mt: "auto" }}>
        <ListItemButton
          component={Link}
          to="/profile"
          sx={{ px: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 2 : 0 }}>
            <Avatar sx={{ width: 32, height: 32 }} />
          </ListItemIcon>
          {isOpen && <ListItemText primary="My Account" />}
        </ListItemButton>
      </Box>
    </div>
  );
}
