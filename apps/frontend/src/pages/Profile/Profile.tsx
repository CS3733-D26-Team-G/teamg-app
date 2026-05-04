import * as React from "react";
import { useState } from "react";
import SearchBar from "../../features/dashboard/components/SearchBar.tsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import {
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import { getPositionLabel } from "../../utils/positionDisplay.ts";
import { EmployeeRecordSchema, type Department } from "../../types/employee.ts";
import { API_ENDPOINTS } from "../../config.ts";
import { useProfile } from "../../profile/ProfileContext.tsx";
import { useNotificationFilterToggle } from "../../features/notifications/components/NotificationsSettingsToggle.tsx";

function Profile() {
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

  const { hideEdits, toggleHideEdits } = useNotificationFilterToggle();
  const { hideExpiration, toggleHideExpiration } =
    useNotificationFilterToggle();

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
    <Card
      sx={{
        background:
          "linear-gradient(90deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
        overflow: "auto",
        minHeight: "100vh",
      }}
    >
      {/*Top Header Bar*/}
      <CardContent
        sx={{
          width: "100%",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 80,
            mt: 4,
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
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
              gap: 2,
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
          </Box>
        </Box>

        <Card
          sx={{
            width: "90",
            mx: "auto",
            mt: 2,
            borderRadius: 3,
            backgroundColor: "background.default",
            boxShadow: "none",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 3,
              minHeight: "81vh",
            }}
          >
            {/*Profile Tag Bar*/}
            <Box
              className="profile-info-section"
              sx={{
                display: "flex",
                alignItems: "center",
                height: 200,
                ...cardSx,
              }}
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
                      width: 160,
                      height: 160,
                      color: "grey.600",
                    }}
                  />
                </IconButton>
              </Box>

              <Stack gap={1}>
                <Typography
                  sx={{
                    fontSize: 38,
                    fontWeight: 500,
                    ml: 1,
                  }}
                >
                  {profile.firstName} {profile.lastName}
                </Typography>

                <Stack
                  direction="row"
                  gap={16}
                  sx={{ width: "100%", justifyContent: "space-evenly", pl: 3 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      color="black"
                      sx={{ fontSize: 14 }}
                    >
                      Role
                    </Typography>
                    <Typography fontWeight="bold">
                      {getPositionLabel(profile.position)}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      color="black"
                      sx={{ fontSize: 14 }}
                    >
                      Email
                    </Typography>
                    <Typography fontWeight="bold">
                      {profile.corporateEmail}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      color="black"
                      sx={{ fontSize: 14 }}
                    >
                      Phone
                    </Typography>
                    <Typography fontWeight="bold">
                      {profile.phoneNumber}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      color="black"
                      sx={{ fontSize: 14 }}
                    >
                      Date of Birth
                    </Typography>
                    <Typography fontWeight="bold">
                      {profile.dateOfBirth.toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>

            <Stack
              direction="row"
              gap={2}
              sx={{
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              {/*Notifications Card*/}
              <Box
                className="notification-settings"
                sx={{
                  display: "flex",
                  width: "65%",
                  height: 200,
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
                        pl: 2,
                        fontSize: 20,
                      }}
                    >
                      Hide Document Expiration Alerts
                    </Typography>
                    <Switch
                      checked={hideExpiration}
                      onChange={(e) => toggleHideExpiration()}
                      slotProps={{ input: { "aria-label": "controlled" } }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      pl: 2,
                      fontSize: 14,
                      mt: -0.75,
                    }}
                  >
                    Hide expiration notifications of documents I own
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
                        pl: 2,
                        fontSize: 20,
                      }}
                    >
                      Hide Document Edit Alerts
                    </Typography>
                    <Switch
                      checked={hideEdits}
                      onChange={(e) => toggleHideEdits()}
                      slotProps={{ input: { "aria-label": "controlled" } }}
                    />
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      pl: 2,
                      fontSize: 14,
                      mt: -0.75,
                    }}
                  >
                    Hide edit notifications for documents I own
                  </Typography>
                </Stack>
              </Box>

              {/*'Department Info' Card*/}
              <Box
                sx={{
                  display: "flex",
                  width: "35%",
                  height: 200,
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
                      pl: 2,
                      fontSize: 20,
                    }}
                  >
                    {deptLabels[profile.department as Department]}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.primary"
                    sx={{
                      pl: 2,
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
                      pl: 2,
                      fontSize: 16,
                      mt: 1,
                    }}
                  >
                    Member Since: {profile.startDate.toDateString()}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack
              direction="row"
              gap={2}
              sx={{
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              {/*'Security Card*/}
              <Box
                className="security-settings"
                sx={{
                  display: "flex",
                  width: "50%",
                  height: 200,
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

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Typography
                      sx={{
                        pl: 2,
                        fontSize: 18,
                      }}
                    >
                      Password last changed 4/2/2025
                    </Typography>

                    <Button variant="contained">Change Password</Button>
                  </Box>
                </Stack>
              </Box>

              {/*Preferences Card*/}
              <Box
                className="preference-settings"
                sx={{
                  display: "flex",
                  width: "50%",
                  height: 200,
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
                    Preferences
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

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
      </CardContent>
    </Card>
  );
}

export default Profile;
