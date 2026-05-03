import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  CardHeader,
  Box,
  Dialog,
  Stack,
  Button,
} from "@mui/material";
import { transformBackendData } from "./activityData.ts";
import HelpPopup from "../../../components/HelpPopup.tsx";
import DocPreviewer from "../../content/components/viewing/DocPreviewer.tsx";
import { API_ENDPOINTS } from "../../../config.ts";

interface DashboardRecentActivityProps {
  rawLogs: any[];
}

function actionDictator(action: string) {
  const map: Record<string, string> = {
    EDIT_CONTENT: "edited",
    DELETE_CONTENT: "deleted",
    CREATE_CONTENT: "created",
    LOG_IN: "Logged In",
    LOG_OUT: "Logged Out",
    CHECK_IN_CONTENT: "checked in",
    CHECK_OUT_CONTENT: "checked out",
  };
  return map[action] || action.toLowerCase();
}

export default function DashboardRecentActivity({
  rawLogs,
}: DashboardRecentActivityProps) {
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

  const [previewDoc, setPreviewDoc] = useState<{
    uuid: string;
    fileName: string;
  } | null>(null);
  const [deletedDoc, setDeletedDoc] = useState<string | null>(null);

  const handlePreview = async (resourceUuid: string, resourceName: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.FILE(resourceUuid), {
        method: "HEAD",
        credentials: "include",
      });

      if (res.status === 404) {
        setDeletedDoc(resourceName);
      } else {
        setPreviewDoc({ uuid: resourceUuid, fileName: resourceName });
      }
    } catch {
      setDeletedDoc(resourceName);
    }
  };

  return (
    <>
      <Card
        className="min-w-125 outline-gray-200 outline-1  drop-shadow-lg"
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
              Recent Activity
              <HelpPopup
                description="The Recent Activity feed shows information about the four most recent actions taken across the application. This includes the user, the time, the date, and what they did. Go to the Activity page using the side bar for a longer time line of activity!"
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
              No recent activity.
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
                      {actionDictator(action.action)}{" "}
                      {action.action !== "LOG_IN" &&
                        action.action !== "LOG_OUT" && (
                          <Box
                            component="span"
                            onClick={() => {
                              if (action.resourceUuid && action.resourceName) {
                                void handlePreview(
                                  action.resourceUuid,
                                  action.resourceName,
                                );
                              }
                            }}
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
                      "Recent"
                    : action.dateLabel}
                  </Typography>
                </Box>
              ))}
            </Box>
          }
        </CardContent>
      </Card>

      {/* Preview dialog */}
      <Dialog
        open={previewDoc !== null}
        onClose={() => setPreviewDoc(null)}
        maxWidth="lg"
        fullWidth
        keepMounted
      >
        <Box sx={{ height: "85vh", display: "flex", flexDirection: "column" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 1, gap: 1, flexShrink: 0 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ pl: 1, color: "text.secondary" }}
              noWrap
            >
              {previewDoc?.fileName ?? "Preview"}
            </Typography>
            <Button onClick={() => setPreviewDoc(null)}>Close</Button>
          </Stack>

          <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
            {previewDoc && (
              <DocPreviewer
                key={previewDoc.uuid}
                uri={API_ENDPOINTS.CONTENT.FILE(previewDoc.uuid)}
                fileName={previewDoc.fileName}
              />
            )}
          </Box>
        </Box>
      </Dialog>

      <Dialog
        open={deletedDoc !== null}
        onClose={() => setDeletedDoc(null)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography
            variant="h6"
            sx={{ mb: 1 }}
          >
            Content Deleted
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            <strong>{deletedDoc}</strong> has been deleted and is no longer
            available.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setDeletedDoc(null)}
          >
            OK
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
