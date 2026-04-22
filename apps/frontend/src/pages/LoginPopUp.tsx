import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config.ts";
import { useAuth } from "../auth/AuthContext.tsx";
import HanoverLoginPic from "../assets/hannoverBuilding.jpg";
import HanoverLogo from "../assets/HanoverLogo.png";

interface LoginPopUpProps {
  open: boolean;
  onClose: () => void;
}

function LoginPopUp({ open, onClose }: LoginPopUpProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added for UI feedback
  const navigate = useNavigate();
  const { refreshSession } = useAuth();

  if (!open) return null;

  const handleLogin = async () => {
    setError(null);
    console.log("Attempting login...");

    try {
      const resp = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (resp.status === 401) {
        setError(t("login.invalidCredentials"));
        return console.error("Invalid credentials");
      }

      if (!resp.ok) {
        setError(t("login.serverError"));
        return;
      }

      // Most refreshSession implementations return the user object
      const userData = await refreshSession();

      onClose();

      // Adjust "ADMIN" to match whatever string your backend sends (e.g., "admin", 1, etc.)
      if (userData?.position === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/library");
      }
    } catch (e) {
      setError(t("login.networkError"));
      console.error(e);
    }
  };

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          width: "1200px",
          height: "520px",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          backgroundColor: "white",
        }}
      >
        <Box
          sx={{
            width: "60%",
            height: "100%",
            display: { xs: "none", sm: "block" },
          }}
        >
          <Box
            component="img"
            src={HanoverLoginPic}
            alt="Hanover"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            width: { xs: "100%", sm: "40%" },
            height: "100%",
            px: 6,
            py: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ position: "absolute", top: 14, right: 14, color: "#555" }}
          >
            <Close />
          </IconButton>

          <Stack
            spacing={3}
            alignItems="center"
          >
            <Box
              component="img"
              src={HanoverLogo}
              alt="Hanover Logo"
              sx={{
                width: "70%",
                maxWidth: 240,
                mb: 1,
              }}
            />

            {error && (
              <Typography
                color="error"
                variant="body2"
                fontWeight="bold"
              >
                {error}
              </Typography>
            )}

            <TextField
              id="username"
              label={t("login.username")}
              sx={inputLook("0px", "-28px")}
              placeholder="...@Hanover.org"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleLogin();
              }}
              id="password"
              label={t("login.password")}
              sx={inputLook("10px", "-18px")}
              placeholder={t("login.password")}
              type={showPass ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  onKeyDown: (e) => {
                    if (e.key === "Enter") void handleLogin();
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPass(!showPass)}
                        edge="end"
                      >
                        {showPass ?
                          <VisibilityOff />
                        : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{
                      "color": "#555",
                      "&.Mui-checked": { color: "#4a7aab" },
                    }}
                  />
                }
                label={
                  <Typography fontWeight="bold">
                    {t("login.rememberMe")}
                  </Typography>
                }
              />
            </Box>

            <Button
              onClick={handleLogin}
              variant="contained"
              fullWidth
              size="large"
              sx={{
                "backgroundColor": "#4a7aab",
                "borderRadius": 4,
                "fontWeight": "bold",
                "py": 1.5,
                "&:hover": { backgroundColor: "#3a6a9b" },
              }}
            >
              {t("heroSection.login")}
            </Button>

            <Stack
              direction="row"
              justifyContent="space-between"
              width="100%"
            >
              <Link
                href="#"
                underline="hover"
                color="text.secondary"
                variant="body2"
              >
                {t("login.forgotUsername")}
              </Link>
              <Link
                href="#"
                underline="hover"
                color="text.secondary"
                variant="body2"
              >
                {t("login.forgotPassword")}
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

const inputLook = (translateY = "0px", translateOtherY = "0px") => ({
  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    transform: `translate(0px, ${translateOtherY})`,
  },
  "& .MuiInputLabel-root": {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  "& .MuiOutlinedInput-root": {
    "backgroundColor": "#f0f0f0",
    "borderRadius": 2,
    "transform": `translate(0px, ${translateY})`,
    "& fieldset": { border: "none" },
  },
  "& .MuiInputBase-input": {
    color: "#333",
  },
});

export default LoginPopUp;
