import { useState } from "react";
import * as React from "react";
import SearchBar from "./DashboardComponents/SearchBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { Grid } from "@mui/material";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import { useAuth } from "../auth/AuthContext.tsx";

function Profile() {
  const [_searchQuery, setSearchQuery] = useState("");
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const [toggle1, setToggle1] = React.useState(true);
  const [toggle2, setToggle2] = React.useState(true);

  const handleToggle1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggle1(event.target.checked);
  };

  const handleToggle2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggle2(event.target.checked);
  };

  const cardSx = {
    backgroundColor: "background.paper",
    border: "2px solid",
    borderColor: "divider",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
    borderRadius: 4,
  };

  return (
    <div className={"Profile-Page"}>
      <Box>
        {/*Top Header Bar*/}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "90%",
            height: 80,
            mx: "auto",
            backgroundColor: "primary.main",
            mt: 4,
            borderRadius: 4,
          }}
        >
          {/*'My Account text in header'*/}
          <Typography
            sx={{
              color: "primary.contrastText",
              p: 2,
              fontSize: 30,
            }}
          >
            My Account
          </Typography>

          {/*All components on the right side of the header bar*/}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              p: 2,
            }}
          >
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.contrastText",
                fontSize: 16,
              }}
            >
              {formattedDate}
            </Typography>
            <IconButton
              sx={{
                color: "primary.contrastText",
              }}
            >
              <NotificationsIcon />
            </IconButton>
            <SearchBar setSearchQuery={setSearchQuery}></SearchBar>
          </Box>
        </Box>

        {/*Profile Tag Bar*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "90%",
            height: 200,
            mx: "auto",
            mt: 2,
            ...cardSx,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
          >
            <Box
              sx={{
                pl: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 180,
                  height: 180,
                }}
              />
            </Box>
            <Stack>
              <Typography
                sx={{
                  fontSize: 48,
                  fontWeight: 500,
                  lineHeight: 1.1,
                  ml: -0.8,
                }}
              >
                Colin Truong
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                cptruong@wpi.edu
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                Business Analyst
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/*Personal Info Card*/}
        <Box
          sx={{
            display: "flex",
            width: "90%",
            height: 225,
            mx: "auto",
            mt: 2,
            ...cardSx,
          }}
        >
          <Stack sx={{ width: "100%" }}>
            <Typography
              sx={{
                fontSize: 32,
                pl: 1.6,
                pt: 0.5,
                pb: 0.3,
              }}
            >
              Personal Information
            </Typography>
            <Grid
              container
              sx={{ mb: 2 }}
            >
              <Grid
                size={4}
                sx={{ textAlign: "center" }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  First Name
                </Typography>
                <Typography fontWeight="bold">Colin</Typography>
              </Grid>
              <Grid
                size={4}
                sx={{ textAlign: "center" }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Last Name
                </Typography>
                <Typography fontWeight="bold">Truong</Typography>
              </Grid>
              <Grid
                size={4}
                sx={{ textAlign: "center" }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Date of Birth
                </Typography>
                <Typography fontWeight="bold">04/12/2006</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                size={4}
                sx={{ textAlign: "center" }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Phone
                </Typography>
                <Typography fontWeight="bold">123-456-7890</Typography>
              </Grid>
              <Grid
                size={4}
                sx={{ textAlign: "center" }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Email
                </Typography>
                <Typography fontWeight="bold">cptruong@wpi.edu</Typography>
              </Grid>
              <Grid
                size={4}
                sx={{ textAlign: "center" }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  User Role
                </Typography>
                <Typography fontWeight="bold">Business Analyst</Typography>
              </Grid>
            </Grid>
          </Stack>
        </Box>

        <Stack direction={"row"}>
          {/*Notifications Card*/}
          <Box
            sx={{
              display: "flex",
              width: "32%",
              height: 215,
              marginLeft: "4.8%",
              mt: 2,
              ...cardSx,
            }}
          >
            <Stack sx={{ width: "96%" }}>
              <Typography
                sx={{
                  fontSize: 32,
                  pl: 1.6,
                  pt: 0.3,
                  pb: 0.3,
                }}
              >
                Notifications
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    pl: 1,
                    fontSize: 20,
                  }}
                >
                  Document Expiration Alerts
                </Typography>
                <Switch
                  checked={toggle1}
                  onChange={handleToggle1}
                  slotProps={{ input: { "aria-label": "controlled" } }}
                />
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  pl: 1,
                  fontSize: 14,
                  mt: -1.3,
                }}
              >
                Notify me when a document I own is expiring
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1.5,
                }}
              >
                <Typography
                  sx={{
                    pl: 1,
                    fontSize: 20,
                  }}
                >
                  Document Change Alerts
                </Typography>
                <Switch
                  checked={toggle2}
                  onChange={handleToggle2}
                  slotProps={{ input: { "aria-label": "controlled" } }}
                />
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  pl: 1,
                  fontSize: 14,
                  mt: -1.3,
                }}
              >
                Notify me when a document I follow is updated
              </Typography>
            </Stack>
          </Box>

          {/*'My Portal' Card*/}
          <Box
            sx={{
              display: "flex",
              width: "27.9%",
              height: 215,
              mt: 2,
              ml: 1.5,
              ...cardSx,
            }}
          >
            <Stack sx={{ width: "100%" }}>
              <Typography
                sx={{
                  fontSize: 32,
                  pl: 1.6,
                  pt: 0.3,
                  pb: 0.4,
                }}
              >
                My Portal
              </Typography>

              <Typography
                sx={{
                  pl: 1,
                  fontSize: 20,
                }}
              >
                Business Analyst Portal
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  pl: 1,
                  fontSize: 14,
                  mt: -0.8,
                }}
              >
                Your role-based tools and resources
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 2, alignSelf: "center" }}
              >
                Go To Portal
              </Button>
            </Stack>
          </Box>

          {/*'Security Card*/}
          <Box
            sx={{
              display: "flex",
              width: "27.9%",
              height: 215,
              mt: 2,
              ml: 1.5,
              ...cardSx,
            }}
          >
            <Stack sx={{ width: "100%" }}>
              <Typography
                sx={{
                  fontSize: 32,
                  pl: 1.6,
                  pt: 0.3,
                  pb: 0.4,
                }}
              >
                Security
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  pl: 1,
                  fontSize: 20,
                }}
              >
                Password: ••••••••••••
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 2, alignSelf: "center" }}
              >
                Change Password
              </Button>

              <Typography
                variant="caption"
                color="text.primary"
                sx={{
                  pl: 1,
                  fontSize: 14,
                  mt: 5,
                }}
              >
                Last Login: Today at 8:42 AM
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </div>
  );
}

export default Profile;
