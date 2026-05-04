import { useEffect, useState } from "react";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { useDashboardBootstrap } from "../useDashboardBootstrap";
import { getRecentlyViewed } from "../../content/components/viewing/RecentlyViewed";

type RecentContentItem = {
  uuid: string;
  title: string;
  viewedAt: number;
};

export default function RecentlyViewedContent() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data } = useDashboardBootstrap();
  const [items, setItems] = useState<RecentContentItem[]>([]);

  useEffect(() => {
    if (!session?.employeeUuid || !data?.contentList) {
      setItems([]);
      return;
    }

    const recentEntries = getRecentlyViewed(session.employeeUuid);

    const recentItems = recentEntries
      .map((entry) => {
        const content = data.contentList.find((row) => row.uuid === entry.uuid);

        if (!content) {
          return null;
        }

        return {
          uuid: content.uuid,
          title: content.title,
          viewedAt: entry.viewedAt,
        };
      })
      .filter((item): item is RecentContentItem => item !== null)
      .slice(0, 5);

    setItems(recentItems);
  }, [session?.employeeUuid, data?.contentList]);

  const viewContent = (title: string) => {
    navigate(`/library?filter=${encodeURIComponent(title)}`);
  };

  return (
    <Stack spacing={1}>
      {items.length === 0 ?
        <Typography
          variant="body2"
          color="text.secondary"
        >
          No recently viewed content yet.
        </Typography>
      : items.map((item) => (
          <Tooltip
            key={item.uuid}
            title="View content"
          >
            <Box
              sx={{
                cursor: "pointer",
              }}
              onClick={() => viewContent(item.title)}
            >
              <Typography
                variant="body2"
                sx={{
                  "transition": "all 0.2s ease",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.main",
                  },
                }}
              >
                {item.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Recently viewed
              </Typography>
            </Box>
          </Tooltip>
        ))
      }
    </Stack>
  );
}
