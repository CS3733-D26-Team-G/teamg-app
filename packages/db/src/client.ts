import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

export const isProd = process.env.NODE_ENV === "production";
const vercelTargetEnv = process.env.VERCEL_TARGET_ENV || "N/A";

// The backend runs in serverless environments, so Prisma uses Supabase's pooled
// Postgres connection string with a very small production connection limit.
const connectionString =
  process.env.DATABASE_URL +
  `?pgbouncer=true&connection_limit=${isProd ? "1" : "60"}&pool_timeout=20`;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable must be set!");
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

globalForPrisma.prisma = prisma;
