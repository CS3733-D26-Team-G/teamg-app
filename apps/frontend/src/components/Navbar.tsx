import { Link } from "react-router";
import { AppBar, Toolbar, Typography, Stack, Button } from "@mui/material";

function Navbar() {
  return (
    <AppBar position={"static"}>
      <Toolbar>
        <Typography
          variant={"h6"}
          component={"div"}
          sx={{ flexGrow: 1 }}
        >
          Hanover Insurance
        </Typography>
        <Stack
          direction={"row"}
          spacing={2}
        >
          <Button
            color={"inherit"}
            component={Link}
            to={"/dashboard"}
          >
            Dashboard
          </Button>
          <Button
            color={"inherit"}
            component={Link}
            to={"/content"}
          >
            Content Form
          </Button>
          <Button
            color={"inherit"}
            component={Link}
            to={"/employees"}
          >
            Employee Form
          </Button>
          <Button
            color={"inherit"}
            component={Link}
            to={"/underwriter"}
          >
            Underwriter Portal
          </Button>
          <Button
            color={"inherit"}
            component={Link}
            to={"/analyst"}
          >
            Business Analyst Portal
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
