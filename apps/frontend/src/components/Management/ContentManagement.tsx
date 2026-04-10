import React, { useEffect, useMemo, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  IconButton,
  Box,
  Button,
  AppBar,
  Toolbar,
  styled,
  Typography,
  Link,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { z } from "zod";

import ContentForm from "./ContentForm";
import HeaderSearchBar from "./HeaderSearchBar";
import { Schemas } from "@repo/zod";

type ContentFormData = z.infer<typeof Schemas.ContentCreateInputObjectZodSchema>;
type ContentRow = ContentFormData & { uuid: string };
import { API_ENDPOINTS } from "../../config";

const ContentRowSchema = Schemas.ContentCreateInputObjectZodSchema.extend({
  uuid: z.string(),
});

interface ContentManagementProps {
  viewState: ContentRow | "new" | null;
  setViewState: React.Dispatch<React.SetStateAction<ContentRow | "new" | null>>;
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "stretch",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  minHeight: 128,
}));

export default function ContentManagement({
  viewState,
  setViewState,
}: ContentManagementProps) {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        if (!searchQuery.trim()) return true;

        const targetFields = [row.title, row.url, row.content_owner];
        return targetFields.some((field) =>
          field?.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }),
    [rows, searchQuery],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.CONTENT, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: unknown = await res.json();
        const parsed = z.array(ContentRowSchema).safeParse(data);

        if (!parsed.success) {
          console.error("Failed to validate content list:", parsed.error);
          setRows([]);
          return;
        }

        setRows(parsed.data);
      } catch (error) {
        console.error("Failed to fetch content:", error);
        setRows([]);
      }
    };
    void fetchData();
  }, []);

  const handleDelete = async (row: ContentRow) => {
    if (!window.confirm(`Are you sure you want to delete "${row.title}"?`)) {
      return;
    }

    const { uuid } = row;

    try {
      const res = await fetch(API_ENDPOINTS.CONTENT_DELETE(row.uuid), {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.uuid !== uuid));
        console.log(`Successfully deleted: ${uuid}`);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Server rejected delete:", errorData);
      }
    } catch (error) {
      console.error("Network error during delete:", error);
    }
  };

  const handleSave = async (formData: ContentFormData) => {
    const isExisting = viewState !== "new" && viewState !== null;
    const uuid = isExisting ? viewState.uuid : crypto.randomUUID();

    const parsed = Schemas.ContentCreateInputObjectSchema.parse({
      ...formData,
      uuid,
    });

    const url = isExisting
      ? API_ENDPOINTS.CONTENT_EDIT(uuid)
      : API_ENDPOINTS.CONTENT_CREATE;

    try {
      const res = await fetch(url, {
        method: isExisting ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          isExisting
            ? (() => {
                const { uuid: _uuid, ...rest } = parsed;
                return rest;
              })()
            : parsed,
        ),
      });

      if (res.ok) {
        const refreshRes = await fetch(API_ENDPOINTS.CONTENT, {
          credentials: "include",
        });
        const updatedData: unknown = await refreshRes.json();
        const parsedRows = z.array(ContentRowSchema).safeParse(updatedData);

        if (!parsedRows.success) {
          console.error("Failed to validate refreshed content:", parsedRows.error);
          setRows([]);
        } else {
          setRows(parsedRows.data);
        }

        setViewState(null);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Save failed:", errorData);
      }
    } catch (error) {
      console.error("Network error during save:", error);
    }
  };

  const getColumns = (
    _onEdit: (row: ContentRow) => void,
    onDelete: (row: ContentRow) => void,
  ): GridColDef<ContentRow>[] => [
    { field: "title", headerName: "Title", flex: 1 },
    {
      field: "url",
      headerName: "URL",
      flex: 1,
      renderCell: (params) => (
        <Link
          href={params.value}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >
          {params.value}
        </Link>
      ),
    },
    { field: "content_owner", headerName: "Content Owner", flex: 1 },
    { field: "content_type", headerName: "Type", width: 130 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => setViewState(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(params.row)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      {viewState ? (
        <ContentForm
          initialData={viewState === "new" ? null : viewState}
          onSave={handleSave}
          onCancel={() => setViewState(null)}
        />
      ) : (
        <Box>
          <AppBar
            position="static"
            sx={{
              backgroundColor: "white",
              boxShadow: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <StyledToolbar
              sx={{ width: "100%", boxSizing: "border-box", px: 0 }}
            >
              <Typography
                variant="h4"
                sx={{ pb: 2, pt: 4, color: "black", fontWeight: "bold" }}
              >
                Content Management
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box sx={{ flexGrow: 1, maxWidth: "70%" }}>
                  <HeaderSearchBar setSearchQuery={setSearchQuery} />
                </Box>
                <Button
                  onClick={() => setViewState("new")}
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  New Content
                </Button>
              </Box>
            </StyledToolbar>
          </AppBar>
          <DataGrid
            rows={filteredRows}
            getRowId={(row) => row.uuid}
            columns={getColumns(setViewState, handleDelete)}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Box>
      )}
    </Box>
  );
}
