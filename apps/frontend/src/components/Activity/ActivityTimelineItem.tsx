import {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
} from "@mui/lab";
import { Avatar, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { type ActivityItem } from "./activityData";

function actionDictator(action: string): string {
  const normalized = action?.toLowerCase().replace(/\s+/g, "_").trim() ?? "";

  const map: Record<string, string> = {
    edit_content: "edited",
    delete_content: "deleted",
    create_content: "created",
    log_in: "logged in",
    log_out: "logged out",
    check_in_content: "checked in",
    check_out_content: "checked out",
  };

  return map[normalized] || normalized.replace(/_/g, " ");
}

function isCheckoutAction(action: string): boolean {
  const normalized = action?.toLowerCase().replace(/\s+/g, "_").trim() ?? "";
  return normalized === "check_out_content";
}

export default function ActivityTimelineItem({
  time,
  user,
  action,
  resourceName,
}: ActivityItem) {
  const isCheckout = isCheckoutAction(action);

  console.log("ActivityTimelineItem:", { action, resourceName, isCheckout });

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
          {resourceName &&
            (isCheckout ?
              <Link
                component={RouterLink}
                to={`/library?filter=${encodeURIComponent(resourceName)}`}
                underline="hover"
                onClick={(e) => e.stopPropagation()}
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                {resourceName}
              </Link>
            : <strong>{resourceName}</strong>)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
