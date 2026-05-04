import { Position, Prisma } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";
import { getContentListInclude } from "./utils.ts";

export const ParamsSchema =
  Schemas.ContentWhereUniqueInputObjectZodSchema.extend({
    uuid: z.uuid(),
  });

export const TagParamsSchema = z.object({
  uuid: z.uuid(),
});

export const TagContentParamsSchema = z.object({
  tagUuid: z.uuid(),
  contentUuid: z.uuid(),
});

function normalizeTagUuidListInput(
  value: unknown,
  missingValue: string[] | undefined,
) {
  if (typeof value === "undefined") {
    return missingValue;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    if (trimmedValue.startsWith("[") && trimmedValue.endsWith("]")) {
      try {
        const parsedValue: unknown = JSON.parse(trimmedValue);
        if (Array.isArray(parsedValue)) {
          return parsedValue;
        }
      } catch {
        return value;
      }
    }
  }

  return Array.isArray(value) ? value : [value];
}

export const TagUuidListSchema = z
  .preprocess(
    (value) => normalizeTagUuidListInput(value, []),
    z.array(z.uuid()),
  )
  .transform((tagUuids) => Array.from(new Set(tagUuids)));

export const OptionalTagUuidListSchema = z
  .preprocess((value) => {
    return normalizeTagUuidListInput(value, undefined);
  }, z.array(z.uuid()).optional())
  .transform((tagUuids) =>
    tagUuids ? Array.from(new Set(tagUuids)) : undefined,
  );

export const CreateContentSchema =
  Schemas.ContentCreateInputObjectZodSchema.extend({
    url: z.string().optional(),
    tagUuids: TagUuidListSchema,
  });

export const UpdateContentSchema =
  Schemas.ContentUpdateInputObjectZodSchema.omit({
    uuid: true,
  })
    .partial()
    .extend({
      url: z.string().optional(),
      tagUuids: OptionalTagUuidListSchema,
    });

export const FavoriteContentSchema = z.object({
  is_favorite: z.boolean(),
});

export const RegenerateContentLinkSchema = z.object({
  expirationTime: z.coerce.date(),
});

export const CreateOrEditTagSchema = z.object({
  name: z.string(),
});

export const ContentFilterFieldSchema = z.enum([
  "expirationTime",
  "lastModifiedTime",
  "status",
  "contentType",
  "forPosition",
  "title",
  "contentOwner",
  "fileType",
]);

export const ContentFilterOperatorSchema = z.enum([
  "eq",
  "neq",
  "lt",
  "lte",
  "gt",
  "gte",
]);

export const ContentFilterSchema = z.object({
  field: ContentFilterFieldSchema,
  op: ContentFilterOperatorSchema,
  value: z.unknown(),
});

export const contentLockInclude = {
  lockedByEmp: {
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      corporateEmail: true,
    },
  },
} satisfies Prisma.ContentEditLockInclude;

export type ContentFilter = z.infer<typeof ContentFilterSchema>;
export type ContentFilterField = z.infer<typeof ContentFilterFieldSchema>;
export type SupportedContentField =
  | "expirationTime"
  | "lastModifiedTime"
  | "status"
  | "contentType"
  | "forPosition"
  | "title"
  | "contentOwner"
  | "fileType";

export const contentDateFilterFields = new Set<ContentFilterField>([
  "expirationTime",
  "lastModifiedTime",
]);

export const contentFieldValueSchemas = {
  expirationTime: z.coerce.date(),
  lastModifiedTime: z.coerce.date(),
  status: Schemas.ContentStatusSchema,
  contentType: Schemas.ContentTypeSchema,
  forPosition: Schemas.PositionSchema,
  title: z.string(),
  contentOwner: z.string(),
  fileType: z.string(),
} satisfies Record<SupportedContentField, z.ZodType>;

export type UploadResult =
  | { ok: true; url: string; supabasePath?: string }
  | { ok: false; status: number; message: string };

export type PositionUpdateValue =
  | Position
  | Prisma.EnumPositionFieldUpdateOperationsInput
  | undefined
  | null;

export type ContentListItem = Prisma.ContentGetPayload<{
  include: ReturnType<typeof getContentListInclude>;
}>;

export type SearchCandidate = {
  uuid: string;
  text_rank: number;
  fuzzy_rank: number;
};

export enum TagAction {
  CREATE,
  DELETE,
  INVALID,
}
