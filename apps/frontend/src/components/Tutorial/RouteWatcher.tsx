import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTutorial } from "./TutorialContext";

export function RouteWatcher() {
  const location = useLocation();
  const { checkAndPrompt } = useTutorial();

  useEffect(() => {
    checkAndPrompt(location.pathname);
  }, [location.pathname]);

  return null;
}
