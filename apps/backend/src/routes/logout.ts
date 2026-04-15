import express from "express";
import { isProd } from "../config.ts";

const router = express.Router();

router.post("/", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({ message: "Successfully logged out!" });
});

export default router;
