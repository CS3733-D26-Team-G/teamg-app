import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { API_ENDPOINTS } from "../config";
import { type EmployeeRecord, EmployeeRecordSchema } from "../types/employee";
import { useAuth } from "../auth/AuthContext";
import { dedupeAsync } from "../lib/async-cache";

interface ProfileContextValue {
  isLoading: boolean;
  profile: EmployeeRecord | null;
  refreshProfile: () => Promise<EmployeeRecord | null>;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

async function fetchProfile(): Promise<EmployeeRecord | null> {
  return dedupeAsync("profile", async () => {
    const res = await fetch(API_ENDPOINTS.PROFILE, {
      credentials: "include",
    });

    if (res.status === 401) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }

    return EmployeeRecordSchema.parse(await res.json());
  });
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { isLoading: authLoading, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<EmployeeRecord | null>(null);

  const refreshProfile = async () => {
    try {
      const nextProfile = await fetchProfile();
      setProfile(nextProfile);
      return nextProfile;
    } catch (error) {
      console.error(error);
      setProfile(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearProfile = () => {
    setProfile(null);
    setIsLoading(false);
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!session) {
      clearProfile();
      return;
    }

    void refreshProfile();
  }, [authLoading, session?.employeeUuid]);

  return (
    <ProfileContext.Provider
      value={{
        isLoading,
        profile,
        refreshProfile,
        clearProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);

  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }

  return ctx;
}
