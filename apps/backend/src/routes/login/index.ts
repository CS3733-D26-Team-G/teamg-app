import express from "express";
import { prisma } from "@repo/db";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { INTERNAL_ERROR_MESSAGE } from "../../config.ts";
import {
  AUTH_COOKIE_NAME,
  authCookieOptionsWithExpiration,
} from "../../lib/request.ts";
import { logger } from "../../logger.ts";
import {
  hashPassword,
  isLegacyPlaintextPassword,
  verifyPassword,
} from "../../lib/password.ts";

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
      },
      include: { settings: true },
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

    const passwordMatches = verifyPassword(
      body.data.password,
      account.password,
    );

    if (!passwordMatches) {
      logger.warn(
        `Received login request with invalid credentials for username ${body.data.username}`,
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (isLegacyPlaintextPassword(account.password)) {
      try {
        await prisma.account.update({
          where: { username: account.username },
          data: {
            password: hashPassword(body.data.password),
          },
        });
        logger.info(
          `Upgraded stored password hash for username ${account.username}`,
        );
      } catch (e) {
        logger.error(
          `Failed to upgrade stored password hash for username ${account.username}:\n${e}`,
        );
      }
    }

    const payload = {
      uuid: account.employeeUuid,
      settings: account.settings,
    };
    logger.verbose(`Signing payload:\n${payload}`);
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.cookie(AUTH_COOKIE_NAME, token, authCookieOptionsWithExpiration);

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

    await prisma.activity.create({
      data: {
        employeeUuid: employee.uuid,
        action: "LOG_IN",
      },
    });

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
