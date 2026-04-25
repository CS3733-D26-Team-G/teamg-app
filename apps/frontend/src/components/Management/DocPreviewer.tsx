import { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import WebViewer, { type WebViewerInstance } from "@pdftron/webviewer";
import mime from "mime-types";

const TEXT_TYPES = new Set([
  "application/json",
  "text/plain",
  "text/csv",
  "text/html",
  "text/xml",
  "application/xml",
]);

const MIME_TO_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "image/png": "png",
  "image/jpeg": "jpg",
  "video/mp4": "mp4",
};

interface DocPreviewerProps {
  uri: string;
  fileName: string;
}

export default function DocPreviewer({ uri, fileName }: DocPreviewerProps) {
  const viewerDivRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const hasInitializedRef = useRef(false);
  const pendingLoadRef = useRef<(() => void) | null>(null);

  const [textContent, setTextContent] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const extFromName =
    fileName.includes(".") ?
      fileName.split(".").pop()?.toLowerCase()
    : undefined;

  // Initialize WebViewer once
  useEffect(() => {
    if (hasInitializedRef.current || !viewerDivRef.current) return;
    hasInitializedRef.current = true;

    WebViewer(
      {
        path: "/webviewer/lib",
        licenseKey:
          "demo:1776714799946:6325df920300000000de6805a4f71c4346d6e510d1c42048e35ab36d86",
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
      instance.UI.setToolMode("Pan");

      // Disable features first
      instance.UI.disableFeatures([
        instance.UI.Feature.Ribbons,
        instance.UI.Feature.Annotations,
      ]);

      // Then disable individual elements
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

      // Force layout recalculation
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);

      if (pendingLoadRef.current) {
        pendingLoadRef.current();
        pendingLoadRef.current = null;
      }
    });
  }, []);

  // Fetch and load document
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
        const type = blob.type || String(mime.lookup(fileName) || "");
        setMimeType(type);

        if (abortController.signal.aborted) return;

        // Determine extension now that we have the mime type
        const ext = extFromName ?? MIME_TO_EXT[type] ?? "pdf";

        // Text types — render as plain text, skip WebViewer
        if (
          TEXT_TYPES.has(type) ||
          ["json", "csv", "txt", "xml", "html"].includes(ext)
        ) {
          const text = await blob.text();
          setTextContent(text);
          setLoading(false);
          return;
        }

        // Everything else — load blob directly into WebViewer
        const doLoad = () => {
          const instance = instanceRef.current;
          if (!instance) return;
          void instance.UI.loadDocument(blob, {
            filename: fileName,
            extension: ext,
          });
          setLoading(false);
        };

        if (instanceRef.current) {
          doLoad();
        } else {
          pendingLoadRef.current = doLoad;
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error("Preview failed:", err);
        setLoading(false);
      }
    };

    void doFetchAndLoad();
    return () => abortController.abort();
  }, [uri, fileName]);

  // Text renderer
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
          height: "100%",
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

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
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
      <Box
        ref={viewerDivRef}
        sx={{
          "width": "100%",
          "height": "100%",
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
