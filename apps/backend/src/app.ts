import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { readdirSync } from "node:fs";
import { join } from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { auth } from "./middlewares/auth.js";

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:9999",
    credentials: true,
  }),
);
app.use(auth);
// Send HTTP 200 at root
app.get("/", (req, res) => {
  res.sendStatus(200);
});

const routesPath = join(process.cwd(), process.env.VERCEL == "1" ? "backend/apps/src/routes" : "src/routes");
for (const file of readdirSync(routesPath)) {
  if (!file.endsWith(".js")) continue;
  if (file.endsWith(".d.js")) continue;
  if (file.startsWith("index.")) continue;

  const { default: router } = await import(`./routes/${file}`);
  app.use(`/${file.replace(/\.js$/, "")}`, router);
}

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
