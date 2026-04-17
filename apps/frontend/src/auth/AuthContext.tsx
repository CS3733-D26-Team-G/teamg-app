import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { z } from "zod";
import { API_ENDPOINTS } from "../config";

const SessionSettingsSchema = z.object({
  darkMode: z.boolean().default(false),
});

const SessionSchema = z.object({
  employeeUuid: z.string(),
  position: z.enum(["UNDERWRITER", "BUSINESS_ANALYST", "ADMIN"]),
  settings: SessionSettingsSchema.default({ darkMode: false }),
  permissions: z.object({
    canManageEmployees: z.boolean(),
    canManageAllContent: z.boolean(),
  }),
});

export interface Session {
  employeeUuid: string;
  position: "UNDERWRITER" | "BUSINESS_ANALYST" | "ADMIN";
  settings: z.infer<typeof SessionSettingsSchema>;
  permissions: {
    canManageEmployees: boolean;
    canManageAllContent: boolean;
  };
}

interface AuthContextValue {
  isLoading: boolean;
  session: Session | null;
  refreshSession: () => Promise<Session | null>;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<Session | null> {
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
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const refreshSession = async () => {
    try {
      const nextSession = await fetchSession();
      setSession(nextSession);
      return nextSession;
    } catch (error) {
      console.error(error);
      setSession(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSession = () => {
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
