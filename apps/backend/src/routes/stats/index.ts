import express from "express";
import { Position, prisma } from "@repo/db";
import { getVisibleContentWhere } from "../../lib/content.ts";
import {
  getAuth,
  //requireAdmin,
  sendInternalError,
} from "../../lib/request.ts";
import { logger } from "../../logger.ts";

const router = express.Router();

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

export default router;
