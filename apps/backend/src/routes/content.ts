import express from "express";
import { prisma, Prisma } from "@repo/db";
import multer from "multer";
import { supabase } from "../lib/supabase.ts";
import { Schemas } from "@repo/zod";
import { randomUUID } from "crypto";
import mime from "mime-types";
import { z } from "zod";
import { logger } from "../logger.ts";
import { STORAGE_BUCKET, INTERNAL_ERROR_MESSAGE } from "../config.ts";

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

function manageContent(
  auth: NonNullable<Express.Request["auth"]>,
  forPosition: z.infer<typeof Schemas.PositionSchema>,
) {
  return auth.position === "ADMIN" || auth.position === forPosition;
}

type empContentLock = {
  contentUuid: string;
  lockedByEmpUuid: string;
  lockedAt: Date;
  lockedByEmp: {
    uuid: string;
    first_name: string;
    last_name: string;
    corporate_email: string;
  };
};

function serializeLock(lock: empContentLock) {
  return {
    content_uuid: lock.contentUuid,
    locked_by_emp_uuid: lock.lockedByEmpUuid,
    locked_at: lock.lockedAt,
    locked_by: {
      uuid: lock.lockedByEmp.uuid,
      first_name: lock.lockedByEmp.first_name,
      last_name: lock.lockedByEmp.last_name,
      corporate_email: lock.lockedByEmp.corporate_email,
    },
  };
}

async function getcurrContent(uuid: string) {
  return prisma.content.findUnique({
    where: { uuid },
  });
}

async function getactiveLock(uuid: string) {
  return prisma.contentEditLock.findUnique({
    where: { contentUuid: uuid },
    include: {
      lockedByEmp: {
        select: {
          uuid: true,
          first_name: true,
          last_name: true,
          corporate_email: true,
        },
      },
    },
  });
}

async function rejectifLocked(
  uuid: string,
  auth: NonNullable<Express.Request["auth"]>,
  res: express.Response,
) {
  const lock = await getactiveLock(uuid);
  if (!lock || lock.lockedByEmpUuid === auth.employeeUuid) {
    return false;
  }
  res.status(409).json({
    message: "Content is currently locked by another user",
    lock: serializeLock(lock as empContentLock),
  });
  return true;
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
    logger.error(
      `Failed to upload file to Supabase Storage for content ${uuid}: ${uploadResult.error?.message}`,
    );
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
    logger.error(
      `Failed to create signed URL for content ${uuid} at path ${uploadResult.data.path}: ${signedUrlResult.error?.message}`,
    );
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
  logger.verbose("Querying Content table for all records");
  try {
    const content = await prisma.content.findMany();
    logger.verbose(
      `Queried Content table for all records: found ${content.length} record(s)`,
    );
    return res.status(200).json(content);
  } catch (e) {
    logger.error(`Failed to query Content table for all records:\n${e}`);
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

router.post("/lock/:uuid", async (req, res) => {
  const params = ParamsSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid content UUID" });
  }
  const uuid = params.data.uuid;
  const auth = req.auth!;
  try {
    const content = await getcurrContent(uuid);
    if (!content) {
      return res.status(400).json({ message: "Invalid content UUID" });
    }
    if (!manageContent(auth, content.for_position)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingLock = await getactiveLock(uuid);

    if (existingLock && existingLock.lockedByEmpUuid !== auth.employeeUuid) {
      return res.status(409).json({
        message: "Content is currently locked by another user",
        lock: serializeLock(existingLock as empContentLock),
      });
    }
    //check if there is no lock yet
    let lock;

    if (!existingLock) {
      lock = await prisma.contentEditLock.create({
        data: {
          contentUuid: uuid,
          lockedByEmpUuid: auth.employeeUuid,
        },
        include: {
          lockedByEmp: {
            select: {
              uuid: true,
              first_name: true,
              last_name: true,
              corporate_email: true,
            },
          },
        },
      });
    } else {
      //update the lock if there is an existing one
      lock = await prisma.contentEditLock.update({
        where: { contentUuid: uuid },
        data: {
          lockedByEmpUuid: auth.employeeUuid, //original emp
          lockedAt: new Date(), //refresh time
        },
        include: {
          lockedByEmp: {
            select: {
              uuid: true,
              first_name: true,
              last_name: true,
              corporate_email: true,
            },
          },
        },
      });
    }
    return res.status(200).json({
      locked: true,
      lock: serializeLock(lock as empContentLock),
    });
  } catch {
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});
//deleting lock row if curr user owns lowk/ is admin
router.delete("/lock/:uuid", async (req, res) => {
  const params = ParamsSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "invalid content uuid" });
  }
  const uuid = params.data.uuid;
  const auth = req.auth!;
  try {
    const content = await getcurrContent(uuid);
    if (!content) {
      return res.status(400).json({ message: "Invalid content UUID" });
    }
    if (!manageContent(auth, content.for_position)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const existingLock = await getactiveLock(uuid);
    if (!existingLock) {
      return res.status(200).json({
        locked: false,
        lock: null,
      });
    }
    if (
      existingLock.lockedByEmpUuid !== auth.employeeUuid &&
      auth.position !== "ADMIN"
    ) {
      return res.status(403).json({
        message: "Only the lock owner or admin can unlock this content",
        lock: serializeLock(existingLock as empContentLock),
      });
    }
    await prisma.contentEditLock.delete({
      where: { contentUuid: uuid },
    });
    return res.status(200).json({
      locked: false,
      lock: null,
    });
  } catch {
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

router.post("/create", upload.single("file"), async (req, res) => {
  const auth = req.auth!;
  const parsed = CreateContentSchema.safeParse(req.body);

  if (!parsed.success) {
    logger.verbose(
      `Failed to parse Content create request body:\n${parsed.error.issues}`,
    );
    return res.status(400).json({ message: parsed.error.issues });
  }

  const input = parsed.data;

  if ((!input.url && !req.file) || (input.url && req.file)) {
    logger.warn(
      `Received invalid Content create request: exactly one of url or file must be provided`,
    );
    return res.status(400).json({
      message: "Either one of URL or file must be specified!",
    });
  }

  if (auth.position !== "ADMIN" && auth.position !== input.for_position) {
    logger.warn(
      `Rejected Content create request for position ${input.for_position} from user with position ${auth.position}`,
    );
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

  logger.verbose(`Inserting Content table record ${uuid}`);
  try {
    const content = await prisma.content.create({ data });
    logger.verbose(`Inserted Content table record ${uuid}`);
    return res.status(201).json(content);
  } catch (e) {
    logger.error(`Failed to insert Content table record ${uuid}:\n${e}`);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
    }
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

router.put("/edit/:uuid", upload.single("file"), async (req, res) => {
  const params = ParamsSchema.safeParse(req.params);
  if (!params.success) {
    logger.warn(
      `Received Content edit request with invalid UUID: ${req.params.uuid}`,
    );
    return res.status(400).json({ message: "Invalid content UUID" });
  }

  const uuid = params.data.uuid;
  const auth = req.auth!;

  logger.verbose(`Querying Content table for record ${uuid}`);
  const existingContent = await prisma.content.findUnique({ where: { uuid } });
  if (!existingContent) {
    logger.warn(
      `Received edit request for Content table record ${uuid} that does not exist`,
    );
    return res.status(400).json({ message: "Invalid content UUID" });
  }
  logger.verbose(`Queried Content table for record ${uuid}: record found`);

  const parsed = UpdateContentSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.verbose(
      `Failed to parse Content edit request body for record ${uuid}:\n${parsed.error.issues}`,
    );
    return res.status(400).json({ message: parsed.error.issues });
  }

  const input = parsed.data;

  const targetPosition = input.for_position ?? existingContent.for_position;
  if (auth.position !== "ADMIN" && auth.position !== targetPosition) {
    logger.warn(
      `Rejected Content edit request for record ${uuid}: target position ${targetPosition}, user position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (await rejectifLocked(uuid, auth, res)) {
    return;
  }
  const expirationTime =
    input.expiration_time instanceof Date ?
      input.expiration_time
    : existingContent.expiration_time;

  if (req.file && existingContent.supabasePath) {
    const deleteResult = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([existingContent.supabasePath]);

    if (!deleteResult.data) {
      logger.verbose(
        `Failed to delete existing Supabase object for Content table record ${uuid} at path ${existingContent.supabasePath}: ${deleteResult.error?.message}`,
      );
    } else {
      logger.verbose(
        `Deleted existing Supabase object for Content table record ${uuid} at path ${existingContent.supabasePath}`,
      );
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

  logger.verbose(`Updating Content table record ${uuid}`);
  try {
    const updatedContent = await prisma.content.update({
      where: { uuid },
      data,
    });
    logger.verbose(`Updated Content table record ${uuid}`);
    return res.status(200).json(updatedContent);
  } catch (e) {
    logger.error(`Failed to update Content table record ${uuid}:\n${e}`);
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

router.post("/delete/:uuid", async (req, res) => {
  const params = ParamsSchema.safeParse(req.params);
  if (!params.success) {
    logger.warn(
      `Received Content delete request with invalid UUID: ${req.params.uuid}`,
    );
    return res.status(400).json({
      message: "Invalid content UUID",
    });
  }

  const uuid = params.data.uuid;
  const auth = req.auth!;

  try {
    logger.verbose(`Querying Content table for record ${uuid} before delete`);
    const content = await prisma.content.findUnique({
      where: { uuid },
    });

    if (!content) {
      logger.warn(
        `Received delete request for Content table record ${uuid} that does not exist`,
      );
      return res.status(400).json({ message: "Invalid content UUID" });
    }
    logger.verbose(
      `Queried Content table for record ${uuid} before delete: record found`,
    );

    if (auth.position !== "ADMIN" && auth.position !== content.for_position) {
      logger.warn(
        `Rejected Content delete request for record ${uuid}: target position ${content.for_position}, user position ${auth.position}`,
      );
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (await rejectifLocked(uuid, auth, res)) {
      return;
    }
    logger.verbose(`Deleting Content table record ${uuid}`);
    await prisma.$transaction(async (tx) => {
      await tx.contentEditLock.deleteMany({
        where: { contentUuid: uuid },
      });
      await tx.content.delete({ where: { uuid } });
    });
    logger.verbose(`Deleted Content table record ${uuid}`);

    return res.status(200).json(content);
  } catch (e) {
    logger.error(`Failed to delete Content table record ${uuid}:\n${e}`);
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

router.patch("/favorite/:uuid", async (req, res) => {
  const params = ParamsSchema.safeParse(req.params);
  if (!params.success) {
    logger.warn(
      `Received Content favorite request with invalid UUID: ${req.params.uuid}`,
    );
    return res.status(400).json({ message: "Invalid content UUID" });
  }

  const uuid = params.data.uuid;

  try {
    logger.verbose(
      `Querying Content table for record ${uuid} before favorite toggle`,
    );
    const currentContent = await prisma.content.findUnique({
      where: { uuid },
    });

    if (!currentContent) {
      logger.warn(
        `Received favorite request for Content table record ${uuid} that does not exist`,
      );
      return res.status(400).json({ message: "Invalid content UUID" });
    }
    logger.verbose(
      `Queried Content table for record ${uuid} before favorite toggle: record found`,
    );

    const nextFavoriteValue = !currentContent.is_favorite;
    logger.verbose(
      `Updating Content table record ${uuid}: setting is_favorite to ${nextFavoriteValue}`,
    );

    const updatedContent = await prisma.content.update({
      where: { uuid },
      data: {
        is_favorite: nextFavoriteValue,
      },
    });

    logger.verbose(
      `Updated Content table record ${uuid}: is_favorite is now ${updatedContent.is_favorite}`,
    );

    return res.status(200).json(updatedContent);
  } catch (e) {
    logger.error(
      `Failed to update Content table record ${uuid} favorite status:\n${e}`,
    );
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

export default router;
