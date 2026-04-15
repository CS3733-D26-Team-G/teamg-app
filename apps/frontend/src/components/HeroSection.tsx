import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Alert, Collapse, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { motion } from "framer-motion";
import HanoverLogoWhite from "../assets/HanoverLogoWhite.png";
import HanoverVols from "../assets/HanoverVols.png";
import LoginPopUp from "../pages/LoginPopUp.tsx";
import theme from "../theme.tsx";
import Footer from "./Footer.tsx";
import { type Variants } from "framer-motion";

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
  const [loginOpen, setLoginOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(true);

  const careLines = [
    { letter: "C", word: "ollaboration", indent: "pl-25" },
    { letter: "A", word: "ccountability", indent: "pl-31" },
    { letter: "R", word: "espect", indent: "pl-37" },
    { letter: "E", word: "mpowerment", indent: "pl-43" },
  ];

  return (
    <Box
      className="relative flex flex-col"
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: `url(${HanoverVols})`,
        backgroundSize: "cover",
        backgroundPosition: "top left",
        backgroundRepeat: "no-repeat",
        overflowX: "hidden",
      }}
    >
      {/* Login Modal */}
      <LoginPopUp
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
          zIndex: 0,
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
            "zIndex": 2,
            "boxShadow": "none !important",
            "backgroundColor": "#1A1E4B !important",
            "fontFamily": theme.typography.fontFamily,
            "& .MuiAlert-icon": { color: "white" },
            "& .MuiAlert-message": { color: "white" },
            "& .MuiIconButton-root": { color: "white" },
          }}
        >
          This site is created for a course at Worcester Polytechnic Institute.
          It is not affiliated with or operated by the Hanover Insurance Group.
          This is a student project created solely for academic purposes.
        </Alert>
      </Collapse>

      {/* Top Navigation Bar */}
      <Box
        className="relative flex items-center justify-between px-7 py-4"
        sx={{ zIndex: 1 }}
      >
        <Box>
          <img
            src={HanoverLogoWhite}
            alt="White Hanover Logo"
            className="w-[80px] h-auto"
          />
        </Box>

        <Button
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
          Log In
        </Button>
      </Box>

      {/* Animated Main Content Area */}
      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-col flex-1 justify-center"
        sx={{
          fontFamily: theme.typography.fontFamily,
          color: "white",
          mb: 8,
          zIndex: 1,
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
              sx={{ fontSize: "clamp(60px, 4vw, 76px)", fontWeight: 900 }}
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
            fontFamily: theme.typography.h2,
            lineHeight: 1.75,
          }}
        >
          Welcome to iBank, Hanover Insurance's
          <br />
          content management application.
        </Box>
      </Box>

      {/* Footer Section */}
    </Box>
  );
}
