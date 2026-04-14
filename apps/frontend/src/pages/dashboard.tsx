import { useState } from "react";
import DashboardRecentActivity from "./DashboardComponents/DashboardRecentActivity";
import SearchBar from "./DashboardComponents/SearchBar";
import PieChart from "./DashboardComponents/PieChart";
import BarChart from "./DashboardComponents/BarChart";
import { Typography } from "@mui/material";

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="relative min-h-screen">
        <div className="fixed top-[10%] left-[25%] z-10">
          <Typography variant="h3">Welcome to iBank!</Typography>
          <Typography
            variant="h2"
            component="div"
            className="pt-4"
          >
            Manage and Publish
            <br />
            content with ease
          </Typography>
          <div className="mt-6">
            <SearchBar setSearchQuery={setSearchQuery} />
          </div>
        </div>
        <div className="fixed right-[5%] top-[1%] bg-{#FFFFFF}">
          <DashboardRecentActivity />
        </div>
        <div className="fixed left-[25%] bottom-[8%] z-50">
          <PieChart />
        </div>
        <div className="fixed right-[5%] bottom-[1%] z-50">
          <BarChart />
        </div>
      </div>
    </div>
  );
}
