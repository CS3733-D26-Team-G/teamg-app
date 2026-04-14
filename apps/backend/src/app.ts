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
  : ["http://localhost:9999"];

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
  });
});

app.use(auth);

// import contentRouter from "./routes/content.ts";
// import employeeRouter from "./routes/employee.ts";
// import loginRouter from "./routes/login.ts";
// import logoutRouter from "./routes/logout.ts";
// app.use("/content", contentRouter);
// app.use("/employee", employeeRouter);
// app.use("/login", loginRouter);
// app.use("/login", logoutRouter);

const routes = ["content", "employee", "login", "logout"];
for (const route of routes) {
  const { default: router } = await import(`./routes/${route}.ts`);
  console.log(`Loaded /${route} route`);
  app.use(`/${route}`, router);
}

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;
