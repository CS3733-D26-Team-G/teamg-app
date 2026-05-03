import React, { useEffect, useMemo, useState } from "react";
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
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Slide,
  Stack,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import HeaderSearchBar from "../../content/components/HeaderSearchBar.tsx";
import ManageEmployeeForm from "./ManageEmployeeForm";
import { API_ENDPOINTS } from "../../../config";
import {
  EmployeeFormSchema,
  EmployeeRecordsSchema,
  type Department,
  type EmployeeFormData,
  type EmployeeRecord,
} from "../../../types/employee";
import {
  getPositionChipColor,
  getPositionLabel,
} from "../../../utils/positionDisplay";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MenuItem from "@mui/material/MenuItem";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { dedupeAsync } from "../../../lib/async-cache";
import HelpPopup from "../../../components/HelpPopup";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  minHeight: 128,
}));

const SlideUpTransition = React.forwardRef(function SlideUpTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

export default function EmployeeManagement() {
  const [rows, setRows] = useState<EmployeeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewState, setViewState] = useState<EmployeeRecord | "new" | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Confirmation dialog state
  const [pendingDelete, setPendingDelete] = useState<EmployeeRecord | null>(
    null,
  );
  const [pendingSave, setPendingSave] = useState<{
    formData: EmployeeFormData;
    isExisting: boolean;
  } | null>(null);

  const [positionFilters, setPositionFilters] = useState<string[]>([]);
  const [deptFilters, setDeptFilters] = useState<string[]>([]);

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [positionAnchor, setPositionAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [deptAnchor, setDeptAnchor] = useState<null | HTMLElement>(null);

  const formOpen = viewState !== null;
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElement(event.currentTarget);
  const handleClose = () => setAnchorElement(null);

  const togglePosition = (position: string) => {
    setPositionFilters((cur) =>
      cur.includes(position) ?
        cur.filter((p) => p !== position)
      : [...cur, position],
    );
  };

  const toggleDepartment = (department: string) => {
    setDeptFilters((cur) =>
      cur.includes(department) ?
        cur.filter((d) => d !== department)
      : [...cur, department],
    );
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await dedupeAsync("employee:list", async () => {
        const res = await fetch(API_ENDPOINTS.EMPLOYEE.ROOT, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      });

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

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (searchQuery.trim()) {
          const targetFields = [row.position, row.department];
          const searchMatch = targetFields.some((field) =>
            field?.toLowerCase().includes(searchQuery.toLowerCase()),
          );
          if (!searchMatch) return false;
        }
        if (
          positionFilters.length > 0 &&
          !positionFilters.includes(row.position)
        )
          return false;
        if (
          deptFilters.length > 0 &&
          !deptFilters.includes(row.department ?? "")
        )
          return false;
        return true;
      }),
    [rows, searchQuery, positionFilters, deptFilters],
  );

  // Stage delete for confirmation dialog
  const handleDelete = (row: EmployeeRecord) => {
    setPendingDelete(row);
  };

  // Actually perform delete after confirmation
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const rowToDelete = pendingDelete;
    setPendingDelete(null);
    setDeleting(true);
    try {
      const res = await fetch(API_ENDPOINTS.EMPLOYEE.DELETE(rowToDelete.uuid), {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.uuid !== rowToDelete.uuid));
      } else {
        const errorText = await res.text().catch(() => "");
        console.error("Failed to delete employee:", errorText);
      }
    } catch (error) {
      console.error("Network error during delete:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Stage save for confirmation dialog
  const handleSave = (formData: EmployeeFormData) => {
    const isExisting = viewState !== null && viewState !== "new";
    setPendingSave({ formData, isExisting });
  };

  // Actually perform save after confirmation
  const confirmSave = async () => {
    if (!pendingSave) return;
    const { formData, isExisting } = pendingSave;
    setPendingSave(null);

    const isExistingRecord = viewState !== null && viewState !== "new";
    const uuid =
      isExistingRecord ? (viewState as EmployeeRecord).uuid : undefined;
    const parsedBody = EmployeeFormSchema.parse(formData);

    const url =
      isExistingRecord ?
        API_ENDPOINTS.EMPLOYEE.UPDATE(uuid as string)
      : API_ENDPOINTS.EMPLOYEE.CREATE;

    setSaving(true);
    try {
      const res = await fetch(url, {
        method: isExistingRecord ? "PUT" : "POST",
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
      }
    } catch (error) {
      console.error("Error during confirmSave:", error);
    } finally {
      setSaving(false);
    }
  };

  const getColumns = (
    onEdit: (row: EmployeeRecord) => void,
    onDelete: (row: EmployeeRecord) => void,
  ): GridColDef<EmployeeRecord>[] => {
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
          const firstInitial = params.row.firstName?.[0] ?? "";
          const lastInitial = params.row.lastName?.[0] ?? "";
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
                  bgcolor: avatar ? "transparent" : "#616161",
                  fontSize: "0.875rem",
                  color: "white",
                }}
              >
                {initials}
              </Avatar>
            </Box>
          );
        },
      },
      { field: "firstName", headerName: "First Name", flex: 1, minWidth: 140 },
      { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 140 },
      {
        field: "position",
        headerName: "Position",
        width: 160,
        align: "center",
        renderCell: (params) => {
          const role = params.value as EmployeeRecord["position"];
          return (
            <Chip
              label={getPositionLabel(role)}
              color={getPositionChipColor(role)}
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
        field: "corporateEmail",
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
              disabled={deleting}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </>
        ),
      },
    ];
  };

  // Loading skeleton
  if (loading && rows.length === 0) {
    return (
      <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
        {/* Header skeleton */}
        <Box
          sx={{
            px: 4,
            pt: 5,
            pb: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Skeleton
            variant="text"
            width={300}
            height={60}
            sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
          />
          <Skeleton
            variant="text"
            width={400}
            height={24}
            sx={{ bgcolor: "rgba(255,255,255,0.1)", mt: 1 }}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 3, pb: 3 }}>
            <Skeleton
              variant="rounded"
              width={280}
              height={40}
              sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
            />
            <Skeleton
              variant="rounded"
              width={100}
              height={40}
              sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
            />
            <Box sx={{ ml: "auto" }}>
              <Skeleton
                variant="rounded"
                width={140}
                height={40}
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              />
            </Box>
          </Box>
        </Box>

        {/* Table skeleton */}
        <Box sx={{ width: "95%", mx: "auto" }}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={56}
            sx={{ mb: 0.5 }}
          />
          {[...Array(8)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width="100%"
              height={52}
              sx={{ mb: 0.5, opacity: 1 - i * 0.08 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: "100vh", overflowY: "auto" }}>
      {/* ── Toolbar / header ──────────────────────────────────────────────── */}
      <AppBar
        position="static"
        sx={{
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: "transparent",
          boxShadow: "none",
          p: 0,
        }}
      >
        <StyledToolbar
          sx={{
            width: "100%",
            px: 0,
            p: "0 !important",
            background: "transparent",
            overflow: "hidden",
          }}
        >
          <Box
            className="employee-header"
            sx={{
              px: 4,
              pt: 5,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Box>
                <Typography
                  variant="h2"
                  sx={{ color: "white", mb: 0.5 }}
                >
                  Employee Management
                </Typography>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}
                >
                  A central hub for staff records, role assignments, and
                  department oversight.
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 0.5,
                  zIndex: 10,
                }}
              >
                <HelpPopup
                  description="The employee management page allows admins to add, manage, and delete any employee within iBank's database."
                  infoOrHelp={true}
                />
              </Box>
            </Stack>
            <Box
              sx={{
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                pt: 2,
                flexWrap: "wrap",
                position: "relative",
                zIndex: 1000,
              }}
            ></Box>
          </Box>
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.12)",
                width: 120 + i * 80,
                height: 120 + i * 80,
                top: -40 - i * 30,
                right: -40 - i * 30,
              }}
            />
          ))}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              pb: 3,
              px: 4,
            }}
          >
            <Box
              className="app-bar"
              sx={{ display: "flex", gap: 4 }}
            >
              <Box sx={{ flexGrow: 1, maxWidth: "70%" }}>
                <HeaderSearchBar setSearchQuery={setSearchQuery} />
              </Box>

              <Box>
                <Button
                  onClick={handleFilterClick}
                  aria-controls={anchorElement ? "filter-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorElement ? "true" : undefined}
                  variant="contained"
                  startIcon={<FilterAltIcon />}
                >
                  Filter
                </Button>
              </Box>

              {/* Filter pop-up */}
              <Popover
                open={Boolean(anchorElement)}
                anchorEl={anchorElement}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{
                  paper: { sx: { border: "1px solid", borderColor: "gray" } },
                }}
              >
                <MenuItem
                  onClick={(e) => {
                    setPositionAnchor(e.currentTarget);
                    setDeptAnchor(null);
                  }}
                >
                  Position <ArrowRightIcon sx={{ ml: "auto" }} />
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    setDeptAnchor(e.currentTarget);
                    setPositionAnchor(null);
                  }}
                >
                  Department <ArrowRightIcon sx={{ ml: "auto" }} />
                </MenuItem>
              </Popover>

              {/* Position sub-pop-up */}
              <Popover
                open={Boolean(positionAnchor)}
                anchorEl={positionAnchor}
                onClose={() => setPositionAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: { border: "1px solid", borderColor: "gray", ml: 1 },
                  },
                }}
              >
                <FormGroup sx={{ pl: 1 }}>
                  {[
                    ["UNDERWRITER", "Underwriter"],
                    ["BUSINESS_ANALYST", "Business Analysis"],
                    ["ACTUARIAL_ANALYST", "Actuarial Analyst"],
                    ["EXL_OPERATIONS", "EXL Operations"],
                    ["BUSINESS_OP_RATING", "Business Ops Rating"],
                    ["ADMIN", "Admin"],
                  ].map(([value, label]) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox onChange={() => togglePosition(value)} />
                      }
                      checked={positionFilters.includes(value)}
                      label={label}
                    />
                  ))}
                </FormGroup>
              </Popover>

              {/* Department sub-pop-up */}
              <Popover
                open={Boolean(deptAnchor)}
                anchorEl={deptAnchor}
                onClose={() => setDeptAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: { border: "1px solid", borderColor: "gray", ml: 1 },
                  },
                }}
              >
                <FormGroup sx={{ pl: 1 }}>
                  {[
                    ["OPERATION_TECHNOLOGY", "Operation Technology"],
                    ["ACCOUNTING", "Accounting"],
                  ].map(([value, label]) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox onChange={() => toggleDepartment(value)} />
                      }
                      checked={deptFilters.includes(value)}
                      label={label}
                    />
                  ))}
                </FormGroup>
              </Popover>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HelpPopup
                description="Add, filter, or search for specific employees within the database."
                infoOrHelp={true}
              />
              <Button
                onClick={() => setViewState("new")}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ whiteSpace: "nowrap" }}
              >
                New Employee
              </Button>
            </Box>
          </Box>
        </StyledToolbar>
      </AppBar>

      {/* ── Data grid ─────────────────────────────────────────────────────── */}
      <DataGrid
        rows={filteredRows}
        columns={getColumns((row) => setViewState(row), handleDelete)}
        getRowId={(row) => row.uuid}
        loading={loading}
        pageSizeOptions={[5, 10]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          height: "calc(100vh - 200px)",
          width: "95%",
          mx: "auto",
        }}
      />

      {/* ── Save Confirmation Dialog ──────────────────────────────────────── */}
      <Dialog
        open={pendingSave !== null}
        onClose={() => setPendingSave(null)}
      >
        <DialogTitle>
          {pendingSave?.isExisting ? "Update employee" : "Create employee"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.1rem" }}>
            {pendingSave?.isExisting ?
              `Are you sure you want to save changes to ${pendingSave.formData.firstName} ${pendingSave.formData.lastName}?`
            : `Are you sure you want to create ${pendingSave?.formData.firstName ?? ""} ${pendingSave?.formData.lastName ?? ""}?`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPendingSave(null)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={() => void confirmSave()}
            variant="contained"
            disabled={saving}
            startIcon={
              saving ?
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              : undefined
            }
          >
            {saving ? "Saving…" : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirmation Dialog ────────────────────────────────────── */}
      <Dialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
      >
        <DialogTitle>Delete employee</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.1rem" }}>
            Are you sure you want to remove{" "}
            <strong>
              {pendingDelete?.firstName} {pendingDelete?.lastName}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPendingDelete(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={() => void confirmDelete()}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={
              deleting ?
                <CircularProgress
                  size={16}
                  color="inherit"
                />
              : undefined
            }
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Employee Form Modal ───────────────────────────────────────────── */}
      <Dialog
        open={formOpen}
        onClose={() => setViewState(null)}
        TransitionComponent={SlideUpTransition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          },
        }}
      >
        {/* Modal header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #1A1E4B 0%, #395176 100%)",
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "1.15rem",
              fontFamily: "Rubik, sans-serif",
            }}
          >
            {viewState === "new" ? "Add New Employee" : "Edit Employee"}
          </Typography>
          <IconButton
            onClick={() => setViewState(null)}
            size="small"
            sx={{
              "color": "rgba(255,255,255,0.8)",
              "backgroundColor": "rgba(255,255,255,0.1)",
              "borderRadius": "8px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Scrollable form body */}
        <DialogContent
          sx={{
            "p": 0,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 3,
              backgroundColor: "divider",
            },
          }}
        >
          <ManageEmployeeForm
            initialData={viewState === "new" ? null : viewState}
            onSave={handleSave}
            onCancel={() => setViewState(null)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
