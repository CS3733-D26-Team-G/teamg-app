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
 */

import { useRef, useEffect, useState } from "react";
import {
  Dialog,
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import WebViewer, { type WebViewerInstance } from "@pdftron/webviewer";
import { API_ENDPOINTS } from "../../config.ts";
import VersionHistoryPanel from "./VersionHistoryPanel.tsx";
import type { ContentRow } from "../../types/content.ts";
import { useTheme } from "@mui/material/styles";

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
}

// ─── MIME lookup ──────────────────────────────────────────────────────────────

/**
 * Maps MIME type → file extension.
 * Used when resolving the extension from a fetched blob's Content-Type header.
 */
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

/**
 * Modal dialog containing an Apryse WebViewer editor and a VersionHistoryPanel.
 * WebViewer is initialized once on mount and kept alive via keepMounted,
 * so reopening the modal is fast and does not re-initialize the iframe.
 */
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
}: Props) {
  // ─── Refs ──────────────────────────────────────────────────────────────────

  /** DOM node that WebViewer mounts its iframe into. */
  const viewerDivRef = useRef<HTMLDivElement | null>(null);

  /** Holds the WebViewer instance once initialized. */
  const instanceRef = useRef<WebViewerInstance | null>(null);

  /** Stores a load callback to run once WebViewer finishes initializing. */
  const pendingLoadRef = useRef<(() => void) | null>(null);

  /** Guards against double-initialization in React Strict Mode. */
  const hasInitializedRef = useRef(false);

  /**
   * Tracks the URI of the last successfully loaded document.
   * Prevents redundant re-fetches when the modal reopens for the same file.
   * Reset to "" after save or close so the next open always re-fetches.
   */
  const currentUriRef = useRef<string>("");

  // ─── State ─────────────────────────────────────────────────────────────────

  const theme = useTheme();

  /** True once WebViewer's .then() resolves; used to gate theme sync effects. */
  const [viewerReady, setViewerReady] = useState(false);

  // ─── Effects ───────────────────────────────────────────────────────────────

  /**
   * Initializes the Apryse WebViewer instance once on mount.
   * Uses requestAnimationFrame to ensure the DOM node is painted before
   * WebViewer attempts to mount its iframe into it.
   */
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (hasInitializedRef.current || !viewerDivRef.current) return;
      hasInitializedRef.current = true;

      WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey:
            "demo:1776714799946:6325df920300000000de6805a4f71c4346d6e510d1c42048e35ab36d86",
          // Only disable toolbar elements when in read-only mode
          disabledElements:
            readOnly ? ["toolsHeader", "ribbons", "toggleNotesButton"] : [],
        },
        viewerDivRef.current,
      ).then((instance) => {
        instanceRef.current = instance;
        console.log(
          "WebViewer initialized, pending load:",
          !!pendingLoadRef.current,
        );
        setViewerReady(true);

        // Apply current MUI theme immediately on init
        instance.UI.setTheme(theme.palette.mode === "dark" ? "dark" : "light");

        if (readOnly) instance.UI.setToolMode("Pan");
        window.dispatchEvent(new Event("resize"));

        // If a document was requested before WebViewer finished initializing,
        // run the deferred load now
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
   * Uses AbortController to cancel in-flight requests on cleanup.
   */
  useEffect(() => {
    if (!open || !uri) return;
    if (!uri.includes("/content/file/")) return;

    // Skip re-fetch if this URI is already loaded in the viewer
    if (uri === currentUriRef.current && instanceRef.current) return;
    currentUriRef.current = uri;

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

        // Resolve extension: prefer fileName extension, fall back to MIME lookup
        const extFromMime = mimeToExt[blob.type] ?? undefined;
        const extFromName =
          fileName.includes(".") ? fileName.split(".").pop() : undefined;
        const ext = extFromName ?? extFromMime;
        if (abortController.signal.aborted) return;

        const objectUrl = URL.createObjectURL(blob);

        const doLoad = () => {
          const instance = instanceRef.current;
          if (!instance) return;
          void instance.UI.loadDocument(objectUrl, {
            filename: fileName,
            extension: ext,
          });
          // Revoke the blob URL after WebViewer has had time to read it
          setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
        };

        if (instanceRef.current) {
          doLoad();
        } else {
          // WebViewer not ready yet — defer until initialization completes
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
   * Runs whenever the user toggles dark/light mode after WebViewer is ready.
   */
  useEffect(() => {
    if (!viewerReady || !instanceRef.current) return;
    instanceRef.current.UI.setTheme(
      theme.palette.mode === "dark" ? "dark" : "light",
    );
  }, [theme.palette.mode, viewerReady]);

  // ─── Save handler ─────────────────────────────────────────────────────────

  const handleSave = async () => {
    const instance = instanceRef.current;
    if (!instance) return;
    const doc = instance.Core.documentViewer.getDocument();

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

    const data = await doc.getFileData({});
    const blob = new Blob([data], { type: mimeType });
    const formData = new FormData();
    formData.append("file", blob, fileName);

    await fetch(API_ENDPOINTS.CONTENT.EDIT(uuid), {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    // Reset URI cache so the next open re-fetches the updated file
    currentUriRef.current = "";
    onSaved?.();
    onClose();
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={open}
      onClose={() => {
        // Reset URI cache so the next open always re-fetches fresh content
        currentUriRef.current = "";
        onClose();
      }}
      maxWidth="xl"
      fullWidth
      keepMounted // Keep WebViewer alive between opens to avoid re-initialization
    >
      <Box sx={{ height: "85vh", display: "flex", flexDirection: "column" }}>
        {/* ── Top bar: file name + actions ── */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, py: 1, gap: 1, flexShrink: 0 }}
        >
          <Typography
            variant="subtitle2"
            sx={{ pl: 1, color: "text.secondary" }}
            noWrap
          >
            {fileName}
          </Typography>

          <Stack
            direction="row"
            gap={0.5}
            alignItems="center"
          >
            {/* Open content form */}
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

            {/* Delete file */}
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

            {/* Save */}
            {!readOnly && (
              <Tooltip title="Save">
                <IconButton
                  onClick={() => void handleSave()}
                  size="small"
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            )}

            {/* Close */}
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
          {/* WebViewer editor — fills all remaining horizontal space */}
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

          {/* Version history sidebar — fixed 220px width, scrollable */}
          <VersionHistoryPanel
            contentUuid={uuid}
            contentRow={contentRow}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
