import express from "express";
import { prisma } from "@repo/db";
import { normalizeAccountSettings } from "../../lib/account-settings.ts";
import { getAuth, isAdmin, sendInternalError } from "../../lib/request.ts";
import { logger } from "../../logger.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const auth = getAuth(req);
  const admin = isAdmin(auth);

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
        can_manage_employees: admin,
        can_manage_all_content: admin,
      },
    });
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to build session payload for employee ${auth.employeeUuid}`,
      e,
    );
  }
});

export default router;
