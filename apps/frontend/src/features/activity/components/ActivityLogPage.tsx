import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../config";
import CustomizedTimeline from "./ActivityTimeline";
import { type ActivityGroup } from "./activityData";
import { transformBackendData } from "./activityData";
import { Box, Typography, Stack } from "@mui/material";

export default function ActivityLogPage() {
  const [timelineData, setTimelineData] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getActivity() {
      console.log("FETCH STARTING..."); // Log 1
      try {
        const res = await fetch(API_ENDPOINTS.ACTIVITY, {
          method: "GET",
          credentials: "include",
        });

        console.log("RESPONSE STATUS:", res.status); // Log 2

        if (res.ok) {
          const rawRows = await res.json();
          console.log("RAW ROWS FROM API:", rawRows); // Log 3

          const grouped = transformBackendData(rawRows);
          console.log("GROUPED INFO:", grouped); // Log 4

          setTimelineData(grouped);
        } else {
          console.error("Response not OK. Check network tab.");
        }
      } catch (error) {
        console.error("FETCH ERROR:", error);
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
