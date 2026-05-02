import { Box, Divider, Typography, Dialog, Button, Stack } from "@mui/material";
import { Fragment, useState } from "react";
import Timeline from "@mui/lab/Timeline";
import ActivityTimelineItem from "./ActivityTimelineItem";
import { type ActivityGroup, type ActivityItem } from "./activityData";
import DocPreviewer from "../../content/components/DocPreviewer.tsx";
import { API_ENDPOINTS } from "../../../config";

interface ActivityTimelineProps {
  data: ActivityGroup[];
}

export default function ActivityTimeline({ data }: ActivityTimelineProps) {
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

  if (!data || data.length === 0) {
    return <Typography>No data to display in Timeline</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          "height": "calc(100vh - 200px)",
          "overflowY": "auto",
          "&::-webkit-scrollbar": {
            display: "none",
          },

          // Hide scrollbar for Firefox
          "scrollbarWidth": "none",

          // Hide scrollbar for IE and Edge
          "msOverflowStyle": "none",

          "pl": "40px",
          "pr": "40px",
        }}
      >
        <Timeline
          position="right"
          sx={{ p: 0 }}
        >
          {data.map((group, index) => (
            <Fragment key={`${group.date}-${index}`}>
              <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Typography
                  variant="overline"
                  sx={{
                    mr: 2,
                    whiteSpace: "nowrap",
                    color: "text.secondary",
                    letterSpacing: 1,
                    fontWeight: 600,
                  }}
                >
                  {group.date === "Invalid Date" ? "Unknown Date" : group.date}
                </Typography>
                <Divider sx={{ flexGrow: 1, borderColor: "divider" }} />
              </Box>

              {group.items.map((item: ActivityItem) => (
                <ActivityTimelineItem
                  key={item.id}
                  {...item}
                  onPreview={(uuid, name) => void handlePreview(uuid, name)}
                />
              ))}
            </Fragment>
          ))}
        </Timeline>
      </Box>

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
