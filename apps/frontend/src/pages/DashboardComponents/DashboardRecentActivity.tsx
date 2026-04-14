import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography } from "@mui/material";

import "./dashboard.css";

export default function DashboardRecentActivity() {
  return (
    <Card
      className="recent-activity"
      sx={{
        minWidth: "400px",
        maxWidth: "800px",
        minHeight: "40vh",
      }}
    >
      <CardContent className="recent-activity-content">
        <div className="recent-activity-tag">
          <Typography>Recent Activity</Typography>
        </div>
        <Typography className="recent-activity-main">
          <h3>Today</h3>
          <ul>
            <li>Colin edited XXXX</li>
            <li>Jillian edited 'Hanover Home Page'</li>
          </ul>
          <h3>Yesterday</h3>
          <ul>
            <li>Myer published 'Dangers of Student Drivers'</li>
            <li>Sam edited 'Dummy Databases'</li>
          </ul>
        </Typography>
      </CardContent>
    </Card>
  );
}
