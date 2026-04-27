import { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import WebViewer, { type WebViewerInstance } from "@pdftron/webviewer";
import { useTheme } from "@mui/material/styles";

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
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.ms-excel": "xls",
  "application/msword": "doc",
  "image/png": "png",
  "image/jpeg": "jpg",
  "video/mp4": "mp4",
};

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

interface DocPreviewerProps {
  uri: string;
  fileName: string;
}

export default function DocPreviewer({ uri, fileName }: DocPreviewerProps) {
  const viewerDivRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const hasInitializedRef = useRef(false);
  const pendingLoadRef = useRef<(() => void) | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const theme = useTheme();
  const [viewerReady, setViewerReady] = useState(false);

  const [textContent, setTextContent] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const extFromName =
    fileName.includes(".") ?
      fileName.split(".").pop()?.toLowerCase()
    : undefined;

  useEffect(() => {
    if (!viewerReady || !instanceRef.current) return;
    instanceRef.current.UI.setTheme(
      theme.palette.mode === "dark" ? "dark" : "default",
    );
  }, [theme.palette.mode, viewerReady]);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  // Initialize WebViewer once on mount — same pattern as DocumentEditorModal
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
        instance.UI.setTheme(
          theme.palette.mode === "dark" ? "dark" : "default",
        );
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
        if (pendingLoadRef.current) {
          pendingLoadRef.current();
          pendingLoadRef.current = null;
        }
      });
    });

    return () => cancelAnimationFrame(frameId);
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
        const type =
          blob.type || (extFromName ? EXT_TO_MIME[extFromName] : "") || "";
        setMimeType(type);

        if (abortController.signal.aborted) return;

        const ext = extFromName ?? MIME_TO_EXT[type] ?? "pdf";

        if (
          TEXT_TYPES.has(type) ||
          ["json", "csv", "txt", "xml", "html"].includes(ext)
        ) {
          const text = await blob.text();
          setTextContent(text);
          setLoading(false);
          return;
        }

        const isVideo = type.startsWith("video/") || ext === "mp4";

        if (isVideo) {
          const objectUrl = URL.createObjectURL(blob);
          // render a <video> tag instead of loading into WebViewer
          setVideoUrl(objectUrl);
          setLoading(false);
          return;
        }

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
