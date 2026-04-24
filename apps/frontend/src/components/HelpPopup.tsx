import { useState } from "react";
import { IconButton, Popover, Typography, Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface HelpPopupProps {
  description: string;
}

export default function HelpPopup({ description }: HelpPopupProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        sx={{ color: "text.secondary" }}
        aria-label="Help"
      >
        <HelpOutlineIcon fontSize="medium" />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {description}
          </Typography>
        </Box>
      </Popover>
    </>
  );
}
