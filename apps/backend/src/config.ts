export const isProd = process.env.NODE_ENV === "production";
const vercelTargetEnv = process.env.VERCEL_TARGET_ENV || "N/A";
export const environment =
  vercelTargetEnv !== "N/A" ? vercelTargetEnv : "development";
export const allowedOriginsMap = {
  production: ["https://teamg-app-frontend.vercel.app"],
  staging: [
    "https://teamg-app-frontend-env-staging-cs-3733-d26-team-g.vercel.app",
  ],
  development: [
    "http://localhost:5147",
    "http://localhost:9999",
    "http://localhost:9999",
  ],
};

export const authExclude = ["/login"];
export const STORAGE_BUCKET = "teamg-app";
export const INTERNAL_ERROR_MESSAGE =
  "Internal server error. If you see this message, please report to a system administrator";
