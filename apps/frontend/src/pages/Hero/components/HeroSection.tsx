import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Alert, Collapse, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { motion } from "framer-motion";
import HanoverLogoWhite from "../../../assets/HanoverLogoWhite.png";
import LoginModal from "./LoginModal.tsx";
import theme from "../../../theme.tsx";
import { type Variants } from "framer-motion";
import CarouselBackground from "./CarouselBackground";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../auth/AuthContext.tsx";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4,
    },
  },
};

const itemVariants: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 40,
      damping: 20,
      duration: 1.5,
    },
  },
};

export default function HeroSection() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(true);
  const { t } = useTranslation();

  const careLines = [
    { letter: "C", word: "ollaboration", indent: "pl-25" },
    { letter: "A", word: "ccountability", indent: "pl-31" },
    { letter: "R", word: "espect", indent: "pl-37" },
    { letter: "E", word: "mpowerment", indent: "pl-43" },
  ];

  return (
    <CarouselBackground>
      {/* Login Modal */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />

      {/* Dark overlay so text stays readable */}
      <Box
        className="absolute inset-0"
        sx={{
          position: "absolute",
          background:
            "linear-gradient(90deg, rgba(0,0,0,.9) 0%, rgba(0,0,0,0.75) 25%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0) 100%)",
          zIndex: 11,
        }}
      />

      {/* Course Disclaimer */}
      <Collapse in={disclaimerOpen}>
        <Alert
          severity="info"
          icon={<InfoIcon sx={{ color: "white" }} />}
          onClose={() => setDisclaimerOpen(false)}
          sx={{
            "position": "relative",
            "zIndex": 12,
            "boxShadow": "none !important",
            "backgroundColor": "#395176 !important",
            ...theme.typography.body1,
            "& .MuiAlert-icon": { color: "white" },
            "& .MuiAlert-message": { color: "white" },
            "& .MuiIconButton-root": { color: "white" },
          }}
        >
          {t("heroSection.disclaimer")}
        </Alert>
      </Collapse>

      {/* Top Navigation Bar */}
      <Box
        className="relative flex items-center justify-between px-7 py-4"
        sx={{ zIndex: 12 }}
      >
        <Box>
          <img
            src={HanoverLogoWhite}
            alt="White Hanover Logo"
            className="w-20 h-auto"
          />
        </Box>

        {session ?
          <Button
            onClick={() => navigate("/dashboard")}
            sx={{
              "position": "absolute",
              "right": 15,
              "background": "white",
              "color": "black",
              "fontFamily": theme.typography.fontFamily,
              "fontSize": 18,
              "fontWeight": "bold",
              "px": 5,
              "py": 1.5,
              "borderRadius": "70px",
              "boxShadow": "0px 8px 0px rgba(0,0,0,0.18)",
              "textTransform": "none",
              "&:hover": { background: "#d9d2c5" },
            }}
          >
            Go to Dashboard
          </Button>
        : <Button
            onClick={() => setLoginOpen(true)}
            sx={{
              "position": "absolute",
              "right": 40,
              "background": "white",
              "color": "black",
              "fontFamily": theme.typography.fontFamily,
              "fontSize": 18,
              "fontWeight": "bold",
              "px": 5,
              "py": 1.5,
              "borderRadius": "70px",
              "boxShadow": "0px 8px 0px rgba(0,0,0,0.18)",
              "textTransform": "none",
              "&:hover": { background: "#d9d2c5" },
            }}
          >
            {t("heroSection.login")}
          </Button>
        }
      </Box>

      {/* Animated Main Content Area */}
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col flex-1 justify-center"
        sx={{
          fontFamily: "Domine",
          color: "white",
          mb: 8,
          zIndex: 13,
        }}
      >
        {/* CARE Acronym Waterfall */}
        {careLines.map(({ letter, word, indent }) => (
          <Box
            key={letter}
            component={motion.div}
            variants={itemVariants}
            className={`${indent} my-1`}
            sx={{
              fontSize: "clamp(48px, 3vw, 64px)",
              fontWeight: 500,
              lineHeight: 1.25,
            }}
          >
            <Box
              component="span"
              sx={{ fontSize: "clamp(65px, 5vw, 80px)", fontWeight: 700 }}
            >
              {letter}
            </Box>
            {word}
          </Box>
        ))}

        {/* Welcome Text Section */}
        <Box
          component={motion.div}
          variants={itemVariants}
          className="mt-4 pl-26"
          sx={{
            fontSize: 26,
            color: "white",
            fontFamily: "Domine",
            lineHeight: 1.75,
            whiteSpace: "pre-line",
          }}
        >
          {t("heroSection.welcome")}
        </Box>
      </Box>

      {/* Footer Section */}
    </CarouselBackground>
  );
}
