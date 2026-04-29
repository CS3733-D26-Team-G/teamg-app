import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  Slide,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SearchIcon from "@mui/icons-material/Search";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import InputAdornment from "@mui/material/InputAdornment";
import HelpPopup from "../../components/HelpPopup";
import { API_ENDPOINTS } from "../../config";
import CalendarInput from "../../components/CalendarInput";
import type { ContentRow } from "../../types/content";
import {
  invalidateClaimsList,
  loadClaimsList,
  loadContentList,
} from "../../lib/api-loaders";

// ── Types ──────────────────────────────────────────────────────────────────────

const CLAIM_TYPES = [
  "AUTO",
  "PROPERTY_DAMAGE",
  "MEDICAL",
  "LIABILITY",
  "WORKERS_COMPENSATION",
  "THEFT",
  "NATURAL_DISASTER",
  "OTHER",
] as const;

type ClaimType = (typeof CLAIM_TYPES)[number];

const CLAIM_TYPE_LABELS: Record<ClaimType, string> = {
  AUTO: "Auto",
  PROPERTY_DAMAGE: "Property Damage",
  MEDICAL: "Medical",
  LIABILITY: "Liability",
  WORKERS_COMPENSATION: "Workers' Compensation",
  THEFT: "Theft",
  NATURAL_DISASTER: "Natural Disaster",
  OTHER: "Other",
};

interface ClaimRecord {
  uuid: string;
  claimType: ClaimType;
  incidentDate: string;
  incidentDescription: string;
  status: string;
  createdAt?: string;
  requestor?: {
    firstName: string;
    lastName: string;
    corporateEmail: string;
  };
  contents?: Array<{
    content: {
      uuid: string;
      title: string;
      url: string;
      fileType: string | null;
      status: string;
    };
  }>;
}

interface ClaimFormData {
  claimType: ClaimType;
  incidentDate: Date;
  incidentDescription: string;
  selectedContentUuids: string[];
}

// ── Slide transition ───────────────────────────────────────────────────────────

const SlideUpTransition = React.forwardRef(function SlideUpTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

// ── Status helpers ─────────────────────────────────────────────────────────────

function statusColor(
  status: string | undefined | null,
): "default" | "warning" | "info" | "success" | "error" {
  if (!status) return "default";

  const map: Record<
    string,
    "default" | "warning" | "info" | "success" | "error"
  > = {
    PENDING: "warning",
    UNDER_REVIEW: "info",
    RISK_CLEARED: "info",
    RISK_FLAGGED: "error",
    APPROVED: "success",
    DENIED: "error",
  };
  return map[status] ?? "default";
}

function statusLabel(status: string | undefined | null): string {
  if (!status) return "PENDING";
  return status.replace(/_/g, " ");
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ClaimPage() {
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      setClaims(await loadClaimsList<ClaimRecord>());
    } catch (err) {
      console.error(err);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchClaims();
  }, [fetchClaims]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "white" }}>
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
              <AssignmentIcon
                sx={{ color: "rgba(255,255,255,0.85)", fontSize: 28 }}
              />
              <Typography
                variant="h2"
                sx={{ color: "white", fontWeight: 700 }}
              >
                Claims
              </Typography>
            </Stack>
            <Typography
              sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}
            >
              File a new insurance claim or track the status of existing ones
            </Typography>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mt: 0.5 }}
          >
            <HelpPopup
              description="Use this page to file a new claim by clicking 'New Claim'. Each claim captures incident details, your identity, and any supporting files. You can track the review status of each claim below."
              infoOrHelp={true}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setFormOpen(true)}
              sx={{
                "background": "rgba(255,255,255,0.15)",
                "backdropFilter": "blur(8px)",
                "border": "1px solid rgba(255,255,255,0.3)",
                "color": "white",
                "fontWeight": 700,
                "textTransform": "none",
                "borderRadius": "10px",
                "px": 2.5,
                "&:hover": { background: "rgba(255,255,255,0.25)" },
              }}
            >
              New Claim
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* ── Explainer cards ──────────────────────────────────────────────── */}
      <Box sx={{ px: 4, py: 3, maxWidth: 960, mx: "auto" }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 2,
            fontWeight: 700,
            fontSize: "0.78rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "text.secondary",
          }}
        >
          What goes into a claim
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          {/* Core Incident Details */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            variant="outlined"
            sx={{ flex: 1, p: 2.5, borderRadius: "14px" }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #1A1E4B, #395176)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AssignmentIcon sx={{ color: "white", fontSize: 18 }} />
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700 }}
              >
                Core Incident Details
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              Every claim starts with <strong>when</strong> the event happened,
              the <strong>type of claim</strong> (auto, property, medical,
              etc.), and a clear <strong>written description</strong> of what
              occurred. This narrative becomes the official record of the
              incident and is used to identify your claim in activity logs.
            </Typography>
          </Paper>

          {/* Stakeholder Identity */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            variant="outlined"
            sx={{ flex: 1, p: 2.5, borderRadius: "14px" }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #1b5e20, #2e7d32)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <VerifiedUserIcon sx={{ color: "white", fontSize: 18 }} />
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700 }}
              >
                Stakeholder Identity
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              Your claim is automatically tied to your verified employee profile
              — your name, corporate email, and employee ID are captured so
              every submission is traceable to a confirmed, authenticated
              requestor. No manual entry required.
            </Typography>
          </Paper>

          {/* Supporting Evidence */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            variant="outlined"
            sx={{ flex: 1, p: 2.5, borderRadius: "14px" }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #e65100, #f57c00)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AttachFileIcon sx={{ color: "white", fontSize: 18 }} />
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700 }}
              >
                Supporting Evidence
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              Attach existing documents from the content library as evidence —
              photos, receipts, or policy files that support your claim. The
              system links the selected content's UUID to your claim, tracking
              the file URL, type, and status without requiring a separate
              upload.
            </Typography>
          </Paper>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* ── Claims history ────────────────────────────────────────────── */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "text.secondary",
            }}
          >
            Your Claims
          </Typography>
          {!loading && (
            <Chip
              label={`${claims.length} total`}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        {loading ?
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        : claims.length === 0 ?
          <Box
            sx={{ textAlign: "center", mt: 6, mb: 4, color: "text.secondary" }}
          >
            <FolderOpenIcon sx={{ fontSize: 52, mb: 1.5, opacity: 0.2 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 0.5 }}
            >
              No claims yet
            </Typography>
            <Typography variant="body2">
              Click <strong>New Claim</strong> above to file your first claim.
            </Typography>
          </Box>
        : <Stack spacing={1.5}>
            {claims.map((claim, index) => (
              <ClaimHistoryCard
                key={claim.uuid}
                claim={claim}
                index={index}
              />
            ))}
          </Stack>
        }
      </Box>

      {/* ── New Claim Modal ───────────────────────────────────────────────── */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        TransitionComponent={SlideUpTransition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #1A1E4B 0%, #395176 100%)",
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "1.1rem",
              fontFamily: "Rubik, sans-serif",
            }}
          >
            File a New Claim
          </Typography>
          <IconButton
            onClick={() => setFormOpen(false)}
            size="small"
            sx={{
              "color": "rgba(255,255,255,0.8)",
              "backgroundColor": "rgba(255,255,255,0.1)",
              "borderRadius": "8px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <ClaimForm
            onSuccess={() => {
              setFormOpen(false);
              void fetchClaims();
            }}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// ── Claim submission form ──────────────────────────────────────────────────────

function ClaimForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<ClaimFormData>({
    claimType: "AUTO",
    incidentDate: new Date(),
    incidentDescription: "",
    selectedContentUuids: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Content library state
  const [availableContent, setAvailableContent] = useState<ContentRow[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSearch, setContentSearch] = useState("");

  // Fetch content library once on mount
  useEffect(() => {
    const load = async () => {
      try {
        setAvailableContent(await loadContentList());
      } catch (err) {
        console.error("Failed to load content library:", err);
        setAvailableContent([]);
      } finally {
        setContentLoading(false);
      }
    };
    void load();
  }, []);

  const filteredContent = availableContent.filter((row) =>
    [row.title, row.contentOwner, row.forPosition, row.fileType]
      .filter(Boolean)
      .some((f) => f!.toLowerCase().includes(contentSearch.toLowerCase())),
  );

  const toggleContent = (uuid: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedContentUuids:
        prev.selectedContentUuids.includes(uuid) ?
          prev.selectedContentUuids.filter((id) => id !== uuid)
        : [...prev.selectedContentUuids, uuid],
    }));
  };

  const isSelected = (uuid: string) =>
    formData.selectedContentUuids.includes(uuid);

  const selectedItems = availableContent.filter((r) =>
    formData.selectedContentUuids.includes(r.uuid),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.incidentDescription.trim()) {
      setError("Please provide an incident description.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(API_ENDPOINTS.CLAIM.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Send as JSON
        },
        credentials: "include",
        body: JSON.stringify({
          claimType: formData.claimType,
          incidentDate: formData.incidentDate.toISOString(), // Ensure ISO string
          incidentDescription: formData.incidentDescription,
          contentUuids: formData.selectedContentUuids, // Sent as a clean array
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // FIX: Extract the human-readable message from Zod issues
        if (Array.isArray(data.message)) {
          setError(data.message[0].message); // Take the first validation error
        } else {
          setError(data.message || "Failed to create claim");
        }
        return;
      }

      invalidateClaimsList();
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ px: 3, py: 3, display: "flex", flexDirection: "column", gap: 0 }}
    >
      {/* Claim type */}
      <FormControl
        fullWidth
        margin="normal"
        required
      >
        <InputLabel id="claim-type-label">Claim Type</InputLabel>
        <Select
          labelId="claim-type-label"
          label="Claim Type"
          value={formData.claimType}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              claimType: e.target.value as ClaimType,
            }))
          }
        >
          {CLAIM_TYPES.map((type) => (
            <MenuItem
              key={type}
              value={type}
            >
              {CLAIM_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Incident date */}
      <Box sx={{ mt: 1 }}>
        <CalendarInput
          label="Incident Date"
          value={formData.incidentDate}
          onChange={(d) =>
            setFormData((prev) => ({ ...prev, incidentDate: d }))
          }
        />
      </Box>

      {/* Description */}
      <TextField
        label="Incident Description"
        placeholder="Describe what happened — include the location, sequence of events, parties involved, and any immediate actions taken…"
        fullWidth
        multiline
        required
        minRows={4}
        maxRows={8}
        value={formData.incidentDescription}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            incidentDescription: e.target.value,
          }))
        }
        margin="normal"
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
      />

      {/* ── Content picker ─────────────────────────────────────────────── */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "text.secondary",
            }}
          >
            Supporting Evidence
          </Typography>
          {formData.selectedContentUuids.length > 0 && (
            <Chip
              label={`${formData.selectedContentUuids.length} selected`}
              size="small"
              color="primary"
              variant="filled"
              sx={{ fontWeight: 700, fontSize: "0.68rem" }}
            />
          )}
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1.5, display: "block" }}
        >
          Select existing documents from the content library to attach as
          evidence. The UUID of each selected item will be linked to this claim.
        </Typography>

        {/* Search bar */}
        <TextField
          size="small"
          fullWidth
          placeholder="Search by title, author, position…"
          value={contentSearch}
          onChange={(e) => setContentSearch(e.target.value)}
          sx={{
            "mb": 1,
            "& .MuiOutlinedInput-root": { borderRadius: "10px" },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Scrollable content list */}
        <Box
          sx={{
            "border": "1px solid",
            "borderColor": "divider",
            "borderRadius": "10px",
            "maxHeight": 240,
            "overflowY": "auto",
            "&::-webkit-scrollbar": { width: 5 },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 3,
              backgroundColor: "divider",
            },
          }}
        >
          {contentLoading ?
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress size={22} />
            </Box>
          : filteredContent.length === 0 ?
            <Box
              sx={{
                py: 4,
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <LibraryBooksIcon sx={{ fontSize: 28, opacity: 0.25, mb: 0.5 }} />
              <Typography
                variant="caption"
                display="block"
              >
                {contentSearch ?
                  "No results match your search."
                : "No content available."}
              </Typography>
            </Box>
          : filteredContent.map((row, i) => {
              const selected = isSelected(row.uuid);
              const ext =
                row.fileType ?
                  row.fileType.split("/").pop()?.toUpperCase()
                : null;

              return (
                <Box
                  key={row.uuid}
                  onClick={() => toggleContent(row.uuid)}
                  sx={{
                    "display": "flex",
                    "alignItems": "center",
                    "gap": 1.5,
                    "px": 1.5,
                    "py": 1,
                    "cursor": "pointer",
                    "borderBottom":
                      i < filteredContent.length - 1 ? "1px solid" : "none",
                    "borderColor": "divider",
                    "backgroundColor":
                      selected ? "primary.light" : "transparent",
                    "transition": "background-color 0.15s",
                    "&:hover": {
                      backgroundColor:
                        selected ? "primary.light" : "action.hover",
                    },
                  }}
                >
                  {selected ?
                    <CheckBoxIcon
                      sx={{
                        fontSize: 20,
                        color: "primary.main",
                        flexShrink: 0,
                      }}
                    />
                  : <CheckBoxOutlineBlankIcon
                      sx={{
                        fontSize: 20,
                        color: "text.disabled",
                        flexShrink: 0,
                      }}
                    />
                  }

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: selected ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: selected ? "primary.dark" : "text.primary",
                      }}
                    >
                      {row.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {row.contentOwner}
                      {row.forPosition &&
                        ` · ${row.forPosition.replace(/_/g, " ")}`}
                    </Typography>
                  </Box>

                  {ext && (
                    <Chip
                      label={`.${ext}`}
                      size="small"
                      variant="outlined"
                      sx={{ height: 18, fontSize: "0.62rem", flexShrink: 0 }}
                    />
                  )}
                </Box>
              );
            })
          }
        </Box>

        {/* Selected items summary */}
        {selectedItems.length > 0 && (
          <Stack
            spacing={0.5}
            sx={{ mt: 1.5 }}
          >
            {selectedItems.map((row) => (
              <Stack
                key={row.uuid}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "8px",
                  backgroundColor: "action.hover",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                >
                  <AttachFileIcon
                    sx={{ fontSize: 15, color: "text.secondary" }}
                  />
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ maxWidth: 260 }}
                  >
                    {row.title}
                  </Typography>
                </Stack>
                <IconButton
                  size="small"
                  onClick={() => toggleContent(row.uuid)}
                  sx={{ color: "text.secondary" }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>

      {error && (
        <Typography
          color="error"
          variant="body2"
          sx={{ mt: 1 }}
        >
          {error}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.5}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={submitting}
          startIcon={
            submitting ?
              <CircularProgress
                size={18}
                color="inherit"
              />
            : undefined
          }
          sx={{
            "borderRadius": "10px",
            "fontWeight": 700,
            "py": 1.3,
            "fontFamily": "Rubik, sans-serif",
            "textTransform": "none",
            "fontSize": "1rem",
            "background": "linear-gradient(135deg, #1A1E4B, #395176)",
            "boxShadow": "0 4px 14px rgba(26,30,75,0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #0f1230, #2d4060)",
            },
          }}
        >
          {submitting ? "Submitting…" : "Submit Claim"}
        </Button>
        <Button
          variant="text"
          fullWidth
          onClick={onCancel}
          sx={{
            borderRadius: "10px",
            color: "text.secondary",
            textTransform: "none",
            fontFamily: "Rubik, sans-serif",
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
}

// ── Past claim history card ────────────────────────────────────────────────────

function ClaimHistoryCard({
  claim,
  index,
}: {
  claim: ClaimRecord;
  index: number;
}) {
  const attachmentCount = claim.contents?.length ?? 0;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Accordion
        variant="outlined"
        disableGutters
        sx={{ borderRadius: "12px !important", overflow: "hidden" }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ width: "100%", pr: 1 }}
          >
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                  {CLAIM_TYPE_LABELS[claim.claimType] ?? claim.claimType}
                </Typography>
                <Chip
                  label={statusLabel(claim.status)}
                  size="small"
                  color={statusColor(claim.status)}
                  variant="filled"
                  sx={{ fontWeight: 700, fontSize: "0.68rem" }}
                />
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Incident:{" "}
                {new Date(claim.incidentDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {attachmentCount > 0 &&
                  ` · ${attachmentCount} attachment${attachmentCount !== 1 ? "s" : ""}`}
              </Typography>
            </Box>
          </Stack>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="subtitle2"
            sx={{
              mb: 0.75,
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "text.secondary",
            }}
          >
            Incident Description
          </Typography>
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.7, mb: 2, whiteSpace: "pre-wrap" }}
          >
            {claim.incidentDescription}
          </Typography>

          {claim.contents && claim.contents.length > 0 && (
            <>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 0.75,
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "text.secondary",
                }}
              >
                Attachments
              </Typography>
              <Stack spacing={0.5}>
                {claim.contents.map(({ content }) => (
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
                    {content.fileType && (
                      <Chip
                        label={content.fileType.split("/").pop()?.toUpperCase()}
                        size="small"
                        variant="outlined"
                        sx={{ height: 18, fontSize: "0.62rem" }}
                      />
                    )}
                  </Stack>
                ))}
              </Stack>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
