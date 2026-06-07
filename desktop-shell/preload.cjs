const { contextBridge, ipcRenderer } = require("electron");
const { existsSync, readFileSync } = require("node:fs");
const { join } = require("node:path");

function stagedAppId() {
  const candidates = [
    join(__dirname, "..", "steam_appid.txt"),
    join(process.cwd(), "steam_appid.txt"),
  ];
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const value = readFileSync(path, "utf8").trim();
    if (value) return value;
  }
  return "TBD_APP_ID";
}

function invokeStub(payload) {
  return ipcRenderer.invoke("xiannong:steamworks-stub", {
    ...payload,
    at: new Date().toISOString(),
  });
}

function invokeSave(payload) {
  return ipcRenderer.invoke("xiannong:save-json", {
    ...payload,
    at: new Date().toISOString(),
  });
}

const bridge = {
  adapterId: "desktop-shell-steamworks-bridge-v1",
  mode: "desktop-shell-stub",
  bridgeReady: true,
  sdkReady: false,
  appId: stagedAppId(),
  evidenceMode: "desktop-shell-local-file-staging",
  features: {
    achievements: "stubbed",
    remote_storage: "stubbed",
    overlay: "stubbed",
    stats: "stubbed",
  },
  setAchievement(apiName) {
    return invokeStub({
      type: "setAchievement",
      apiName,
    });
  },
  storeStats() {
    return invokeStub({
      type: "storeStats",
    });
  },
  writeCloud(path, payload) {
    return invokeStub({
      type: "writeCloud",
      path,
      bytes: String(payload || "").length,
      payload,
    });
  },
  activateOverlay(target) {
    return invokeStub({
      type: "activateOverlay",
      target,
    });
  },
};

globalThis.XiannongSteamworks = bridge;

const storageBridge = {
  adapterId: "desktop-json-save-v1",
  mode: "electron-userData-json",
  writeProfile(profileId, payload) {
    return invokeSave({
      action: "write",
      profileId,
      payload,
    });
  },
  readProfile(profileId) {
    return invokeSave({
      action: "read",
      profileId,
    });
  },
};

globalThis.XiannongStorage = storageBridge;

if (contextBridge?.exposeInMainWorld) {
  contextBridge.exposeInMainWorld("XiannongSteamworks", bridge);
  contextBridge.exposeInMainWorld("XiannongStorage", storageBridge);
}
