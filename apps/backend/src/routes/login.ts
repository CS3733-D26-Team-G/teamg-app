import express from "express";
import { prisma } from "@repo/db";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { isProd, INTERNAL_ERROR_MESSAGE } from "../config.ts";
import { logger } from "../logger.ts";

const router = express.Router();

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const PASSWORD_HASH_PREFIX = "scrypt";
const SCRYPT_KEY_LENGTH = 64;

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString(
    "hex",
  );
  return `${PASSWORD_HASH_PREFIX}$${salt}$${derivedKey}`;
}

function verifyPassword(password: string, storedPassword: string) {
  const parts = storedPassword.split("$");
  if (parts.length !== 3 || parts[0] !== PASSWORD_HASH_PREFIX) {
    const providedBuffer = Buffer.from(password, "utf8");
    const storedBuffer = Buffer.from(storedPassword, "utf8");
    return (
      providedBuffer.length === storedBuffer.length &&
      timingSafeEqual(providedBuffer, storedBuffer)
    );
  }

  const [, salt, expectedKey] = parts;
  const derivedKey = scryptSync(password, salt, SCRYPT_KEY_LENGTH);
  const expectedBuffer = Buffer.from(expectedKey, "hex");
  return (
    derivedKey.length === expectedBuffer.length &&
    timingSafeEqual(derivedKey, expectedBuffer)
  );
}

function isLegacyPlaintextPassword(storedPassword: string) {
  const parts = storedPassword.split("$");
  return parts.length !== 3 || parts[0] !== PASSWORD_HASH_PREFIX;
}

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

    // Creates a row in the database Activity table for the login action
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
