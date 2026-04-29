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
import HelpPopup from "../components/HelpPopup";
import DocPreviewer from "../components/Management/DocPreviewer";
import { API_ENDPOINTS } from "../config";
import { ContentRowsSchema, type ContentRow } from "../types/content";
import { dedupeAsync } from "../lib/async-cache";

type ApprovalStatus = "approved" | "denied" | null;

interface ApprovalCard {
  content: ContentRow;
  expanded: boolean;
  status: ApprovalStatus;
  reviewComment: string;
}

export default function ApprovalPage() {
  const [cards, setCards] = useState<ApprovalCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchAdminContent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dedupeAsync("content:list", async () => {
        const res = await fetch(API_ENDPOINTS.CONTENT.ROOT, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      });

      const parsed = ContentRowsSchema.safeParse(data);
      if (!parsed.success) {
        console.error(parsed.error);
        setCards([]);
        return;
      }

      // Filter to only content intended for ADMIN (submitted for review/approval)
      const adminContent = parsed.data.filter(
        (row) => row.for_position === "ADMIN",
      );

      setCards(
        adminContent.map((content) => ({
          content,
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
    void fetchAdminContent();
  }, [fetchAdminContent]);

  const toggleExpanded = (uuid: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.content.uuid === uuid ? { ...c, expanded: !c.expanded } : c,
      ),
    );
  };

  const setStatus = (uuid: string, status: ApprovalStatus) => {
    setCards((prev) =>
      prev.map((c) =>
        c.content.uuid === uuid ? { ...c, status, expanded: false } : c,
      ),
    );
  };

  const setComment = (uuid: string, comment: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.content.uuid === uuid ? { ...c, reviewComment: comment } : c,
      ),
    );
  };

  const handleSubmitApprovals = async () => {
    const reviewed = cards.filter((c) => c.status !== null);
    if (reviewed.length === 0) return;

    setSubmitting(true);
    try {
      await Promise.all(
        reviewed.map((card) =>
          fetch(API_ENDPOINTS.CONTENT.EDIT(card.content.uuid), {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: card.status === "approved" ? "AVAILABLE" : "UNAVAILABLE",
              workflow_action:
                card.status === "approved" ? "APPROVED" : "DENIED",
              review_comment: card.reviewComment,
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

  const approvedCount = cards.filter((c) => c.status === "approved").length;
  const deniedCount = cards.filter((c) => c.status === "denied").length;
  const pendingCount = cards.filter((c) => c.status === null).length;

  // ── Render ─────────────────────────────────────────────────────────────────
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
        {/* Decorative circles */}
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
              Review and approve content submitted for admin sign-off
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <HelpPopup
              description="This page shows all content submitted for admin approval. Expand each card to review the document and underwriter comments, then approve or deny."
              infoOrHelp={true}
            />
          </Box>
        </Stack>

        {/* Summary chips */}
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
          <Box
            sx={{
              textAlign: "center",
              mt: 10,
              color: "text.secondary",
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 56, mb: 2, opacity: 0.25 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              Queue is empty
            </Typography>
            <Typography variant="body2">
              No content is awaiting admin approval right now.
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
                void fetchAdminContent();
              }}
            >
              Refresh Queue
            </Button>
          </Box>
        : <>
            <Stack spacing={1.5}>
              <AnimatePresence>
                {cards.map((card, index) => (
                  <ApprovalCard
                    key={card.content.uuid}
                    card={card}
                    index={index}
                    onToggle={() => toggleExpanded(card.content.uuid)}
                    onApprove={() => setStatus(card.content.uuid, "approved")}
                    onDeny={() => setStatus(card.content.uuid, "denied")}
                    onCommentChange={(val) =>
                      setComment(card.content.uuid, val)
                    }
                  />
                ))}
              </AnimatePresence>
            </Stack>

            {/* ── Submit approvals ─────────────────────────────────────── */}
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

// ── Individual card ────────────────────────────────────────────────────────────

interface ApprovalCardProps {
  card: ApprovalCard;
  index: number;
  onToggle: () => void;
  onApprove: () => void;
  onDeny: () => void;
  onCommentChange: (val: string) => void;
}

function ApprovalCard({
  card,
  index,
  onToggle,
  onApprove,
  onDeny,
  onCommentChange,
}: ApprovalCardProps) {
  const { content, expanded, status, reviewComment } = card;

  const isExternalUrl =
    !content.supabasePath && !content.url.includes("supabase.co/storage");

  const statusColor = {
    approved: "success.main",
    denied: "error.main",
    null: "text.disabled",
  }[String(status)];

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
          status === "approved" ? "success.main"
          : status === "denied" ? "error.main"
          : "divider",
        backgroundColor: "background.paper",
        transition: "border-color 0.2s",
        boxShadow:
          status === "approved" ? "0 0 0 3px rgba(76,175,80,0.12)"
          : status === "denied" ? "0 0 0 3px rgba(244,67,54,0.12)"
          : "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* ── Card header row ────────────────────────────────────────── */}
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
        {/* Status checkbox icon */}
        <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
          {status === "approved" ?
            <CheckCircleIcon sx={{ color: "success.main", fontSize: 28 }} />
          : status === "denied" ?
            <CancelIcon sx={{ color: "error.main", fontSize: 28 }} />
          : <CheckBoxOutlineBlankIcon
              sx={{ color: "text.disabled", fontSize: 28 }}
            />
          }
        </Box>

        {/* Title + meta */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.975rem",
              color:
                status === "approved" ? "success.main"
                : status === "denied" ? "error.main"
                : "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {content.title}
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
              {content.content_owner}
            </Typography>
            {content.last_modified_time && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                ·{" "}
                {new Date(content.last_modified_time).toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric", year: "numeric" },
                )}
              </Typography>
            )}
            {content.file_type && (
              <Chip
                label={content.file_type.split("/").pop()?.toUpperCase()}
                size="small"
                variant="outlined"
                sx={{ height: 18, fontSize: "0.65rem" }}
              />
            )}
          </Stack>
        </Box>

        {/* Status label + expand icon */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ flexShrink: 0 }}
        >
          {status !== null && (
            <Chip
              label={status === "approved" ? "Approved" : "Denied"}
              size="small"
              color={status === "approved" ? "success" : "error"}
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

      {/* ── Expandable body ────────────────────────────────────────── */}
      <Collapse
        in={expanded}
        timeout={280}
      >
        <Divider />
        <Box
          sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {/* Underwriter comments field */}
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
              Underwriter Comments
            </Typography>
            <TextField
              placeholder="Risk assessment notes from the underwriter will appear here, or add your own review notes…"
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

          {/* Inline document preview */}
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
              Document Preview
            </Typography>
            <Box
              sx={{
                height: 480,
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {isExternalUrl ?
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="body2">
                    This document is hosted externally.
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in new tab
                  </Button>
                </Box>
              : <DocPreviewer
                  key={content.uuid}
                  uri={API_ENDPOINTS.CONTENT.FILE(content.uuid)}
                  fileName={content.title}
                />
              }
            </Box>
          </Box>

          {/* Approve / Deny buttons */}
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
