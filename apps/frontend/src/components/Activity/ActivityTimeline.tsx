import { Box, Divider, Typography } from "@mui/material";
import { Fragment } from "react";
import Timeline from "@mui/lab/Timeline";
import ActivityTimelineItem from "./ActivityTimelineItem";
import { type ActivityGroup } from "./activityData";

interface ActivityTimelineProps {
  data: ActivityGroup[];
}

export default function ActivityTimeline({ data }: ActivityTimelineProps) {
  if (!data || data.length === 0) {
    return <Typography>No data to display in Timeline</Typography>;
  }
  return (
    <Box sx={{ height: "calc(100vh - 200px)", overflowY: "auto" }}>
      <Timeline
        position="right"
        sx={{
          p: 0,
          marginLeft: "8px",
        }}
      >
        {data.map((group, index) => (
          <Fragment key={`${group.date}-${index}`}>
            {/* Day Separator */}
            <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
              <Typography
                variant="h6"
                sx={{ mx: 2, fontWeight: "bold", whiteSpace: "nowrap" }}
                onClick={() => console.log(group.date)}
              >
                {group.date === "Invalid Date" ?
                  "DATE PARSING ERROR"
                : group.date}
              </Typography>
              <Divider
                sx={{
                  flexGrow: 1,
                  borderBottomWidth: 2,
                  borderColor: "divider",
                }}
              />
            </Box>

            {/* Map through items for this specific day */}
            {group.items.map((item) => (
              <ActivityTimelineItem
                key={item.id}
                {...item} // Spreads time, user, action, resourceName, etc.
              />
            ))}
          </Fragment>
        ))}
      </Timeline>
    </Box>
  );
}
