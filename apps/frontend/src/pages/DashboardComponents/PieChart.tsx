import { PieChart } from "@mui/x-charts/PieChart";

export default function BasicPie() {
  return (
    <PieChart
      series={[
        {
          innerRadius: 60,
          outerRadius: 100,
          highlightScope: { fade: "global", highlight: "item" },
          data: [
            { id: 0, value: 10, label: "Business Analyst", color: "#bea5aa" },
            { id: 1, value: 15, label: "Underwriter", color: "#395176" },
            { id: 2, value: 20, label: "Admin", color: "#74414e" },
          ],
        },
      ]}
      width={200}
      height={200}
    />
  );
}
