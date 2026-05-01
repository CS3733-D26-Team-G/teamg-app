import express from "express";
import { prisma, Prisma } from "@repo/db";
import { isAdmin } from "../../lib/request.ts";
import { z } from "zod";
import {
  ClaimParamsSchema,
  ClaimUpdateSchema,
  claimInclude,
} from "./schemas.ts";

type Auth = NonNullable<Express.Request["auth"]>;
type ClaimWithRelations = Prisma.InsuranceClaimGetPayload<{
  include: typeof claimInclude;
}>;
type ClaimUpdatePayload = z.infer<typeof ClaimUpdateSchema>;

export function parseClaimUuid(
  req: express.Request,
  res: express.Response,
  invalidMessage: string,
) {
  const params = ClaimParamsSchema.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: invalidMessage });
    return null;
  }

  return params.data.uuid;
}

export function getClaimVisibilityWhere(
  auth: Auth,
): Prisma.InsuranceClaimWhereInput {
  if (isAdmin(auth)) {
    return {};
  }

  return {
    requestorEmployeeUuid: auth.employeeUuid,
  };
}

export function serializeClaim(claim: ClaimWithRelations) {
  return {
    uuid: claim.uuid,
    requestorEmployeeUuid: claim.requestorEmployeeUuid,
    incidentDate: claim.incidentDate,
    claimType: claim.claimType,
    incidentDescription: claim.incidentDescription,
    status: claim.status,
    createdAt: claim.createdAt,
    updatedAt: claim.updatedAt,
    requestor: claim.requestor,
    contents: claim.contents.map(({ content }) => content),
  };
}

export async function findMissingContentUuids(contentUuids: string[]) {
  if (contentUuids.length === 0) {
    return [];
  }

  const existingContents = await prisma.content.findMany({
    where: {
      uuid: {
        in: contentUuids,
      },
    },
    select: {
      uuid: true,
    },
  });

  const existingContentUuidSet = new Set(
    existingContents.map(({ uuid }) => uuid),
  );

  return contentUuids.filter((uuid) => !existingContentUuidSet.has(uuid));
}

export async function findAccessibleClaim(uuid: string, auth: Auth) {
  const claim = await prisma.insuranceClaim.findUnique({
    where: { uuid },
    include: claimInclude,
  });

  if (!claim) {
    return { kind: "missing" as const };
  }

  if (!isAdmin(auth) && claim.requestorEmployeeUuid !== auth.employeeUuid) {
    return { kind: "forbidden" as const };
  }

  return { kind: "ok" as const, claim };
}

export function normalizeContentUuids(contentUuids: string[]) {
  return [...new Set(contentUuids)];
}

export function getClaimUpdateData(payload: ClaimUpdatePayload) {
  const { contentUuids: _contentUuids, ...data } = payload;

  return data;
}
