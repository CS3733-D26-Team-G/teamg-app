import express from "express";
import { prisma, Prisma } from "@repo/db";
import { Schemas } from "@repo/zod";
import { logger } from "../logger.ts";
import { INTERNAL_ERROR_MESSAGE } from "../config.ts";

const router = express.Router();

router.use(async (req, res, next) => {
  const auth = req.auth!;
  if (auth.position !== "ADMIN") {
    logger.warn(
      `Rejected Employee route request from user with position ${auth.position}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
});

router.get("/", async (_req, res) => {
  logger.verbose("Querying Employee table for all records");
  try {
    const employees = await prisma.employee.findMany();
    logger.verbose(
      `Queried Employee table for all records: found ${employees.length} record(s)`,
    );
    return res.status(200).send(employees);
  } catch (e) {
    logger.error(`Failed to query Employee table for all records:\n${e}`);
    return res.status(500).json({ message: INTERNAL_ERROR_MESSAGE });
  }
});

router.post("/create", async (req, res) => {
  const body = Schemas.EmployeeCreateInputObjectSchema.safeParse(req.body);
  if (!body.success) {
    logger.verbose(
      `Failed to parse Employee create request body:\n${body.error.issues}`,
    );
    return res.status(400).json({ message: body.error.issues });
  }

  const data = body.data;

  logger.verbose("Inserting Employee table record");
  try {
    const employee = await prisma.employee.create({ data });
    logger.verbose(`Inserted Employee table record ${employee.uuid}`);
    return res.status(201).json(employee);
  } catch (e) {
    logger.error(`Failed to insert Employee table record:\n${e}`);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({
        message: INTERNAL_ERROR_MESSAGE,
      });
    }
    return res.status(500).json({
      message: INTERNAL_ERROR_MESSAGE,
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
    logger.verbose(
      `Failed to parse Employee update request body for record ${uuid}:\n${body.error.issues}`,
    );
    return res.status(400).json({ message: body.error.issues });
  }

  const data = body.data;

  logger.verbose(`Updating Employee table record ${uuid}`);
  try {
    const employee = await prisma.employee.update({
      where: { uuid },
      data,
    });
    logger.verbose(`Updated Employee table record ${uuid}`);
    return res.status(200).json({ message: employee });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      logger.warn(
        `Received update request for Employee table record ${uuid} that does not exist`,
      );
      return res.status(400).json({ message: "Invalid employee UUID" });
    }

    logger.error(`Failed to update Employee table record ${uuid}:\n${e}`);
    return res.status(500).json({
      message: INTERNAL_ERROR_MESSAGE,
    });
  }
});

router.post("/delete/:uuid", async (req, res) => {
  const uuid = req.params.uuid;

  logger.verbose(`Deleting Employee table record ${uuid}`);
  try {
    const employee = await prisma.employee.delete({ where: { uuid } });
    logger.verbose(`Deleted Employee table record ${uuid}`);
    return res.status(200).json(employee);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      logger.warn(
        `Received delete request for Employee table record ${uuid} that does not exist`,
      );
      return res.status(400).json({
        message: "Invalid employee UUID",
      });
    }

    logger.error(`Failed to delete Employee table record ${uuid}:\n${e}`);
    return res.status(500).json({
      message: INTERNAL_ERROR_MESSAGE,
    });
  }
});

export default router;
