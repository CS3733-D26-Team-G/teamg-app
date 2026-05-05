import express from "express";
import { Position, Prisma, prisma } from "@repo/db";
import { getVisibleContentWhere } from "../../lib/content.ts";
import { getAuth, sendInternalError } from "../../lib/request.ts";
import { logger } from "../../logger.ts";
import { formatDashboardDateKey } from "./utils.ts";

const router = express.Router();

router.get("/employee/count", async (_req, res) => {
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
});

router.get("/activity/action-summary", async (req, res) => {
  const auth = getAuth(req);
  const isAdmin = auth.position === "ADMIN";

  const position =
    isAdmin ? (req.query.position as Position | undefined) : undefined;

  const employeeUuid =
    isAdmin ?
      (req.query.employeeUuid as string | undefined)
    : auth.employeeUuid;

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
});

router.get("/content/count/position", async (req, res) => {
  const auth = getAuth(req);

  try {
    const positions = Object.values(Position);
    const groupedCounts = await prisma.content.groupBy({
      where: getVisibleContentWhere(auth),
      by: ["forPosition"],
      _count: {
        _all: true,
      },
    });

    const stats = positions.reduce<Record<Position, number>>(
      (acc, position) => {
        acc[position] =
          groupedCounts.find((group) => group.forPosition === position)?._count
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

router.get("/content/count/file-type", async (req, res) => {
  const auth = getAuth(req);

  try {
    const groupedCounts = await prisma.content.groupBy({
      where: getVisibleContentWhere(auth),
      by: ["fileType"],
      _count: {
        _all: true,
      },
      orderBy: {
        fileType: "asc",
      },
    });

    const stats = groupedCounts.map((group) => ({
      type: group.fileType?.trim() || "N/A",
      count: group._count._all ?? 0,
    }));

    return res.status(200).json(stats);
  } catch (e) {
    return sendInternalError(res, "Failed to retrieve file type stats", e);
  }
});

router.get("/content/edit-hits-by-role", async (req, res) => {
  const auth = getAuth(req);

  const days = req.query.days ? Number(req.query.days) : undefined;

  const startDate =
    days && Number.isFinite(days) ?
      new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    : undefined;

  try {
    const visibleContentWhere = getVisibleContentWhere(auth);
    // Activity rows reference content by UUID only, so role visibility has to be
    // translated into a UUID allow-list before grouping edit events.
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
        ...(startDate ? { timestamp: { gte: startDate } } : {}),
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

router.get("/content/hits/top", async (req, res) => {
  const auth = getAuth(req);

  try {
    const hits = await prisma.contentHit.groupBy({
      by: ["contentUuid"],
      where: {
        content: getVisibleContentWhere(auth),
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          contentUuid: "desc",
        },
      },
      take: 5,
    });

    const contents = await prisma.content.findMany({
      where: {
        uuid: {
          in: hits.map((hit) => hit.contentUuid),
        },
      },
      select: {
        uuid: true,
        title: true,
        forPosition: true,
      },
    });

    const stats = hits.map((hit) => {
      const content = contents.find((item) => item.uuid === hit.contentUuid);

      return {
        contentUuid: hit.contentUuid,
        title: content?.title ?? "Unknown",
        position: content?.forPosition ?? null,
        hits: hit._count._all,
      };
    });

    return res.status(200).json(stats);
  } catch (e) {
    return sendInternalError(res, "Failed to retrieve content hit stats", e);
  }
});

// Endpoint for user-specific frequently hit content
router.get("/content/hits/top-user", async (req, res) => {
  const auth = getAuth(req);

  try {
    const hits = await prisma.contentHit.groupBy({
      by: ["contentUuid"],
      where: {
        employeeUuid: auth.employeeUuid,
        content: getVisibleContentWhere(auth),
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          contentUuid: "desc",
        },
      },
      take: 5,
    });

    const contents = await prisma.content.findMany({
      where: {
        uuid: {
          in: hits.map((hit) => hit.contentUuid),
        },
      },
      select: {
        uuid: true,
        title: true,
        forPosition: true,
      },
    });

    const stats = hits.map((hit) => {
      const content = contents.find((item) => item.uuid === hit.contentUuid);

      return {
        contentUuid: hit.contentUuid,
        title: content?.title ?? "Unknown",
        position: content?.forPosition ?? null,
        hits: hit._count._all,
      };
    });

    return res.status(200).json(stats);
  } catch (e) {
    return sendInternalError(
      res,
      "Failed to retrieve user content hit stats",
      e,
    );
  }
});

// Endpoint for user-specific role based frequently hit content
router.get("/content/hits/top-position", async (req, res) => {
  const auth = getAuth(req);

  try {
    const hits = await prisma.contentHit.groupBy({
      by: ["contentUuid"],
      where: {
        employee: {
          position: auth.position,
        },
        content: getVisibleContentWhere(auth),
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          contentUuid: "desc",
        },
      },
      take: 5,
    });

    const contents = await prisma.content.findMany({
      where: {
        uuid: {
          in: hits.map((hit) => hit.contentUuid),
        },
      },
      select: {
        uuid: true,
        title: true,
        forPosition: true,
      },
    });

    const stats = hits.map((hit) => {
      const content = contents.find((item) => item.uuid === hit.contentUuid);

      return {
        contentUuid: hit.contentUuid,
        title: content?.title ?? "Unknown",
        position: content?.forPosition ?? null,
        hits: hit._count._all,
      };
    });

    return res.status(200).json(stats);
  } catch (e) {
    return sendInternalError(
      res,
      "Failed to retrieve position content hit stats",
      e,
    );
  }
});

router.get("/content/hits/action", async (req, res) => {
  const auth = getAuth(req);

  try {
    const groupedHits = await prisma.contentHit.groupBy({
      by: ["action"],
      where: {
        content: getVisibleContentWhere(auth),
      },
      _count: {
        _all: true,
      },
    });

    const stats = {
      VIEW: groupedHits.find((hit) => hit.action === "VIEW")?._count._all ?? 0,
      ACCESS:
        groupedHits.find((hit) => hit.action === "ACCESS")?._count._all ?? 0,
      SEARCH:
        groupedHits.find((hit) => hit.action === "SEARCH")?._count._all ?? 0,
    };

    return res.status(200).json(stats);
  } catch (e) {
    return sendInternalError(
      res,
      "Failed to retrieve content hit action stats",
      e,
    );
  }
});

export default router;
