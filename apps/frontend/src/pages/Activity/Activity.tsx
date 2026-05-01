import ActivityComponent from "../../features/activity/components/ActivityComponent.tsx";
import { Typography, Box, Button, Stack } from "@mui/material";
import SearchBar from "../../features/activity/components/HeaderSearchBar";
import HelpPopup from "../../components/HelpPopup.tsx";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";
import { useActivityQuery } from "../../lib/activity-loaders.ts";

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
          background:
            "linear-gradient(135deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          px: 4,
          pt: 5,
          pb: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
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
            }}
          />
        ))}
      </Box>
      <Box
        sx={{
          borderRadius: "14px",
          backgroundColor: "white",
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
