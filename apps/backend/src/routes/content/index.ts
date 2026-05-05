import express from "express";
import { Position, prisma, Prisma } from "@repo/db";
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
import { inferSearchTextFromUpload } from "../../lib/content-inference.ts";
import {
  CreateContentSchema,
  CreateOrEditTagSchema,
  FavoriteContentSchema,
  RegenerateContentLinkSchema,
  SearchCandidate,
  TagAction,
  UpdateContentSchema,
} from "./schemas.ts";
import {
  createOrRefreshLock,
  findActiveLock,
  findContentByUuid,
  findTagByUuid,
  getContentListInclude,
  getSearchFilterClauses,
  getTagActionFromMethod,
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
  serializeContentList,
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
  const gettingContent =
    auth.position === Position.ADMIN ? "all" : auth.position;
  logger.verbose(`Querying Content table for ${gettingContent} records`);

  const parsedFilters = parseContentFilters(req.query);
  if (!parsedFilters.ok) {
    return res.status(400).json({ message: parsedFilters.message });
  }

  const whereClauses = [...parsedFilters.filters].filter(
    (clause): clause is Prisma.ContentWhereInput => !!clause,
  );

  try {
    const content = await prisma.content.findMany({
      where:
        whereClauses.length > 0 ?
          {
            AND: whereClauses,
          }
        : undefined,
      include: getContentListInclude(auth.employeeUuid),
      orderBy: {
        lastModifiedTime: "desc",
      },
    });

    logger.verbose(
      `Queried Content table for ${gettingContent} records: found ${content.length} record(s)`,
    );

    return res.status(200).json(serializeContentList(content));
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to query Content table for ${gettingContent} records`,
      e,
    );
  }
});

router.get("/search", async (req, res) => {
  const auth = getAuth(req);
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const parsedFilters = parseContentFilters(req.query);
  if (!parsedFilters.ok) {
    return res.status(400).json({ message: parsedFilters.message });
  }

  try {
    // Prisma cannot express this full-text + trigram ranking cleanly, so this
    // query builds a temporary search document and re-applies authorization below.
    const candidates = await prisma.$queryRaw<SearchCandidate[]>`
      WITH search_store AS (
        SELECT
          c.uuid,
          to_tsvector(
            'english',
            concat_ws(
              ' ',
              c.title,
              c.content_owner,
              c.file_type,
              c.for_position::text,
              c.status::text,
              c.content_type::text,
              c.search_text,
              coalesce(string_agg(ct.name, ' '), '')
            )
          ) AS search_vector,
          lower(
            concat_ws(
              ' ',
              c.title,
              c.content_owner,
              c.file_type,
              c.for_position::text,
              c.status::text,
              c.content_type::text,
              c.search_text,
              coalesce(string_agg(ct.name, ' '), '')
            )
          ) AS fuzzy_text
        FROM "Content" c
        LEFT JOIN "ContentTagAssignment" cta ON cta.content_uuid = c.uuid
        LEFT JOIN "ContentTag" ct ON ct.uuid = cta.tag_uuid
        GROUP BY c.uuid
      )
      SELECT
        uuid,
        ts_rank_cd(search_vector, websearch_to_tsquery('english', ${query}))::float AS text_rank,
        similarity(fuzzy_text, lower(${query}))::float AS fuzzy_rank
      FROM search_store
      WHERE
        search_vector @@ websearch_to_tsquery('english', ${query})
        OR fuzzy_text % lower(${query})
        OR fuzzy_text LIKE '%' || lower(${query}) || '%'
      ORDER BY text_rank DESC, fuzzy_rank DESC
      LIMIT 500
    `;

    if (candidates.length === 0) {
      return res.status(200).json([]);
    }

    const candidateOrder = new Map(
      candidates.map((candidate, index) => [candidate.uuid, index]),
    );
    const whereClauses = [
      getVisibleContentWhere(auth),
      ...parsedFilters.filters,
      ...getSearchFilterClauses(req.query),
      {
        uuid: {
          in: candidates.map((candidate) => candidate.uuid),
        },
      },
    ].filter((clause): clause is Prisma.ContentWhereInput => !!clause);

    const content = await prisma.content.findMany({
      where: {
        AND: whereClauses,
      },
      include: getContentListInclude(auth.employeeUuid),
    });

    content.sort(
      (a, b) =>
        (candidateOrder.get(a.uuid) ?? Number.MAX_SAFE_INTEGER) -
        (candidateOrder.get(b.uuid) ?? Number.MAX_SAFE_INTEGER),
    );

    return res.status(200).json(serializeContentList(content));
  } catch (e) {
    return sendInternalError(res, "Failed to search content", e);
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
    if (existingLock && existingLock.lockedByEmpUuid !== auth.employeeUuid) {
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

  if (!canManagePosition(auth, input.forPosition)) {
    logger.warn(
      `Rejected Content create request for position ${input.forPosition} from user with position ${auth.position}`,
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
    expirationTime: input.expirationTime,
    providedUrl: validatedUrl.normalizedUrl,
    upsert: false,
  });

  if (!urlResult.ok) {
    logger.warn(
      `Failed to resolve content url: \nstatus:${urlResult.status}\nmessage:${urlResult.message}`,
    );
    return res.status(urlResult.status).json({ message: urlResult.message });
  }

  const data = {
    ...input,
    uuid,
    url: urlResult.url,
    supabasePath: urlResult.supabasePath,
    fileType: req.file?.mimetype ?? null,
    searchText: await inferSearchTextFromUpload(req.file ?? undefined),
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

  // When editing unchanged uploaded content, the form sends the existing signed
  // URL back. Treat that as "keep current file" because the URL itself expires.
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
    resolvePositionValue(input.forPosition) ?? existingContent.forPosition;
  if (!canManagePosition(auth, targetPosition)) {
    logger.warn(
      `Rejected Content edit request for record ${uuid}: target position ${targetPosition}, user position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  const validatedTagUuids =
    tagUuids ? await validateTagUuids(tagUuids) : undefined;
  if (validatedTagUuids && !validatedTagUuids.ok) {
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
    input.expirationTime instanceof Date ?
      input.expirationTime
    : existingContent.expirationTime;

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
    logger.warn(
      `Failed to resolve content url: \nstatus:${urlResult.status}\nmessage:${urlResult.message}`,
    );
    return res.status(urlResult.status).json({ message: urlResult.message });
  }

  const nextSupabasePath =
    req.file ? (urlResult.supabasePath ?? null)
    : effectiveProvidedUrl ? null
    : existingContent.supabasePath;
  const nextFileType =
    req.file ? req.file.mimetype
    : effectiveProvidedUrl ? null
    : existingContent.fileType;
  const nextSearchText =
    req.file ? await inferSearchTextFromUpload(req.file)
    : effectiveProvidedUrl ? null
    : existingContent.searchText;

  const data = {
    ...input,
    url: urlResult.url,
    supabasePath: nextSupabasePath,
    fileType: nextFileType,
    searchText: nextSearchText,
    lastModifiedTime: new Date(),
  };

  logger.verbose(`Updating Content table record ${uuid}`);

  try {
    const updatedContent = await prisma.$transaction(async (tx) => {
      const content = await tx.content.update({
        where: { uuid },
        data,
      });

      if (validatedTagUuids) {
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
      }

      return content;
    });

    if (
      input.contentOwner &&
      input.contentOwner !== existingContent.contentOwner
    ) {
      const oldOwner = existingContent.contentOwner;
      const newOwner = input.contentOwner;

      await prisma.activity.create({
        data: {
          employeeUuid: auth.employeeUuid,
          action: "OWNERSHIP_CHANGE",
          resource: "CONTENT",
          resourceUuid: updatedContent.uuid,
          resourceName: `${updatedContent.title} (${oldOwner} → ${newOwner})`,
        },
      });
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
    }

    const previousSupabasePath = existingContent.supabasePath;
    const shouldDeleteOldSupabaseObject =
      previousSupabasePath &&
      previousSupabasePath !== updatedContent.supabasePath;

    if (shouldDeleteOldSupabaseObject) {
      // Delete after the DB commit so a storage failure cannot orphan the
      // content row without a usable URL.
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

  if (!canManagePosition(auth, existingContent.forPosition)) {
    logger.warn(
      `Rejected Content regenerate link request for record ${uuid}: target position ${existingContent.forPosition}, user position ${auth.position}`,
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
    expirationTime: parsed.data.expirationTime,
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
        expirationTime: parsed.data.expirationTime,
        lastModifiedTime: new Date(),
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

    if (!canManagePosition(auth, content.forPosition)) {
      logger.warn(
        `Rejected Content delete request for record ${uuid}: target position ${content.forPosition}, user position ${auth.position}`,
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
    `Parsed Content favorite request for content ${uuid}: is_favorite=${input.is_favorite}`,
  );

  try {
    const content = await prisma.content.findUnique({
      where: { uuid },
      select: { uuid: true, forPosition: true },
    });

    if (!content) {
      logger.warn(
        `Received Content favorite request for non-existent content ${uuid}`,
      );
      return res.status(404).json({ message: "Content not found" });
    }

    if (!canManagePosition(auth, content.forPosition)) {
      logger.warn(
        `Rejected Content favorite request for record ${uuid}: target position ${content.forPosition}, user position ${auth.position}`,
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
      if (input.is_favorite) {
        logger.warn(
          `Received content favorite request by employee ${auth.employeeUuid} for content ${uuid} that was already favorited`,
        );
        return res.status(200).json({
          employeeUuid: auth.employeeUuid,
          contentUuid: uuid,
          is_favorite: true,
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
        is_favorite: false,
        changed: true,
        message: "Content unfavorited successfully",
      });
    }

    if (!input.is_favorite) {
      logger.warn(
        `Received content unfavorite request by employee ${auth.employeeUuid} for content ${uuid} that was not favorited`,
      );
      return res.status(200).json({
        employeeUuid: auth.employeeUuid,
        contentUuid: uuid,
        is_favorite: false,
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
      is_favorite: true,
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

  try {
    const content = await findContentByUuid(uuid);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
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
            firstName: true,
            lastName: true,
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

  const parsed = CreateOrEditTagSchema.safeParse(req.body);
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

router.post("/tag/edit/:uuid", async (req, res) => {
  const uuid = parseTagUuid(req, res, "Invalid tag UUID");
  if (!uuid) {
    return;
  }

  const auth = getAuth(req);
  if (!isAdmin(auth)) {
    logger.warn(
      `Rejected content tag edit request from user with position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  logger.verbose(`Querying ContentTag table for record ${uuid}`);
  const existingTag = await findTagByUuid(uuid);
  if (!existingTag) {
    logger.warn(
      `Received edit request for ContentTag table record ${uuid} that does not exist`,
    );
    return res.status(404).json({ message: "Tag not found" });
  }
  logger.verbose(
    `Queried ContentTag table for record ${uuid}: found ${existingTag.name}`,
  );

  const parsed = CreateOrEditTagSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.verbose(
      `Failed to parse Content tag edit request body for record ${uuid}:\n${parsed.error.issues}`,
    );
    return res.status(400).json({ message: parsed.error.issues });
  }

  const normalizedTag = normalizeTagName(parsed.data.name);
  if (!normalizedTag.name) {
    return res.status(400).json({ message: "Tag name cannot be blank" });
  }

  logger.verbose(`Updating ContentTag table record ${uuid}`);

  try {
    const tag = await prisma.contentTag.update({
      where: { uuid },
      data: normalizedTag,
    });

    logger.verbose(`Updated ContentTag table record ${uuid}`);
    return res.status(200).json(tag);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return res.status(409).json({ message: "Tag name already exists" });
    }

    return sendInternalError(res, `Failed to update content tag ${uuid}`, e);
  }
});

router.all("/tag/update/:tagUuid/:contentUuid", async (req, res) => {
  const action = getTagActionFromMethod(req.method);
  if (action == TagAction.INVALID) {
    logger.warn(
      `Received unsupported ${req.method} request for endpoint ${req.path}`,
    );
    return res.status(400).json({
      message: `${req.method} method not supported for endpoint ${req.path}`,
    });
  }

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

    if (action == TagAction.CREATE) {
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
    } else if (action == TagAction.DELETE) {
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
    }

    return res.status(200).json({
      tagUuid: params.tagUuid,
      contentUuid: params.contentUuid,
      attached: action === TagAction.CREATE,
      changed: true,
    });
  } catch (e) {
    const actionName = action === TagAction.CREATE ? "attach" : "remove";
    const preposition = action === TagAction.CREATE ? "to" : "from";

    return sendInternalError(
      res,
      `Failed to ${actionName} tag ${params.tagUuid} ${preposition} content ${params.contentUuid}`,
      e,
    );
  }
});

export default router;
