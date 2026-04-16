import { z } from "zod";
import { Schemas } from "@repo/zod";

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
      is_favorite: z.boolean(),
    })
    .strip();

export type ContentRecord = z.infer<typeof ContentRecordSchema>;
export const ContentRecordsSchema = z.array(ContentRecordSchema);

/**
 * UI row schema for ContentManagement/DataGrid
 *
 * This extends the API record with frontend-only state.
 */
export const ContentRowSchema = ContentRecordSchema.extend({
  isLocked: z.boolean().optional(),
}).strip();

export type ContentRow = z.infer<typeof ContentRowSchema>;
export const ContentRowsSchema = z.array(ContentRowSchema);

/**
 * Favorite endpoint response
 *
 * Centralized here so the endpoint contract is shared instead of duplicated
 * inside ContentManagement.tsx.
 */
export const ContentFavoriteResponseSchema = z.object({
  employeeUuid: z.string(),
  contentUuid: z.string(),
  isFavorite: z.boolean(),
  changed: z.boolean(),
  message: z.string(),
});

export type ContentFavoriteResponse = z.infer<
  typeof ContentFavoriteResponseSchema
>;
