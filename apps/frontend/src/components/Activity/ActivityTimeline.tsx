import Box from "@mui/material/Box";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import Typography from "@mui/material/Typography";
import ActivityTimelineItem from "./ActivityTimelineItem";
import { computeFlexColumnsWidth } from "@mui/x-data-grid/internals";

export default function CustomizedTimeline() {
  return (
    <Box
      sx={{
        height: "75%",
      }}
    >
      <Timeline
        sx={{
          alignItems: "left",
        }}
      >
        <ActivityTimelineItem></ActivityTimelineItem>
        <ActivityTimelineItem></ActivityTimelineItem>
        <ActivityTimelineItem></ActivityTimelineItem>
        <ActivityTimelineItem></ActivityTimelineItem>
        <ActivityTimelineItem></ActivityTimelineItem>
      </Timeline>
    </Box>
  );
}
