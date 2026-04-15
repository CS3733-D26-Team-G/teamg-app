import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "@repo/db";
import type { Position } from "@repo/db";
import { Prisma } from "@repo/db";
import { authExclude } from "../config.ts";

export interface Auth {
  employeeUuid: string;
  position: Position;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (authExclude.includes(req.path)) {
    return next();
  }
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  if (typeof decoded === "string") {
    return res.status(401).json({
      message:
        "Unauthorized. If you see this message, please report to a system administrator.",
    });
  }

  try {
    const employee = await prisma.employee.findUniqueOrThrow({
      select: { position: true },
      where: { uuid: decoded.uuid },
    });
    req.auth = { employeeUuid: decoded.uuid, position: employee.position };
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return res.status(401).json({
        message:
          "Unauthorized. If you see this message, please report to a system administrator.",
      });
    }
  }
  next();
};
