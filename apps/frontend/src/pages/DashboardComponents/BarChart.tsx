import { ChartsContainer } from "@mui/x-charts/ChartsContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts";

const uData = [4000, 3000, 2000];
const xLabels = ["Available", "In Use", "Unavailable"];

function BarChart() {
  return (
    <ChartsContainer
      width={500}
      height={300}
      series={[{ data: uData, label: "uv", type: "bar" }]}
      xAxis={[
        {
          scaleType: "band",
          data: xLabels,
          colorMap: {
            type: "ordinal",
            values: xLabels,
            colors: ["#1A1E4B", "#395176", "#74414e"],
          },
        },
      ]}
    >
      <ChartsXAxis position="bottom" />
      <BarPlot />
    </ChartsContainer>
  );
}

export default BarChart;
