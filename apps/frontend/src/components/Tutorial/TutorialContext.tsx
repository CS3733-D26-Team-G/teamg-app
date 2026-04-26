import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string; // CSS selector for the element to highlight
  route?: string; // Route the user should navigate to
  position?: "top" | "bottom" | "left" | "right" | "center";
  requiresNavigation?: boolean; // If true, waits for user to navigate
  navigationHint?: string; // Text shown when waiting for navigation
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to iBank! 👋",
    description:
      "This quick tour will show you around the platform. You'll learn how to navigate, manage content, and use your account. Click Next to begin.",
    position: "center",
  },
  {
    id: "sidebar",
    title: "Your Navigation Hub",
    description:
      "This is the sidebar — your main way to move around the platform. You can collapse it using the arrow button at the top to give yourself more screen space.",
    targetSelector: ".Sidebar",
    position: "right",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description:
      "The Dashboard gives you a bird's-eye view of the organization: employee demographics, recent activity, and content counts by role. Click Dashboard in the sidebar to continue.",
    targetSelector: "a[href='/dashboard']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Dashboard' in the sidebar to continue →",
  },
  {
    id: "dashboard-charts",
    title: "Dashboard Overview",
    description:
      "Here you can see the employee demographics pie chart and the most recent platform activity at a glance. The cards below show how many documents exist per role.",
    targetSelector: ".flex.flex-col.gap-8",
    position: "center",
  },
  {
    id: "management",
    title: "Management Tools",
    description:
      "As an admin, you have access to Employee and Content Management under the Management menu. Click 'Management' in the sidebar to expand it.",
    targetSelector: "#tutorial-management-menu",
    position: "right",
  },
  {
    id: "content-library",
    title: "Content Library",
    description:
      "The Content page is where all documents live. You can search, filter by position or file type, preview files, download them, or check them out for editing. Click 'Content' under Management to explore.",
    targetSelector: "a[href='/content-management']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Content' under Management in the sidebar →",
  },
  {
    id: "employee-management",
    title: "Employee Management",
    description:
      "Here you can add, edit, or remove employees from the system. Use the Filter button to narrow down by position or department, and the search bar to find specific employees.",
    targetSelector: "a[href='/employee-management']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Employees' under Management in the sidebar →",
  },
  {
    id: "activity",
    title: "Activity Log",
    description:
      "The Activity page shows a full timeline of every action taken on the platform — who edited what, when they logged in, and more. Click 'Activity' in the sidebar.",
    targetSelector: "a[href='/activity']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Activity' in the sidebar →",
  },
  {
    id: "profile-menu",
    title: "Your Account",
    description:
      "Click your name at the bottom of the sidebar to access your profile, settings (including dark mode), and to log out. Let's head there now.",
    targetSelector: "#resources-button",
    position: "top",
  },
  {
    id: "finish",
    title: "You're all set! 🎉",
    description:
      "That's the full tour! You now know how to navigate iBank, manage employees and content, review activity, and customize your experience. You can restart this tutorial anytime from your profile settings.",
    position: "center",
  },
];

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  showPrompt: boolean;
  startTutorial: () => void;
  skipTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTutorial: () => void;
  dismissPrompt: () => void;
  triggerPrompt: () => void;
}

const TutorialContext = createContext<TutorialContextType>({
  isActive: false,
  currentStep: 0,
  steps: TUTORIAL_STEPS,
  showPrompt: false,
  startTutorial: () => {},
  skipTutorial: () => {},
  nextStep: () => {},
  prevStep: () => {},
  endTutorial: () => {},
  dismissPrompt: () => {},
  triggerPrompt: () => {},
});

export const useTutorial = () => useContext(TutorialContext);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  const startTutorial = useCallback(() => {
    setShowPrompt(false);
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const skipTutorial = useCallback(() => {
    setShowPrompt(false);
    setIsActive(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= TUTORIAL_STEPS.length) {
        setIsActive(false);
        return 0;
      }
      return next;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const endTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
  }, []);

  const triggerPrompt = useCallback(() => {
    setShowPrompt(true);
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        steps: TUTORIAL_STEPS,
        showPrompt,
        startTutorial,
        skipTutorial,
        nextStep,
        prevStep,
        endTutorial,
        dismissPrompt,
        triggerPrompt,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export default TutorialContext;
