import { createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

export const lightTheme: Theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#1A1E4B",
      paper: "#FFFFFF",
    },
    primary: {
      dark: "#1A1E4B",
      main: "#395176",
      light: "#C6DAF0",
      contrastText: "#FFF",
    },
    secondary: {
      dark: "#4B1A26",
      main: "#74414e",
      light: "#bea5aa",
    },
    error: {
      main: "#FF0050",
    },
  },
  typography: {
    fontFamily: "Rubik, Karla, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 600 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1rem", fontWeight: 600 },
    h4: { fontSize: ".5rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
    caption: { fontSize: "0.75rem", color: "#6b6b6b" },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          "color": "#00779D",
          "textDecoration": "none",
          "&:hover": {
            color: "#00C1FF",
            textDecoration: "underline",
          },
        },
      },
      defaultProps: { underline: "hover" },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: "Rubik",
          fontSize: "smaller",
          fontWeight: "lighter",
        },
      },
    },
  },
});

export const darkTheme: Theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#000000",
      paper: "#202020",
    },
    primary: {
      dark: "#000000",
      main: "#4D9FFF",
      light: "#82BFFF",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#777777",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#777777",
    },
    error: {
      main: "#FF4D7D",
    },
  },
  typography: {
    fontFamily: "Rubik, Karla, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 600 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1rem", fontWeight: 600 },
    h4: { fontSize: ".5rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
    caption: { fontSize: "0.75rem", color: "#777777" },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          "color": "#4D9FFF",
          "textDecoration": "none",
          "&:hover": {
            color: "#82BFFF",
            textDecoration: "underline",
          },
        },
      },
      defaultProps: { underline: "hover" },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: "Rubik",
          fontSize: "smaller",
          fontWeight: "lighter",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none !important" as "none",
          backgroundColor: "#202020 !important" as "#202020",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#202020",
          color: "#FFFFFF",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundImage: "none !important" as "none",
          backgroundColor: "#202020 !important" as "#202020",
        },
      },
    },
  },
});

export default lightTheme;
