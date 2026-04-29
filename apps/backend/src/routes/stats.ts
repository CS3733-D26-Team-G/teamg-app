import express from "express";
import { Position, Prisma, prisma } from "@repo/db";
import {
  getAuth,
  isAdmin,
  //requireAdmin,
  sendInternalError,
} from "../lib/request.ts";
import { logger } from "../logger.ts";

const router = express.Router();

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
        for_position: true,
      },
    });

    const stats = hits.map((hit) => {
      const content = contents.find((c) => c.uuid === hit.contentUuid);

      return {
        contentUuid: hit.contentUuid,
        title: content?.title ?? "Unknown",
        position: content?.for_position ?? null,
        hits: hit._count._all,
      };
    });

    return res.status(200).json(stats);
  } catch (e) {
    return sendInternalError(res, "Failed to retrieve content hit stats", e);
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
