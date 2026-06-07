import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const gameJsPath = "src/game.js";
const outPath = join("runtime-data", "runtime-data.json");
const csvObjectPattern = /const DATA_FILES = \{([\s\S]*?)\};/;

function readText(path) {
  if (!existsSync(path)) throw new Error(`Missing runtime data source: ${path}`);
  return readFileSync(path, "utf8");
}

function writeIfChanged(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  if (existsSync(path) && readFileSync(path, "utf8") === text) return false;
  writeFileSync(path, text, "utf8");
  return true;
}

function parseDataFiles(gameJs) {
  const match = gameJs.match(csvObjectPattern);
  if (!match) throw new Error("Cannot locate DATA_FILES in src/game.js");
  return [...match[1].matchAll(/(\w+):\s*"([^"]+\.csv)"/g)].map(([, key, path]) => ({ key, path }));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const [headers = [], ...body] = rows;
  return {
    columns: headers,
    rows: body.map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
    ),
  };
}

function stableJson(value) {
  return JSON.stringify(value);
}

const dataFiles = parseDataFiles(readText(gameJsPath));
const files = {};

for (const { key, path } of dataFiles) {
  const parsed = parseCsv(readText(path));
  files[key] = {
    key,
    path,
    columns: parsed.columns,
    rowCount: parsed.rows.length,
    rows: parsed.rows,
  };
}

const baseManifest = {
  schemaVersion: 1,
  source: "csv",
  generatedBy: "tools/build-runtime-data.mjs",
  files,
};
const contentHash = createHash("sha256").update(stableJson(baseManifest)).digest("hex");
const manifest = {
  ...baseManifest,
  contentHash,
};
const json = `${JSON.stringify(manifest, null, 2)}\n`;
const changed = writeIfChanged(outPath, json);

console.log(`${changed ? "Wrote" : "Runtime data unchanged"} ${outPath}`);
console.log(`Converted ${dataFiles.length} CSV tables into runtime JSON (${contentHash.slice(0, 12)}).`);
