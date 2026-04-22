import { useRef, useEffect } from "react";
import { Dialog, Box, Button, Stack, Typography } from "@mui/material";
import WebViewer, { type WebViewerInstance } from "@pdftron/webviewer";

interface Props {
  open: boolean;
  onClose: () => void;
  uri: string;
  fileName: string;
  readOnly?: boolean;
  onSave?: (blob: Blob) => Promise<void>;
}

const mimeToExt: Record<string, string> = {
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

export default function DocumentEditorModal({
  open,
  onClose,
  uri,
  fileName,
  readOnly = false,
  onSave,
}: Props) {
  const viewerDivRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<WebViewerInstance | null>(null);
  const pendingLoadRef = useRef<(() => void) | null>(null);
  const hasInitializedRef = useRef(false);

  // Initialize WebViewer once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
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
        if (readOnly) instance.UI.setToolMode("Pan");
        if (pendingLoadRef.current) {
          pendingLoadRef.current();
          pendingLoadRef.current = null;
        }
      });
    }, 500);

    return () => clearTimeout(timer);
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
        if (abortController.signal.aborted) return; // Another file was selected

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
        if ((err as Error).name === "AbortError") return; // Expected, ignore
        console.error("Failed to load document:", err);
      }
    };

    void doFetchAndLoad();

    return () => abortController.abort();
  }, [open, uri, fileName]);

  const handleSave = async () => {
    if (!instanceRef.current || !onSave) return;
    const { Core } = instanceRef.current;
    const doc = Core.documentViewer.getDocument();
    if (!doc) return;
    const data = await doc.getFileData({ downloadType: "pdf" });
    const blob = new Blob([data], { type: "application/octet-stream" });
    await onSave(blob);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      keepMounted
    >
      <Box sx={{ height: "85vh", display: "flex", flexDirection: "column" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 1, gap: 1 }}
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
            {!readOnly && (
              <Button
                variant="contained"
                onClick={handleSave}
              >
                Save
              </Button>
            )}
            <Button onClick={onClose}>Close</Button>
          </Stack>
        </Stack>
        <Box
          sx={{ flex: 1, overflow: "hidden", minHeight: 0 }}
          ref={viewerDivRef}
        />
      </Box>
    </Dialog>
  );
}
