import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import { AppThemeProvider } from "../ThemeContext.tsx";
import { AuthProvider, useAuth } from "../auth/AuthContext.tsx";
import { ProfileProvider } from "../profile/ProfileContext.tsx";
import { TutorialProvider } from "../components/Tutorial/TutorialContext.tsx";
import TutorialOverlay from "../components/Tutorial/TutorialOverlay.tsx";
import TutorialPrompt from "../components/Tutorial/TutorialPrompt.tsx";
import { useTutorial } from "../components/Tutorial/TutorialContext.tsx";
import type { UserRole } from "../components/Tutorial/TutorialContext.tsx";
import { SidebarProvider, useSidebar } from "../components/SidebarContext.tsx";
import VoiceControl from "../components/VoiceControl.tsx";
import { NotificationFilterProvider } from "../features/notifications/components/NotificationsSettingsToggle.tsx";

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, session } = useAuth();
  const { triggerWelcomeTour } = useTutorial();
  const { setIsManagementOpen, setIsOpen } = useSidebar();

  const isHeroPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isAboutPage = location.pathname === "/aboutus";
  const isCreditsPage = location.pathname === "/credits";
  const isAppContentPage =
    !isHeroPage && !isLoginPage && !isAboutPage && !isCreditsPage;

  // Derive role from session — same logic as Sidebar
  const getRole = (): UserRole => {
    if (!session) return "other";
    if (session.permissions?.can_manage_employees) return "admin";
    if (session.position === "UNDERWRITER") return "underwriter";
    return "other";
  };

  // Fire the welcome tour once when the user first logs in
  useEffect(() => {
    if (session && isAppContentPage && !session.settings.tutorialDone) {
      triggerWelcomeTour(getRole());
    }
  }, [
    isAppContentPage,
    location.pathname,
    session,
    session?.settings.tutorialDone,
    triggerWelcomeTour,
  ]);

  const handleLogout = async () => {
    const didLogout = await logout();
    if (didLogout) {
      navigate("/");
    } else {
      console.error("Logout Failed");
    }
  };
  const handleVoiceCommand = (command: string) => {
    const normalizedCommand = command.toLowerCase().replace(/[^\w\s]/g, "");
    const compactCommand = normalizedCommand.replace(/\s+/g, "");

    if (
      compactCommand.includes("logout") ||
      compactCommand.includes("signout")
    ) {
      void handleLogout();
      return true;
    }
    if (
      session?.permissions.can_manage_employees &&
      compactCommand.includes("management")
    ) {
      setIsOpen(true);
      setIsManagementOpen(true);
      return true;
    }

    const routes: Array<[string[], string]> = [
      [["dashboard", "home"], "/dashboard"],
      [["library", "content library"], "/library"],
      [["preview", "preview content", "content preview"], "/library"],
      [["check out", "checkout", "checked out"], "/library"],
      [["forms", "my forms", "content form"], "/my-forms"],
      [["activity"], "/activity"],
      [["settings"], "/settings"],
      [["profile"], "/profile"],
      [["calendar"], "/calendar"],
      [["claims"], "/claims"],
      [["risk review"], "/risk-review"],
      [["credits"], "/credits"],
      [["about"], "/aboutus"],
    ];
    if (session?.permissions.can_manage_employees) {
      routes.push([
        ["employees", "employee management"],
        "/employee-management",
      ]);
      routes.push([["approvals", "approval"], "/approvals"]);
    }
    const route = routes.find(([phrases]) =>
      phrases.some((phrase) => normalizedCommand.includes(phrase)),
    );
    if (route) {
      navigate(route[1]);
      return true;
    }
    return false;
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #1A1E4B 0%, #222847 35%, #263056 70%, #2c3a6a 100%)",
      }}
    >
      {isAppContentPage && session && <Sidebar />}

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

      {isAppContentPage && session && (
        <VoiceControl onCommand={handleVoiceCommand} />
      )}
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
              <NotificationFilterProvider>
                <AppShell />
              </NotificationFilterProvider>
            </SidebarProvider>
          </TutorialProvider>
        </AppThemeProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
