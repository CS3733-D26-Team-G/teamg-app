import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Collapse,
  TextField,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VerifiedIcon from "@mui/icons-material/Verified";
import FlagIcon from "@mui/icons-material/Flag";
import PublishIcon from "@mui/icons-material/Publish";
import GavelIcon from "@mui/icons-material/Gavel";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HelpPopup from "../components/HelpPopup";
import { API_ENDPOINTS } from "../config";

// ── Types ──────────────────────────────────────────────────────────────────────

type RiskStatus = "cleared" | "flagged" | null;

interface ClaimRecord {
  uuid: string;
  claim_type: string;
  incident_date: string;
  incident_description: string;
  status: string;
  created_at?: string;
  requestor?: {
    first_name: string;
    last_name: string;
    corporate_email: string;
  };
  claimContentAssignment?: Array<{
    content: {
      uuid: string;
      title: string;
      url: string;
      file_type: string | null;
      status: string;
    };
  }>;
}

interface RiskCard {
  claim: ClaimRecord;
  expanded: boolean;
  status: RiskStatus;
  riskNotes: string;
}

const CLAIM_TYPE_LABELS: Record<string, string> = {
  AUTO: "Auto",
  PROPERTY_DAMAGE: "Property Damage",
  MEDICAL: "Medical",
  LIABILITY: "Liability",
  WORKERS_COMPENSATION: "Workers' Compensation",
  THEFT: "Theft",
  NATURAL_DISASTER: "Natural Disaster",
  OTHER: "Other",
};

// ── Main page ──────────────────────────────────────────────────────────────────

export default function RiskReviewPage() {
  const [cards, setCards] = useState<RiskCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(API_ENDPOINTS.CLAIM.ROOT, {
        method: "GET",
        credentials: "include", // Keeps cookie support
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = (await res.json()) as ClaimRecord[];

      console.log(
        "[RiskReviewPage] claim statuses from API:",
        data.map((c) => ({ uuid: c.uuid, status: c.status })),
      );
      // ------------------------------

      // If you want EVERYTHING to show up regardless of status (as you mentioned),
      // change the filter to just return true or remove it:
      const pending = Array.isArray(data) ? data : [];

      setCards(
        pending.map((claim) => ({
          claim,
          expanded: false,
          status: null,
          riskNotes: "",
        })),
      );
    } catch (err) {
      console.error(err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchClaims();
  }, [fetchClaims]);

  const toggleExpanded = (uuid: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.claim.uuid === uuid ? { ...c, expanded: !c.expanded } : c,
      ),
    );
  };

  const setStatus = (uuid: string, status: RiskStatus) => {
    setCards((prev) =>
      prev.map((c) =>
        c.claim.uuid === uuid ? { ...c, status, expanded: false } : c,
      ),
    );
  };

  const setNotes = (uuid: string, notes: string) => {
    setCards((prev) =>
      prev.map((c) => (c.claim.uuid === uuid ? { ...c, riskNotes: notes } : c)),
    );
  };

  const handleSubmitReviews = async () => {
    const reviewed = cards.filter((c) => c.status !== null);
    if (reviewed.length === 0) return;

    setSubmitting(true);
    try {
      await Promise.all(
        reviewed.map((card) =>
          fetch(API_ENDPOINTS.CLAIM.UPDATE(card.claim.uuid), {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status:
                card.status === "cleared" ? "RISK_CLEARED" : "RISK_FLAGGED",
              risk_assessment: card.riskNotes,
            }),
          }),
        ),
      );
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const clearedCount = cards.filter((c) => c.status === "cleared").length;
  const flaggedCount = cards.filter((c) => c.status === "flagged").length;
  const pendingCount = cards.filter((c) => c.status === null).length;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          px: 4,
          pt: 5,
          pb: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              width: 120 + i * 80,
              height: 120 + i * 80,
              top: -40 - i * 30,
              right: -40 - i * 30,
              pointerEvents: "none",
            }}
          />
        ))}

        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 0.5 }}
            >
              <GavelIcon
                sx={{ color: "rgba(255,255,255,0.85)", fontSize: 28 }}
              />
              <Typography
                variant="h2"
                sx={{ color: "white", fontWeight: 700 }}
              >
                Risk Review Queue
              </Typography>
            </Stack>
            <Typography
              sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}
            >
              Assess risk on submitted claims — clear or flag each one before
              forwarding to admin approval
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <HelpPopup
              description="This queue shows all claims submitted by agents that are pending your risk assessment. Expand each claim to review its details and attachments, write your risk notes, then clear or flag it."
              infoOrHelp={true}
            />
          </Box>
        </Stack>

        {!loading && cards.length > 0 && (
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mt: 2.5 }}
          >
            <Chip
              label={`${pendingCount} Pending`}
              size="small"
              sx={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "white",
                fontWeight: 600,
                backdropFilter: "blur(4px)",
              }}
            />
            <Chip
              icon={
                <CheckCircleIcon
                  sx={{ fontSize: 14, color: "#4caf50 !important" }}
                />
              }
              label={`${clearedCount} Cleared`}
              size="small"
              sx={{
                backgroundColor: "rgba(76,175,80,0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
            <Chip
              icon={
                <WarningAmberIcon
                  sx={{ fontSize: 14, color: "#ffa726 !important" }}
                />
              }
              label={`${flaggedCount} Flagged`}
              size="small"
              sx={{
                backgroundColor: "rgba(255,167,38,0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Stack>
        )}
      </Box>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <Box sx={{ px: 4, py: 3, maxWidth: 960, mx: "auto" }}>
        {loading ?
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        : cards.length === 0 ?
          <Box sx={{ textAlign: "center", mt: 10, color: "text.secondary" }}>
            <CheckCircleIcon sx={{ fontSize: 56, mb: 2, opacity: 0.25 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              Queue is clear
            </Typography>
            <Typography variant="body2">
              No claims are awaiting risk review right now.
            </Typography>
          </Box>
        : submitted ?
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ textAlign: "center", mt: 10 }}
          >
            <VerifiedIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Risk assessments submitted!
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {clearedCount} cleared · {flaggedCount} flagged
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSubmitted(false);
                void fetchClaims();
              }}
            >
              Refresh Queue
            </Button>
          </Box>
        : <>
            <Stack spacing={1.5}>
              <AnimatePresence>
                {cards.map((card, index) => (
                  <RiskClaimCard
                    key={card.claim.uuid}
                    card={card}
                    index={index}
                    onToggle={() => toggleExpanded(card.claim.uuid)}
                    onClear={() => setStatus(card.claim.uuid, "cleared")}
                    onFlag={() => setStatus(card.claim.uuid, "flagged")}
                    onNotesChange={(val) => setNotes(card.claim.uuid, val)}
                  />
                ))}
              </AnimatePresence>
            </Stack>

            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                {clearedCount + flaggedCount} of {cards.length} reviewed
              </Typography>
              <Tooltip
                title={
                  clearedCount + flaggedCount === 0 ?
                    "Review at least one claim first"
                  : ""
                }
              >
                <span>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={
                      submitting ?
                        <CircularProgress
                          size={18}
                          color="inherit"
                        />
                      : <PublishIcon />
                    }
                    disabled={submitting || clearedCount + flaggedCount === 0}
                    onClick={() => void handleSubmitReviews()}
                    sx={{
                      "background": "linear-gradient(135deg, #1A1E4B, #395176)",
                      "fontWeight": 700,
                      "px": 4,
                      "py": 1.4,
                      "borderRadius": "12px",
                      "textTransform": "none",
                      "fontSize": "1rem",
                      "boxShadow": "0 4px 16px rgba(26,30,75,0.35)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #0f1230, #2d4060)",
                        boxShadow: "0 6px 20px rgba(26,30,75,0.5)",
                      },
                    }}
                  >
                    Submit Risk Assessments
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </>
        }
      </Box>
    </Box>
  );
}

// ── Individual risk card ───────────────────────────────────────────────────────

interface RiskClaimCardProps {
  card: RiskCard;
  index: number;
  onToggle: () => void;
  onClear: () => void;
  onFlag: () => void;
  onNotesChange: (val: string) => void;
}

function RiskClaimCard({
  card,
  index,
  onToggle,
  onClear,
  onFlag,
  onNotesChange,
}: RiskClaimCardProps) {
  const { claim, expanded, status, riskNotes } = card;
  const attachments = claim.claimContentAssignment ?? [];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      sx={{
        borderRadius: "14px",
        overflow: "hidden",
        border: "1.5px solid",
        borderColor:
          status === "cleared" ? "success.main"
          : status === "flagged" ? "warning.main"
          : "divider",
        backgroundColor: "background.paper",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow:
          status === "cleared" ? "0 0 0 3px rgba(76,175,80,0.12)"
          : status === "flagged" ? "0 0 0 3px rgba(255,167,38,0.15)"
          : "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header row */}
      <Box
        onClick={status === null ? onToggle : undefined}
        sx={{
          "display": "flex",
          "alignItems": "center",
          "px": 2.5,
          "py": 2,
          "gap": 2,
          "cursor": status === null ? "pointer" : "default",
          "userSelect": "none",
          "&:hover": status === null ? { backgroundColor: "action.hover" } : {},
        }}
      >
        <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {status === "cleared" ?
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 28 }} />
          : status === "flagged" ?
            <WarningAmberIcon sx={{ color: "warning.main", fontSize: 28 }} />
          : <CheckBoxOutlineBlankIcon
              sx={{ color: "text.disabled", fontSize: 28 }}
            />
          }
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.975rem",
              color:
                status === "cleared" ? "success.main"
                : status === "flagged" ? "warning.dark"
                : "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {CLAIM_TYPE_LABELS[claim.claim_type] ?? claim.claim_type} Claim
          </Typography>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mt: 0.4 }}
          >
            {claim.requestor && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {claim.requestor.first_name} {claim.requestor.last_name}
              </Typography>
            )}
            <Typography
              variant="caption"
              color="text.secondary"
            >
              · Incident:{" "}
              {new Date(claim.incident_date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
            {attachments.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                · {attachments.length} attachment
                {attachments.length !== 1 ? "s" : ""}
              </Typography>
            )}
          </Stack>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ flexShrink: 0 }}
        >
          {status !== null && (
            <Chip
              label={status === "cleared" ? "Cleared" : "Flagged"}
              size="small"
              color={status === "cleared" ? "success" : "warning"}
              variant="filled"
              sx={{ fontWeight: 700, fontSize: "0.72rem" }}
            />
          )}
          {status === null &&
            (expanded ?
              <ExpandLessIcon sx={{ color: "text.secondary" }} />
            : <ExpandMoreIcon sx={{ color: "text.secondary" }} />)}
        </Stack>
      </Box>

      {/* Expandable body */}
      <Collapse
        in={expanded}
        timeout={280}
      >
        <Divider />
        <Box
          sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {/* Incident description */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 0.75,
                fontWeight: 700,
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "text.secondary",
              }}
            >
              Incident Description
            </Typography>
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
                p: 1.5,
                borderRadius: "8px",
                backgroundColor: "action.hover",
              }}
            >
              {claim.incident_description}
            </Typography>
          </Box>

          {/* Attachments */}
          {attachments.length > 0 && (
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 0.75,
                  fontWeight: 700,
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "text.secondary",
                }}
              >
                Supporting Evidence
              </Typography>
              <Stack spacing={0.5}>
                {attachments.map(({ content }) => (
                  <Stack
                    key={content.uuid}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: "8px",
                      backgroundColor: "action.hover",
                    }}
                  >
                    <AttachFileIcon
                      sx={{ fontSize: 15, color: "text.secondary" }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ flexGrow: 1 }}
                    >
                      {content.title}
                    </Typography>
                    {content.file_type && (
                      <Chip
                        label={content.file_type
                          .split("/")
                          .pop()
                          ?.toUpperCase()}
                        size="small"
                        variant="outlined"
                        sx={{ height: 18, fontSize: "0.62rem" }}
                      />
                    )}
                    <Button
                      size="small"
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ textTransform: "none", fontSize: "0.75rem" }}
                    >
                      View
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}

          {/* Risk notes */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontWeight: 700,
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "text.secondary",
              }}
            >
              Risk Assessment Notes
            </Typography>
            <TextField
              placeholder="Summarise your risk evaluation — note any concerns, eligibility issues, compliance flags, or conditions that apply to this claim…"
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              value={riskNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                },
              }}
            />
          </Box>

          {/* Clear / Flag buttons */}
          <Stack
            direction="row"
            spacing={1.5}
          >
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<VerifiedIcon />}
              onClick={onClear}
              sx={{
                "borderRadius": "10px",
                "fontWeight": 700,
                "textTransform": "none",
                "fontSize": "0.95rem",
                "py": 1.2,
                "background": "linear-gradient(135deg, #1b5e20, #2e7d32)",
                "color": "white",
                "boxShadow": "0 4px 14px rgba(46,125,50,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #14471a, #245c27)",
                  boxShadow: "0 6px 18px rgba(46,125,50,0.45)",
                },
              }}
            >
              Clear Risk
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<FlagIcon />}
              onClick={onFlag}
              sx={{
                "borderRadius": "10px",
                "fontWeight": 700,
                "textTransform": "none",
                "fontSize": "0.95rem",
                "py": 1.2,
                "background": "linear-gradient(135deg, #e65100, #f57c00)",
                "color": "white",
                "boxShadow": "0 4px 14px rgba(230,81,0,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #bf360c, #d84315)",
                  boxShadow: "0 6px 18px rgba(230,81,0,0.45)",
                },
              }}
            >
              Flag Risk
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
