import { app, BrowserWindow, ipcMain, shell } from "electron";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readDesktopJsonProfile, safeFileName, writeDesktopJsonProfile } from "./json-save-core.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(__dirname, "..");
const DEFAULT_ENTRY = join(APP_ROOT, "standalone-offline", "index.html");
const FALLBACK_ENTRY = join(APP_ROOT, "index.html");
const EVIDENCE_DIR_NAME = "steamworks-stub-evidence";

function evidenceDir(...parts) {
  const dir = join(app.getPath("userData"), EVIDENCE_DIR_NAME, ...parts);
  mkdirSync(dir, { recursive: true });
  return dir;
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

function registerJsonSaveIpc() {
  ipcMain.handle("xiannong:save-json", (_event, payload = {}) => {
    const profileId = String(payload.profileId || "profile_1");

    if (payload.action === "read") {
      return readDesktopJsonProfile(app.getPath("userData"), profileId);
    }

    return writeDesktopJsonProfile(app.getPath("userData"), profileId, payload.payload);
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
