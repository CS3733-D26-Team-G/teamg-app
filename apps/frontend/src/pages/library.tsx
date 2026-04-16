import { useState } from "react";

import ContentManagement from "../components/Management/ContentManagement";
import type { ContentRow } from "../types/content";

function Library() {
  const [viewState, setViewState] = useState<ContentRow | "new" | null>(null);

  return (
    <>
      <ContentManagement
        viewState={viewState}
        setViewState={setViewState}
      />
    </>
  );
}

export default Library;
