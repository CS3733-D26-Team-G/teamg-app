import { ChartsContainer } from "@mui/x-charts/ChartsContainer";
import { BarPlot } from "@mui/x-charts/BarChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";

const uData = [4000, 3000, 2000];
const xLabels = ["Available", "In Use", "Unavailable"];

function BarChart() {
  return (
    <ChartsContainer
      width={500}
      height={200}
      series={[{ data: uData, label: "uv", type: "bar" }]}
      xAxis={[
        {
          id: "my-x-axis",
          scaleType: "band",
          data: xLabels,
          colorMap: {
            type: "ordinal",
            values: xLabels,
            colors: ["#bea5aa", "#395176", "#74414e"],
          },
        },
      ]}
    >
      <ChartsXAxis />
      <BarPlot />
    </ChartsContainer>
  );
}

export default BarChart;
