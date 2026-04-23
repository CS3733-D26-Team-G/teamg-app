import type { Response, RequestHandler, Request } from "express";
import { isProd, INTERNAL_ERROR_MESSAGE } from "../config.ts";
import { logger } from "../logger.ts";

export const AUTH_COOKIE_NAME = "token";

export const authCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
  path: "/",
};

export const authCookieOptionsWithExpiration = {
  ...authCookieOptions,
  maxAge: 1000 * 60 * 60,
  partitioned: isProd,
};

export function getAuth(req: Request) {
  return req.auth!;
}

export function canManagePosition(
  auth: NonNullable<Express.Request["auth"]>,
  position: NonNullable<Express.Request["auth"]>["position"],
) {
  return auth.position === "ADMIN" || auth.position === position;
}

export function isAdmin(auth: NonNullable<Express.Request["auth"]>): boolean {
  return auth.position === "ADMIN";
}

export function requireAdmin(logContext = "admin-only"): RequestHandler {
  return (req, res, next) => {
    const auth = getAuth(req);
    if (!isAdmin(auth)) {
      logger.warn(
        `Rejected ${logContext} request from user with position ${auth.position}`,
      );
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  };
}

export function sendInternalError(
  res: Response,
  message: string,
  error: unknown,
) {
  logger.error(`${message}:\n${error}`);
  return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
}
