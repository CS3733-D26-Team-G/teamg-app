import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

// this code gets imported from backend, so the env variable must be SUPABASE_URL, not DATABASE_URL
// don't ask me how to fix this or why. it works so im not gonna touch it
const connectionString = process.env.SUPABASE_URL;
if (!connectionString) {
  throw new Error("SUPABASE_URL environment variable must be set!");
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

globalForPrisma.prisma = prisma;