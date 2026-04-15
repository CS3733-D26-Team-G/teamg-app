import { createClient } from "@supabase/supabase-js";
import { logger } from "../logger.ts";
// Create a single supabase client for interacting with your file storage

if (!process.env.SUPABASE_URL) {
  logger.error("Environment variable SUPABASE_URL is undefined");
  throw new Error("Environment variable SUPABASE_URL is undefined");
}

if (!process.env.SUPABASE_SECRET_KEY) {
  logger.error("Environment variable SUPABASE_SECRET_KEY is undefined");
  throw new Error("Environment variable SUPABASE_SECRET_KEY is undefined");
}

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);
