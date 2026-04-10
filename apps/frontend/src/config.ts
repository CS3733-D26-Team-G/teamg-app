const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL =
  isLocal ? "http://localhost:3000" : "https://teamg-app-backend.vercel.app";

export const API_ENDPOINTS = {
  EMPLOYEE: `${API_BASE_URL}/employee`,
  EMPLOYEE_CREATE: `${API_BASE_URL}/employee/create`,
  EMPLOYEE_UPDATE: (uuid: string) => `${API_BASE_URL}/employee/update/${uuid}`,
  EMPLOYEE_DELETE: (uuid: string) => `${API_BASE_URL}/employee/delete/${uuid}`,

  CONTENT: `${API_BASE_URL}/content`,
  CONTENT_CREATE: `${API_BASE_URL}/content/create`,
  CONTENT_EDIT: (uuid: string) => `${API_BASE_URL}/content/edit/${uuid}`,
  CONTENT_DELETE: (uuid: string) => `${API_BASE_URL}/content/delete/${uuid}`,
};