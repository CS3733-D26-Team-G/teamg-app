import { Prisma } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";
import { InsuranceClaimStatus } from "@repo/db"; // Import the actual Prisma Enum

// Define an Enum to match your Prisma schema for type safety
const ClaimStatusEnum = z.nativeEnum(InsuranceClaimStatus);

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
    status: true, // Omit so we can set a default via the extend below
  }).extend({
    contentUuids: z.array(z.uuid()).default([]),
    status: ClaimStatusEnum.default("PENDING"), // Defaulting to PENDING ensures a "Reduced Mental Load"
  });

export const ClaimUpdateSchema =
  Schemas.InsuranceClaimUpdateManyMutationInputObjectZodSchema.omit({
    uuid: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    contentUuids: z.array(z.uuid()).optional(),
    status: ClaimStatusEnum.optional(), // Now perfectly matches Prisma's expectations
    comment: z.string().optional().nullable(), // <--- ADD THIS
  });

export const claimInclude = {
  requestor: {
    select: {
      uuid: true,
      firstName: true,
      lastName: true,
      corporateEmail: true,
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
          fileType: true,
          contentType: true,
          status: true,
        },
      },
    },
  },
} satisfies Prisma.InsuranceClaimInclude;
