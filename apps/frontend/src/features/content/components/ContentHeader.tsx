import { useState } from "react";
import { Box, Toolbar, AppBar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import HeaderSearchBar from "./HeaderSearchBar";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  minHeight: 128,
}));

interface ContentHeaderProps {
  onOpenCreate: () => void;
}

export default function ContentHeader({ onOpenCreate }: ContentHeaderProps) {
  const [_searchQuery, setSearchQuery] = useState("");

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "white", zIndex: "-1" }}>
      <AppBar position="relative">
        <StyledToolbar>
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Typography
              variant="h4"
              noWrap
              component="div"
              sx={{ paddingBottom: "2rem", paddingTop: "3rem", color: "black" }}
            >
              Content Management
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ flexGrow: 1, maxWidth: "70%" }}>
              <HeaderSearchBar setSearchQuery={setSearchQuery} />
            </Box>

            <Box>
              <Button
                onClick={onOpenCreate}
                variant="outlined"
                startIcon={<AddIcon />}
              >
                New Content
              </Button>
            </Box>
          </Box>
        </StyledToolbar>
      </AppBar>
    </Box>
  );
}
