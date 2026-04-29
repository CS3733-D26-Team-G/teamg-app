import { PieChart } from "@mui/x-charts/PieChart";
interface PieSlice {
  id: number;
  value: number;
  label: string;
  color: string;
}

interface PieProps {
  data: PieSlice[];
}

export default function BasicPie({ data }: PieProps) {
  return (
    <PieChart
      series={[
        {
          innerRadius: 60,
          outerRadius: 100,
          highlightScope: { fade: "global", highlight: "item" },
          data,
        },
      ]}
      width={200}
      height={200}
    />
  );
}
