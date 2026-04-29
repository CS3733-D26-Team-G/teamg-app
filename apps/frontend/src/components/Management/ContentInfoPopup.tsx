import React, { useState } from "react";
import { Popover, Typography, Box, Avatar } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { CopyIcon } from "lucide-react";

interface InfoButtonProps {
  url: string;
  author: string;
  position: string;
  fileType: string | null;
  editor?: string;
  editorAvatar?: string | null;
}

function formatFileType(mime: string | null): string {
  const mimeMap: Record<string, string> = {
    "application/pdf": ".PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      ".DOCX",
    "application/msword": ".DOC",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      ".XLSX",
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

  if (!mime) return "Unknown";
  return mimeMap[mime] ?? mime;
}

export default function InfoPopup({
  url,
  author,
  position,
  fileType,
  editor,
  editorAvatar,
}: InfoButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [copied, setCopied] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <InfoOutlinedIcon
          sx={{
            fontSize: 18,
          }}
        />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
        slotProps={{
          paper: {
            sx: { border: "1px solid", borderColor: "gray" },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.2,
            p: 1,
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          >
            <Typography
              noWrap
              sx={{
                textOverflow: "ellipsis",
                maxWidth: 400,
              }}
            >
              <b>URL:</b> {url}
            </Typography>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{ padding: 0 }}
            >
              {copied ?
                <CheckIcon fontSize="small" />
              : <CopyIcon fontSize="small" />}
            </IconButton>
          </Box>
          <Typography>
            <b>Author:</b> {author}
          </Typography>
          {editor && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography>
                <b>Editor:</b>
              </Typography>
              <Avatar
                src={editorAvatar ?? undefined}
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "1rem",
                }}
              >
                {editor[0]}
              </Avatar>
              <Typography>{editor}</Typography>
            </Box>
          )}
          <Typography>
            <b>Position:</b> {position}
          </Typography>
          <Typography>
            <b>File Type:</b> {formatFileType(fileType)}
          </Typography>
        </Box>
      </Popover>
    </>
  );
}
