import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { VisibilityIdentifierWithType } from "@mui/x-charts/plugins";

const data = [
  { value: 10, label: "Underwriter", color: "#1A1E4B" },
  { value: 15, label: "Business Analyst", color: "#395176" },
  { value: 20, label: "Admins", color: "#74414e" },
];

export default function ControlledVisibility() {
  const [hiddenItems, setHiddenItems] = React.useState<
    VisibilityIdentifierWithType<"pie">[]
  >([{ type: "pie", seriesId: "custom", dataIndex: 0 }]);

  const handleShowAll = () => {
    setHiddenItems([]);
  };

  const handleShowOnlyMine = () => {
    setHiddenItems([
      { type: "pie", seriesId: "custom", dataIndex: 1 },
      { type: "pie", seriesId: "custom", dataIndex: 2 },
    ]);
  };

  const handleToggleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: string | null,
  ) => {
    if (newValue === "all") {
      handleShowAll();
    } else if (newValue === "onlyUnder") {
      handleShowOnlyMine();
    }
  };

  const getCurrentValue = () => {
    const allVisible = hiddenItems.length === 0;
    const allHidden = hiddenItems.length === data.length;
    const onlyMineVisible =
      hiddenItems.length === 2 &&
      hiddenItems[0].dataIndex === 1 &&
      hiddenItems[1].dataIndex === 2;

    if (allVisible) {
      return "all";
    }
    if (allHidden) {
      return "none";
    }
    if (onlyMineVisible) {
      return "onlyMine";
    }
    return null;
  };

  return (
    <Stack spacing={2}>
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Forms</FormLabel>
        {/*<ToggleButtonGroup*/}
        {/*  value={getCurrentValue()}*/}
        {/*  exclusive*/}
        {/*  onChange={handleToggleChange}*/}
        {/*  aria-label="highlight control"*/}
        {/*  size="small"*/}
        {/*>*/}
        {/*  <ToggleButton*/}
        {/*    value="all"*/}
        {/*    aria-label="show all nodes"*/}
        {/*  >*/}
        {/*    Show All*/}
        {/*  </ToggleButton>*/}
        {/*  <ToggleButton*/}
        {/*    value="none"*/}
        {/*    aria-label="show no nodes"*/}
        {/*  >*/}
        {/*    Hide All*/}
        {/*  </ToggleButton>*/}
        {/*  <ToggleButton*/}
        {/*    value="onlyMine"*/}
        {/*    aria-label="show only Mine"*/}
        {/*  >*/}
        {/*    My Forms*/}
        {/*  </ToggleButton>*/}
        {/*</ToggleButtonGroup>*/}
      </FormControl>
      <PieChart
        series={[{ id: "custom", data }]}
        height={200}
        width={200}
        hiddenItems={hiddenItems}
        slotProps={{
          legend: {
            toggleVisibilityOnClick: true,
          },
        }}
        onHiddenItemsChange={(newIdentifiers) => setHiddenItems(newIdentifiers)}
      />
    </Stack>
  );
}
