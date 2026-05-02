import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  IconButton,
  Box,
  Button,
  AppBar,
  Toolbar,
  styled,
  Stack,
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
  Slide,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import { useTheme } from "@mui/material/styles";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import CloseIcon from "@mui/icons-material/Close";
import type { ContentStatus, Position } from "@repo/db";
import { Heart } from "lucide-react";
import ContentForm from "./ContentForm";
import HeaderSearchBar from "./HeaderSearchBar";
import { API_ENDPOINTS } from "../../../config";
import { useAuth } from "../../../auth/AuthContext";
import "./ContentManagement.css";
import {
  ContentFavoriteResponseSchema,
  ContentRowsSchema,
  type ContentRow,
  type ContentTagSummary,
} from "../../../types/content";
import { useSearchParams } from "react-router-dom";
import {
  getPositionChipColor,
  getPositionLabel,
} from "../../../utils/positionDisplay";
import MenuItem from "@mui/material/MenuItem";
import mime from "mime-types";
import DocumentEditorModal from "./DocumentEditorModal.tsx";
import HelpPopup from "../../../components/HelpPopup";
import DocPreviewer from "./DocPreviewer.tsx";
import InfoPopup from "./ContentInfoPopup.tsx";
import TagManagerPopup from "./TagManagerPopup.tsx";
import VersionHistoryPanel from "./VersionHistoryPanel.tsx";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  markContentListStale,
  patchContentRow,
  removeContentRow,
  useContentListQuery,
  useContentTagsQuery,
} from "../../../lib/api-loaders";
import {
  markActivityStale,
  markDashboardBootstrapStale,
  markDashboardStatsStale,
  patchDashboardBootstrap,
  prefetchActivity,
} from "../../../lib/activity-loaders";

const statusLabels: Record<ContentStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In-Use",
  UNAVAILABLE: "Unavailable",
};

const statusColorMap: Record<ContentStatus, "success" | "warning" | "error"> = {
  AVAILABLE: "success",
  IN_USE: "warning",
  UNAVAILABLE: "error",
};

const POSITION_CONFIG: {
  key: string;
  label: string;
  chipSx: object;
}[] = [
  {
    key: "UNDERWRITER",
    label: "Underwriter",
    chipSx: { backgroundColor: "#1976d2", color: "white" },
  },
  {
    key: "BUSINESS_ANALYST",
    label: "Business Analyst",
    chipSx: { backgroundColor: "#2e7d32", color: "white" },
  },
  {
    key: "ACTUARIAL_ANALYST",
    label: "Actuarial Analyst",
    chipSx: { backgroundColor: "#ed6c02", color: "white" },
  },
  {
    key: "EXL_OPERATIONS",
    label: "EXL Operations",
    chipSx: { backgroundColor: "#7b1fa2", color: "white" },
  },
  {
    key: "BUSINESS_OP_RATING",
    label: "Business Ops Rating",
    chipSx: { backgroundColor: "#0288d1", color: "white" },
  },
  {
    key: "ADMIN",
    label: "Admin",
    chipSx: { backgroundColor: "#d32f2f", color: "white" },
  },
];

const fileTypeLabels: Record<string, string> = {
  "application/pdf": ".PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".DOCX",
  "application/msword": ".DOC",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".XLSX",
  "application/vnd.ms-excel": ".XLS",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    ".PPTX",
  "application/vnd.ms-powerpoint": ".PPT",
  "text/plain": ".TXT",
  "text/csv": ".CSV",
  "image/png": ".PNG",
  "image/jpeg": ".JPEG",
  "application/json": ".JSON",
  "video/mp4": "Video (.MP4)",
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

/* Highlights new content based on what is different from start of session */
function getSessionNewIds(rows: ContentRow[], userUuid: string): Set<string> {
  const KEY = `new_content_ids_${userUuid}`;
  const INITIAL_IDS_KEY = `initial_content_ids_${userUuid}`;
  const SESSION_KEY = `session_id_${userUuid}`;

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
  const [tagFilters, setTagFilters] = useState<ContentTagSummary[]>([]);
  const skipLockReleaseRef = useRef(false);
  const returningToEditorRef = useRef(false);
  const contentListQuery = useContentListQuery();
  const contentTagsQuery = useContentTagsQuery();

  const displayFileType = (fileType: string) =>
    fileTypeLabels[fileType] ?? fileType;

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const [positionAnchor, setPositionAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [fileTypeAnchor, setFileTypeAnchor] = useState<null | HTMLElement>(
    null,
  );
  const [tagAnchor, setTagAnchor] = useState<null | HTMLElement>(null);

  const [searchParams] = useSearchParams();

  const [rows, setRows] = useState<ContentRow[]>(
    () => contentListQuery.data ?? [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRows, setSearchRows] = useState<ContentRow[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const [favoritePending, setFavoritePending] = useState<
    Record<string, boolean>
  >({});
  const { session } = useAuth();

  // Preview dialog (DocPreviewer — read-only viewer)
  const [previewOpen, setPreviewOpen] = useState(false);
  // Editor modal (DocumentEditorModal — full WebViewer, opened after checkout)
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{
    uri: string;
    fileName: string;
    uuid: string;
    forPosition: Position;
  } | null>(null);

  const [pendingDelete, setPendingDelete] = useState<ContentRow | null>(null);
  const [pendingSave, setPendingSave] = useState<FormData | null>(null);
  const [sessionNewIds, setSessionNewIds] = useState<Set<string>>(new Set());
  const availableTags = contentTagsQuery.data ?? [];

  const userPosition = session?.position ?? null;
  const isSystemAdmin = session?.permissions.can_manage_all_content ?? false;

  // Form modal open state — derived from viewState
  const formOpen = viewState !== null;

  useEffect(() => {
    if (contentListQuery.data) {
      setRows(contentListQuery.data);
      return;
    }

    if (contentListQuery.error) {
      console.error(contentListQuery.error);
      setRows([]);
    }
  }, [contentListQuery.data, contentListQuery.error]);

  useEffect(() => {
    void prefetchActivity("content");
  }, []);

  useEffect(() => {
    if (rows.length > 0 && session?.employeeUuid) {
      setSessionNewIds(getSessionNewIds(rows, session.employeeUuid));
    }
  }, [rows, session?.employeeUuid]);

  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(
    () =>
      new Set(
        userPosition ? [userPosition]
        : POSITION_CONFIG[0] ? [POSITION_CONFIG[0].key]
        : [],
      ),
  );

  const fetchSearchResults = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setSearchRows(null);
        setSearchError(null);
        return;
      }

      const params = new URLSearchParams({ q: trimmedQuery });
      positionFilters.forEach((position) =>
        params.append("position", position),
      );
      fileTypeFilters.forEach((fileType) =>
        params.append("fileType", fileType),
      );
      tagFilters.forEach((tag) => params.append("tagUuid", tag.uuid));

      try {
        setSearchError(null);
        const res = await fetch(`${API_ENDPOINTS.CONTENT.SEARCH}?${params}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Search failed: ${res.status}`);
        }

        const data: unknown = await res.json();
        const parsed = ContentRowsSchema.safeParse(data);
        if (!parsed.success) {
          throw parsed.error;
        }

        setSearchRows(
          parsed.data.map((row) => ({
            ...row,
            isLocked: row.editLock != null,
          })),
        );
      } catch (error) {
        console.error(error);
        setSearchRows([]);
        setSearchError("Unable to search content");
      }
    },
    [fileTypeFilters, positionFilters, tagFilters],
  );

  const handleSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);

    if (!trimmedQuery) {
      setSearchRows(null);
      setSearchError(null);
      return;
    }

    setSearchRows([]);
  }, []);

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      handleSearch(filterParam);

      const matched = rows.find(
        (r) => r.title.toLowerCase() === filterParam.toLowerCase(),
      );
      if (matched) {
        setSelectedDoc({
          uri: API_ENDPOINTS.CONTENT.FILE(matched.uuid),
          fileName: matched.title,
          uuid: matched.uuid,
          forPosition: matched.forPosition,
        });
        setPreviewOpen(true);
      }
    }
  }, [handleSearch, rows, searchParams]);

  useEffect(() => {
    if (searchQuery) {
      void fetchSearchResults(searchQuery);
    }
  }, [fetchSearchResults, searchQuery]);

  const toggleAccordion = (key: string) => {
    setExpandedPositions((prev) => {
      const next = new Set(prev);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  const orderedPositions = useMemo(() => {
    if (!userPosition) return POSITION_CONFIG;
    return [
      ...POSITION_CONFIG.filter((p) => p.key === userPosition),
      ...POSITION_CONFIG.filter((p) => p.key !== userPosition),
    ];
  }, [userPosition]);

  const filteredRows = useMemo(
    () =>
      (searchRows ?? rows).filter((row) => {
        if (searchRows) {
          return true;
        }

        if (
          positionFilters.length > 0 &&
          !positionFilters.includes(row.forPosition)
        ) {
          return false;
        }

        if (
          fileTypeFilters.length > 0 &&
          !fileTypeFilters.includes(row.fileType ?? "")
        ) {
          return false;
        }

        if (
          tagFilters.length > 0 &&
          !tagFilters.some((tf) =>
            row.tags?.some((tag) => tag.uuid === tf.uuid),
          )
        ) {
          return false;
        }

        return true;
      }),
    [rows, searchRows, positionFilters, fileTypeFilters, tagFilters],
  );

  const togglePosition = (position: string) => {
    setPositionFilters((cur) =>
      cur.includes(position) ?
        cur.filter((pos) => pos !== position)
      : cur.concat(position),
    );
  };

  const toggleFileType = (fileType: string) => {
    setFileTypeFilters((cur) =>
      cur.includes(fileType) ?
        cur.filter((type) => type !== fileType)
      : cur.concat(fileType),
    );
  };

  const toggleTag = (tag: ContentTagSummary) => {
    setTagFilters((cur) =>
      cur.some((t) => t.uuid === tag.uuid) ?
        cur.filter((t) => t.uuid !== tag.uuid)
      : cur.concat(tag),
    );
  };

  const handleDelete = (row: ContentRow) => {
    setPendingDelete(row);
  };

  const patchBootstrapContentRow = useCallback(
    (uuid: string, updater: (row: ContentRow) => ContentRow) => {
      patchDashboardBootstrap((data) =>
        data ?
          {
            ...data,
            contentList: data.contentList.map((row) =>
              row.uuid === uuid ? updater(row) : row,
            ),
          }
        : data,
      );
    },
    [],
  );

  const removeBootstrapContentRow = useCallback((uuid: string) => {
    patchDashboardBootstrap((data) =>
      data ?
        {
          ...data,
          contentList: data.contentList.filter((row) => row.uuid !== uuid),
        }
      : data,
    );
  }, []);

  const markRelatedActivityStale = useCallback((includeStats = false) => {
    markActivityStale("content");
    markActivityStale("all");
    markDashboardBootstrapStale();
    if (includeStats) {
      markDashboardStatsStale();
    }
  }, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    const rowToDelete = pendingDelete;
    setPendingDelete(null);
    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.DELETE(rowToDelete.uuid), {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        removeContentRow(rowToDelete.uuid);
        removeBootstrapContentRow(rowToDelete.uuid);
        markRelatedActivityStale(true);
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

  const handleCheckout = async (row: ContentRow) => {
    setLockMessage(null);

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.LOCK(row.uuid), {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 409) {
        patchContentRow(row.uuid, (currentRow) => ({
          ...currentRow,
          isLocked: true,
        }));
        patchBootstrapContentRow(row.uuid, (currentRow) => ({
          ...currentRow,
          isLocked: true,
        }));
        return;
      }

      if (!res.ok) {
        setLockMessage("Unable to checkout content");
        return;
      }

      patchContentRow(row.uuid, (currentRow) => ({
        ...currentRow,
        isLocked: true,
        editLock: {
          lockedByEmp: {
            uuid: session?.employeeUuid ?? "",
            firstName: "",
            lastName: "",
            avatar: null,
          },
        },
      }));
      patchBootstrapContentRow(row.uuid, (currentRow) => ({
        ...currentRow,
        isLocked: true,
        editLock: {
          lockedByEmp: {
            uuid: session?.employeeUuid ?? "",
            firstName: "",
            lastName: "",
            avatar: null,
          },
        },
      }));
      markRelatedActivityStale();
    } catch (error) {
      console.error(error);
      setLockMessage("Unable to checkout content for editing.");
    }
  };

  const handleOpenEditor = (row: ContentRow) => {
    setSelectedDoc({
      uri: API_ENDPOINTS.CONTENT.FILE(row.uuid),
      fileName: row.title,
      uuid: row.uuid,
      forPosition: row.forPosition,
    });
    setEditorOpen(true);
  };

  const releaseLock = async (uuid: string) => {
    try {
      await fetch(API_ENDPOINTS.CONTENT.LOCK(uuid), {
        method: "DELETE",
        credentials: "include",
      });

      patchContentRow(uuid, (row) => ({
        ...row,
        isLocked: false,
        editLock: null,
      }));
      patchBootstrapContentRow(uuid, (row) => ({
        ...row,
        isLocked: false,
        editLock: null,
      }));
      markRelatedActivityStale();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = (payload: FormData) => {
    setPendingSave(payload);
  };

  const confirmSave = async () => {
    if (!pendingSave) return;

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
          if (!returningToEditorRef.current) {
            await releaseLock(uuid);
          }
        } else {
          // Only new content gets highlighted
          const data = (await res.json()) as { uuid: string };
          setSessionNewIds((prev) => new Set([...prev, data.uuid]));
        }
        markContentListStale();
        markRelatedActivityStale(true);
        await contentListQuery.refresh();
        setViewState(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseFormModal = async () => {
    if (returningToEditorRef.current) {
      returningToEditorRef.current = false;
      setViewState(null);
      setEditorOpen(true); // reopen editor without re-fetching
      return;
    }
    if (viewState !== null && viewState !== "new") {
      await releaseLock(viewState.uuid);
    }
    setViewState(null);
  };

  const toggleFavorite = async (row: ContentRow) => {
    const nextIsFavorite = !row.is_favorite;

    setFavoritePending((prev) => ({ ...prev, [row.uuid]: true }));

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.FAVORITE(row.uuid), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_favorite: nextIsFavorite }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: unknown = await res.json();
      const parsed = ContentFavoriteResponseSchema.safeParse(data);

      if (!parsed.success) {
        console.error(parsed.error);
        markContentListStale();
        await contentListQuery.refresh();
        return;
      }

      patchContentRow(parsed.data.contentUuid, (row) => ({
        ...row,
        is_favorite: parsed.data.is_favorite,
        favorite_count: Math.max(
          0,
          row.favorite_count + (parsed.data.is_favorite ? 1 : -1),
        ),
      }));
      patchBootstrapContentRow(parsed.data.contentUuid, (row) => ({
        ...row,
        is_favorite: parsed.data.is_favorite,
        favorite_count: Math.max(
          0,
          row.favorite_count + (parsed.data.is_favorite ? 1 : -1),
        ),
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setFavoritePending((prev) => ({ ...prev, [row.uuid]: false }));
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

  // ── Confirmation dialogs ───────────────────────────────────────────────────
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

  const recordContentView = async (uuid: string) => {
    try {
      await fetch(API_ENDPOINTS.CONTENT.VIEW(uuid), {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to record content view:", error);
    }
  };

  // ── Column definitions ─────────────────────────────────────────────────────
  const getColumns = (
    onPreview: (row: ContentRow) => void,
    onDownload: (row: ContentRow) => void,
    onCheckOut: (row: ContentRow) => void,
    onOpenEditor: (row: ContentRow) => void,
    onCheckIn: (uuid: string) => void,
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
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
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
            author={params.row.contentOwner}
            position={getPositionLabel(params.row.forPosition) as Position}
            fileType={params.row.fileType}
            tags={params.row.tags ?? []}
            editor={
              params.row.editLock?.lockedByEmp ?
                `${params.row.editLock.lockedByEmp.firstName} 
              ${params.row.editLock.lockedByEmp.lastName}`
              : ""
            }
            editorAvatar={params.row.editLock?.lockedByEmp?.avatar}
          />
        </Box>
      ),
    },
    {
      field: "lastModifiedTime",
      headerName: "Last Modified",
      type: "dateTime",
      width: 160,
      valueGetter: (_value, row) =>
        row.lastModifiedTime ? new Date(row.lastModifiedTime) : null,
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
      field: "contentOwner",
      headerName: "Author",
      width: 140,
    },
    {
      field: "edited-by",
      headerName: "Editor",
      width: 140,
      valueGetter: (_, row) => {
        const employee = row.editLock?.lockedByEmp;
        return employee ? `${employee.firstName} ${employee.lastName}` : "";
      },
    },
    {
      field: "forPosition",
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
      width: 160,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={statusLabels[params.value as ContentStatus]}
          color={statusColorMap[params.value as ContentStatus]}
          size="medium"
          variant="filled"
          sx={{ width: 100, borderColor: "black", borderRadius: 1 }}
        />
      ),
    },
    {
      field: "fileType",
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
        const row = params.row;
        const hasPermission = isSystemAdmin || userPosition === row.forPosition;
        const lockedByUuid = row.editLock?.lockedByEmp?.uuid;
        const isCheckedOutByMe =
          row.isLocked && lockedByUuid === session?.employeeUuid;
        const isCheckedOutByOther = row.isLocked && !isCheckedOutByMe;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* Preview */}
            <Tooltip title="Preview">
              <IconButton
                color="primary"
                onClick={() => onPreview(row)}
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            {/* Download */}
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
                  onClick={() => void onDownload(row)}
                  disabled={!hasPermission}
                >
                  <DownloadIcon />
                </IconButton>
              </span>
            </Tooltip>

            {/* Check Out — only when not locked */}
            {!row.isLocked && (
              <Tooltip
                title={
                  !hasPermission ?
                    "You don't have permission"
                  : "Check Out to edit"
                }
              >
                <span>
                  <Button
                    size="small"
                    onClick={() => onCheckOut(row)}
                    disabled={!hasPermission}
                    sx={{ border: "0.5px solid" }}
                  >
                    CHECK OUT
                  </Button>
                </span>
              </Tooltip>
            )}

            {/* Edit — only when checked out by current user */}
            {isCheckedOutByMe && (
              <Tooltip
                title={
                  row.fileType?.startsWith("video/") ?
                    "Video files cannot be edited"
                  : "Open editor"
                }
              >
                <span>
                  <IconButton
                    color="primary"
                    onClick={() => onOpenEditor(row)}
                    disabled={row.fileType?.startsWith("video/")}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}

            {/* Check In — release lock, only when checked out by current user */}
            {isCheckedOutByMe && (
              <Tooltip title="Check In (release lock)">
                <IconButton
                  color="primary"
                  onClick={() => void onCheckIn(row.uuid)}
                >
                  <LockOpenIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* Locked by someone else */}
            {isCheckedOutByOther && (
              <Tooltip
                title={`Checked out by ${row.editLock?.lockedByEmp.firstName} ${row.editLock?.lockedByEmp.lastName}`}
              >
                <span>
                  <Button
                    size="small"
                    disabled
                    sx={{ border: "0.5px solid" }}
                  >
                    LOCKED
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      {/* ── Toolbar / header ────────────────────────────────────────────── */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "background.paper", boxShadow: "none" }}
      >
        <StyledToolbar
          sx={{
            background:
              "linear-gradient(135deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h2"
            sx={{ pb: 2, pt: 4, color: "White", fontWeight: "bold" }}
          >
            Content Management
          </Typography>
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
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box sx={{ flexGrow: 1, maxWidth: "70%" }}>
                <HeaderSearchBar
                  searchQuery={searchQuery}
                  onSearch={handleSearch}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Filter button */}
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

                {(positionFilters.length > 0 ||
                  fileTypeFilters.length > 0 ||
                  tagFilters.length > 0) && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setPositionFilters([]);
                      setFileTypeFilters([]);
                      setTagFilters([]);
                    }}
                    sx={{
                      color: "white",
                      borderRadius: 2,
                      border: "1px solid white",
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>

              {/* Filter pop-up */}
              <Popover
                open={Boolean(anchorElement)}
                anchorEl={anchorElement}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: { border: "1px solid", borderColor: "gray" },
                  },
                }}
              >
                <MenuItem
                  onClick={(event) => {
                    setPositionAnchor(event.currentTarget);
                    setFileTypeAnchor(null);
                    setTagAnchor(null);
                  }}
                >
                  Position
                  <ArrowRightIcon sx={{ ml: "auto" }} />
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    setFileTypeAnchor(event.currentTarget);
                    setPositionAnchor(null);
                    setTagAnchor(null);
                  }}
                >
                  File Type
                  <ArrowRightIcon sx={{ ml: "auto" }} />
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    setTagAnchor(event.currentTarget);
                    setPositionAnchor(null);
                    setFileTypeAnchor(null);
                  }}
                >
                  Tags
                  <ArrowRightIcon sx={{ ml: "auto" }} />
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

              {/* File type sub-pop-up */}
              <Popover
                open={Boolean(fileTypeAnchor)}
                anchorEl={fileTypeAnchor}
                onClose={() => setFileTypeAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: { border: "1px solid", borderColor: "gray", ml: 1 },
                  },
                }}
              >
                <FormGroup sx={{ pl: 1 }}>
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

              {/* Tags sub-pop-up */}
              <Popover
                open={Boolean(tagAnchor)}
                anchorEl={tagAnchor}
                onClose={() => setTagAnchor(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                slotProps={{
                  paper: {
                    sx: { border: "1px solid", borderColor: "gray", ml: 1 },
                  },
                }}
              >
                <FormGroup sx={{ pl: 1 }}>
                  {availableTags.length === 0 && (
                    <Typography>No Tags Available</Typography>
                  )}

                  {availableTags.map((tag) => (
                    <FormControlLabel
                      key={tag.uuid}
                      control={
                        <Checkbox
                          onChange={() => toggleTag(tag)}
                          checked={tagFilters.some((t) => t.uuid === tag.uuid)}
                        />
                      }
                      label={tag.name}
                    />
                  ))}
                </FormGroup>
              </Popover>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HelpPopup
                description="The Content page displays all documents and resources available for your role. You can search, filter, download, and open items directly."
                infoOrHelp={true}
              />
              {isSystemAdmin && (
                <TagManagerPopup
                  availableTags={availableTags}
                  onTagsChanged={async () => {
                    return (await contentTagsQuery.refresh()) ?? [];
                  }}
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

          {(positionFilters.length > 0 ||
            fileTypeFilters.length > 0 ||
            tagFilters.length > 0) && (
            <Box sx={{ display: "flex", flexWrap: "wrap", pt: 2, gap: 1 }}>
              {positionFilters.map((position) => (
                <Chip
                  key={position}
                  label={getPositionLabel(position as Position)}
                  onDelete={() => togglePosition(position)}
                  sx={{ bgcolor: "white", color: "black" }}
                />
              ))}
              {fileTypeFilters.map((fileType) => (
                <Chip
                  key={fileType}
                  label={displayFileType(fileType)}
                  onDelete={() => toggleFileType(fileType)}
                  sx={{ bgcolor: "white", color: "black" }}
                />
              ))}
              {tagFilters.map((tag) => (
                <Chip
                  key={tag.uuid}
                  label={tag.name}
                  onDelete={() => toggleTag(tag)}
                  sx={{ bgcolor: "white", color: "black" }}
                />
              ))}
            </Box>
          )}

          {lockMessage && (
            <Typography sx={{ pt: 1, color: "warning.main" }}>
              {lockMessage}
            </Typography>
          )}
          {searchError && (
            <Typography sx={{ pt: 1, color: "warning.main" }}>
              {searchError}
            </Typography>
          )}
        </StyledToolbar>
      </AppBar>

      {/* ── Accordion Data grids ───────────────────────────────────────────────────── */}
      <Box sx={{ width: "100%" }}>
        {orderedPositions.map(({ key, label, chipSx }) => {
          const positionRows = filteredRows.filter(
            (r) => r.forPosition === key,
          );
          const favoriteCount = positionRows.filter(
            (r) => r.is_favorite,
          ).length;
          const isExpanded = expandedPositions.has(key);

          return (
            <Accordion
              key={key}
              expanded={isExpanded}
              onChange={() => toggleAccordion(key)}
              disableGutters
              elevation={0}
              sx={{
                "mb": 1.5,
                "overflow": "hidden",
                "border": "1px solid",
                "borderColor": "divider",
                "&:before": { display: "none" },
                "borderRadius": "8px !important",
                "& .MuiAccordion-root": { borderRadius: "8px !important" },
                "& .MuiPaper-root": { borderRadius: "8px !important" },
                "& .MuiAccordionDetails-root": {
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  overflow: "hidden",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                sx={{
                  background:
                    "linear-gradient(135deg, #1A1E4B 0%, #395176 100%)",
                  minHeight: 52,
                  px: 2,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.5}
                  sx={{ width: "100%" }}
                >
                  <Typography
                    sx={{
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {label}
                  </Typography>
                  <Chip
                    label={`${positionRows.length} file${positionRows.length !== 1 ? "s" : ""}`}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      ...chipSx,
                    }}
                  />
                  {favoriteCount > 0 && (
                    <Chip
                      icon={
                        <Heart
                          size={12}
                          fill="#e50000"
                          color="#e50000"
                        />
                      }
                      label={favoriteCount}
                      size="small"
                      variant="outlined"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        borderColor: "rgba(255,255,255,0.4)",
                        border: "1px solid transparent",
                      }}
                    />
                  )}
                </Stack>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                {positionRows.length === 0 ?
                  <Typography
                    sx={{
                      p: 3,
                      color: "text.secondary",
                      fontSize: "0.875rem",
                      textAlign: "center",
                    }}
                  >
                    No content for this position
                    {(
                      searchQuery ||
                      positionFilters.length ||
                      fileTypeFilters.length
                    ) ?
                      " matching current filters"
                    : ""}
                    .
                  </Typography>
                : <DataGrid
                    rows={positionRows}
                    getRowId={(row) => row.uuid}
                    columns={getColumns(
                      (row) => {
                        void recordContentView(row.uuid);

                        const isExternalUrl =
                          !row.supabasePath &&
                          !row.url.includes("supabase.co/storage");

                        if (isExternalUrl) {
                          window.open(row.url, "_blank");
                          return;
                        }

                        setSelectedDoc({
                          uri: API_ENDPOINTS.CONTENT.FILE(row.uuid),
                          fileName: row.title,
                          uuid: row.uuid,
                          forPosition: row.forPosition,
                        });
                        setPreviewOpen(true);
                      },
                      handleDownload,
                      handleCheckout,
                      handleOpenEditor,
                      releaseLock,
                    )}
                    getRowClassName={(params) => {
                      const hasPermission =
                        isSystemAdmin ||
                        userPosition === params.row.forPosition;
                      const isNew = sessionNewIds.has(params.row.uuid);
                      const classes: string[] = [];
                      if (!hasPermission) classes.push("row-locked");
                      if (isNew) classes.push("row-new");
                      return classes.join(" ");
                    }}
                    autoHeight
                    hideFooterPagination={positionRows.length <= 10}
                    pageSizeOptions={[10, 25]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 10 } },
                      sorting: {
                        sortModel: [{ field: "favorite", sort: "desc" }],
                      },
                      columns: {
                        columnVisibilityModel: {
                          "favorite": false,
                          "url": false,
                          "contentOwner": false,
                          "edited-by": false,
                          "forPosition": false, // redundant inside its own section
                          "fileType": false,
                        },
                      },
                    }}
                    sx={{
                      "borderRadius": "0 0 8px 8px",
                      "overflow": "hidden",
                      "& .row-locked": {
                        backgroundColor:
                          isDark ?
                            "rgba(255,255,255,0.12)"
                          : "rgba(245,245,245,1)",
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
                  />
                }
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* ── Content Form Modal ───────────────────────────────────────────── */}
      <Dialog
        open={formOpen}
        onClose={() => void handleCloseFormModal()}
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
            {viewState === "new" ? "Submit New Content" : "Edit Content"}
          </Typography>
          <IconButton
            onClick={() => void handleCloseFormModal()}
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
          <ContentForm
            initialData={viewState === "new" ? null : viewState}
            availableTags={availableTags}
            onSave={handleSave}
            onCancel={() => void handleCloseFormModal()}
            onDelete={
              viewState !== null && viewState !== "new" ?
                () => handleDelete(viewState)
              : undefined
            }
          />
        </DialogContent>
      </Dialog>

      {/* ── Preview Dialog (DocPreviewer — read-only viewer) ────────────── */}
      <Dialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedDoc(null);
        }}
        maxWidth="xl"
        fullWidth
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
            <Tooltip title="Close">
              <IconButton
                onClick={() => {
                  setPreviewOpen(false);
                  setSelectedDoc(null);
                }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
            {selectedDoc && (
              <DocPreviewer
                key={selectedDoc.uuid}
                uri={selectedDoc.uri}
                fileName={selectedDoc.fileName}
              />
            )}
            {selectedDoc && rows.find((r) => r.uuid === selectedDoc.uuid) && (
              <VersionHistoryPanel
                contentUuid={selectedDoc.uuid}
                contentRow={rows.find((r) => r.uuid === selectedDoc.uuid)!}
              />
            )}
          </Box>
        </Box>
      </Dialog>

      {/* ── Document Editor Modal — opened via Edit button when checked out ── */}
      {editorOpen &&
        selectedDoc &&
        (() => {
          const editorRow = rows.find((r) => r.uuid === selectedDoc.uuid);
          if (!editorRow) return null;
          return (
            <DocumentEditorModal
              open={editorOpen}
              onClose={() => {
                skipLockReleaseRef.current = false;
                setEditorOpen(false);
              }}
              uri={selectedDoc.uri}
              fileName={selectedDoc.fileName}
              uuid={selectedDoc.uuid}
              contentRow={rows.find((r) => r.uuid === selectedDoc.uuid)!}
              onSaved={() => {
                markContentListStale();
                markRelatedActivityStale(true);
              }}
              readOnly={false}
              onDelete={() => editorRow && handleDelete(editorRow)}
              onOpenForm={() => {
                returningToEditorRef.current = true;
                skipLockReleaseRef.current = true;
                setEditorOpen(false);
                setViewState(editorRow);
              }}
            />
          );
        })()}
      {confirmationDialogs}
    </Box>
  );
}
