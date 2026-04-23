import express from "express";
import { prisma } from "@repo/db";
import { getAuth, sendInternalError } from "../lib/request.ts";
import { logger } from "../logger.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const auth = getAuth(req);

  try {
    logger.verbose(
      `Querying Employee table for profile data for employee ${auth.employeeUuid}`,
    );

    const profile = await prisma.employee.findUnique({
      where: { uuid: auth.employeeUuid },
    });

    return res.status(200).json(profile);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to load profile for ${auth.employeeUuid}`,
      e,
    );
  }
});

export default router;
