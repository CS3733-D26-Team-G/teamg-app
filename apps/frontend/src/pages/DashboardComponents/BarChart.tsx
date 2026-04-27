import { BarChart } from "@mui/x-charts/BarChart";
/* import { ChartsContainer } from "@mui/x-charts/ChartsContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis"; */

interface ChartTypes {
  type: string;
  count: number;
}

interface ChartProps {
  data: ChartTypes[];
}

export default function TypeBarChart({ data }: ChartProps) {
  return (
    <BarChart
      width={600}
      height={280}
      xAxis={[{ scaleType: "band", data: data.map((item) => item.type) }]}
      series={[
        {
          data: data.map((item) => item.count),
          label: "Files",
          color: "#395176",
        },
      ]}
    />
  );
}
