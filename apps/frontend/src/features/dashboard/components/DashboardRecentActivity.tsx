import { useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  CardHeader,
  Box,
} from "@mui/material";
import { transformBackendData } from "./activityData.ts";
import HelpPopup from "../../../components/HelpPopup.tsx";
import { useTranslation } from "react-i18next";

interface DashboardRecentActivityProps {
  rawLogs: any[];
}

function actionDictator(action: string, t: (key: string) => string) {
  const map: Record<string, string> = {
    EDIT_CONTENT: t("dashboardRecentActivity.edited"),
    DELETE_CONTENT: t("dashboardRecentActivity.delete"),
    CREATE_CONTENT: t("dashboardRecentActivity.create"),
    LOG_IN: t("dashboardRecentActivity.loggedIn"),
    LOG_OUT: t("dashboardRecentActivity.loggedOut"),
    CHECK_IN_CONTENT: t("dashboardRecentActivity.checkedIn"),
    CHECK_OUT_CONTENT: t("dashboardRecentActivity.checkedOut"),
  };
  return map[action] || action.toLowerCase();
}

export default function DashboardRecentActivity({
  rawLogs,
}: DashboardRecentActivityProps) {
  const { t } = useTranslation();
  const recentActions = useMemo(() => {
    const groupedData = transformBackendData(rawLogs);
    const allItems = groupedData.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        dateLabel: group.date,
      })),
    );
    return allItems.slice(0, 4);
  }, [rawLogs]);

  return (
    <Card
      className="min-w-[500px] outline-gray-200 outline-1  drop-shadow-lg"
      sx={{
        backgroundColor: "background.paper",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "0 !important",
        borderRadius: 3,
      }}
    >
      <CardHeader
        sx={{ py: 1.25, px: 2, paddingTop: "20px" }}
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            {t("dashboardRecentActivity.recentActivity")}
            <HelpPopup
              description={t("dashboardRecentActivity.recentActivityInfo")}
              infoOrHelp={false}
            />
          </Typography>
        }
      />
      <Divider />

      <CardContent
        sx={{
          pt: 1.5,
          px: 2,
          pb: 2,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {recentActions.length === 0 ?
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {t("dashboardRecentActivity.noActivity")}
          </Typography>
        : <Box
            component="ul"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingBottom: "10px",
            }}
          >
            {recentActions.map((action, index) => (
              <Box
                component="li"
                key={action.id || index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderBottom:
                    index !== recentActions.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                  pt: index === 0 ? 0 : 1,
                  pb: index === recentActions.length - 1 ? 0 : 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.2 }}
                  >
                    <strong>{action.user}</strong>{" "}
                    {actionDictator(action.action, t)}{" "}
                    {action.action !== "LOG_IN" &&
                      action.action !== "LOG_OUT" && (
                        <Box
                          component="span"
                          sx={{
                            "fontWeight": "bold",
                            "color": "primary.main",
                            "cursor": "pointer",
                            "fontSize": "0.875rem",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {action.resourceName}
                        </Box>
                      )}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1, whiteSpace: "nowrap" }}
                  >
                    {action.time}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.disabled", fontStyle: "italic" }}
                >
                  {action.dateLabel === "Invalid Date" ?
                    t("dashboardRecentActivity.recent")
                  : action.dateLabel}
                </Typography>
              </Box>
            ))}
          </Box>
        }
      </CardContent>
    </Card>
  );
}
