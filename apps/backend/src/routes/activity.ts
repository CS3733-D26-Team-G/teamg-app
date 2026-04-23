import express from "express";
import { prisma } from "@repo/db";
import { logger } from "../logger.ts";
import { getAuth, isAdmin, sendInternalError } from "../lib/request.ts";

const router = express.Router();

/**
 * GET /activity
 * Returns recent activity logs
 */
router.get("/", async (req, res) => {
  const auth = getAuth(req);
  if (!isAdmin(auth)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  logger.verbose("Querying Activity table for last 50 records");

  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        timestamp: "desc",
      },
      take: 50,
      include: {
        employee: {
          select: {
            uuid: true,
            first_name: true,
            last_name: true,
            avatar: true,
          },
        },
      },
    });

    logger.verbose(
      `Queried Activity table for most recent records: found ${activities.length} record(s)`,
    );

    return res.status(200).json(activities);
  } catch (e) {
    return sendInternalError(res, "Failed to query Activity table", e);
  }
});

export default router;
