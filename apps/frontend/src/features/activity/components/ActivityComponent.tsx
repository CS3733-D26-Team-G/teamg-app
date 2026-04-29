import { Box, CircularProgress, Button } from "@mui/material";
import ActivityTimeline from "./ActivityTimeline";
import { type ActivityGroup, type ActivityItem } from "./activityData"; // Import the type, not the const
import { useState, useEffect, useMemo } from "react";
import SearchBar from "./HeaderSearchBar";
import HelpPopup from "../../../components/HelpPopup.tsx";
import { useAuth } from "../../../auth/AuthContext";
import { loadActivity } from "../../../lib/activity-loaders.ts";

export default function ActivityComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "content" | "login">("all");
  const { session } = useAuth();
  const isAdmin = session?.permissions.can_manage_all_content ?? false;

  useEffect(() => {
    setLoading(true);
    const getActivity = async () => {
      try {
        const category =
          filter === "content" ? "content"
          : filter === "login" ? "auth"
          : "all";
        const rawRows = await loadActivity(category);
        const grouped = groupDataByDate(rawRows);
        setData(grouped);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    getActivity();
  }, [filter]);

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
            `${row.employee.firstName} ${row.employee.lastName}`
          : "System",
        action: row.action?.replace(/_/g, " "),
        resourceUuid: row.resourceUuid,
        resourceName: row.resourceName,
        avatar_url: row.employee?.avatar ?? undefined,
        employeeUuid: row.employeeUuid,
      });
    });

    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    return data
      .map((group) => ({
        ...group,
        items: group.items.filter((item: ActivityItem) => {
          const q = searchQuery.toLowerCase();
          return (
            item.user.toLowerCase().includes(q) ||
            item.action.toLowerCase().includes(q) ||
            (item.resourceName?.toLowerCase().includes(q) ?? false)
          );
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [data, searchQuery]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SearchBar setSearchQuery={setSearchQuery} />
          <HelpPopup
            description="The Activity page shows a log of recent actions taken across the platform, including content views and updates."
            infoOrHelp={true}
          />
        </Box>

        {isAdmin && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {(["all", "content", "login"] as const).map((val) => (
              <Button
                key={val}
                variant="contained"
                size="small"
                onClick={() => setFilter(val)}
                sx={{
                  opacity: filter === val ? 1 : 0.55,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  letterSpacing: 0.5,
                  boxShadow: filter === val ? 2 : "none",
                }}
              >
                {val}
              </Button>
            ))}
          </Box>
        )}
      </Box>

      {loading ?
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      : <ActivityTimeline data={filteredData} />}
    </Box>
  );
}
