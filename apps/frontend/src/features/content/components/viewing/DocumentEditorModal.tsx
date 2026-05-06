/**
 * DocumentEditorModal.tsx
 *
 * A full-screen dialog for editing documents using Apryse WebViewer.
 * Displays the document in an editable WebViewer instance alongside a
 * VersionHistoryPanel showing the document's audit trail.
 *
 * Supported editing:
 * - PDF files: full annotation and content editing, saved back to the server.
 * - Non-PDF files (docx, pptx, etc.): displayed via Apryse's internal PDF
 *   conversion. Note: the Apryse demo license does not support saving non-PDF
 *   formats back as their original type — editing should be restricted to PDFs.
 *
 * Save behavior:
 * - Reads the document bytes via getFileData(), wraps them in a Blob with the
 *   correct MIME type derived from the fileName extension, and PUTs to the
 *   backend edit endpoint.
 * - Resets the URI cache after saving so the next open re-fetches fresh content.
 * - Calls onSaved() to trigger a data refresh in the parent (e.g. fetchRows()).
 *
 * Dark mode:
 * - WebViewer theme is synced with the MUI theme on init and on every toggle.
 *
 * Word count & reading time:
 * - Extracted via extractWordCountFromViewer() on the "documentLoaded" event.
 * - Displayed as a ReadingTimeBadge in the modal's top bar, next to the filename.
 * - An optional onWordCount callback exposes the count to the parent.
 */

import { useRef, useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import WebViewer, { type WebViewerInstance } from "@pdftron/webviewer";
import { API_ENDPOINTS } from "../../../../config.ts";
import VersionHistoryPanel from "./VersionHistoryPanel.tsx";
import type { ContentRow } from "../../../../types/content.ts";
import { useTheme } from "@mui/material/styles";
import { markContentListStale } from "../../../../lib/api-loaders.ts";
import {
  extractWordCountFromViewer,
  formatReadingTime,
} from "./ReadingTime.tsx";
import { WEBVIEWER_LICENSE_KEY, WEBVIEWER_PATH } from "./webviewerConfig.ts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when the dialog should close (Close button or backdrop click). */
  onClose: () => void;
  /** Authenticated endpoint URL to fetch the document binary from. */
  uri: string;
  /** UUID of the content record, used for save and history endpoints. */
  uuid: string;
  /** Original file name including extension, used for MIME detection. */
  fileName: string;
  /** Full content row, passed to VersionHistoryPanel for expiration display. */
  contentRow: ContentRow;
  /** If true, disables editing toolbar elements in WebViewer. */
  readOnly?: boolean;
  /** Called after a successful save so the parent can refresh its data. */
  onSaved?: () => void;
  /** Called when the user clicks Delete; parent handles confirmation + API call. */
  onDelete?: () => void;
  /** Called when the user clicks the Edit (open form) button. */
  onOpenForm?: () => void;
  /**
   * Optional callback invoked whenever the word count is resolved.
   * Receives 0 when the document type does not support text extraction.
   */
  onWordCount?: (count: number) => void;
}

// ─── MIME lookup ──────────────────────────────────────────────────────────────

const mimeToExt: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.ms-excel": "xls",
  "application/msword": "doc",
  "image/png": "png",
  "image/jpeg": "jpg",
  "video/mp4": "mp4",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocumentEditorModal({
  open,
  onClose,
  uri,
  fileName,
  uuid,
  contentRow,
  readOnly = false,
  onSaved,
  onDelete,
  onOpenForm,
  onWordCount,
}: Props) {
  // ─── Refs ──────────────────────────────────────────────────────────────────

  const viewerDivRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const pendingLoadRef = useRef<(() => void) | null>(null);
  const hasInitializedRef = useRef(false);
  const currentExtRef = useRef<string>("");
  const isSavingRef = useRef(false);

  /**
   * Tracks the URI of the last successfully loaded document.
   * Prevents redundant re-fetches when the modal reopens for the same file.
   * Reset to "" after save or close so the next open always re-fetches.
   */
  const currentUriRef = useRef<string>("");

  // ─── State ─────────────────────────────────────────────────────────────────

  const theme = useTheme();
  const [viewerReady, setViewerReady] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * Resolved word count for the current document.
   *  null → still computing (badge hidden)
   *  0    → file type not applicable (badge hidden)
   *  N>0  → count resolved, badge shown in top bar
   */
  const [wordCount, setWordCount] = useState<number | null>(null);

  // ─── Effects ───────────────────────────────────────────────────────────────

  /**
   * Initializes the Apryse WebViewer instance once on mount.
   * Also registers a "documentLoaded" listener that triggers word extraction
   * after every new document is loaded into WebViewer.
   */
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (hasInitializedRef.current || !viewerDivRef.current) return;
      hasInitializedRef.current = true;

      WebViewer(
        {
          path: WEBVIEWER_PATH,
          ...(WEBVIEWER_LICENSE_KEY ?
            { licenseKey: WEBVIEWER_LICENSE_KEY }
          : {}),
          disabledElements:
            readOnly ? ["toolsHeader", "ribbons", "toggleNotesButton"] : [],
        },
        viewerDivRef.current,
      ).then((instance) => {
        instanceRef.current = instance;
        setViewerReady(true);

        instance.UI.setTheme(theme.palette.mode === "dark" ? "dark" : "light");
        if (readOnly) instance.UI.setToolMode("Pan");
        window.dispatchEvent(new Event("resize"));

        // Trigger word count extraction each time a new document loads
        instance.Core.documentViewer.addEventListener("documentLoaded", () => {
          setWordCount(null); // reset while counting
          void extractWordCountFromViewer(instance, currentExtRef.current).then(
            (count) => {
              setWordCount(count);
              onWordCount?.(count);
            },
          );
        });

        if (pendingLoadRef.current) {
          pendingLoadRef.current();
          pendingLoadRef.current = null;
        }
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  /**
   * Fetches and loads the document into WebViewer whenever the modal opens
   * or the URI changes. Skips the fetch if the same URI is already loaded.
   */
  useEffect(() => {
    if (!open || !uri) return;
    if (!uri.includes("/content/file/")) return;
    if (uri === currentUriRef.current && instanceRef.current) return;
    currentUriRef.current = uri;

    setWordCount(null); // reset badge on new document

    const abortController = new AbortController();

    const doFetchAndLoad = async () => {
      try {
        const response = await fetch(uri, {
          credentials: "include",
          signal: abortController.signal,
        });
        if (!response.ok)
          throw new Error(`Failed to fetch document: ${response.status}`);

        const blob = await response.blob();
        const extFromMime = mimeToExt[blob.type] ?? undefined;
        const extFromName =
          fileName.includes(".") ? fileName.split(".").pop() : undefined;
        const ext = extFromName ?? extFromMime;
        currentExtRef.current = ext ?? "";
        if (abortController.signal.aborted) return;

        const objectUrl = URL.createObjectURL(blob);

        const doLoad = () => {
          const instance = instanceRef.current;
          if (!instance) return;
          void instance.UI.loadDocument(objectUrl, {
            filename: fileName,
            extension: ext,
          });
          setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
        };

        // The modal can receive a document before Apryse finishes booting.
        // Store one pending load instead of racing the viewer initialization.
        if (instanceRef.current) {
          doLoad();
        } else {
          pendingLoadRef.current = doLoad;
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Failed to load document:", err);
      }
    };

    void doFetchAndLoad();
    return () => abortController.abort();
  }, [open, uri, fileName]);

  /**
   * Syncs the Apryse WebViewer theme with the MUI theme mode.
   */
  useEffect(() => {
    if (!viewerReady || !instanceRef.current) return;
    instanceRef.current.UI.setTheme(
      theme.palette.mode === "dark" ? "dark" : "light",
    );
  }, [theme.palette.mode, viewerReady]);

  // ─── Save handler ─────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (isSavingRef.current) return;
    const instance = instanceRef.current;
    if (!instance) return;

    isSavingRef.current = true;
    setSaving(true);
    try {
      const { annotationManager, documentViewer } = instance.Core;
      const doc = documentViewer.getDocument();

      const extFromName =
        fileName.includes(".") ?
          (fileName.split(".").pop()?.toLowerCase() ?? "pdf")
        : "pdf";

      const extToMime: Record<string, string> = {
        pdf: "application/pdf",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ppt: "application/vnd.ms-powerpoint",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
      };

      const mimeType = extToMime[extFromName] ?? "application/pdf";
      const xfdfString = await annotationManager.exportAnnotations();
      const data = await doc.getFileData({ xfdfString });
      const blob = new Blob([data], { type: mimeType });
      const formData = new FormData();
      formData.append("file", blob, fileName);

      const res = await fetch(API_ENDPOINTS.CONTENT.EDIT(uuid), {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        console.error("Document save failed:", error ?? res.statusText);
        return;
      }

      markContentListStale();
      currentUriRef.current = "";
      onSaved?.();
      onClose();
    } catch (error) {
      console.error("Document save failed:", error);
    } finally {
      isSavingRef.current = false;
      setSaving(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={open}
      onClose={() => {
        currentUriRef.current = "";
        onClose();
      }}
      maxWidth="xl"
      fullWidth
      keepMounted
    >
      <Box sx={{ height: "85vh", display: "flex", flexDirection: "column" }}>
        {/* ── Top bar: file name + reading time badge + actions ── */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, py: 1, gap: 1, flexShrink: 0 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1.5}
            sx={{ minWidth: 0 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ pl: 1, color: "text.secondary" }}
              noWrap
            >
              {fileName}
            </Typography>
            {wordCount !== null && wordCount > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
              >
                Word Count: {wordCount.toLocaleString()} &nbsp;·&nbsp; Estimated
                Reading Length: {formatReadingTime(wordCount)}
              </Typography>
            )}
          </Stack>

          <Stack
            direction="row"
            gap={0.5}
            alignItems="center"
          >
            {onOpenForm && (
              <Tooltip title="Edit metadata">
                <IconButton
                  onClick={onOpenForm}
                  size="small"
                >
                  <EditNoteIcon />
                </IconButton>
              </Tooltip>
            )}

            {onDelete && (
              <Tooltip title="Delete">
                <IconButton
                  onClick={onDelete}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            {!readOnly && (
              <Tooltip title={saving ? "Saving..." : "Save"}>
                <span>
                  <IconButton
                    onClick={() => void handleSave()}
                    size="small"
                    color="primary"
                    disabled={saving}
                  >
                    {saving ?
                      <CircularProgress
                        size={20}
                        color="primary"
                      />
                    : <SaveIcon />}
                  </IconButton>
                </span>
              </Tooltip>
            )}

            <Tooltip title="Close">
              <IconButton
                onClick={onClose}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* ── Body: WebViewer + Version History side by side ── */}
        <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
          <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
            <Box
              ref={viewerDivRef}
              sx={{
                "position": "absolute",
                "inset": 0,
                "& iframe": {
                  width: "100% !important",
                  height: "100% !important",
                },
              }}
            />
          </Box>

          <VersionHistoryPanel
            contentUuid={uuid}
            contentRow={contentRow}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
