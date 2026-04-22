import ActivityComponent from "../components/Activity/ActivityComponent";
import { Typography, Box } from "@mui/material";

function Activity() {
  return (
    <Box
      sx={{
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          p: "48px 24px 16px 24px",
        }}
      >
        Recent Activity
      </Typography>
      <ActivityComponent></ActivityComponent>
    </Box>
  );
}

export default Activity;
