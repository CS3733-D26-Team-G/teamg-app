import { Prisma } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";

export const ClaimParamsSchema =
  Schemas.InsuranceClaimWhereUniqueInputObjectZodSchema.extend({
    uuid: z.uuid(),
  });

export const ClaimCreateSchema =
  Schemas.InsuranceClaimCreateManyInputObjectZodSchema.omit({
    uuid: true,
    requestorEmployeeUuid: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    contentUuids: z.array(z.uuid()).default([]),
  });

export const ClaimUpdateSchema =
  Schemas.InsuranceClaimUpdateManyMutationInputObjectZodSchema.omit({
    uuid: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    contentUuids: z.array(z.uuid()).optional(),
  });

export const claimInclude = {
  requestor: {
    select: {
      uuid: true,
      first_name: true,
      last_name: true,
      corporate_email: true,
    },
  },
  contents: {
    orderBy: {
      createdAt: "asc",
    },
    include: {
      content: {
        select: {
          uuid: true,
          title: true,
          url: true,
          file_type: true,
          content_type: true,
          status: true,
        },
      },
    },
  },
} satisfies Prisma.InsuranceClaimInclude;
