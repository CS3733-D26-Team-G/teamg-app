import express from "express";
import { prisma } from "@repo/db";
import { Prisma } from "@repo/db";

import { ZodError } from "zod";
import { Schemas } from "@repo/zod";

const router = express.Router();

router.get("/", async (req, res) => {
  const auth = req.auth!;
  if (auth.position === "ADMIN") {
    res.status(200).json(await prisma.content.findMany());
  } else {
    res.status(200).json(
      await prisma.content.findMany({
        where: { for_position: auth.position },
      }),
    );
  }
});

router.post("/create", async (req, res) => {
  const auth = req.auth!;
  console.log(auth);
  try {
    const body = Schemas.ContentCreateInputObjectSchema.parse(req.body);
    console.log(body);
    if (auth.position !== "ADMIN" && auth.position !== body.for_position) {
      console.log("???");
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("about to create");
    try {
      const content = await prisma.content.create({ data: body });
      console.log(content);
      res.status(201).json(content);
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ message: e.issues });
      }
    }
  } catch (e) {
    console.log(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      return res.status(500).json({
        message:
          "Internal server error. If you see this message, please report to a system administrator ",
      });
  }
});

router.put("/edit/:uuid", async (req, res) => {
  const auth = req.auth!;
  const uuid = req.params.uuid;
  try {
    const body = Schemas.ContentUpdateInputObjectZodSchema.omit({ uuid: true })
      .partial()
      .parse(req.body);
    if (auth.position !== "ADMIN" && auth.position !== body.for_position) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const content = await prisma.content.update({
        where: { uuid: uuid },
        data: body,
      });
      res.status(200).json(content);
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        return res.status(400).json({ message: "Invalid content UUID" });
      }
    }
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e);
      res.status(400).json({ message: e.issues });
    }
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

export default router;
