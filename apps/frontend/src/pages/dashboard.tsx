import { useState } from "react";
import DashboardRecentActivity from "./DashboardComponents/DashboardRecentActivity";
import SearchBar from "./DashboardComponents/SearchBar";
import PieChart from "./DashboardComponents/PieChart";
import BarChart from "./DashboardComponents/BarChart";

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="relative min-h-screen">
        <div className="fixed top-[10%] left-[25%] z-10">
          <h1 className="text-3xl font-bold">Welcome back to iBank!</h1>
          <h1 className="text-xl text-gray-600 mt-2">Manage and publish</h1>
          <h1 className="text-xl text-gray-600">content with ease</h1>
          <div className="mt-6">
            <SearchBar setSearchQuery={setSearchQuery} />
          </div>
        </div>
        <div className="fixed right-[5%] top-[1%] bg-{#FFFFFF}">
          <DashboardRecentActivity />
        </div>
        <div className="fixed left-[25%] bottom-[8%]">
          <PieChart />
        </div>
        <div className="fixed right-[5%] bottom-[1%]">
          <BarChart />
        </div>
      </div>
    </div>
  );
}
