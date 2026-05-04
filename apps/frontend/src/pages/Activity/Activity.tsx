import ActivityComponent from "../../features/activity/components/ActivityComponent.tsx";
import { Typography, Box, Button, Stack, Skeleton } from "@mui/material";
import SearchBar from "../../features/activity/components/HeaderSearchBar";
import HelpPopup from "../../components/HelpPopup.tsx";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";
import { useActivityQuery } from "../../lib/activity-loaders.ts";

function ActivityPageSkeleton() {
  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        overflowX: "hidden",
        borderRadius: "14px",
      }}
    >
      {/* Header skeleton */}
      <Box
        sx={{
          background: "transparent",
          px: 4,
          pt: 5,
          pb: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Skeleton
          variant="text"
          width={260}
          height={60}
          sx={{ bgcolor: "rgba(255,255,255,0.12)" }}
        />
        <Skeleton
          variant="text"
          width={380}
          height={24}
          sx={{ bgcolor: "rgba(255,255,255,0.08)", mt: 0.5 }}
        />
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Skeleton
            variant="rounded"
            width={240}
            height={40}
            sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: "4px" }}
          />
        </Stack>
      </Box>

      {/* Timeline skeleton */}
      <Box
        sx={{
          borderRadius: "14px",
          backgroundColor: "background.paper",
          width: "95%",
          mx: "auto",
          p: 3,
        }}
      >
        {/* Date label */}
        <Skeleton
          variant="text"
          width={160}
          height={20}
          sx={{ mb: 2 }}
        />
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
          >
            <Skeleton
              variant="circular"
              width={36}
              height={36}
              sx={{ flexShrink: 0 }}
            />
            <Skeleton
              variant="rounded"
              width="100%"
              height={56}
              sx={{ borderRadius: "8px", opacity: Math.max(0.2, 1 - i * 0.12) }}
            />
          </Box>
        ))}
        <Skeleton
          variant="text"
          width={120}
          height={20}
          sx={{ mt: 3, mb: 2 }}
        />
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
          >
            <Skeleton
              variant="circular"
              width={36}
              height={36}
              sx={{ flexShrink: 0 }}
            />
            <Skeleton
              variant="rounded"
              width="100%"
              height={56}
              sx={{
                borderRadius: "8px",
                opacity: Math.max(0.2, 0.6 - i * 0.15),
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Activity() {
  const [searchQuery, setSearchQuery] = useState("");
  const { session } = useAuth();
  const [filter, setFilter] = useState<"all" | "content" | "login">("all");
  const isAdmin = session?.permissions.can_manage_all_content ?? false;
  const category =
    filter === "content" ? "content"
    : filter === "login" ? "auth"
    : "all";
  const activityQuery = useActivityQuery(category);

  // Show skeleton on initial load (no data yet)
  if (activityQuery.loading && !activityQuery.data) {
    return <ActivityPageSkeleton />;
  }

  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        overflowX: "hidden",
        borderRadius: "14px",
      }}
    >
      <Box
        className="activity-header"
        sx={{
          background: "transparent",
          px: 4,
          pt: 5,
          pb: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            mb: 0.5,
            mt: -1,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
            px: 3,
          }}
        >
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            width="100%"
          >
            <Box>
              <Typography
                variant="h2"
                sx={{ color: "white", mb: 0.5 }}
              >
                Recent Activity
              </Typography>
              <Typography
                sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}
              >
                Track historical changes and pending approvals in real-time.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 0.5,
                zIndex: 10,
              }}
            >
              <HelpPopup
                description="The Activity page shows a log of recent actions taken across the platform, including content views and updates."
                infoOrHelp={true}
              />
            </Box>
          </Stack>
        </Box>
        <Box
          sx={{
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            pt: 2,
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SearchBar setSearchQuery={setSearchQuery} />
            <HelpPopup
              description="You can use this search bar to look anything from along the timeline including users, actions, or specific documents."
              infoOrHelp={true}
            />
          </Box>

          {isAdmin && (
            <Box
              className="activity-filters"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
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
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              width: 120 + i * 80,
              height: 120 + i * 80,
              top: -40 - i * 30,
              right: -40 - i * 30,
              zIndex: 0,
              pointerEvents: "none",
            }}
          />
        ))}
      </Box>
      <Box
        className="activity-timeline"
        sx={{
          borderRadius: "14px",
          backgroundColor: "background.paper",
          width: "95%",
          mx: "auto",
        }}
      >
        <ActivityComponent
          filter={filter}
          searchQuery={searchQuery}
        />
      </Box>
    </Box>
  );
}

export default Activity;
