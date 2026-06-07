namespace XiannongCore.Persistence {
  export interface BrowserStorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
  }

  export interface DesktopJsonSaveBridge {
    adapterId?: string;
    mode?: string;
    writeProfile?(profileId: string, payload: string): Promise<DesktopJsonSaveResult>;
    readProfile?(profileId: string): Promise<DesktopJsonSaveResult>;
  }

  export interface DesktopJsonSaveResult {
    ok: boolean;
    adapter?: string;
    path?: string;
    payload?: string;
    bytes?: number;
    missing?: boolean;
    error?: string;
    updatedAt?: string;
  }

  export interface SaveRuntimeOptions {
    desktopBridgeName?: string;
    localStorage?: BrowserStorageLike;
  }

  export interface SaveRuntime {
    writeBrowserSlot(key: string, payload: unknown): DesktopJsonSaveResult;
    readBrowserSlot(key: string): string | null;
    writeDesktopProfile(profileId: string, payload: unknown): Promise<DesktopJsonSaveResult>;
    readDesktopProfile(profileId: string): Promise<DesktopJsonSaveResult>;
    bridgeAvailable(): boolean;
    adapterLabel(): string;
  }

  function globalValue(name: string): unknown {
    return (globalThis as unknown as Record<string, unknown>)[name];
  }

  function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  function asDesktopBridge(value: unknown): DesktopJsonSaveBridge | null {
    if (!isObject(value)) return null;
    if (typeof value.writeProfile !== "function" && typeof value.readProfile !== "function") return null;
    return value as DesktopJsonSaveBridge;
  }

  function compactJson(payload: unknown): string {
    return typeof payload === "string" ? payload : JSON.stringify(payload);
  }

  function prettyJson(payload: unknown): string {
    return typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
  }

  export function createSaveRuntime(options: SaveRuntimeOptions = {}): SaveRuntime {
    const bridgeName = options.desktopBridgeName || "XiannongStorage";
    const browserStorage = options.localStorage
      || ((globalValue("localStorage") as BrowserStorageLike | undefined) ?? null);

    function desktopBridge(): DesktopJsonSaveBridge | null {
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
        } catch (error) {
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
        } catch (error) {
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
}
