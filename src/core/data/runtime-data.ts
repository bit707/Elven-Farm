namespace XiannongCore.Data {
  export type RuntimeDataRow = Record<string, string>;

  export interface RuntimeDataFile {
    key: string;
    path: string;
    columns: string[];
    rowCount: number;
    rows: RuntimeDataRow[];
  }

  export interface RuntimeDataManifest {
    schemaVersion: number;
    source: "csv";
    generatedBy: string;
    contentHash: string;
    files: Record<string, RuntimeDataFile>;
  }

  export interface RuntimeDataLoaderOptions {
    manifestPath?: string;
    embeddedGlobal?: string;
  }

  export interface RuntimeDataLoader {
    loadTable(
      key: string,
      csvPath: string,
      fallback: () => Promise<RuntimeDataRow[]>,
    ): Promise<RuntimeDataRow[]>;
    status(): {
      mode: "embedded-json" | "runtime-json" | "csv-fallback" | "idle";
      contentHash: string;
      error: string;
    };
  }

  function globalValue(name: string): unknown {
    return (globalThis as unknown as Record<string, unknown>)[name];
  }

  function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  function isRuntimeDataFile(value: unknown): value is RuntimeDataFile {
    if (!isObject(value)) return false;
    return typeof value.key === "string"
      && typeof value.path === "string"
      && Array.isArray(value.columns)
      && Array.isArray(value.rows);
  }

  function isRuntimeDataManifest(value: unknown): value is RuntimeDataManifest {
    if (!isObject(value)) return false;
    if (value.source !== "csv" || !isObject(value.files)) return false;
    return Object.values(value.files).every(isRuntimeDataFile);
  }

  function cloneRows(rows: RuntimeDataRow[]): RuntimeDataRow[] {
    return rows.map((row) => ({ ...row }));
  }

  export function createRuntimeDataLoader(options: RuntimeDataLoaderOptions = {}): RuntimeDataLoader {
    const manifestPath = options.manifestPath || "runtime-data/runtime-data.json";
    const embeddedGlobal = options.embeddedGlobal || "XIANNONG_EMBEDDED_RUNTIME_DATA";
    let manifestPromise: Promise<RuntimeDataManifest | null> | null = null;
    let lastMode: "embedded-json" | "runtime-json" | "csv-fallback" | "idle" = "idle";
    let lastHash = "";
    let lastError = "";

    async function loadManifest(): Promise<RuntimeDataManifest | null> {
      if (manifestPromise) return manifestPromise;

      const embedded = globalValue(embeddedGlobal);
      if (isRuntimeDataManifest(embedded)) {
        lastMode = "embedded-json";
        lastHash = embedded.contentHash || "";
        manifestPromise = Promise.resolve(embedded);
        return manifestPromise;
      }

      manifestPromise = fetch(manifestPath)
        .then(async (response) => {
          if (!response.ok) throw new Error(`Cannot load runtime data: ${manifestPath}`);
          const manifest = await response.json() as unknown;
          if (!isRuntimeDataManifest(manifest)) {
            throw new Error(`Invalid runtime data manifest: ${manifestPath}`);
          }
          lastMode = "runtime-json";
          lastHash = manifest.contentHash || "";
          return manifest;
        })
        .catch((error: unknown) => {
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
        if (file && file.path === csvPath) return cloneRows(file.rows);
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
}
