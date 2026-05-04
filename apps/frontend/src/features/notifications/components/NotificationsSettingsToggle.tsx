import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface NotificationFilterContextType {
  hideEdits: boolean;
  toggleHideEdits: () => void;
  setHideEdits: (value: boolean) => void;
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

  const toggleHideEdits = useCallback(() => {
    setHideEdits((prev) => {
      const newValue = !prev;
      localStorage.setItem("hideEdits", JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const handleSetHideEdits = useCallback((value: boolean) => {
    setHideEdits(value);
    localStorage.setItem("hideEdits", JSON.stringify(value));
  }, []);

  return (
    <NotificationFilterContext.Provider
      value={{
        hideEdits,
        toggleHideEdits,
        setHideEdits: handleSetHideEdits,
      }}
    >
      {children}
    </NotificationFilterContext.Provider>
  );
}

export function useNotificationFilterToggle() {
  const context = useContext(NotificationFilterContext);
  if (!context) {
    throw new Error(
      "useNotificationFilter must be used within NotificationFilterProvider",
    );
  }
  return context;
}
