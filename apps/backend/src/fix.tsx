import { prisma } from "@repo/db";

await prisma.$executeRawUnsafe(
  `UPDATE "Content" SET for_position = 'EXL_OPS' WHERE for_position = 'EXL_OPERATIONS'`,
);
await prisma.$executeRawUnsafe(
  `UPDATE "Employee" SET position = 'EXL_OPS' WHERE position = 'EXL_OPERATIONS'`,
);

console.log("Done");
await prisma.$disconnect();
