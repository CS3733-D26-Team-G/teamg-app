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
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import HeaderSearchBar from "./HeaderSearchBar";
import ManageEmployeeForm from "./ManageEmployeeForm";
import { User } from "lucide-react";
import { API_ENDPOINTS } from "../../config";
import {
  EmployeeFormSchema,
  EmployeeRecordsSchema,
  type Department,
  type EmployeeFormData,
  type EmployeeRecord,
  type Position,
} from "../../types/employee";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  minHeight: 128,
}));

export default function EmployeeManagement() {
  const [rows, setRows] = useState<EmployeeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState<EmployeeRecord | "new" | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.EMPLOYEE, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data: unknown = await res.json();

      const parsed = EmployeeRecordsSchema.safeParse(data);
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

  const handleDelete = async (row: EmployeeRecord) => {
    if (
      !window.confirm(`Remove employee ${row.first_name} ${row.last_name}?`)
    ) {
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.EMPLOYEE_DELETE(row.uuid), {
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
    const parsedBody = EmployeeFormSchema.parse(formData);

    if (
      !window.confirm(
        `Are you sure you want to update "${formData.first_name + " " + formData.last_name}"?`,
      )
    ) {
      return;
    }

    const url =
      isExisting ?
        API_ENDPOINTS.EMPLOYEE_UPDATE(uuid as string)
      : API_ENDPOINTS.EMPLOYEE_CREATE;

    try {
      const res = await fetch(url, {
        method: isExisting ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(parsedBody),
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
    onEdit: (row: EmployeeRecord) => void,
    onDelete: (row: EmployeeRecord) => void,
  ): GridColDef<EmployeeRecord>[] => {
    const colorMap: Record<Position, "error" | "info" | "success"> = {
      ADMIN: "error",
      UNDERWRITER: "info",
      BUSINESS_ANALYST: "success",
      ACTUARIAL_ANALYST: "info",
      EXL_OPERATIONS: "success",
      BUSINESS_OP_RATING: "success",
    };

    const deptLabels: Record<Department, string> = {
      OPERATION_TECHNOLOGY: "Ops & Technology",
      ACCOUNTING: "Accounting",
    };

    return [
      {
        field: "userIcon",
        headerName: "",
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const { avatar } = params.row;
          const firstInitial = params.row.first_name?.[0] ?? "";
          const lastInitial = params.row.last_name?.[0] ?? "";
          const initials = (firstInitial + lastInitial).toUpperCase() || "?";

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Avatar
                src={avatar || undefined}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: avatar ? "transparent" : "primary.main",
                  fontSize: "0.875rem",
                }}
              >
                {initials}
              </Avatar>
            </Box>
          );
        },
      },
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
        valueGetter: (value) =>
          deptLabels[value as Department] ?? String(value),
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
    <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
      {viewState ?
        <ManageEmployeeForm
          initialData={viewState === "new" ? null : viewState}
          onSave={handleSave}
          onCancel={() => setViewState(null)}
        />
      : <Box sx={{}}>
          <AppBar
            position="static"
            sx={{
              backgroundColor: "background.paper",
              boxShadow: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <StyledToolbar sx={{ width: "100%", px: 0 }}>
              <Typography
                variant="h2"
                sx={{ pb: 2, pt: 4, color: "text.primary", fontWeight: "bold" }}
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
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            sx={{}}
          />
        </Box>
      }
    </Box>
  );
}
