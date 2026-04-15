import express from "express";
import { prisma, Prisma } from "@repo/db";
import multer from "multer";
import { supabase } from "../lib/supabase.ts";
import { Schemas } from "@repo/zod";
import { randomUUID } from "crypto";
import mime from "mime-types";
import { z } from "zod";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 1,
  },
});

const ParamsSchema = z.object({
  uuid: z.uuid(),
});

const STORAGE_BUCKET = "teamg-app";
const INTERNAL_ERROR_MESSAGE =
  "Internal server error. If you see this message, please report to a system administrator";

const CreateContentSchema = Schemas.ContentCreateInputObjectZodSchema.extend({
  url: z.string().optional(),
});

const UpdateContentSchema = Schemas.ContentUpdateInputObjectZodSchema.omit({
  uuid: true,
})
  .partial()
  .extend({
    url: z.string().optional(),
  });

type UploadResult =
  | { ok: true; url: string; supabasePath?: string }
  | { ok: false; status: number; message: string };

function getExpiresInSeconds(expirationTime: Date): number {
  return Math.floor((expirationTime.getTime() - Date.now()) / 1000);
}

async function resolveContentUrl({
  file,
  uuid,
  expirationTime,
  providedUrl,
  fallbackUrl,
  upsert,
}: {
  file?: Express.Multer.File;
  uuid: string;
  expirationTime: Date;
  providedUrl?: string | null;
  fallbackUrl?: string | null;
  upsert: boolean;
}): Promise<UploadResult> {
  if (!file) {
    const url = providedUrl ?? fallbackUrl;
    if (!url) {
      return {
        ok: false,
        status: 500,
        message: INTERNAL_ERROR_MESSAGE,
      };
    }

    return { ok: true, url };
  }

  const expiresIn = getExpiresInSeconds(expirationTime);
  if (expiresIn < 0) {
    return {
      ok: false,
      status: 400,
      message: "Expiration time must be in the future!",
    };
  }

  const uploadResult = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(`content/${uuid}.${mime.extension(file.mimetype)}`, file.buffer, {
      contentType: file.mimetype,
      upsert,
    });

  if (!uploadResult.data) {
    console.error(uploadResult.error);
    return {
      ok: false,
      status: 500,
      message: uploadResult.error?.message ?? INTERNAL_ERROR_MESSAGE,
    };
  }

  const signedUrlResult = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(uploadResult.data.path, expiresIn);

  if (!signedUrlResult.data) {
    console.error(signedUrlResult.error);
    return {
      ok: false,
      status: 500,
      message: signedUrlResult.error?.message ?? INTERNAL_ERROR_MESSAGE,
    };
  }

  return {
    ok: true,
    url: signedUrlResult.data.signedUrl,
    supabasePath: uploadResult.data.path,
  };
}

router.get("/", async (_req, res) => {
  res.status(200).json(await prisma.content.findMany());
});

router.post("/create", upload.single("file"), async (req, res) => {
  const auth = req.auth!;
  const parsed = CreateContentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues });
  }

  const input = parsed.data;

  if ((!input.url && !req.file) || (input.url && req.file)) {
    return res.status(400).json({
      message: "Either one of URL or file must be specified!",
    });
  }

  if (auth.position !== "ADMIN" && auth.position !== input.for_position) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const uuid = randomUUID();

  const urlResult = await resolveContentUrl({
    file: req.file ?? undefined,
    uuid,
    expirationTime: input.expiration_time,
    providedUrl: input.url,
    upsert: false,
  });

  if (!urlResult.ok) {
    return res.status(urlResult.status).json({ message: urlResult.message });
  }

  const data = {
    ...input,
    uuid,
    url: urlResult.url,
    supabasePath: urlResult.supabasePath,
  };

  console.log(data);
  try {
    const content = await prisma.content.create({ data });
    return res.status(201).json(content);
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
    }
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

router.put("/edit/:uuid", upload.single("file"), async (req, res) => {
  const params = ParamsSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid content UUID" });
  }

  const uuid = params.data.uuid;
  const auth = req.auth!;

  const existingContent = await prisma.content.findUnique({ where: { uuid } });
  if (!existingContent) {
    return res.status(400).json({ message: "Invalid content UUID" });
  }

  const parsed = UpdateContentSchema.safeParse(req.body);
  if (!parsed.success) {
    console.log(parsed.error.issues);
    return res.status(400).json({ message: parsed.error.issues });
  }

  const input = parsed.data;

  const targetPosition = input.for_position ?? existingContent.for_position;
  if (auth.position !== "ADMIN" && auth.position !== targetPosition) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const expirationTime =
    input.expiration_time instanceof Date ?
      input.expiration_time
    : existingContent.expiration_time;

  if (req.file && existingContent.supabasePath) {
    const deleteResult = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([existingContent.supabasePath]);
    console.log(deleteResult.data);
    if (!deleteResult.data) {
      console.error(deleteResult.error.message);
    }
  }

  const urlResult = await resolveContentUrl({
    file: req.file ?? undefined,
    uuid,
    expirationTime,
    providedUrl: input.url,
    fallbackUrl: existingContent.url,
    upsert: true,
  });

  if (!urlResult.ok) {
    return res.status(urlResult.status).json({ message: urlResult.message });
  }

  const data = {
    ...input,
    url: urlResult.url,
  };

  try {
    const updatedContent = await prisma.content.update({
      where: { uuid },
      data,
    });
    return res.status(200).json(updatedContent);
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
    }
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

router.post("/delete/:uuid", async (req, res) => {
  const params = ParamsSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({
      message: "Invalid content UUID",
    });
  }
  const uuid = params.data.uuid;
  const auth = req.auth!;

  try {
    const content = await prisma.content.findUniqueOrThrow({
      where: { uuid },
    });
    if (auth.position !== "ADMIN" && auth.position !== content.for_position) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await prisma.content.delete({ where: content });

    return res.status(200).json(content);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return res.status(400).json({
        message: "Invalid content UUID",
      });
    }
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

router.patch("/favorite/:uuid", async (req, res) => {
  const uuid = req.params.uuid;

  try {
    const currentContent = await prisma.content.findUniqueOrThrow({
      where: { uuid: uuid },
    });

    const updatedContent = await prisma.content.update({
      where: { uuid: uuid },
      data: {
        is_favorite: !currentContent.is_favorite,
      },
    });

    return res.status(200).json(updatedContent);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return res.status(400).json({ message: "Invalid content UUID" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});

export default router;
