export const isProd = process.env.NODE_ENV === "production";
const vercelTargetEnv = process.env.VERCEL_TARGET_ENV || "N/A";
export const environment =
  vercelTargetEnv !== "N/A" ? vercelTargetEnv : "development";
export const allowedOriginsMap = {
  production: ["https://teamg-app-frontend.vercel.app"],
  staging: [
    "https://teamg-app-frontend-env-staging-cs-3733-d26-team-g.vercel.app",
  ],
  development: ["http://localhost:9999"],
};

import contentRouter from "./routes/content.ts";
import employeeRouter from "./routes/employee.ts";
import loginRouter from "./routes/login.ts";
import logoutRouter from "./routes/logout.ts";

export const routeMap = {
  content: contentRouter,
  employee: employeeRouter,
  login: loginRouter,
  logout: logoutRouter,
};
