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
  allowedOriginsMap[environment as keyof typeof allowedOriginsMap];

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Allow non-browser / same-origin requests with no Origin header
    if (!origin) {
      console.log("Received request with no Origin header");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log("Received request from matching origin: ", origin);
      return callback(null, true);
    }

    console.log("Received request from disallowed origin: ", origin);
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

for (const [path, router] of Object.entries(routeMap)) {
  console.log(`Loaded /${path} route`);
  app.use(`/${path}`, router);
}

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
