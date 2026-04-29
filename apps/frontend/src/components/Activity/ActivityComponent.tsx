import { Box, CircularProgress } from "@mui/material";
import ActivityTimeline from "./ActivityTimeline";
import { type ActivityGroup } from "./activityData";
import { useState, useEffect } from "react";
import SearchBar from "./HeaderSearchBar";
import { API_ENDPOINTS } from "../../config";
import { dedupeAsync } from "../../lib/async-cache";
import HelpPopup from "../HelpPopup.tsx";

export default function ActivityComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getActivity = async () => {
      try {
        const rawRows = await dedupeAsync("activity", async () => {
          const res = await fetch(API_ENDPOINTS.ACTIVITY, {
            method: "GET",
            credentials: "include",
          });

          if (!res.ok) {
            throw new Error(`Failed to fetch activity: ${res.status}`);
          }

          return res.json();
        });
        const grouped = groupDataByDate(rawRows);
        setData(grouped);
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
      console.log(
        "RAW ROW:",
        JSON.stringify({
          action: row.action,
          resourceName: row.resourceName,
          resourceUuid: row.resourceUuid,
        }),
      );

      const dateObj = new Date(row.timestamp);
      const isValid = row.timestamp && !isNaN(dateObj.getTime());

      const dateLabel =
        isValid ?
          dateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "Unknown Date";

      if (!groups[dateLabel]) groups[dateLabel] = [];

      groups[dateLabel].push({
        id: row.uuid ?? row.id,
        time:
          isValid ?
            dateObj.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--:--",
        user:
          row.employee ?
            `${row.employee.first_name} ${row.employee.last_name}`
          : "System",
        action: row.action,
        resourceUuid: row.resourceUuid,
        resourceName: row.resourceName,
        avatarUrl: row.employee?.avatar ?? undefined,
      });
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  };

  return (
    <Box sx={{ width: "100%", justifySelf: "center" }}>
      {loading ?
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      : <ActivityTimeline data={data} />}
    </Box>
  );
}
