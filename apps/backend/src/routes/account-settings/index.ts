import express from "express";
import { prisma } from "@repo/db";
import {
  AccountSettingsSchema,
  AccountSettingsUpdateSchema,
  normalizeAccountSettings,
  serializeAccountSettingsUpdate,
} from "../../lib/account-settings.ts";
import { getAuth, sendInternalError } from "../../lib/request.ts";
import { logger } from "../../logger.ts";
import { findAccountUsername } from "./utils.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  const auth = getAuth(req);

  try {
    const account = await findAccountUsername(auth.employeeUuid);

    if (!account) {
      logger.warn(
        `Failed to find account while reading settings for employee ${auth.employeeUuid}`,
      );
      return res.status(404).json({ message: "Account not found" });
    }

    const settings = await prisma.accountSettings.findUnique({
      where: { accountUsername: account.username },
    });
    const normalizedSettings = normalizeAccountSettings(settings);

    logger.verbose(
      `Returned account settings for username ${account.username}: dark_mode=${normalizedSettings.darkMode}`,
    );
    return res.status(200).json(normalizedSettings);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to read account settings for employee ${auth.employeeUuid}`,
      e,
    );
  }
});

router.put("/", async (req, res) => {
  const auth = getAuth(req);
  const body = AccountSettingsUpdateSchema.safeParse(req.body);

  if (!body.success) {
    logger.verbose(
      `Failed to parse account settings update request:\n${body.error.issues}`,
    );
    return res.status(400).json({ message: body.error.issues });
  }

  try {
    const account = await findAccountUsername(auth.employeeUuid);

    if (!account) {
      logger.warn(
        `Failed to find account while updating settings for employee ${auth.employeeUuid}`,
      );
      return res.status(404).json({ message: "Account not found" });
    }

    const settings = await prisma.accountSettings.upsert({
      where: { accountUsername: account.username },
      update: serializeAccountSettingsUpdate(body.data),
      create: {
        accountUsername: account.username,
        ...serializeAccountSettingsUpdate(
          AccountSettingsSchema.parse({
            ...normalizeAccountSettings(null),
            ...body.data,
          }),
        ),
      },
    });
    const normalizedSettings = normalizeAccountSettings(settings);

    logger.verbose(
      `Updated account settings for username ${account.username}: dark_mode=${settings.dark_mode}`,
    );
    return res.status(200).json(normalizedSettings);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to update account settings for employee ${auth.employeeUuid}`,
      e,
    );
  }
});

export default router;
