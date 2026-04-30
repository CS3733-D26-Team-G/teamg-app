import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HanoverVols from "../../../assets/HanoverVols.png";
import HanoverCarousel1 from "../../../assets/HanoverCarousel1.jpg";
import HanoverCarousel2 from "../../../assets/HanoverCarousel2.webp";

const carouselImages = [HanoverVols, HanoverCarousel1, HanoverCarousel2];

interface CarouselBackgroundProps {
  children: ReactNode;
}

export default function CarouselBackground({
  children,
}: CarouselBackgroundProps) {
  const [current, setCurrent] = useState(0);

  /* Change image in carousel every 8 seconds */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const prev = () =>
    setCurrent((c) => (c - 1 + carouselImages.length) % carouselImages.length);
  const next = () => setCurrent((c) => (c + 1) % carouselImages.length);

  return (
    <Box
      className="relative flex flex-col"
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {carouselImages.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "top left",
            backgroundRepeat: "no-repeat",
            opacity: index === current ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
            zIndex: 0,
          }}
        />
      ))}

      {/* Arrows to control carousel */}
      <IconButton
        onClick={prev}
        size="small"
        sx={{
          "position": "absolute",
          "left": 16,
          "top": "50%",
          "transform": "translateY(-50%)",
          "zIndex": 20,
          "color": "white",
          "backgroundColor": "rgba(0,0,0,0.35)",
          "width": 32,
          "height": 32,
          "borderRadius": "50%",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
        }}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <IconButton
        onClick={next}
        size="small"
        sx={{
          "position": "absolute",
          "right": 16,
          "top": "50%",
          "transform": "translateY(-50%)",
          "zIndex": 20,
          "color": "white",
          "backgroundColor": "rgba(0,0,0,0.35)",
          "width": 32,
          "height": 32,
          "borderRadius": "50%",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
        }}
      >
        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {/* Dot indicators */}
      <Box className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {carouselImages.map((_, i) => (
          <Box
            key={i}
            onClick={() => setCurrent(i)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: i === current ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
