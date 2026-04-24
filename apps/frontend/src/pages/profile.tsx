import * as React from "react";
import { useState } from "react";
import SearchBar from "./DashboardComponents/SearchBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import { getPositionLabel } from "../utils/positionDisplay.ts";
import { EmployeeRecordSchema, type Department } from "../types/employee.ts";
import { API_ENDPOINTS } from "../config.ts";
import { useProfile } from "../profile/ProfileContext.tsx";

function Profile() {
  const [_searchQuery, setSearchQuery] = useState("");
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const deptLabels: Record<Department, string> = {
    OPERATION_TECHNOLOGY: "Operation Technology",
    ACCOUNTING: "Accounting",
  };

  const [toggle1, setToggle1] = React.useState(true);
  const [toggle2, setToggle2] = React.useState(true);
  const [avatarPopUpOpen, setAvatarPopUpOpen] = React.useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = React.useState<string | null>(null);

  const { profile, isLoading, setProfile } = useProfile();

  const handleToggle1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggle1(event.target.checked);
  };

  const handleToggle2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggle2(event.target.checked);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;
    setFile(nextFile);
    setAvatarError(null);
  };

  const handleProfilePicClick = () => {
    setAvatarError(null);
    setAvatarPopUpOpen(true);
  };

  const handleSaveAvatar = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(API_ENDPOINTS.PROFILE.AVATAR, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        setAvatarError(data?.message ?? "Failed to upload avatar");
        return;
      }

      setProfile(EmployeeRecordSchema.parse(await res.json()));
      setAvatarPopUpOpen(false);
      setFile(null);
      setAvatarError(null);
    } catch (error) {
      console.error("Failed to upload new avatar:", error);
      setAvatarError("Failed to upload avatar");
    }
  };

  if (isLoading) {
    return <Typography>Loading profile...</Typography>;
  }

  if (!profile) {
    return <Typography>Failed to load profile.</Typography>;
  }

  const cardSx = {
    backgroundColor: "background.paper",
    border: "2px solid",
    borderColor: "divider",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
    borderRadius: 4,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.paper",
        overflow: "auto",
      }}
    >
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
            <IconButton onClick={handleProfilePicClick}>
              <Avatar
                src={profile.avatar ?? undefined}
                sx={{
                  width: 180,
                  height: 180,
                }}
              />
            </IconButton>
          </Box>

          <Stack>
            <Typography
              sx={{
                fontSize: 38,
                fontWeight: 500,
                lineHeight: 1.1,
                ml: -0.8,
              }}
            >
              {profile.first_name} {profile.last_name}
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {profile.corporate_email}
            </Typography>
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 500,
                mt: 0.5,
              }}
            >
              {getPositionLabel(profile.position)}
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
              <Typography fontWeight="bold">{profile.first_name}</Typography>
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
              <Typography fontWeight="bold">{profile.last_name}</Typography>
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
              <Typography fontWeight="bold">
                {profile.date_of_birth.toLocaleDateString()}
              </Typography>
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
              <Typography fontWeight="bold">{profile.phone_number}</Typography>
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
              <Typography fontWeight="bold">
                {profile.corporate_email}
              </Typography>
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
              <Typography fontWeight="bold">
                {getPositionLabel(profile.position)}
              </Typography>
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

        {/*'Department Info' Card*/}
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
              Department
            </Typography>

            <Typography
              sx={{
                pl: 1,
                fontSize: 20,
              }}
            >
              {deptLabels[profile.department as Department]}
            </Typography>

            <Typography
              variant="caption"
              color="text.primary"
              sx={{
                pl: 1,
                fontSize: 16,
                mt: 1,
              }}
            >
              Supervisor: {profile.supervisor}
            </Typography>

            <Typography
              variant="caption"
              color="text.primary"
              sx={{
                pl: 1,
                fontSize: 16,
                mt: 1,
              }}
            >
              Member Since: {profile.start_date.toDateString()}
            </Typography>
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

      <Dialog
        open={avatarPopUpOpen}
        onClose={() => setAvatarPopUpOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              "display": "block",
              "border": "1px solid rgba(0, 0, 0, 0.23)",
              "borderRadius": "5px",
              "p": 3.5,
              "px": 10,
              "textAlign": "center",
              "my": 1,
              "cursor": "pointer",
              "&:hover": { borderColor: "rgba(0, 0, 0, 0.87)" },
            }}
            component="label"
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
            <Typography color="textSecondary">
              {file ? `Selected: ${file.name}` : "Click to upload local file"}
            </Typography>
            {!file && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Leave this empty to keep the current uploaded file.
              </Typography>
            )}
          </Box>
          {avatarError && (
            <Typography
              color="error"
              sx={{ mt: 1 }}
            >
              {avatarError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAvatarPopUpOpen(false);
              setAvatarError(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!file}
            onClick={() => {
              void handleSaveAvatar();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;
