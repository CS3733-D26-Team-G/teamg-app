import { useState } from "react";
import DashboardRecentActivity from "../../features/dashboard/components/DashboardRecentActivity.tsx";
import SearchBar from "../../features/dashboard/components/SearchBar.tsx";
import PieChart from "../../features/dashboard/components/PieChart.tsx";
import TypeBarChart from "../../features/dashboard/components/BarChart.tsx";
import NotificationBell from "../../features/notifications/components/NotificationBell.tsx";
import {
  Box,
  styled,
  Toolbar,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Divider } from "@mui/material";
import { useAuth } from "../../auth/AuthContext.tsx";
import HelpPopup from "../../components/HelpPopup";
import HitsLineChart from "../../features/dashboard/components/HitsLineChart.tsx";
import AdminCards from "../../features/dashboard/components/AdminCards.tsx";
import { useProfile } from "../../profile/ProfileContext.tsx";
import { getPositionLabel } from "../../utils/positionDisplay";
import { useDashboardBootstrap } from "../../features/dashboard/useDashboardBootstrap.ts";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  minHeight: 128,
}));

function DashboardSkeleton() {
  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      {/* Header skeleton */}
      <StyledToolbar
        sx={{
          background:
            "linear-gradient(90deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 4,
            py: 3,
          }}
        >
          <Skeleton
            variant="text"
            width={320}
            height={56}
            sx={{ bgcolor: "rgba(255,255,255,0.15)" }}
          />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              sx={{ bgcolor: "rgba(255,255,255,0.15)" }}
            />
            <Skeleton
              variant="rounded"
              width={240}
              height={40}
              sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: "24px" }}
            />
          </Box>
        </Box>
      </StyledToolbar>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent
          sx={{
            padding: 5,
            minHeight: "88vh",
            backgroundColor: "background.default",
          }}
        >
          {/* Top row: pie chart + recent activity */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "stretch",
              mb: 4,
            }}
          >
            <Box sx={{ width: 420, minWidth: 420 }}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={300}
                sx={{ borderRadius: "12px" }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 500 }}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={300}
                sx={{ borderRadius: "12px" }}
              />
            </Box>
          </Box>

          {/* Count cards row */}
          <Stack
            direction="row"
            spacing={4}
            sx={{ mb: 4 }}
          >
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{ flex: 1 }}
              >
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={100}
                  sx={{ borderRadius: "12px" }}
                />
              </Box>
            ))}
          </Stack>

          {/* Charts row */}
          <Box sx={{ display: "flex", flexDirection: "row", gap: 8 }}>
            <Box sx={{ width: 420, minWidth: 420 }}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={340}
                sx={{ borderRadius: "12px", mb: 4 }}
              />
              <Skeleton
                variant="rounded"
                width="100%"
                height={200}
                sx={{ borderRadius: "12px" }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={560}
                sx={{ borderRadius: "12px" }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");
  const { session } = useAuth();
  const { data, loading, error } = useDashboardBootstrap();
  const { profile } = useProfile();

  // Show full skeleton on initial load
  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error && !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h6"
            color="error"
            sx={{ mb: 1 }}
          >
            Failed to load dashboard
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {error}
          </Typography>
        </Box>
      </Box>
    );
  }

  const rawLogs = data?.activityAll ?? [];
  const analytics = (data?.contentCounts ?? {}) as Record<string, number>;
  const employeeCounts = (data?.employeeCounts ?? {}) as Record<string, number>;
  const fileTypeCounts = data?.fileTypeCounts ?? [];

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
      "Business Ops Team": "BUSINESS_OP_RATING",
    };
    return mapping[role] || role.replace(/\s+/g, "_").toUpperCase();
  };

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

  const employeeDemographicsCard = (
    <Card
      className="employee-demographics-card w-[420px] min-w-[420px] outline-1 outline-gray-200"
      sx={{ margin: 0, borderRadius: 3 }}
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
      <CardContent className="flex items-center justify-center p-6">
        <div className="w-full">
          <PieChart data={employeePieData} />
        </div>
      </CardContent>
    </Card>
  );

  const fileTypesCard = (
    <Card
      className="outline-1 outline-gray-200"
      sx={{ margin: 0, borderRadius: 3 }}
    >
      <CardHeader
        sx={{ py: 1.5, px: 2 }}
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            File Types
          </Typography>
        }
      />
      <Divider />
      <CardContent className="p-6">
        <TypeBarChart data={fileTypeCounts} />
      </CardContent>
    </Card>
  );

  const popularContentSearchCard = (
    <Card
      className="outline-1 outline-gray-200"
      sx={{ margin: 0, borderRadius: 3 }}
    >
      <CardHeader
        sx={{ py: 1.5, px: 2 }}
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            Popular Content Search
          </Typography>
        }
      />
      <Divider />
      <CardContent className="p-6">
        <Typography
          variant="body2"
          color="text.secondary"
        >
          No popular search data available yet.
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <StyledToolbar
        sx={{
          background:
            "linear-gradient(90deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          overflow: "hidden",
          position: "relative",
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
            <NotificationBell />
            <div className="w-80">
              <SearchBar setSearchQuery={setSearchQuery} />
            </div>
          </div>
        </div>
      </StyledToolbar>
      <Card
        className="m-auto mr-2 mb-2 flex h-auto min-h-[95vh] flex-col"
        sx={{ borderRadius: 3 }}
      >
        <CardContent
          className="mr-1 flex flex-col gap-5"
          sx={{
            padding: 5,
            minHeight: "88vh",
            backgroundColor: "background.default",
          }}
        >
          <div className="flex flex-row gap-8 items-start">
            <div className="flex w-[420px] min-w-[420px] flex-col gap-8">
              {employeeDemographicsCard}
            </div>
            <div className="recent-activity-card flex-1 min-w-[500px]">
              <DashboardRecentActivity rawLogs={rawLogs} />
            </div>
          </div>

          <div className="role-count-cards flex flex-row gap-8 items-start">
            {roles.map((role) => {
              const key = getAnalyticsKey(role);
              const count = analytics[key] ?? 0;
              return (
                <Card
                  key={role}
                  className="flex-1 outline-1 outline-gray-200"
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

          <div className="dashboard-activity-charts flex flex-row gap-8 items-start">
            <AdminCards />
            {session?.position === "ADMIN" && (
              <div className="flex w-[420px] min-w-[420px] flex-col gap-8">
                {fileTypesCard}
                {popularContentSearchCard}
              </div>
            )}
          </div>

          <div className="dashboard-charts-section flex flex-row gap-8 items-start">
            {session?.position !== "ADMIN" && (
              <div className="flex w-[420px] min-w-[420px] flex-col gap-8">
                {fileTypesCard}
                {popularContentSearchCard}
              </div>
            )}
            <Card
              className="dashboard-edits-chart flex-1 outline-1 outline-gray-200"
              sx={{ margin: 0, borderRadius: 3 }}
            >
              <CardHeader
                sx={{ py: 1.5, px: 2 }}
                title={
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
                  >
                    {session?.position === "ADMIN" ?
                      "Employee Edits By Day"
                    : `${getPositionLabel(session?.position)} Edits By Day`}
                    <HelpPopup
                      description="This graphic shows the fluctuation in content hits by role."
                      infoOrHelp={false}
                    />
                  </Typography>
                }
              />
              <Divider />
              <CardContent className="p-6">
                <HitsLineChart />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
