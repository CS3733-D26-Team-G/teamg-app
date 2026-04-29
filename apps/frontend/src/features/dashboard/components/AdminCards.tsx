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
import { getPositionLabel } from "../../../utils/positionDisplay";

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

const MOCK_EMPLOYEES: EmployeeOption[] = [
  {
    uuid: "emp-1",
    first_name: "Avery",
    last_name: "Stone",
    position: "UNDERWRITER",
  },
  {
    uuid: "emp-2",
    first_name: "Maya",
    last_name: "Cole",
    position: "BUSINESS_ANALYST",
  },
  {
    uuid: "emp-3",
    first_name: "Jordan",
    last_name: "Price",
    position: "ACTUARIAL_ANALYST",
  },
  {
    uuid: "emp-4",
    first_name: "Riley",
    last_name: "Nguyen",
    position: "EXL_OPERATIONS",
  },
  {
    uuid: "emp-5",
    first_name: "Casey",
    last_name: "Brooks",
    position: "BUSINESS_OP_RATING",
  },
  {
    uuid: "emp-6",
    first_name: "Taylor",
    last_name: "Morgan",
    position: "ADMIN",
  },
];

const MOCK_ACTIVITY_BY_EMPLOYEE: Record<string, ActivitySummary> = {
  "emp-1": { edited: 18, checkedOut: 11, deleted: 2 },
  "emp-2": { edited: 14, checkedOut: 8, deleted: 1 },
  "emp-3": { edited: 10, checkedOut: 6, deleted: 2 },
  "emp-4": { edited: 7, checkedOut: 9, deleted: 1 },
  "emp-5": { edited: 12, checkedOut: 7, deleted: 3 },
  "emp-6": { edited: 9, checkedOut: 4, deleted: 4 },
};

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

  const filteredEmployees = useMemo(() => {
    if (!employeeType) {
      return MOCK_EMPLOYEES;
    }

    return MOCK_EMPLOYEES.filter(
      (employee) => employee.position === employeeType,
    );
  }, [employeeType]);

  const normalizedEmployeeUuid =
    (
      employeeUuid &&
      filteredEmployees.some((employee) => employee.uuid === employeeUuid)
    ) ?
      employeeUuid
    : "";

  const summary = useMemo(() => {
    if (normalizedEmployeeUuid) {
      return (
        MOCK_ACTIVITY_BY_EMPLOYEE[normalizedEmployeeUuid] ?? {
          edited: 0,
          checkedOut: 0,
          deleted: 0,
        }
      );
    }

    return filteredEmployees.reduce<ActivitySummary>(
      (acc, employee) =>
        addSummary(
          acc,
          MOCK_ACTIVITY_BY_EMPLOYEE[employee.uuid] ?? {
            edited: 0,
            checkedOut: 0,
            deleted: 0,
          },
        ),
      {
        edited: 0,
        checkedOut: 0,
        deleted: 0,
      },
    );
  }, [filteredEmployees, normalizedEmployeeUuid]);

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
            Employee Activity
          </Typography>
        }
      />
      <Divider />
      <CardContent className="p-4">
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
            <InputLabel id="employee-type-filter-label">
              Employee Type
            </InputLabel>
            <Select
              labelId="employee-type-filter-label"
              value={employeeType}
              label="Employee Type"
              onChange={(event: SelectChangeEvent) => {
                setEmployeeType(event.target.value);
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
            <InputLabel id="employee-filter-label">Employee</InputLabel>
            <Select
              labelId="employee-filter-label"
              value={employeeUuid}
              label="Employee"
              onChange={(event: SelectChangeEvent) => {
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
