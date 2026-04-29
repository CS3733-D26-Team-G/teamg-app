import { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import WebViewer, { type WebViewerInstance } from "@pdftron/webviewer";
import { useTheme } from "@mui/material/styles";

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface DocPreviewerProps {
  /** Authenticated endpoint URL to fetch the document binary from. */
  uri: string;
  /** Original file name including extension, used for MIME detection and WebViewer hints. */
  fileName: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Renders a read-only preview of a document fetched from the given URI.
 * Automatically selects the appropriate renderer based on file type:
 * text → <pre>, video → <video>, everything else → Apryse WebViewer.
 */
export default function DocPreviewer({ uri, fileName }: DocPreviewerProps) {
  // ─── Refs ──────────────────────────────────────────────────────────────────\

  /** DOM node that WebViewer mounts its iframe into. */
  const viewerDivRef = useRef<HTMLDivElement | null>(null);

  /** Holds the WebViewer instance once initialized. */
  const instanceRef = useRef<WebViewerInstance | null>(null);

  /** Guards against double-initialization in React Strict Mode. */
  const hasInitializedRef = useRef(false);

  /** Stores a load callback to run once WebViewer finishes initializing. */
  const pendingLoadRef = useRef<(() => void) | null>(null);

  // ─── State ─────────────────────────────────────────────────────────────────

  /** Object URL for video files; triggers the <video> renderer when set. */
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  /** True once WebViewer's .then() resolves; used to gate theme sync effects. */
  const [viewerReady, setViewerReady] = useState(false);

  /** Raw text content for text-based files; triggers the <pre> renderer when set. */
  const [textContent, setTextContent] = useState<string | null>(null);

  /** MIME type of the fetched blob, used for format-specific rendering decisions. */
  const [mimeType, setMimeType] = useState<string | null>(null);

  /** True while the document is being fetched or WebViewer is loading it. */
  const [loading, setLoading] = useState(true);

  // ─── Derived values ────────────────────────────────────────────────────────

  const theme = useTheme();

  /** File extension derived from the fileName prop, lower-cased. */
  const extFromName =
    fileName.includes(".") ?
      fileName.split(".").pop()?.toLowerCase()
    : undefined;

  // ─── Effects ───────────────────────────────────────────────────────────────

  /**
   * Syncs the Apryse WebViewer theme with the MUI theme mode.
   * Runs on initial ready and whenever the user toggles dark/light mode.
   */
  useEffect(() => {
    if (!viewerReady || !instanceRef.current) return;
    instanceRef.current.UI.setTheme(
      theme.palette.mode === "dark" ? "dark" : "light",
    );
  }, [theme.palette.mode, viewerReady]);

  /**
   * Revokes the video object URL when it changes or the component unmounts,
   * preventing memory leaks from stale blob URLs.
   */
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  /**
   * Initializes the Apryse WebViewer instance once on mount.
   * Uses requestAnimationFrame to ensure the DOM node is rendered before
   * WebViewer attempts to mount. The instance is stored in instanceRef
   * and reused for all subsequent document loads.
   *
   * All editing UI elements are disabled since this is a read-only previewer.
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
          isReadOnly: true,
          // Disable all toolbar and annotation UI for read-only preview
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

        // Apply current MUI theme immediately on init
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
   * Fetches the document from the URI and routes it to the correct renderer.
   * Re-runs whenever uri or fileName changes. Uses AbortController to cancel
   * in-flight requests when the component unmounts or props change.
   *
   * Routing logic:
   *   1. Text types  → setTextContent() → <pre> renderer
   *   2. Video types → setVideoUrl()    → <video> renderer
   *   3. Everything else → WebViewer.loadDocument()
   */
  useEffect(() => {
    if (!uri) return;
    const abortController = new AbortController();
    setLoading(true);
    setTextContent(null);
    setMimeType(null);

    const doFetchAndLoad = async () => {
      try {
        const response = await fetch(uri, {
          credentials: "include",
          signal: abortController.signal,
        });
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

        const blob = await response.blob();

        // Resolve MIME type: prefer blob.type, fall back to extension lookup
        const type =
          blob.type || (extFromName ? EXT_TO_MIME[extFromName] : "") || "";
        setMimeType(type);

        if (abortController.signal.aborted) return;

        // Resolve extension: prefer fileName extension, fall back to MIME lookup
        const ext = extFromName ?? MIME_TO_EXT[type] ?? "pdf";

        // ── Route 1: Text files ──────────────────────────────────────────────
        if (
          TEXT_TYPES.has(type) ||
          ["json", "csv", "txt", "xml", "html"].includes(ext)
        ) {
          const text = await blob.text();
          setTextContent(text);
          setLoading(false);
          return;
        }

        // ── Route 2: Video files ─────────────────────────────────────────────
        // Apryse does not support video — use native <video> element instead
        const isVideo = type.startsWith("video/") || ext === "mp4";

        if (isVideo) {
          const objectUrl = URL.createObjectURL(blob);
          // render a <video> tag instead of loading into WebViewer
          setVideoUrl(objectUrl);
          setLoading(false);
          return;
        }

        // ── Route 3: WebViewer (PDF, Office, images) ─────────────────────────
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
          setLoading(false);
        };

        if (instanceRef.current) {
          doLoad();
        } else {
          // WebViewer not ready yet — defer the load until initialization completes
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

  /** Renders plain text and JSON files as a monospace <pre> block. */
  if (textContent !== null) {
    const isJson = mimeType === "application/json" || extFromName === "json";
    let display = textContent;
    if (isJson) {
      try {
        // Pretty-print valid JSON; fall back to raw string if parsing fails
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
        }}
      >
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

  /** Renders video files using the native HTML5 <video> element. */
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

  /** Default renderer: Apryse WebViewer iframe for PDFs, Office files, and images. */
  return (
    <Box sx={{ flex: 1, minHeight: 0, position: "relative" }}>
      {/* Loading overlay — hidden once WebViewer signals the document is ready */}
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

      {/* WebViewer mount point — hidden during load to avoid flash of unstyled content */}
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
