import { useRef, useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import WebViewer, { type WebViewerInstance } from "@pdftron/webviewer";
import { useTheme } from "@mui/material/styles";
import {
  countWords,
  extractWordCountFromViewer,
  formatReadingTime,
} from "./ReadingTime.tsx";
import { WEBVIEWER_LICENSE_KEY, WEBVIEWER_PATH } from "./webviewerConfig.ts";

/**
 * DocPreviewer.tsx
 *
 * A read-only document preview component powered by Apryse WebViewer.
 * Supports PDFs, Office files (docx, xlsx, pptx), images, plain text
 * formats (json, csv, txt, xml, html), and video (mp4).
 *
 * - Text-based files are rendered directly as <pre> blocks without WebViewer.
 * - Video files are rendered using a native HTML5 <video> element.
 * - All other supported formats are loaded into the Apryse WebViewer iframe.
 * - WebViewer is initialized once on mount and reused across document changes.
 * - Dark mode is synced from the MUI theme via instance.UI.setTheme().
 *
 * Word count & reading time:
 * - For text files: counted directly from the fetched string via countWords().
 * - For WebViewer documents: extracted via extractWordCountFromViewer() on
 *   the "documentLoaded" event.
 * - Video and image files resolve to 0 (badge hidden).
 * - An optional onWordCount callback exposes the count to the parent.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

/** MIME types that should be rendered as plain text rather than in WebViewer. */
const TEXT_TYPES = new Set([
  "application/json",
  "text/plain",
  "text/csv",
  "text/html",
  "text/xml",
  "application/xml",
]);

/** Maps MIME type → file extension, used when the blob has a known type. */
const MIME_TO_EXT: Record<string, string> = {
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

/** Maps file extension → MIME type, used as a fallback when blob.type is empty. */
const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  mp4: "video/mp4",
  json: "application/json",
  txt: "text/plain",
  csv: "text/csv",
  html: "text/html",
  xml: "text/xml",
};

/** Extensions for which word counting is not meaningful. */
const NO_COUNT_EXTS = new Set(["png", "jpg", "jpeg", "gif", "mp4", "mov"]);

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocPreviewerProps {
  /** Authenticated endpoint URL to fetch the document binary from. */
  uri: string;
  /** Original file name including extension, used for MIME detection and WebViewer hints. */
  fileName: string;
  /**
   * Optional callback invoked whenever the word count is resolved.
   * Receives 0 when the document type does not support text extraction.
   */
  onWordCount?: (count: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocPreviewer({
  uri,
  fileName,
  onWordCount,
}: DocPreviewerProps) {
  // ─── Refs ──────────────────────────────────────────────────────────────────

  const viewerDivRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const hasInitializedRef = useRef(false);
  const pendingLoadRef = useRef<(() => void) | null>(null);
  const currentExtRef = useRef<string>("");

  // ─── State ─────────────────────────────────────────────────────────────────

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [wordCount, setWordCount] = useState<number | null>(null);

  // ─── Derived values ────────────────────────────────────────────────────────

  const theme = useTheme();
  const extFromName =
    fileName.includes(".") ?
      fileName.split(".").pop()?.toLowerCase()
    : undefined;

  // ─── Callbacks ─────────────────────────────────────────────────────────────

  const resolveWordCount = useCallback(
    (count: number) => {
      setWordCount(count);
      onWordCount?.(count);
    },
    [onWordCount],
  );

  // ─── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!viewerReady || !instanceRef.current) return;
    instanceRef.current.UI.setTheme(
      theme.palette.mode === "dark" ? "dark" : "light",
    );
  }, [theme.palette.mode, viewerReady]);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

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
          isReadOnly: true,
          disabledElements: [
            "header",
            "toolsHeader",
            "ribbons",
            "toggleNotesButton",
            "menuButton",
            "leftPanelButton",
            "viewControlsButton",
            "panToolButton",
            "selectToolButton",
            "searchButton",
            "annotationCommentButton",
            "annotationStyleEditButton",
          ],
        },
        viewerDivRef.current,
      ).then((instance) => {
        instanceRef.current = instance;
        setViewerReady(true);

        instance.UI.setTheme(theme.palette.mode === "dark" ? "dark" : "light");
        instance.UI.setToolMode("Pan");
        instance.UI.disableFeatures([
          instance.UI.Feature.Ribbons,
          instance.UI.Feature.Annotations,
        ]);
        instance.UI.disableElements([
          "header",
          "toolsHeader",
          "ribbons",
          "toggleNotesButton",
          "menuButton",
          "leftPanelButton",
          "viewControlsButton",
          "searchButton",
          "annotationCommentButton",
          "annotationStyleEditButton",
          "contextMenuPopup",
        ]);
        window.dispatchEvent(new Event("resize"));

        // Trigger word count extraction each time a new document loads
        instance.Core.documentViewer.addEventListener("documentLoaded", () => {
          void extractWordCountFromViewer(instance, currentExtRef.current).then(
            resolveWordCount,
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

  useEffect(() => {
    if (!uri) return;
    const abortController = new AbortController();
    setLoading(true);
    setTextContent(null);
    setMimeType(null);
    setWordCount(null);

    const doFetchAndLoad = async () => {
      try {
        const response = await fetch(uri, {
          credentials: "include",
          signal: abortController.signal,
        });
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

        const blob = await response.blob();
        const type =
          blob.type || (extFromName ? EXT_TO_MIME[extFromName] : "") || "";
        setMimeType(type);

        if (abortController.signal.aborted) return;

        const ext = extFromName ?? MIME_TO_EXT[type] ?? "pdf";
        currentExtRef.current = ext;

        // ── Route 1: Text files ──────────────────────────────────────────────
        if (
          TEXT_TYPES.has(type) ||
          ["json", "csv", "txt", "xml", "html"].includes(ext)
        ) {
          const text = await blob.text();
          setTextContent(text);
          setLoading(false);
          resolveWordCount(countWords(text));
          return;
        }

        // ── Route 2: Video files ─────────────────────────────────────────────
        const isVideo = type.startsWith("video/") || ext === "mp4";
        if (isVideo) {
          const objectUrl = URL.createObjectURL(blob);
          setVideoUrl(objectUrl);
          setLoading(false);
          resolveWordCount(0);
          return;
        }

        // ── Route 3: Images — no text to extract ─────────────────────────────
        if (NO_COUNT_EXTS.has(ext) || type.startsWith("image/")) {
          resolveWordCount(0);
        }
        // PDFs and Office files: word count resolved via "documentLoaded" above

        // ── Route 4: WebViewer (PDF, Office, images) ─────────────────────────
        const objectUrl = URL.createObjectURL(blob);
        const doLoad = () => {
          const instance = instanceRef.current;
          if (!instance) return;
          void instance.UI.loadDocument(objectUrl, {
            filename: fileName,
            extension: ext,
          });
          setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
          setLoading(false);
        };

        // WebViewer initializes asynchronously; queue the load so fast modal
        // opens do not drop the first document.
        if (instanceRef.current) {
          doLoad();
        } else {
          pendingLoadRef.current = doLoad;
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("DocPreviewer: failed to load document:", err);
        setLoading(false);
      }
    };

    void doFetchAndLoad();
    return () => abortController.abort();
  }, [uri, fileName]);

  // ─── Renderers ─────────────────────────────────────────────────────────────

  if (textContent !== null) {
    const isJson = mimeType === "application/json" || extFromName === "json";
    let display = textContent;
    if (isJson) {
      try {
        display = JSON.stringify(JSON.parse(textContent), null, 2);
      } catch {
        // show raw if parse fails
      }
    }
    return (
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "background.default",
          position: "relative",
        }}
      >
        {wordCount !== null && wordCount > 0 && (
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              display: "flex",
              justifyContent: "flex-end",
              px: 1.5,
              py: 0.75,
              backgroundColor: "background.default",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
            >
              Word Count: {wordCount.toLocaleString()} &nbsp;·&nbsp; Estimated
              Reading Length: {formatReadingTime(wordCount)}
            </Typography>
          </Box>
        )}
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            fontFamily: "monospace",
            fontSize: "0.8rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: "text.primary",
          }}
        >
          {display}
        </Box>
      </Box>
    );
  }

  if (videoUrl) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
        }}
      >
        <video
          src={videoUrl}
          controls
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            zIndex: 1,
          }}
        >
          <Typography variant="body2">Loading preview…</Typography>
        </Box>
      )}

      {!loading && wordCount !== null && wordCount > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Word Count: {wordCount.toLocaleString()} &nbsp;·&nbsp; Estimated
            Reading Length: {formatReadingTime(wordCount)}
          </Typography>
        </Box>
      )}

      <Box
        ref={viewerDivRef}
        sx={{
          "position": "absolute",
          "inset": 0,
          "visibility": loading ? "hidden" : "visible",
          "& iframe": {
            width: "100% !important",
            height: "100% !important",
          },
        }}
      />
    </Box>
  );
}
