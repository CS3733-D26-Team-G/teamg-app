import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
const adapter = new PrismaPg({
    connectionString: process.env.SUPABASE_URL
});
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
globalForPrisma.prisma = prisma;
