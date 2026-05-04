import { useEffect, useState } from "react";
import { Box, Stack, Typography, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [userData, setUserData] = useState<PopularItem[]>([]);
  const [roleData, setRoleData] = useState<PopularItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/stats/content/hits/top-user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setUserData)
      .catch(console.error);

    fetch("http://localhost:3000/stats/content/hits/top-position", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setRoleData)
      .catch(console.error);
  }, []);

  const viewContent = (title: string) => {
    navigate(`/library?filter=${encodeURIComponent(title)}`);
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
            <Tooltip title="View content">
              <Box
                key={item.contentUuid}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => viewContent(item.title)}
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
          Popular for {position}
        </Typography>
        {roleData.length === 0 ?
          <Typography
            variant="body2"
            color="text.secondary"
          >
            No data yet.
          </Typography>
        : roleData.map((item) => (
            <Tooltip title="View content">
              <Box
                key={item.contentUuid}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => viewContent(item.title)}
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
