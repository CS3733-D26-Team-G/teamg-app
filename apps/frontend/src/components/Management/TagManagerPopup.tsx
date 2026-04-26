import React, { Fragment, useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Box,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
} from "@mui/material";
import Button from "@mui/material/Button";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import { API_ENDPOINTS } from "../../config.ts";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Tag {
  uuid: string;
  name: string;
  count: number;
}

export default function TagManagerPopup() {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingDeleteTag, setPendingDeleteTag] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadTags = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.CONTENT_TAGS, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tags");
      }

      const data = (await res.json()) as Tag[];
      setTags(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) void loadTags();
  }, [open]);

  const handleCreateTag = async () => {
    if (!newTag.trim()) {
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT_TAG_CREATE, {
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

      setNewTag("");
      await loadTags();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTag = async (uuid: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.CONTENT_TAG_DELETE(uuid), {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete tag");
      }
      setPendingDeleteTag(null);
      await loadTags();
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
        <DialogContent dividers>
          {/*List of tags structure*/}
          <List
            disablePadding
            sx={{
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            {tags.length === 0 && <Typography>There are no tags</Typography>}
            {tags.map((tag, index) => (
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
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                  }
                >
                  <ListItemText
                    primary={tag.name}
                    secondary={tag.count}
                  />
                </ListItem>
                {index < tags.length - 1 && <Divider />}
              </Box>
            ))}
          </List>

          {/*New Content Tag*/}
          <Box>
            <TextField
              size="small"
              fullWidth
              placeholder="Enter new tag name..."
              value={newTag}
              onChange={(event) => setNewTag(event.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                void handleCreateTag();
              }}
              disabled={!newTag.trim()}
            >
              Add Tag
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              {
                handleClose();
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
