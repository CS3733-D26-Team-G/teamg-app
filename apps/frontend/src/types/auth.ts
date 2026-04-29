import type { Position } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";

const SessionSettingsDbSchema =
  Schemas.AccountSettingsCreateManyInputObjectZodSchema.pick({
    dark_mode: true,
  });

export const SessionSettingsSchema = z
  .preprocess((value) => {
    if (value && typeof value === "object") {
      const input = value as Record<string, unknown>;
      return {
        dark_mode: input.darkMode,
      };
    }

    return value;
  }, SessionSettingsDbSchema)
  .transform(({ dark_mode }) => ({
    darkMode: dark_mode ?? false,
  }))
  .default({ darkMode: false });

export type SessionSettings = z.infer<typeof SessionSettingsSchema>;

export const SessionSchema = z.object({
  employeeUuid: z.string(),
  position: Schemas.PositionSchema,
  settings: SessionSettingsSchema,
  permissions: z.object({
    canManageEmployees: z.boolean(),
    canManageAllContent: z.boolean(),
  }),
});

export type Session = z.infer<typeof SessionSchema>;
