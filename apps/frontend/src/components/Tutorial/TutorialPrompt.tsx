import { Box, Button, Typography, Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorial } from "./TutorialContext";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SkipNextIcon from "@mui/icons-material/SkipNext";

export default function TutorialPrompt() {
  const { showPrompt, startTutorial, skipTutorial } = useTutorial();

  return (
    <AnimatePresence>
      {showPrompt && (
        <>
          {/* Backdrop */}
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 9000,
              backgroundColor: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Modal */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 9100,
              width: { xs: "90vw", sm: 480 },
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
            }}
          >
            {/* Gradient header */}
            <Box
              sx={{
                background:
                  "linear-gradient(135deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
                p: "36px 36px 28px",
                position: "relative",
                overflow: "hidden",
              }}
            >
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

              <Box
                component={motion.div}
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                sx={{ display: "inline-block", mb: 2 }}
              >
                <RocketLaunchIcon sx={{ fontSize: 44, color: "white" }} />
              </Box>

              <Typography
                sx={{
                  color: "white",
                  fontSize: "1.7rem",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                Welcome to iBank!
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "0.95rem",
                  mt: 0.75,
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                Admin Portal
              </Typography>
            </Box>

            {/* Body */}
            <Box
              sx={{ backgroundColor: "background.paper", p: "28px 36px 32px" }}
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "text.primary",
                  lineHeight: 1.65,
                  mb: 3,
                  fontFamily: "Rubik, sans-serif",
                }}
              >
                It looks like you're new here — or maybe just need a refresher.
                Would you like a{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  quick guided tour
                </Box>{" "}
                of the platform? We'll walk you through every page in about 2
                minutes.
              </Typography>

              <Stack spacing={1.5}>
                <Button
                  onClick={startTutorial}
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<RocketLaunchIcon />}
                  sx={{
                    "borderRadius": "12px",
                    "py": 1.4,
                    "fontSize": "1rem",
                    "fontWeight": 700,
                    "fontFamily": "Rubik, sans-serif",
                    "background": "linear-gradient(135deg, #1A1E4B, #395176)",
                    "boxShadow": "0 6px 20px rgba(57,81,118,0.4)",
                    "textTransform": "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #0f1230, #2d4060)",
                      boxShadow: "0 8px 24px rgba(57,81,118,0.55)",
                    },
                  }}
                >
                  Start the Tour
                </Button>

                <Button
                  onClick={skipTutorial}
                  variant="text"
                  fullWidth
                  size="large"
                  startIcon={<SkipNextIcon />}
                  sx={{
                    "borderRadius": "12px",
                    "py": 1.2,
                    "fontSize": "0.92rem",
                    "fontWeight": 500,
                    "fontFamily": "Rubik, sans-serif",
                    "color": "text.secondary",
                    "textTransform": "none",
                    "&:hover": {
                      backgroundColor: "action.hover",
                      color: "text.primary",
                    },
                  }}
                >
                  Skip for now
                </Button>
              </Stack>
            </Box>
          </Box>
        </>
      )}
    </AnimatePresence>
  );
}
