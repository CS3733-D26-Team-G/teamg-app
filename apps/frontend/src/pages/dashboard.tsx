import { useState } from "react";
import DashboardRecentActivity from "./DashboardComponents/DashboardRecentActivity";
import SearchBar from "./DashboardComponents/SearchBar";
import "./DashboardComponents/dashboard.css";
import PieChart from "./DashboardComponents/PieChart";
import BarChart from "./DashboardComponents/BarChart";

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");

  return (
    <div className="dashboard-main">
      <div className="dashboard-header">
        <h2>Welcome back to iBank!</h2>
        <h1>Manage and publish</h1>
        <h1>content with ease</h1>
        <SearchBar setSearchQuery={setSearchQuery}></SearchBar>
      </div>
      <div className="dashboard-activity">
        <DashboardRecentActivity />
      </div>
      <div className="fixed left-[25%] bottom-[5%]">
        <PieChart />
      </div>
      <div className="fixed right-[10%] bottom-[.5%]">
        <BarChart />
      </div>
    </div>
  );
}
