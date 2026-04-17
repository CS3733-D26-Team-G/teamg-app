import { z } from "zod";

const accountSettingsFieldMap = {
  darkMode: "dark_mode",
} as const;

export const AccountSettingsSchema = z.object({
  darkMode: z.boolean().default(false),
});

export const AccountSettingsUpdateSchema = AccountSettingsSchema.partial();

export type AccountSettings = z.infer<typeof AccountSettingsSchema>;

const defaultAccountSettings = AccountSettingsSchema.parse({});

export function normalizeAccountSettings(
  rawSettings: Record<string, unknown> | null | undefined,
): AccountSettings {
  const normalized = Object.fromEntries(
    Object.entries(accountSettingsFieldMap).map(([appKey, dbKey]) => [
      appKey,
      rawSettings?.[dbKey],
    ]),
  );

  const parsed = AccountSettingsSchema.safeParse(normalized);
  if (!parsed.success) {
    return defaultAccountSettings;
  }

  return parsed.data;
}

export function serializeAccountSettingsUpdate(
  settings: Partial<AccountSettings>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(settings).flatMap(([appKey, value]) => {
      const dbKey =
        accountSettingsFieldMap[appKey as keyof typeof accountSettingsFieldMap];

      if (dbKey === undefined || value === undefined) {
        return [];
      }

      return [[dbKey, value]];
    }),
  );
}
