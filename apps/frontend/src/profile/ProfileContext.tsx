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
  setProfile: (profile: EmployeeRecord | null) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

function appendAvatarCacheBust(url: string, cacheBust: string) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("t", cacheBust);
    return parsed.toString();
  } catch {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${encodeURIComponent(cacheBust)}`;
  }
}

function normalizeProfile(
  profile: EmployeeRecord | null,
): EmployeeRecord | null {
  if (!profile?.avatar) {
    return profile;
  }

  // Avatar uploads reuse a stable Supabase object path, so bust the browser
  // cache whenever the profile object is accepted into React state.
  return {
    ...profile,
    avatar: appendAvatarCacheBust(profile.avatar, Date.now().toString()),
  };
}

async function fetchProfile(): Promise<EmployeeRecord | null> {
  return dedupeAsync("profile", async () => {
    const res = await fetch(API_ENDPOINTS.PROFILE.ROOT, {
      credentials: "include",
    });

    if (res.status === 401) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }

    return normalizeProfile(EmployeeRecordSchema.parse(await res.json()));
  });
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { isLoading: authLoading, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setRawProfile] = useState<EmployeeRecord | null>(null);

  const setProfile = (nextProfile: EmployeeRecord | null) => {
    setRawProfile(normalizeProfile(nextProfile));
  };

  const refreshProfile = async () => {
    try {
      const nextProfile = await fetchProfile();
      setRawProfile(nextProfile);
      return nextProfile;
    } catch (error) {
      console.error(error);
      setRawProfile(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearProfile = () => {
    setRawProfile(null);
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
        setProfile,
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
