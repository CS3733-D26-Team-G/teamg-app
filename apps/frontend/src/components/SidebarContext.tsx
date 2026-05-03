import { createContext, type ReactNode, useContext, useState } from "react";

const SidebarContext = createContext({
  isOpen: true,
  setIsOpen: (_: boolean) => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
