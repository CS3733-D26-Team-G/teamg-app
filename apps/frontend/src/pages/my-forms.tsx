import React from "react";

import ContentForm from "../components/Management/ContentForm";
import type { ContentRecord } from "../types/content";

interface ContentManagementProps {
  viewState: ContentRecord | "new" | null;
  setViewState: React.Dispatch<
    React.SetStateAction<ContentRecord | "new" | null>
  >;
}

function MyForms({ viewState }: ContentManagementProps) {
  const handleSave = async (body: FormData) => {
    const isExisting = viewState !== "new" && viewState !== null;

    const url =
      isExisting ?
        `http://localhost:3000/content/edit/${viewState.uuid}`
      : "http://localhost:3000/content/create";

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
          viewState === "new" || viewState === null ?
            "new-content-form"
          : viewState.uuid
        }
        initialData={viewState && viewState !== "new" ? viewState : undefined}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default MyForms;
