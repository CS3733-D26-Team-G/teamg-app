import express from "express";
import { isProd } from "../config.ts";
import { logger } from "../logger.ts";

const router = express.Router();

router.post("/", async (_req, res) => {
  logger.verbose("Processing logout request: clearing authentication cookie");

  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  logger.verbose("Processed logout request: authentication cookie cleared");
  return res.status(200).json({ message: "Successfully logged out!" });
});

export default router;
