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
  type SelectChangeEvent,
} from "@mui/material";
import { CloudUpload, Link as LinkIcon } from "@mui/icons-material";
import type { ContentStatus, ContentType, Position } from "@repo/db";
import CalendarInput from "../CalendarInput.tsx";
import { Schemas } from "@repo/zod";
import "./ContentForm.css";
import { useAuth } from "../../auth/AuthContext.tsx";

import type { ContentFormData, ContentRecord } from "../../types/content";

interface ContentFormProps {
  initialData?: ContentRecord | null;
  onSave: (data: FormData) => void;
  onCancel: () => void;
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
}: ContentFormProps) {
  const isEditing = !!initialData;
  const { session } = useAuth();
  const isAdmin = session?.permissions.canManageAllContent ?? false;

  const [formData, setFormData] = useState<ContentFormData>(() =>
    buildDefaultFormData({
      ...(initialData ?? undefined),
      for_position: initialData?.for_position ?? session?.position,
    }),
  );
  const [sourceType, setSourceType] = useState<"url" | "file">(
    initialData?.url ? "url" : "file",
  );
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData(
      buildDefaultFormData({
        ...(initialData ?? undefined),
        for_position: initialData?.for_position ?? session?.position,
      }),
    );
    setSourceType(initialData?.url ? "url" : "file");
    setFile(null);
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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange =
    <K extends keyof ContentFormData>(field: K) =>
    (event: SelectChangeEvent<string>) => {
      handleChange(field, event.target.value as ContentFormData[K]);
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0] ?? null;
    setFile(nextFile);

    if (nextFile && !formData.title) {
      handleChange("title", nextFile.name);
    }
  };

  const handleInternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      if (!file) {
        console.error("A file must be selected for file upload.");
        return;
      }
      body.append("file", file);
    } else {
      body.append("url", formData.url);
    }

    onSave(body);
  };

  return (
    <section className="main-content-form">
      <div className="MuiPaper-root">
        <div>
          <Box
            component="form"
            className="form"
            onSubmit={handleInternalSubmit}
          >
            <h1>{isEditing ? "Edit Document" : "Submit a New File"}</h1>

            <ToggleButtonGroup
              value={sourceType}
              exclusive
              onChange={(_, val) => {
                if (!val) return;
                setSourceType(val);
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

            <TextField
              label="Name of Document"
              fullWidth
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              variant="outlined"
              margin="normal"
            />

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
                  "border": "1px solid rgba(0, 0, 0, 0.23)",
                  "borderRadius": "4px",
                  "p": 2,
                  "textAlign": "center",
                  "my": 2,
                  "cursor": "pointer",
                  "&:hover": { borderColor: "rgba(0, 0, 0, 0.87)" },
                }}
                component="label"
              >
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
                <Typography color="textSecondary">
                  {file ?
                    `Selected: ${file.name}`
                  : "Click to upload local file"}
                </Typography>
              </Box>
            }

            <TextField
              label="Content Owner"
              fullWidth
              value={formData.content_owner}
              onChange={(e) => handleChange("content_owner", e.target.value)}
              variant="outlined"
              margin="normal"
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
                    {position}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <CalendarInput
              label="Last Modified Date"
              value={formData.last_modified_time}
              onChange={(newDate) =>
                handleChange("last_modified_time", newDate)
              }
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              sx={{ mt: 2 }}
            >
              {isEditing ? "Update Changes" : "Create Content"}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={onCancel}
              sx={{ mt: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </div>
      </div>
    </section>
  );
}
