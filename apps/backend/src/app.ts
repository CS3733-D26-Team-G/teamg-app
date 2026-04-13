import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { auth } from "./middlewares/auth.js";

const app = express();
const port = process.env.PORT;

const isProd = process.env.NODE_ENV === "production";
console.log("Running as: ", isProd ? "production" : "testing");

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
const allowedOrigins =
  isProd ?
    ["https://teamg-app-frontend.vercel.app"]
  : ["http://localhost:10000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.get("/", (req, res) => {
  res.status(200).json({
    debug: {
      NODE_ENV: process.env.NODE_ENV,
    },
  });
});

app.use(auth);
// Send HTTP 200 at root

// const routesPath = join(process.cwd(), process.env.VERCEL == "1" ? "backend/apps/src/routes" : "src/routes");
// const routesPath = "/vercel/path0/apps/backend/src/routes";
// const routesPath = join("/vercel/path0/apps/backend/src/", "routes");
// for (const file of readdirSync(routesPath)) {
//   if (!file.endsWith(".js")) continue;
//   if (file.endsWith(".d.js")) continue;
//   if (file.startsWith("index.")) continue;
//
//   const { default: router } = await import(join(routesPath, file));
//   app.use(`/${file.replace(/\.js$/, "")}`, router);
// }

import contentRouter from "./routes/content.ts";
import employeeRouter from "./routes/employee.ts";
import loginRouter from "./routes/login.ts";
app.use("/content", contentRouter);
app.use("/employee", employeeRouter);
app.use("/login", loginRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
