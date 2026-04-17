import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CalendarInput from "../CalendarInput.tsx";
import "./EmployeeForm.css";
import { Schemas } from "@repo/zod";
import {
  EmployeeFormSchema,
  type Department,
  type EmployeeFormData,
  type EmployeeRecord,
  type Position,
} from "../../types/employee";
import Button from "@mui/material/Button";

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
    first_name: seed?.first_name ?? "",
    last_name: seed?.last_name ?? "",
    date_of_birth: coerceToDate(seed?.date_of_birth),
    position: (seed?.position ?? "UNDERWRITER") as Position,
    department: (seed?.department ?? "OPERATION_TECHNOLOGY") as Department,
    start_date: coerceToDate(seed?.start_date),
    supervisor: seed?.supervisor ?? "",
    phone_number: seed?.phone_number ?? "",
    personal_email: seed?.personal_email ?? "",
    corporate_email: seed?.corporate_email ?? "",
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

  const positionLabel: Record<Position, string> = {
    ADMIN: "Admin",
    UNDERWRITER: "Underwriter",
    BUSINESS_ANALYST: "Business Analyst",
  };

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
    <section className="main-content-form">
      <div className="MuiPaper-root">
        <Box
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              color: "#1A1E4B",
              fontWeight: "bold",
              mb: 3,
            }}
          >
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </Typography>

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
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              margin="normal"
            />
            <TextField
              label="Last Name"
              fullWidth
              required
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              margin="normal"
            />
          </Stack>

          <CalendarInput
            label="Date of Birth"
            value={formData.date_of_birth}
            onChange={(d) => handleChange("date_of_birth", d)}
          />

          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mt: 2 }}
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
              margin="normal"
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
                    {positionLabel[p]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              required
              margin="normal"
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
            value={formData.start_date}
            onChange={(d) => handleChange("start_date", d)}
          />

          <TextField
            label="Supervisor"
            fullWidth
            required
            value={formData.supervisor}
            onChange={(e) => handleChange("supervisor", e.target.value)}
            margin="normal"
          />

          <TextField
            label="Phone Number"
            fullWidth
            required
            value={formData.phone_number}
            onChange={(e) => handleChange("phone_number", e.target.value)}
            margin="normal"
          />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <TextField
              label="Personal Email"
              type="email"
              fullWidth
              required
              value={formData.personal_email}
              onChange={(e) => handleChange("personal_email", e.target.value)}
              margin="normal"
            />
            <TextField
              label="Corporate Email"
              type="email"
              fullWidth
              required
              value={formData.corporate_email}
              onChange={(e) => handleChange("corporate_email", e.target.value)}
              margin="normal"
            />
          </Stack>

          {submitError ?
            <Typography
              color="error"
              sx={{ mt: 1 }}
            >
              {submitError}
            </Typography>
          : null}

          <Stack
            direction="row"
            spacing={2}
            sx={{ pt: 3 }}
          >
            <Button
              variant="outlined"
              fullWidth
              onClick={onCancel}
              color="inherit"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              {isEditing ? "Save Changes" : "Create Employee"}
            </Button>
          </Stack>
        </Box>
      </div>
    </section>
  );
}
