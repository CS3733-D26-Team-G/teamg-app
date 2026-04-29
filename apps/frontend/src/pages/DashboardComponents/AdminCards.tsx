import { useEffect, useMemo, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Alert,
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
import { API_ENDPOINTS } from "../../config";
import { getPositionLabel } from "../../utils/positionDisplay";

interface EmployeeOption {
  uuid: string;
  first_name: string;
  last_name: string;
  position: PositionType;
}

interface ActivitySummaryResponse {
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

export default function AdminCards() {
  const [employeeType, setEmployeeType] = useState("");
  const [employeeUuid, setEmployeeUuid] = useState("");
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [summary, setSummary] = useState<ActivitySummaryResponse>({
    edited: 0,
    checkedOut: 0,
    deleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.EMPLOYEE.ROOT, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch employees: ${res.status}`);
        }

        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch employees");
      }
    };

    void fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    if (!employeeType) {
      return employees;
    }

    return employees.filter((employee) => employee.position === employeeType);
  }, [employeeType, employees]);

  useEffect(() => {
    if (
      employeeUuid &&
      !filteredEmployees.some((employee) => employee.uuid === employeeUuid)
    ) {
      setEmployeeUuid("");
    }
  }, [employeeUuid, filteredEmployees]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (employeeType) {
          params.set("position", employeeType);
        }

        if (employeeUuid) {
          params.set("employeeUuid", employeeUuid);
        }

        const url =
          params.size > 0 ?
            `${API_ENDPOINTS.STATS.ACTIVITY_ACTION_SUMMARY}?${params.toString()}`
          : API_ENDPOINTS.STATS.ACTIVITY_ACTION_SUMMARY;

        const res = await fetch(url, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch activity summary: ${res.status}`);
        }

        const data = await res.json();
        setSummary({
          edited: Number(data.edited ?? 0),
          checkedOut: Number(data.checkedOut ?? 0),
          deleted: Number(data.deleted ?? 0),
        });
        setError(null);
      } catch (err: any) {
        setError(err.message ?? "Failed to fetch activity summary");
      } finally {
        setLoading(false);
      }
    };

    void fetchSummary();
  }, [employeeType, employeeUuid]);

  const chartData = ACTION_LABELS.map((action) => ({
    label: action.label,
    count: summary[action.key],
  }));

  return (
    <Card
      className="w-[560px] max-w-[560px] outline-1 outline-gray-200"
      sx={{ margin: 0 }}
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

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
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
          loading={loading}
          sx={{ width: "80%", mr: "auto" }}
        />
      </CardContent>
    </Card>
  );
}
