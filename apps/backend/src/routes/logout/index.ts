import express from "express";
import { INTERNAL_ERROR_MESSAGE } from "../../config.ts";
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  getAuth,
} from "../../lib/request.ts";
import { logger } from "../../logger.ts";
import { prisma } from "@repo/db";

const router = express.Router();

router.post("/", async (req, res) => {
  const auth = getAuth(req);

  logger.verbose("Processing logout request: clearing authentication cookie");

  try {
    await prisma.activity.create({
      data: {
        employeeUuid: auth.employeeUuid,
        action: "LOG_OUT",
      },
    });

    res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);

    logger.verbose("Processed logout request: authentication cookie cleared");
    return res.status(200).json({ message: "Successfully logged out!" });
  } catch (e) {
    logger.error("Failed to process logout request", e);
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

export default router;
