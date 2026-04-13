import express from "express";
import { prisma } from "@repo/db";
import { Schemas } from "@repo/zod";
import { Prisma } from "@repo/db";
import { ZodError } from "zod";

const router = express.Router();

router.use(async (req, res, next) => {
  const auth = req.auth!;
  if (auth.position !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
});

router.get("/", async (req, res) => {
  res.status(200).send(await prisma.employee.findMany());
});

router.post("/create", async (req, res) => {
  const body = Schemas.EmployeeCreateInputObjectSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ message: body.error.issues });
  }
  const data = body.data;
  try {
    const employee = await prisma.employee.create({ data });
    res.status(201).json(employee);
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      return res.status(500).json({
        message:
          "Internal server error. If you see this message, please report to a system administrator",
      });
  }
});

router.put("/update/:uuid", async (req, res) => {
  const uuid = req.params.uuid;

  const body =
    Schemas.EmployeeUncheckedCreateWithoutAccountInputObjectZodSchema.omit({
      uuid: true,
    })
      .partial()
      .safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ message: body.error.issues });
  }
  const data = body.data;
  try {
    const employee = await prisma.employee.update({
      where: { uuid: uuid },
      data,
    });
    res.status(200).json({ message: employee });
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
  const uuid = req.params.uuid;

  try {
    const employee = await prisma.employee.delete({ where: { uuid: uuid } });
    res.status(200).json(employee);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      res.status(400).json({
        message: "Invalid content UUID",
      });
    }
    console.error(e);
    return res.status(500).json({
      message:
        "Internal server error. If you see this message, please report to a system administrator",
    });
  }
});

export default router;
