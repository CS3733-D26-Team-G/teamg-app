import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { API_ENDPOINTS } from "./config";
import { useAuth } from "./auth/AuthContext.tsx";

interface ThemeContextType {
  isDarkMode: boolean;
  isSaving: boolean;
  toggleDarkMode: () => Promise<void>;
}

const Themecontext = createContext<ThemeContextType>({
  isDarkMode: false,
  isSaving: false,
  toggleDarkMode: async () => {},
});

export const useThemeMode = () => useContext(Themecontext);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, session } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (session) {
      setIsDarkMode(session.settings.darkMode);
      return;
    }

    setIsDarkMode(false);
  }, [isLoading, session]);

  const toggleDarkMode = async () => {
    if (!session || isSaving) {
      return;
    }

    const nextDarkMode = !isDarkMode;
    setIsDarkMode(nextDarkMode);
    setIsSaving(true);

    try {
      const res = await fetch(API_ENDPOINTS.ACCOUNT_SETTINGS, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ darkMode: nextDarkMode }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update theme preference: ${res.status}`);
      }
    } catch (error) {
      console.error(error);
      setIsDarkMode((prev) => !prev);
    } finally {
      setIsSaving(false);
    }
  };

  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode],
  );

  return (
    <Themecontext.Provider value={{ isDarkMode, isSaving, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Themecontext.Provider>
  );
}

export default Themecontext;
