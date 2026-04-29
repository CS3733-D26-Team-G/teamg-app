import { LineChart } from "@mui/x-charts/LineChart";

interface EditHitsRow {
  date: string;
  UNDERWRITER?: number;
  BUSINESS_ANALYST?: number;
  ACTUARIAL_ANALYST?: number;
  EXL_OPERATIONS?: number;
  BUSINESS_OP_RATING?: number;
  ADMIN?: number;
}

interface EditHitsLineChartProps {
  data: EditHitsRow[];
}

function formatDateLabel(date: string) {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) {
    return date;
  }
  return `${Number(month)}/${Number(day)}`;
}
export default function HitsLineChart({ data }: EditHitsLineChartProps) {
  return (
    <LineChart
      height={320}
      margin={{ top: 16, right: 24, bottom: 24, left: 48 }}
      xAxis={[
        {
          scaleType: "point",
          data: data.map((row) => formatDateLabel(row.date)),
        },
      ]}
      series={[
        {
          data: data.map((row) => row.UNDERWRITER ?? 0),
          label: "Underwriter",
          color: "#395176",
        },
        {
          data: data.map((row) => row.BUSINESS_ANALYST ?? 0),
          label: "Business Analyst",
          color: "#bea5aa",
        },
        {
          data: data.map((row) => row.ACTUARIAL_ANALYST ?? 0),
          label: "Actuarial Analyst",
          color: "#ba667b",
        },
        {
          data: data.map((row) => row.EXL_OPERATIONS ?? 0),
          label: "EXL Operations",
          color: "#721b31",
        },
        {
          data: data.map((row) => row.BUSINESS_OP_RATING ?? 0),
          label: "Business Ops Rating",
          color: "#509edd",
        },
        {
          data: data.map((row) => row.ADMIN ?? 0),
          label: "Admin",
          color: "#74414e",
        },
      ]}
      grid={{ horizontal: true }}
      sx={{ width: "100%", mr: "auto" }}
    />
  );
}
