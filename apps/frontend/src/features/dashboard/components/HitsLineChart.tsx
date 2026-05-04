import { LineChart } from "@mui/x-charts/LineChart";
import { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useDashboardBootstrapQuery } from "../../../lib/activity-loaders";

interface EditHitsRow {
  date: string;
  UNDERWRITER?: number;
  BUSINESS_ANALYST?: number;
  ACTUARIAL_ANALYST?: number;
  EXL_OPERATIONS?: number;
  BUSINESS_OP_RATING?: number;
  ADMIN?: number;
}

function formatDateLabel(date: string) {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) {
    return date;
  }
  return `${Number(month)}/${Number(day)}`;
}

export default function HitsLineChart() {
  const [days, setDays] = useState<number | undefined>(7);
  const { data } = useDashboardBootstrapQuery({
    days,
  });
  const editHitsByRole = data?.editHitsByRole ?? [];

  return (
    <>
      <FormControl
        size="small"
        sx={{
          "minWidth": 160,
          "mb": 2,
          "& .MuiInputBase-root": { fontFamily: "inherit" },
          "& .MuiInputLabel-root": { fontFamily: "inherit" },
          "& .MuiMenuItem-root": { fontFamily: "inherit" },
        }}
      >
        <InputLabel id="edit-hits-range-label">Time Range</InputLabel>
        <Select
          labelId="edit-hits-range-label"
          value={days === undefined ? "all" : String(days)}
          label="Time Range"
          onChange={(event: SelectChangeEvent) => {
            const value = event.target.value;
            setDays(value === "all" ? undefined : Number(value));
          }}
        >
          <MenuItem value="7">Last 7 days</MenuItem>
          <MenuItem value="14">Last 14 days</MenuItem>
          <MenuItem value="30">Last 30 days</MenuItem>
          <MenuItem value="all">All time</MenuItem>
        </Select>
      </FormControl>

      <LineChart
        highlightedItem={null}
        height={320}
        margin={{ top: 16, right: 24, bottom: 24, left: 48 }}
        xAxis={[
          {
            scaleType: "point",
            data: editHitsByRole.map((row) => formatDateLabel(row.date)),
          },
        ]}
        series={[
          {
            data: editHitsByRole.map((row) => row.UNDERWRITER ?? 0),
            label: "Underwriter",
            color: "#395176",
            shape: "circle",
          },
          {
            data: editHitsByRole.map((row) => row.BUSINESS_ANALYST ?? 0),
            label: "Business Analyst",
            color: "#bea5aa",
            shape: "circle",
          },
          {
            data: editHitsByRole.map((row) => row.ACTUARIAL_ANALYST ?? 0),
            label: "Actuarial Analyst",
            color: "#ba667b",
            shape: "circle",
          },
          {
            data: editHitsByRole.map((row) => row.EXL_OPERATIONS ?? 0),
            label: "EXL Operations",
            color: "#721b31",
            shape: "circle",
          },
          {
            data: editHitsByRole.map((row) => row.BUSINESS_OP_RATING ?? 0),
            label: "Business Ops Rating",
            color: "#509edd",
            shape: "circle",
          },
          {
            data: editHitsByRole.map((row) => row.ADMIN ?? 0),
            label: "Admin",
            color: "#74414e",
            shape: "circle",
          },
        ]}
        grid={{ horizontal: true }}
        sx={{ width: "100%", mr: "auto" }}
      />
    </>
  );
}
