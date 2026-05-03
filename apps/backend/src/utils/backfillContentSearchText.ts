import "dotenv/config";
import { prisma } from "@repo/db";
import { STORAGE_BUCKET } from "../config.ts";
import { inferSearchTextFromUpload } from "../lib/content-inference.ts";
import { supabase } from "../lib/supabase.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function parseLimit() {
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  if (!limitArg) {
    return undefined;
  }

  const limit = Number(limitArg.split("=")[1]);
  return Number.isInteger(limit) && limit > 0 ? limit : undefined;
}

async function main() {
  const force = process.argv.includes("--force");
  const limit = parseLimit();

  const content = await prisma.content.findMany({
    where: {
      supabasePath: { not: null },
      ...(force ? {} : { searchText: null }),
    },
    select: {
      uuid: true,
      title: true,
      supabasePath: true,
      fileType: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: limit,
  });

  console.log(
    `Backfilling search_text for ${content.length} Supabase-backed content record(s)${force ? " with --force" : ""}.`,
  );

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of content) {
    if (!item.supabasePath) {
      skipped += 1;
      continue;
    }

    try {
      const downloadResult = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(item.supabasePath);

      if (!downloadResult.data) {
        failed += 1;
        console.error(
          `Failed to download ${item.uuid} (${item.supabasePath}): ${downloadResult.error?.message ?? "unknown error"}`,
        );
        continue;
      }

      const buffer = Buffer.from(await downloadResult.data.arrayBuffer());
      const searchText = await inferSearchTextFromUpload({
        buffer,
        mimetype: item.fileType ?? "application/octet-stream",
        originalname: item.title,
      });

      if (!searchText) {
        skipped += 1;
        console.log(`Skipped ${item.uuid}: no searchable text produced`);
        continue;
      }

      await prisma.content.update({
        where: { uuid: item.uuid },
        data: { searchText },
      });

      updated += 1;
      console.log(`Updated ${item.uuid}: ${item.title}`);
      await sleep(2000);
    } catch (error) {
      failed += 1;
      console.error(`Failed to backfill ${item.uuid}:`, error);
    }
  }

  console.log(
    `Backfill complete. Updated: ${updated}. Skipped: ${skipped}. Failed: ${failed}.`,
  );
}

main()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
