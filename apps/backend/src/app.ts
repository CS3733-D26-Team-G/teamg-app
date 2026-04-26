import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { auth } from "./middlewares/auth.js";
import { isProd, environment, allowedOriginsMap } from "./config.ts";
import { logger } from "./logger.ts";

const app = express();
const port = process.env.PORT!;

logger.info(`isProd: ${isProd}`);

// Middleware
app.use(express.json());
const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};
app.use(morgan("dev", { stream: morganStream }));
app.use(cookieParser());

const allowedOrigins =
  allowedOriginsMap[environment as keyof typeof allowedOriginsMap];

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser / same-origin requests with no Origin header
    if (!origin) {
      logger.verbose("Received request with no Origin header");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      logger.debug(`Received request from allowed origin: ${origin}`);
      return callback(null, true);
    }

    logger.debug(`Received request from disallowed origin: ${origin}`);
    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "200 OK",
    isProd,
    environment,
    allowedOrigins,
  });
});
app.use(auth);

import contentRouter from "./routes/content.ts";
import employeeRouter from "./routes/employee.ts";
import loginRouter from "./routes/login.ts";
import logoutRouter from "./routes/logout.ts";
import sessionRouter from "./routes/session.ts";
import accountSettingsRouter from "./routes/account-settings.ts";
import activityRouter from "./routes/activity.ts";
import profileRouter from "./routes/profile.ts";
import statsRouter from "./routes/stats.ts";

const routeMap = {
  "account-settings": accountSettingsRouter,
  "activity": activityRouter,
  "content": contentRouter,
  "employee": employeeRouter,
  "login": loginRouter,
  "logout": logoutRouter,
  "session": sessionRouter,
  "profile": profileRouter,
  "stats": statsRouter,
};
for (const [path, router] of Object.entries(routeMap)) {
  logger.info(`Loaded /${path} route`);
  app.use(`/${path}`, router);
}

// Start server
app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});

export default app;
