"use strict";
var XiannongCore;
(function (XiannongCore) {
    var Data;
    (function (Data) {
        function globalValue(name) {
            return globalThis[name];
        }
        function isObject(value) {
            return typeof value === "object" && value !== null;
        }
        function isRuntimeDataFile(value) {
            if (!isObject(value))
                return false;
            return typeof value.key === "string"
                && typeof value.path === "string"
                && Array.isArray(value.columns)
                && Array.isArray(value.rows);
        }
        function isRuntimeDataManifest(value) {
            if (!isObject(value))
                return false;
            if (value.source !== "csv" || !isObject(value.files))
                return false;
            return Object.values(value.files).every(isRuntimeDataFile);
        }
        function cloneRows(rows) {
            return rows.map((row) => ({ ...row }));
        }
        function createRuntimeDataLoader(options = {}) {
            const manifestPath = options.manifestPath || "runtime-data/runtime-data.json";
            const embeddedGlobal = options.embeddedGlobal || "XIANNONG_EMBEDDED_RUNTIME_DATA";
            let manifestPromise = null;
            let lastMode = "idle";
            let lastHash = "";
            let lastError = "";
            async function loadManifest() {
                if (manifestPromise)
                    return manifestPromise;
                const embedded = globalValue(embeddedGlobal);
                if (isRuntimeDataManifest(embedded)) {
                    lastMode = "embedded-json";
                    lastHash = embedded.contentHash || "";
                    manifestPromise = Promise.resolve(embedded);
                    return manifestPromise;
                }
                manifestPromise = fetch(manifestPath)
                    .then(async (response) => {
                    if (!response.ok)
                        throw new Error(`Cannot load runtime data: ${manifestPath}`);
                    const manifest = await response.json();
                    if (!isRuntimeDataManifest(manifest)) {
                        throw new Error(`Invalid runtime data manifest: ${manifestPath}`);
                    }
                    lastMode = "runtime-json";
                    lastHash = manifest.contentHash || "";
                    return manifest;
                })
                    .catch((error) => {
                    lastMode = "csv-fallback";
                    lastError = error instanceof Error ? error.message : String(error);
                    return null;
                });
                return manifestPromise;
            }
            return {
                async loadTable(key, csvPath, fallback) {
                    const manifest = await loadManifest();
                    const file = manifest?.files[key];
                    if (file && file.path === csvPath)
                        return cloneRows(file.rows);
                    lastMode = "csv-fallback";
                    return fallback();
                },
                status() {
                    return {
                        mode: lastMode,
                        contentHash: lastHash,
                        error: lastError,
                    };
                },
            };
        }
        Data.createRuntimeDataLoader = createRuntimeDataLoader;
    })(Data = XiannongCore.Data || (XiannongCore.Data = {}));
})(XiannongCore || (XiannongCore = {}));
var XiannongCore;
(function (XiannongCore) {
    var Persistence;
    (function (Persistence) {
        function globalValue(name) {
            return globalThis[name];
        }
        function isObject(value) {
            return typeof value === "object" && value !== null;
        }
        function asDesktopBridge(value) {
            if (!isObject(value))
                return null;
            if (typeof value.writeProfile !== "function" && typeof value.readProfile !== "function")
                return null;
            return value;
        }
        function compactJson(payload) {
            return typeof payload === "string" ? payload : JSON.stringify(payload);
        }
        function prettyJson(payload) {
            return typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
        }
        function createSaveRuntime(options = {}) {
            const bridgeName = options.desktopBridgeName || "XiannongStorage";
            const browserStorage = options.localStorage
                || (globalValue("localStorage") ?? null);
            function desktopBridge() {
                return asDesktopBridge(globalValue(bridgeName));
            }
            return {
                writeBrowserSlot(key, payload) {
                    const raw = compactJson(payload);
                    if (!browserStorage) {
                        return {
                            ok: false,
                            adapter: "browser-localStorage",
                            path: key,
                            error: "localStorage unavailable",
                        };
                    }
                    browserStorage.setItem(key, raw);
                    return {
                        ok: true,
                        adapter: "browser-localStorage",
                        path: key,
                        bytes: raw.length,
                        updatedAt: new Date().toISOString(),
                    };
                },
                readBrowserSlot(key) {
                    return browserStorage?.getItem(key) ?? null;
                },
                async writeDesktopProfile(profileId, payload) {
                    const bridge = desktopBridge();
                    if (!bridge?.writeProfile) {
                        return {
                            ok: false,
                            adapter: "browser-localStorage",
                            path: profileId,
                            error: "desktop JSON save bridge unavailable",
                        };
                    }
                    try {
                        const raw = prettyJson(payload);
                        return await bridge.writeProfile(profileId, raw);
                    }
                    catch (error) {
                        return {
                            ok: false,
                            adapter: bridge.adapterId || bridge.mode || "desktop-json-save",
                            path: profileId,
                            error: error instanceof Error ? error.message : String(error),
                        };
                    }
                },
                async readDesktopProfile(profileId) {
                    const bridge = desktopBridge();
                    if (!bridge?.readProfile) {
                        return {
                            ok: false,
                            adapter: "browser-localStorage",
                            path: profileId,
                            missing: true,
                            error: "desktop JSON save bridge unavailable",
                        };
                    }
                    try {
                        return await bridge.readProfile(profileId);
                    }
                    catch (error) {
                        return {
                            ok: false,
                            adapter: bridge.adapterId || bridge.mode || "desktop-json-save",
                            path: profileId,
                            error: error instanceof Error ? error.message : String(error),
                        };
                    }
                },
                bridgeAvailable() {
                    return Boolean(desktopBridge());
                },
                adapterLabel() {
                    const bridge = desktopBridge();
                    return bridge?.adapterId || bridge?.mode || "browser-localStorage";
                },
            };
        }
        Persistence.createSaveRuntime = createSaveRuntime;
    })(Persistence = XiannongCore.Persistence || (XiannongCore.Persistence = {}));
})(XiannongCore || (XiannongCore = {}));
