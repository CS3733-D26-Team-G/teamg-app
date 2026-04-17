import type { Department, Employee, Position } from "@repo/db";
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
  });

export type EmployeeRecord = Employee;
export const EmployeeRecordsSchema = z.array(EmployeeRecordSchema);
