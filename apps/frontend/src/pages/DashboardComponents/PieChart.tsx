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
            {
              id: 5,
              value: 10,
              label: "Business Ops Rating Team",
              color: "#509edd",
            },
            { id: 1, value: 10, label: "Underwriter", color: "#395176" },
            { id: 3, value: 10, label: "Actuarial Analyst", color: "#ba667b" },
            { id: 2, value: 10, label: "Admin", color: "#74414e" },
            { id: 4, value: 10, label: "EXL Operations", color: "#721b31" },
          ],
        },
      ]}
      width={200}
      height={200}
    />
  );
}
