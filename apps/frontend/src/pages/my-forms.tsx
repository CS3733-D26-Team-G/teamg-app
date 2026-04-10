import React from "react";
import { z } from "zod";

import ContentForm from "../components/Management/ContentForm";
import { Schemas } from "@repo/zod";

type ContentFormData = z.infer<typeof Schemas.ContentCreateInputObjectZodSchema>;
type ContentRow = ContentFormData & { uuid: string };

interface ContentManagementProps {
  viewState: ContentRow | "new" | null;
  setViewState: React.Dispatch<React.SetStateAction<ContentRow | "new" | null>>;
}

function MyForms({ viewState }: ContentManagementProps) {
  const handleSave = async (formData: ContentFormData) => {
    const isExisting = viewState !== "new" && viewState !== null;
    const uuid = isExisting ? viewState.uuid : crypto.randomUUID();

    const parsed = Schemas.ContentCreateInputObjectSchema.parse({
      ...formData,
      uuid,
    });

    const url = isExisting
      ? `http://localhost:3000/content/edit/${uuid}`
      : "http://localhost:3000/content/create";

    const res = await fetch(url, {
      method: isExisting ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isExisting
          ? (() => {
              const { uuid: _uuid, ...rest } = parsed;
              return rest;
            })()
          : parsed,
      ),
    });

    console.log(res);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <ContentForm
        key="new-content-form"
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default MyForms;
