import { uuid } from "zod";

const environment = import.meta.env.VITE_APP_ENV;
console.log("Environment: ", environment);

const apiBaseUrlMap = {
  production: "https://teamg-app-backend.vercel.app",
  staging:
    "https://teamg-app-backend-env-staging-cs-3733-d26-team-g.vercel.app",
  development: "http://localhost:3000",
};

export const API_BASE_URL =
  apiBaseUrlMap[environment as keyof typeof apiBaseUrlMap];

export const API_ENDPOINTS = {
  ACTIVITY: `${API_BASE_URL}/activity`,
  LOGIN: `${API_BASE_URL}/login`,
  LOGOUT: `${API_BASE_URL}/logout`,
  SESSION: `${API_BASE_URL}/session`,
  PROFILE: `${API_BASE_URL}/profile`,
  PROFILE_AVATAR: `${API_BASE_URL}/profile/avatar`,
  ACCOUNT_SETTINGS: `${API_BASE_URL}/account-settings`,
  EMPLOYEE: `${API_BASE_URL}/employee`,
  EMPLOYEE_CREATE: `${API_BASE_URL}/employee/create`,
  EMPLOYEE_UPDATE: (uuid: string) => `${API_BASE_URL}/employee/update/${uuid}`,
  EMPLOYEE_DELETE: (uuid: string) => `${API_BASE_URL}/employee/delete/${uuid}`,

  CONTENT: `${API_BASE_URL}/content`,
  CONTENT_CREATE: `${API_BASE_URL}/content/create`,
  CONTENT_COUNT_POSITION: `${API_BASE_URL}/content/count/position`,
  CONTENT_FAVORITE: (uuid: string) =>
    `${API_BASE_URL}/content/favorite/${uuid}`,
  CONTENT_EDIT: (uuid: string) => `${API_BASE_URL}/content/edit/${uuid}`,
  CONTENT_DELETE: (uuid: string) => `${API_BASE_URL}/content/delete/${uuid}`,
  CONTENT_LOCK: (uuid: string) => `${API_BASE_URL}/content/lock/${uuid}`,
  CONTENT_FILE: (uuid: string) => `${API_BASE_URL}/content/file/${uuid}`,
  CONTENT_TAGS: `${API_BASE_URL}/content/count/tags`,
  CONTENT_TAG_CREATE: `${API_BASE_URL}/content/tag/create`,
  CONTENT_TAG_DELETE: (uuid: string) =>
    `${API_BASE_URL}/content/tag/delete/${uuid}`,
};
