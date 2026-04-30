import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const PASSWORD_HASH_PREFIX = "scrypt";
const SCRYPT_KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString(
    "hex",
  );
  return `${PASSWORD_HASH_PREFIX}$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedPassword: string) {
  const parts = storedPassword.split("$");
  if (parts.length !== 3 || parts[0] !== PASSWORD_HASH_PREFIX) {
    const providedBuffer = Buffer.from(password, "utf8");
    const storedBuffer = Buffer.from(storedPassword, "utf8");
    return (
      providedBuffer.length === storedBuffer.length &&
      timingSafeEqual(providedBuffer, storedBuffer)
    );
  }

  const [, salt, expectedKey] = parts;
  const derivedKey = scryptSync(password, salt, SCRYPT_KEY_LENGTH);
  const expectedBuffer = Buffer.from(expectedKey, "hex");
  return (
    derivedKey.length === expectedBuffer.length &&
    timingSafeEqual(derivedKey, expectedBuffer)
  );
}

export function isLegacyPlaintextPassword(storedPassword: string) {
  const parts = storedPassword.split("$");
  return parts.length !== 3 || parts[0] !== PASSWORD_HASH_PREFIX;
}
