import type { ReactElement } from "react";
import "./App.css";
import { Routes, Route } from "react-router";
import { Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import { AppThemeProvider } from "./Themecontext.tsx";
import { AuthProvider, useAuth } from "./auth/AuthContext.tsx";
import { ProfileProvider } from "./profile/ProfileContext.tsx";
import { TutorialProvider } from "./components/Tutorial/TutorialContext.tsx";
import TutorialOverlay from "./components/Tutorial/TutorialOverlay.tsx";
import TutorialPrompt from "./components/Tutorial/TutorialPrompt.tsx";

import Hero from "./pages/hero.tsx";
import Dashboard from "./pages/dashboard.tsx";
import MyForms from "./pages/content-form.tsx";
import Library from "./pages/library.tsx";
import Activity from "./pages/activity.tsx";
import Settings from "./pages/settings.tsx";
import Profile from "./pages/profile.tsx";
import Credits from "./pages/Credits.tsx";
import ApprovalPage from "./pages/approval.tsx";
import RiskReviewPage from "./pages/risk-review.tsx";
import EmployeeManagement from "./pages/employee-management.tsx";
import EmployeeFormPage from "./pages/employees-form.tsx";

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isLoading, session } = useAuth();
  if (isLoading) return null;
  if (!session)
    return (
      <Navigate
        to="/"
        replace
      />
    );
  return children;
}

function AdminRoute({ children }: { children: ReactElement }) {
  const { isLoading, session } = useAuth();
  if (isLoading) return null;
  if (!session)
    return (
      <Navigate
        to="/"
        replace
      />
    );
  if (!session.permissions.canManageEmployees)
    return (
      <Navigate
        to="/library"
        replace
      />
    );
  return children;
}

function AppLayout() {
  const location = useLocation();
  const { session } = useAuth();
  const isHeroPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {!isHeroPage && !isLoginPage && session && <Sidebar />}

      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <Routes>
          <Route
            path="/"
            element={<Hero />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-forms"
            element={
              <ProtectedRoute>
                <MyForms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity"
            element={
              <ProtectedRoute>
                <Activity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/employee-management"
            element={
              <AdminRoute>
                <EmployeeManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/content-management"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/approvals"
            element={
              <AdminRoute>
                <ApprovalPage />
              </AdminRoute>
            }
          />
          <Route
            path="/employee-form"
            element={
              <AdminRoute>
                <EmployeeFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/content-form"
            element={
              <ProtectedRoute>
                <MyForms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credits"
            element={<Credits />}
          />
          <Route
            path="/risk-review"
            element={<RiskReviewPage />}
          />
        </Routes>
      </div>

      {/* Tutorial system */}
      <TutorialPrompt />
      <TutorialOverlay />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppThemeProvider>
          <TutorialProvider>
            <AppLayout />
          </TutorialProvider>
        </AppThemeProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
