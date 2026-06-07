import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import {
  DESKTOP_JSON_SAVE_ADAPTER,
  readDesktopJsonProfile,
  SAVE_DIR_NAME,
  savePathForProfile,
  writeDesktopJsonProfile,
} from "../desktop-shell/json-save-core.mjs";

const userData = mkdtempSync(join(tmpdir(), "xiannong-desktop-save-"));
const reportDir = join("dist", "xiannong-dongtian-desktop-save-smoke");
const reportPath = join(reportDir, "DESKTOP_JSON_SAVE_SMOKE.json");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pathInside(child, parent) {
  return `${resolve(child)}${sep}`.startsWith(`${resolve(parent)}${sep}`);
}

try {
  const missing = readDesktopJsonProfile(userData, "profile_1");
  assert(missing.ok === false && missing.missing === true, "Missing desktop save should be reported as missing");
  assert(missing.adapter === DESKTOP_JSON_SAVE_ADAPTER, "Missing desktop save should report desktop JSON adapter");

  const payload = {
    schemaVersion: 1,
    profileId: "profile_1",
    day: 12,
    inventory: { item_food_bailuobo_tang: 3 },
    savedAt: "2026-06-07T00:00:00.000Z",
  };
  const rawPayload = JSON.stringify(payload, null, 2);
  const written = writeDesktopJsonProfile(userData, "profile_1", rawPayload);
  assert(written.ok === true, "Desktop save write should succeed");
  assert(written.adapter === DESKTOP_JSON_SAVE_ADAPTER, "Desktop save write should use desktop JSON adapter");
  assert(written.path.endsWith(`${sep}${SAVE_DIR_NAME}${sep}profile_1.json`), "Desktop save path should target userData/saves/profile_1.json");
  assert(existsSync(written.path), "Desktop save file should exist after write");
  assert(readFileSync(written.path, "utf8") === rawPayload, "Desktop save file should contain exact payload");

  const readBack = readDesktopJsonProfile(userData, "profile_1");
  assert(readBack.ok === true, "Desktop save read should succeed");
  assert(readBack.payload === rawPayload, "Desktop save read should return exact payload");
  assert(JSON.parse(readBack.payload).inventory.item_food_bailuobo_tang === 3, "Desktop save payload should preserve gameplay data");

  const unsafePath = savePathForProfile(userData, "../profile escape?.json");
  assert(pathInside(unsafePath, join(userData, SAVE_DIR_NAME)), "Sanitized desktop save path must stay inside saves directory");
  writeDesktopJsonProfile(userData, "../profile escape?.json", "{\"ok\":true}");
  assert(existsSync(unsafePath), "Sanitized desktop save profile should still be writable");

  const report = {
    status: "pass",
    adapter: DESKTOP_JSON_SAVE_ADAPTER,
    userData,
    defaultProfilePath: written.path,
    sanitizedProfilePath: unsafePath,
    bytes: written.bytes,
    checks: [
      "missing profile reports missing",
      "profile_1 writes to userData/saves/profile_1.json",
      "readback preserves exact JSON payload",
      "sanitized profile path stays inside saves directory",
    ],
  };
  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`Desktop JSON save smoke passed: ${reportPath}`);
} finally {
  rmSync(userData, { recursive: true, force: true });
}
