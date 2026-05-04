import { useMemo, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import type { Position as PositionType } from "@repo/db";
import { useAuth } from "../../../auth/AuthContext";
import { getPositionLabel } from "../../../utils/positionDisplay";
import { useDashboardBootstrapQuery } from "../../../lib/activity-loaders";

interface EmployeeOption {
  uuid: string;
  first_name: string;
  last_name: string;
  position: PositionType;
}

interface ActivitySummary {
  edited: number;
  checkedOut: number;
  deleted: number;
}

const ACTION_COLORS = ["#395176", "#509edd", "#ba667b"];

const ACTION_LABELS = [
  { key: "edited", label: "Edited" },
  { key: "checkedOut", label: "Checked Out" },
  { key: "deleted", label: "Deleted" },
] as const;

const POSITION_OPTIONS: PositionType[] = [
  "UNDERWRITER",
  "BUSINESS_ANALYST",
  "ADMIN",
  "ACTUARIAL_ANALYST",
  "EXL_OPERATIONS",
  "BUSINESS_OP_RATING",
];

function addSummary(
  acc: ActivitySummary,
  next: ActivitySummary,
): ActivitySummary {
  return {
    edited: acc.edited + next.edited,
    checkedOut: acc.checkedOut + next.checkedOut,
    deleted: acc.deleted + next.deleted,
  };
}

export default function AdminCards() {
  const [employeeType, setEmployeeType] = useState("");
  const [employeeUuid, setEmployeeUuid] = useState("");
  const [employeeTypeTouched, setEmployeeTypeTouched] = useState(false);
  const [employeeTouched, setEmployeeTouched] = useState(false);

  const { session } = useAuth();
  const isAdmin = session?.position === "ADMIN";

  const { data } = useDashboardBootstrapQuery({
    position: isAdmin ? employeeType || undefined : undefined,
    employeeUuid: isAdmin ? employeeUuid || undefined : session?.employeeUuid,
    isAdmin,
  });

  const employees: EmployeeOption[] =
    data?.employees.map((employee) => ({
      uuid: employee.uuid,
      first_name: employee.firstName,
      last_name: employee.lastName,
      position: employee.position,
    })) ?? [];

  const filteredEmployees = useMemo(() => {
    if (!employeeType) {
      return employees;
    }

    return employees.filter((employee) => employee.position === employeeType);
  }, [employeeType]);

  const normalizedEmployeeUuid =
    (
      employeeUuid &&
      filteredEmployees.some((employee) => employee.uuid === employeeUuid)
    ) ?
      employeeUuid
    : "";

  //Needed later
  const summary = data?.activitySummary ?? {
    edited: 0,
    checkedOut: 0,
    deleted: 0,
  };

  const chartData = ACTION_LABELS.map((action) => ({
    label: action.label,
    count: summary[action.key],
  }));

  return (
    <Card
      className="min-w-[560px] flex-1 outline-1 outline-gray-200"
      sx={{ margin: 0, borderRadius: 3 }}
    >
      <CardHeader
        sx={{ py: 1.5, px: 2 }}
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            {isAdmin ? "Employee Activity" : "My Content Changes"}
          </Typography>
        }
      />
      <Divider />
      <CardContent className="p-4">
        {isAdmin && (
          <Box className="mb-6 flex flex-wrap gap-4">
            <FormControl
              size="small"
              sx={{
                "minWidth": 220,
                "& .MuiInputBase-root": { fontFamily: "inherit" },
                "& .MuiInputLabel-root": { fontFamily: "inherit" },
                "& .MuiMenuItem-root": { fontFamily: "inherit" },
              }}
            >
              <InputLabel
                id="employee-type-filter-label"
                shrink={employeeTypeTouched}
              >
                Employee Type
              </InputLabel>
              <Select
                labelId="employee-type-filter-label"
                value={employeeType}
                label="Employee Type"
                displayEmpty
                renderValue={(selected) => {
                  if (!employeeTypeTouched) {
                    return "";
                  }

                  return selected ?
                      getPositionLabel(selected as PositionType)
                    : "All Employee Types";
                }}
                onChange={(event: SelectChangeEvent) => {
                  setEmployeeTypeTouched(true);
                  setEmployeeType(event.target.value);
                  setEmployeeUuid("");
                  setEmployeeTouched(false);
                }}
              >
                <MenuItem value="">All Employee Types</MenuItem>
                {POSITION_OPTIONS.map((position) => (
                  <MenuItem
                    key={position}
                    value={position}
                  >
                    {getPositionLabel(position)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                "minWidth": 260,
                "& .MuiInputBase-root": { fontFamily: "inherit" },
                "& .MuiInputLabel-root": { fontFamily: "inherit" },
                "& .MuiMenuItem-root": { fontFamily: "inherit" },
              }}
            >
              <InputLabel
                id="employee-filter-label"
                shrink={employeeTouched}
              >
                Employee
              </InputLabel>
              <Select
                labelId="employee-filter-label"
                value={employeeUuid}
                label="Employee"
                displayEmpty
                renderValue={(selected) => {
                  if (!employeeTouched) {
                    return "";
                  }

                  if (!selected) {
                    return "All Employees";
                  }

                  const selectedEmployee = employees.find(
                    (employee) => employee.uuid === selected,
                  );

                  return selectedEmployee ?
                      `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
                    : "All Employees";
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 8 * 48 + 8,
                    },
                  },
                }}
                onChange={(event: SelectChangeEvent) => {
                  setEmployeeTouched(true);
                  setEmployeeUuid(event.target.value);
                }}
              >
                <MenuItem value="">All Employees</MenuItem>
                {filteredEmployees.map((employee) => (
                  <MenuItem
                    key={employee.uuid}
                    value={employee.uuid}
                  >
                    {employee.first_name} {employee.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <BarChart
          dataset={chartData}
          layout="horizontal"
          height={250}
          margin={{ top: 8, right: 0, bottom: 16, left: 0 }}
          xAxis={[
            {
              position: "none",
              tickLabelStyle: {
                fontFamily: "inherit",
                fontSize: 13,
              },
            },
          ]}
          yAxis={[
            {
              scaleType: "band",
              dataKey: "label",
              width: 95,
              tickLabelStyle: {
                fontFamily: "inherit",
                fontSize: 13,
              },
              colorMap: {
                type: "ordinal",
                values: ACTION_LABELS.map((action) => action.label),
                colors: ACTION_COLORS,
              },
            },
          ]}
          series={[
            {
              dataKey: "count",
              label: "Actions",
              valueFormatter: (value) => `${value ?? 0}`,
            },
          ]}
          hideLegend
          grid={{ vertical: true }}
          borderRadius={6}
          sx={{ width: "80%", mr: "auto" }}
        />
      </CardContent>
    </Card>
  );
}
