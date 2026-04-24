import express from "express";
import { prisma } from "@repo/db";
import { getAuth, sendInternalError } from "../lib/request.ts";
import { logger } from "../logger.ts";
import multer from "multer";
import mime from "mime-types";
import { supabase } from "../lib/supabase.ts";
import { buildAvatarPath, getAvatarBucketName } from "../lib/avatar-storage.ts";

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

  try {
    logger.verbose(
      `Querying Employee table for profile data for employee ${auth.employeeUuid}`,
    );

    const profile = await prisma.employee.findUnique({
      where: { uuid: auth.employeeUuid },
    });

    return res.status(200).json(profile);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to load profile for ${auth.employeeUuid}`,
      e,
    );
  }
});

export default router;

router.put("/avatar", upload.single("avatar"), async (req, res) => {
  const auth = getAuth(req);

  if (!req.file) {
    return res.status(400).json({ message: "Avatar file is required" });
  }

  const ext = mime.extension(req.file.mimetype);
  if (!ext) {
    return res.status(400).json({ message: "Unsupported avatar file type" });
  }

  const avatarBucket = getAvatarBucketName();
  const avatarPath = buildAvatarPath(auth.employeeUuid, ext);
  let uploadedAvatarPath: string | null = null;

  try {
    const existingEmployee = await prisma.employee.findUnique({
      where: { uuid: auth.employeeUuid },
      select: {
        uuid: true,
        avatar_supabase_path: true,
      },
    });

    if (!existingEmployee) {
      return res.status(404).json({ message: "Profile not found" });
    }

    logger.verbose(
      `Uploading avatar for employee ${auth.employeeUuid} to Supabase path ${avatarPath}`,
    );

    const previousAvatarPath = existingEmployee.avatar_supabase_path;

    if (previousAvatarPath) {
      const deleteResult = await supabase.storage
        .from(avatarBucket)
        .remove([previousAvatarPath]);

      if (!deleteResult.data) {
        logger.warn(
          `Failed to delete existing avatar for employee ${auth.employeeUuid} at path ${previousAvatarPath}: ${deleteResult.error?.message}`,
        );
      } else {
        logger.verbose(
          `Deleted existing avatar for employee ${auth.employeeUuid} at path ${previousAvatarPath}`,
        );
      }
    }

    const uploadResult = await supabase.storage
      .from(avatarBucket)
      .upload(avatarPath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (!uploadResult.data) {
      logger.error(
        `Failed to upload avatar for employee ${auth.employeeUuid}: ${uploadResult.error?.message}`,
      );
      return res.status(500).json({
        message: uploadResult.error?.message ?? "Failed to upload avatar",
      });
    }

    uploadedAvatarPath = uploadResult.data.path;

    const {
      data: { publicUrl },
    } = supabase.storage
      .from(avatarBucket)
      .getPublicUrl(uploadResult.data.path);

    const employee = await prisma.employee.update({
      where: { uuid: auth.employeeUuid },
      data: {
        avatar: publicUrl,
        avatar_supabase_path: uploadedAvatarPath,
      },
    });

    return res.status(200).json(employee);
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to update avatar for ${auth.employeeUuid}`,
      e,
    );
  }
});
