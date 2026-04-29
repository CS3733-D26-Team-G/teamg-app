import type { InsuranceClaimType } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";

export { type InsuranceClaimType };

export const InsuranceClaimCreatePayloadSchema =
  Schemas.InsuranceClaimCreateManyInputObjectZodSchema.omit({
    uuid: true,
    requestorEmployeeUuid: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    contentUuids: z.array(z.uuid()).default([]),
  });

export const InsuranceClaimUpdatePayloadSchema =
  Schemas.InsuranceClaimUpdateManyMutationInputObjectZodSchema.omit({
    uuid: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    contentUuids: z.array(z.uuid()).optional(),
  });

export type InsuranceClaimCreatePayload = z.infer<
  typeof InsuranceClaimCreatePayloadSchema
>;
export type InsuranceClaimUpdatePayload = z.infer<
  typeof InsuranceClaimUpdatePayloadSchema
>;

export const InsuranceClaimRequestorSchema = z.object({
  uuid: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  corporateEmail: z.string(),
});

export const InsuranceClaimContentSummarySchema =
  Schemas.ContentCreateManyInputObjectZodSchema.pick({
    title: true,
    url: true,
    contentType: true,
    status: true,
  }).extend({
    uuid: z.string(),
    fileType: z.string().nullable(),
  });

export const InsuranceClaimRecordSchema =
  Schemas.InsuranceClaimCreateManyInputObjectZodSchema.extend({
    uuid: z.string(),
    requestor: InsuranceClaimRequestorSchema,
    contents: z.array(InsuranceClaimContentSummarySchema),
  });

export type InsuranceClaimRecord = z.infer<typeof InsuranceClaimRecordSchema>;

export const InsuranceClaimRecordsSchema = z.array(InsuranceClaimRecordSchema);
