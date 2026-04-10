import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
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
    fontFamily: "Playfair Display",
    h1: {
      fontFamily: "Playfair Display",
      fontSize: "xx-large",
      fontWeight: "bold",
    },
    h2: {
      fontFamily: "Playfair Display",
      fontSize: "x-large",
      fontWeight: "bold",
    },
    h3: {
      fontFamily: "Playfair Display",
      fontSize: "large",
      fontWeight: "bold",
    },
    h4: {
      fontFamily: "Playfair Display",
      fontSize: "medium",
      fontWeight: "bold",
    },
    h5: {
      fontFamily: "Playfair Display",
      fontSize: "small",
      fontWeight: "bold",
    },
    body1: {
      fontFamily: "Playfair Display",
      fontSize: "medium",
      fontWeight: "regular",
    },
    body2: {
      fontFamily: "Playfair Display",
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

theme = responsiveFontSizes(theme);

export default theme;
