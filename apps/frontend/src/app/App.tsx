import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import { AppThemeProvider } from "../ThemeContext.tsx";
import { AuthProvider, useAuth } from "../auth/AuthContext.tsx";
import { ProfileProvider } from "../profile/ProfileContext.tsx";
import { TutorialProvider } from "../components/Tutorial/TutorialContext.tsx";
import TutorialOverlay from "../components/Tutorial/TutorialOverlay.tsx";
import TutorialPrompt from "../components/Tutorial/TutorialPrompt.tsx";
import { useTutorial } from "../components/Tutorial/TutorialContext.tsx";
import type { UserRole } from "../components/Tutorial/TutorialContext.tsx";
import { SidebarProvider } from "../components/SidebarContext.tsx";

function AppShell() {
  const location = useLocation();
  const { session } = useAuth();
  const { triggerWelcomeTour } = useTutorial();

  const isHeroPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isAboutPage = location.pathname === "/aboutus";
  const isCreditsPage = location.pathname === "/credits";

  // Derive role from session — same logic as Sidebar
  const getRole = (): UserRole => {
    if (!session) return "other";
    if (session.permissions?.can_manage_employees) return "admin";
    if (session.position === "UNDERWRITER") return "underwriter";
    return "other";
  };

  // Fire the welcome tour once when the user first logs in
  useEffect(() => {
    if (
      session &&
      !isHeroPage &&
      !isLoginPage &&
      !isAboutPage &&
      !isCreditsPage
    ) {
      triggerWelcomeTour(getRole());
    }
  }, [session, location.pathname]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #1A1E4B 0%, #222847 35%, #263056 70%, #2c3a6a 100%)",
      }}
    >
      {!isHeroPage &&
        !isLoginPage &&
        !isAboutPage &&
        !isCreditsPage &&
        session && <Sidebar />}

      <div
        style={{
          flexGrow: 1,
          minWidth: 0,
          background:
            "linear-gradient(135deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
        }}
      >
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
            <SidebarProvider>
              <AppShell />
            </SidebarProvider>
          </TutorialProvider>
        </AppThemeProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
