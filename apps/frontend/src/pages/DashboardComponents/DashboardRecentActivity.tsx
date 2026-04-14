import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";

import { Co2 } from "@mui/icons-material";

export default function DashboardRecentActivity() {
  return (
    <Card
      className="max-h-200px min-w-500px right-[20%]
     outline-gray-200 outline-1 drop-shadow-lg"
    >
      <CardContent className="p=0 -mt-8 text-left max-h-270px">
        <CardHeader
          title={<Typography variant="h3">Recent Activity</Typography>}
        />
        <Divider />
        <div className="pb-1 pt-3 pr-5 pl-5">
          <Typography
            variant="h3"
            component="h3"
            className="pb-1"
          >
            Today
          </Typography>
          <Typography
            variant="body1"
            component="div"
          >
            <ul>
              <li>Colin edited XXXX</li>
              <li>Jillian edited 'Hanover Home Page'</li>
            </ul>
          </Typography>

          <Typography
            variant="h3"
            component="h3"
            className="pb-1, pt-1"
          >
            Yesterday
          </Typography>

          <Typography
            variant="body1"
            component="div"
          >
            <ul>
              <li>Myer published 'Dangers of Student Drivers'</li>
              <li>Sam edited 'Dummy Databases'</li>
            </ul>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
