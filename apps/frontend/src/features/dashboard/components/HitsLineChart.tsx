import { LineChart } from "@mui/x-charts/LineChart";
import { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useAuth } from "../../../auth/AuthContext";
import { getPositionLabel } from "../../../utils/positionDisplay";
import { useDashboardBootstrapQuery } from "../../../lib/activity-loaders";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [days, setDays] = useState<number | undefined>(7);
  const { session } = useAuth();
  const isAdmin = session?.position === "ADMIN";
  const { t } = useTranslation();

  const { data } = useDashboardBootstrapQuery({
    days,
  });
  const editHitsByRole = data?.editHitsByRole ?? [];
  const ROLE_KEYS = [
    "UNDERWRITER",
    "BUSINESS_ANALYST",
    "ACTUARIAL_ANALYST",
    "EXL_OPERATIONS",
    "BUSINESS_OP_RATING",
    "ADMIN",
  ] as const;

  const ROLE_COLORS: Record<string, string> = {
    UNDERWRITER: "#395176",
    BUSINESS_ANALYST: "#bea5aa",
    ACTUARIAL_ANALYST: "#ba667b",
    EXL_OPERATIONS: "#721b31",
    BUSINESS_OP_RATING: "#509edd",
    ADMIN: "#74414e",
  };
  const visibleRoles =
    isAdmin ? ROLE_KEYS
    : session?.position ? [session.position]
    : [];

  const series = visibleRoles.map((role) => ({
    data: editHitsByRole.map((row) => row[role] ?? 0),
    label: getPositionLabel(role, t),
    color: ROLE_COLORS[role],
    shape: "circle" as const,
  }));

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
        <InputLabel id="edit-hits-range-label">
          {t("hitsLineChart.timeRange")}
        </InputLabel>
        <Select
          labelId="edit-hits-range-label"
          value={days === undefined ? "all" : String(days)}
          label="Time Range"
          onChange={(event: SelectChangeEvent) => {
            const value = event.target.value;
            setDays(value === "all" ? undefined : Number(value));
          }}
        >
          <MenuItem value="7">{t("hitsLineChart.last7Days")}</MenuItem>
          <MenuItem value="14">{t("hitsLineChart.last14Days")}</MenuItem>
          <MenuItem value="30">{t("hitsLineChart.last30Days")}</MenuItem>
          <MenuItem value="all">{t("hitsLineChart.allTime")}</MenuItem>
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
        series={series}
        grid={{ horizontal: true }}
        sx={{ width: "100%", mr: "auto" }}
      />
    </>
  );
}
