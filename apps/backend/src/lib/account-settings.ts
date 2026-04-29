import type { AccountSettings as DbAccountSettings } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";

const AccountSettingsDbSchema =
  Schemas.AccountSettingsCreateManyInputObjectZodSchema.pick({
    darkMode: true,
  });

export const AccountSettingsSchema = AccountSettingsDbSchema.transform(
  ({ darkMode }) => ({
    darkMode,
  }),
).default({ darkMode: false });

export const AccountSettingsUpdateSchema = AccountSettingsDbSchema.partial();

export type AccountSettings = z.infer<typeof AccountSettingsSchema>;

export function normalizeAccountSettings(
  rawSettings: Pick<DbAccountSettings, "darkMode"> | null | undefined,
): AccountSettings {
  const parsed = AccountSettingsSchema.safeParse(rawSettings ?? undefined);
  if (!parsed.success) {
    return { darkMode: false };
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
