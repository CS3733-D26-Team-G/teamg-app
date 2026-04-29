import React, { useState, useEffect } from "react";
import DashboardRecentActivity from "../../features/dashboard/components/DashboardRecentActivity.tsx";
import SearchBar from "../../features/dashboard/components/SearchBar.tsx";
import PieChart from "../../features/dashboard/components/PieChart.tsx";
import TypeBarChart from "../../features/dashboard/components/BarChart.tsx";
import NotificationsBell from "../../features/notifications/components/NotificationBell.tsx";
import { AppBar, Box, styled, Toolbar, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Divider } from "@mui/material";
import { useAuth } from "../../auth/AuthContext.tsx";
import HelpPopup from "../../components/HelpPopup";
import theme from "../../theme.tsx";
import HitsLineChart from "../../features/dashboard/components/HitsLineChart.tsx";
import { useProfile } from "../../profile/ProfileContext.tsx";
import { useDashboardBootstrap } from "../../features/dashboard/useDashboardBootstrap.ts";

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");
  const { session } = useAuth();
  const { data, loading, error } = useDashboardBootstrap();
  const rawLogs = data?.activityAll ?? [];
  const analytics = (data?.contentCounts ?? {}) as Record<string, number>;
  const employeeCounts = (data?.employeeCounts ?? {}) as Record<string, number>;
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

  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    flexDirection: "column",
    alignItems: "stretch",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    minHeight: 128,
  }));

  const { profile } = useProfile();

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "auto",
        width: "100%",
        background:
          "linear-gradient(90deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
      }}
    >
      <StyledToolbar
        sx={{
          background:
            "linear-gradient(90deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          overflow: "hidden",
        }}
      >
        <div className="flex justify-between items-center px-8 py-6">
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            Welcome Back {profile?.firstName}!
          </Typography>
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                borderRadius: "50%",
                border: "1px solid rgba(238, 31, 31, 0.12)",
                width: 120 + i * 80,
                height: 120 + i * 80,
                top: -40 - i * 30,
                right: -40 - i * 30,
              }}
            />
          ))}
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
      </StyledToolbar>
      <Card
        className="flex flex-col h-auto m-auto max-w-0.95 mr-2 mb-2"
        sx={{ borderRadius: 3 }}
      >
        <CardContent
          className="flex flex-col gap-5 bg-gray-100 mr-1"
          sx={{ padding: 5, minHeight: "88vh" }}
        >
          <div className="flex flex-row gap-5 items-stretch ">
            <Card
              className="flex-none w-fit outline-1 outline-gray-200 drop-shadow-lg"
              sx={{
                margin: 0,
                borderRadius: 3,
              }}
            >
              <CardHeader
                className="bg-white"
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
              <CardContent className="h-full flex items-contain justify-center p-6 bg-white">
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
                  className="flex-1 drop-shadow-lg outline-1 outline-gray-200"
                  onClick={() => console.log(analytics)}
                  sx={{ borderRadius: 3 }}
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

          <div className="w-full flex flex-row gap-6">
            <Card
              sx={{ borderRadius: 6 }}
              className="flex-1 flex-col drop-shadow-lg"
            >
              <CardContent className="p-6">
                <HelpPopup
                  description={
                    "This graphic shows the fluctuation in content hits by role."
                  }
                  infoOrHelp={false}
                />
                <HitsLineChart />
              </CardContent>
            </Card>
            {/*<Card*/}
            {/*  sx={{ borderRadius: 6 }}*/}
            {/*  className="flex-1 flex-col drop-shadow-lg"*/}
            {/*>*/}
            {/*  /!*<CardContent className="p-6">*!/*/}
            {/*  /!*  <TypeBarChart/>*!/*/}
            {/*  /!*</CardContent>*!/*/}
            {/*</Card>*/}
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
