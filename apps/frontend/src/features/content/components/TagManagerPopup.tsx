import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

interface TagManagerPopupProps {
  availableTags: ContentTagSummary[];
  onTagsChanged: () => Promise<ContentTagSummary[]>;
}

export default function TagManagerPopup({
  availableTags,
  onTagsChanged,
}: TagManagerPopupProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
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
      setLoadingMessage("Creating tag…");
      setLoading(true);
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
      void createdTag;
      setNewTag("");
      invalidateContentTags();
      setLocalTags(await onTagsChanged());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRenameTag = async (uuid: string) => {
    if (!editValue.trim()) {
      return;
    }

    try {
      setLoadingMessage("Saving tag…");
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.CONTENT.TAG.EDIT(uuid), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editValue.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to edit tag");
      }

      setEditingTag(null);
      invalidateContentTags();
      setLocalTags(await onTagsChanged());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (uuid: string) => {
    try {
      setLoadingMessage("Deleting tag…");
      setLoading(true);
      const res = await fetch(API_ENDPOINTS.CONTENT.TAG.DELETE(uuid), {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete tag");
      }

      setPendingDeleteTag(null);
      invalidateContentTags();
      setLocalTags(await onTagsChanged());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
          Tag Manager
        </Box>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { position: "relative", overflow: "visible" } }}
      >
        {/* loading overlay — shown while create/rename/delete requests are in-flight */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              backgroundColor: "rgba(0,0,0,0.45)",
              borderRadius: "inherit",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
            }}
          >
            <CircularProgress sx={{ color: "white" }} />
            <Typography
              sx={{ color: "white", fontWeight: 500, fontSize: "0.9rem" }}
            >
              {loadingMessage}
            </Typography>
          </Box>
        )}
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
                <b>Manage Content Tags</b>
              </Typography>
              <Chip
                label={`${availableTags.length} tags`}
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
                No Tags in the System
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
                >
                  {editingTag === tag.uuid ?
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        pl: 1,
                        flex: 1,
                      }}
                    >
                      <LocalOfferOutlinedIcon
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <TextField
                        size="small"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void handleRenameTag(tag.uuid);
                          if (e.key === "Escape") setEditingTag(null);
                        }}
                        autoFocus
                        fullWidth
                      />
                    </Box>
                  : <ListItemText
                      sx={{ pl: 1 }}
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <LocalOfferOutlinedIcon
                            sx={{ fontSize: 18, color: "text.secondary" }}
                          />
                          {tag.name}
                        </Box>
                      }
                    />
                  }

                  {editingTag === tag.uuid ?
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexShrink: 0,
                        ml: 2,
                        mr: 1,
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => void handleRenameTag(tag.uuid)}
                      >
                        Save
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setEditingTag(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  : pendingDeleteTag === tag.uuid ?
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexShrink: 0,
                        mr: 1,
                      }}
                    >
                      <Typography>Delete?</Typography>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleDeleteTag(tag.uuid)}
                      >
                        Yes
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setPendingDeleteTag(null)}
                      >
                        No
                      </Button>
                    </Box>
                  : <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingTag(tag.uuid);
                          setEditValue(tag.name);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => setPendingDeleteTag(tag.uuid)}
                      >
                        <DeleteIcon
                          fontSize="small"
                          sx={{ color: "#ef5350" }}
                        />
                      </IconButton>
                    </Box>
                  }
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
              placeholder="Enter new tag name..."
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
              Add Tag
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
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
