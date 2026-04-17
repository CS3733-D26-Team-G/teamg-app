import type { AccountSettings as DbAccountSettings } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";

const AccountSettingsDbSchema =
  Schemas.AccountSettingsCreateManyInputObjectZodSchema.pick({
    dark_mode: true,
  });

export const AccountSettingsSchema = z
  .preprocess((value) => {
    if (value && typeof value === "object") {
      const input = value as Record<string, unknown>;
      return {
        dark_mode: input.darkMode,
      };
    }

    return value;
  }, AccountSettingsDbSchema)
  .transform(({ dark_mode }) => ({
    darkMode: dark_mode,
  }))
  .default({ darkMode: false });

export const AccountSettingsUpdateSchema = z
  .preprocess((value) => {
    if (value && typeof value === "object") {
      const input = value as Record<string, unknown>;
      return {
        dark_mode: input.darkMode,
      };
    }

    return value;
  }, AccountSettingsDbSchema.partial())
  .transform((settings) => ({
    darkMode: settings.dark_mode,
  }));

export type AccountSettings = z.infer<typeof AccountSettingsSchema>;

export function normalizeAccountSettings(
  rawSettings: Pick<DbAccountSettings, "dark_mode"> | null | undefined,
): AccountSettings {
  const parsed = AccountSettingsSchema.safeParse({
    darkMode: rawSettings?.dark_mode,
  });
  if (!parsed.success) {
    return { darkMode: false };
  }

  return parsed.data;
}

export function serializeAccountSettingsUpdate(
  settings: Partial<AccountSettings>,
): Record<string, unknown> {
  const parsed = AccountSettingsUpdateSchema.safeParse(settings);
  if (!parsed.success || parsed.data.darkMode === undefined) {
    return {};
  }

  return {
    dark_mode: parsed.data.darkMode,
  };
}
