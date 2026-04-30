import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import { AppThemeProvider } from "../ThemeContext.tsx";
import { AuthProvider, useAuth } from "../auth/AuthContext.tsx";
import { ProfileProvider } from "../profile/ProfileContext.tsx";
import { TutorialProvider } from "../components/Tutorial/TutorialContext.tsx";
import TutorialOverlay from "../components/Tutorial/TutorialOverlay.tsx";
import TutorialPrompt from "../components/Tutorial/TutorialPrompt.tsx";

function AppShell() {
  const location = useLocation();
  const { session } = useAuth();
  const isHeroPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #1A1E4B 0%, #222847 35%, #263056 70%, #2c3a6a 100%)",
      }}
    >
      {!isHeroPage && !isLoginPage && session && <Sidebar />}

      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <Outlet />
      </div>

      <TutorialPrompt />
      <TutorialOverlay />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppThemeProvider>
          <TutorialProvider>
            <AppShell />
          </TutorialProvider>
        </AppThemeProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
