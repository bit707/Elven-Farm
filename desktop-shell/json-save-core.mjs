import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";

export const DESKTOP_JSON_SAVE_ADAPTER = "desktop-json-save-v1";
export const SAVE_DIR_NAME = "saves";

export function safeFileName(value, fallback = "payload.json") {
  const text = String(value || fallback)
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 160);
  return text || fallback;
}

export function saveDirForUserData(userDataPath, saveDirName = SAVE_DIR_NAME) {
  const dir = join(userDataPath, saveDirName);
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function savePathForProfile(userDataPath, profileId = "profile_1") {
  const fileName = safeFileName(profileId || "profile_1", "profile_1").replace(/\.json$/i, "");
  const saveDir = saveDirForUserData(userDataPath);
  const targetPath = resolve(saveDir, `${fileName}.json`);
  const safeRoot = `${resolve(saveDir)}${sep}`;
  if (!`${targetPath}${sep}`.startsWith(safeRoot)) {
    throw new Error(`Unsafe desktop save profile path: ${profileId}`);
  }
  return targetPath;
}

export function readDesktopJsonProfile(userDataPath, profileId = "profile_1") {
  const path = savePathForProfile(userDataPath, profileId);
  if (!existsSync(path)) {
    return {
      ok: false,
      adapter: DESKTOP_JSON_SAVE_ADAPTER,
      path,
      missing: true,
      updatedAt: new Date().toISOString(),
    };
  }
  const payload = readFileSync(path, "utf8");
  return {
    ok: true,
    adapter: DESKTOP_JSON_SAVE_ADAPTER,
    path,
    payload,
    bytes: payload.length,
    updatedAt: new Date().toISOString(),
  };
}

export function writeDesktopJsonProfile(userDataPath, profileId = "profile_1", payload = "{}") {
  const path = savePathForProfile(userDataPath, profileId);
  const raw = String(payload || "{}");
  writeFileSync(path, raw, "utf8");
  return {
    ok: true,
    adapter: DESKTOP_JSON_SAVE_ADAPTER,
    path,
    bytes: raw.length,
    updatedAt: new Date().toISOString(),
  };
}
