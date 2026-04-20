import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import Typography from "@mui/material/Typography";
import { type ActivityItem } from "./activityData";

export default function ActivityTimelineItem({
  time,
  user,
  action,
}: ActivityItem) {
  return (
    <TimelineItem>
      <TimelineOppositeContent
        align="right"
        variant="body2"
        sx={{
          color: "text.secondary",
          m: "auto 0",
          flex: "none",
          width: 120,
          textAlign: "left",
          alignContent: "start",
        }}
      >
        {time}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot>
          <FastfoodIcon />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          px: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          component="span"
          sx={{}}
        >
          {user} {action}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
