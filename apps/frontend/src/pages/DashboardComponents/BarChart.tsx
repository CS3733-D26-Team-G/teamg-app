import { BarChart } from "@mui/x-charts/BarChart";

interface ChartTypes {
  type: string;
  count: number;
}

interface ChartProps {
  data: ChartTypes[];
}

const FILE_TYPE_ORDER = ["pdf", "json", "png", "docx", "xlsx", "ppt"] as const;
const FILE_TYPE_COLORS = [
  "#395176",
  "#509edd",
  "#ba667b",
  "#bea5aa",
  "#721b31",
  "#74414e",
];
function normalizeFileType(
  type: string,
): (typeof FILE_TYPE_ORDER)[number] | null {
  const normalized = type.trim().toLowerCase();
  if (normalized.includes("pdf")) return "pdf";
  if (normalized.includes("json")) return "json";
  if (normalized.includes("png")) return "png";
  if (normalized.includes("docx") || normalized.includes("wordprocessingml")) {
    return "docx";
  }
  if (normalized.includes("xlsx") || normalized.includes("spreadsheetml")) {
    return "xlsx";
  }
  if (
    normalized.includes("ppt") ||
    normalized.includes("pptx") ||
    normalized.includes("presentationml")
  ) {
    return "ppt";
  }
  return null;
}

export default function TypeBarChart({ data }: ChartProps) {
  const totals = FILE_TYPE_ORDER.reduce<
    Record<(typeof FILE_TYPE_ORDER)[number], number>
  >(
    (acc, fileType) => {
      acc[fileType] = 0;
      return acc;
    },
    {
      pdf: 0,
      json: 0,
      png: 0,
      docx: 0,
      xlsx: 0,
      ppt: 0,
    },
  );
  for (const item of data) {
    const normalizedType = normalizeFileType(item.type);

    if (normalizedType) {
      totals[normalizedType] += item.count;
    }
  }
  const chartData = FILE_TYPE_ORDER.map((type) => ({
    type,
    count: totals[type],
  }));

  return (
    <BarChart
      dataset={chartData}
      height={240}
      margin={{ top: 16, right: 16, bottom: 24, left: 40 }}
      xAxis={[
        {
          scaleType: "band",
          dataKey: "type",
          colorMap: {
            type: "ordinal",
            values: [20, 15, 30, 40, 20, 13],
            colors: FILE_TYPE_COLORS,
          },
        },
      ]}
      series={[
        {
          dataKey: "count",
          label: "Files",
          valueFormatter: (value) => `${value ?? 0}`,
        },
      ]}
      hideLegend
      grid={{ horizontal: true }}
      borderRadius={6}
      sx={{ width: "100%" }}
    />
  );
}
