import React from "react";

import ContentForm from "../../features/content/components/ContentForm.tsx";
import type { ContentRecord } from "../../types/content";
import { API_ENDPOINTS } from "../../config.ts";

interface ContentManagementProps {
  viewState?: ContentRecord | "new" | null;
}

function MyForms({ viewState }: ContentManagementProps) {
  const currentViewState = viewState ?? null;

  const handleSave = async (body: FormData) => {
    const isExisting = currentViewState !== "new" && currentViewState !== null;

    const url =
      isExisting ?
        API_ENDPOINTS.CONTENT.EDIT(currentViewState.uuid)
      : API_ENDPOINTS.CONTENT.CREATE;

    console.log(body instanceof FormData);
    for (const [key, value] of body.entries()) {
      console.log(key, value);
    }
    const res = await fetch(url, {
      method: isExisting ? "PUT" : "POST",
      body,
    });

    console.log(res);

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      console.error("Save failed:", error ?? res.statusText);
      return;
    }

    const saved = await res.json().catch(() => null);
    console.log("Saved content:", saved);
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <ContentForm
        key={
          currentViewState === "new" || currentViewState === null ?
            "new-content-form"
          : currentViewState.uuid
        }
        initialData={
          currentViewState && currentViewState !== "new" ?
            currentViewState
          : undefined
        }
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default MyForms;
