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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Position } from "@repo/db";
import { Heart } from "lucide-react";
import ContentForm from "./ContentForm";
import HeaderSearchBar from "./HeaderSearchBar";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { API_ENDPOINTS } from "../../config";
import { useAuth } from "../../auth/AuthContext";
import {
  ContentFavoriteResponseSchema,
  ContentRowsSchema,
  type ContentRow,
} from "../../types/content";

const positionLabels: Record<Position, string> = {
  UNDERWRITER: "UNDERWRITER",
  BUSINESS_ANALYST: "BUSINESS ANALYST",
  ADMIN: "ADMIN",
};

const colorMap: Record<Position, "error" | "info" | "success"> = {
  ADMIN: "error",
  UNDERWRITER: "info",
  BUSINESS_ANALYST: "success",
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

  const handleDelete = async (row: ContentRow) => {
    if (!window.confirm(`Are you sure you want to delete "${row.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT_DELETE(row.uuid), {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.uuid !== row.uuid));
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
        setLockMessage("This content is locked by another user");
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

  const handleSave = async (payload: FormData) => {
    const isExisting = viewState !== "new" && viewState !== null;
    const uuid = isExisting ? viewState.uuid : crypto.randomUUID();
    const url =
      isExisting ?
        API_ENDPOINTS.CONTENT_EDIT(uuid)
      : API_ENDPOINTS.CONTENT_CREATE;

    if (
      !window.confirm(
        `Are you sure you want to save "${payload.get("title")}"?`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(url, {
        method: isExisting ? "PUT" : "POST",
        credentials: "include",
        body: payload,
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

  const getColumns = (
    onEdit: (row: ContentRow) => void,
    onDelete: (row: ContentRow) => void,
    onPreview: (row: ContentRow) => void,
  ): GridColDef<ContentRow>[] => [
    {
      field: "favorite",
      headerName: "Favorite",
      width: 70,
      type: "number",
      sortable: true,
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
      field: "edited-by",
      headerName: "Editor",
      width: 180,
      valueGetter: (_, row) => {
        const employee = row.lock?.locked_by;
        return employee ? `${employee.first_name} ${employee.last_name}` : "";
      },
      renderCell: (params) => {
        const employee = params.row.lock?.locked_by;
        if (!employee) {
          return null;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              height: "70%",
              pt: 4,
            }}
          >
            <Typography variant="body2">
              {employee.first_name} {employee.last_name}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "for_position",
      headerName: "Position",
      width: 160,
      renderCell: (params) => (
        <Chip
          label={positionLabels[params.value as Position]}
          color={colorMap[params.value as Position] ?? "default"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      renderCell: (params) => {
        const hasPermission =
          isSystemAdmin || userPosition === params.row.for_position;

        return (
          <>
            <IconButton
              color="primary"
              onClick={() => onPreview(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              onClick={() => onEdit(params.row)}
              disabled={!hasPermission || params.row.isLocked}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete(params.row)}
              disabled={!hasPermission}
            >
              <DeleteIcon color={hasPermission ? "error" : "disabled"} />
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
          return hasPermission ? "" : "row-locked";
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
          }}
        >
          <Button
            onClick={() => setPreviewOpen(false)}
            sx={{ alignSelf: "flex-end" }}
          >
            Close
          </Button>

          {selectedDoc && (
            <DocViewer
              documents={[selectedDoc]}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: { disableHeader: false, disableFileName: false },
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
