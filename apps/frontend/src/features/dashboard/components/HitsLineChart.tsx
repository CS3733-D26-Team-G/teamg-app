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

function formatDateLabel(date: string) {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) {
    return date;
  }
  return `${Number(month)}/${Number(day)}`;
}

const MOCK_EDIT_HITS_BY_ROLE: EditHitsRow[] = [
  {
    date: "2026-04-22",
    UNDERWRITER: 6,
    BUSINESS_ANALYST: 4,
    ACTUARIAL_ANALYST: 2,
    EXL_OPERATIONS: 1,
    BUSINESS_OP_RATING: 3,
    ADMIN: 1,
  },
  {
    date: "2026-04-23",
    UNDERWRITER: 8,
    BUSINESS_ANALYST: 5,
    ACTUARIAL_ANALYST: 3,
    EXL_OPERATIONS: 2,
    BUSINESS_OP_RATING: 4,
    ADMIN: 1,
  },
  {
    date: "2026-04-24",
    UNDERWRITER: 5,
    BUSINESS_ANALYST: 6,
    ACTUARIAL_ANALYST: 4,
    EXL_OPERATIONS: 2,
    BUSINESS_OP_RATING: 3,
    ADMIN: 2,
  },
  {
    date: "2026-04-25",
    UNDERWRITER: 9,
    BUSINESS_ANALYST: 4,
    ACTUARIAL_ANALYST: 5,
    EXL_OPERATIONS: 3,
    BUSINESS_OP_RATING: 2,
    ADMIN: 1,
  },
  {
    date: "2026-04-26",
    UNDERWRITER: 7,
    BUSINESS_ANALYST: 5,
    ACTUARIAL_ANALYST: 3,
    EXL_OPERATIONS: 2,
    BUSINESS_OP_RATING: 4,
    ADMIN: 2,
  },
];

export default function HitsLineChart() {
  return (
    <LineChart
      height={320}
      margin={{ top: 16, right: 24, bottom: 24, left: 48 }}
      xAxis={[
        {
          scaleType: "point",
          data: MOCK_EDIT_HITS_BY_ROLE.map((row) => formatDateLabel(row.date)),
        },
      ]}
      series={[
        {
          data: MOCK_EDIT_HITS_BY_ROLE.map((row) => row.UNDERWRITER ?? 0),
          label: "Underwriter",
          color: "#395176",
        },
        {
          data: MOCK_EDIT_HITS_BY_ROLE.map((row) => row.BUSINESS_ANALYST ?? 0),
          label: "Business Analyst",
          color: "#bea5aa",
        },
        {
          data: MOCK_EDIT_HITS_BY_ROLE.map((row) => row.ACTUARIAL_ANALYST ?? 0),
          label: "Actuarial Analyst",
          color: "#ba667b",
        },
        {
          data: MOCK_EDIT_HITS_BY_ROLE.map((row) => row.EXL_OPERATIONS ?? 0),
          label: "EXL Operations",
          color: "#721b31",
        },
        {
          data: MOCK_EDIT_HITS_BY_ROLE.map(
            (row) => row.BUSINESS_OP_RATING ?? 0,
          ),
          label: "Business Ops Rating",
          color: "#509edd",
        },
        {
          data: MOCK_EDIT_HITS_BY_ROLE.map((row) => row.ADMIN ?? 0),
          label: "Admin",
          color: "#74414e",
        },
      ]}
      grid={{ horizontal: true }}
      sx={{ width: "100%", mr: "auto" }}
    />
  );
}
