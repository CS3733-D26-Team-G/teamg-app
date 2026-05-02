import { createTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

export const lightTheme: Theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F0F4F8",
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
      default: "#0D1117", // dark navy page background
      paper: "#161B27", // slightly lighter navy for cards and panels
    },
    primary: {
      dark: "#1A1E4B",
      main: "#4D9FFF",
      light: "#82BFFF",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#777777",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9BA3B8", // softer blue-grey instead of flat #777
    },
    error: {
      main: "#FF4D7D",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: "Rubik, Karla, sans-serif",
    h1: { fontSize: "2.5rem", fontWeight: 600 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1rem", fontWeight: 600 },
    h4: { fontSize: ".5rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.43 },
    caption: { fontSize: "0.75rem", color: "#9BA3B8" },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0D1117",
          backgroundImage: "none",
        },
      },
    },
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
          color: "#9BA3B8",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#161B27",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#161B27",
          color: "#FFFFFF",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: "#1E2535",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(77,159,255,0.08)",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          "color": "#FFFFFF",
          "& input": {
            color: "#FFFFFF",
          },
          "& input::placeholder": {
            color: "#9BA3B8",
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.15)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.3)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4D9FFF",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#161B27",
          borderColor: "rgba(255,255,255,0.06)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255,255,255,0.08)",
        },
        head: {
          backgroundColor: "#1E2535",
          color: "#9BA3B8",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1E2535",
          color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-outlined": {
            borderColor: "rgba(255,255,255,0.2)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          "borderColor": "rgba(255,255,255,0.2)",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.4)",
            backgroundColor: "rgba(255,255,255,0.05)",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#161B27",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: "#1E2535",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: "none",
          backgroundColor: "#161B27",
        },
      },
    },
  },
});

export default lightTheme;
