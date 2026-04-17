import { useState } from "react";
import DashboardRecentActivity from "./DashboardComponents/DashboardRecentActivity";
import SearchBar from "./DashboardComponents/SearchBar";
import PieChart from "./DashboardComponents/PieChart";
import BarChart from "./DashboardComponents/BarChart";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useAuth } from "../auth/AuthContext.tsx";

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");
  const { session } = useAuth();

  return (
    <Card className="flex flex-col h-auto min-h-[95vh] m-auto">
      <div
        className="flex justify-between items-center -mt-2 px-6 pb-4 -ml-8
      drop-shadow-lg"
      >
        <Typography
          variant="h2"
          component="h2"
        >
          Welcome Back {(session?.position ?? "employee").toLowerCase()}!
        </Typography>
        <div className="w-70 -mr-8">
          {" "}
          <SearchBar setSearchQuery={setSearchQuery} />
        </div>
      </div>
      <CardContent className="flex-1 -mr-8 -ml-8 -mt-7">
        <div className="flex justify-between gap-2 h-full items-start">
          <Card>
            <CardContent className="h-full">
              <div className="flex items-center justify-center h-full">
                <PieChart />
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 h-1/3 outline-1 drop-shadow-lg">
            <CardContent className="h-full place-items-center mr-5">
              <BarChart />
            </CardContent>
          </Card>
        </div>
        <div className="h-1/3">
          <DashboardRecentActivity />
        </div>
      </CardContent>
    </Card>
  );
}
// <Card className="h-[70%] min-h-[200px]">
//   <CardContent className="relative flex flex-col h-90%">
//     <div className="flex justify-between items-start gap-4">
//       <div className="flex-1">
//         <SearchBar setSearchQuery={setSearchQuery} />
//       </div>
//       <div className="bg-white">
//         <DashboardRecentActivity />
//       </div>
//     </div>
//
//     <div className="flex justify-center p-0">
//       <Card className="h-30vh">
//         <div>
//           <PieChart />
//         </div>
//       </Card>
//       <Card className="h-30vh">
//         <div>
//           <BarChart />
//         </div>
//       </Card>
//     </div>
//   </CardContent>
// </Card>
