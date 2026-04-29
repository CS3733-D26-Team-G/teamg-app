import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import mime from "mime-types";
import { prisma, Position, ContentType, ContentStatus } from "@repo/db";
import { supabase } from "../lib/supabase.ts";
import { STORAGE_BUCKET } from "../config.ts";

const FOLDER_PATH =
  "/Users/justingauthier/WebstormProjects/teamg-app/apps/backend/src/samples";

const position: Position = Position.BUSINESS_OP_RATING;

const EXPIRATION_TIME = new Date("2026-06-14T00:00:00Z");

const employeesByPosition: Record<string, string[]> = {
  UNDERWRITER: ["Emily Brown", "Brian Lee", "Grace Ho", "Owen Carter"],
  BUSINESS_ANALYST: ["Carlas Martinez", "Alice Johnson", "Devin Nguyen"],
  ADMIN: [
    "Ethan Brooks",
    "Chloe Bennett",
    "Maya Thompson",
    "Ronan Heatley",
    "Wilson Wong",
    "Sam Rodrigues",
    "Myer Cheng",
    "TJ Elysee",
    "Jillian Chee",
    "Isaac Gonzalez",
    "Shriya Kulkarni",
    "Thomas Gilbert",
    "Colin Truong",
    "Justin Gauthier",
    "Adeel Syed",
  ],

  ACTUARIAL_ANALYST: [
    "Liam Parker",
    "Sophia Reed",
    "Noah Foster",
    "Ava Hayes",
    "Mason Bryant",
    "Isabella Price",
    "Ethan Simmons",
    "Mia Coleman",
    "Lucas Jenkins",
    "Charlotte Perry",
  ],

  EXL_OPERATIONS: [
    "Benjamin Watson",
    "Amelia Brooks",
    "Henry Long",
    "Harper Ross",
    "Alexander Gray",
    "Evelyn James",
    "Michael Bennett",
    "Abigail Turner",
    "Daniel Howard",
    "Ella Ward",
  ],

  BUSINESS_OP_RATING: [
    "Jack Morris",
    "Scarlett Murphy",
    "Sebastian Peterson",
    "Grace Ramirez",
    "Owen Collins",
    "Lily Stewart",
    "Matthew Sanchez",
    "Zoey Diaz",
    "David Hughes",
    "Nora Myers",
  ],
};

// Helper: pick random owner based on position
function getRandomOwner(position: Position): string {
  const pool = employeesByPosition[position];
  if (!pool || pool.length === 0) {
    throw new Error(`No employees for position ${position}`);
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

// Helper: upload file (mirrors backend)
async function uploadToSupabase(filePath: string, uuid: string) {
  const buffer = fs.readFileSync(filePath);
  const mimetype = mime.lookup(filePath) || "application/octet-stream";
  const extension = mime.extension(mimetype) || "bin";

  const storagePath = `content/${uuid}.${extension}`;

  const uploadResult = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimetype,
      upsert: false,
    });

  if (!uploadResult.data) {
    throw new Error(uploadResult.error?.message || "Upload failed");
  }

  const expiresIn = Math.floor((EXPIRATION_TIME.getTime() - Date.now()) / 1000);

  const signedUrlResult = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (!signedUrlResult.data) {
    throw new Error(signedUrlResult.error?.message || "Signed URL failed");
  }

  return {
    url: signedUrlResult.data.signedUrl,
    supabasePath: storagePath,
    mimetype,
  };
}

// 🔥 MAIN
async function main() {
  const files = fs.readdirSync(FOLDER_PATH);

  for (const file of files) {
    const fullPath = path.join(FOLDER_PATH, file);

    if (!fs.statSync(fullPath).isFile()) continue;

    // 🔧 Assign position (simple rotation or customize)
    const positions = [
      Position.UNDERWRITER,
      Position.BUSINESS_ANALYST,
      Position.ADMIN,
      Position.ACTUARIAL_ANALYST,
      Position.BUSINESS_OP_RATING,
    ];
    // const position = positions[Math.floor(Math.random() * positions.length)];

    const uuid = randomUUID();

    try {
      const { url, supabasePath, mimetype } = await uploadToSupabase(
        fullPath,
        uuid,
      );

      const title = path.parse(file).name;

      const statusValues = Object.values(ContentStatus);
      const status =
        statusValues[Math.floor(Math.random() * statusValues.length)];

      await prisma.content.create({
        data: {
          uuid,
          title,
          url,
          supabasePath,
          fileType: mimetype,
          expirationTime: EXPIRATION_TIME,
          lastModifiedTime: new Date(),
          contentType:
            Math.round(Math.random()) == 0 ?
              ContentType.REFERENCE
            : ContentType.WORKFLOW,
          forPosition: position,
          contentOwner: getRandomOwner(position),
          status,
        },
      });

      console.log(`✅ Uploaded + inserted: ${file}`);
    } catch (err) {
      console.error(`❌ Failed: ${file}`, err);
    }
  }

  console.log("🎉 Done");
}

main().then(() => process.exit());
