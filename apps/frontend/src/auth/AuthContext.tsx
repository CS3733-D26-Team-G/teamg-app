import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API_ENDPOINTS } from "../config";
import { SessionSchema, type Session } from "../types/auth";
import { dedupeAsync } from "../lib/async-cache";
import { invalidateDashboardBootstrap } from "../lib/activity-loaders";

interface AuthContextValue {
  isLoading: boolean;
  session: Session | null;
  refreshSession: () => Promise<Session | null>;
  clearSession: () => void;
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
    invalidateDashboardBootstrap();
    setSession(null);
    setIsLoading(false);
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
