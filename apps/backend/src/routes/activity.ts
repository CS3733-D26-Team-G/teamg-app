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

  const category = (req.query.category as string) ?? "content";

  const contentActions = [
    "CREATE_CONTENT",
    "EDIT_CONTENT",
    "DELETE_CONTENT",
    "CHECK_OUT_CONTENT",
    "CHECK_IN_CONTENT",
  ];
  const claimActions = ["CREATE_CLAIM", "EDIT_CLAIM", "DELETE_CLAIM"];
  const authActions = ["LOG_IN", "LOG_OUT"];
  const verboseContentActions = ["OWNERSHIP_CHANGE"];

  try {
    const accessibleContentUuids =
      isAdmin(auth) ? undefined : (
        (
          await prisma.content.findMany({
            where: { for_position: auth.position },
            select: { uuid: true },
          })
        ).map((content) => content.uuid)
      );

    const contentFilter =
      isAdmin(auth) ?
        {
          action: { in: [...contentActions, ...claimActions] },
        }
      : {
          OR: [
            {
              action: { in: contentActions },
              resource: "CONTENT",
              resourceUuid: { in: accessibleContentUuids },
            },
            {
              action: { in: claimActions },
              employeeUuid: auth.employeeUuid,
            },
          ],
        };

    const verboseFilter =
      isAdmin(auth) ?
        {
          action: { in: verboseContentActions },
        }
      : {
          action: { in: verboseContentActions },
          resource: "CONTENT",
          resourceUuid: { in: accessibleContentUuids },
        };

    const authFilter =
      isAdmin(auth) ?
        {
          action: { in: authActions },
        }
      : {
          action: { in: authActions },
          employeeUuid: auth.employeeUuid,
        };

    let where = {};
    switch (category) {
      case "content":
        where = contentFilter;
        break;

      case "verbose":
        where = verboseFilter;
        break;

      case "auth":
        where = authFilter;
        break;

      case "all":
        where =
          isAdmin(auth) ?
            {}
          : { OR: [contentFilter, verboseFilter, authFilter] };
        break;

      default:
        return res
          .status(400)
          .json({ message: "Invalid category for activity" });
    }

    logger.verbose(
      `Querying Activity table for last 50 records in ${category} category`,
    );

    const activities = await prisma.activity.findMany({
      where,
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
