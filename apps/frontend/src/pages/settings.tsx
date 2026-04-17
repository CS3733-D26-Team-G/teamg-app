import { Box, Typography, Paper, Divider, Switch, Stack } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../Themecontext.tsx";

function Settings() {
  const { isDarkMode, isSaving, toggleDarkMode } = useThemeMode();

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography
        variant="h1"
        gutterBottom
        color="text.primary"
      >
        Settings
      </Typography>

      <Paper
        elevation={2}
        sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}
      >
        {/* Section: Appearance */}
        <Box sx={{ px: 3, py: 2 }}>
          <Typography
            variant="overline"
            color="text.secondary"
          >
            Appearance
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ px: 3, py: 2.5 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
            >
              {isDarkMode ?
                <DarkModeIcon sx={{ color: "primary.main" }} />
              : <LightModeIcon sx={{ color: "primary.main" }} />}
              <Box>
                <Typography
                  variant="body1"
                  fontWeight={500}
                >
                  Dark Mode
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {isDarkMode ?
                    "Dark theme is active"
                  : "Light theme is active"}
                </Typography>
              </Box>
            </Stack>

            <Switch
              checked={isDarkMode}
              onChange={() => {
                void toggleDarkMode();
              }}
              color="primary"
              disabled={isSaving}
              inputProps={{ "aria-label": "Toggle dark mode" }}
            />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

export default Settings;
