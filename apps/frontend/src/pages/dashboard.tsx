import { useState } from "react";
import DashboardRecentActivity from "./DashboardComponents/DashboardRecentActivity";
import SearchBar from "./DashboardComponents/SearchBar";
import "./DashboardComponents/dashboard.css";
import { Typography, Box } from "@mui/material";

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");

  return (
    <Box className="dashboard-main">
      <Typography
        sx={{
          width: "auto",
          fontSize: "1.5rem",
          alignItems: "start",
        }}
      >
        <h2>Welcome back to iBank!</h2>
        <h1>Manage and publish</h1>
        <h1>content with ease</h1>
      </Typography>
      <DashboardRecentActivity />
    </Box>
  );
}
