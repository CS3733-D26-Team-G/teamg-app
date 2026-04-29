import express from "express";
import { Position, Prisma, prisma } from "@repo/db";
import {
  getAuth,
  isAdmin,
  requireAdmin,
  sendInternalError,
} from "../lib/request.ts";
import { logger } from "../logger.ts";

const router = express.Router();
const DASHBOARD_TIME_ZONE = "America/New_York";

function formatDashboardDateKey(timestamp: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DASHBOARD_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(timestamp);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function getVisibleContentWhere(
  auth: NonNullable<Express.Request["auth"]>,
): Prisma.ContentWhereInput | undefined {
  if (isAdmin(auth)) {
    return undefined;
  }

  return { for_position: auth.position };
}

router.get(
  "/employee/count",
  //requireAdmin("Employee stats route"),
  async (_req, res) => {
    logger.verbose("Querying Employee table for employee counts by position");
    try {
      const positions = Object.values(Position);

      const groupedCounts = await prisma.employee.groupBy({
        by: ["position"],
        _count: {
          _all: true,
        },
      });

      logger.verbose(
        `Queried Employee table for employee counts by position: found ${groupedCounts.length} grouped record(s)`,
      );

      const stats = positions.reduce<Record<Position, number>>(
        (acc, position) => {
          acc[position] =
            groupedCounts.find((group) => group.position === position)?._count
              ._all ?? 0;
          return acc;
        },
        {} as Record<Position, number>,
      );

      return res.status(200).json(stats);
    } catch (e) {
      return sendInternalError(res, "Failed to retrieve employee stats", e);
    }
  },
);
router.get(
  "/activity/action-summary",
  requireAdmin("dashboard activity summary"),
  async (req, res) => {
    const position = req.query.position as Position | undefined;
    const employeeUuid = req.query.employeeUuid as string | undefined;
    try {
      const employeeWhere: Prisma.EmployeeWhereInput = {
        ...(position ? { position } : {}),
        ...(employeeUuid ? { uuid: employeeUuid } : {}),
      };
      const hasEmployeeFilter = Object.keys(employeeWhere).length > 0;
      const activities = await prisma.activity.groupBy({
        by: ["action"],
        where: {
          ...(hasEmployeeFilter ? { employee: employeeWhere } : {}),
          action: {
            in: ["EDIT_CONTENT", "CHECK_OUT_CONTENT", "DELETE_CONTENT"],
          },
        },
        _count: {
          _all: true,
        },
      });
      const summary = {
        edited:
          activities.find((activity) => activity.action === "EDIT_CONTENT")
            ?._count._all ?? 0,
        checkedOut:
          activities.find((activity) => activity.action === "CHECK_OUT_CONTENT")
            ?._count._all ?? 0,
        deleted:
          activities.find((activity) => activity.action === "DELETE_CONTENT")
            ?._count._all ?? 0,
        previewed: 0,
      };
      return res.status(200).json(summary);
    } catch (e) {
      return sendInternalError(res, "Can't get summary", e);
    }
  },
);

router.get("/content/count/position", async (req, res) => {
  const auth = getAuth(req);

  try {
    const positions = Object.values(Position);
    const groupedCounts = await prisma.content.groupBy({
      where: getVisibleContentWhere(auth),
      by: ["for_position"],
      _count: {
        _all: true,
      },
    });

    const stats = positions.reduce<Record<Position, number>>(
      (acc, position) => {
        acc[position] =
          groupedCounts.find((group) => group.for_position === position)?._count
            ._all ?? 0;
        return acc;
      },
      {} as Record<Position, number>,
    );

    return res.status(200).json(stats);
  } catch (e) {
    return sendInternalError(res, "Failed to retrieve content stats", e);
  }
});
//file type router
router.get("/content/count/file-type", async (req, res) => {
  const auth = getAuth(req);
  try {
    const groupedCounts = await prisma.content.groupBy({
      where: getVisibleContentWhere(auth),
      by: ["file_type"],
      _count: {
        _all: true,
      },
      orderBy: {
        file_type: "asc",
      },
    });
    const stats = groupedCounts.map((group) => ({
      type: group.file_type?.trim() || "N/A",
      count: group._count._all ?? 0,
    }));
    return res.status(200).json(stats);
  } catch (e) {
    return sendInternalError(res, "Failes to retrieve file", e);
  }
});

//for graph
router.get("/content/edit-hits-by-role", async (req, res) => {
  const auth = getAuth(req);
  try {
    const visibleContentWhere = getVisibleContentWhere(auth);
    const visibleContentUuids =
      visibleContentWhere ?
        (
          await prisma.content.findMany({
            where: visibleContentWhere,
            select: { uuid: true },
          })
        ).map((content) => content.uuid)
      : null;

    const activities = await prisma.activity.findMany({
      where: {
        action: "EDIT_CONTENT",
        resource: "CONTENT",
        ...(visibleContentUuids ?
          {
            resourceUuid: {
              in: visibleContentUuids,
            },
          }
        : {}),
      },
      select: {
        timestamp: true,
        employee: {
          select: {
            position: true,
          },
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });
    const positions = Object.values(Position);
    type EditHitsRow = {
      date: string;
    } & Partial<Record<Position, number>>;
    const grouped = new Map<string, EditHitsRow>();
    for (const activity of activities) {
      const date = formatDashboardDateKey(activity.timestamp);
      if (!grouped.has(date)) {
        const baseRow: EditHitsRow = { date };
        for (const position of positions) {
          baseRow[position] = 0;
        }
        grouped.set(date, baseRow);
      }
      const row = grouped.get(date);
      if (row && activity.employee?.position) {
        row[activity.employee.position] =
          (row[activity.employee.position] ?? 0) + 1;
      }
    }
    return res.status(200).json(Array.from(grouped.values()));
  } catch (e) {
    return sendInternalError(res, "Failed to get content edit hits", e);
  }
});

router.get("/content/count/tags", async (req, res) => {
  const auth = getAuth(req);
  const visibleContentWhere = getVisibleContentWhere(auth);

  try {
    const tags = await prisma.contentTag.findMany({
      select: {
        uuid: true,
        name: true,
        assignments: {
          where:
            visibleContentWhere ?
              {
                content: visibleContentWhere,
              }
            : undefined,
          select: {
            contentUuid: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json(
      tags.map((tag) => ({
        uuid: tag.uuid,
        name: tag.name,
        count: tag.assignments.length,
      })),
    );
  } catch (e) {
    return sendInternalError(res, "Failed to retrieve content tag stats", e);
  }
});

export default router;
