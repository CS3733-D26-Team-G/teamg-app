import express from "express";
import { Position, prisma, Prisma } from "@repo/db";
import multer from "multer";
import { supabase } from "../lib/supabase.ts";
import { Schemas } from "@repo/zod";
import { randomUUID } from "crypto";
import mime from "mime-types";
import { z } from "zod";
import { logger } from "../logger.ts";
import { STORAGE_BUCKET, INTERNAL_ERROR_MESSAGE } from "../config.ts";
import {
  canManagePosition,
  getAuth,
  isAdmin,
  sendInternalError,
} from "../lib/request.ts";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 1,
  },
});

const ParamsSchema = Schemas.ContentWhereUniqueInputObjectZodSchema.extend({
  uuid: z.uuid(),
});

const TagParamsSchema = z.object({
  uuid: z.uuid(),
});

const TagContentParamsSchema = z.object({
  tagUuid: z.uuid(),
  contentUuid: z.uuid(),
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

const FavoriteContentSchema = z.object({
  isFavorite: z.boolean(),
});

const RegenerateContentLinkSchema = z.object({
  expiration_time: z.coerce.date(),
});

const CreateTagSchema = z.object({
  name: z.string(),
});

const ContentFilterFieldSchema = z.enum([
  "expiration_time",
  "last_modified_time",
  "status",
  "content_type",
  "for_position",
  "title",
  "content_owner",
  "file_type",
]);

const ContentFilterOperatorSchema = z.enum([
  "eq",
  "neq",
  "lt",
  "lte",
  "gt",
  "gte",
]);

const ContentFilterSchema = z.object({
  field: ContentFilterFieldSchema,
  op: ContentFilterOperatorSchema,
  value: z.unknown(),
});

const contentLockInclude = {
  lockedByEmp: {
    select: {
      uuid: true,
      first_name: true,
      last_name: true,
      corporate_email: true,
    },
  },
} satisfies Prisma.ContentEditLockInclude;

type UploadResult =
  | { ok: true; url: string; supabasePath?: string }
  | { ok: false; status: number; message: string };

type ContentFilter = z.infer<typeof ContentFilterSchema>;
type ContentFilterField = z.infer<typeof ContentFilterFieldSchema>;
type SupportedContentField =
  | "expiration_time"
  | "last_modified_time"
  | "status"
  | "content_type"
  | "for_position"
  | "title"
  | "content_owner"
  | "file_type";

const contentDateFilterFields = new Set<ContentFilterField>([
  "expiration_time",
  "last_modified_time",
]);

const contentFieldValueSchemas = {
  expiration_time: z.coerce.date(),
  last_modified_time: z.coerce.date(),
  status: Schemas.ContentStatusSchema,
  content_type: Schemas.ContentTypeSchema,
  for_position: Schemas.PositionSchema,
  title: z.string(),
  content_owner: z.string(),
  file_type: z.string(),
} satisfies Record<SupportedContentField, z.ZodType>;

function getExpiresInSeconds(expirationTime: Date): number {
  return Math.floor((expirationTime.getTime() - Date.now()) / 1000);
}

function getVisibleContentWhere(
  auth: NonNullable<Express.Request["auth"]>,
): Prisma.ContentWhereInput | undefined {
  if (isAdmin(auth)) {
    return undefined;
  }

  return { for_position: auth.position };
}

function parseExternalContentUrl(url: string) {
  const parsed = z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.domain,
    })
    .safeParse(url);

  if (!parsed.success) {
    return null;
  }

  return new URL(parsed.data);
}

function validateProvidedUrl(url: string | undefined) {
  if (!url) {
    return { ok: true as const };
  }

  const parsedUrl = parseExternalContentUrl(url);
  if (!parsedUrl) {
    return {
      ok: false as const,
      message: "URL must be a valid HTTP or HTTPS URL",
    };
  }

  return { ok: true as const, normalizedUrl: parsedUrl.toString() };
}

function resolvePositionValue(
  position:
    | Position
    | Prisma.EnumPositionFieldUpdateOperationsInput
    | undefined
    | null,
): Position | null {
  if (!position) {
    return null;
  }

  if (typeof position === "string") {
    return position;
  }

  return position.set ?? null;
}

function serializeLock(lock: ActiveContentLock) {
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

function parseContentUuid(
  req: express.Request,
  res: express.Response,
  invalidMessage: string,
) {
  const params = ParamsSchema.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: invalidMessage });
    return null;
  }

  return params.data.uuid;
}

function parseTagUuid(
  req: express.Request,
  res: express.Response,
  invalidMessage: string,
) {
  const params = TagParamsSchema.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: invalidMessage });
    return null;
  }

  return params.data.uuid;
}

function parseTagContentUuids(req: express.Request, res: express.Response) {
  const params = TagContentParamsSchema.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: "Invalid tag or content UUID" });
    return null;
  }

  return params.data;
}

function normalizeTagName(name: string) {
  const trimmedName = name.trim();
  return {
    name: trimmedName,
    normalizedName: trimmedName.toLowerCase(),
  };
}

async function findContentByUuid(uuid: string) {
  return prisma.content.findUnique({
    where: { uuid },
  });
}

async function findTagByUuid(uuid: string) {
  return prisma.contentTag.findUnique({
    where: { uuid },
  });
}

async function findActiveLock(uuid: string) {
  return prisma.contentEditLock.findUnique({
    where: { contentUuid: uuid },
    include: contentLockInclude,
  });
}

function parseContentFilters(
  query: express.Request["query"],
):
  | { ok: true; filters: Prisma.ContentWhereInput[] }
  | { ok: false; message: string } {
  const rawFilters = query.filter;

  if (typeof rawFilters === "undefined") {
    return { ok: true, filters: [] };
  }

  const filterValues = Array.isArray(rawFilters) ? rawFilters : [rawFilters];
  const filters: Prisma.ContentWhereInput[] = [];

  for (const rawFilter of filterValues) {
    if (typeof rawFilter !== "string") {
      return {
        ok: false,
        message:
          "Each filter query parameter must be a JSON stringified object",
      };
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawFilter);
    } catch {
      return {
        ok: false,
        message: "Invalid filter JSON in query parameter",
      };
    }

    const parsedFilter = ContentFilterSchema.safeParse(parsedJson);
    if (!parsedFilter.success) {
      return {
        ok: false,
        message: "Invalid content filter definition",
      };
    }

    const clause = buildContentFilterClause(parsedFilter.data);
    if (!clause.ok) {
      return clause;
    }

    filters.push(clause.filter);
  }

  return { ok: true, filters };
}

function buildContentFilterClause(
  filter: ContentFilter,
):
  | { ok: true; filter: Prisma.ContentWhereInput }
  | { ok: false; message: string } {
  if (
    !contentDateFilterFields.has(filter.field) &&
    ["lt", "lte", "gt", "gte"].includes(filter.op)
  ) {
    return {
      ok: false,
      message: `Operator ${filter.op} is only supported for date filters`,
    };
  }

  const fieldSchema = contentFieldValueSchemas[filter.field];
  const parsedValue = fieldSchema.safeParse(filter.value);
  if (!parsedValue.success) {
    return {
      ok: false,
      message: `Invalid value for content filter field ${filter.field}`,
    };
  }

  const value = parsedValue.data;

  switch (filter.op) {
    case "eq":
      return { ok: true, filter: { [filter.field]: value } };
    case "neq":
      return { ok: true, filter: { [filter.field]: { not: value } } };
    case "lt":
      return { ok: true, filter: { [filter.field]: { lt: value } } };
    case "lte":
      return { ok: true, filter: { [filter.field]: { lte: value } } };
    case "gt":
      return { ok: true, filter: { [filter.field]: { gt: value } } };
    case "gte":
      return { ok: true, filter: { [filter.field]: { gte: value } } };
  }
}

type ActiveContentLock = NonNullable<
  Awaited<ReturnType<typeof findActiveLock>>
>;

async function loadAccessibleContent(
  uuid: string,
  auth: NonNullable<Express.Request["auth"]>,
  res: express.Response,
  options?: {
    notFoundStatus?: number;
    notFoundMessage?: string;
    unauthorizedStatus?: number;
    logUnauthorized?: boolean;
  },
) {
  const content = await findContentByUuid(uuid);
  if (!content) {
    res
      .status(options?.notFoundStatus ?? 400)
      .json({ message: options?.notFoundMessage ?? "Invalid content UUID" });
    return null;
  }

  if (!canManagePosition(auth, content.for_position)) {
    if (options?.logUnauthorized) {
      logger.warn(
        `Rejected Content request for record ${uuid}: target position ${content.for_position}, user position ${auth.position}`,
      );
    }
    res
      .status(options?.unauthorizedStatus ?? 401)
      .json({ message: "Unauthorized" });
    return null;
  }

  return content;
}

async function rejectIfLockedByAnotherUser(
  uuid: string,
  auth: NonNullable<Express.Request["auth"]>,
  res: express.Response,
) {
  const lock = await findActiveLock(uuid);
  if (!lock || lock.lockedByEmpUuid === auth.employeeUuid || isAdmin(auth)) {
    return false;
  }

  res.status(409).json({
    message: "Content is currently locked by another user",
    lock: serializeLock(lock),
  });
  return true;
}

async function createOrRefreshLock(
  uuid: string,
  auth: NonNullable<Express.Request["auth"]>,
  existingLock: ActiveContentLock | null,
) {
  if (!existingLock) {
    return prisma.contentEditLock.create({
      data: {
        contentUuid: uuid,
        lockedByEmpUuid: auth.employeeUuid,
      },
      include: contentLockInclude,
    });
  }

  return prisma.contentEditLock.update({
    where: { contentUuid: uuid },
    data: {
      lockedByEmpUuid: auth.employeeUuid,
      lockedAt: new Date(),
    },
    include: contentLockInclude,
  });
}

async function resolveContentUrl({
  file,
  uuid,
  expirationTime,
  providedUrl,
  fallbackUrl,
  fallbackSupabasePath,
  upsert,
}: {
  file?: Express.Multer.File;
  uuid: string;
  expirationTime: Date;
  providedUrl?: string | null;
  fallbackUrl?: string | null;
  fallbackSupabasePath?: string | null;
  upsert: boolean;
}): Promise<UploadResult> {
  if (!file) {
    if (providedUrl) {
      return { ok: true, url: providedUrl };
    }

    if (fallbackSupabasePath) {
      const expiresIn = getExpiresInSeconds(expirationTime);
      if (expiresIn < 0) {
        return {
          ok: false,
          status: 400,
          message: "Expiration time must be in the future!",
        };
      }

      const signedUrlResult = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(fallbackSupabasePath, expiresIn);

      if (!signedUrlResult.data) {
        logger.error(
          `Failed to create signed URL for existing content ${uuid} at path ${fallbackSupabasePath}: ${signedUrlResult.error?.message}`,
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
        supabasePath: fallbackSupabasePath,
      };
    }

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

router.get("/tag", async (req, res) => {
  const auth = getAuth(req);
  if (!isAdmin(auth)) {
    logger.warn(
      `Rejected content tag get request from user with position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  logger.verbose("Querying content tag table for all content tags");
  const tags = await prisma.contentTag.findMany();
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

  const input = parsed.data;
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
    const content = await prisma.content.create({ data });

    await prisma.activity.create({
      data: {
        employeeUuid: auth.employeeUuid,
        action: "CREATE_CONTENT",
        resource: "CONTENT",
        resourceUuid: content.uuid,
        resourceName: content.title,
      },
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

  const input = parsed.data;
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
  };

  logger.verbose(`Updating Content table record ${uuid}`);

  try {
    const updatedContent = await prisma.content.update({
      where: { uuid },
      data,
    });

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

    await prisma.activity.create({
      data: {
        employeeUuid: auth.employeeUuid,
        action: "EDIT_CONTENT",
        resource: "CONTENT",
        resourceUuid: updatedContent.uuid,
        resourceName: updatedContent.title,
      },
    });

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

export default router;
