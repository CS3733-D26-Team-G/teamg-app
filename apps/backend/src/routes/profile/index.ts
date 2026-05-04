import express from "express";
import { prisma } from "@repo/db";
import { getAuth, sendInternalError } from "../../lib/request.ts";
import { logger } from "../../logger.ts";
import multer from "multer";
import mime from "mime-types";
import { supabase } from "../../lib/supabase.ts";
import {
  buildAvatarPath,
  getAvatarBucketName,
} from "../../lib/avatar-storage.ts";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../login/utils.ts";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 1,
  },
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(1),
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
        avatarSupabasePath: true,
      },
    });

    if (!existingEmployee) {
      return res.status(404).json({ message: "Profile not found" });
    }

    logger.verbose(
      `Uploading avatar for employee ${auth.employeeUuid} to Supabase path ${avatarPath}`,
    );

    const previousAvatarPath = existingEmployee.avatarSupabasePath;

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
        avatarSupabasePath: uploadedAvatarPath,
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

router.put("/change-password", async (req, res) => {
  const auth = getAuth(req);
  const body = ChangePasswordSchema.safeParse(req.body);

  if (!body.success) {
    logger.verbose(
      `Failed to parse change password request body:\n${body.error.issues}`,
    );
    return res.status(400).json({ message: body.error.issues });
  }

  try {
    logger.verbose(
      `Querying Account table while changing password for employee ${auth.employeeUuid}`,
    );

    const account = await prisma.account.findUnique({
      where: { employeeUuid: auth.employeeUuid },
      select: {
        username: true,
        password: true,
      },
    });

    if (!account) {
      logger.warn(
        `Failed to find account while changing password for employee ${auth.employeeUuid}`,
      );
      return res.status(404).json({ message: "Account not found" });
    }

    if (!verifyPassword(body.data.currentPassword, account.password)) {
      logger.warn(
        `Rejected password change request with invalid current password for username ${account.username}`,
      );
      return res.status(401).json({ message: "Invalid current password" });
    }

    await prisma.account.update({
      where: { username: account.username },
      data: {
        password: hashPassword(body.data.newPassword),
      },
    });

    logger.info(`Changed password for username ${account.username}`);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (e) {
    return sendInternalError(
      res,
      `Failed to change password for employee ${auth.employeeUuid}`,
      e,
    );
  }
});

export default router;
