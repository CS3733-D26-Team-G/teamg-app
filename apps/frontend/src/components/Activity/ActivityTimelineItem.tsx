import {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from "@mui/lab";
import { Avatar, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { type ActivityItem } from "./activityData";

// Helper to make backend enums human-readable
function actionDictator(action: string) {
  const map: Record<string, string> = {
    EDIT_CONTENT: "edited",
    DELETE_CONTENT: "deleted",
    CREATE_CONTENT: "created",
    LOG_IN: "Logged In",
    LOG_OUT: "Logged Out",
  };
  return map[action] || action.toLowerCase();
}

export default function ActivityTimelineItem({
  time,
  user,
  action,
  resourceName,
  resourceUuid,
}: ActivityItem) {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    // Only route if it's a content action and we have a name to filter by
    if (
      (action === "EDIT_CONTENT" || action === "CREATE_CONTENT") &&
      resourceName
    ) {
      navigate(`/library?filter=${encodeURIComponent(resourceName)}`);
    }
  };

  return (
    <TimelineItem>
      <TimelineOppositeContent
        variant="body2"
        sx={{ color: "text.secondary", m: "auto 0", flex: "none", width: 80 }}
      >
        {time}
      </TimelineOppositeContent>

      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot sx={{ p: 0 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem" }}>
            {user.charAt(0)}
          </Avatar>
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>

      <TimelineContent
        sx={{
          py: "12px",
          px: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="body1">
          <strong>{user}</strong> {actionDictator(action)}{" "}
          {resourceName && (
            <Box
              component="span"
              onClick={handleTitleClick}
              sx={{
                "fontWeight": "bold",
                "color": "primary.main",
                "cursor": "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {resourceName}
            </Box>
          )}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
