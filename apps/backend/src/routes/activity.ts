import express from "express";
import { Prisma, prisma } from "@repo/db";
import { logger } from "../logger.ts";
import { getAuth, isAdmin, sendInternalError } from "../lib/request.ts";

const router = express.Router();
function getVisibleActivity(
  auth: NonNullable<Express.Request["auth"]>,
): Prisma.ActivityWhereInput | undefined {
  if (isAdmin(auth)) {
    return undefined;
  }
  return {
    employeeUuid: auth.employeeUuid,
  };
}
/**
 * GET /activity
 * Returns recent activity logs
 */
router.get("/", async (req, res) => {
  const auth = getAuth(req);
  const visibleActivity = getVisibleActivity(auth);
  logger.verbose(
    visibleActivity ?
      `Querying Activity table for ${auth.employeeUuid}'s last 50 records`
    : "Querying activity able for last 50 records",
  );

  try {
    const activities = await prisma.activity.findMany({
      where: visibleActivity,
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
      visibleActivity ?
        `Queried Activity table for ${auth.employeeUuid}:  found ${activities.length} record(s)`
      : `Queried Activity table for most recent records: found ${activities.length} record(s)`,
    );

    return res.status(200).json(activities);
  } catch (e) {
    return sendInternalError(res, "Failed to query Activity table", e);
  }
});

export default router;
