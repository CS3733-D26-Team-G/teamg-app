import * as React from "react";
import { useState } from "react";
import { useThemeMode } from "../../ThemeContext.tsx";
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
  TextField,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import { getPositionLabel } from "../../utils/positionDisplay.ts";
import { EmployeeRecordSchema, type Department } from "../../types/employee.ts";
import { API_ENDPOINTS } from "../../config.ts";
import { useProfile } from "../../profile/ProfileContext.tsx";
import { useTutorial } from "../../components/Tutorial/TutorialContext.tsx";
import { useNotificationFilterToggle } from "../../features/notifications/components/NotificationsSettingsToggle.tsx";
import { useNavigate } from "react-router-dom";
import { useActivityQuery } from "../../lib/activity-loaders.ts";
import { useMemo } from "react";
import { useAuth } from "../../auth/AuthContext.tsx";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SchoolIcon from "@mui/icons-material/School";

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
  const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  const { profile, isLoading, setProfile } = useProfile();
  const { isDarkMode, isSaving, toggleDarkMode } = useThemeMode();
  const { resetTours, triggerPrompt } = useTutorial();
  const navigate = useNavigate();
  const activityQuery = useActivityQuery("auth");
  const { session } = useAuth();

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

  const handleRestartTour = () => {
    resetTours();
    setTimeout(() => {
      triggerPrompt(true);
    }, 100);
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

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      const res = await fetch(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        setPasswordError(data?.message ?? "Failed to upload change password");
        return;
      }

      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setChangePasswordOpen(false), 1500);
    } catch {
      setPasswordError("Failed to change password");
    }
  };

  const recentLogins = useMemo(() => {
    return (activityQuery.data ?? [])
      .filter((row: any) => row.employeeUuid === session?.employeeUuid)
      .slice(0, 3)
      .map((row: any) => {
        const date = new Date(row.timestamp);
        return (
          date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          }) +
          " at " +
          date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      });
  }, [activityQuery.data, session?.employeeUuid]);

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
                    color="text.secondary"
                    sx={{
                      pl: 2,
                      fontSize: 16,
                      mt: -0.75,
                    }}
                  >
                    Hide notifications that remind me when documents I own have
                    expired
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
                    color="text.secondary"
                    sx={{
                      pl: 2,
                      fontSize: 16,
                      mt: -0.75,
                    }}
                  >
                    Hide notifications that remind me when changes have been
                    made to documents I own
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
                      justifyContent: "space-between",
                      pr: 4,
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

                    <Button
                      variant="contained"
                      onClick={() => setChangePasswordOpen(true)}
                    >
                      Change Password
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pr: 4,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          pl: 2,
                          fontSize: 18,
                        }}
                      >
                        Recent Login Activity:
                      </Typography>

                      {recentLogins.map((entry, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{ pl: 3, pt: 0.4 }}
                        >
                          Logged in {entry}
                        </Typography>
                      ))}
                    </Box>

                    <Button
                      variant="contained"
                      onClick={() => navigate("/activity")}
                    >
                      View All Activity
                    </Button>
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
                  <Box
                    sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}
                  >
                    <Stack
                      className="dark-mode-toggle"
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        pt: 1,
                        pl: 2,
                        pr: 2,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                      >
                        {isDarkMode ?
                          <DarkModeIcon sx={{ color: "primary.main" }} />
                        : <LightModeIcon sx={{ color: "primary.main" }} />}
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight={500}
                          >
                            Dark Mode
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {isDarkMode ?
                              "Dark theme is active"
                            : "Light theme is active"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Switch
                        checked={isDarkMode}
                        onChange={() => {
                          void toggleDarkMode();
                        }}
                        color="primary"
                        disabled={isSaving}
                        inputProps={{ "aria-label": "Toggle dark mode" }}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ pl: 2, pr: 2 }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                      >
                        <SchoolIcon sx={{ color: "primary.main" }} />
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight={500}
                          >
                            Platform Tutorial
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Take a guided tour of the platform
                          </Typography>
                        </Box>
                      </Stack>

                      <Button
                        className="reset-tutorials-button"
                        variant="outlined"
                        size="small"
                        startIcon={<SchoolIcon />}
                        onClick={handleRestartTour}
                        sx={{
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Restart Tour
                      </Button>
                    </Stack>
                  </Box>
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

        <Dialog
          open={changePasswordOpen}
          onClose={() => {
            setChangePasswordOpen(false);
            setPasswordError(null);
            setPasswordSuccess(false);
            setPasswordForm({ currentPassword: "", newPassword: "" });
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pt: 2,
              }}
            >
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((pass) => ({
                    ...pass,
                    currentPassword: e.target.value,
                  }))
                }
              />

              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((pass) => ({
                    ...pass,
                    newPassword: e.target.value,
                  }))
                }
              />

              {passwordError && (
                <Typography color="error">{passwordError}</Typography>
              )}
              {passwordSuccess && (
                <Typography color="success.main">{passwordSuccess}</Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setChangePasswordOpen(false);
                setPasswordError(null);
                setPasswordSuccess(false);
                setPasswordForm({ currentPassword: "", newPassword: "" });
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              disabled={
                !passwordForm.currentPassword || !passwordForm.newPassword
              }
              onClick={() => {
                void handleChangePassword();
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
