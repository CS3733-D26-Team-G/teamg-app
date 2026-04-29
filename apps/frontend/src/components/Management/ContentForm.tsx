import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Divider,
  Paper,
  type SelectChangeEvent,
} from "@mui/material";
import { CloudUpload, Link as LinkIcon } from "@mui/icons-material";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SendIcon from "@mui/icons-material/Send";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import type { ContentStatus, ContentType, Position } from "@repo/db";
import CalendarInput from "../CalendarInput.tsx";
import { Schemas } from "@repo/zod";
import { useAuth } from "../../auth/AuthContext.tsx";
import { getPositionLabel } from "../../utils/positionDisplay";
import type { ContentFormData, ContentRecord } from "../../types/content";
import { useProfile } from "../../profile/ProfileContext.tsx";

// Positions that are considered "agents" — neither underwriter nor admin.
const AGENT_POSITIONS: Position[] = [
  "BUSINESS_ANALYST",
  "ACTUARIAL_ANALYST",
  "EXL_OPERATIONS",
  "BUSINESS_OP_RATING",
];

interface ContentFormProps {
  initialData?: ContentRecord | null;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

function getInitialSourceType(
  initialData?: ContentRecord | null,
): "url" | "file" {
  if (initialData?.supabasePath || initialData?.file_type) return "file";
  return initialData?.url ? "url" : "file";
}

function coerceToDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

function buildDefaultFormData(
  seed?: Partial<ContentFormData>,
): ContentFormData {
  return {
    title: seed?.title ?? "",
    url: seed?.url ?? "",
    content_owner: seed?.content_owner ?? "",
    for_position: (seed?.for_position ?? "UNDERWRITER") as Position,
    last_modified_time: coerceToDate(seed?.last_modified_time),
    expiration_time: coerceToDate(seed?.expiration_time),
    content_type: (seed?.content_type ?? "REFERENCE") as ContentType,
    status: (seed?.status ?? "AVAILABLE") as ContentStatus,
  };
}

export default function ContentForm({
  initialData,
  onSave,
  onCancel,
  onDelete,
}: ContentFormProps) {
  const isEditing = !!initialData;
  const { session } = useAuth();
  const { profile } = useProfile();
  const isAdmin = session?.permissions.canManageAllContent ?? false;
  const userPosition = session?.position as Position | undefined;

  // Derived role flags
  const isUnderwriter = userPosition === "UNDERWRITER";
  const isAgent = !!userPosition && AGENT_POSITIONS.includes(userPosition);

  const [formData, setFormData] = useState<ContentFormData>(() =>
    buildDefaultFormData({
      ...(initialData ?? undefined),
      for_position: initialData?.for_position ?? session?.position,
      content_owner:
        initialData?.content_owner ??
        (profile?.first_name && profile?.last_name ?
          `${profile.first_name} ${profile.last_name}`
        : ""),
    }),
  );
  const [sourceType, setSourceType] = useState<"url" | "file">(() =>
    getInitialSourceType(initialData),
  );
  const [file, setFile] = useState<File | null>(null);

  // Underwriter-only risk assessment comment
  const [riskAssessment, setRiskAssessment] = useState("");

  useEffect(() => {
    setFormData(
      buildDefaultFormData({
        ...(initialData ?? undefined),
        for_position: initialData?.for_position ?? session?.position,
        content_owner:
          initialData?.content_owner ??
          (profile?.first_name && profile?.last_name ?
            `${profile.first_name} ${profile.last_name}`
          : ""),
      }),
    );
    setSourceType(getInitialSourceType(initialData));
    setFile(null);
    setRiskAssessment("");
  }, [initialData, session?.position]);

  const positionOptions = useMemo(
    () =>
      isAdmin ?
        (Schemas.PositionSchema.options as Position[])
      : ([session?.position ?? "UNDERWRITER"] as Position[]),
    [isAdmin, session?.position],
  );
  const contentTypeOptions = useMemo(
    () => Schemas.ContentTypeSchema.options as ContentType[],
    [],
  );
  const statusOptions = useMemo(
    () => Schemas.ContentStatusSchema.options as ContentStatus[],
    [],
  );

  const handleChange = <K extends keyof ContentFormData>(
    field: K,
    value: ContentFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange =
    <K extends keyof ContentFormData>(field: K) =>
    (event: SelectChangeEvent<string>) => {
      handleChange(field, event.target.value as ContentFormData[K]);
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;
    setFile(nextFile);
    if (nextFile && !formData.title) handleChange("title", nextFile.name);
  };

  /** Shared FormData builder — called by all submit paths. */
  const buildBody = (extra?: Record<string, string>): FormData => {
    const body = new FormData();
    body.append("title", formData.title);
    body.append("content_owner", formData.content_owner);
    body.append("for_position", formData.for_position);
    body.append(
      "last_modified_time",
      formData.last_modified_time.toISOString(),
    );
    body.append("expiration_time", formData.expiration_time.toISOString());
    body.append("content_type", formData.content_type);
    body.append("status", formData.status);

    if (sourceType === "file") {
      if (file) body.append("file", file);
      // If editing with no new file selected, the server keeps the existing file.
    } else {
      body.append("url", formData.url);
    }

    if (extra) {
      Object.entries(extra).forEach(([k, v]) => body.append(k, v));
    }

    return body;
  };

  /** Standard save / create. */
  const handleInternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceType === "file" && !file && !isEditing) {
      console.error("A file must be selected for file upload.");
      return;
    }
    onSave(buildBody());
  };

  /** Agent: "Submit for Review" — flags the document as pending review. */
  const handleSubmitForReview = () => {
    if (sourceType === "file" && !file && !isEditing) {
      console.error("A file must be selected for file upload.");
      return;
    }
    onSave(buildBody({ workflow_action: "SUBMIT_FOR_REVIEW" }));
  };

  /** Underwriter: "Submit for Approval" — attaches the risk assessment comment. */
  const handleSubmitForApproval = () => {
    if (sourceType === "file" && !file && !isEditing) {
      console.error("A file must be selected for file upload.");
      return;
    }
    onSave(
      buildBody({
        workflow_action: "SUBMIT_FOR_APPROVAL",
        risk_assessment: riskAssessment,
      }),
    );
  };

  const sharedButtonSx = {
    borderRadius: "10px",
    fontWeight: 700,
    py: 1.3,
    fontFamily: "Rubik, sans-serif",
    textTransform: "none",
    fontSize: "1rem",
  } as const;

  return (
    <Box
      component="form"
      onSubmit={handleInternalSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 0, px: 3, py: 3 }}
    >
      {/* ── Source type toggle ─────────────────────────────────────────── */}
      <ToggleButtonGroup
        value={sourceType}
        exclusive
        onChange={(_, val) => {
          if (val) setSourceType(val);
        }}
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="url">
          <LinkIcon sx={{ mr: 1 }} /> External URL
        </ToggleButton>
        <ToggleButton value="file">
          <CloudUpload sx={{ mr: 1 }} /> Local Upload
        </ToggleButton>
      </ToggleButtonGroup>

      {/* ── Document name ──────────────────────────────────────────────── */}
      <TextField
        label="Name of Document"
        fullWidth
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        variant="outlined"
        margin="normal"
      />

      {/* ── URL or file upload ─────────────────────────────────────────── */}
      {sourceType === "url" ?
        <TextField
          label="URL of Link"
          fullWidth
          value={formData.url}
          onChange={(e) => handleChange("url", e.target.value)}
          variant="outlined"
          margin="normal"
        />
      : <Box
          sx={{
            "border": "1px dashed",
            "borderColor": "divider",
            "borderRadius": "8px",
            "p": 2.5,
            "textAlign": "center",
            "my": 1.5,
            "cursor": "pointer",
            "transition": "border-color 0.2s, background-color 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
          component="label"
        >
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
          <CloudUpload
            sx={{ fontSize: 28, color: "text.secondary", mb: 0.5 }}
          />
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {file ? `Selected: ${file.name}` : "Click to upload a local file"}
          </Typography>
          {isEditing && !file && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
              Leave empty to keep the current file.
            </Typography>
          )}
        </Box>
      }

      {/* ── Standard fields ────────────────────────────────────────────── */}
      <TextField
        label="Content Owner"
        fullWidth
        value={formData.content_owner}
        onChange={(e) => handleChange("content_owner", e.target.value)}
        variant="outlined"
        margin="normal"
        disabled={!isAdmin}
      />

      <FormControl
        fullWidth
        margin="normal"
      >
        <InputLabel id="recipient-label">Intended Recipient</InputLabel>
        <Select
          labelId="recipient-label"
          label="Intended Recipient"
          value={formData.for_position}
          onChange={handleSelectChange("for_position")}
          disabled={!isAdmin}
        >
          {positionOptions.map((position) => (
            <MenuItem
              key={position}
              value={position}
            >
              {getPositionLabel(position)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <CalendarInput
        label="Last Modified Date"
        value={formData.last_modified_time}
        onChange={(newDate) => handleChange("last_modified_time", newDate)}
      />

      <CalendarInput
        label="Link Expiration Date"
        value={formData.expiration_time}
        onChange={(newDate) => handleChange("expiration_time", newDate)}
      />

      <FormControl
        fullWidth
        margin="normal"
      >
        <InputLabel id="content-type-label">Type of Content</InputLabel>
        <Select
          labelId="content-type-label"
          label="Type of Content"
          value={formData.content_type}
          onChange={handleSelectChange("content_type")}
        >
          {contentTypeOptions.map((contentType) => (
            <MenuItem
              key={contentType}
              value={contentType}
            >
              {contentType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        fullWidth
        margin="normal"
      >
        <InputLabel id="status-label">Document Status</InputLabel>
        <Select
          labelId="status-label"
          label="Document Status"
          value={formData.status}
          onChange={handleSelectChange("status")}
        >
          {statusOptions.map((status) => (
            <MenuItem
              key={status}
              value={status}
            >
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ── Underwriter: Risk Assessment ───────────────────────────────── */}
      {isUnderwriter && (
        <>
          <Divider sx={{ mt: 2, mb: 1 }} />
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mt: 1,
              mb: 0.5,
              borderWidth: "1.5px",
              borderRadius: "10px",
              // backgroundColor: (t) =>
              //   t.palette.mode === "dark"
              //     ? "rgba(237,168,50,0.06)"
              //     : "rgba(255,244,218,0.6)",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1.25 }}
            >
              <RateReviewIcon fontSize="small" />
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontFamily: "Rubik, sans-serif",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Risk Assessment
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", ml: "auto !important" }}
              >
                Underwriter only
              </Typography>
            </Stack>
            <TextField
              label="Risk assessment comments"
              placeholder="Summarise your risk evaluation, flag any concerns, and note any conditions or exceptions that apply to this document…"
              fullWidth
              multiline
              minRows={8}
              maxRows={12}
              value={riskAssessment}
              onChange={(e) => setRiskAssessment(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                },
              }}
            />
          </Paper>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* ── Action buttons ─────────────────────────────────────────────── */}
      <Stack spacing={1.5}>
        {/* Underwriter only: Submit for Approval */}
        {isUnderwriter && (
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<TaskAltIcon />}
            onClick={handleSubmitForApproval}
            sx={{
              ...sharedButtonSx,
              "background": "linear-gradient(135deg, #1b5e20, #2e7d32)",
              "color": "white",
              "boxShadow": "0 4px 14px rgba(46,125,50,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #14471a, #245c27)",
                boxShadow: "0 6px 18px rgba(46,125,50,0.5)",
              },
            }}
          >
            Submit for Approval
          </Button>
        )}

        {/* Agent only: Submit for Review */}
        {isAgent && (
          <Button
            variant="contained"
            fullWidth
            size="large"
            color="secondary"
            startIcon={<SendIcon />}
            onClick={handleSubmitForReview}
            sx={{
              ...sharedButtonSx,
              "background": (t) =>
                t.palette.mode === "dark" ?
                  "linear-gradient(135deg, #4B1A26, #74414e)"
                : "linear-gradient(135deg, #74414e, #9a5d6a)",
              "color": "white",
              "boxShadow": "0 4px 14px rgba(116,65,78,0.35)",
              "&:hover": {
                background: (t) =>
                  t.palette.mode === "dark" ?
                    "linear-gradient(135deg, #3a1320, #5c3340)"
                  : "linear-gradient(135deg, #5c3340, #7a4555)",
                boxShadow: "0 6px 18px rgba(116,65,78,0.5)",
              },
            }}
          >
            Submit for Review
          </Button>
        )}

        {/* Primary save — visible to everyone */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          size="large"
          sx={sharedButtonSx}
        >
          {isEditing ? "Save Changes" : "Create Content"}
        </Button>

        {/* Delete — only when editing and the callback is provided */}
        {isEditing && onDelete && (
          <Button
            variant="outlined"
            fullWidth
            color="error"
            onClick={onDelete}
            sx={{
              borderRadius: "10px",
              fontWeight: 600,
              textTransform: "none",
              fontFamily: "Rubik, sans-serif",
            }}
          >
            Delete Content
          </Button>
        )}

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
