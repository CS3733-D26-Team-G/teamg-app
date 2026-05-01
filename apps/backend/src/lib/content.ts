import { Prisma } from "@repo/db";
import { isAdmin } from "./request.ts";

export function getVisibleContentWhere(
  auth: NonNullable<Express.Request["auth"]>,
): Prisma.ContentWhereInput | undefined {
  if (isAdmin(auth)) {
    return undefined;
  }
}
