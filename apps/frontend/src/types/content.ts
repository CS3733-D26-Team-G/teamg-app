import type { Content, FavoriteContent } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";

/**
 * Create/edit form schemas
 *
 * These stay based on the generated Prisma input schemas because they are
 * genuinely modeling write payloads.
 */
export const ContentFormSchema = Schemas.ContentCreateInputObjectZodSchema.omit(
  {
    uuid: true,
    editLock: true,
    favoritedBy: true,
  },
);

export const ContentUpdateFormSchema =
  Schemas.ContentUpdateInputObjectZodSchema.omit({
    uuid: true,
    editLock: true,
    favoritedBy: true,
  });

export type ContentFormData = z.infer<typeof ContentFormSchema>;
export type ContentUpdateFormData = z.infer<typeof ContentUpdateFormSchema>;

/**
 * Flat scalar content record schema for GET responses
 *
 * This is based on the generated CreateMany schema because it is already the
 * flat scalar shape of Content without nested relation-write objects.
 *
 * We make uuid required for API rows and add the derived is_favorite boolean
 * returned by the backend.
 *
 * `.strip()` intentionally tolerates leaked backend include fields such as
 * `_count` or relation arrays until the backend response is fully flattened.
 */
export const ContentRecordSchema =
  Schemas.ContentCreateManyInputObjectZodSchema.omit({
    uuid: true,
  })
    .extend({
      uuid: z.string(),
      supabasePath: z.string().nullable(),
      is_favorite: z.boolean(),
      favorite_count: z.number().int().nonnegative(),
    })
    .strip();

export type ContentRecord = Content & {
  is_favorite: boolean;
  favorite_count: number;
};
export const ContentRecordsSchema = z.array(ContentRecordSchema);
export const ContentLockSchema = z.object({
  content_uuid: z.string(),
  locked_by_emp_uuid: z.string(),
  locked_by: z.object({
    uuid: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    isLocked: z.boolean(),
  }),
});
/**
 * UI row schema for ContentManagement/DataGrid
 *
 * This extends the API record with frontend-only state.
 */
export const ContentRowSchema = ContentRecordSchema.extend({
  isLocked: z.boolean().optional(),
}).strip();

export type ContentRow = ContentRecord & {
  lock?: z.infer<typeof ContentLockSchema>;
  isLocked?: boolean;
};
export const ContentRowsSchema = z.array(ContentRowSchema);

/**
 * Favorite endpoint response
 *
 * Centralized here so the endpoint contract is shared instead of duplicated
 * inside ContentManagement.tsx.
 */
export const ContentFavoriteResponseSchema =
  Schemas.FavoriteContentCreateManyInputObjectZodSchema.extend({
    isFavorite: z.boolean(),
    changed: z.boolean(),
    message: z.string(),
  });

export type ContentFavoriteResponse = FavoriteContent & {
  isFavorite: boolean;
  changed: boolean;
  message: string;
};
