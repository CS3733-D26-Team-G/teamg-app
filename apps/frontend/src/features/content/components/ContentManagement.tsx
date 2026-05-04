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
  Divider,
  Tooltip,
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slide,
  Switch,
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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TableRowsIcon from "@mui/icons-material/TableRows";
import mime from "mime-types";
import DocumentEditorModal from "./viewing/DocumentEditorModal.tsx";
import HelpPopup from "../../../components/HelpPopup";
import DocPreviewer from "./viewing/DocPreviewer.tsx";
import InfoPopup from "./ContentInfoPopup.tsx";
import TagManagerPopup from "./TagManagerPopup.tsx";
import VersionHistoryPanel from "./viewing/VersionHistoryPanel.tsx";
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
import { ContentTabs, SPECIAL_TABS } from "./viewing/ContentTabs.tsx";
import { recordRecentlyViewed } from "./viewing/RecentlyViewed.tsx";

// human-readable labels for each content status
const statusLabels: Record<ContentStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In-Use",
  UNAVAILABLE: "Unavailable",
};

// maps each status to a MUI chip color
const statusColorMap: Record<ContentStatus, "success" | "warning" | "error"> = {
  AVAILABLE: "success",
  IN_USE: "warning",
  UNAVAILABLE: "error",
};

// display config for each position — drives accordion headers and filter checkboxes
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

// maps MIME types to short file extension labels shown in the UI
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
  viewState: ContentRow | "new" | null; // the row being edited, "new" when creating, null when closed
  setViewState: React.Dispatch<React.SetStateAction<ContentRow | "new" | null>>;
}

// toolbar extended to two rows with extra vertical padding
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  minHeight: 128,
}));

// slides the content form dialog up from the bottom instead of fading in
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

  // create a unique session ID for this tab if one doesn't exist yet
  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, crypto.randomUUID());
  }
  const sessionId = sessionStorage.getItem(SESSION_KEY)!;

  const fullInitialKey = `${INITIAL_IDS_KEY}_${sessionId}`;
  const fullNewKey = `${KEY}_${sessionId}`;

  // first visit this session — snapshot current IDs as the baseline and return empty
  if (!localStorage.getItem(fullInitialKey)) {
    const initialIds = rows.map((r) => r.uuid);
    localStorage.setItem(fullInitialKey, JSON.stringify(initialIds));
    return new Set();
  }

  const initialIds = new Set(
    JSON.parse(localStorage.getItem(fullInitialKey)!) as string[],
  );

  // find rows that weren't in the original snapshot
  const newIds = rows
    .filter((row) => !initialIds.has(row.uuid))
    .map((row) => row.uuid);

  // merge with previously stored new IDs so highlights survive re-renders
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

  // active filter selections
  const [positionFilters, setPositionFilters] = useState<string[]>([]);
  const [fileTypeFilters, setFileTypeFilters] = useState<string[]>([]);
  const [tagFilters, setTagFilters] = useState<ContentTagSummary[]>([]);

  // skip releasing the lock when the user navigates from the editor to the form
  const skipLockReleaseRef = useRef(false);
  // true when the form was opened from the editor so we reopen it on close
  const returningToEditorRef = useRef(false);

  const contentListQuery = useContentListQuery();
  const contentTagsQuery = useContentTagsQuery();

  // resolves a MIME type to its short display label e.g. ".PDF"
  const displayFileType = (fileType: string) =>
    fileTypeLabels[fileType] ?? fileType;

  // anchor elements for each popover
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
  >({}); // tracks in-flight favorite requests
  const { session } = useAuth();

  // controls the read-only doc previewer dialog
  const [previewOpen, setPreviewOpen] = useState(false);
  // controls the full editor modal (requires checkout)
  const [editorOpen, setEditorOpen] = useState(false);
  // document currently open in the previewer or editor
  const [selectedDoc, setSelectedDoc] = useState<{
    uri: string;
    fileName: string;
    uuid: string;
    forPosition: Position;
  } | null>(null);

  const [pendingDelete, setPendingDelete] = useState<ContentRow | null>(null); // row staged for the delete confirmation dialog
  const [pendingSave, setPendingSave] = useState<FormData | null>(null); // payload staged for the save confirmation dialog
  const [sessionNewIds, setSessionNewIds] = useState<Set<string>>(new Set()); // UUIDs added this session, used for "new" row highlighting
  const [showAllCheckedOut, setShowAllCheckedOut] = useState(true); // controls admins viewing of their own checked-out file or all checked-out files

  const availableTags = contentTagsQuery.data ?? [];

  const userPosition = session?.position ?? null;
  const isSystemAdmin = session?.permissions.can_manage_all_content ?? false;

  // Form modal open state — derived from viewState
  const formOpen = viewState !== null;

  // if the page loads with ?filter=, pre-fill the search box and auto-open the matching doc
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setSearchQuery(filterParam);

      // Auto-open the matched content row
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
    } else {
      setSearchQuery("");
    }
  }, [searchParams, rows]);

  // keep local row state in sync with the remote query
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

  // warm the activity feed cache on mount
  useEffect(() => {
    void prefetchActivity("content");
  }, []);

  // recompute which rows are "new" whenever the row list changes
  useEffect(() => {
    if (rows.length > 0 && session?.employeeUuid) {
      setSessionNewIds(getSessionNewIds(rows, session.employeeUuid));
    }
  }, [rows, session?.employeeUuid]);

  // default to the current user's position accordion being open
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(
    () =>
      new Set(
        userPosition ? [userPosition]
        : POSITION_CONFIG[0] ? [POSITION_CONFIG[0].key]
        : [],
      ),
  );

  // toggles a single accordion open or closed
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

  // puts the current user's position first so their content is immediately visible
  const orderedPositions = useMemo(() => {
    if (!userPosition) return POSITION_CONFIG;
    return [
      ...POSITION_CONFIG.filter((p) => p.key === userPosition),
      ...POSITION_CONFIG.filter((p) => p.key !== userPosition),
    ];
  }, [userPosition]);

  // applies text search + position / file-type / tag filters to the full row list
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

  // adds or removes a position from the active filters
  const togglePosition = (position: string) => {
    setPositionFilters((cur) =>
      cur.includes(position) ?
        cur.filter((pos) => pos !== position)
      : cur.concat(position),
    );
  };

  // adds or removes a file type from the active filters
  const toggleFileType = (fileType: string) => {
    setFileTypeFilters((cur) =>
      cur.includes(fileType) ?
        cur.filter((type) => type !== fileType)
      : cur.concat(fileType),
    );
  };

  // adds or removes a tag from the active filters
  const toggleTag = (tag: ContentTagSummary) => {
    setTagFilters((cur) =>
      cur.some((t) => t.uuid === tag.uuid) ?
        cur.filter((t) => t.uuid !== tag.uuid)
      : cur.concat(tag),
    );
  };

  // stages a row for deletion and opens the confirmation dialog
  const handleDelete = (row: ContentRow) => {
    setPendingDelete(row);
  };

  // patches a single row inside the dashboard bootstrap cache
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

  // removes a row from the dashboard bootstrap cache after deletion
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

  // marks activity caches stale after any mutation; pass true to also invalidate stats
  const markRelatedActivityStale = useCallback((includeStats = false) => {
    markActivityStale("content");
    markActivityStale("all");
    markDashboardBootstrapStale();
    if (includeStats) {
      markDashboardStatsStale();
    }
  }, []);

  // sends the delete request then removes the row from both caches
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
        // close the form if the deleted row was currently open
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

  // acquires the edit lock; 409 means someone else has it, other errors show a warning
  const handleCheckout = async (row: ContentRow) => {
    setLockMessage(null);

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.LOCK(row.uuid), {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 409) {
        // another user holds the lock — update local state to reflect that
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

      // optimistically mark the row as locked by the current user in both caches
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

      if (session?.employeeUuid) {
        recordRecentlyViewed(session.employeeUuid, row.uuid);
      }

      markRelatedActivityStale();
    } catch (error) {
      console.error(error);
      setLockMessage("Unable to checkout content for editing.");
    }
  };

  // sets the active document and opens the editor modal
  const handleOpenEditor = (row: ContentRow) => {
    setSelectedDoc({
      uri: API_ENDPOINTS.CONTENT.FILE(row.uuid),
      fileName: row.title,
      uuid: row.uuid,
      forPosition: row.forPosition,
    });
    setEditorOpen(true);
  };

  // releases the edit lock and clears lock fields in both caches
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

  // stages the form payload and opens the save confirmation dialog
  const handleSave = (payload: FormData) => {
    setPendingSave(payload);
  };

  // sends the create or update request for the staged payload
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
          // keep the lock if the user is returning to the editor after editing metadata
          if (!returningToEditorRef.current) {
            await releaseLock(uuid);
          }
        } else {
          // highlight the newly created row for the rest of this session
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

  // closes the form; reopens the editor if the form was opened from within it
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

  // flips the favorite state optimistically then confirms with the API
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
        // unexpected response shape — fall back to a full refresh
        console.error(parsed.error);
        markContentListStale();
        await contentListQuery.refresh();
        return;
      }

      // update both caches with the confirmed favorite state and new count
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

  // fetches the file as a blob and triggers a browser download
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
      window.URL.revokeObjectURL(blobUrl); // free memory after clicking
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  // opens the top-level filter popover
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  // closes the top-level filter popover
  const handleClose = () => {
    setAnchorElement(null);
  };

  // Tab System for Content Manager
  const {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    specialTabRows,
    activeRows,
    isSpecialTab,
  } = ContentTabs({
    filteredRows,
    employeeUuid: session?.employeeUuid,
    userPosition,
    isSystemAdmin,
  });

  // control display of checked-out tab for admins
  const displayRows = useMemo(() => {
    if (isSystemAdmin && activeTab === "checked-out" && !showAllCheckedOut) {
      return activeRows.filter(
        (r) => r.editLock?.lockedByEmp?.uuid === session?.employeeUuid,
      );
    }
    return activeRows;
  }, [
    activeRows,
    activeTab,
    isSpecialTab,
    isSystemAdmin,
    showAllCheckedOut,
    session,
  ]);

  // save and delete confirmation dialogs
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

  // fires a view event for analytics; failures are non-critical
  const recordContentView = async (uuid: string) => {
    // record locally immediately so the recent tab updates without waiting for the API
    if (session?.employeeUuid) {
      recordRecentlyViewed(session.employeeUuid, uuid);
    }
    try {
      await fetch(API_ENDPOINTS.CONTENT.VIEW(uuid), {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to record content view:", error);
    }
  };

  // builds the DataGrid column definitions; callbacks are passed in to avoid stale closures
  const getColumns = (
    onPreview: (row: ContentRow) => void,
    onDownload: (row: ContentRow) => void,
    onCheckOut: (row: ContentRow) => void,
    onOpenEditor: (row: ContentRow) => void,
    onCheckIn: (uuid: string) => void,
  ): GridColDef<ContentRow>[] => [
    {
      // hidden numeric field used only for default sort (favorites first)
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
            createdAt={params.row.createdAt}
            expirationTime={params.row.expirationTime}
          />
        </Box>
      ),
    },
    {
      // shows a "NEW" badge for rows added after the session started
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
      // derived from the editLock relation; empty when not checked out
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
      // derives the extension from the MIME type via mime-types
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
      // shows different controls depending on who (if anyone) holds the lock
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
            {/* always visible */}
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

            {/* only shown when the doc is not locked */}
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

            {/* only shown when the current user holds the lock */}
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

            {/* releases the lock; only shown when current user holds it */}
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

            {/* shown when a different user holds the lock */}
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

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
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
            className="content-header"
            sx={{
              px: 4,
              pt: 5,

              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                mb: 2,
                mt: -1,
                borderRadius: 4,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderBottom: "2px solid rgba(255, 255, 255, 0.4)",
                px: 3,
              }}
            >
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                width="100%"
              >
                <Box>
                  <Typography
                    variant="h2"
                    sx={{ color: "white", mb: 0.5 }}
                  >
                    Content Management
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.95rem",
                    }}
                  >
                    Create, edit, and organize your digital assets and site
                    content in one collaborative workspace.
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
                    description="The Content page displays all documents and resources available for your role. You can search, filter, download, and open items directly."
                    infoOrHelp={true}
                  />
                </Box>
              </Stack>
            </Box>
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
                pointerEvents: "none",
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
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                className="content-search-bar"
                sx={{ flexGrow: 1, maxWidth: "70%" }}
              >
                <HeaderSearchBar
                  searchQuery={searchQuery}
                  onSearch={handleSearch}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  className="content-filter-button"
                  onClick={handleFilterClick}
                  aria-controls={anchorElement ? "filter-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorElement ? "true" : undefined}
                  variant="contained"
                  startIcon={<FilterAltIcon />}
                >
                  Filter
                </Button>

                {/* only shown when at least one filter is active */}
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

              {/* main filter popover — each item opens a sub-popover */}
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

              {/* position filter sub-popover */}
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

              {/* file type filter sub-popover */}
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

              {/* tags filter sub-popover — dynamically built from available tags */}
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

            {/* tag manager is admin-only */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Tooltip
                title={
                  viewMode === "tabs" ?
                    "Switch to Accordion view"
                  : "Switch to Tabs view"
                }
              >
                <IconButton
                  onClick={() =>
                    setViewMode((m) => (m === "tabs" ? "accordion" : "tabs"))
                  }
                  size="small"
                  sx={{
                    "color": "rgba(255,255,255,0.85)",
                    "backgroundColor": "rgba(255,255,255,0.12)",
                    "borderRadius": "8px",
                    "border": "1px solid rgba(255,255,255,0.2)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.22)",
                      color: "white",
                    },
                  }}
                >
                  {viewMode === "accordion" ?
                    <ViewModuleIcon fontSize="small" />
                  : <TableRowsIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
              {isSystemAdmin && (
                <TagManagerPopup
                  availableTags={availableTags}
                  onTagsChanged={async () => {
                    markContentListStale();
                    await contentListQuery.refresh();
                    return (await contentTagsQuery.refresh()) ?? [];
                  }}
                />
              )}
              <Button
                className="content-upload-button"
                onClick={() => setViewState("new")}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ whiteSpace: "nowrap" }}
              >
                New Content
              </Button>
            </Box>
          </Box>

          {/* active filter chips shown below the toolbar */}
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

      {/* ── Content Data Grids (Accordion or Tabs) ────────────────────────────────── */}
      <Box
        className="content-table"
        sx={{ width: "95%", mx: "auto" }}
      >
        {/* ── TABS VIEW ─────────────────────────────────────────────────────── */}
        {viewMode === "tabs" && (
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "8px",
              height: "calc(100vh - 200px)",
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #1A1E4B 0%, #395176 100%)",
                px: 1,
                pt: 1,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_e, val: string) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons="auto"
                TabIndicatorProps={{
                  style: {
                    backgroundColor: "white",
                    height: 3,
                    borderRadius: "2px 2px 0 0",
                  },
                }}
                sx={{
                  "minHeight": 44,
                  "& .MuiTab-root": {
                    "color": "rgba(255,255,255,0.6)",
                    "fontWeight": 600,
                    "fontSize": "0.85rem",
                    "minHeight": 44,
                    "textTransform": "none",
                    "px": 2,
                    "&.Mui-selected": { color: "white" },
                  },
                }}
              >
                {SPECIAL_TABS.map(({ key, label }) => (
                  <Tab
                    key={key}
                    value={key}
                    label={
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={0.75}
                      >
                        <span>{label}</span>
                        <Chip
                          label={specialTabRows[key].length}
                          size="small"
                          sx={{
                            "height": 18,
                            "fontSize": "0.7rem",
                            "fontWeight": 700,
                            "backgroundColor": "rgba(255,255,255,0.2)",
                            "color": "white",
                            "& .MuiChip-label": { px: 0.75 },
                          }}
                        />
                      </Stack>
                    }
                  />
                ))}

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.2)" }}
                />

                {orderedPositions.map(({ key, label }) => {
                  const count = filteredRows.filter(
                    (r: ContentRow) => r.forPosition === key,
                  ).length;
                  const favs = filteredRows.filter(
                    (r: ContentRow) => r.forPosition === key && r.is_favorite,
                  ).length;
                  return (
                    <Tab
                      key={key}
                      value={key}
                      label={
                        <Stack
                          direction="row"
                          alignItems="center"
                          gap={0.75}
                        >
                          <span>{label}</span>
                          <Chip
                            label={count}
                            size="small"
                            sx={{
                              "height": 18,
                              "fontSize": "0.7rem",
                              "fontWeight": 700,
                              "backgroundColor": "rgba(255,255,255,0.2)",
                              "color": "white",
                              "& .MuiChip-label": { px: 0.75 },
                            }}
                          />
                          {favs > 0 && (
                            <Heart
                              size={11}
                              fill="#e50000"
                              color="#e50000"
                            />
                          )}
                        </Stack>
                      }
                    />
                  );
                })}
              </Tabs>
            </Box>

            <Box>
              {isSystemAdmin &&
                isSpecialTab(activeTab) &&
                activeTab === "checked-out" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 0.75,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "action.hover",
                    }}
                  >
                    <Switch
                      size="small"
                      checked={showAllCheckedOut}
                      onChange={(e) => setShowAllCheckedOut(e.target.checked)}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {showAllCheckedOut ?
                        "Showing all checked-out items"
                      : "Showing only my checked-out items"}
                    </Typography>
                  </Box>
                )}
              {displayRows.length === 0 ?
                <Typography
                  sx={{
                    p: 3,
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "0.875rem",
                    textAlign: "center",
                  }}
                >
                  No content
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
                  rows={displayRows}
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
                      isSystemAdmin || userPosition === params.row.forPosition;
                    const isNew = sessionNewIds.has(params.row.uuid);
                    const classes: string[] = [];
                    if (!hasPermission) classes.push("row-locked");
                    if (isNew) classes.push("row-new");
                    return classes.join(" ");
                  }}
                  autoHeight
                  hideFooterPagination={activeRows.length <= 10}
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
                        "forPosition": false,
                        "fileType": false,
                      },
                    },
                  }}
                  sx={{
                    "borderRadius": 0,
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
            </Box>
          </Box>
        )}

        {/* ── ACCORDION VIEW ────────────────────────────────────────────────── */}
        {viewMode === "accordion" &&
          orderedPositions.map(({ key, label, chipSx }) => {
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
                    {/* only shown when at least one row is favorited */}
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
                          border: "none",
                        }}
                      />
                    )}
                  </Stack>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  {positionRows.length === 0 ?
                    // empty state — mentions active filters if any are set
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

                          // external URLs open in a new tab instead of the previewer
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
                        if (!hasPermission) classes.push("row-locked"); // dims rows the user can't interact with
                        if (isNew) classes.push("row-new"); // highlights rows added this session
                        return classes.join(" ");
                      }}
                      autoHeight
                      hideFooterPagination={positionRows.length <= 10}
                      pageSizeOptions={[10, 25]}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        sorting: {
                          sortModel: [{ field: "favorite", sort: "desc" }], // favorites on top by default
                        },
                        columns: {
                          columnVisibilityModel: {
                            "favorite": false,
                            "url": false,
                            "contentOwner": false,
                            "edited-by": false,
                            "forPosition": false, // redundant inside its own position section
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

      {/* content form modal — used for both creating and editing */}
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
              // delete only available when editing an existing row
              viewState !== null && viewState !== "new" ?
                () => handleDelete(viewState)
              : undefined
            }
          />
        </DialogContent>
      </Dialog>

      {/* read-only document previewer */}
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
          {/* doc viewer and version history panel shown side by side */}
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

      {/* full editor modal — conditionally rendered so WebViewer unmounts fully on close */}
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
              // opens the metadata form while keeping the lock alive
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
