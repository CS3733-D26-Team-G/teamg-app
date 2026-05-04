import { useEffect, useState } from "react";
import { Box, Stack, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getPositionLabel } from "../../../utils/positionDisplay";
import { API_ENDPOINTS } from "../../../config";
import { useAuth } from "../../../auth/AuthContext";
import { recordRecentlyViewed } from "../../content/components/viewing/RecentlyViewed";

type PopularItem = {
  contentUuid: string;
  title: string;
  position: string | null;
  hits: number;
};

type Props = {
  position?: string;
};

export default function PopularContent({ position }: Props) {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState<PopularItem[]>([]);
  const [roleData, setRoleData] = useState<PopularItem[]>([]);

  useEffect(() => {
    fetch(API_ENDPOINTS.STATS.CONTENT_HITS_TOP_USER, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUserData)
      .catch(console.error);

    fetch(API_ENDPOINTS.STATS.CONTENT_HITS_TOP_POSITION, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setRoleData)
      .catch(console.error);
  }, []);

  const viewContent = (item: PopularItem) => {
    if (session?.employeeUuid) {
      recordRecentlyViewed(session.employeeUuid, item.contentUuid);
    }

    void fetch(API_ENDPOINTS.CONTENT.VIEW(item.contentUuid), {
      method: "POST",
      credentials: "include",
    });

    navigate(`/library?filter=${encodeURIComponent(item.title)}`);
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          My Frequently Used
        </Typography>
        {userData.length === 0 ?
          <Typography
            variant="body2"
            color="text.secondary"
          >
            No data yet.
          </Typography>
        : userData.map((item) => (
            <Tooltip
              key={item.contentUuid}
              title="View content"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => viewContent(item)}
              >
                <Typography
                  variant="body2"
                  sx={{
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
                  {item.hits === 1 ? "1 view" : `${item.hits} views`}
                </Typography>
              </Box>
            </Tooltip>
          ))
        }
      </Box>

      <Box>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Popular for {position ? getPositionLabel(position as any) : ""}
        </Typography>
        {roleData.length === 0 ?
          <Typography
            variant="body2"
            color="text.secondary"
          >
            No data yet.
          </Typography>
        : roleData.map((item) => (
            <Tooltip
              key={item.contentUuid}
              title="View content"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => viewContent(item)}
              >
                <Typography
                  variant="body2"
                  sx={{
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
                  {item.hits === 1 ? "1 view" : `${item.hits} views`}
                </Typography>
              </Box>
            </Tooltip>
          ))
        }
      </Box>
    </Stack>
  );
}
