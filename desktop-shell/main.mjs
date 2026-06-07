import { app, BrowserWindow, ipcMain, shell } from "electron";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");
const DEFAULT_ENTRY = join(APP_ROOT, "standalone-offline", "index.html");
const FALLBACK_ENTRY = join(APP_ROOT, "index.html");
const EVIDENCE_DIR_NAME = "steamworks-stub-evidence";
const SAVE_DIR_NAME = "saves";

function evidenceDir(...parts) {
  const dir = join(app.getPath("userData"), EVIDENCE_DIR_NAME, ...parts);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function safeFileName(value, fallback = "payload.json") {
  const text = String(value || fallback)
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 160);
  return text || fallback;
}

function writeSteamworksEvidence(event) {
  const receivedAt = new Date().toISOString();
  const evidence = {
    ...event,
    payload: undefined,
    receivedAt,
    sdkReady: false,
    evidenceMode: "desktop-shell-local-file-staging",
  };

  if (event.type === "writeCloud") {
    const fileName = safeFileName(event.path, "xiannong_cloud_payload.json");
    const cloudDir = evidenceDir("remote-storage");
    const cloudPath = join(cloudDir, fileName.endsWith(".json") ? fileName : `${fileName}.json`);
    writeFileSync(cloudPath, String(event.payload || ""), "utf8");
    evidence.localPath = cloudPath;
  }

  const root = evidenceDir();
  appendFileSync(join(root, "steamworks-stub-events.jsonl"), `${JSON.stringify(evidence)}\n`, "utf8");
  writeFileSync(join(root, "latest-steamworks-stub-event.json"), JSON.stringify(evidence, null, 2), "utf8");
  return evidence;
}

function registerSteamworksStubIpc() {
  ipcMain.handle("xiannong:steamworks-stub", (_event, payload = {}) => writeSteamworksEvidence(payload));
}

function saveDir() {
  const dir = join(app.getPath("userData"), SAVE_DIR_NAME);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function savePathForProfile(profileId) {
  const fileName = safeFileName(profileId || "profile_1", "profile_1").replace(/\.json$/i, "");
  return join(saveDir(), `${fileName}.json`);
}

function registerJsonSaveIpc() {
  ipcMain.handle("xiannong:save-json", (_event, payload = {}) => {
    const profileId = String(payload.profileId || "profile_1");
    const path = savePathForProfile(profileId);

    if (payload.action === "read") {
      if (!existsSync(path)) {
        return {
          ok: false,
          adapter: "desktop-json-save-v1",
          path,
          missing: true,
          updatedAt: new Date().toISOString(),
        };
      }
      const saved = readFileSync(path, "utf8");
      return {
        ok: true,
        adapter: "desktop-json-save-v1",
        path,
        payload: saved,
        bytes: saved.length,
        updatedAt: new Date().toISOString(),
      };
    }

    const raw = String(payload.payload || "{}");
    writeFileSync(path, raw, "utf8");
    return {
      ok: true,
      adapter: "desktop-json-save-v1",
      path,
      bytes: raw.length,
      updatedAt: new Date().toISOString(),
    };
  });
}

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1180,
    minHeight: 720,
    title: "仙农洞天：精怪工坊",
    backgroundColor: "#f6f3e8",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
      contextIsolation: false,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.once("ready-to-show", () => win.show());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://") || url.startsWith("http://")) shell.openExternal(url);
    return { action: "deny" };
  });

  win.loadFile(process.env.XIANNONG_ENTRY || DEFAULT_ENTRY).catch(() => {
    win.loadFile(FALLBACK_ENTRY);
  });
}

app.setName("仙农洞天：精怪工坊");

app.whenReady().then(() => {
  registerSteamworksStubIpc();
  registerJsonSaveIpc();
  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
