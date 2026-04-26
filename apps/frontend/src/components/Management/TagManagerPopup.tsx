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
        throw new Error("There was a problem fetching tags.");
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
                <ListItem disablePadding>
                  <ListItemText
                    primary={tag.name}
                    secondary={tag.count}
                  />
                </ListItem>
                {index < tags.length - 1 && <Divider />}
              </Box>
            ))}
          </List>

          {/*New Content*/}
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
