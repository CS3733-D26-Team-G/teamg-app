import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { auth } from "./middlewares/auth.js";
import { isProd, environment, allowedOriginsMap, routeMap } from "./config.ts";

const app = express();
const port = process.env.PORT!;

console.log("Running as: ", isProd ? "production" : "development");

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

app.get("/", (_req, res) => {
  res.status(200).json({
    status: "200 OK",
    isProd,
    environment,
    allowedOrigins,
  });
});
app.use(auth);

for (const [path, router] of Object.entries(routeMap)) {
  console.log(`Loaded /${path} route`);
  app.use(`/${path}`, router);
}

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
