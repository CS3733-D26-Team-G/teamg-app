const AVATAR_BUCKET = "teamg-avatars";

export function getAvatarBucketName() {
  return AVATAR_BUCKET;
}

export function buildAvatarPath(employeeUuid: string, extension: string) {
  return `${employeeUuid}.${extension}`;
}
