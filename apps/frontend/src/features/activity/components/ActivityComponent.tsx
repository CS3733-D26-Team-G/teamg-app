import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import ActivityTimeline from "./ActivityTimeline";
import { type ActivityGroup, type ActivityItem } from "./activityData";
import { useEffect, useMemo } from "react";
import SearchBar from "./HeaderSearchBar";
import HelpPopup from "../../../components/HelpPopup.tsx";
import { useAuth } from "../../../auth/AuthContext";
import { useActivityQuery } from "../../../lib/activity-loaders.ts";
import { prefetchContentList } from "../../../lib/api-loaders.ts";

interface ActivityComponentProps {
  filter: "all" | "content" | "login";
  searchQuery: string;
}

function TimelineItemSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 1.5,
        alignItems: "center",
        px: "40px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        <Box sx={{ width: 1, height: 16, bgcolor: "action.hover" }} />
        <Skeleton
          variant="circular"
          width={32}
          height={32}
        />
        <Box sx={{ width: 1, height: 16, bgcolor: "action.hover" }} />
      </Box>
      <Skeleton
        variant="rounded"
        width="100%"
        height={60}
        sx={{ borderRadius: "8px" }}
      />
    </Box>
  );
}

function ActivityLoadingSkeleton() {
  return (
    <Box sx={{ pt: 2 }}>
      {/* Date header */}
      <Box sx={{ display: "flex", alignItems: "center", px: "40px", mb: 2 }}>
        <Skeleton
          variant="text"
          width={140}
          height={20}
          sx={{ mr: 2 }}
        />
        <Box sx={{ flex: 1, height: 1, bgcolor: "divider" }} />
      </Box>
      {[...Array(4)].map((_, i) => (
        <TimelineItemSkeleton key={i} />
      ))}

      <Box sx={{ display: "flex", alignItems: "center", px: "40px", my: 2 }}>
        <Skeleton
          variant="text"
          width={100}
          height={20}
          sx={{ mr: 2 }}
        />
        <Box sx={{ flex: 1, height: 1, bgcolor: "divider" }} />
      </Box>
      {[...Array(3)].map((_, i) => (
        <TimelineItemSkeleton key={i} />
      ))}
    </Box>
  );
}

export default function ActivityComponent({
  filter,
  searchQuery,
}: ActivityComponentProps) {
  const { session } = useAuth();
  const isAdmin = session?.permissions.can_manage_all_content ?? false;
  const category =
    filter === "content" ? "content"
    : filter === "login" ? "auth"
    : "all";
  const activityQuery = useActivityQuery(category);

  useEffect(() => {
    void prefetchContentList();
  }, []);

  function groupDataByDate(rows: any[]): ActivityGroup[] {
    const groups: { [key: string]: any[] } = {};

    rows.forEach((row) => {
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
  }

  const groupedData = useMemo(
    () => groupDataByDate(activityQuery.data ?? []),
    [activityQuery.data],
  );

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return groupedData;
    return groupedData
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
  }, [groupedData, searchQuery]);

  // Initial load — show skeleton
  if (activityQuery.loading && groupedData.length === 0) {
    return <ActivityLoadingSkeleton />;
  }

  // Empty state
  if (!activityQuery.loading && groupedData.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          color: "text.secondary",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 1, fontWeight: 600 }}
        >
          No activity found
        </Typography>
        <Typography variant="body2">
          {searchQuery ?
            "No results match your search."
          : "Activity will appear here once actions are performed."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        "width": "100%",
        "&::-webkit-scrollbar": { display: "none" },
        "scrollbarWidth": "none",
        "msOverflowStyle": "none",
      }}
    >
      {/* Background refresh indicator */}
      {activityQuery.fetching && groupedData.length > 0 && (
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", px: 4, py: 0.5 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={12} />
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Refreshing…
            </Typography>
          </Box>
        </Box>
      )}
      <ActivityTimeline data={filteredData} />
    </Box>
  );
}
