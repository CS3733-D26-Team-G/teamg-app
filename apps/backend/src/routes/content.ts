import express from "express";
import { prisma } from "@repo/db";
import { Prisma } from "@repo/db";
import multer from "multer";
import { supabase } from "../lib/supabase.ts";

import { Schemas } from "@repo/zod";
import { randomUUID } from "crypto";
import { z } from "zod";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 1,
  },
});

router.get("/", async (_req, res) => {
  res.status(200).json(await prisma.content.findMany());
});

router.post("/create", upload.single("file"), async (req, res) => {
  const auth = req.auth!;
  const parsed = Schemas.ContentCreateInputObjectZodSchema.extend({
    url: z.string().optional(),
  }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues });
  }

  if ((!parsed.data.url && !req.file) || (parsed.data.url && req.file)) {
    return res.status(400).json({
      message: "Either one of URL or file must be specified!",
    });
  }

  if (auth.position !== "ADMIN" && auth.position !== parsed.data.for_position) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let url = parsed.data.url;

  const uuid = randomUUID();
  if (req.file) {
    const uploadResult = await supabase.storage
      .from("teamg-app")
      .upload(`content/${uuid}`, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });
    if (!uploadResult.data) {
      console.error(uploadResult.error);
      return res.status(500).json({ message: uploadResult.error.message });
    }
    const createResult = await supabase.storage
      .from("teamg-app")
      .createSignedUrl(
        uploadResult.data.path,
        Math.floor((parsed.data.expiration_time.getTime() - Date.now()) / 1000),
      );
    if (!createResult.data) {
      console.error(createResult.error);
      return res.status(500).json({ message: createResult.error.message });
    }
    url = createResult.data.signedUrl;
  }

  if (!url) {
    return res.status(500).json({ message: "" });
  }
  const data = { url, uuid, ...parsed.data };

  try {
    const content = await prisma.content.create({ data });
    res.status(201).json(content);
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      return res.status(500).json({
        message:
          "Internal server error. If you see this message, please report to a system administrator",
      });
  }
});

router.put("/edit/:uuid", async (req, res) => {
  const auth = req.auth!;
  const uuid = req.params.uuid;

  const body = Schemas.ContentUpdateInputObjectZodSchema.omit({ uuid: true })
    .partial()
    .safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ message: body.error.issues });
  }
  const data = body.data;
  if (auth.position !== "ADMIN" && auth.position !== data.for_position) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const content = await prisma.content.update({
      where: { uuid: uuid },
      data,
    });
    res.status(200).json(content);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      return res.status(400).json({ message: "Invalid content UUID" });
    }
    console.error(e);
    return res.status(500).json({
      message:
        "Internal server error. If you see this message, please report to a system administrator",
    });
  }
});

router.post("/delete/:uuid", async (req, res) => {
  const contentUuid = req.params.uuid;
  const auth = req.auth!;

  try {
    const content = await prisma.content.findUniqueOrThrow({
      where: { uuid: contentUuid },
    });
    if (auth.position !== "ADMIN" && auth.position !== content.for_position) {
      res.status(401).json({ message: "Unauthorized" });
    }
    await prisma.content.delete({ where: content });

    res.status(200).json(content);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      res.status(400).json({
        message: "Invalid content UUID",
      });
    }
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

    res.status(200).json(updatedContent);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      res.status(400).json({ message: "Invalid content UUID" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

export default router;
