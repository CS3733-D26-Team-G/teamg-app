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

let cachedUserData: PopularItem[] | null = null;
let cachedRoleData: PopularItem[] | null = null;

export default function PopularContent({ position }: Props) {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(
    cachedUserData === null || cachedRoleData === null,
  );
  const [userData, setUserData] = useState<PopularItem[]>(cachedUserData ?? []);
  const [roleData, setRoleData] = useState<PopularItem[]>(cachedRoleData ?? []);

  useEffect(() => {
    let isMounted = true;

    async function loadPopularContent() {
      try {
        setIsLoading(true);

        const [userRes, roleRes] = await Promise.all([
          fetch(API_ENDPOINTS.STATS.CONTENT_HITS_TOP_USER, {
            credentials: "include",
          }),
          fetch(API_ENDPOINTS.STATS.CONTENT_HITS_TOP_POSITION, {
            credentials: "include",
          }),
        ]);

        const [userHits, roleHits] = await Promise.all([
          userRes.json(),
          roleRes.json(),
        ]);

        if (!isMounted) return;

        cachedUserData = userHits;
        cachedRoleData = roleHits;
        setUserData(userHits);
        setRoleData(roleHits);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPopularContent();

    return () => {
      isMounted = false;
    };
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
      <Box
        sx={{
          overflowY: "auto",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          My Frequently Used
        </Typography>

        {userData.length > 0 ?
          userData.map((item) => (
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
                  overflowY: "auto",
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
        : <Typography
            variant="body2"
            color="text.secondary"
          >
            {isLoading ? "Loading..." : "No data yet."}
          </Typography>
        }
      </Box>

      <Box className="container">
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Popular for {position ? getPositionLabel(position as any) : ""}
        </Typography>

        {roleData.length > 0 ?
          roleData.map((item) => (
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
        : <Typography
            variant="body2"
            color="text.secondary"
          >
            {isLoading ? "Loading..." : "No data yet."}
          </Typography>
        }
      </Box>
    </Stack>
  );
}
