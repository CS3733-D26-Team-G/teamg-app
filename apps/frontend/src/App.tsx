import "./App.css";
import { Routes, Route } from "react-router";
import Sidebar from "./components/Sidebar.tsx";
import theme from "./theme.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";

import Hero from "./pages/hero.tsx";
import Dashboard from "./pages/dashboard.tsx";
import MyForms from "./pages/content-form.tsx";
import Library from "./pages/library.tsx";
import Activity from "./pages/activity.tsx";
import Settings from "./pages/settings.tsx";
import Profile from "./pages/profile.tsx";
import LoginPage from "./pages/LoginPage.tsx";

import EmployeeManagement from "./pages/employee-management.tsx";
import EmployeeFormPage from "./pages/employees-form.tsx";

import { useLocation } from "react-router";

function App() {
  const location = useLocation();
  const isHeroPage = location.pathname === "/";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {!isHeroPage && <Sidebar />}

        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route
              path="/"
              element={<Hero />}
            />

            <Route
              path="/login"
              element={<LoginPage />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/my-forms"
              element={<MyForms />}
            />
            <Route
              path="/library"
              element={<Library />}
            />
            <Route
              path="/activity"
              element={<Activity />}
            />
            <Route
              path="/settings"
              element={<Settings />}
            />
            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/employee-management"
              element={<EmployeeManagement />}
            />

            <Route
              path="/content-management"
              element={<Library />}
            />

            <Route
              path="/employee-form"
              element={<EmployeeFormPage />}
            />

            <Route
              path="/content-form"
              element={<MyForms />}
            />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
