import ActivityComponent from "../components/Activity/ActivityComponent";
import { Typography, Box } from "@mui/material";

function Activity() {
  return (
    <Box sx={{ backgroundColor: "background.paper" }}>
      <Box
        className="activity-header"
        sx={{
          background:
            "linear-gradient(135deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          pb: "1rem",
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          sx={{ p: "48px 24px 16px 24px", color: "white" }}
        >
          Recent Activity
        </Typography>
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
            }}
          />
        ))}
      </Box>
      <ActivityComponent />
    </Box>
  );
}

export default Activity;
