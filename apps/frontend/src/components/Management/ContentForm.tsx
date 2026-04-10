import * as React from "react";
import { useMemo, useState } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import { z } from "zod";

import CalendarInput from "../CalendarInput.tsx";
import { Schemas } from "@repo/zod";
import "./ContentForm.css";

type ContentFormData = z.infer<typeof Schemas.ContentCreateInputObjectZodSchema>;
type ContentRecord = ContentFormData & { uuid: string };
type Position = z.infer<typeof Schemas.PositionSchema>;
type ContentType = z.infer<typeof Schemas.ContentTypeSchema>;
type ContentStatus = z.infer<typeof Schemas.ContentStatusSchema>;

interface ContentFormProps {
  initialData?: ContentRecord | null;
  onSave: (data: ContentFormData) => void;
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

function buildDefaultFormData(seed?: Partial<ContentFormData>): ContentFormData {
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

  const [formData, setFormData] = useState<ContentFormData>(() =>
    buildDefaultFormData(initialData ?? undefined),
  );

  const positionOptions = useMemo(
    () => Schemas.PositionSchema.options as Position[],
    [],
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

  const handleInternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
            <TextField
              label="Name of Document"
              fullWidth
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="URL of Link"
              fullWidth
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              variant="outlined"
              margin="normal"
            />
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
            >
              {isEditing ? "Update Changes" : "Create Content"}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Box>
        </div>
      </div>
    </section>
  );
}
