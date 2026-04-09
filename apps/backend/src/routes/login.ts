import express from "express";
import { Prisma, prisma } from "@repo/db";
import { z } from "zod";
import jwt from "jsonwebtoken";

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
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({
      username: account.username,
      account_type: account.type,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      res.status(401).json({ message: "Invalid credentials" });
    }
    console.error(e);
  }
});

export default router;
