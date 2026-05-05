import type { AccountSettings as DbAccountSettings } from "@repo/db";
import { z } from "zod";

const DEFAULT_ACCOUNT_SETTINGS = {
  darkMode: false,
  tutorialDone: false,
};

export const AccountSettingsSchema = z
  .object({
    darkMode: z.boolean().catch(DEFAULT_ACCOUNT_SETTINGS.darkMode),
    tutorialDone: z.boolean().catch(DEFAULT_ACCOUNT_SETTINGS.tutorialDone),
  })
  .default(DEFAULT_ACCOUNT_SETTINGS);

export const AccountSettingsUpdateSchema = z
  .object({
    darkMode: z.boolean().optional(),
    tutorialDone: z.boolean().optional(),
  })
  .strict();

export type AccountSettings = z.infer<typeof AccountSettingsSchema>;

export function normalizeAccountSettings(
  rawSettings:
    | Pick<DbAccountSettings, "darkMode" | "tutorialDone">
    | null
    | undefined,
): AccountSettings {
  const parsed = AccountSettingsSchema.safeParse(rawSettings ?? undefined);
  if (!parsed.success) {
    return DEFAULT_ACCOUNT_SETTINGS;
  }

  return parsed.data;
}

export function serializeAccountSettingsUpdate(
  settings: Partial<AccountSettings>,
): Record<string, unknown> {
  const parsed = AccountSettingsUpdateSchema.safeParse(settings);
  if (!parsed.success) {
    return {};
  }

  return parsed.data;
}
