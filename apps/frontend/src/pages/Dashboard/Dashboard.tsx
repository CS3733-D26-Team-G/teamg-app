import { useState } from "react";
import DashboardRecentActivity from "../../features/dashboard/components/DashboardRecentActivity.tsx";
import SearchBar from "../../features/dashboard/components/SearchBar.tsx";
import PieChart from "../../features/dashboard/components/PieChart.tsx";
import TypeBarChart from "../../features/dashboard/components/BarChart.tsx";
import NotificationBell from "../../features/notifications/components/NotificationBell.tsx";
import { Box, styled, Toolbar, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Divider } from "@mui/material";
import { useAuth } from "../../auth/AuthContext.tsx";
import HelpPopup from "../../components/HelpPopup";
import HitsLineChart from "../../features/dashboard/components/HitsLineChart.tsx";
import AdminCards from "../../features/dashboard/components/AdminCards.tsx";
import { useProfile } from "../../profile/ProfileContext.tsx";
import { useDashboardBootstrap } from "../../features/dashboard/useDashboardBootstrap.ts";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "../../components/LanguageToggle.tsx";

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");
  const { session } = useAuth();
  const { data, loading, error } = useDashboardBootstrap();
  const rawLogs = data?.activityAll ?? [];
  const analytics = (data?.contentCounts ?? {}) as Record<string, number>;
  const employeeCounts = (data?.employeeCounts ?? {}) as Record<string, number>;
  const fileTypeCounts = data?.fileTypeCounts ?? [];
  const { t } = useTranslation();

  const roleKeys = [
    "BUSINESS_ANALYST",
    "BUSINESS_OP_RATING",
    "UNDERWRITER",
    "ACTUARIAL_ANALYST",
    "EXL_OPERATIONS",
  ];

  const roleLabels: Record<string, string> = {
    BUSINESS_ANALYST: t("dashboard.businessAnalyst"),
    BUSINESS_OP_RATING: t("dashboard.businessOpsTeam"),
    UNDERWRITER: t("dashboard.underwriter"),
    ACTUARIAL_ANALYST: t("dashboard.actuarialAnalyst"),
    EXL_OPERATIONS: t("dashboard.exlOperations"),
  };
  const employeePieData = [
    {
      id: 0,
      value: employeeCounts.BUSINESS_ANALYST ?? 0,
      label: t("dashboard.businessAnalyst"),
      color: "#bea5aa",
    },
    {
      id: 1,
      value: employeeCounts.BUSINESS_OP_RATING ?? 0,
      label: t("dashboard.businessOpsTeam"),
      color: "#509edd",
    },
    {
      id: 2,
      value: employeeCounts.UNDERWRITER ?? 0,
      label: t("dashboard.underwriter"),
      color: "#395176",
    },
    {
      id: 3,
      value: employeeCounts.ACTUARIAL_ANALYST ?? 0,
      label: t("dashboard.actuarialAnalyst"),
      color: "#ba667b",
    },
    {
      id: 4,
      value: employeeCounts.ADMIN ?? 0,
      label: t("dashboard.admin"),
      color: "#74414e",
    },
    {
      id: 5,
      value: employeeCounts.EXL_OPERATIONS ?? 0,
      label: t("dashboard.exlOperations"),
      color: "#721b31",
    },
  ];

  const helpDescriptions: Record<string, string> = {
    UNDERWRITER: t("dashboard.underwriterHelp"),
    BUSINESS_ANALYST: t("dashboard.businessAnalystHelp"),
    ACTUARIAL_ANALYST: t("dashboard.actuarialAnalystHelp"),
    EXL_OPERATIONS: t("dashboard.exlOperationsHelp"),
    BUSINESS_OP_Team: t("dashboard.businessOpTeamHelp"),
    ADMIN: t("dashboard.adminHelp"),
  };

  const helpText =
    helpDescriptions[session?.position ?? ""] ?? t("dashboard.dashboardInfo");

  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    flexDirection: "column",
    alignItems: "stretch",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    minHeight: 128,
  }));

  const { profile } = useProfile();

  const employeeDemographicsCard = (
    <Card
      className="w-[420px] min-w-[420px] outline-1 outline-gray-200"
      sx={{ margin: 0, borderRadius: 3 }}
    >
      <CardHeader
        sx={{ py: 1.5, px: 2 }}
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            {t("dashboard.employeeDemographics")}
            <HelpPopup
              description={t("dashboard.demogrphicsInfo")}
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
            {t("dashboard.fileTypes")}
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
            {t("dashboard.popularContentSearch")}
          </Typography>
        }
      />
      <Divider />
      <CardContent className="p-6">
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {t("dashboard.noPopularContent")}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography variant="h6">{t("dashboard.loadingDashboard")}</Typography>
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
      }}
    >
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
            {t("dashboard.welcomeBack")} {profile?.firstName}!
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
            <LanguageToggle />
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
            <div className="flex-1 min-w-[500px]">
              <DashboardRecentActivity rawLogs={rawLogs} />
            </div>
          </div>

          <div className="flex flex-row gap-8 items-start">
            {roleKeys.map((key) => {
              const label = roleLabels[key];
              const count = analytics[key] ?? 0;

              return (
                <Card
                  key={key}
                  className="flex-1 outline-1 outline-gray-200"
                  sx={{ borderRadius: 3 }}
                >
                  <CardContent className="p-4">
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {label}
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
                      {t("dashboard.totalItems")}
                      <HelpPopup
                        description={`${t("dashboard.totalItemsInfo")} ${label}s`}
                        infoOrHelp={false}
                      />
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {session?.position === "ADMIN" && (
            <div className="flex flex-row gap-8 items-start">
              <AdminCards />
              <div className="flex w-[420px] min-w-[420px] flex-col gap-8">
                {fileTypesCard}
                {popularContentSearchCard}
              </div>
            </div>
          )}

          <div className="flex flex-row gap-8 items-start">
            {session?.position !== "ADMIN" && (
              <div className="flex w-[420px] min-w-[420px] flex-col gap-8">
                {fileTypesCard}
                {popularContentSearchCard}
              </div>
            )}

            <Card
              className="flex-1 outline-1 outline-gray-200"
              sx={{ margin: 0, borderRadius: 3 }}
            >
              <CardHeader
                sx={{ py: 1.5, px: 2 }}
                title={
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
                  >
                    {t("dashboard.editsByDay")}
                    <HelpPopup
                      description={t("dashboard.editsInfo")}
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
