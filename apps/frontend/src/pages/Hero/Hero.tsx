import { Box } from "@mui/material";
import HeroSection from "./components/HeroSection.tsx";
import Footer from "../../components/Footer.tsx";

export default function Hero() {
  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        display: "block",
      }}
    >
      <HeroSection />
      <Footer />
    </Box>
  );
}
