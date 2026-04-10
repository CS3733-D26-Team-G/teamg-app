import { useState } from "react";
import { z } from "zod";

import ContentManagement from "../components/Management/ContentManagement";
import { Schemas } from "@repo/zod";

type ContentRow = z.infer<typeof Schemas.ContentCreateInputObjectZodSchema> & {
  uuid: string;
};

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
