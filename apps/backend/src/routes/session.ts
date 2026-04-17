import express from "express";
import { prisma } from "@repo/db";
import { INTERNAL_ERROR_MESSAGE } from "../config.ts";
import { normalizeAccountSettings } from "../lib/account-settings.ts";
import { logger } from "../logger.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const auth = req.auth!;
  const isAdmin = auth.position === "ADMIN";

  try {
    logger.verbose(
      `Querying Account table for session data for employee ${auth.employeeUuid}`,
    );
    const account = await prisma.account.findUnique({
      where: { employeeUuid: auth.employeeUuid },
      select: {
        settings: true,
      },
    });

    return res.status(200).json({
      employeeUuid: auth.employeeUuid,
      position: auth.position,
      settings: normalizeAccountSettings(account?.settings),
      permissions: {
        canManageEmployees: isAdmin,
        canManageAllContent: isAdmin,
      },
    });
  } catch (e) {
    logger.error(
      `Failed to build session payload for employee ${auth.employeeUuid}:\n${e}`,
    );
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

export default router;
