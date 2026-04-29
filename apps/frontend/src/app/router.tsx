import type { ReactElement } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import { useAuth } from "../auth/AuthContext.tsx";
import HeroPage from "../pages/Hero/index.tsx";
import DashboardPage from "../pages/Dashboard/index.tsx";
import MyFormsPage from "../pages/MyForms/index.tsx";
import LibraryPage from "../pages/Library/index.tsx";
import ActivityPage from "../pages/Activity/index.tsx";
import SettingsPage from "../pages/Settings/index.tsx";
import ProfilePage from "../pages/Profile/index.tsx";
import CreditsPage from "../pages/Credits/index.tsx";
import AboutPage from "../pages/About/index.tsx";
import ApprovalPage from "../pages/Approval/index.tsx";
import RiskReviewPage from "../pages/RiskReview/index.tsx";
import ClaimsPage from "../pages/Claims/index.tsx";
import EmployeeManagementPage from "../pages/EmployeeManagement/index.tsx";
import EmployeeFormPage from "../pages/EmployeeForm/index.tsx";
import CalendarPage from "../pages/Calendar/index.tsx";

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

function AdminRoute({ children }: { children: ReactElement }) {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (!session.permissions.canManageEmployees) {
    return (
      <Navigate
        to="/library"
        replace
      />
    );
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HeroPage />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-forms",
        element: (
          <ProtectedRoute>
            <MyFormsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "library",
        element: (
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "activity",
        element: (
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "employee-management",
        element: (
          <AdminRoute>
            <EmployeeManagementPage />
          </AdminRoute>
        ),
      },
      {
        path: "content-management",
        element: (
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "approvals",
        element: (
          <AdminRoute>
            <ApprovalPage />
          </AdminRoute>
        ),
      },
      {
        path: "employee-form",
        element: (
          <AdminRoute>
            <EmployeeFormPage />
          </AdminRoute>
        ),
      },
      {
        path: "content-form",
        element: (
          <ProtectedRoute>
            <MyFormsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "credits",
        element: <CreditsPage />,
      },
      {
        path: "risk-review",
        element: <RiskReviewPage />,
      },
      {
        path: "claims",
        element: (
          <ProtectedRoute>
            <ClaimsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "calendar",
        element: (
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "aboutus",
        element: <AboutPage />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
