import express from "express";
import { prisma } from "@repo/db";
import { getAuth, sendInternalError } from "../../lib/request.ts";
import { logger } from "../../logger.ts";
import {
  ClaimCreateSchema,
  ClaimUpdateSchema,
  claimInclude,
} from "./schemas.ts";
import {
  findAccessibleClaim,
  findMissingContentUuids,
  getClaimUpdateData,
  getClaimVisibilityWhere,
  normalizeContentUuids,
  parseClaimUuid,
  serializeClaim,
} from "./utils.ts";

const router = express.Router();

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
          status: "PENDING", // Force initial status to PENDING
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
          resourceName: claim.incidentDescription,
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
          resourceName: claim.incidentDescription,
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
          resourceName: existingClaimResult.claim.incidentDescription,
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
