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
    "CREATE_CLAIM",
    "EDIT_CLAIM",
    "DELETE_CLAIM",
    "CHECK_OUT_CONTENT",
    "CHECK_IN_CONTENT",
  ];
  const authActions = ["LOG_IN", "LOG_OUT"];
  const verboseContentActions = ["OWNERSHIP_CHANGE", "EDIT_CONTENT"];

  let where = {};
  switch (category) {
    case "content":
      where = {
        action: { in: contentActions },
      };
      break;

    case "verbose":
      where = {
        action: { in: verboseContentActions },
      };
      break;

    case "auth":
      where = {
        action: { in: authActions },
        ...(!isAdmin(auth) ? { employeeUuid: auth.employeeUuid } : {}),
      };
      break;

    case "all":
      if (isAdmin(auth)) {
        where = {};
      } else {
        where = {
          OR: [
            { action: { in: contentActions } },
            {
              action: { in: authActions },
              employeeUuid: auth.employeeUuid,
            },
          ],
        };
      }
      break;

    default:
      return res.status(400).json({ message: "Invalid category for activity" });
  }

  logger.verbose(
    `Querying Activity table for last 50 records in ${category} category`,
  );

  try {
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
