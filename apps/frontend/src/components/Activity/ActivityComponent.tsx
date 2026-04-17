import {
  Box,
  Typography,
  Stack,
  InputLabel,
  Select,
  Menu,
} from "@mui/material";
import ActivityTimeline from "./ActivityTimeline";

export default function ActivityComponent() {
  return (
    <Box>
      <Stack>
        <Typography
          variant="h1"
          sx={{}}
        >
          Recent Activity
        </Typography>
      </Stack>
      <ActivityTimeline></ActivityTimeline>
    </Box>
  );
}
