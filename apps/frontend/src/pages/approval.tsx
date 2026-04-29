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
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import PublishIcon from "@mui/icons-material/Publish";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HelpPopup from "../components/HelpPopup";
import { API_ENDPOINTS } from "../config";

type ApprovalStatus = "APPROVED" | "DENIED" | null;

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

interface ClaimContent {
  uuid: string;
  title: string;
  url: string;
  file_type: string | null;
  content_type: string | null;
  status: string;
}

interface ClaimRecord {
  uuid: string;
  claim_type: string;
  incident_date: string;
  incident_description: string;
  status: string;
  createdAt: string;
  requestor: {
    uuid: string;
    first_name: string;
    last_name: string;
    corporate_email: string;
  };
  contents: ClaimContent[];
}

interface ApprovalCard {
  claim: ClaimRecord;
  expanded: boolean;
  status: ApprovalStatus;
  reviewComment: string;
}

export default function ApprovalPage() {
  const [cards, setCards] = useState<ApprovalCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.CLAIM.ROOT, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data = (await res.json()) as ClaimRecord[];
      const all = Array.isArray(data) ? data : [];

      // Admins see all claims; show only those cleared by underwriters
      const cleared = all.filter((c) => c.status === "RISK_CLEARED");

      setCards(
        cleared.map((claim) => ({
          claim,
          expanded: false,
          status: null,
          reviewComment: "",
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

  const toggleExpanded = (uuid: string) =>
    setCards((prev) =>
      prev.map((c) =>
        c.claim.uuid === uuid ? { ...c, expanded: !c.expanded } : c,
      ),
    );

  const setStatus = (uuid: string, status: ApprovalStatus) =>
    setCards((prev) =>
      prev.map((c) =>
        c.claim.uuid === uuid ? { ...c, status, expanded: false } : c,
      ),
    );

  const setComment = (uuid: string, comment: string) =>
    setCards((prev) =>
      prev.map((c) =>
        c.claim.uuid === uuid ? { ...c, reviewComment: comment } : c,
      ),
    );

  const handleSubmitApprovals = async () => {
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
            body: JSON.stringify({ status: card.status }), // "APPROVED" or "DENIED"
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

  const approvedCount = cards.filter((c) => c.status === "APPROVED").length;
  const deniedCount = cards.filter((c) => c.status === "DENIED").length;
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
            <Typography
              variant="h2"
              sx={{ color: "white", fontWeight: 700, mb: 0.5 }}
            >
              Approval Queue
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}
            >
              Review risk-cleared claims and issue final approval or denial
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <HelpPopup
              description="This page shows all claims that have been risk-cleared by an underwriter. Expand each card to review the incident details, attached evidence, and the underwriter's assessment, then approve or deny."
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
              label={`${approvedCount} Approved`}
              size="small"
              sx={{
                backgroundColor: "rgba(76,175,80,0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
            <Chip
              icon={
                <CancelIcon
                  sx={{ fontSize: 14, color: "#f44336 !important" }}
                />
              }
              label={`${deniedCount} Denied`}
              size="small"
              sx={{
                backgroundColor: "rgba(244,67,54,0.2)",
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
              Queue is empty
            </Typography>
            <Typography variant="body2">
              No risk-cleared claims are awaiting admin approval right now.
            </Typography>
          </Box>
        : submitted ?
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ textAlign: "center", mt: 10 }}
          >
            <CheckCircleIcon
              sx={{ fontSize: 64, color: "success.main", mb: 2 }}
            />
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Approvals submitted!
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              {approvedCount} approved · {deniedCount} denied
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
                  <ApprovalCardComponent
                    key={card.claim.uuid}
                    card={card}
                    index={index}
                    onToggle={() => toggleExpanded(card.claim.uuid)}
                    onApprove={() => setStatus(card.claim.uuid, "APPROVED")}
                    onDeny={() => setStatus(card.claim.uuid, "DENIED")}
                    onCommentChange={(val) => setComment(card.claim.uuid, val)}
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
                sx={{ color: "white" }}
              >
                {approvedCount + deniedCount} of {cards.length} reviewed
              </Typography>
              <Tooltip
                title={
                  approvedCount + deniedCount === 0 ?
                    "Review at least one item first"
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
                    disabled={submitting || approvedCount + deniedCount === 0}
                    onClick={() => void handleSubmitApprovals()}
                    sx={{
                      "background": "linear-gradient(135deg, #4F6BED, #6C8EF5)",
                      "fontWeight": 700,
                      "px": 4,
                      "py": 1.4,
                      "borderRadius": "12px",
                      "textTransform": "none",
                      "fontSize": "1rem",
                      "boxShadow": "0 4px 16px rgba(79,107,237,0.45)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #3A54D4, #5A7AE8)",
                        boxShadow: "0 6px 20px rgba(79,107,237,0.6)",
                      },
                      "&.Mui-disabled": {
                        background: "rgba(255, 255, 255, 0.15)",
                        color: "rgba(255, 255, 255, 0.4)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Submit Approvals
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

interface ApprovalCardProps {
  card: ApprovalCard;
  index: number;
  onToggle: () => void;
  onApprove: () => void;
  onDeny: () => void;
  onCommentChange: (val: string) => void;
}

function ApprovalCardComponent({
  card,
  index,
  onToggle,
  onApprove,
  onDeny,
  onCommentChange,
}: ApprovalCardProps) {
  const { claim, expanded, status, reviewComment } = card;
  const incidentDate =
    claim.incident_date ?
      new Date(claim.incident_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

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
          status === "APPROVED" ? "success.main"
          : status === "DENIED" ? "error.main"
          : "divider",
        backgroundColor: "background.paper",
        transition: "border-color 0.2s",
        boxShadow:
          status === "APPROVED" ? "0 0 0 3px rgba(76,175,80,0.12)"
          : status === "DENIED" ? "0 0 0 3px rgba(244,67,54,0.12)"
          : "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
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
          {status === "APPROVED" ?
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 28 }} />
          : status === "DENIED" ?
            <CancelIcon sx={{ color: "error.main", fontSize: 28 }} />
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
                status === "APPROVED" ? "success.main"
                : status === "DENIED" ? "error.main"
                : "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {CLAIM_TYPE_LABELS[claim.claim_type] ?? claim.claim_type} —{" "}
            {claim.requestor.first_name} {claim.requestor.last_name}
          </Typography>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ mt: 0.4 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {claim.requestor.corporate_email}
            </Typography>
            {incidentDate && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                · Incident: {incidentDate}
              </Typography>
            )}
            {claim.contents.length > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                · {claim.contents.length} attachment
                {claim.contents.length !== 1 ? "s" : ""}
              </Typography>
            )}
            <Chip
              label="Risk Cleared"
              size="small"
              color="success"
              variant="outlined"
              sx={{ height: 16, fontSize: "0.6rem" }}
            />
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
              label={status === "APPROVED" ? "Approved" : "Denied"}
              size="small"
              color={status === "APPROVED" ? "success" : "error"}
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

      {/* Body */}
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
                mb: 1,
                fontWeight: 700,
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "text.secondary",
              }}
            >
              Incident Description
            </Typography>
            <Box
              sx={{
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: "action.hover",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.7 }}
              >
                {claim.incident_description}
              </Typography>
            </Box>
          </Box>

          {/* Attachments */}
          {claim.contents.length > 0 && (
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
                Supporting Evidence ({claim.contents.length})
              </Typography>
              <Stack spacing={0.75}>
                {claim.contents.map((content) => {
                  const ext =
                    content.file_type ?
                      content.file_type.split("/").pop()?.toUpperCase()
                    : null;
                  return (
                    <Box
                      key={content.uuid}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 1.5,
                        py: 1,
                        borderRadius: "8px",
                        backgroundColor: "action.hover",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <AttachFileIcon
                        sx={{
                          fontSize: 16,
                          color: "text.secondary",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ flexGrow: 1, minWidth: 0 }}
                        noWrap
                      >
                        {content.title}
                      </Typography>
                      {ext && (
                        <Chip
                          label={`.${ext}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 18,
                            fontSize: "0.62rem",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <Button
                        size="small"
                        variant="text"
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          flexShrink: 0,
                          textTransform: "none",
                          fontSize: "0.75rem",
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Admin review comment */}
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
              Review Comment (optional)
            </Typography>
            <TextField
              placeholder="Add a note about this approval or denial…"
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              value={reviewComment}
              onChange={(e) => onCommentChange(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                },
              }}
            />
          </Box>

          {/* Approve / Deny */}
          <Stack
            direction="row"
            spacing={1.5}
          >
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ThumbUpIcon />}
              onClick={onApprove}
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
              Approve
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<ThumbDownIcon />}
              onClick={onDeny}
              sx={{
                "borderRadius": "10px",
                "fontWeight": 700,
                "textTransform": "none",
                "fontSize": "0.95rem",
                "py": 1.2,
                "background": "linear-gradient(135deg, #7f0000, #c62828)",
                "color": "white",
                "boxShadow": "0 4px 14px rgba(198,40,40,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5f0000, #a31515)",
                  boxShadow: "0 6px 18px rgba(198,40,40,0.45)",
                },
              }}
            >
              Deny
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
