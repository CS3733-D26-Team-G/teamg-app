import React, { createContext, useContext, useState, useCallback } from "react";

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  requiresNavigation?: boolean;
  navigationHint?: string;
  route?: string;
}

export interface PageTutorial {
  pageId: string;
  pageTitle: string;
  pageDescription: string;
  steps: TutorialStep[];
}

// ─── Role type ────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "underwriter" | "other";

// ─── Welcome tour steps per role ─────────────────────────────────────────────

export const WELCOME_TOUR_STEPS: Record<UserRole, TutorialStep[]> = {
  admin: [
    {
      id: "welcome",
      title: "Welcome to iBank! 👋",
      description:
        "This quick tour will show you around the platform as an Admin. You'll learn how to navigate, manage employees and content, review approvals, and use your account. Click Next to begin.",
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
        "The Dashboard gives you a bird's-eye view of the organisation: employee demographics, recent activity, and content counts by role. Click Dashboard in the sidebar to continue.",
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
        "The Content page is where all documents live. You can search, filter by position or file type, preview files, download them, or check them out for editing.",
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
      id: "approvals",
      title: "Approvals Queue",
      description:
        "The Approvals Queue is where you make final decisions on insurance claims. After an underwriter has reviewed a claim and cleared the risk, it lands here for your approval.",
      targetSelector: "a[href='/approvals']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Approvals' in the sidebar →",
    },
    {
      id: "activity",
      title: "Activity Log",
      description:
        "The Activity page shows a full timeline of every action taken on the platform — who edited what, when they logged in, and more.",
      targetSelector: "a[href='/activity']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Activity' in the sidebar →",
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
        "That's the full tour! You now know how to navigate iBank as an Admin — manage employees, content, approvals, and your account. You can restart this tutorial anytime from Settings.",
      position: "center",
    },
  ],

  underwriter: [
    {
      id: "welcome",
      title: "Welcome to iBank! 👋",
      description:
        "This quick tour will show you around the platform as an Underwriter. You'll learn how to navigate, review risk, and manage your account. Click Next to begin.",
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
        "The Dashboard gives you an overview of recent platform activity and your assigned content. Click Dashboard in the sidebar to continue.",
      targetSelector: "a[href='/dashboard']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Dashboard' in the sidebar to continue →",
    },
    {
      id: "content-manager",
      title: "Content Manager",
      description:
        "The Content Manager is where all your documents live. You can search, filter, preview, and download files assigned to your role.",
      targetSelector: "a[href='/library']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Content Manager' in the sidebar →",
    },
    {
      id: "risk-review",
      title: "Risk Review",
      description:
        "This is your most important page. The Risk Review queue shows all pending insurance claims for you to evaluate. You can read the full details, write risk notes, and clear or flag each claim before submitting your assessments.",
      targetSelector: "a[href='/risk-review']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Risk Review' in the sidebar →",
    },
    {
      id: "activity",
      title: "Activity Log",
      description:
        "The Activity page shows a timeline of platform actions — logins, edits, and more.",
      targetSelector: "a[href='/activity']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Activity' in the sidebar →",
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
        "That's the full tour! You now know how to navigate iBank as an Underwriter — review risk, manage content, and customise your experience. You can restart this tutorial anytime from Settings.",
      position: "center",
    },
  ],

  other: [
    {
      id: "welcome",
      title: "Welcome to iBank! 👋",
      description:
        "This quick tour will show you around the platform. You'll learn how to navigate, manage your documents, submit claims, and use your account. Click Next to begin.",
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
        "The Dashboard gives you an overview of recent platform activity and your assigned content. Click Dashboard in the sidebar to continue.",
      targetSelector: "a[href='/dashboard']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Dashboard' in the sidebar to continue →",
    },
    {
      id: "content-manager",
      title: "Content Manager",
      description:
        "The Content Manager is where all your documents live. You can search, filter by file type, preview, and download files assigned to your role.",
      targetSelector: "a[href='/library']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Content Manager' in the sidebar →",
    },
    {
      id: "claims",
      title: "Make a Claim",
      description:
        "Need to submit an insurance claim? Head to 'Make a Claim' in the sidebar. You can fill in the details, attach supporting documents, and track the status of your submission.",
      targetSelector: "a[href='/claims']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Make a Claim' in the sidebar →",
    },
    {
      id: "activity",
      title: "Activity Log",
      description:
        "The Activity page shows a timeline of platform actions relevant to your account.",
      targetSelector: "a[href='/activity']",
      position: "right",
      requiresNavigation: true,
      navigationHint: "Click 'Activity' in the sidebar →",
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
        "That's the full tour! You now know how to navigate iBank — manage your documents, submit claims, and customise your experience. You can restart this tutorial anytime from Settings.",
      position: "center",
    },
  ],
};

// ─── Per-page tutorial definitions ───────────────────────────────────────────

export const PAGE_TUTORIALS: Record<string, PageTutorial> = {
  "/dashboard": {
    pageId: "dashboard",
    pageTitle: "Dashboard",
    pageDescription: "...",
    steps: [
      {
        id: "dashboard-welcome",
        title: "Dashboard Overview 📊",
        description:
          "Welcome to the Dashboard! Everything important is surfaced here at a glance.",
        position: "center",
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
          "A live feed of the latest actions on the platform logins, edits, and uploads with timestamps.",
        targetSelector: ".recent-activity-card",
        position: "left",
      },
      {
        id: "dashboard-role-cards",
        title: "Content by Role",
        description:
          "Each card shows the total number of documents assigned to that role.",
        targetSelector: ".role-count-cards",
        position: "top",
      },
      {
        id: "dashboard-activity-charts",
        title: "Employee Activity & File Types",
        description:
          "The Employee Activity bar chart shows edits, checkouts, and deletions. File Types shows the breakdown of document formats in the system.",
        targetSelector: ".dashboard-activity-charts",
        position: "top",
      },
      {
        id: "dashboard-edits-chart",
        title: "Employee Edits By Day",
        description:
          "This line chart tracks content edits over time broken down by role.",
        targetSelector: ".dashboard-edits-chart",
        position: "top",
      },
    ],
  },

  "/employee-management": {
    pageId: "employee-management",
    pageTitle: "Employee Management",
    pageDescription:
      "Add, edit, and remove employees. Filter by department or position and manage access levels.",
    steps: [
      {
        id: "emp-welcome",
        title: "Employee Management 👥",
        description:
          "This is where you manage everyone in the system. You can add new employees, edit existing ones, or remove them entirely.",
        position: "center",
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
          "Narrow the list by position, department, or access level. Filters can stack you can combine as many as you need.",
        targetSelector: ".employee-filter-button",
        position: "bottom",
      },
      {
        id: "emp-table",
        title: "Employee Table",
        description:
          "Each row shows a snapshot of the employee. Click a row to open their full profile, or use the action icons to edit or remove them directly.",
        targetSelector: ".employee-table",
        position: "top",
      },
      {
        id: "emp-add",
        title: "Add Employee",
        description:
          "Use the 'Add Employee' button to onboard someone new. You'll fill in their details and assign their role and department.",
        targetSelector: ".add-employee-button",
        position: "left",
      },
    ],
  },

  "/content-management": {
    pageId: "content-management",
    pageTitle: "Content Library",
    pageDescription:
      "Browse, search, preview, download, and manage all documents stored in the platform.",
    steps: [
      {
        id: "content-welcome",
        title: "Content Library 📁",
        description:
          "All documents and files live here. You can search, filter, preview, download, or check out files for editing.",
        position: "center",
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
        id: "content-table",
        title: "Document List",
        description:
          "Each row shows the file name, type, assigned role, and last modified date. Click the eye icon to preview, or the download icon to save locally.",
        targetSelector: ".content-table",
        position: "top",
      },
      {
        id: "content-upload",
        title: "Upload New Content",
        description:
          "Use the Upload button to add new files. You can assign them to a role and add metadata during the upload flow.",
        targetSelector: ".content-upload-button",
        position: "left",
      },
    ],
  },

  "/library": {
    pageId: "library",
    pageTitle: "Content Manager",
    pageDescription:
      "Browse, search, preview, and download all documents assigned to your role.",
    steps: [
      {
        id: "library-welcome",
        title: "Content Manager 📁",
        description:
          "All your documents live here. You can search, filter by file type, preview, and download files.",
        position: "center",
      },
      {
        id: "library-search",
        title: "Search & Filters",
        description:
          "Search by filename or keyword, then narrow results by file type or date.",
        targetSelector: ".content-search-bar",
        position: "bottom",
      },
      {
        id: "library-table",
        title: "Document List",
        description:
          "Each row shows the file name, type, and last modified date. Click the eye icon to preview or the download icon to save locally.",
        targetSelector: ".content-table",
        position: "top",
      },
    ],
  },

  "/approvals": {
    pageId: "approvals",
    pageTitle: "Approvals Queue",
    pageDescription:
      "Review insurance claims that have been cleared by underwriters and make final approve/deny decisions.",
    steps: [
      {
        id: "approvals-welcome",
        title: "Approvals Queue ✅",
        description:
          "This is where insurance claims land after an underwriter has reviewed and cleared the risk. Your job is the final call: approve or deny.",
        position: "center",
      },
      {
        id: "approvals-list",
        title: "Claims List",
        description:
          "Each item shows the claim ID, claimant, amount, and the underwriter who reviewed it. Claims are sorted by submission date.",
        targetSelector: ".approvals-list",
        position: "right",
      },
      {
        id: "approvals-detail",
        title: "Claim Detail Panel",
        description:
          "Click any claim to open the full detail view to view policy information, risk notes from the underwriter, and any attached documents.",
        targetSelector: ".approvals-detail-panel",
        position: "left",
      },
      {
        id: "approvals-actions",
        title: "Approve or Deny",
        description:
          "Once you've reviewed the claim, hit Approve to mark it resolved or Deny to send it back. Denied claims are logged with your decision.",
        targetSelector: ".approvals-action-buttons",
        position: "top",
      },
    ],
  },

  "/risk-review": {
    pageId: "risk-review",
    pageTitle: "Risk Review",
    pageDescription:
      "Review pending insurance claims, write risk notes, and clear or flag each one before submitting your assessments.",
    steps: [
      {
        id: "risk-welcome",
        title: "Risk Review Queue ⚖️",
        description:
          "This is your primary workspace as an Underwriter. All pending claims that need risk evaluation appear here.",
        position: "center",
      },
      {
        id: "risk-cards",
        title: "Claim Cards",
        description:
          "Each card shows the claim type, claimant, and incident date. Click a card to expand it and read the full details.",
        targetSelector: ".risk-review-list",
        position: "top",
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
          "'Clear Risk' means the claim passes your review. 'Flag Risk' marks it as needing further attention. Both send it to the next stage.",
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
    ],
  },

  "/claims": {
    pageId: "claims",
    pageTitle: "Make a Claim",
    pageDescription:
      "Submit a new insurance claim, attach supporting documents, and track the status of your submissions.",
    steps: [
      {
        id: "claims-welcome",
        title: "Make a Claim 📋",
        description:
          "This is where you submit insurance claims. Fill in the details, attach any supporting evidence, and track your submissions.",
        position: "center",
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
          "You can attach supporting documents, photos, or files to strengthen your claim. Supported formats include PDF, JPG, and PNG.",
        targetSelector: ".claims-attachments",
        position: "top",
      },
      {
        id: "claims-submit",
        title: "Submit",
        description:
          "Once you're happy with your claim, hit Submit. You'll be able to track its status from this page as it moves through review.",
        targetSelector: ".claims-submit-button",
        position: "top",
      },
    ],
  },

  "/activity": {
    pageId: "activity",
    pageTitle: "Activity Log",
    pageDescription:
      "A full, searchable timeline of every action taken on the platform.",
    steps: [
      {
        id: "activity-welcome",
        title: "Activity Log 🕐",
        description:
          "Every action on the platform is recorded here — logins, file edits, employee changes, approvals, and more.",
        position: "center",
      },
      {
        id: "activity-filters",
        title: "Filter by Type or User",
        description:
          "Use the dropdowns to filter by action type (e.g. Login, Edit, Upload) or by a specific employee.",
        targetSelector: ".activity-filters",
        position: "bottom",
      },
      {
        id: "activity-timeline",
        title: "Activity Timeline",
        description:
          "Each entry shows who did what and when. Entries are color coded by type so you can scan quickly.",
        targetSelector: ".activity-timeline",
        position: "top",
      },
    ],
  },

  "/calendar": {
    pageId: "calendar",
    pageTitle: "Calendar",
    pageDescription:
      "View and manage scheduled events, deadlines, and important dates.",
    steps: [
      {
        id: "calendar-welcome",
        title: "Calendar 📅",
        description:
          "The Calendar gives you a clear view of scheduled events, policy deadlines, and team milestones.",
        position: "center",
      },
      {
        id: "calendar-nav",
        title: "Navigate Dates",
        description: "Use the arrows to move between months.",
        targetSelector: ".calendar-nav",
        position: "bottom",
      },
      {
        id: "calendar-events",
        title: "Events",
        description:
          "Click any event to see its full details. Colour coding indicates the event category.",
        targetSelector: ".calendar-grid",
        position: "top",
      },
    ],
  },

  "/profile": {
    pageId: "profile",
    pageTitle: "My Account",
    pageDescription:
      "View your profile details, manage notification preferences, and update your password.",
    steps: [
      {
        id: "profile-welcome",
        title: "My Account ⚙️",
        description:
          "This is your personal account page. View your profile, manage notifications, and update your security settings.",
        position: "center",
      },
      {
        id: "profile-info",
        title: "Profile Information",
        description:
          "Your name, role, email, phone, and date of birth are shown here.",
        targetSelector: ".profile-info-section",
        position: "right",
      },
      {
        id: "profile-notifications",
        title: "Notification Preferences",
        description:
          "Toggle document expiration and update alerts on or off to control which notifications you receive.",
        targetSelector: ".notification-settings",
        position: "right",
      },
      {
        id: "profile-security",
        title: "Security",
        description: "Change your password here to keep your account secure.",
        targetSelector: ".security-settings",
        position: "right",
      },
    ],
  },

  "/settings": {
    pageId: "settings",
    pageTitle: "Settings",
    pageDescription:
      "Manage your appearance preferences and restart the platform tutorial.",
    steps: [
      {
        id: "settings-welcome",
        title: "Settings ⚙️",
        description:
          "This is where you can customise your experience, toggle dark mode or restart the guided tour.",
        position: "center",
      },
      {
        id: "settings-darkmode",
        title: "Dark Mode",
        description:
          "Switch between light and dark theme. Your preference is saved across sessions.",
        targetSelector: ".dark-mode-toggle",
        position: "right",
      },
      {
        id: "settings-tutorial",
        title: "Restart Tour",
        description:
          "Use the 'Restart Tour' button here to re-enable all the guided tours across every page.",
        targetSelector: ".reset-tutorials-button",
        position: "top",
      },
    ],
  },
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "ibank_seen_page_tours";
const WELCOME_TOUR_KEY = "ibank_seen_welcome_tour";

function getSeenTours(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markTourSeen(pageId: string) {
  try {
    const seen = getSeenTours();
    seen.add(pageId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
  } catch (_e) {
    //empty
  }
}

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
    //empty
  }
}

export function resetAllTours() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WELCOME_TOUR_KEY);
  } catch (_e) {
    //empty
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface TutorialContextType {
  showPrompt: boolean;
  promptPageId: string | null;
  isWelcomeTour: boolean;
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  checkAndPrompt: (route: string) => void;
  triggerWelcomeTour: (role: UserRole) => void;
  startTutorial: () => void;
  skipTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTutorial: () => void;
  triggerPrompt: () => void;
  dismissPrompt: () => void;
  resetTours: () => void;
}

const TutorialContext = createContext<TutorialContextType>({
  showPrompt: false,
  promptPageId: null,
  isWelcomeTour: false,
  isActive: false,
  currentStep: 0,
  steps: [],
  checkAndPrompt: () => {},
  triggerWelcomeTour: () => {},
  startTutorial: () => {},
  skipTutorial: () => {},
  nextStep: () => {},
  prevStep: () => {},
  endTutorial: () => {},
  triggerPrompt: () => {},
  dismissPrompt: () => {},
  resetTours: () => {},
});

export const useTutorial = () => useContext(TutorialContext);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptPageId, setPromptPageId] = useState<string | null>(null);
  const [isWelcomeTour, setIsWelcomeTour] = useState(false);
  const [pendingTour, setPendingTour] = useState<PageTutorial | null>(null);
  const [pendingWelcomeSteps, setPendingWelcomeSteps] = useState<
    TutorialStep[]
  >([]);

  const [isActive, setIsActive] = useState(false);
  const [activeTour, setActiveTour] = useState<PageTutorial | null>(null);
  const [welcomeStepsActive, setWelcomeStepsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const triggerWelcomeTour = useCallback((role: UserRole) => {
    if (hasSeenWelcomeTour()) return;
    const steps = WELCOME_TOUR_STEPS[role];
    setTimeout(() => {
      setPendingWelcomeSteps(steps);
      setIsWelcomeTour(true);
      setPromptPageId(null);
      setShowPrompt(true);
    }, 600);
  }, []);

  const checkAndPrompt = useCallback(
    (route: string) => {
      if (isActive || welcomeStepsActive || showPrompt) return;
      setShowPrompt(false);

      const tutorial = PAGE_TUTORIALS[route];
      if (!tutorial) return;

      const seen = getSeenTours();
      if (seen.has(tutorial.pageId)) return;

      setTimeout(() => {
        setIsWelcomeTour(false);
        setPendingTour(tutorial);
        setPromptPageId(tutorial.pageId);
        setShowPrompt(true);
      }, 600);
    },
    [isActive, welcomeStepsActive, showPrompt],
  );

  const startTutorial = useCallback(() => {
    setShowPrompt(false);

    if (isWelcomeTour) {
      markWelcomeTourSeen();
      setWelcomeStepsActive(true);
      setActiveTour({
        pageId: "welcome",
        pageTitle: "Welcome to iBank!",
        pageDescription: "",
        steps: pendingWelcomeSteps,
      });
      setCurrentStep(0);
      setIsActive(true);
    } else if (pendingTour) {
      markTourSeen(pendingTour.pageId);
      setActiveTour(pendingTour);
      setCurrentStep(0);
      setIsActive(true);
    }
  }, [isWelcomeTour, pendingTour, pendingWelcomeSteps]);

  const skipTutorial = useCallback(() => {
    if (isWelcomeTour) {
      markWelcomeTourSeen();
    } else if (pendingTour) {
      markTourSeen(pendingTour.pageId);
    }
    setShowPrompt(false);
    setPendingTour(null);
    setIsWelcomeTour(false);
  }, [isWelcomeTour, pendingTour]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (!activeTour) return 0;
      const next = prev + 1;
      if (next >= activeTour.steps.length) {
        setIsActive(false);
        setActiveTour(null);
        setWelcomeStepsActive(false);
        return 0;
      }
      return next;
    });
  }, [activeTour]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const endTutorial = useCallback(() => {
    setIsActive(false);
    setActiveTour(null);
    setWelcomeStepsActive(false);
    setCurrentStep(0);
  }, []);

  const triggerPrompt = useCallback(() => setShowPrompt(true), []);
  const dismissPrompt = useCallback(() => setShowPrompt(false), []);
  const resetTours = useCallback(() => resetAllTours(), []);

  return (
    <TutorialContext.Provider
      value={{
        showPrompt,
        promptPageId,
        isWelcomeTour,
        isActive,
        currentStep,
        steps: activeTour?.steps ?? [],
        checkAndPrompt,
        triggerWelcomeTour,
        startTutorial,
        skipTutorial,
        nextStep,
        prevStep,
        endTutorial,
        triggerPrompt,
        dismissPrompt,
        resetTours,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export default TutorialContext;
