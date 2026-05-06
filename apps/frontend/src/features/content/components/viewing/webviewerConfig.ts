export const WEBVIEWER_PATH = "/webviewer/lib";

const configuredLicenseKey = import.meta.env.VITE_APRYSE_LICENSE_KEY?.trim();

export const WEBVIEWER_LICENSE_KEY =
  configuredLicenseKey ? configuredLicenseKey : undefined;

if (!WEBVIEWER_LICENSE_KEY && !import.meta.env.DEV) {
  console.warn(
    "VITE_APRYSE_LICENSE_KEY is not configured. Apryse WebViewer editing features may be unavailable in deployed builds.",
  );
}
