import express from "express";
import { prisma, Prisma } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";
import { getAuth, isAdmin, sendInternalError } from "../lib/request.ts";
import { logger } from "../logger.ts";

const router = express.Router();

const ClaimParamsSchema =
  Schemas.InsuranceClaimWhereUniqueInputObjectZodSchema.extend({
    uuid: z.uuid(),
  });

const ClaimCreateSchema =
  Schemas.InsuranceClaimCreateManyInputObjectZodSchema.omit({
    uuid: true,
    requestorEmployeeUuid: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    contentUuids: z.array(z.uuid()).default([]),
  });

const ClaimUpdateSchema =
  Schemas.InsuranceClaimUpdateManyMutationInputObjectZodSchema.omit({
    uuid: true,
    createdAt: true,
    updatedAt: true,
  }).extend({
    contentUuids: z.array(z.uuid()).optional(),
  });

const claimInclude = {
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

type Auth = NonNullable<Express.Request["auth"]>;
type ClaimWithRelations = Prisma.InsuranceClaimGetPayload<{
  include: typeof claimInclude;
}>;
type ClaimUpdatePayload = z.infer<typeof ClaimUpdateSchema>;

function parseClaimUuid(
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

function getClaimVisibilityWhere(auth: Auth): Prisma.InsuranceClaimWhereInput {
  if (isAdmin(auth)) {
    return {};
  }

  return {
    requestorEmployeeUuid: auth.employeeUuid,
  };
}

// ── KEY FIX: status is now included in the serialized output ──────────────────
function serializeClaim(claim: ClaimWithRelations) {
  return {
    uuid: claim.uuid,
    requestorEmployeeUuid: claim.requestorEmployeeUuid,
    incident_date: claim.incident_date,
    claim_type: claim.claim_type,
    incident_description: claim.incident_description,
    status: claim.status, // was missing — caused both queue pages to fail
    createdAt: claim.createdAt,
    updatedAt: claim.updatedAt,
    requestor: claim.requestor,
    contents: claim.contents.map(({ content }) => content),
  };
}

async function findMissingContentUuids(contentUuids: string[]) {
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

async function findAccessibleClaim(uuid: string, auth: Auth) {
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

function normalizeContentUuids(contentUuids: string[]) {
  return [...new Set(contentUuids)];
}

function getClaimUpdateData(payload: ClaimUpdatePayload) {
  const { contentUuids: _contentUuids, ...data } = payload;
  return data;
}

router.get("/", async (req, res) => {
  const auth = getAuth(req);

  logger.verbose("Querying InsuranceClaim table for visible records");

  try {
    const claims = await prisma.insuranceClaim.findMany({
      where: getClaimVisibilityWhere(auth),
      include: claimInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.verbose(
      `Queried InsuranceClaim table for visible records: found ${claims.length} record(s)`,
    );

    return res.status(200).json(claims.map(serializeClaim));
  } catch (e) {
    return sendInternalError(
      res,
      "Failed to query InsuranceClaim table for visible records",
      e,
    );
  }
});

router.get("/:uuid", async (req, res) => {
  const uuid = parseClaimUuid(req, res, "Invalid claim UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

  try {
    logger.verbose(`Querying InsuranceClaim table for record ${uuid}`);
    const result = await findAccessibleClaim(uuid, auth);

    if (result.kind === "missing") {
      logger.warn(
        `Received read request for InsuranceClaim table record ${uuid} that does not exist`,
      );
      return res.status(400).json({ message: "Invalid claim UUID" });
    }

    if (result.kind === "forbidden") {
      logger.warn(
        `Rejected InsuranceClaim read request for record ${uuid} from employee ${auth.employeeUuid}`,
      );
      return res.status(403).json({ message: "Unauthorized" });
    }

    logger.verbose(`Queried InsuranceClaim table for record ${uuid}: found`);
    return res.status(200).json(serializeClaim(result.claim));
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to query InsuranceClaim table record ${uuid}`,
      e,
    );
  }
});

router.post("/create", async (req, res) => {
  const auth = getAuth(req);
  const body = ClaimCreateSchema.safeParse(req.body);

  if (!body.success) {
    logger.verbose(
      `Failed to parse InsuranceClaim create request body:\n${body.error.issues}`,
    );
    return res.status(400).json({ message: body.error.issues });
  }

  const { contentUuids, ...data } = body.data;
  const normalizedContentUuids = normalizeContentUuids(contentUuids);

  try {
    const missingContentUuids = await findMissingContentUuids(
      normalizedContentUuids,
    );

    if (missingContentUuids.length > 0) {
      logger.warn(
        `Rejected InsuranceClaim create request with missing content UUID(s): ${missingContentUuids.join(", ")}`,
      );
      return res.status(400).json({
        message: "One or more content UUIDs are invalid",
        missingContentUuids,
      });
    }

    logger.verbose("Inserting InsuranceClaim table record");

    const createdClaim = await prisma.$transaction(async (tx) => {
      const claim = await tx.insuranceClaim.create({
        data: {
          ...data,
          requestorEmployeeUuid: auth.employeeUuid,
        },
      });

      if (normalizedContentUuids.length > 0) {
        await tx.claimContentAssignment.createMany({
          data: normalizedContentUuids.map((contentUuid) => ({
            claimUuid: claim.uuid,
            contentUuid,
          })),
        });
      }

      await tx.activity.create({
        data: {
          employeeUuid: auth.employeeUuid,
          action: "CREATE_CLAIM",
          resource: "INSURANCE_CLAIM",
          resourceUuid: claim.uuid,
          resourceName: claim.incident_description,
        },
      });

      return tx.insuranceClaim.findUniqueOrThrow({
        where: { uuid: claim.uuid },
        include: claimInclude,
      });
    });

    logger.verbose(`Inserted InsuranceClaim table record ${createdClaim.uuid}`);
    return res.status(201).json(serializeClaim(createdClaim));
  } catch (e) {
    return sendInternalError(
      res,
      "Failed to insert InsuranceClaim table record",
      e,
    );
  }
});

router.put("/update/:uuid", async (req, res) => {
  const uuid = parseClaimUuid(req, res, "Invalid claim UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);
  const body = ClaimUpdateSchema.safeParse(req.body);

  if (!body.success) {
    logger.verbose(
      `Failed to parse InsuranceClaim update request body for record ${uuid}:\n${body.error.issues}`,
    );
    return res.status(400).json({ message: body.error.issues });
  }

  try {
    const existingClaimResult = await findAccessibleClaim(uuid, auth);

    if (existingClaimResult.kind === "missing") {
      logger.warn(
        `Received update request for InsuranceClaim table record ${uuid} that does not exist`,
      );
      return res.status(400).json({ message: "Invalid claim UUID" });
    }

    if (existingClaimResult.kind === "forbidden") {
      logger.warn(
        `Rejected InsuranceClaim update request for record ${uuid} from employee ${auth.employeeUuid}`,
      );
      return res.status(403).json({ message: "Unauthorized" });
    }

    const normalizedContentUuids =
      body.data.contentUuids === undefined ?
        undefined
      : normalizeContentUuids(body.data.contentUuids);

    if (normalizedContentUuids) {
      const missingContentUuids = await findMissingContentUuids(
        normalizedContentUuids,
      );

      if (missingContentUuids.length > 0) {
        logger.warn(
          `Rejected InsuranceClaim update request for record ${uuid} with missing content UUID(s): ${missingContentUuids.join(", ")}`,
        );
        return res.status(400).json({
          message: "One or more content UUIDs are invalid",
          missingContentUuids,
        });
      }
    }

    const updateData = getClaimUpdateData(body.data);

    logger.verbose(`Updating InsuranceClaim table record ${uuid}`);

    const updatedClaim = await prisma.$transaction(async (tx) => {
      const claim = await tx.insuranceClaim.update({
        where: { uuid },
        data: {
          ...updateData,
          ...(normalizedContentUuids !== undefined ?
            { updatedAt: new Date() }
          : {}),
        },
      });

      if (normalizedContentUuids !== undefined) {
        await tx.claimContentAssignment.deleteMany({
          where: { claimUuid: uuid },
        });

        if (normalizedContentUuids.length > 0) {
          await tx.claimContentAssignment.createMany({
            data: normalizedContentUuids.map((contentUuid) => ({
              claimUuid: uuid,
              contentUuid,
            })),
          });
        }
      }

      await tx.activity.create({
        data: {
          employeeUuid: auth.employeeUuid,
          action: "EDIT_CLAIM",
          resource: "INSURANCE_CLAIM",
          resourceUuid: claim.uuid,
          resourceName: claim.incident_description,
        },
      });

      return tx.insuranceClaim.findUniqueOrThrow({
        where: { uuid },
        include: claimInclude,
      });
    });

    logger.verbose(`Updated InsuranceClaim table record ${uuid}`);
    return res.status(200).json(serializeClaim(updatedClaim));
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to update InsuranceClaim table record ${uuid}`,
      e,
    );
  }
});

router.post("/delete/:uuid", async (req, res) => {
  const uuid = parseClaimUuid(req, res, "Invalid claim UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

  try {
    logger.verbose(
      `Querying InsuranceClaim table for record ${uuid} before delete`,
    );
    const existingClaimResult = await findAccessibleClaim(uuid, auth);

    if (existingClaimResult.kind === "missing") {
      logger.warn(
        `Received delete request for InsuranceClaim table record ${uuid} that does not exist`,
      );
      return res.status(400).json({ message: "Invalid claim UUID" });
    }

    if (existingClaimResult.kind === "forbidden") {
      logger.warn(
        `Rejected InsuranceClaim delete request for record ${uuid} from employee ${auth.employeeUuid}`,
      );
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.activity.create({
        data: {
          employeeUuid: auth.employeeUuid,
          action: "DELETE_CLAIM",
          resource: "INSURANCE_CLAIM",
          resourceUuid: existingClaimResult.claim.uuid,
          resourceName: existingClaimResult.claim.incident_description,
        },
      });

      await tx.insuranceClaim.delete({
        where: { uuid },
      });
    });

    logger.verbose(`Deleted InsuranceClaim table record ${uuid}`);
    return res.status(200).json(serializeClaim(existingClaimResult.claim));
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to delete InsuranceClaim table record ${uuid}`,
      e,
    );
  }
});

export default router;
