import { useEffect, useState, useCallback, useRef } from "react";
import { Box, Button, Typography, Stack, LinearProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorial } from "./TutorialContext";
import type { TutorialStep } from "./TutorialContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigationIcon from "@mui/icons-material/Navigation";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import LockIcon from "@mui/icons-material/Lock";
import { useLocation, useNavigate } from "react-router-dom";

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 10;

function getHighlightRect(selector: string): HighlightRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top - PADDING,
    left: rect.left - PADDING,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2,
  };
}

function isElementVisible(selector: string): boolean {
  const el = document.querySelector(selector);
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  // Element must have a real size and be in the viewport
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.top < window.innerHeight &&
    rect.bottom > 0
  );
}

function extractPathFromSelector(selector: string): string | null {
  const match = selector.match(/a\[href=['"]([^'"]+)['"]\]/);
  return match ? match[1] : null;
}

function TooltipCard({
  step,
  stepIndex,
  totalSteps,
  highlightRect,
  onNext,
  onPrev,
  onEnd,
  isNavigationStep,
  interactionUnlocked,
}: {
  step: TutorialStep;
  stepIndex: number;
  totalSteps: number;
  highlightRect: HighlightRect | null;
  onNext: () => void;
  onPrev: () => void;
  onEnd: () => void;
  isNavigationStep: boolean;
  interactionUnlocked: boolean;
}) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const isCentered = step.position === "center" || !highlightRect;
  const isInteractionStep = !!step.requiresInteraction;
  const nextDisabled = isInteractionStep && !interactionUnlocked;

  const tooltipStyle: React.CSSProperties = {};

  if (isCentered || !highlightRect) {
    tooltipStyle.top = "50%";
    tooltipStyle.left = "50%";
  } else {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tooltipW = 340;
    const tooltipH = 260;

    if (step.position === "right") {
      tooltipStyle.left = Math.min(
        highlightRect.left + highlightRect.width + 20,
        vw - tooltipW - 16,
      );
      tooltipStyle.top = Math.max(
        8,
        Math.min(
          highlightRect.top + highlightRect.height / 2 - tooltipH / 2,
          vh - tooltipH - 16,
        ),
      );
    } else if (step.position === "left") {
      tooltipStyle.left = Math.max(8, highlightRect.left - tooltipW - 20);
      tooltipStyle.top = Math.max(
        8,
        Math.min(
          highlightRect.top + highlightRect.height / 2 - tooltipH / 2,
          vh - tooltipH - 16,
        ),
      );
    } else if (step.position === "top") {
      tooltipStyle.left = Math.max(
        8,
        Math.min(
          highlightRect.left + highlightRect.width / 2 - tooltipW / 2,
          vw - tooltipW - 16,
        ),
      );
      tooltipStyle.top = Math.max(8, highlightRect.top - tooltipH - 20);
    } else {
      tooltipStyle.left = Math.max(
        8,
        Math.min(
          highlightRect.left + highlightRect.width / 2 - tooltipW / 2,
          vw - tooltipW - 16,
        ),
      );
      tooltipStyle.top = Math.min(
        vh - tooltipH - 16,
        highlightRect.top + highlightRect.height + 20,
      );
    }
  }

  const progress = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <Box
      component={motion.div}
      key={stepIndex}
      initial={{
        opacity: 0,
        scale: 0.9,
        x: isCentered ? "-50%" : 0,
        y: isCentered ? "-40%" : 12,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: isCentered ? "-50%" : 0,
        y: isCentered ? "-50%" : 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
        x: isCentered ? "-50%" : 0,
        y: isCentered ? "-60%" : -8,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      sx={{
        position: "fixed",
        zIndex: 9300,
        width: 340,
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow:
          "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
        ...tooltipStyle,
      }}
    >
      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          "height": 3,
          "backgroundColor": "rgba(255,255,255,0.15)",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg, #4a7aab, #82BFFF)",
          },
        }}
      />

      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1A1E4B 0%, #395176 100%)",
          px: 2.5,
          pt: 2,
          pb: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontFamily: "Rubik, sans-serif",
              mb: 0.25,
            }}
          >
            Step {stepIndex + 1} of {totalSteps}
          </Typography>
          <Typography
            sx={{
              color: "white",
              fontSize: "1.05rem",
              fontWeight: 700,
              fontFamily: "Rubik, sans-serif",
              lineHeight: 1.3,
            }}
          >
            {step.title}
          </Typography>
        </Box>

        <Box
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnd}
          sx={{
            "background": "rgba(255,255,255,0.12)",
            "border": "none",
            "borderRadius": "8px",
            "width": 30,
            "height": 30,
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "center",
            "cursor": "pointer",
            "color": "rgba(255,255,255,0.7)",
            "flexShrink": 0,
            "ml": 1,
            "&:hover": { background: "rgba(255,255,255,0.22)", color: "white" },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      {/* Body */}
      <Box
        sx={{ backgroundColor: "background.paper", px: 2.5, pt: 2, pb: 2.5 }}
      >
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "text.primary",
            lineHeight: 1.65,
            mb: isNavigationStep || isInteractionStep ? 1.5 : 2.5,
            fontFamily: "Rubik, sans-serif",
          }}
        >
          {step.description}
        </Typography>

        {/* Navigation hint banner */}
        {isNavigationStep && step.navigationHint && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              mb: 2,
              borderRadius: "10px",
              backgroundColor: "rgba(74,122,171,0.12)",
              border: "1px solid rgba(74,122,171,0.3)",
            }}
          >
            <NavigationIcon
              sx={{ fontSize: 15, color: "primary.main", flexShrink: 0 }}
            />
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: "primary.main",
                fontWeight: 600,
                fontFamily: "Rubik, sans-serif",
                lineHeight: 1.4,
              }}
            >
              {step.navigationHint}
            </Typography>
          </Box>
        )}

        {/* Interaction hint banner */}
        {isInteractionStep && (
          <Box
            component={motion.div}
            animate={
              !interactionUnlocked ? { opacity: [1, 0.6, 1] } : { opacity: 1 }
            }
            transition={
              !interactionUnlocked ? { repeat: Infinity, duration: 1.8 } : {}
            }
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              mb: 2,
              borderRadius: "10px",
              backgroundColor:
                interactionUnlocked ?
                  "rgba(46,125,50,0.12)"
                : "rgba(237,108,2,0.12)",
              border: `1px solid ${interactionUnlocked ? "rgba(46,125,50,0.4)" : "rgba(237,108,2,0.4)"}`,
              transition: "all 0.3s ease",
            }}
          >
            {interactionUnlocked ?
              <CheckCircleIcon
                sx={{ fontSize: 15, color: "success.main", flexShrink: 0 }}
              />
            : <TouchAppIcon
                sx={{ fontSize: 15, color: "warning.main", flexShrink: 0 }}
              />
            }
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: interactionUnlocked ? "success.main" : "warning.main",
                fontWeight: 600,
                fontFamily: "Rubik, sans-serif",
                lineHeight: 1.4,
              }}
            >
              {interactionUnlocked ?
                "Card expanded — you can continue!"
              : (step.interactionHint ??
                "Complete the action above to continue")
              }
            </Typography>
          </Box>
        )}

        <Stack
          direction="row"
          spacing={1}
        >
          {!isFirst && (
            <Button
              onClick={onPrev}
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />}
              sx={{
                "borderRadius": "10px",
                "textTransform": "none",
                "fontFamily": "Rubik, sans-serif",
                "fontWeight": 600,
                "fontSize": "0.82rem",
                "borderColor": "divider",
                "color": "text.secondary",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              Back
            </Button>
          )}

          <Button
            onClick={onNext}
            variant="contained"
            size="small"
            fullWidth
            disabled={nextDisabled}
            endIcon={
              nextDisabled ? <LockIcon />
              : isLast ?
                <CheckCircleIcon />
              : isNavigationStep ?
                <NavigationIcon />
              : <ArrowForwardIcon />
            }
            sx={{
              "borderRadius": "10px",
              "textTransform": "none",
              "fontFamily": "Rubik, sans-serif",
              "fontWeight": 700,
              "fontSize": "0.9rem",
              "py": 0.9,
              "background":
                nextDisabled ? undefined : (
                  "linear-gradient(135deg, #1A1E4B, #395176)"
                ),
              "boxShadow":
                nextDisabled ? "none" : "0 4px 14px rgba(57,81,118,0.4)",
              "&:hover": {
                background:
                  nextDisabled ? undefined : (
                    "linear-gradient(135deg, #0f1230, #2d4060)"
                  ),
                boxShadow:
                  nextDisabled ? "none" : "0 6px 18px rgba(57,81,118,0.55)",
              },
            }}
          >
            {nextDisabled ?
              "Waiting..."
            : isLast ?
              "Done"
            : isNavigationStep ?
              "Go there"
            : "Next"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default function TutorialOverlay() {
  const { isActive, currentStep, steps, nextStep, prevStep, endTutorial } =
    useTutorial();
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(
    null,
  );
  const [interactionUnlocked, setInteractionUnlocked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const rafRef = useRef<number | null>(null);
  const autoAdvancedRef = useRef<Set<string>>(new Set());

  const step = steps[currentStep] ?? null;

  // Reset interaction lock whenever step changes
  useEffect(() => {
    setInteractionUnlocked(false);
  }, [currentStep]);

  const measureTarget = useCallback(() => {
    if (!step?.targetSelector) {
      setHighlightRect(null);
      return;
    }
    setHighlightRect(getHighlightRect(step.targetSelector));

    // If this step requires interaction, poll until the target becomes visible
    if (step.requiresInteraction && step.targetSelector) {
      if (isElementVisible(step.targetSelector)) {
        setInteractionUnlocked(true);
      }
    }
  }, [step]);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(measureTarget, 150);
    return () => clearTimeout(t);
  }, [isActive, currentStep, location.pathname, measureTarget]);

  useEffect(() => {
    if (!isActive) return;
    const tick = () => {
      measureTarget();
      rafRef.current = requestAnimationFrame(tick);
    };
    // Tutorial targets move during route transitions and accordion animations,
    // so the spotlight tracks layout every frame while the tour is active.
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, measureTarget]);

  // Auto-advance when user manually navigates to the expected page
  useEffect(() => {
    if (!isActive || !step) return;
    if (!step.requiresNavigation || !step.targetSelector) return;

    const expectedPath = extractPathFromSelector(step.targetSelector);
    if (!expectedPath) return;

    if (location.pathname === expectedPath) {
      const key = `${currentStep}:${expectedPath}`;
      if (!autoAdvancedRef.current.has(key)) {
        autoAdvancedRef.current.add(key);
        setTimeout(() => {
          nextStep();
        }, 400);
      }
    }
  }, [location.pathname, isActive, step, currentStep, nextStep]);

  useEffect(() => {
    if (!isActive) {
      autoAdvancedRef.current.clear();
    }
  }, [isActive]);

  if (!isActive || !step) return null;

  const isNavigationStep = !!step.requiresNavigation;

  const handleNext = () => {
    if (isNavigationStep && step.targetSelector) {
      const path = extractPathFromSelector(step.targetSelector);
      if (path && location.pathname !== path) {
        navigate(path);
        return;
      }
    }
    nextStep();
  };

  const hasHighlight = !!highlightRect;

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {hasHighlight ?
            <>
              {/* Top */}
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                sx={{
                  position: "fixed",
                  zIndex: 9200,
                  pointerEvents: "none",
                  backgroundColor: "rgba(0,0,0,0.72)",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: highlightRect.top,
                }}
              />
              {/* Bottom */}
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                sx={{
                  position: "fixed",
                  zIndex: 9200,
                  pointerEvents: "none",
                  backgroundColor: "rgba(0,0,0,0.72)",
                  top: highlightRect.top + highlightRect.height,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              {/* Left */}
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                sx={{
                  position: "fixed",
                  zIndex: 9200,
                  pointerEvents: "none",
                  backgroundColor: "rgba(0,0,0,0.72)",
                  top: highlightRect.top,
                  left: 0,
                  width: highlightRect.left,
                  height: highlightRect.height,
                }}
              />
              {/* Right */}
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                sx={{
                  position: "fixed",
                  zIndex: 9200,
                  pointerEvents: "none",
                  backgroundColor: "rgba(0,0,0,0.72)",
                  top: highlightRect.top,
                  left: highlightRect.left + highlightRect.width,
                  right: 0,
                  height: highlightRect.height,
                }}
              />
              {/* Highlight ring */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                sx={{
                  position: "fixed",
                  zIndex: 9201,
                  pointerEvents: "none",
                  top: highlightRect.top,
                  left: highlightRect.left,
                  width: highlightRect.width,
                  height: highlightRect.height,
                  borderRadius: "12px",
                  outline: "3px solid #4a7aab",
                  outlineOffset: "2px",
                  boxShadow:
                    "0 0 0 4px rgba(74,122,171,0.25), 0 0 32px rgba(74,122,171,0.3)",
                }}
              />
            </>
          : <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              sx={{
                position: "fixed",
                inset: 0,
                zIndex: 9200,
                pointerEvents: "none",
                backgroundColor: "rgba(0,0,0,0.72)",
                backdropFilter: "blur(2px)",
              }}
            />
          }

          <AnimatePresence mode="wait">
            <TooltipCard
              key={currentStep}
              step={step}
              stepIndex={currentStep}
              totalSteps={steps.length}
              highlightRect={highlightRect}
              onNext={handleNext}
              onPrev={prevStep}
              onEnd={endTutorial}
              isNavigationStep={isNavigationStep}
              interactionUnlocked={interactionUnlocked}
            />
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
