import { Position, Prisma } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";

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

export const TagUuidListSchema = z
  .preprocess((value) => {
    if (typeof value === "undefined") {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  }, z.array(z.uuid()))
  .transform((tagUuids) => Array.from(new Set(tagUuids)));

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
      tagUuids: TagUuidListSchema,
    });

export const FavoriteContentSchema = z.object({
  isFavorite: z.boolean(),
});

export const RegenerateContentLinkSchema = z.object({
  expiration_time: z.coerce.date(),
});

export const CreateTagSchema = z.object({
  name: z.string(),
});

export const ContentFilterFieldSchema = z.enum([
  "expiration_time",
  "last_modified_time",
  "status",
  "content_type",
  "for_position",
  "title",
  "content_owner",
  "file_type",
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
      first_name: true,
      last_name: true,
      corporate_email: true,
    },
  },
} satisfies Prisma.ContentEditLockInclude;

export type ContentFilter = z.infer<typeof ContentFilterSchema>;
export type ContentFilterField = z.infer<typeof ContentFilterFieldSchema>;
export type SupportedContentField =
  | "expiration_time"
  | "last_modified_time"
  | "status"
  | "content_type"
  | "for_position"
  | "title"
  | "content_owner"
  | "file_type";

export const contentDateFilterFields = new Set<ContentFilterField>([
  "expiration_time",
  "last_modified_time",
]);

export const contentFieldValueSchemas = {
  expiration_time: z.coerce.date(),
  last_modified_time: z.coerce.date(),
  status: Schemas.ContentStatusSchema,
  content_type: Schemas.ContentTypeSchema,
  for_position: Schemas.PositionSchema,
  title: z.string(),
  content_owner: z.string(),
  file_type: z.string(),
} satisfies Record<SupportedContentField, z.ZodType>;

export type UploadResult =
  | { ok: true; url: string; supabasePath?: string }
  | { ok: false; status: number; message: string };

export type PositionUpdateValue =
  | Position
  | Prisma.EnumPositionFieldUpdateOperationsInput
  | undefined
  | null;
