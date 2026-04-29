import type { Department, Position } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";

export { type Department, type Position };

export const EmployeeFormSchema =
  Schemas.EmployeeCreateManyInputObjectZodSchema.omit({
    uuid: true,
  });

export type EmployeeFormData = z.infer<typeof EmployeeFormSchema>;

export const EmployeeRecordSchema =
  Schemas.EmployeeCreateManyInputObjectZodSchema.omit({
    uuid: true,
  }).extend({
    uuid: z.string(),
    avatar: z.string().nullable(),
    avatarSupabasePath: z.string().nullable().optional(),
  });

export type EmployeeRecord = z.infer<typeof EmployeeRecordSchema>;
export const EmployeeRecordsSchema = z.array(EmployeeRecordSchema);
