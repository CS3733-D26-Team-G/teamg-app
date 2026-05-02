const environment = import.meta.env.VITE_APP_ENV;
// console.log("Environment: ", environment);

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
  PROFILE: {
    ROOT: `${API_BASE_URL}/profile`,
    AVATAR: `${API_BASE_URL}/profile/avatar`,
  },
  ACCOUNT_SETTINGS: `${API_BASE_URL}/account-settings`,
  STATS: {
    ACTIVITY_ACTION_SUMMARY: `${API_BASE_URL}/stats/activity/action-summary`,
    CONTENT_EDIT_HITS_BY_ROLE: `${API_BASE_URL}/stats/content/edit-hits-by-role`,
  },
  EMPLOYEE: {
    ROOT: `${API_BASE_URL}/employee`,
    CREATE: `${API_BASE_URL}/employee/create`,
    UPDATE: (uuid: string) => `${API_BASE_URL}/employee/update/${uuid}`,
    DELETE: (uuid: string) => `${API_BASE_URL}/employee/delete/${uuid}`,
  },
  CLAIM: {
    ROOT: `${API_BASE_URL}/claim`,
    GET: (uuid: string) => `${API_BASE_URL}/claim/${uuid}`,
    CREATE: `${API_BASE_URL}/claim/create`,
    UPDATE: (uuid: string) => `${API_BASE_URL}/claim/update/${uuid}`,
    DELETE: (uuid: string) => `${API_BASE_URL}/claim/delete/${uuid}`,
  },

  CONTENT: {
    ROOT: `${API_BASE_URL}/content`,
    CREATE: `${API_BASE_URL}/content/create`,
    COUNT_POSITION: `${API_BASE_URL}/stats/content/count/position`,
    COUNT_FILE_TYPE: `${API_BASE_URL}/stats/content/count/file-type`,
    COUNT_EDIT_HITS_BY_ROLE: `${API_BASE_URL}/stats/content/edit-hits-by-role`,
    VIEW: (uuid: string) => `${API_BASE_URL}/content/view/${uuid}`,
    FAVORITE: (uuid: string) => `${API_BASE_URL}/content/favorite/${uuid}`,
    EDIT: (uuid: string) => `${API_BASE_URL}/content/edit/${uuid}`,
    DELETE: (uuid: string) => `${API_BASE_URL}/content/delete/${uuid}`,
    LOCK: (uuid: string) => `${API_BASE_URL}/content/lock/${uuid}`,
    FILE: (uuid: string) => `${API_BASE_URL}/content/file/${uuid}`,
    TAG: {
      CREATE: `${API_BASE_URL}/content/tag/create`,
      DELETE: (uuid: string) => `${API_BASE_URL}/content/tag/delete/${uuid}`,
      UPDATE: (tagUuid: string, contentUuid: string) =>
        `${API_BASE_URL}/content/tag/update/${tagUuid}/${contentUuid}`,
      GET_ALL: `${API_BASE_URL}/content/tag`,
    },
  },
};
