import { Box, Typography, Stack } from "@mui/material";
import ActivityTimeline from "./ActivityTimeline";
import { activityData } from "./activityData";
import { useState } from "react";
import SearchBar from "./HeaderSearchBar";

export default function ActivityComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Box>
      <SearchBar setSearchQuery={setSearchQuery}></SearchBar>
      <ActivityTimeline data={activityData}></ActivityTimeline>
    </Box>
  );
}
