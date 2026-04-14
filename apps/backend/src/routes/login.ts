import express from "express";
import { Prisma } from "@repo/db";
import { prisma } from "@repo/db";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { isProd } from "../config.ts";

const router = express.Router();
export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

router.post("/", async (req, res) => {
  try {
    const body = LoginSchema.parse(req.body);
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        username: body.username,
        password: body.password,
      },
    });

    const token = jwt.sign(
      {
        uuid: account.employeeUuid,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 1000 * 60 * 60,
      partitioned: true,
      path: "/",
    });

    const employee = await prisma.employee.findUnique({
      where: { uuid: account.employeeUuid },
    });
    if (employee == null) {
      return res.status(500).json({
        message:
          "Internal server error. If you see this message, please report to a system administrator",
      });
    }

    res.status(200).json({
      username: account.username,
      account_type: account.type,
      employee_position: employee.position,
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      res.status(500).json({ message: e });
      console.error(e);
    }
  }
});

export default router;
