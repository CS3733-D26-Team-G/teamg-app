import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API_ENDPOINTS } from "../config";
import { SessionSchema, type Session } from "../types/auth";
import { dedupeAsync, setCacheIdentity } from "../lib/async-cache";
import { invalidateDashboardBootstrap } from "../lib/activity-loaders";

interface AuthContextValue {
  isLoading: boolean;
  session: Session | null;
  refreshSession: () => Promise<Session | null>;
  clearSession: () => void;
  logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<Session | null> {
  return dedupeAsync("session", async () => {
    const res = await fetch(API_ENDPOINTS.SESSION, {
      credentials: "include",
    });

    if (res.status === 401) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch session: ${res.status}`);
    }

    return SessionSchema.parse(await res.json());
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const refreshSession = async () => {
    try {
      const nextSession = await fetchSession();
      // Cache identity must change before consumers refresh user-scoped queries.
      setCacheIdentity(nextSession?.employeeUuid ?? null);
      if (session?.employeeUuid !== nextSession?.employeeUuid) {
        invalidateDashboardBootstrap();
      }
      setSession(nextSession);
      return nextSession;
    } catch (error) {
      console.error(error);
      invalidateDashboardBootstrap();
      setSession(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
    setCacheIdentity(null);
    invalidateDashboardBootstrap();
    setSession(null);
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        return false;
      }
      clearSession();
      localStorage.clear();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        session,
        refreshSession,
        clearSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
