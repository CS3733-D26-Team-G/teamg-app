import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface NotificationEditFilterContextType {
  hideEdits: boolean;
  toggleHideEdits: () => void;
  setHideEdits: (value: boolean) => void;
}

interface NotificationExpireFilterContextType {
  hideExpiration: boolean;
  toggleHideExpiration: () => void;
  setHideExpiration: (value: boolean) => void;
}

interface NotificationFilterContextType {
  hideEdits: boolean;
  toggleHideEdits: () => void;
  setHideEdits: (value: boolean) => void;
  hideExpiration: boolean;
  toggleHideExpiration: () => void;
  setHideExpiration: (value: boolean) => void;
}

const NotificationFilterContext = createContext<
  NotificationFilterContextType | undefined
>(undefined);

export function NotificationFilterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hideEdits, setHideEdits] = useState<boolean>(() => {
    const saved = localStorage.getItem("hideEdits");
    return saved ? JSON.parse(saved) : false;
  });

  const [hideExpiration, setHideExpiration] = useState<boolean>(() => {
    const saved = localStorage.getItem("hideExpiration");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleHideEdits = useCallback(() => {
    setHideEdits((prev) => {
      const newValue = !prev;
      localStorage.setItem("hideEdits", JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const toggleHideExpiration = useCallback(() => {
    setHideExpiration((prev) => {
      const newValue = !prev;
      localStorage.setItem("hideExpiration", JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const handleSetHideEdits = useCallback((value: boolean) => {
    setHideEdits(value);
    localStorage.setItem("hideEdits", JSON.stringify(value));
  }, []);

  const handleSetHideExpiration = useCallback((value: boolean) => {
    setHideExpiration(value);
    localStorage.setItem("hideExpiration", JSON.stringify(value));
  }, []);

  return (
    <NotificationFilterContext.Provider
      value={{
        hideEdits,
        toggleHideEdits,
        setHideEdits: handleSetHideEdits,
        hideExpiration,
        toggleHideExpiration,
        setHideExpiration: handleSetHideExpiration,
      }}
    >
      {children}
    </NotificationFilterContext.Provider>
  );
}

export function useNotificationFilters() {
  const context = useContext(NotificationFilterContext);
  if (!context) {
    throw new Error(
      "useNotificationFilters must be used within NotificationFilterProvider",
    );
  }
  return context;
}

export function useNotificationEditFilter() {
  const { hideEdits, toggleHideEdits, setHideEdits } = useNotificationFilters();
  return { hideEdits, toggleHideEdits, setHideEdits };
}

export function useNotificationExpireFilter() {
  const { hideExpiration, toggleHideExpiration, setHideExpiration } =
    useNotificationFilters();
  return { hideExpiration, toggleHideExpiration, setHideExpiration };
}

export function useNotificationFilterToggle() {
  const { hideEdits, toggleHideEdits, hideExpiration, toggleHideExpiration } =
    useNotificationFilters();
  return {
    hideEdits,
    toggleHideEdits,
    hideExpiration,
    toggleHideExpiration,
  };
}
