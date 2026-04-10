import { useEffect, useMemo, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { z } from "zod";

import HeaderSearchBar from "./HeaderSearchBar";
import ManageEmployeeForm from "./ManageEmployeeForm";
import { Schemas } from "@repo/zod";

const API_BASE = "http://localhost:3000";

type EmployeeFormData = z.infer<typeof Schemas.EmployeeCreateInputObjectZodSchema>;
type EmployeeRow = EmployeeFormData & { uuid: string };
type Position = z.infer<typeof Schemas.PositionSchema>;
type Department = z.infer<typeof Schemas.DepartmentSchema>;

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  minHeight: 128,
}));

const EmployeeRowSchema = Schemas.EmployeeCreateInputObjectZodSchema.extend({
  uuid: z.string(),
});

export default function EmployeeManagement() {
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState<EmployeeRow | "new" | null>(null);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/employee`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: unknown = await res.json();

      const parsed = z.array(EmployeeRowSchema).safeParse(data);
      if (!parsed.success) {
        console.error("Employee list failed schema validation:", parsed.error);
        setRows([]);
        return;
      }

      setRows(parsed.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;

    const searchStr = searchQuery.toLowerCase();
    return rows.filter((row) => {
      return (
        row.first_name.toLowerCase().includes(searchStr) ||
        row.last_name.toLowerCase().includes(searchStr) ||
        row.position.toLowerCase().includes(searchStr) ||
        row.department.toLowerCase().includes(searchStr) ||
        row.corporate_email.toLowerCase().includes(searchStr)
      );
    });
  }, [rows, searchQuery]);

  const handleDelete = async (row: EmployeeRow) => {
    if (!window.confirm(`Remove employee ${row.first_name} ${row.last_name}?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/employee/delete/${row.uuid}`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.uuid !== row.uuid));
      } else {
        const errorText = await res.text().catch(() => "");
        console.error("Failed to delete employee:", errorText);
        alert(
          "Delete failed. Check server logs (backend route may be rejecting).",
        );
      }
    } catch (error) {
      console.error("Network error during delete:", error);
      alert("Network error while deleting employee.");
    }
  };

  const handleSave = async (formData: EmployeeFormData) => {
    const isExisting = viewState !== null && viewState !== "new";
    const uuid = isExisting ? viewState.uuid : undefined;

    const parsedFull = Schemas.EmployeeUpdateInputObjectSchema.parse({
      ...formData,
      ...(uuid ? { uuid } : {}),
    });

    const url = isExisting
      ? `${API_BASE}/employee/update/${uuid as string}`
      : `${API_BASE}/employee/create`;

    const body = isExisting
      ? (() => {
          const { uuid: _omit, ...rest } = parsedFull;
          return rest;
        })()
      : parsedFull;

    try {
      const res = await fetch(url, {
        method: isExisting ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await loadEmployees();
        setViewState(null);
      } else {
        const errorText = await res.text().catch(() => "");
        console.error("Save failed:", errorText);
        alert("Save failed. Please verify required fields and try again.");
      }
    } catch (error) {
      console.error("Error during handleSave:", error);
      alert("Network error while saving employee.");
    }
  };

  const getColumns = (
    onEdit: (row: EmployeeRow) => void,
    onDelete: (row: EmployeeRow) => void,
  ): GridColDef<EmployeeRow>[] => {
    const colorMap: Record<Position, "error" | "info" | "success"> = {
      ADMIN: "error",
      UNDERWRITER: "info",
      BUSINESS_ANALYST: "success",
    };

    const deptLabels: Record<Department, string> = {
      OPERATION_TECHNOLOGY: "Ops & Technology",
      ACCOUNTING: "Accounting",
    };

    return [
      { field: "first_name", headerName: "First Name", flex: 1, minWidth: 140 },
      { field: "last_name", headerName: "Last Name", flex: 1, minWidth: 140 },
      {
        field: "position",
        headerName: "Position",
        width: 160,
        renderCell: (params) => {
          const role = params.value as Position;
          return (
            <Chip
              label={role}
              color={colorMap[role] ?? "default"}
              size="small"
              variant="outlined"
            />
          );
        },
      },
      {
        field: "department",
        headerName: "Department",
        width: 190,
        valueGetter: (value) => deptLabels[value as Department] ?? String(value),
      },
      {
        field: "corporate_email",
        headerName: "Corporate Email",
        flex: 1.2,
        minWidth: 220,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <>
            <IconButton
              onClick={() => onEdit(params.row)}
              aria-label="Edit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete(params.row)}
              aria-label="Delete"
            >
              <DeleteIcon color="error" />
            </IconButton>
          </>
        ),
      },
    ];
  };

  return (
    <Box sx={{ height: 650, width: "100%", p: 2 }}>
      {viewState ? (
        <ManageEmployeeForm
          initialData={viewState === "new" ? null : viewState}
          onSave={handleSave}
          onCancel={() => setViewState(null)}
        />
      ) : (
        <Box>
          <AppBar
            position="static"
            sx={{
              backgroundColor: "white",
              boxShadow: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <StyledToolbar sx={{ width: "100%", px: 0 }}>
              <Typography
                variant="h4"
                sx={{ pb: 2, pt: 4, color: "black", fontWeight: "bold" }}
              >
                Employee Management
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box sx={{ flexGrow: 1, maxWidth: "70%" }}>
                  <HeaderSearchBar setSearchQuery={setSearchQuery} />
                </Box>
                <Button
                  onClick={() => setViewState("new")}
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  New Employee
                </Button>
              </Box>
            </StyledToolbar>
          </AppBar>

          <DataGrid
            rows={filteredRows}
            columns={getColumns((row) => setViewState(row), handleDelete)}
            getRowId={(row) => row.uuid}
            loading={loading}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            sx={{ mt: 2 }}
          />
        </Box>
      )}
    </Box>
  );
}
