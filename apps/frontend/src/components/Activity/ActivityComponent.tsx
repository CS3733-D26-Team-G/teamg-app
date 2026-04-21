import { Box, CircularProgress, Typography } from "@mui/material";
import ActivityTimeline from "./ActivityTimeline";
import { type ActivityGroup } from "./activityData"; // Import the type, not the const
import { useState, useEffect } from "react";
import SearchBar from "./HeaderSearchBar";
import { API_ENDPOINTS } from "../../config";

export default function ActivityComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getActivity = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.ACTIVITY, {
          method: "GET",
          credentials: "include", // Required for Sam's Admin-only restriction
        });

        if (res.ok) {
          const rawRows = await res.json();

          const grouped = groupDataByDate(rawRows);
          setData(grouped);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    getActivity();
  }, []);

  const groupDataByDate = (rows: any[]): ActivityGroup[] => {
    const groups: { [key: string]: any[] } = {};

    rows.forEach((row) => {
      const dateLabel = new Date(row.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      if (!groups[dateLabel]) groups[dateLabel] = [];

      groups[dateLabel].push({
        id: row.uuid ?? row.id ?? `temp-${Date.now()}-${Math.random()}`,
        time: new Date(row.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        user:
          row.employee ?
            `${row.employee.first_name} ${row.employee.last_name}`
          : "System",
        action: row.action,
        resourceUuid: row.resourceUuid,
        resourceName: row.resourceName,
      });
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  };

  return (
    <Box sx={{ width: "90%", justifySelf: "center" }}>
      <SearchBar setSearchQuery={setSearchQuery} />

      {loading ?
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      : <ActivityTimeline data={data} />}
    </Box>
  );
}
