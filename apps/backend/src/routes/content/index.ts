import express from "express";
import { prisma, Prisma } from "@repo/db";
import multer from "multer";
import { randomUUID } from "crypto";
import { logger } from "../../logger.ts";
import { STORAGE_BUCKET, INTERNAL_ERROR_MESSAGE } from "../../config.ts";
import {
  canManagePosition,
  getAuth,
  isAdmin,
  sendInternalError,
} from "../../lib/request.ts";
import { supabase } from "../../lib/supabase.ts";
import {
  CreateContentSchema,
  CreateTagSchema,
  FavoriteContentSchema,
  RegenerateContentLinkSchema,
  UpdateContentSchema,
} from "./schemas.ts";
import {
  createOrRefreshLock,
  findActiveLock,
  findContentByUuid,
  findTagByUuid,
  getVisibleContentWhere,
  loadAccessibleContent,
  normalizeTagName,
  parseContentFilters,
  parseContentUuid,
  parseTagContentUuids,
  parseTagUuid,
  rejectIfLockedByAnotherUser,
  resolveContentUrl,
  resolvePositionValue,
  serializeLock,
  validateProvidedUrl,
  validateTagUuids,
} from "./utils.ts";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 1,
  },
});

router.get("/", async (req, res) => {
  const auth = getAuth(req);
  const gettingContent = auth.position === "ADMIN" ? "all" : auth.position;
  logger.verbose(`Querying Content table for ${gettingContent} records`);

  const parsedFilters = parseContentFilters(req.query);
  if (!parsedFilters.ok) {
    return res.status(400).json({ message: parsedFilters.message });
  }

  const whereClauses = [
    getVisibleContentWhere(auth),
    ...parsedFilters.filters,
  ].filter((clause): clause is Prisma.ContentWhereInput => !!clause);

  try {
    const content = await prisma.content.findMany({
      where:
        whereClauses.length > 0 ?
          {
            AND: whereClauses,
          }
        : undefined,
      include: {
        favoritedBy: {
          where: { employeeUuid: auth.employeeUuid },
          select: { employeeUuid: true },
        },
        tagAssignments: {
          select: {
            tag: {
              select: {
                uuid: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: { favoritedBy: true },
        },
        editLock: {
          include: {
            lockedByEmp: {
              select: {
                uuid: true,
                first_name: true,
                last_name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        last_modified_time: "desc",
      },
    });

    logger.verbose(
      `Queried Content table for ${gettingContent} records: found ${content.length} record(s)`,
    );

    const response = content.map(
      ({ favoritedBy, tagAssignments, _count, ...item }) => ({
        ...item,
        tags: tagAssignments.map(({ tag }) => tag),
        is_favorite: favoritedBy.length > 0,
        favorite_count: _count.favoritedBy,
      }),
    );

    return res.status(200).json(response);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to query Content table for ${gettingContent} records`,
      e,
    );
  }
});

router.post("/lock/:uuid", async (req, res) => {
  const uuid = parseContentUuid(req, res, "Invalid content UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

  try {
    const content = await loadAccessibleContent(uuid, auth, res);
    if (!content) {
      return;
    }

    const existingLock = await findActiveLock(uuid);
    if (
      existingLock &&
      existingLock.lockedByEmpUuid !== auth.employeeUuid &&
      !isAdmin(auth)
    ) {
      return res.status(409).json({
        message: "Content is currently locked by another user",
        lock: serializeLock(existingLock),
      });
    }

    const lock = await createOrRefreshLock(uuid, auth, existingLock);

    await prisma.activity.create({
      data: {
        employeeUuid: auth.employeeUuid,
        action: "CHECK_OUT_CONTENT",
        resource: "CONTENT",
        resourceUuid: uuid,
        resourceName: content.title,
      },
    });

    await prisma.contentHit.create({
      data: {
        contentUuid: uuid,
        employeeUuid: auth.employeeUuid,
        action: "ACCESS",
      },
    });

    return res.status(200).json({
      locked: true,
      lock: serializeLock(lock),
    });
  } catch (e) {
    return sendInternalError(res, `Failed to lock content ${uuid}`, e);
  }
});

router.delete("/lock/:uuid", async (req, res) => {
  const uuid = parseContentUuid(req, res, "invalid content uuid");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

  try {
    const content = await loadAccessibleContent(uuid, auth, res);
    if (!content) {
      return;
    }

    const existingLock = await findActiveLock(uuid);
    if (!existingLock) {
      return res.status(200).json({
        locked: false,
        lock: null,
      });
    }

    if (existingLock.lockedByEmpUuid !== auth.employeeUuid && !isAdmin(auth)) {
      return res.status(403).json({
        message: "Only the lock owner or admin can unlock this content",
        lock: serializeLock(existingLock),
      });
    }

    await prisma.contentEditLock.delete({
      where: { contentUuid: uuid },
    });

    await prisma.activity.create({
      data: {
        employeeUuid: auth.employeeUuid,
        action: "CHECK_IN_CONTENT",
        resource: "CONTENT",
        resourceUuid: uuid,
        resourceName: content.title,
      },
    });

    return res.status(200).json({
      locked: false,
      lock: null,
    });
  } catch (e) {
    return sendInternalError(res, `Failed to unlock content ${uuid}`, e);
  }
});

router.post("/create", upload.single("file"), async (req, res) => {
  const auth = getAuth(req);
  const parsed = CreateContentSchema.safeParse(req.body);

  if (!parsed.success) {
    logger.verbose(
      `Failed to parse Content create request body:\n${parsed.error.issues}`,
    );
    return res.status(400).json({ message: parsed.error.issues });
  }

  const { tagUuids, ...input } = parsed.data;
  const validatedUrl = validateProvidedUrl(input.url);
  if (!validatedUrl.ok) {
    logger.warn(`Rejected Content create request with invalid URL`);
    return res.status(400).json({ message: validatedUrl.message });
  }

  if ((!input.url && !req.file) || (input.url && req.file)) {
    logger.warn(
      `Received invalid Content create request: exactly one of url or file must be provided`,
    );
    return res.status(400).json({
      message: "Either one of URL or file must be specified!",
    });
  }

  if (!canManagePosition(auth, input.for_position)) {
    logger.warn(
      `Rejected Content create request for position ${input.for_position} from user with position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  const validatedTagUuids = await validateTagUuids(tagUuids);
  if (!validatedTagUuids.ok) {
    logger.warn(
      `Rejected Content create request with invalid tag UUIDs: ${validatedTagUuids.missingTagUuids.join(", ")}`,
    );
    return res.status(400).json({
      message: "One or more tag UUIDs are invalid",
      tagUuids: validatedTagUuids.missingTagUuids,
    });
  }

  const uuid = randomUUID();
  const urlResult = await resolveContentUrl({
    file: req.file ?? undefined,
    uuid,
    expirationTime: input.expiration_time,
    providedUrl: validatedUrl.normalizedUrl,
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
    file_type: req.file?.mimetype ?? null,
  };

  logger.verbose(`Inserting Content table record ${uuid}`);

  try {
    const content = await prisma.$transaction(async (tx) => {
      const createdContent = await tx.content.create({ data });

      if (validatedTagUuids.tagUuids.length > 0) {
        await tx.contentTagAssignment.createMany({
          data: validatedTagUuids.tagUuids.map((tagUuid) => ({
            contentUuid: createdContent.uuid,
            tagUuid,
          })),
        });
      }

      await tx.activity.create({
        data: {
          employeeUuid: auth.employeeUuid,
          action: "CREATE_CONTENT",
          resource: "CONTENT",
          resourceUuid: createdContent.uuid,
          resourceName: createdContent.title,
        },
      });

      return createdContent;
    });

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
  const uuid = parseContentUuid(req, res, "Invalid content UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

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

  const { tagUuids, ...input } = parsed.data;
  const validatedUrl = validateProvidedUrl(input.url);
  if (!validatedUrl.ok) {
    logger.warn(
      `Rejected Content edit request for record ${uuid}: invalid URL`,
    );
    return res.status(400).json({ message: validatedUrl.message });
  }

  const isExistingUploadedFileUrl =
    !req.file &&
    !!validatedUrl.normalizedUrl &&
    !!existingContent.supabasePath &&
    validatedUrl.normalizedUrl === existingContent.url;
  const effectiveProvidedUrl =
    isExistingUploadedFileUrl ? undefined : validatedUrl.normalizedUrl;

  if (req.file && effectiveProvidedUrl) {
    logger.warn(
      `Rejected Content edit request for record ${uuid}: both file and URL provided`,
    );
    return res.status(400).json({
      message: "Provide either a file or a URL, not both",
    });
  }

  const targetPosition =
    resolvePositionValue(input.for_position) ?? existingContent.for_position;
  if (!canManagePosition(auth, targetPosition)) {
    logger.warn(
      `Rejected Content edit request for record ${uuid}: target position ${targetPosition}, user position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  const validatedTagUuids = await validateTagUuids(tagUuids);
  if (!validatedTagUuids.ok) {
    logger.warn(
      `Rejected Content edit request for record ${uuid} with invalid tag UUIDs: ${validatedTagUuids.missingTagUuids.join(", ")}`,
    );
    return res.status(400).json({
      message: "One or more tag UUIDs are invalid",
      tagUuids: validatedTagUuids.missingTagUuids,
    });
  }

  if (await rejectIfLockedByAnotherUser(uuid, auth, res)) {
    return;
  }

  const expirationTime =
    input.expiration_time instanceof Date ?
      input.expiration_time
    : existingContent.expiration_time;

  const urlResult = await resolveContentUrl({
    file: req.file ?? undefined,
    uuid,
    expirationTime,
    providedUrl: effectiveProvidedUrl,
    fallbackUrl: existingContent.url,
    fallbackSupabasePath:
      effectiveProvidedUrl ? null : existingContent.supabasePath,
    upsert: true,
  });

  if (!urlResult.ok) {
    return res.status(urlResult.status).json({ message: urlResult.message });
  }

  const nextSupabasePath =
    req.file ? (urlResult.supabasePath ?? null)
    : effectiveProvidedUrl ? null
    : existingContent.supabasePath;
  const nextFileType =
    req.file ? req.file.mimetype
    : effectiveProvidedUrl ? null
    : existingContent.file_type;

  const data = {
    ...input,
    url: urlResult.url,
    supabasePath: nextSupabasePath,
    file_type: nextFileType,
    last_modified_time: new Date(),
  };

  logger.verbose(`Updating Content table record ${uuid}`);

  try {
    const updatedContent = await prisma.$transaction(async (tx) => {
      const content = await tx.content.update({
        where: { uuid },
        data,
      });

      await tx.contentTagAssignment.deleteMany({
        where: { contentUuid: uuid },
      });

      if (validatedTagUuids.tagUuids.length > 0) {
        await tx.contentTagAssignment.createMany({
          data: validatedTagUuids.tagUuids.map((tagUuid) => ({
            contentUuid: uuid,
            tagUuid,
          })),
        });
      }

      await tx.activity.create({
        data: {
          employeeUuid: auth.employeeUuid,
          action: "EDIT_CONTENT",
          resource: "CONTENT",
          resourceUuid: content.uuid,
          resourceName: content.title,
        },
      });

      return content;
    });

    if (
      input.content_owner &&
      input.content_owner !== existingContent.content_owner
    ) {
      const oldOwner = existingContent.content_owner;
      const newOwner = input.content_owner;

      await prisma.activity.create({
        data: {
          employeeUuid: auth.employeeUuid,
          action: "OWNERSHIP_CHANGE",
          resource: "CONTENT",
          resourceUuid: updatedContent.uuid,
          resourceName: `${updatedContent.title} (${oldOwner} → ${newOwner})`,
        },
      });
      logger.verbose("changed owner");
    } else {
      await prisma.activity.create({
        data: {
          employeeUuid: auth.employeeUuid,
          action: "EDIT_CONTENT",
          resource: "CONTENT",
          resourceUuid: updatedContent.uuid,
          resourceName: updatedContent.title,
        },
      });
      logger.verbose("edit content");
    }

    const previousSupabasePath = existingContent.supabasePath;
    const shouldDeleteOldSupabaseObject =
      previousSupabasePath &&
      previousSupabasePath !== updatedContent.supabasePath;

    if (shouldDeleteOldSupabaseObject) {
      const deleteResult = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([previousSupabasePath]);

      if (!deleteResult.data) {
        logger.warn(
          `Failed to delete superseded Supabase object for Content table record ${uuid} at path ${previousSupabasePath}: ${deleteResult.error?.message}`,
        );
      } else {
        logger.verbose(
          `Deleted superseded Supabase object for Content table record ${uuid} at path ${previousSupabasePath}`,
        );
      }
    }

    logger.verbose(`Updated Content table record ${uuid}`);
    return res.status(200).json(updatedContent);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to update Content table record ${uuid}`,
      e,
    );
  }
});

router.post("/regenerate-link/:uuid", async (req, res) => {
  const uuid = parseContentUuid(req, res, "Invalid content UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

  logger.verbose(`Querying Content table for record ${uuid}`);
  const existingContent = await prisma.content.findUnique({ where: { uuid } });
  if (!existingContent) {
    logger.warn(
      `Received regenerate link request for Content table record ${uuid} that does not exist`,
    );
    return res.status(400).json({ message: "Invalid content UUID" });
  }
  logger.verbose(`Queried Content table for record ${uuid}: record found`);

  const parsed = RegenerateContentLinkSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.verbose(
      `Failed to parse Content regenerate link request body for record ${uuid}:\n${parsed.error.issues}`,
    );
    return res.status(400).json({ message: parsed.error.issues });
  }

  if (!canManagePosition(auth, existingContent.for_position)) {
    logger.warn(
      `Rejected Content regenerate link request for record ${uuid}: target position ${existingContent.for_position}, user position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (await rejectIfLockedByAnotherUser(uuid, auth, res)) {
    return;
  }

  if (!existingContent.supabasePath) {
    logger.warn(
      `Rejected Content regenerate link request for external URL record ${uuid}`,
    );
    return res.status(400).json({
      message: "Only Supabase-backed content links can be regenerated",
    });
  }

  const urlResult = await resolveContentUrl({
    uuid,
    expirationTime: parsed.data.expiration_time,
    fallbackSupabasePath: existingContent.supabasePath,
    upsert: true,
  });

  if (!urlResult.ok) {
    return res.status(urlResult.status).json({ message: urlResult.message });
  }

  logger.verbose(`Updating Content table record ${uuid} with regenerated link`);

  try {
    const updatedContent = await prisma.content.update({
      where: { uuid },
      data: {
        url: urlResult.url,
        expiration_time: parsed.data.expiration_time,
        last_modified_time: new Date(),
      },
    });

    await prisma.activity.create({
      data: {
        employeeUuid: auth.employeeUuid,
        action: "EDIT_CONTENT",
        resource: "CONTENT",
        resourceUuid: updatedContent.uuid,
        resourceName: updatedContent.title,
      },
    });

    logger.verbose(`Regenerated Content link for record ${uuid}`);
    return res.status(200).json(updatedContent);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to regenerate Content link for record ${uuid}`,
      e,
    );
  }
});

router.post("/delete/:uuid", async (req, res) => {
  const uuid = parseContentUuid(req, res, "Invalid content UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

  try {
    logger.verbose(`Querying Content table for record ${uuid} before delete`);
    const content = await findContentByUuid(uuid);

    if (!content) {
      logger.warn(
        `Received delete request for Content table record ${uuid} that does not exist`,
      );
      return res.status(400).json({ message: "Invalid content UUID" });
    }
    logger.verbose(
      `Queried Content table for record ${uuid} before delete: record found`,
    );

    if (!canManagePosition(auth, content.for_position)) {
      logger.warn(
        `Rejected Content delete request for record ${uuid}: target position ${content.for_position}, user position ${auth.position}`,
      );
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (await rejectIfLockedByAnotherUser(uuid, auth, res)) {
      return;
    }

    logger.verbose(`Deleting Content table record ${uuid}`);
    await prisma.$transaction(async (tx) => {
      await tx.activity.create({
        data: {
          employeeUuid: auth.employeeUuid,
          action: "DELETE_CONTENT",
          resource: "CONTENT",
          resourceUuid: content.uuid,
          resourceName: content.title,
        },
      });

      await tx.contentEditLock.deleteMany({
        where: { contentUuid: uuid },
      });
      await tx.content.delete({ where: { uuid } });
    });
    logger.verbose(`Deleted Content table record ${uuid}`);

    return res.status(200).json(content);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to delete Content table record ${uuid}`,
      e,
    );
  }
});

router.post("/favorite/:uuid", async (req, res) => {
  const uuid = parseContentUuid(req, res, "Invalid content UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

  logger.verbose(
    `Received Content favorite request for content ${uuid} from employee ${auth.employeeUuid}`,
  );

  const parsed = FavoriteContentSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.verbose(
      `Failed to parse Content favorite request body for record ${uuid}:\n${parsed.error.issues}`,
    );
    return res.status(400).json({ message: parsed.error.issues });
  }

  const input = parsed.data;
  logger.verbose(
    `Parsed Content favorite request for content ${uuid}: isFavorite=${input.isFavorite}`,
  );

  try {
    const content = await prisma.content.findUnique({
      where: { uuid },
      select: { uuid: true, for_position: true },
    });

    if (!content) {
      logger.warn(
        `Received Content favorite request for non-existent content ${uuid}`,
      );
      return res.status(404).json({ message: "Content not found" });
    }

    if (!canManagePosition(auth, content.for_position)) {
      logger.warn(
        `Rejected Content favorite request for record ${uuid}: target position ${content.for_position}, user position ${auth.position}`,
      );
      return res.status(401).json({ message: "Unauthorized" });
    }

    logger.verbose(
      `Querying FavoriteContent for employee ${auth.employeeUuid} and content ${uuid}`,
    );
    const favoriteContentRecord = await prisma.favoriteContent.findUnique({
      where: {
        employeeUuid_contentUuid: {
          employeeUuid: auth.employeeUuid,
          contentUuid: uuid,
        },
      },
    });

    logger.verbose(
      `Queried FavoriteContent for employee ${auth.employeeUuid} and content ${uuid}: ${favoriteContentRecord ? "record found" : "no record found"}`,
    );

    if (favoriteContentRecord) {
      if (input.isFavorite) {
        logger.warn(
          `Received content favorite request by employee ${auth.employeeUuid} for content ${uuid} that was already favorited`,
        );
        return res.status(200).json({
          employeeUuid: auth.employeeUuid,
          contentUuid: uuid,
          isFavorite: true,
          changed: false,
          message: "Content was already favorited",
        });
      }

      logger.verbose(
        `Deleting FavoriteContent for employee ${auth.employeeUuid} and content ${uuid}`,
      );
      await prisma.favoriteContent.delete({
        where: {
          employeeUuid_contentUuid: {
            employeeUuid: auth.employeeUuid,
            contentUuid: uuid,
          },
        },
      });
      logger.verbose(
        `Deleted FavoriteContent for employee ${auth.employeeUuid} and content ${uuid}`,
      );

      return res.status(200).json({
        employeeUuid: auth.employeeUuid,
        contentUuid: uuid,
        isFavorite: false,
        changed: true,
        message: "Content unfavorited successfully",
      });
    }

    if (!input.isFavorite) {
      logger.warn(
        `Received content unfavorite request by employee ${auth.employeeUuid} for content ${uuid} that was not favorited`,
      );
      return res.status(200).json({
        employeeUuid: auth.employeeUuid,
        contentUuid: uuid,
        isFavorite: false,
        changed: false,
        message: "Content was not favorited",
      });
    }

    logger.verbose(
      `Creating FavoriteContent for employee ${auth.employeeUuid} and content ${uuid}`,
    );
    await prisma.favoriteContent.create({
      data: {
        employeeUuid: auth.employeeUuid,
        contentUuid: uuid,
      },
    });
    logger.verbose(
      `Created FavoriteContent for employee ${auth.employeeUuid} and content ${uuid}`,
    );

    return res.status(200).json({
      employeeUuid: auth.employeeUuid,
      contentUuid: uuid,
      isFavorite: true,
      changed: true,
      message: "Content favorited successfully",
    });
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to update content ${uuid} favorite status for employee ${auth.employeeUuid}`,
      e,
    );
  }
});

router.get("/file/:uuid", async (req, res) => {
  const uuid = parseContentUuid(req, res, "Invalid content UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

  try {
    const content = await loadAccessibleContent(uuid, auth, res, {
      notFoundStatus: 404,
      notFoundMessage: "Content not found",
      unauthorizedStatus: 401,
      logUnauthorized: true,
    });
    if (!content) {
      return;
    }

    logger.info(`Serving content file ${uuid}`);
    logger.info(
      `Content supabasePath present: ${Boolean(content.supabasePath)}`,
    );

    if (!content.supabasePath) {
      return res.status(409).json({
        message:
          "This content references an external URL and cannot be downloaded through this endpoint",
      });
    }

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(content.supabasePath);

    if (error || !data) {
      logger.error(`Failed to download file for ${uuid}: ${error?.message}`);
      return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    const mimeType = data.type || "application/octet-stream";

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${content.title}"`);
    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to serve file for content ${uuid}`,
      e,
    );
  }
});

router.get("/history/:uuid", async (req, res) => {
  const uuid = parseContentUuid(req, res, "Invalid content UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);

  try {
    const content = await loadAccessibleContent(uuid, auth, res, {
      notFoundStatus: 404,
      notFoundMessage: "Content not found",
      unauthorizedStatus: 401,
      logUnauthorized: true,
    });
    if (!content) {
      return;
    }

    logger.verbose(`Querying Activity table for content history ${uuid}`);

    const activities = await prisma.activity.findMany({
      where: {
        resourceUuid: uuid,
        resource: "CONTENT",
        action: {
          in: [
            "CREATE_CONTENT",
            "EDIT_CONTENT",
            "CHECK_OUT_CONTENT",
            "CHECK_IN_CONTENT",
          ],
        },
      },
      orderBy: { timestamp: "asc" },
      include: {
        employee: {
          select: {
            uuid: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    logger.verbose(
      `Queried Activity table for content history ${uuid}: found ${activities.length} record(s)`,
    );

    return res.status(200).json(activities);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to query activity history for content ${uuid}`,
      e,
    );
  }
});

router.post("/view/:uuid", async (req, res) => {
  const uuid = parseContentUuid(req, res, "Invalid content UUID");
  if (!uuid) return;

  const auth = getAuth(req);

  try {
    const content = await loadAccessibleContent(uuid, auth, res);
    if (!content) return;

    await prisma.contentHit.create({
      data: {
        contentUuid: uuid,
        employeeUuid: auth.employeeUuid,
        action: "VIEW",
      },
    });

    return res.status(200).json({ message: "View recorded" });
  } catch (e) {
    return sendInternalError(res, "Failed to record view", e);
  }
});

router.get("/tag", async (req, res) => {
  getAuth(req);

  logger.verbose("Querying content tag table for all content tags");
  const tags = await prisma.contentTag.findMany({
    select: {
      uuid: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  if (!tags) {
    return sendInternalError(
      res,
      "Failed to query content tag table",
      new Error(),
    );
  }
  return res.status(200).json(tags);
});

router.post("/tag/create", async (req, res) => {
  const auth = getAuth(req);
  if (!isAdmin(auth)) {
    logger.warn(
      `Rejected content tag create request from user with position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  const parsed = CreateTagSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.verbose(
      `Failed to parse Content tag create request body:\n${parsed.error.issues}`,
    );
    return res.status(400).json({ message: parsed.error.issues });
  }

  const normalizedTag = normalizeTagName(parsed.data.name);
  if (!normalizedTag.name) {
    return res.status(400).json({ message: "Tag name cannot be blank" });
  }

  try {
    const tag = await prisma.contentTag.create({
      data: normalizedTag,
    });

    return res.status(201).json(tag);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return res.status(409).json({ message: "Tag name already exists" });
    }

    return sendInternalError(res, "Failed to create content tag", e);
  }
});

router.post("/tag/delete/:uuid", async (req, res) => {
  const uuid = parseTagUuid(req, res, "Invalid tag UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);
  if (!isAdmin(auth)) {
    logger.warn(
      `Rejected content tag delete request from user with position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tag = await prisma.contentTag.delete({
      where: { uuid },
    });

    return res.status(200).json(tag);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return sendInternalError(res, `Failed to delete content tag ${uuid}`, e);
  }
});

router.post("/tag/update/:tagUuid/:contentUuid", async (req, res) => {
  const params = parseTagContentUuids(req, res);
  if (!params) {
    return;
  }

  const auth = getAuth(req);

  try {
    const tag = await findTagByUuid(params.tagUuid);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const content = await loadAccessibleContent(params.contentUuid, auth, res, {
      notFoundStatus: 404,
      notFoundMessage: "Content not found",
      unauthorizedStatus: 401,
      logUnauthorized: true,
    });
    if (!content) {
      return;
    }

    const existingAssignment = await prisma.contentTagAssignment.findUnique({
      where: {
        contentUuid_tagUuid: {
          contentUuid: params.contentUuid,
          tagUuid: params.tagUuid,
        },
      },
    });

    if (existingAssignment) {
      return res.status(200).json({
        tagUuid: params.tagUuid,
        contentUuid: params.contentUuid,
        attached: true,
        changed: false,
      });
    }

    await prisma.contentTagAssignment.create({
      data: {
        contentUuid: params.contentUuid,
        tagUuid: params.tagUuid,
      },
    });

    return res.status(200).json({
      tagUuid: params.tagUuid,
      contentUuid: params.contentUuid,
      attached: true,
      changed: true,
    });
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to attach tag ${params.tagUuid} to content ${params.contentUuid}`,
      e,
    );
  }
});

router.delete("/tag/update/:tagUuid/:contentUuid", async (req, res) => {
  const params = parseTagContentUuids(req, res);
  if (!params) {
    return;
  }

  const auth = getAuth(req);

  try {
    const tag = await findTagByUuid(params.tagUuid);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    const content = await loadAccessibleContent(params.contentUuid, auth, res, {
      notFoundStatus: 404,
      notFoundMessage: "Content not found",
      unauthorizedStatus: 401,
      logUnauthorized: true,
    });
    if (!content) {
      return;
    }

    const existingAssignment = await prisma.contentTagAssignment.findUnique({
      where: {
        contentUuid_tagUuid: {
          contentUuid: params.contentUuid,
          tagUuid: params.tagUuid,
        },
      },
    });

    if (!existingAssignment) {
      return res.status(200).json({
        tagUuid: params.tagUuid,
        contentUuid: params.contentUuid,
        attached: false,
        changed: false,
      });
    }

    await prisma.contentTagAssignment.delete({
      where: {
        contentUuid_tagUuid: {
          contentUuid: params.contentUuid,
          tagUuid: params.tagUuid,
        },
      },
    });

    return res.status(200).json({
      tagUuid: params.tagUuid,
      contentUuid: params.contentUuid,
      attached: false,
      changed: true,
    });
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to remove tag ${params.tagUuid} from content ${params.contentUuid}`,
      e,
    );
  }
});

export default router;
