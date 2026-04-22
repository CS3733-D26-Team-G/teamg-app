import { useState, useEffect } from "react";
import DashboardRecentActivity from "./DashboardComponents/DashboardRecentActivity";
import SearchBar from "./DashboardComponents/SearchBar";
import PieChart from "./DashboardComponents/PieChart";
import BarChart from "./DashboardComponents/BarChart";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useAuth } from "../auth/AuthContext.tsx";
import { API_ENDPOINTS } from "../config";

export function useActivityData() {
  const [rawLogs, setRawLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.ACTIVITY, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      const data = await res.json();
      setRawLogs(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching activity:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  return { rawLogs, loading, error, refetch: fetchActivity };
}

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");
  const { session } = useAuth();
  const { rawLogs } = useActivityData();

  return (
    <Card className="flex flex-col h-auto min-h-[95vh] m-auto bg-gray-50">
      {/* Header Section */}
      <div className="flex justify-between items-center px-8 py-6 bg-white border-b border-gray-200">
        <Typography
          variant="h2"
          sx={{ fontWeight: "bold" }}
        >
          Welcome Back {(session?.position ?? "employee").toLowerCase()}!
        </Typography>
        <div className="w-80">
          <SearchBar setSearchQuery={setSearchQuery} />
        </div>
      </div>

      <CardContent className="flex flex-col gap-8 p-8">
        {/* Row Container: items-stretch forces children to equal height */}
        <div className="flex flex-row gap-8 items-stretch pr-12">
          {/* Pie Chart: The "Height Driver" */}
          <Card
            className="flex-none w-fit outline-1 outline-gray-200"
            sx={{
              margin: 0,
            }}
          >
            <CardContent className="h-full flex items-center justify-center p-6">
              <div className="w-[400px]">
                <PieChart />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity: Grows to fill width and matches height */}
          <div className="flex-1 min-w-[500px]">
            <DashboardRecentActivity rawLogs={rawLogs} />
          </div>
        </div>

        {/* Second Row for Bar Chart */}
        <div className="w-full"></div>
      </CardContent>
    </Card>
  );
}
