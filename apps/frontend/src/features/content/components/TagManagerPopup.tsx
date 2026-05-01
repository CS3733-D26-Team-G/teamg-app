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
} from "@mui/material";
import Button from "@mui/material/Button";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AddIcon from "@mui/icons-material/Add";
import { API_ENDPOINTS } from "../../../config.ts";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [pendingDeleteTag, setPendingDeleteTag] = useState<string | null>(null);
  const [localTags, setLocalTags] = useState<ContentTagSummary[]>([]);

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
          Tag Manager
        </Box>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Manage Content Tags</DialogTitle>
        <DialogContent
          dividers
          sx={{
            border: "1px solid black",
            borderRadius: 1,
            margin: 1.5,
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
            {localTags.map((tag, index) => (
              <Box key={tag.uuid}>
                <ListItem
                  disablePadding
                  secondaryAction={
                    pendingDeleteTag === tag.uuid ?
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography>Delete</Typography>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            handleDeleteTag(tag.uuid);
                          }}
                        >
                          Yes
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => {
                            setPendingDeleteTag(null);
                          }}
                        >
                          No
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
                  <ListItemText primary={tag.name} />
                </ListItem>
                {index < localTags.length - 1 && <Divider />}
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
