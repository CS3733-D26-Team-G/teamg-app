import express from "express";
import { logger } from "../logger.ts";
import { prisma } from "@repo/db";
import { INTERNAL_ERROR_MESSAGE } from "../config.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const auth = req.auth!;

  try {
    logger.verbose(
      `Querying Employee table for profile data for employee ${auth.employeeUuid}`,
    );

    const profile = await prisma.employee.findUnique({
      where: { uuid: auth.employeeUuid },
      select: {
        first_name: true,
        last_name: true,
        date_of_birth: true,
        phone_number: true,
        corporation_email: true,
        position: true,
        avatar: true,
      },
    });

    return res.status(200).json(profile);
  } catch (e) {
    logger.error(`Failed to load profile for ${auth.employeeUuid}:\n${e}`);

    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

export default router;
