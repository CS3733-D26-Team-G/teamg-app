import { useRef, useEffect, useState } from "react";
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
  const initializedRef = useRef(false);

  // Runs once when the div mounts (keepMounted means this only fires once ever)
  const setViewerDiv = (node: HTMLDivElement | null) => {
    if (!node || initializedRef.current) return;
    viewerDivRef.current = node;

    WebViewer(
      {
        path: "/webviewer/lib",
        licenseKey:
          "demo:1776714799946:6325df920300000000de6805a4f71c4346d6e510d1c42048e35ab36d86",
        disabledElements:
          readOnly ? ["toolsHeader", "ribbons", "toggleNotesButton"] : [],
      },
      node,
    ).then((instance) => {
      instanceRef.current = instance;
      initializedRef.current = true;
      if (readOnly) {
        instance.UI.setToolMode("Pan");
      }
    });
  };

  // Load the correct document whenever uri changes or modal opens
  useEffect(() => {
    if (!open || !instanceRef.current || !uri) return;

    const instance = instanceRef.current;

    const loadDoc = async () => {
      // Fetch with credentials so your auth cookies are sent
      const response = await fetch(uri, { credentials: "include" });
      if (!response.ok)
        throw new Error(`Failed to fetch document: ${response.status}`);

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const doLoad = () => {
        void instanceRef.current!.UI.loadDocument(objectUrl, {
          filename: fileName,
          extension: fileName.split(".").pop(),
        });
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
      };

      const { Core } = instance;
      if (
        Core.documentViewer.getDocument !== null ||
        Core.documentViewer.getScrollViewElement()
      ) {
        doLoad();
      } else {
        Core.documentViewer.addEventListener("ready", doLoad, { once: true });
      }
    };

    void loadDoc();
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
          ref={setViewerDiv}
        />
      </Box>
    </Dialog>
  );
}
