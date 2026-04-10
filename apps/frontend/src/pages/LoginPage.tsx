import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS} from "../config.ts";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #9abce0 0%, #ffffff 48%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 5 },
          transform: "scale(1.2)",
          minHeight: "400px",
          borderRadius: 4,
          width: "100%",
          height: "auto",
          maxWidth: 900,
          backgroundColor: "#f1f1d2",
          border: "0px solid black",
          boxShadow: "10px 10px 5px lightgray",
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
        >
          <Box
            component="img"
            src="/hanover_logo.png"
            alt="Hanover Logo"
            sx={{
              width: "55%",
              maxWidth: 260,
              height: "auto",
            }}
          />

          <TextField
            id="username"
            label="Username"
            sx={inputLook("0px", "-28px")}
            placeholder="...@Hanover.org"
            type="text"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            id="password"
            label="Password"
            sx={inputLook("10px", "-18px")}
            placeholder="Password"
            type={showPass ? "text" : "password"}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPass(!showPass)}
                      edge="end"
                      aria-label="toggle password visibility"
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
                    "ml": 1,
                  }}
                />
              }
              label={
                <Typography
                  fontWeight="bold"
                  color="text.primary"
                >
                  Remember Me
                </Typography>
              }
            />
          </Box>

          <Button
            onClick={async () => {
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
                  return console.error("Invalid credentials");
                }
                const body = await resp.json();
                localStorage.setItem("account_type", body.account_type);
                navigate("/dashboard");
                console.log(body);
              } catch (e) {
                console.error(e);
              }
            }}
            variant="contained"
            fullWidth
            size="large"
            sx={{
              "backgroundColor": "#4a7aab",
              "borderRadius": 4,
              "fontWeight": "bold",
              "fontSize": "1.1rem",
              "py": 1.5,
              "boxShadow": "4px 4px 8px rgba(0,0,0,0.2)",
              "&:hover": { backgroundColor: "#3a6a9b" },
            }}
          >
            Log In
          </Button>

          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
          >
            <Link
              href="dummyLink.com"
              underline="hover"
              color="text.secondary"
              variant="body2"
            >
              Forgot Your Username?
            </Link>
            <Link
              href="dummyLink.com"
              underline="hover"
              color="text.secondary"
              variant="body2"
            >
              Forgot Your Password?
            </Link>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

const inputLook = (translateY = "0px", translateOtherY = "0px") => ({
  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    transform: `translate(0px, ${translateOtherY})`,
  },
  "& .MuiInputLabel-root": {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  "& .MuiOutlinedInput-root": {
    "backgroundColor": "lightgray",
    "borderRadius": 2,
    "transform": `translate(0px, ${translateY})`,
    "& fieldset": { border: "none" },
  },
  "& .MuiInputBase-input": {
    color: "dimgray",
  },
});

export default LoginPage;
