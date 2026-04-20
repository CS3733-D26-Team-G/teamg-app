import { Box, Divider, Typography } from "@mui/material";
import { Fragment } from "react";
import Timeline from "@mui/lab/Timeline";
import ActivityTimelineItem from "./ActivityTimelineItem";
import { type ActivityGroup } from "./activityData.ts";

interface CustomizedTimelineProps {
  data: ActivityGroup[];
}

export default function CustomizedTimeline({ data }: CustomizedTimelineProps) {
  return (
    <Box sx={{ height: "100%", overflowY: "auto" }}>
      <Timeline
        position="right"
        sx={{ p: 0 }}
      >
        {data.map((group: { date: string; items: any[] }) => (
          <Fragment key={group.date}>
            {/* Day Separator */}
            <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
              <Typography
                variant="h3"
                sx={{ mx: 2, fontWeight: "semi-bold" }}
              >
                {group.date}
              </Typography>
              <Divider
                sx={{ flexGrow: 1, borderBottomWidth: 2, borderColor: "black" }}
              />
            </Box>

            {/* Map through items for this specific day */}
            {group.items.map((item) => (
              <ActivityTimelineItem
                key={item.id}
                {...item}
              />
            ))}
          </Fragment>
        ))}
      </Timeline>
    </Box>
  );
}
