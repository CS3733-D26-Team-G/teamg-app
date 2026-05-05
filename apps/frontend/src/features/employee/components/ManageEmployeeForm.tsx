import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";

import CalendarInput from "../../../components/CalendarInput.tsx";
import { Schemas } from "@repo/zod";
import {
  EmployeeFormSchema,
  type Department,
  type EmployeeFormData,
  type EmployeeRecord,
  type Position,
} from "../../../types/employee";
import { getPositionLabel } from "../../../utils/positionDisplay";

interface ManageEmployeeFormProps {
  initialData: EmployeeRecord | null;
  onSave: (formData: EmployeeFormData) => void;
  onCancel: () => void;
}

function coerceToDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}

function buildDefaultFormData(
  seed?: Partial<EmployeeFormData>,
): EmployeeFormData {
  return {
    firstName: seed?.firstName ?? "",
    lastName: seed?.lastName ?? "",
    dateOfBirth: coerceToDate(seed?.dateOfBirth),
    position: (seed?.position ?? "UNDERWRITER") as Position,
    department: (seed?.department ?? "OPERATION_TECHNOLOGY") as Department,
    startDate: coerceToDate(seed?.startDate),
    supervisor: seed?.supervisor ?? "",
    phoneNumber: seed?.phoneNumber ?? "",
    personalEmail: seed?.personalEmail ?? "",
    corporateEmail: seed?.corporateEmail ?? "",
  };
}

export default function ManageEmployeeForm({
  initialData,
  onSave,
  onCancel,
}: ManageEmployeeFormProps) {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<EmployeeFormData>(() =>
    buildDefaultFormData(initialData ?? undefined),
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setSubmitError(null);
    setFormData(buildDefaultFormData(initialData ?? undefined));
  }, [initialData]);

  const positionOptions = useMemo(
    () => Schemas.PositionSchema.options as Position[],
    [],
  );
  const departmentOptions = useMemo(
    () => Schemas.DepartmentSchema.options as Department[],
    [],
  );

  const departmentLabel: Record<Department, string> = {
    OPERATION_TECHNOLOGY: "Operations & Technology",
    ACCOUNTING: "Accounting",
  };

  const handleChange = <K extends keyof EmployeeFormData>(
    field: K,
    value: EmployeeFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const parsed = EmployeeFormSchema.safeParse(formData);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      setSubmitError(firstIssue?.message ?? "Invalid form data.");
      return;
    }

    onSave(parsed.data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        px: 3,
        py: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Personal Information */}
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Personal Information
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
      >
        <TextField
          label="First Name"
          fullWidth
          required
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />
        <TextField
          label="Last Name"
          fullWidth
          required
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
      </Stack>

      <CalendarInput
        label="Date of Birth"
        value={formData.dateOfBirth}
        onChange={(d) => handleChange("dateOfBirth", d)}
      />

      <Divider sx={{ my: 2 }} />

      {/* Employment Information */}
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Employment Information
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
      >
        <FormControl
          fullWidth
          required
        >
          <InputLabel id="position-label">Position</InputLabel>
          <Select
            labelId="position-label"
            label="Position"
            value={formData.position}
            onChange={(e) =>
              handleChange("position", e.target.value as Position)
            }
          >
            {positionOptions.map((p) => (
              <MenuItem
                key={p}
                value={p}
              >
                {getPositionLabel(p)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          required
        >
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            label="Department"
            value={formData.department}
            onChange={(e) =>
              handleChange("department", e.target.value as Department)
            }
          >
            {departmentOptions.map((d) => (
              <MenuItem
                key={d}
                value={d}
              >
                {departmentLabel[d]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <CalendarInput
        label="Start Date"
        value={formData.startDate}
        onChange={(d) => handleChange("startDate", d)}
      />

      <TextField
        label="Supervisor"
        fullWidth
        required
        value={formData.supervisor}
        onChange={(e) => handleChange("supervisor", e.target.value)}
      />

      <TextField
        label="Phone Number"
        fullWidth
        required
        value={formData.phoneNumber}
        onChange={(e) => handleChange("phoneNumber", e.target.value)}
      />

      <Divider sx={{ my: 2 }} />

      {/* Contact Information */}
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mb: 1 }}
      >
        Contact Information
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
      >
        <TextField
          label="Personal Email"
          type="email"
          fullWidth
          required
          value={formData.personalEmail}
          onChange={(e) => handleChange("personalEmail", e.target.value)}
        />
        <TextField
          label="Corporate Email"
          type="email"
          fullWidth
          required
          value={formData.corporateEmail}
          onChange={(e) => handleChange("corporateEmail", e.target.value)}
        />
      </Stack>

      {submitError && (
        <Typography
          color="error"
          sx={{ mt: 1, fontSize: "0.875rem" }}
        >
          {submitError}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Action buttons */}
      <Stack
        direction="row"
        spacing={1.5}
      >
        <Button
          variant="outlined"
          fullWidth
          onClick={onCancel}
          color="inherit"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontFamily: "Rubik, sans-serif",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          sx={{
            borderRadius: "10px",
            fontWeight: 700,
            textTransform: "none",
            fontFamily: "Rubik, sans-serif",
            fontSize: "1rem",
            py: 1.3,
          }}
        >
          {isEditing ? "Save Changes" : "Create Employee"}
        </Button>
      </Stack>
    </Box>
  );
}
