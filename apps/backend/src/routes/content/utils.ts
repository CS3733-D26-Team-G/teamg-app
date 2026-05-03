import express from "express";
import { Position, prisma, Prisma } from "@repo/db";
import mime from "mime-types";
import { z } from "zod";
import { INTERNAL_ERROR_MESSAGE, STORAGE_BUCKET } from "../../config.ts";
import {
  canManagePosition,
  getAuth,
  isAdmin,
  sendInternalError,
} from "../../lib/request.ts";
import { supabase } from "../../lib/supabase.ts";
import { logger } from "../../logger.ts";
import { getVisibleContentWhere } from "../../lib/content.ts";
import {
  contentDateFilterFields,
  contentFieldValueSchemas,
  contentLockInclude,
  ContentFilter,
  ContentFilterSchema,
  ParamsSchema,
  PositionUpdateValue,
  TagContentParamsSchema,
  TagParamsSchema,
  UploadResult,
  ContentListItem,
  TagAction,
} from "./schemas.ts";
import router from "./index.ts";

export function getExpiresInSeconds(expirationTime: Date): number {
  return Math.floor((expirationTime.getTime() - Date.now()) / 1000);
}

export function parseExternalContentUrl(url: string) {
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

export function validateProvidedUrl(url: string | undefined) {
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

export function resolvePositionValue(
  position: PositionUpdateValue,
): Position | null {
  if (!position) {
    return null;
  }

  if (typeof position === "string") {
    return position;
  }

  return position.set ?? null;
}

export async function validateTagUuids(tagUuids: string[]) {
  if (tagUuids.length === 0) {
    return { ok: true as const, tagUuids };
  }

  const matchingTags = await prisma.contentTag.findMany({
    where: {
      uuid: {
        in: tagUuids,
      },
    },
    select: {
      uuid: true,
    },
  });

  if (matchingTags.length !== tagUuids.length) {
    const validTagUuids = new Set(matchingTags.map((tag) => tag.uuid));
    const missingTagUuids = tagUuids.filter(
      (tagUuid) => !validTagUuids.has(tagUuid),
    );

    return {
      ok: false as const,
      missingTagUuids,
    };
  }

  return { ok: true as const, tagUuids };
}

export async function findContentByUuid(uuid: string) {
  return prisma.content.findUnique({
    where: { uuid },
  });
}

export async function findTagByUuid(uuid: string) {
  return prisma.contentTag.findUnique({
    where: { uuid },
  });
}

export async function findActiveLock(uuid: string) {
  return prisma.contentEditLock.findUnique({
    where: { contentUuid: uuid },
    include: contentLockInclude,
  });
}

type ActiveContentLock = NonNullable<
  Awaited<ReturnType<typeof findActiveLock>>
>;

export function serializeLock(lock: ActiveContentLock) {
  return {
    contentUuid: lock.contentUuid,
    lockedByEmpUuid: lock.lockedByEmpUuid,
    lockedAt: lock.lockedAt,
    locked_by: {
      uuid: lock.lockedByEmp.uuid,
      firstName: lock.lockedByEmp.firstName,
      lastName: lock.lockedByEmp.lastName,
      corporateEmail: lock.lockedByEmp.corporateEmail,
    },
  };
}

export function parseContentUuid(
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

export function parseTagUuid(
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

export function parseTagContentUuids(
  req: express.Request,
  res: express.Response,
) {
  const params = TagContentParamsSchema.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ message: "Invalid tag or content UUID" });
    return null;
  }

  return params.data;
}

export function normalizeTagName(name: string) {
  const trimmedName = name.trim();
  return {
    name: trimmedName,
    normalizedName: trimmedName.toLowerCase(),
  };
}

export function parseContentFilters(
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

export function buildContentFilterClause(
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

export async function loadAccessibleContent(
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

  if (!canManagePosition(auth, content.forPosition)) {
    if (options?.logUnauthorized) {
      logger.warn(
        `Rejected Content request for record ${uuid}: target position ${content.forPosition}, user position ${auth.position}`,
      );
    }
    res
      .status(options?.unauthorizedStatus ?? 401)
      .json({ message: "Unauthorized" });
    return null;
  }

  return content;
}

export async function rejectIfLockedByAnotherUser(
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

export async function createOrRefreshLock(
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

export async function resolveContentUrl({
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

  logger.verbose(
    `Uploading ${uuid}.${mime.extension(file.mimetype)} to ${STORAGE_BUCKET}`,
  );
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

export function getContentListInclude(employeeUuid: string) {
  return {
    favoritedBy: {
      where: { employeeUuid },
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
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    },
  } satisfies Prisma.ContentInclude;
}

export function serializeContentList(content: ContentListItem[]) {
  return content.map(({ favoritedBy, tagAssignments, _count, ...item }) => ({
    ...item,
    tags: tagAssignments.map(({ tag }) => tag),
    is_favorite: favoritedBy.length > 0,
    favorite_count: _count.favoritedBy,
  }));
}

export function normalizeQueryList(value: unknown): string[] {
  if (typeof value === "undefined") {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];
  return values.filter((item): item is string => typeof item === "string");
}

export function getSearchFilterClauses(query: express.Request["query"]) {
  const positionFilters = normalizeQueryList(query.position);
  const fileTypeFilters = normalizeQueryList(query.fileType);
  const tagUuidFilters = normalizeQueryList(query.tagUuid);
  const clauses: Prisma.ContentWhereInput[] = [];

  if (positionFilters.length > 0) {
    clauses.push({ forPosition: { in: positionFilters as Position[] } });
  }

  if (fileTypeFilters.length > 0) {
    clauses.push({ fileType: { in: fileTypeFilters } });
  }

  if (tagUuidFilters.length > 0) {
    clauses.push({
      tagAssignments: {
        some: {
          tagUuid: {
            in: tagUuidFilters,
          },
        },
      },
    });
  }

  return clauses;
}

export function getTagActionFromMethod(method: string) {
  switch (method) {
    case "POST": {
      return TagAction.CREATE;
    }
    case "DELETE": {
      return TagAction.DELETE;
    }
    default: {
      return TagAction.INVALID;
    }
  }
}

export { getVisibleContentWhere };
