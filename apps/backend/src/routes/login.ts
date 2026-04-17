import express from "express";
import { prisma } from "@repo/db";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { isProd, INTERNAL_ERROR_MESSAGE } from "../config.ts";
import { logger } from "../logger.ts";

const router = express.Router();

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

router.post("/", async (req, res) => {
  try {
    const body = LoginSchema.safeParse(req.body);
    if (!body.success) {
      logger.verbose(
        `Failed to parse login request body:\n${body.error.issues}`,
      );
      return res.status(400).json({ message: body.error.issues });
    }

    logger.verbose(
      `Querying Account table for username ${body.data.username} during login`,
    );
    const account = await prisma.account.findUnique({
      where: {
        username: body.data.username,
        password: body.data.password,
      },
      include: {
        settings: {
          where: {
            accountUsername: body.data.username,
          },
        },
      },
    });

    if (!account) {
      logger.warn(
        `Received login request with invalid credentials for username ${body.data.username}`,
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }
    logger.verbose(
      `Queried Account table for username ${body.data.username} during login: record found`,
    );

    const payload = {
      uuid: account.employeeUuid,
      settings: account.settings,
    };
    logger.verbose(`Signing payload:\n${payload}`);
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 1000 * 60 * 60,
      partitioned: isProd,
      path: "/",
    });

    logger.verbose(
      `Querying Employee table for record ${account.employeeUuid} during login`,
    );
    const employee = await prisma.employee.findUnique({
      where: { uuid: account.employeeUuid },
    });

    if (employee == null) {
      logger.error(
        `Failed to query Employee table for record ${account.employeeUuid} during login: record not found for existing account ${account.username}`,
      );
      return res.status(500).json({
        message: INTERNAL_ERROR_MESSAGE,
      });
    }
    logger.verbose(
      `Queried Employee table for record ${account.employeeUuid} during login: record found`,
    );

    return res.status(200).json({
      username: account.username,
      employee_position: employee.position,
    });
  } catch (e) {
    logger.error(`Failed to process login request:\n${e}`);
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

export default router;
