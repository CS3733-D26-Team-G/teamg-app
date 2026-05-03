import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Typography,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Chip,
} from "@mui/material";
import Button from "@mui/material/Button";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AddIcon from "@mui/icons-material/Add";
import { API_ENDPOINTS } from "../../../config.ts";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import HeaderSearchBar from "./HeaderSearchBar";
import {
  ContentTagSummariesSchema,
  type ContentTagSummary,
} from "../../../types/content";
import { invalidateContentTags } from "../../../lib/api-loaders";

interface TagManagerPopupProps {
  availableTags: ContentTagSummary[];
  onTagsChanged: () => Promise<ContentTagSummary[]>;
}

export default function TagManagerPopup({
  availableTags,
  onTagsChanged,
}: TagManagerPopupProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [pendingDeleteTag, setPendingDeleteTag] = useState<string | null>(null);
  const [localTags, setLocalTags] = useState<ContentTagSummary[]>([]);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTags = localTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    setLocalTags(availableTags);
  }, [availableTags]);

  const handleOpen = async () => {
    setLocalTags(availableTags);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateTag = async () => {
    if (!newTag.trim()) {
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.TAG.CREATE, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag.trim() }),
      });

      if (res.status === 409) {
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to create tag");
      }

      const createdTag = ContentTagSummariesSchema.element.parse(
        await res.json(),
      );
      setLocalTags((prev) => [...prev, createdTag]);
      setNewTag("");
      invalidateContentTags();
      setLocalTags(await onTagsChanged());
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTag = async (uuid: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.CONTENT.TAG.DELETE(uuid), {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete tag");
      }

      setLocalTags((prev) => prev.filter((tag) => tag.uuid !== uuid));
      setPendingDeleteTag(null);
      invalidateContentTags();
      setLocalTags(await onTagsChanged());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocalOfferOutlinedIcon fontSize="small" />
          {t("tagManager.tagManager")}
        </Box>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: 16 }}>
                <b>{t("tagManager.manageContentTags")}</b>
              </Typography>
              <Chip
                label={`${availableTags.length} ${t("tagManager.tags")}`}
                size="small"
              />
            </Box>
            <HeaderSearchBar setSearchQuery={setSearchQuery} />
          </Box>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            border: "1px solid black",
            borderRadius: 1,
            margin: 1.5,
            pl: 0.75,
            pr: 0,
            py: 1.25,
          }}
        >
          {/*List of tags structure*/}
          <List
            disablePadding
            sx={{
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {localTags.length === 0 && (
              <Typography sx={{ display: "flex", justifyContent: "center" }}>
                {t("tagManager.notags")}
              </Typography>
            )}
            {filteredTags.map((tag, index) => (
              <Box key={tag.uuid}>
                <ListItem
                  disablePadding
                  onMouseEnter={() => setHoveredTag(tag.uuid)}
                  onMouseLeave={() => setHoveredTag(null)}
                  sx={{
                    "&:hover": { backgroundColor: "action.hover" },
                    "py": 0.75,
                    "borderRadius": 1,
                  }}
                  secondaryAction={
                    pendingDeleteTag === tag.uuid ?
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography>{t("tagManager.delete")}</Typography>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            handleDeleteTag(tag.uuid);
                          }}
                        >
                          {t("tagManager.yes")}
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            setPendingDeleteTag(null);
                          }}
                        >
                          {t("tagManager.no")}
                        </Button>
                      </Box>
                    : <IconButton
                        size="small"
                        onClick={() => {
                          setPendingDeleteTag(tag.uuid);
                        }}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#ef5350" }}
                        />
                      </IconButton>
                  }
                >
                  <ListItemText
                    sx={{ pl: 1 }}
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocalOfferOutlinedIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        {tag.name}
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: 1,
          }}
        >
          {/*New Content Tag*/}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: 400,
            }}
          >
            <TextField
              size="small"
              placeholder={t("tagManager.enterNewTag")}
              value={newTag}
              onChange={(event) => setNewTag(event.target.value)}
              fullWidth
            />
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                void handleCreateTag();
              }}
              disabled={!newTag.trim()}
              sx={{ width: 160 }}
            >
              {t("tagManager.addTag")}
            </Button>
          </Box>
          <Button
            onClick={() => {
              {
                handleClose();
                {
                  setNewTag("");
                }
              }
            }}
          >
            {t("contentManagement.cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
