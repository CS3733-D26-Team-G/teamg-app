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
  try {
    const body = Schemas.EmployeeCreateInputObjectSchema.parse(req.body);
    console.log(body);
    const employee = await prisma.employee.create({ data: body });
    console.log("created empoyee");
    res.status(200).send(employee);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});

router.put("/update/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    const body = Schemas.EmployeeUncheckedCreateWithoutAccountInputObjectZodSchema.omit(
      { uuid: true },
    )
      .partial()
      .parse(req.body);

    try {
      const employee = await prisma.employee.update({
        where: { uuid: uuid },
        data: body,
      });
      res.status(200).json({ message: employee });
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
      res.status(400).json({ message: e.issues });
    }
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
  }
});

export default router;
