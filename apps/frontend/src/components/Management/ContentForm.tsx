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
  type SelectChangeEvent,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Autorenew, CloudUpload, Link as LinkIcon } from "@mui/icons-material";
import type {
  ContentStatus,
  ContentType,
  Position,
  ContentTag,
} from "@repo/db";
import CalendarInput from "../CalendarInput.tsx";
import { Schemas } from "@repo/zod";
import { useAuth } from "../../auth/AuthContext.tsx";
import { getPositionLabel } from "../../utils/positionDisplay";

import type { ContentFormData, ContentRecord } from "../../types/content";
import { API_ENDPOINTS } from "../../config.ts";

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
  const isAdmin = session?.permissions.canManageAllContent ?? false;

  const [formData, setFormData] = useState<ContentFormData>(() =>
    buildDefaultFormData({
      ...(initialData ?? undefined),
      for_position: initialData?.for_position ?? session?.position,
    }),
  );
  const [sourceType, setSourceType] = useState<"url" | "file">(() =>
    getInitialSourceType(initialData),
  );
  const [file, setFile] = useState<File | null>(null);

  const [availableTags, setAvailableTags] = useState<ContentTag[]>([]);
  const [selectedTagUuids, setSelectedTagUuids] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CONTENT.TAG.GET_ALL, {
          credentials: "include",
        });
        const data: ContentTag[] = await res.json();
        setAvailableTags(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    setFormData(
      buildDefaultFormData({
        ...(initialData ?? undefined),
        for_position: initialData?.for_position ?? session?.position,
      }),
    );
    setSourceType(getInitialSourceType(initialData));
    setFile(null);
    setSelectedTagUuids([]);
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

    selectedTagUuids.forEach((uuid) => body.append("tagUuids", uuid));

    if (sourceType === "file") {
      if (file) {
        body.append("file", file);
      } else if (!isEditing) {
        console.error("A file must be selected for file upload.");
        return;
      }
    } else {
      body.append("url", formData.url);
    }

    onSave(body);
  };

  return (
    <Box
      component="form"
      onSubmit={handleInternalSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        px: 3,
        py: 3,
      }}
    >
      {/* Source type toggle */}
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
        <Autocomplete
          multiple
          options={availableTags}
          getOptionLabel={(tag) => tag.name}
          value={availableTags.filter((tag) =>
            selectedTagUuids.includes(tag.uuid),
          )}
          onChange={(_, selectedTags) =>
            setSelectedTagUuids(selectedTags.map((tag) => tag.uuid))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tags"
              margin="normal"
              placeholder={selectedTagUuids.length ? "" : "Select tags..."}
            />
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((tag, index) => (
              <Chip
                label={tag.name}
                size="small"
                {...getTagProps({ index })}
                key={tag.uuid}
              />
            ))
          }
        />
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

      <Divider sx={{ my: 2 }} />

      {/* Action buttons */}
      <Stack spacing={1.5}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          size="large"
          sx={{
            borderRadius: "10px",
            fontWeight: 700,
            py: 1.3,
            fontFamily: "Rubik, sans-serif",
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          {isEditing ? "Save Changes" : "Create Content"}
        </Button>

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
