import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../config";
import CustomizedTimeline from "./ActivityTimeline";
import { type ActivityGroup } from "./activityData";
import { transformBackendData } from "./activityData";
import { Box, Typography, Stack } from "@mui/material";

export default function ActivityLogPage() {
  const [timelineData, setTimelineData] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getActivity() {
      try {
        const res = await fetch(API_ENDPOINTS.ACTIVITY, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const rawRows = await res.json();
          const grouped = transformBackendData(rawRows);
          console.log("Grouped info: ", grouped);
          setTimelineData(grouped);
        }
      } catch (error) {
        console.error("Failed to fetch activity:", error);
      } finally {
        setLoading(false);
      }
    }

    getActivity();
  }, []);

  if (loading) return <Typography>Loading activity...</Typography>;

  return (
    <Box sx={{ p: 4, height: "100%" }}>
      <Typography
        variant="h2"
        gutterBottom
      >
        System Activity
      </Typography>
      <CustomizedTimeline data={timelineData} />
    </Box>
  );
}
