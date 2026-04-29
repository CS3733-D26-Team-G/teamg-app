import { useState, useEffect } from "react";
import DashboardRecentActivity from "./DashboardComponents/DashboardRecentActivity";
import SearchBar from "./DashboardComponents/SearchBar";
import PieChart from "./DashboardComponents/PieChart";
//import BarChart from "./DashboardComponents/BarChart";
import NotificationsBell from "../components/Notifications/NotificationBell.tsx";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Divider } from "@mui/material";
import { useAuth } from "../auth/AuthContext.tsx";
import { API_ENDPOINTS } from "../config";
import { dedupeAsync } from "../lib/async-cache";
import HelpPopup from "../components/HelpPopup";

export function useActivityData() {
  const [rawLogs, setRawLogs] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employeeCounts, setEmployeeCounts] = useState<Record<string, number>>(
    {},
  );
  const fetchData = async () => {
    try {
      setLoading(true);
      const [logsData, countsData, employeeCountsData] = await Promise.all([
        dedupeAsync("activity", async () => {
          const res = await fetch(API_ENDPOINTS.ACTIVITY, {
            credentials: "include",
          });

          if (res.status === 401) {
            return [];
          }

          if (!res.ok) {
            throw new Error(`Failed to fetch activity: ${res.status}`);
          }

          return res.json();
        }),
        dedupeAsync("content:count-position", async () => {
          const res = await fetch(API_ENDPOINTS.CONTENT.COUNT_POSITION, {
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error(
              `Failed to fetch content position counts: ${res.status}`,
            );
          }

          return res.json();
        }),
        dedupeAsync("employee:count", async () => {
          const res = await fetch(
            `${API_ENDPOINTS.ACTIVITY.replace("/activity", "")}/stats/employee/count`,
            {
              credentials: "include",
            },
          );
          if (res.status == 401) {
            return null;
          }
          if (!res.ok) {
            throw new Error(`Employee count fetch failed : ${res.status}`);
          }
          return res.json();
        }),
      ]);
      setRawLogs(Array.isArray(logsData) ? logsData : []);
      setAnalytics(
        countsData && typeof countsData === "object" ? countsData : {},
      );
      setEmployeeCounts(
        employeeCountsData && typeof employeeCountsData === "object" ?
          employeeCountsData
        : {},
      );
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    rawLogs,
    analytics,
    employeeCounts,
    loading,
    error,
    refetch: fetchData,
  };
}

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");
  const { session } = useAuth();
  const { rawLogs, analytics, employeeCounts } = useActivityData();
  const employeePieData = [
    {
      id: 0,
      value: employeeCounts.BUSINESS_ANALYST ?? 0,
      label: "Business Analyst",
      color: "#bea5aa",
    },
    {
      id: 1,
      value: employeeCounts.BUSINESS_OP_RATING ?? 0,
      label: "Business Ops Rating Team",
      color: "#509edd",
    },
    {
      id: 2,
      value: employeeCounts.UNDERWRITER ?? 0,
      label: "Underwriter",
      color: "#395176",
    },
    {
      id: 3,
      value: employeeCounts.ACTUARIAL_ANALYST ?? 0,
      label: "Actuarial Analyst",
      color: "#ba667b",
    },
    {
      id: 4,
      value: employeeCounts.ADMIN ?? 0,
      label: "Admin",
      color: "#74414e",
    },
    {
      id: 5,
      value: employeeCounts.EXL_OPERATIONS ?? 0,
      label: "EXL Operations",
      color: "#721b31",
    },
  ];
  const roles = [
    "Business Analyst",
    "Underwriter",
    "Actuarial Analyst",
    "EXL Operations",
    "Business Ops Team",
  ];

  const getAnalyticsKey = (role: string) => {
    const mapping: Record<string, string> = {
      "Business Analyst": "BUSINESS_ANALYST",
      "Underwriter": "UNDERWRITER",
      "Actuarial Analyst": "ACTUARIAL_ANALYST",
      "EXL Operations": "EXL_OPERATIONS",
      "Business Ops Team": "BUSINESS_OP_RATING", // Matches your console log!
    };

    return mapping[role] || role.replace(/\s+/g, "_").toUpperCase();
  };

  // Role-based help descriptions
  const helpDescriptions: Record<string, string> = {
    UNDERWRITER:
      "You are an UnderWriter, please give us time to give you help.",
    BUSINESS_ANALYST:
      "You are an Business Analyst, please give us time to give you help.",
    ACTUARIAL_ANALYST:
      "You are an Actuarial Analyst, please give us time to give you help.",
    EXL_OPERATIONS:
      "You are an EXL Operations, please give us time to give you help.",
    BUSINESS_OP_RATING:
      "You are an Business OP Rating, please give us time to give you help.",
    ADMIN:
      "The Dashboard gives you a full organizational overview including employee demographics, recent activity, and content counts by role.",
  };

  const helpText =
    helpDescriptions[session?.position ?? ""] ??
    "The Dashboard gives you an overview of your organization.";

  return (
    <Card className="flex flex-col h-auto min-h-[95vh] m-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
        <Typography
          variant="h2"
          sx={{ fontWeight: "bold" }}
        >
          Welcome Back {(session?.position ?? "employee").toLowerCase()}!
        </Typography>
        <div className="flex items-center gap-2">
          <HelpPopup
            description={helpText}
            infoOrHelp={true}
          />
          <NotificationsBell />
          <div className="w-80">
            <SearchBar setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </div>

      <CardContent className="flex flex-col gap-8 p-8">
        <div className="flex flex-row gap-8 items-stretch">
          <Card
            className="flex-none w-fit outline-1 outline-gray-200"
            sx={{
              margin: 0,
            }}
          >
            <CardHeader
              sx={{ py: 1.5, px: 2 }}
              title={
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
                >
                  Employee Demographics
                  <HelpPopup
                    description="The Employee Demographics chart provides a breakdown of how many employees belong to each role. Hover over a slice of the chart to see exact numbers!"
                    infoOrHelp={false}
                  />
                </Typography>
              }
            />
            <Divider />
            <CardContent className="h-full flex items-center justify-center p-6">
              <div className="w-100">
                <PieChart data={employeePieData} />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity: Grows to fill width and matches height */}
          <div className="flex-1 min-w-125">
            <DashboardRecentActivity rawLogs={rawLogs} />
          </div>
        </div>

        {/* Second Row for Bar Chart */}
        <div className="w-full flex flex-row gap-6">
          {roles.map((role) => {
            const key = getAnalyticsKey(role);
            const count = analytics[key] ?? 0;

            return (
              <Card
                key={role}
                className="flex-1 drop-shadow-md outline-1 outline-gray-200"
                onClick={() => console.log(analytics)}
              >
                <CardContent className="p-4">
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {role}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", fontSize: "2rem" }}
                  >
                    {count}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ fontWeight: "bold" }}
                  >
                    Total Items
                    <HelpPopup
                      description={`This is the total amount of content accessible by ${role}s`}
                      infoOrHelp={false}
                    />
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
