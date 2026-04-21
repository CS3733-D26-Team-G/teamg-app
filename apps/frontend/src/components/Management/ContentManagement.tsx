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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import {
  getPositionChipColor,
  getPositionLabel,
} from "../../utils/positionDisplay";
import { param } from "framer-motion/m";

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
const NEW_THRESHOLD_DAYS = 5;

function isNewContent(lastModified: Date | string | null | undefined): boolean {
  if (!lastModified) return false;
  const diff = Date.now() - new Date(lastModified).getTime();
  return diff < NEW_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
}

function getSessionNewIds(rows: ContentRow[]): Set<string> {
  const KEY = "new_content_ids";
  const SESSION_START_KEY = "session_start_time";

  if (!sessionStorage.getItem(SESSION_START_KEY)) {
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
    sessionStorage.removeItem(KEY);
  }

  const sessionStart = parseInt(sessionStorage.getItem(SESSION_START_KEY)!);
  const existing = sessionStorage.getItem(KEY);
  const storedIds: string[] =
    existing ? (JSON.parse(existing) as string[]) : [];

  const newIds = rows
    .filter((row) => {
      if (!row.last_modified_time) return false;
      return new Date(row.last_modified_time).getTime() > sessionStart;
    })
    .map((row) => row.uuid);

  const mergedSet = new Set(storedIds);
  newIds.forEach((id) => mergedSet.add(id));
  const merged = Array.from(mergedSet);

  sessionStorage.setItem(KEY, JSON.stringify(merged));
  return mergedSet;
}

export default function ContentManagement({
  viewState,
  setViewState,
}: ContentManagementProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [rows, setRows] = useState<ContentRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const [favoritePending, setFavoritePending] = useState<
    Record<string, boolean>
  >({});
  const { session } = useAuth();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    uri: string;
    fileName: string;
  } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContentRow | null>(null);
  const [pendingSave, setPendingSave] = useState<FormData | null>(null);

  const userPosition = session?.position ?? null;
  const isSystemAdmin = session?.permissions.canManageAllContent ?? false;

  const fetchRows = useCallback(async () => {
    try {
      const res = await fetch(API_ENDPOINTS.CONTENT, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: unknown = await res.json();
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
        if (!searchQuery.trim()) return true;
        const targetFields = [
          row.title,
          row.url,
          row.content_owner,
          row.for_position,
        ];
        return targetFields.some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }),
    [rows, searchQuery],
  );

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
      const res = await fetch(API_ENDPOINTS.CONTENT_DELETE(rowToDelete.uuid), {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.uuid !== rowToDelete.uuid));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditStart = async (row: ContentRow) => {
    setLockMessage(null);

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT_LOCK(row.uuid), {
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
      await fetch(API_ENDPOINTS.CONTENT_LOCK(uuid), {
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
        API_ENDPOINTS.CONTENT_EDIT(uuid)
      : API_ENDPOINTS.CONTENT_CREATE;

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
      const res = await fetch(API_ENDPOINTS.CONTENT_FAVORITE(row.uuid), {
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

  const [sessionNewIds, setSessionNewIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (rows.length > 0) {
      setSessionNewIds(getSessionNewIds(rows));
    }
  }, [rows]);

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
    onDelete: (row: ContentRow) => void,
    onPreview: (row: ContentRow) => void,
  ): GridColDef<ContentRow>[] => [
    {
      field: "favorite",
      headerName: "",
      width: 70,
      type: "number",
      sortable: false,
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
    { field: "title", headerName: "Title", flex: 1 },
    {
      field: "last_modified_time",
      headerName: "Last Modified",
      type: "dateTime",
      width: 150,
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
    // {
    //   field: "url",
    //   headerName: "URL",
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Link
    //       href={params.value}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       {params.value}
    //     </Link>
    //   ),
    // },
    {
      field: "content_owner",
      headerName: "Author",
      width: 150,
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
      field: "url",
      headerName: "File Type",
      width: 120,
      align: "center",
      renderCell: (params) => {
        const properURL = params.value?.split("?")[0] ?? "";
        const segment = properURL.split(".").pop() ?? "";
        const extension =
          segment.length <= 5 && !segment.includes("/") ?
            segment.toUpperCase()
          : null;
        return (
          <Chip
            label={extension ? `.${extension}` : "N/A"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
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
            <IconButton
              onClick={() => onDelete(params.row)}
              disabled={!hasPermission || isCheckedOut}
            >
              <DeleteIcon
                color={hasPermission && !isCheckedOut ? "error" : "disabled"}
              />
            </IconButton>
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
                  variant="outlined"
                  startIcon={<FilterAltIcon />}
                  sx={{ border: "2px solid" }}
                >
                  Filter
                </Button>
              </Box>
              <Box sx={{ flexGrow: 1, maxWidth: "70%" }}>
                <HeaderSearchBar setSearchQuery={setSearchQuery} />
              </Box>
            </Box>

            <Button
              onClick={() => setViewState("new")}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ whiteSpace: "nowrap" }}
            >
              New Content
            </Button>
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
        columns={getColumns(handleEditStart, handleDelete, (row) => {
          setSelectedDoc({ uri: row.url, fileName: row.title });
          setPreviewOpen(true);
        })}
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
        }}
        pageSizeOptions={[5, 10]}
      />

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <Box
          sx={{
            p: 1,
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Button
            onClick={() => setPreviewOpen(false)}
            sx={{ alignSelf: "flex-end" }}
          >
            Close
          </Button>

          {selectedDoc && (
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: "flex",
              }}
            >
              <DocViewer
                className="content-preview-viewer"
                documents={[selectedDoc]}
                pluginRenderers={DocViewerRenderers}
                config={{
                  header: { disableHeader: false, disableFileName: false },
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          )}
        </Box>
      </Dialog>
      {confirmationDialogs}
    </Box>
  );
}
