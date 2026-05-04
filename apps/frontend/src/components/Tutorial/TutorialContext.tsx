import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { API_ENDPOINTS } from "../../config.ts";
import { useAuth } from "../../auth/AuthContext.tsx";

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  requiresNavigation?: boolean;
  navigationHint?: string;
  requiresInteraction?: boolean;
  interactionHint?: string;
}

export type UserRole = "admin" | "underwriter" | "other";

// ─── Admin Tour (full platform walkthrough) ───────────────────────────────────

const ADMIN_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to iBank! 👋",
    description:
      "This guided tour will walk you through the entire platform. You'll learn how to navigate, manage employees and content, review approvals, and more. Click Next to begin.",
    position: "center",
  },
  {
    id: "sidebar",
    title: "Your Navigation Hub",
    description:
      "This is the sidebar your main way to move around iBank. You can collapse it using the arrow button at the top to give yourself more screen space.",
    targetSelector: ".Sidebar",
    position: "right",
  },
  {
    id: "goto-dashboard",
    title: "Dashboard",
    description:
      "The Dashboard gives you a bird's eye view of the organisation: employee demographics, recent activity, and content counts by role. Click 'Dashboard' in the sidebar to continue.",
    targetSelector: "a[href='/dashboard']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Dashboard' in the sidebar to continue →",
  },
  {
    id: "dashboard-demographics",
    title: "Employee Demographics",
    description:
      "This pie chart breaks down your workforce by role. Hover over each slice to see exact counts.",
    targetSelector: ".employee-demographics-card",
    position: "right",
  },
  {
    id: "dashboard-activity",
    title: "Recent Activity",
    description:
      "A live feed of the latest actions on the platform logins, edits, uploads with timestamps.",
    targetSelector: ".recent-activity-card",
    position: "left",
  },
  {
    id: "dashboard-role-cards",
    title: "Content by Role",
    description:
      "Each card shows the total number of documents assigned to that role. Click any card to jump straight to filtered content.",
    targetSelector: ".role-count-cards",
    position: "top",
  },
  {
    id: "dashboard-charts",
    title: "Activity & File Type Charts",
    description:
      "These charts give you a deeper view of employee activity over time and the breakdown of file types in the system.",
    targetSelector: ".dashboard-charts-section",
    position: "top",
  },
  {
    id: "management-menu",
    title: "Management Tools",
    description:
      "As an admin, you have access to Employee and Content Management under the Management menu. Click 'Management' in the sidebar to expand it.",
    targetSelector: "#tutorial-management-menu",
    position: "right",
  },
  {
    id: "goto-employees",
    title: "Employee Management",
    description:
      "This is where you manage everyone in the system — add, edit, or remove employees. Click 'Employees' under Management to continue.",
    targetSelector: "a[href='/employee-management']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Employees' under Management in the sidebar →",
  },
  {
    id: "emp-search",
    title: "Search Bar",
    description:
      "Type any name, email, or ID to instantly find an employee. The list filters in real time as you type.",
    targetSelector: ".employee-search-bar",
    position: "bottom",
  },
  {
    id: "emp-filter",
    title: "Filter Button",
    description:
      "Narrow the list by position, department, or access level. Filters stack — combine as many as you need.",
    targetSelector: ".employee-filter-button",
    position: "bottom",
  },
  {
    id: "emp-table",
    title: "Employee Table",
    description:
      "Each row shows a snapshot of the employee. Click a row to open their full profile, or use the action icons to edit or remove them.",
    targetSelector: ".employee-table",
    position: "top",
  },
  {
    id: "emp-add",
    title: "Add Employee",
    description:
      "Use 'New Employee' to onboard someone new. You'll fill in their details and assign their role and department.",
    targetSelector: ".add-employee-button",
    position: "left",
  },
  {
    id: "goto-content",
    title: "Content Library",
    description:
      "The Content page is where all documents live. You can search, filter, preview, download, or check them out for editing. Click 'Content' under Management to continue.",
    targetSelector: "a[href='/content-management']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Content' under Management in the sidebar →",
  },
  {
    id: "content-search",
    title: "Search & Filters",
    description:
      "Search by filename or keyword, then narrow results by position, file type, or date.",
    targetSelector: ".content-search-bar",
    position: "bottom",
  },
  {
    id: "content-filter",
    title: "Filter Button",
    description:
      "Use the Filter button to narrow content by position, file type, or tags.",
    targetSelector: ".content-filter-button",
    position: "bottom",
  },
  {
    id: "content-table",
    title: "Document List",
    description:
      "Each row shows the file name, type, assigned role, and last modified date. Click the eye icon to preview or the download icon to save locally.",
    targetSelector: ".content-table",
    position: "top",
  },
  {
    id: "content-upload",
    title: "Upload New Content",
    description:
      "Use 'New Content' to add new files. You can assign them to a role and add metadata during the upload flow.",
    targetSelector: ".content-upload-button",
    position: "left",
  },
  {
    id: "goto-approvals",
    title: "Approvals Queue",
    description:
      "The Approvals Queue is where you make final decisions on insurance claims after an underwriter has reviewed them. Click 'Approvals' in the sidebar to continue.",
    targetSelector: "a[href='/approvals']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Approvals' in the sidebar →",
  },
  {
    id: "approvals-list",
    title: "Claims List",
    description:
      "Each item shows the claim ID, claimant, amount, and the underwriter who reviewed it.",
    targetSelector: ".approvals-list",
    position: "right",
  },
  {
    id: "approvals-actions",
    title: "Approve or Deny",
    description:
      "Once you've reviewed a claim, hit Approve to mark it resolved or Deny to send it back. All decisions are logged.",
    targetSelector: ".approvals-action-buttons",
    position: "top",
  },
  {
    id: "goto-activity",
    title: "Activity Log",
    description:
      "The Activity page shows a full timeline of every action on the platform — who edited what, when they logged in, and more. Click 'Activity' in the sidebar.",
    targetSelector: "a[href='/activity']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Activity' in the sidebar →",
  },
  {
    id: "activity-filters",
    title: "Filter by Type or User",
    description:
      "Use the filter buttons to narrow by action type (Login, Edit, Upload) or view all activity.",
    targetSelector: ".activity-filters",
    position: "bottom",
  },
  {
    id: "activity-timeline",
    title: "Activity Timeline",
    description:
      "Each entry shows who did what and when. Scroll to see the full history.",
    targetSelector: ".activity-timeline",
    position: "top",
  },
  {
    id: "goto-calendar",
    title: "Calendar",
    description:
      "The Calendar shows scheduled events, policy deadlines, and document expirations. Click 'Calendar' in the sidebar.",
    targetSelector: "a[href='/calendar']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Calendar' in the sidebar →",
  },
  {
    id: "calendar-nav",
    title: "Navigate Dates",
    description:
      "Use the arrows to move between months, or click 'Today' to jump back to the current date.",
    targetSelector: ".calendar-nav",
    position: "bottom",
  },
  {
    id: "calendar-grid",
    title: "Calendar Events",
    description:
      "Events are color coded by category. Click any event to see its full details including expiration times.",
    targetSelector: ".calendar-grid",
    position: "top",
  },
  {
    id: "profile-menu",
    title: "Your Account",
    description:
      "Click your name at the bottom of the sidebar to access your profile, settings (including dark mode), and to log out.",
    targetSelector: "#resources-button",
    position: "top",
  },
  {
    id: "finish",
    title: "You're all set! 🎉",
    description:
      "That's the full tour! You now know how to navigate iBank as an Admin manage employees, content, approvals, activity, and your account. You can restart this tutorial anytime from Settings.",
    position: "center",
  },
];

// ─── Underwriter Tour ─────────────────────────────────────────────────────────

const UNDERWRITER_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to iBank! 👋",
    description:
      "This guided tour will walk you through the platform as an Underwriter. You'll learn how to navigate, review risk, manage content, and use your account. Click Next to begin.",
    position: "center",
  },
  {
    id: "sidebar",
    title: "Your Navigation Hub",
    description:
      "This is the sidebar your main way to move around iBank. You can collapse it using the arrow button at the top.",
    targetSelector: ".Sidebar",
    position: "right",
  },
  {
    id: "goto-dashboard",
    title: "Dashboard",
    description:
      "The Dashboard gives you an overview of recent activity and platform stats. Click 'Dashboard' in the sidebar to continue.",
    targetSelector: "a[href='/dashboard']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Dashboard' in the sidebar to continue →",
  },
  {
    id: "dashboard-demographics",
    title: "Employee Demographics",
    description: "This pie chart breaks down your workforce by role.",
    targetSelector: ".employee-demographics-card",
    position: "right",
  },
  {
    id: "dashboard-activity",
    title: "Recent Activity",
    description:
      "A live feed of the latest actions on the platform with timestamps.",
    targetSelector: ".recent-activity-card",
    position: "left",
  },
  {
    id: "dashboard-charts",
    title: "Activity Charts",
    description:
      "These charts show employee activity over time and file type breakdowns.",
    targetSelector: ".dashboard-charts-section",
    position: "top",
  },
  {
    id: "goto-content",
    title: "Content Manager",
    description:
      "The Content Manager is where all your documents live. You can search, filter, preview, and download files. Click 'Content Manager' in the sidebar.",
    targetSelector: "a[href='/library']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Content Manager' in the sidebar →",
  },
  {
    id: "content-search",
    title: "Search & Filters",
    description:
      "Search by filename or keyword, then narrow results by file type or date.",
    targetSelector: ".content-search-bar",
    position: "bottom",
  },
  {
    id: "content-table",
    title: "Document List",
    description:
      "Each row shows the file name, type, and last modified date. Click the eye icon to preview or download icon to save.",
    targetSelector: ".content-table",
    position: "top",
  },
  {
    id: "goto-risk",
    title: "Risk Review",
    description:
      "This is your most important page. The Risk Review queue shows all pending insurance claims for you to evaluate. Click 'Risk Review' in the sidebar.",
    targetSelector: "a[href='/risk-review']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Risk Review' in the sidebar →",
  },
  {
    id: "risk-cards",
    title: "Claim Cards",
    description:
      "Each card shows the claim type, claimant, and incident date. Click a card to expand it and read the full details.",
    targetSelector: ".risk-review-list",
    position: "top",
    requiresInteraction: true,
    interactionHint:
      "Click on any claim card to expand it, then Next will unlock →",
  },
  {
    id: "risk-notes",
    title: "Risk Assessment Notes",
    description:
      "After reviewing a claim, write your risk evaluation notes in the text field inside the expanded card.",
    targetSelector: ".risk-notes-field",
    position: "top",
  },
  {
    id: "risk-actions",
    title: "Clear or Flag",
    description:
      "'Clear Risk' means the claim passes your review. 'Flag Risk' marks it as needing further attention.",
    targetSelector: ".risk-action-buttons",
    position: "top",
  },
  {
    id: "risk-submit",
    title: "Submit Assessments",
    description:
      "Once you've reviewed all the claims you want to action, hit 'Submit Risk Assessments' to send them through.",
    targetSelector: ".risk-submit-button",
    position: "top",
  },
  {
    id: "goto-activity",
    title: "Activity Log",
    description:
      "The Activity page shows a timeline of platform actions. Click 'Activity' in the sidebar.",
    targetSelector: "a[href='/activity']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Activity' in the sidebar →",
  },
  {
    id: "activity-timeline",
    title: "Activity Timeline",
    description: "Each entry shows who did what and when.",
    targetSelector: ".activity-timeline",
    position: "top",
  },
  {
    id: "goto-calendar",
    title: "Calendar",
    description:
      "The Calendar shows document expirations and deadlines. Click 'Calendar' in the sidebar.",
    targetSelector: "a[href='/calendar']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Calendar' in the sidebar →",
  },
  {
    id: "calendar-grid",
    title: "Calendar Events",
    description:
      "Events are color coded by category. Click any event to see its full details.",
    targetSelector: ".calendar-grid",
    position: "top",
  },
  {
    id: "profile-menu",
    title: "Your Account",
    description:
      "Click your name at the bottom of the sidebar to access your profile, settings, and to log out.",
    targetSelector: "#resources-button",
    position: "top",
  },
  {
    id: "finish",
    title: "You're all set! 🎉",
    description:
      "That's the full tour! You now know how to navigate iBank as an Underwriter review risk, manage content, and customise your experience. You can restart this tutorial anytime from Settings.",
    position: "center",
  },
];

// ─── Other Roles Tour ─────────────────────────────────────────────────────────

const OTHER_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to iBank! 👋",
    description:
      "This guided tour will walk you through the platform. You'll learn how to navigate, manage your documents, submit claims, and use your account. Click Next to begin.",
    position: "center",
  },
  {
    id: "sidebar",
    title: "Your Navigation Hub",
    description:
      "This is the sidebar your main way to move around iBank. You can collapse it using the arrow button at the top.",
    targetSelector: ".Sidebar",
    position: "right",
  },
  {
    id: "goto-dashboard",
    title: "Dashboard",
    description:
      "The Dashboard gives you an overview of recent activity and your assigned content. Click 'Dashboard' in the sidebar to continue.",
    targetSelector: "a[href='/dashboard']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Dashboard' in the sidebar to continue →",
  },
  {
    id: "dashboard-activity",
    title: "Recent Activity",
    description:
      "A live feed of the latest actions on the platform with timestamps.",
    targetSelector: ".recent-activity-card",
    position: "left",
  },
  {
    id: "dashboard-role-cards",
    title: "Content by Role",
    description:
      "These cards show the total number of documents assigned to each role.",
    targetSelector: ".role-count-cards",
    position: "top",
  },
  {
    id: "goto-content",
    title: "Content Manager",
    description:
      "The Content Manager is where all your documents live. You can search, filter, preview, and download files. Click 'Content Manager' in the sidebar.",
    targetSelector: "a[href='/library']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Content Manager' in the sidebar →",
  },
  {
    id: "content-search",
    title: "Search & Filters",
    description:
      "Search by filename or keyword, then narrow results by file type or date.",
    targetSelector: ".content-search-bar",
    position: "bottom",
  },
  {
    id: "content-table",
    title: "Document List",
    description:
      "Each row shows the file name, type, and last modified date. Click the eye icon to preview or the download icon to save locally.",
    targetSelector: ".content-table",
    position: "top",
  },
  {
    id: "goto-claims",
    title: "Make a Claim",
    description:
      "Need to submit an insurance claim? Head to 'Make a Claim' in the sidebar. Click it to continue.",
    targetSelector: "a[href='/claims']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Make a Claim' in the sidebar →",
  },
  {
    id: "claims-form",
    title: "Claim Form",
    description:
      "Select the claim type, describe the incident, and fill in the required fields. The more detail you provide, the faster your claim can be reviewed.",
    targetSelector: ".claims-form",
    position: "right",
  },
  {
    id: "claims-attachments",
    title: "Attachments",
    description:
      "Attach supporting documents, photos, or files to strengthen your claim.",
    targetSelector: ".claims-attachments",
    position: "top",
  },
  {
    id: "claims-submit",
    title: "Submit",
    description:
      "Once you're happy with your claim, hit Submit. You'll be able to track its status as it moves through review.",
    targetSelector: ".claims-submit-button",
    position: "top",
  },
  {
    id: "goto-activity",
    title: "Activity Log",
    description:
      "The Activity page shows a timeline of platform actions relevant to your account. Click 'Activity' in the sidebar.",
    targetSelector: "a[href='/activity']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Activity' in the sidebar →",
  },
  {
    id: "activity-timeline",
    title: "Activity Timeline",
    description: "Each entry shows who did what and when.",
    targetSelector: ".activity-timeline",
    position: "top",
  },
  {
    id: "goto-calendar",
    title: "Calendar",
    description:
      "The Calendar shows scheduled events and document deadlines. Click 'Calendar' in the sidebar.",
    targetSelector: "a[href='/calendar']",
    position: "right",
    requiresNavigation: true,
    navigationHint: "Click 'Calendar' in the sidebar →",
  },
  {
    id: "calendar-grid",
    title: "Calendar Events",
    description:
      "Events are color coded by category. Click any event to see its full details.",
    targetSelector: ".calendar-grid",
    position: "top",
  },
  {
    id: "profile-menu",
    title: "Your Account",
    description:
      "Click your name at the bottom of the sidebar to access your profile, settings, and to log out.",
    targetSelector: "#resources-button",
    position: "top",
  },
  {
    id: "finish",
    title: "You're all set! 🎉",
    description:
      "That's the full tour! You now know how to navigate iBank manage your documents, submit claims, and customise your experience. You can restart this tutorial anytime from Settings.",
    position: "center",
  },
];

export const TOUR_STEPS_BY_ROLE: Record<UserRole, TutorialStep[]> = {
  admin: ADMIN_STEPS,
  underwriter: UNDERWRITER_STEPS,
  other: OTHER_STEPS,
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

const WELCOME_TOUR_KEY = "ibank_seen_welcome_tour";

function hasSeenWelcomeTour(): boolean {
  try {
    return localStorage.getItem(WELCOME_TOUR_KEY) === "true";
  } catch {
    return false;
  }
}

function markWelcomeTourSeen() {
  try {
    localStorage.setItem(WELCOME_TOUR_KEY, "true");
  } catch (_e) {
    // ignore
  }
}

export function resetAllTours() {
  try {
    localStorage.removeItem(WELCOME_TOUR_KEY);
  } catch (_e) {
    // ignore
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface TutorialContextType {
  showPrompt: boolean;
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  triggerWelcomeTour: (role: UserRole) => void;
  startTutorial: () => void;
  skipTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTutorial: () => void;
  triggerPrompt: (force?: boolean) => void;
  dismissPrompt: () => void;
  resetTours: () => void;
  // kept for compatibility
  checkAndPrompt: (route: string, force?: boolean) => void;
  promptPageId: string | null;
  isWelcomeTour: boolean;
}

const TutorialContext = createContext<TutorialContextType>({
  showPrompt: false,
  isActive: false,
  currentStep: 0,
  steps: [],
  triggerWelcomeTour: () => {},
  startTutorial: () => {},
  skipTutorial: () => {},
  nextStep: () => {},
  prevStep: () => {},
  endTutorial: () => {},
  triggerPrompt: () => {},
  dismissPrompt: () => {},
  resetTours: () => {},
  checkAndPrompt: () => {},
  promptPageId: null,
  isWelcomeTour: true,
});

export const useTutorial = () => useContext(TutorialContext);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const { session, refreshSession } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [pendingSteps, setPendingSteps] = useState<TutorialStep[]>([]);
  const [promptMode, setPromptMode] = useState<"auto" | "manual" | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [activeTour, setActiveTour] = useState<TutorialStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedThisSession, setCompletedThisSession] = useState(false);
  const tutorialDoneRef = useRef(false);
  const autoPromptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tutorialDone =
    (session?.settings.tutorialDone ?? false) || completedThisSession;

  const clearAutoPromptTimer = useCallback(() => {
    if (!autoPromptTimerRef.current) {
      return;
    }

    clearTimeout(autoPromptTimerRef.current);
    autoPromptTimerRef.current = null;
  }, []);

  useEffect(() => {
    tutorialDoneRef.current = tutorialDone;

    if (tutorialDone) {
      clearAutoPromptTimer();
    }

    if (tutorialDone && promptMode === "auto") {
      setShowPrompt(false);
      setPendingSteps([]);
      setPromptMode(null);
    }
  }, [clearAutoPromptTimer, promptMode, tutorialDone]);

  useEffect(() => {
    return () => {
      clearAutoPromptTimer();
    };
  }, [clearAutoPromptTimer]);

  useEffect(() => {
    if (!session) {
      clearAutoPromptTimer();
      setCompletedThisSession(false);
      setShowPrompt(false);
      setPendingSteps([]);
      setPromptMode(null);
      setIsActive(false);
      setActiveTour([]);
      setCurrentStep(0);
    }
  }, [clearAutoPromptTimer, session]);

  const getSessionRole = useCallback((): UserRole => {
    if (!session) return "other";
    if (session.permissions?.can_manage_employees) return "admin";
    if (session.position === "UNDERWRITER") return "underwriter";
    return "other";
  }, [session]);

  const persistTutorialDone = useCallback(async () => {
    if (!session || completedThisSession) {
      return;
    }

    setCompletedThisSession(true);

    try {
      const res = await fetch(API_ENDPOINTS.ACCOUNT_SETTINGS, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tutorialDone: true }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update tutorial preference: ${res.status}`);
      }

      await refreshSession();
    } catch (error) {
      console.error(error);
      setCompletedThisSession(false);
    }
  }, [completedThisSession, refreshSession, session]);

  const triggerWelcomeTour = useCallback(
    (role: UserRole) => {
      if (tutorialDone || showPrompt || isActive) return;
      clearAutoPromptTimer();
      const steps = TOUR_STEPS_BY_ROLE[role];
      autoPromptTimerRef.current = setTimeout(() => {
        autoPromptTimerRef.current = null;
        if (tutorialDoneRef.current) return;
        setPendingSteps(steps);
        setPromptMode("auto");
        setShowPrompt(true);
      }, 600);
    },
    [clearAutoPromptTimer, isActive, showPrompt, tutorialDone],
  );

  // No-op for per-page prompts — we only have one tour now
  const checkAndPrompt = useCallback(
    (_route: string, force = false) => {
      if (!force || !session) return;
      // force = restart from settings, re-show the prompt
      clearAutoPromptTimer();
      setPendingSteps(TOUR_STEPS_BY_ROLE[getSessionRole()]);
      setPromptMode("manual");
      setShowPrompt(true);
    },
    [clearAutoPromptTimer, getSessionRole, session],
  );

  const startTutorial = useCallback(() => {
    if (pendingSteps.length === 0) return;
    clearAutoPromptTimer();
    setShowPrompt(false);
    setPromptMode(null);
    setActiveTour(pendingSteps);
    setCurrentStep(0);
    setIsActive(true);
  }, [clearAutoPromptTimer, pendingSteps]);

  const skipTutorial = useCallback(() => {
    clearAutoPromptTimer();
    setShowPrompt(false);
    setPendingSteps([]);
    setPromptMode(null);
    void persistTutorialDone();
  }, [clearAutoPromptTimer, persistTutorialDone]);

  const nextStep = useCallback(() => {
    const next = currentStep + 1;
    if (next >= activeTour.length) {
      setIsActive(false);
      setActiveTour([]);
      setCurrentStep(0);
      void persistTutorialDone();
      return;
    }

    setCurrentStep((prev) => {
      return prev + 1;
    });
  }, [activeTour.length, currentStep, persistTutorialDone]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const endTutorial = useCallback(() => {
    setIsActive(false);
    setActiveTour([]);
    setCurrentStep(0);
    void persistTutorialDone();
  }, [persistTutorialDone]);

  const resetTours = useCallback(() => {
    resetAllTours();
  }, []);

  const triggerPrompt = useCallback(
    (force = false) => {
      if (!session) return;
      if (!force && tutorialDone) return;
      if (force) {
        clearAutoPromptTimer();
      }
      setPendingSteps(TOUR_STEPS_BY_ROLE[getSessionRole()]);
      setPromptMode(force ? "manual" : "auto");
      setShowPrompt(true);
    },
    [clearAutoPromptTimer, getSessionRole, session, tutorialDone],
  );
  const dismissPrompt = useCallback(() => {
    setShowPrompt(false);
    setPromptMode(null);
  }, []);

  return (
    <TutorialContext.Provider
      value={{
        showPrompt,
        isActive,
        currentStep,
        steps: activeTour,
        triggerWelcomeTour,
        startTutorial,
        skipTutorial,
        nextStep,
        prevStep,
        endTutorial,
        triggerPrompt,
        dismissPrompt,
        resetTours,
        checkAndPrompt,
        promptPageId: null,
        isWelcomeTour: true,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export default TutorialContext;
