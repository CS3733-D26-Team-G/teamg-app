import type { Position } from "@repo/db";
import { Schemas } from "@repo/zod";
import { z } from "zod";

const SessionSettingsDbSchema =
  Schemas.AccountSettingsCreateManyInputObjectZodSchema.pick({
    darkMode: true,
    tutorialDone: true,
  });

export const SessionSettingsSchema = SessionSettingsDbSchema.transform(
  ({ darkMode, tutorialDone }) => ({
    darkMode: darkMode ?? false,
    tutorialDone: tutorialDone ?? false,
  }),
).default({ darkMode: false, tutorialDone: false });

export type SessionSettings = z.infer<typeof SessionSettingsSchema>;

export const SessionSchema = z.object({
  employeeUuid: z.string(),
  position: Schemas.PositionSchema,
  settings: SessionSettingsSchema,
  permissions: z.object({
    can_manage_employees: z.boolean(),
    can_manage_all_content: z.boolean(),
  }),
});

export type Session = z.infer<typeof SessionSchema>;
