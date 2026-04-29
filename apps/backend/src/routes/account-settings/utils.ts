import { prisma } from "@repo/db";
import { logger } from "../../logger.ts";

export async function findAccountUsername(employeeUuid: string) {
  logger.verbose(
    `Querying Account table for employee ${employeeUuid} account settings`,
  );

  return prisma.account.findUnique({
    where: { employeeUuid },
    select: { username: true },
  });
}
