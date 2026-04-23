import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "@repo/db";
import type { Employee } from "@repo/db";
import { authExclude } from "../config.ts";
import { AUTH_COOKIE_NAME } from "../lib/request.ts";
import { logger } from "../logger.ts";

export type Auth = {
  employeeUuid: Employee["uuid"];
  position: Employee["position"];
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (authExclude.includes(req.path)) {
    logger.verbose(`Skipping authentication for excluded path ${req.path}`);
    return next();
  }

  const token = req.cookies[AUTH_COOKIE_NAME];

  if (!token) {
    logger.verbose(
      `Received request from ${req.hostname} without token cookie`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    logger.verbose(`Verifying JWT for request from ${req.hostname}`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string") {
      logger.error(`Failed to verify token with JWT: ${decoded}`);
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
    logger.verbose(`Verified JWT for employee ${decoded.uuid}`);

    logger.verbose(
      `Querying Employee table for record ${decoded.uuid} during authentication`,
    );
    const employee = await prisma.employee.findUnique({
      select: { position: true },
      where: { uuid: decoded.uuid },
    });

    if (!employee) {
      logger.error(
        `Failed to query Employee table for record ${decoded.uuid} during authentication: record not found`,
      );
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }
    logger.verbose(
      `Queried Employee table for record ${decoded.uuid} during authentication: record found`,
    );

    req.auth = { employeeUuid: decoded.uuid, position: employee.position };

    logger.verbose(
      `Authenticated request for employee ${decoded.uuid} with position ${employee.position}`,
    );

    next();
  } catch (e) {
    logger.error(`Authentication failed:\n${e}`);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
