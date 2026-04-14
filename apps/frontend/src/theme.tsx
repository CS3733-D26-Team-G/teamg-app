import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
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
    fontFamily: "Archivo Black, Fira Sans",
    h1: {
      fontFamily: "Fira Sans",
      fontSize: "xx-large",
      fontWeight: "bold",
    },
    h2: {
      fontFamily: "Fira Sans",
      fontSize: "x-large",
      fontWeight: "bold",
    },
    h3: {
      fontFamily: "Fira Sans",
      fontSize: "large",
      fontWeight: "bold",
    },
    h4: {
      fontFamily: "Fira Sans",
      fontSize: "medium",
      fontWeight: "bold",
    },
    h5: {
      fontFamily: "Fira Sans",
      fontSize: "small",
      fontWeight: "bold",
    },
    body1: {
      fontFamily: "Fira Sans",
      fontSize: "medium",
      fontWeight: "regular",
    },
    body2: {
      fontFamily: "Fira Sans",
      fontSize: "small",
      fontWeight: "regular",
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
      defaultProps: {
        underline: "hover", // Applies 'underline="hover"' to all Links by default
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: "Playfair Display",
          fontSize: "smaller",
          fontWeight: "lighter",
        },
      },
    },
  },
});

export default theme;
