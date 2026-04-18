import express from "express";
import { prisma } from "@repo/db";
import { logger } from "../logger.ts";
import { INTERNAL_ERROR_MESSAGE } from "../config.ts";

const router = express.Router();

/**
 * GET /activity
 * Returns recent activity logs
 */
router.get("/", async (req, res) => {
  const auth = req.auth!;
  if (auth.position !== "ADMIN") {
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
    logger.error(`Failed to query Activity table:\n${e}`);
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

export default router;
