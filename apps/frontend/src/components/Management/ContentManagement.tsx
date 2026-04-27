import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  IconButton,
  Box,
  Button,
  AppBar,
  Toolbar,
  styled,
  Typography,
  Link,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import type { ContentStatus, Position } from "@repo/db";
import { Heart } from "lucide-react";
import ContentForm from "./ContentForm";
import HeaderSearchBar from "./HeaderSearchBar";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer";
import { API_ENDPOINTS } from "../../config";
import { useAuth } from "../../auth/AuthContext";
import "./ContentManagement.css";
import {
  ContentFavoriteResponseSchema,
  ContentRowsSchema,
  type ContentRow,
} from "../../types/content";
import { useSearchParams } from "react-router-dom";
import {
  getPositionChipColor,
  getPositionLabel,
} from "../../utils/positionDisplay";
import { param } from "framer-motion/m";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import mime from "mime-types";
import DocumentEditorModal from "./DocumentEditorModal.tsx";
import { dedupeAsync } from "../../lib/async-cache";
import HelpPopup from "../../components/HelpPopup";
import DocPreviewer from "./DocPreviewer.tsx";
import InfoPopup from "./ContentInfoPopup.tsx";
import TagManagerPopup from "./TagManagerPopup.tsx";

const statusLabels: Record<ContentStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In-Use",
  UNAVAILABLE: "Unavailable",
};

interface ContentManagementProps {
  viewState: ContentRow | "new" | null;
  setViewState: React.Dispatch<React.SetStateAction<ContentRow | "new" | null>>;
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  minHeight: 128,
}));

{
  /* Highlights new content based on what is different from start of session */
}
function getSessionNewIds(rows: ContentRow[], userUuid: string): Set<string> {
  const KEY = `new_content_ids_${userUuid}`;
  const INITIAL_IDS_KEY = `initial_content_ids_${userUuid}`;
  const SESSION_KEY = `session_id_${userUuid}`;

  // Generate a session ID for this tab using sessionStorage
  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, crypto.randomUUID());
  }
  const sessionId = sessionStorage.getItem(SESSION_KEY)!;

  const fullInitialKey = `${INITIAL_IDS_KEY}_${sessionId}`;
  const fullNewKey = `${KEY}_${sessionId}`;

  if (!localStorage.getItem(fullInitialKey)) {
    const initialIds = rows.map((r) => r.uuid);
    localStorage.setItem(fullInitialKey, JSON.stringify(initialIds));
    return new Set();
  }

  const initialIds = new Set(
    JSON.parse(localStorage.getItem(fullInitialKey)!) as string[],
  );

  const newIds = rows
    .filter((row) => !initialIds.has(row.uuid))
    .map((row) => row.uuid);

  const existing = localStorage.getItem(fullNewKey);
  const storedIds: string[] =
    existing ? (JSON.parse(existing) as string[]) : [];
  const mergedSet = new Set([...storedIds, ...newIds]);
  localStorage.setItem(fullNewKey, JSON.stringify(Array.from(mergedSet)));

  return mergedSet;
}

export default function ContentManagement({
  viewState,
  setViewState,
}: ContentManagementProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [positionFilters, setPositionFilters] = useState<string[]>([]);
  const [fileTypeFilters, setFileTypeFilters] = useState<string[]>([]);

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [positionAnchor, setPositionAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [fileTypeAnchor, setFileTypeAnchor] = useState<null | HTMLElement>(
    null,
  );

  const [searchParams, setSearchParams] = useSearchParams(); // Add this

  const [rows, setRows] = useState<ContentRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const [favoritePending, setFavoritePending] = useState<
    Record<string, boolean>
  >({});
  const { session } = useAuth();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    uri: string;
    fileName: string;
    uuid: string;
    for_position: Position;
  } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContentRow | null>(null);
  const [pendingSave, setPendingSave] = useState<FormData | null>(null);

  const userPosition = session?.position ?? null;
  const isSystemAdmin = session?.permissions.canManageAllContent ?? false;

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setSearchQuery(filterParam);
    }
  }, [searchParams]);

  const fetchRows = useCallback(async () => {
    try {
      const data = await dedupeAsync("content:list", async () => {
        const res = await fetch(API_ENDPOINTS.CONTENT.ROOT, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
      });
      const parsed = ContentRowsSchema.safeParse(data);

      if (!parsed.success) {
        console.error(parsed.error);
        setRows([]);
        return;
      }

      setRows(parsed.data);
    } catch (error) {
      console.error(error);
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        // Search Bar Filter Logic
        if (searchQuery.trim()) {
          const targetFields = [
            row.title,
            row.status,
            row.url,
            row.content_owner,
            row.for_position,
            row.file_type,
          ];
          const searchMatch = targetFields.some((field) =>
            field?.toLowerCase().includes(searchQuery.toLowerCase()),
          );

          if (!searchMatch) return false;
        }

        //Filter Button Logic

        //Position Filter
        if (
          positionFilters.length > 0 &&
          !positionFilters.includes(row.for_position)
        ) {
          return false;
        }

        //File Type Filter
        if (
          fileTypeFilters.length > 0 &&
          !fileTypeFilters.includes(row.file_type ?? "")
        ) {
          return false;
        }

        return true;
      }),
    [rows, searchQuery, positionFilters, fileTypeFilters],
  );

  const togglePosition = (position: string) => {
    //update the position filters array
    setPositionFilters((currentPositionFilters) => {
      //check if the current array already has the toggled position
      if (currentPositionFilters.includes(position)) {
        //clear selected filter
        return currentPositionFilters.filter((pos) => pos !== position);
      } else {
        //add selected position filter
        return currentPositionFilters.concat(position);
      }
    });
  };

  const toggleFileType = (fileType: string) => {
    //update the file type filters array
    setFileTypeFilters((currentFileTypeFilters) => {
      //check if the current array already has the toggled file type
      if (currentFileTypeFilters.includes(fileType)) {
        //clear selected filter
        return currentFileTypeFilters.filter((type) => type !== fileType);
      } else {
        return currentFileTypeFilters.concat(fileType);
      }
    });
  };

  const handleDelete = (row: ContentRow) => {
    setPendingDelete(row);
  };
  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    const rowToDelete = pendingDelete;
    setPendingDelete(null);
    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.DELETE(rowToDelete.uuid), {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.uuid !== rowToDelete.uuid));
        setViewState((current) =>
          current !== "new" && current?.uuid === rowToDelete.uuid ?
            null
          : current,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditStart = async (row: ContentRow) => {
    setLockMessage(null);

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.LOCK(row.uuid), {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 409) {
        setRows((prev) =>
          prev.map((r) => (r.uuid === row.uuid ? { ...r, isLocked: true } : r)),
        );
        return;
      }

      if (!res.ok) {
        setLockMessage("Unable to lock content");
        return;
      }

      setViewState(row);
    } catch (error) {
      console.error(error);
      setLockMessage("Unable to lock content for editing.");
    }
  };

  const releaseLock = async (uuid: string) => {
    try {
      await fetch(API_ENDPOINTS.CONTENT.LOCK(uuid), {
        method: "DELETE",
        credentials: "include",
      });

      setRows((prev) =>
        prev.map((r) => (r.uuid === uuid ? { ...r, isLocked: false } : r)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = (payload: FormData) => {
    setPendingSave(payload);
  };

  const confirmSave = async () => {
    if (!pendingSave) {
      return;
    }

    const payloadToSave = pendingSave;
    setPendingSave(null);
    const isExisting = viewState !== "new" && viewState !== null;
    const uuid = isExisting ? viewState.uuid : crypto.randomUUID();
    const url =
      isExisting ?
        API_ENDPOINTS.CONTENT.EDIT(uuid)
      : API_ENDPOINTS.CONTENT.CREATE;

    try {
      const res = await fetch(url, {
        method: isExisting ? "PUT" : "POST",
        credentials: "include",
        body: payloadToSave,
      });

      if (res.ok) {
        if (isExisting) {
          await releaseLock(uuid);
        }
        await fetchRows();
        setViewState(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async (row: ContentRow) => {
    const nextIsFavorite = !row.is_favorite;

    setFavoritePending((prev) => ({
      ...prev,
      [row.uuid]: true,
    }));

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.FAVORITE(row.uuid), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: nextIsFavorite }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: unknown = await res.json();
      const parsed = ContentFavoriteResponseSchema.safeParse(data);

      if (!parsed.success) {
        console.error(parsed.error);
        await fetchRows();
        return;
      }

      setRows((prevRows) =>
        prevRows.map((r) =>
          r.uuid === parsed.data.contentUuid ?
            { ...r, is_favorite: parsed.data.isFavorite }
          : r,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setFavoritePending((prev) => ({
        ...prev,
        [row.uuid]: false,
      }));
    }
  };

  const handleDownload = async (row: ContentRow) => {
    try {
      const response = await fetch(row.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = row.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const [sessionNewIds, setSessionNewIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (rows.length > 0 && session?.employeeUuid) {
      setSessionNewIds(getSessionNewIds(rows, session.employeeUuid));
    }
  }, [rows, session?.employeeUuid]);

  const confirmationDialogs = (
    <>
      <Dialog
        open={pendingSave !== null}
        onClose={() => setPendingSave(null)}
      >
        <DialogTitle>Submit content</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.1rem" }}>
            Are you sure you want to submit this content?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingSave(null)}>Cancel</Button>
          <Button
            onClick={() => void confirmSave()}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
      >
        <DialogTitle>Delete content</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.1rem" }}>
            Are you sure you want to delete this content?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Cancel</Button>
          <Button
            onClick={() => void confirmDelete()}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  const getColumns = (
    onEdit: (row: ContentRow) => void,
    onPreview: (row: ContentRow) => void,
    onDownload: (row: ContentRow) => void,
  ): GridColDef<ContentRow>[] => [
    {
      field: "favorite",
      headerName: "",
      width: 70,
      type: "number",
      sortable: false,
      filterable: false,
      valueGetter: (_value, row) => (row.is_favorite ? 1 : 0),
      renderCell: (params) => (
        <IconButton
          onClick={() => void toggleFavorite(params.row)}
          disabled={favoritePending[params.row.uuid]}
        >
          <Heart
            size={20}
            fill={params.row.is_favorite ? "#e50000" : "none"}
            color={params.row.is_favorite ? "#ff4d4f" : "#e50000"}
          />
        </IconButton>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              void toggleFavorite(params.row);
            }}
            disabled={favoritePending[params.row.uuid]}
          >
            <Heart
              size={20}
              fill={params.row.is_favorite ? "#e50000" : "none"}
              color={params.row.is_favorite ? "#ff4d4f" : "#e50000"}
            />
          </IconButton>
          {params.row.title}
          <InfoPopup
            url={params.row.url}
            author={params.row.content_owner}
            position={params.row.for_position}
            fileType={params.row.file_type}
          />
        </Box>
      ),
    },
    {
      field: "last_modified_time",
      headerName: "Last Modified",
      type: "dateTime",
      width: 130,
      valueGetter: (_value, row) =>
        row.last_modified_time ? new Date(row.last_modified_time) : null,
      renderCell: (params) => {
        const date = params.value as Date | null;
        const isNew = sessionNewIds.has(params.row.uuid);
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {isNew && (
              <FiberNewIcon
                sx={{ color: theme.palette.primary.main }}
                fontSize="medium"
              />
            )}
            <span>
              {date ?
                date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
            </span>
          </Box>
        );
      },
    },
    {
      field: "url",
      headerName: "URL",
      flex: 1,
      renderCell: (params) => (
        <Link
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "content_owner",
      headerName: "Author",
      width: 140,
    },
    {
      field: "edited-by",
      headerName: "Editor",
      width: 140,
      valueGetter: (_, row) => {
        const employee = row.editLock?.lockedByEmp;
        return employee ? `${employee.first_name} ${employee.last_name}` : "";
      },
    },
    {
      field: "for_position",
      headerName: "Position",
      width: 160,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={getPositionLabel(params.value as Position)}
          color={getPositionChipColor(params.value as Position)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={statusLabels[params.value as ContentStatus]}
          size="small"
          variant="outlined"
          sx={{ borderColor: "black" }}
        />
      ),
    },
    {
      field: "file_type",
      headerName: "File Type",
      width: 110,
      align: "center",
      renderCell: (params) => {
        const ext = params.value ? mime.extension(params.value) : null;
        return (
          <Chip
            label={ext ? `.${ext.toUpperCase()}` : "N/A"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      minWidth: 220,
      align: "center",
      resizable: false,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const hasPermission =
          isSystemAdmin || userPosition === params.row.for_position;
        const isCheckedOut = params.row.isLocked;

        return (
          <>
            <IconButton
              color="primary"
              onClick={() => onPreview(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
            <Tooltip
              title={
                !hasPermission ?
                  "You don't have access to download this file"
                : ""
              }
            >
              <span>
                <IconButton
                  color="primary"
                  onClick={() => void onDownload(params.row)}
                  disabled={!hasPermission}
                >
                  <DownloadIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={isCheckedOut ? "Content is checked out" : ""}>
              <span>
                <Button
                  size="small"
                  onClick={() => onEdit(params.row)}
                  disabled={!hasPermission || isCheckedOut}
                  sx={{ border: "0.5px solid" }}
                >
                  {" "}
                  CHECK OUT
                </Button>
              </span>
            </Tooltip>
          </>
        );
      },
    },
  ];

  if (viewState) {
    return (
      <Box sx={{ p: 3 }}>
        <ContentForm
          initialData={viewState === "new" ? null : viewState}
          onSave={handleSave}
          onCancel={async () => {
            if (viewState !== "new") {
              await releaseLock(viewState.uuid);
            }
            setViewState(null);
          }}
          onDelete={
            viewState !== "new" ? () => handleDelete(viewState) : undefined
          }
        />
        {confirmationDialogs}
      </Box>
    );
  }

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "background.paper", boxShadow: "none" }}
      >
        <StyledToolbar>
          <Typography
            variant="h2"
            sx={{ pb: 2, pt: 4, color: "text.primary", fontWeight: "bold" }}
          >
            Content Management
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", gap: 4 }}>
              <Box>
                <Button
                  onClick={handleFilterClick}
                  aria-controls={anchorElement ? "filter-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorElement ? "true" : undefined}
                  variant="outlined"
                  startIcon={<FilterAltIcon />}
                  sx={{ border: "2px solid" }}
                >
                  Filter
                </Button>
              </Box>

              {/*Filter Pop-up*/}
              <Popover
                open={Boolean(anchorElement)}
                anchorEl={anchorElement}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: {
                      border: "1px solid",
                      borderColor: "gray",
                    },
                  },
                }}
              >
                {/*Position Item*/}
                <MenuItem
                  onClick={(event) => {
                    setPositionAnchor(event.currentTarget);
                    setFileTypeAnchor(null);
                  }}
                >
                  Position
                  <ArrowRightIcon sx={{ ml: "auto" }} />
                </MenuItem>

                {/*File Type Item*/}
                <MenuItem
                  onClick={(event) => {
                    setFileTypeAnchor(event.currentTarget);
                    setPositionAnchor(null);
                  }}
                >
                  File Type
                  <ArrowRightIcon sx={{ ml: "auto" }} />
                </MenuItem>
              </Popover>

              {/*Position Sub-Pop-Up*/}
              <Popover
                open={Boolean(positionAnchor)}
                anchorEl={positionAnchor}
                onClose={() => setPositionAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: {
                      border: "1px solid",
                      borderColor: "gray",
                      ml: 1,
                    },
                  },
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => togglePosition("UNDERWRITER")}
                      />
                    }
                    checked={positionFilters.includes("UNDERWRITER")}
                    label="Underwriter"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => togglePosition("BUSINESS_ANALYST")}
                      />
                    }
                    checked={positionFilters.includes("BUSINESS_ANALYST")}
                    label="Business Analysis"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => togglePosition("ACTUARIAL_ANALYST")}
                      />
                    }
                    checked={positionFilters.includes("ACTUARIAL_ANALYST")}
                    label="Actuarial Analyst"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => togglePosition("EXL_OPERATIONS")}
                      />
                    }
                    checked={positionFilters.includes("EXL_OPERATIONS")}
                    label="EXL Operations"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => togglePosition("BUSINESS_OP_RATING")}
                      />
                    }
                    checked={positionFilters.includes("BUSINESS_OP_RATING")}
                    label="Business Ops Rating"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={() => togglePosition("ADMIN")} />
                    }
                    checked={positionFilters.includes("ADMIN")}
                    label="Admin"
                  />
                </FormGroup>
              </Popover>

              {/*File Type Sub-Pop-Up*/}
              <Popover
                open={Boolean(fileTypeAnchor)}
                anchorEl={fileTypeAnchor}
                onClose={() => setFileTypeAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: {
                      border: "1px solid",
                      borderColor: "gray",
                      ml: 1,
                    },
                  },
                }}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => toggleFileType("application/pdf")}
                      />
                    }
                    checked={fileTypeFilters.includes("application/pdf")}
                    label=".PDF"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() =>
                          toggleFileType(
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          )
                        }
                      />
                    }
                    checked={fileTypeFilters.includes(
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    )}
                    label=".DOCX"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() =>
                          toggleFileType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                          )
                        }
                      />
                    }
                    checked={fileTypeFilters.includes(
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    )}
                    label=".XLSX"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={() => toggleFileType("image/png")} />
                    }
                    checked={fileTypeFilters.includes("image/png")}
                    label=".PNG"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() =>
                          toggleFileType(
                            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                          )
                        }
                      />
                    }
                    checked={fileTypeFilters.includes(
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    )}
                    label=".PPTX"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={() => toggleFileType("text/plain")} />
                    }
                    checked={fileTypeFilters.includes("text/plain")}
                    label=".TXT"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={() => toggleFileType("text/csv")} />
                    }
                    checked={fileTypeFilters.includes("text/csv")}
                    label=".CSV"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => toggleFileType("application/json")}
                      />
                    }
                    checked={fileTypeFilters.includes("application/json")}
                    label=".JSON"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={() => toggleFileType("video/mp4")} />
                    }
                    checked={fileTypeFilters.includes("video/mp4")}
                    label=".MP4"
                  />
                </FormGroup>
              </Popover>

              <Box sx={{ flexGrow: 1, maxWidth: "70%" }}>
                <HeaderSearchBar setSearchQuery={setSearchQuery} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HelpPopup description="The Content page displays all documents and resources available for your role. You can search, filter, download, and open items directly." />
              {isSystemAdmin && (
                <TagManagerPopup
                  rows={rows}
                  onTagsChanged={fetchRows}
                />
              )}
              <Button
                onClick={() => setViewState("new")}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ whiteSpace: "nowrap" }}
              >
                New Content
              </Button>
            </Box>
          </Box>

          {lockMessage && (
            <Typography sx={{ pt: 1, color: "warning.main" }}>
              {lockMessage}
            </Typography>
          )}
        </StyledToolbar>
      </AppBar>

      <DataGrid
        rows={filteredRows}
        getRowId={(row) => row.uuid}
        columns={getColumns(
          handleEditStart,
          (row) => {
            const isExternalUrl =
              !row.supabasePath && !row.url.includes("supabase.co/storage");
            if (isExternalUrl) {
              window.open(row.url, "_blank");
              return;
            }
            setSelectedDoc({
              uri: API_ENDPOINTS.CONTENT.FILE(row.uuid),
              fileName: row.title,
              uuid: row.uuid,
              for_position: row.for_position,
            });
            setPreviewOpen(true);
          },
          handleDownload,
        )}
        getRowClassName={(params) => {
          const hasPermission =
            isSystemAdmin || userPosition === params.row.for_position;
          const isNew = sessionNewIds.has(params.row.uuid);
          const classes: string[] = [];
          if (!hasPermission) classes.push("row-locked");
          if (isNew) classes.push("row-new");
          return classes.join(" ");
        }}
        sx={{
          "height": 600,
          "overflow": "hidden",
          "border": "none",
          "& .row-locked": {
            backgroundColor:
              isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(245, 245, 245, 1)",
            color: "text.disabled",
            cursor: "not-allowed",
          },
          "& .row-locked a": {
            color: "inherit",
            pointerEvents: "none",
            textDecoration: "none",
          },
          "& .row-new": {
            backgroundColor:
              isDark ?
                `${theme.palette.primary.main}1F`
              : `${theme.palette.primary.light}80`,
            borderLeft: "3px solid",
            borderLeftColor: theme.palette.primary.main,
          },
          "& .row-new:hover": {
            backgroundColor:
              isDark ?
                `${theme.palette.primary.main}38`
              : `${theme.palette.primary.light}D9`,
          },
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: "favorite", sort: "desc" }] },
          columns: {
            columnVisibilityModel: {
              "favorite": false,
              "url": false,
              "author": false,
              "edited-by": false,
              "for_position": false,
              "file_type": false,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
      />

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedDoc(null);
        }}
        maxWidth="lg"
        fullWidth
        keepMounted
      >
        <Box sx={{ height: "85vh", display: "flex", flexDirection: "column" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 1, gap: 1, flexShrink: 0 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ pl: 1, color: "text.secondary" }}
              noWrap
            >
              {selectedDoc?.fileName ?? "Preview"}
            </Typography>
            <Button
              onClick={() => {
                setPreviewOpen(false);
                setSelectedDoc(null);
              }}
            >
              Close
            </Button>
          </Stack>
          <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
            {selectedDoc && (
              <DocPreviewer
                key={selectedDoc.uuid}
                uri={selectedDoc.uri}
                fileName={selectedDoc.fileName}
              />
            )}
          </Box>
        </Box>
      </Dialog>

      {/* Document Editor Modal — opened via the Edit button when checked out */}
      {editorOpen && selectedDoc && (
        <DocumentEditorModal
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          uri={selectedDoc.uri}
          fileName={selectedDoc.fileName}
          uuid={selectedDoc.uuid}
          readOnly={false}
        />
      )}

      {confirmationDialogs}
    </Box>
  );
}
