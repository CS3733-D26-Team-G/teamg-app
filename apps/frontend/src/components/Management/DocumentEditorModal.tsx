import { useRef, useEffect, useState } from "react";
import { Dialog, Box, Button, Stack, Typography } from "@mui/material";
import WebViewer, { type WebViewerInstance } from "@pdftron/webviewer";
import { API_ENDPOINTS } from "../../config.ts";
import VersionHistoryPanel from "./VersionHistoryPanel.tsx";
import type { ContentRow } from "../../types/content.ts";
import { useTheme } from "@mui/material/styles";

interface Props {
  open: boolean;
  onClose: () => void;
  uri: string;
  uuid: string;
  fileName: string;
  contentRow: ContentRow;
  readOnly?: boolean;
  onSaved?: () => void;
}

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

export default function DocumentEditorModal({
  open,
  onClose,
  uri,
  fileName,
  uuid,
  contentRow,
  readOnly = false,
  onSaved,
}: Props) {
  const viewerDivRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const pendingLoadRef = useRef<(() => void) | null>(null);
  const hasInitializedRef = useRef(false);
  const theme = useTheme();
  const [viewerReady, setViewerReady] = useState(false);

  // Initialize WebViewer once on mount
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (hasInitializedRef.current || !viewerDivRef.current) return;
      hasInitializedRef.current = true;

      WebViewer(
        {
          path: "/webviewer/lib",
          licenseKey:
            "demo:1776714799946:6325df920300000000de6805a4f71c4346d6e510d1c42048e35ab36d86",
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
        instance.UI.setTheme(
          theme.palette.mode === "dark" ? "dark" : "default",
        );

        if (readOnly) instance.UI.setToolMode("Pan");
        window.dispatchEvent(new Event("resize"));
        if (pendingLoadRef.current) {
          pendingLoadRef.current();
          pendingLoadRef.current = null;
        }
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  const currentUriRef = useRef<string>("");

  // Fetch and load document when modal opens
  useEffect(() => {
    if (!open || !uri) return;
    if (!uri.includes("/content/file/")) return;
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
          setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
        };

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

  useEffect(() => {
    if (!viewerReady || !instanceRef.current) return;
    instanceRef.current.UI.setTheme(
      theme.palette.mode === "dark" ? "dark" : "default",
    );
  }, [theme.palette.mode, viewerReady]);

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
        {/* Top bar */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 1, gap: 1, flexShrink: 0 }}
        >
          <Typography
            variant="subtitle2"
            sx={{ pl: 1, color: "text.secondary" }}
          >
            {fileName}
          </Typography>
          <Stack
            direction="row"
            gap={1}
          >
            <Button
              variant="contained"
              onClick={async () => {
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
                currentUriRef.current = "";
                onSaved?.();
                onClose();
              }}
            >
              Save
            </Button>
            <Button onClick={onClose}>Close</Button>
          </Stack>
        </Stack>

        {/* Body: viewer + history panel side by side */}
        <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
          {/* WebViewer */}
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

          {/* Version history sidebar */}
          <VersionHistoryPanel
            contentUuid={uuid}
            contentRow={contentRow}
          />
        </Box>
      </Box>
    </Dialog>
  );
}
