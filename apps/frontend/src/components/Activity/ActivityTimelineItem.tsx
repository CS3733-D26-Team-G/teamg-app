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

export default function ActivityTimelineItem() {
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
        9:30 am
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot>
          <FastfoodIcon />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ py: "12px", px: 2 }}>
        <Typography
          variant="h6"
          component="span"
        >
          Eat
        </Typography>
        <Typography>Because you need strength</Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
