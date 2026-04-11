import HanoverLogoWhite from "../assets/HanoverLogoWhite.png";
import HanoverVols from "../assets/HanoverVols.png";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Box, Button } from "@mui/material";
import theme from "../theme.tsx";
import { Alert, Collapse, AlertTitle } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function HeroSection() {
  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleLoginClick = () => {
    navigate("/login"); // 3. Define where to go (matches your route path)
  };

  const [disclaimerOpen, setDisclaimerOpen] = useState(true);

  return (
    <Box
      className="relative flex flex-col min-h-screen overflow-hidden"
      sx={{
        backgroundImage: `url(${HanoverVols})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay so text stays readable */}
      <Box
        className="absolute inset-0"
        sx={{ background: "rgba(0,0,0,0.45)" }}
      />

      {/* Top bar */}
      <Box className="relative flex items-center justify-between px-7 py-4">
        <Box>
          <img
            src={HanoverLogoWhite}
            alt="White Hanover Logo"
            className="w-[80px] h-auto"
          />
        </Box>

        {/* Login button */}
        <Button
          onClick={() => navigate("/login")}
          sx={{
            "background": "#e6dfd2",
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

      <Collapse in={disclaimerOpen}>
        <Alert
          severity="info"
          icon={<InfoIcon sx={{ color: "white" }} />}
          onClose={() => setDisclaimerOpen(false)}
          sx={{
            "backgroundColor": "#1A1E4B !important",
            "textColor": "white !important",
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

      {/* CARE text */}
      <Box
        className="relative flex flex-col flex-1 justify-center"
        sx={{ fontFamily: theme.typography.fontFamily, color: "white" }}
      >
        {[
          { letter: "C", word: "ollaboration", indent: "pl-20" },
          { letter: "A", word: "ccountability", indent: "pl-24" },
          { letter: "R", word: "espect", indent: "pl-28" },
          { letter: "E", word: "mpowerment", indent: "pl-32" },
        ].map(({ letter, word, indent }) => (
          <Box
            key={letter}
            className={`${indent} my-1`}
            sx={{
              fontSize: "clamp(48px, 3vw, 64px)",
              fontWeight: 500,
              lineHeight: 1.25,
            }}
          >
            <Box
              component="span"
              sx={{ fontSize: "clamp(64px, 4vw, 80px)", fontWeight: 900 }}
            >
              {letter}
            </Box>
            {word}
          </Box>
        ))}

        <Box
          className="mt-4 pl-20"
          sx={{ fontSize: 26, color: "white", fontFamily: theme.typography.h2 }}
        >
          Welcome to iBank, Hanover Insurance's content management application.
          Please log in to get started!
        </Box>
      </Box>
    </Box>
  );
}
