import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const outDir = join("dist", "xiannong-dongtian-standalone");
const outHtml = join(outDir, "index.html");
const csvObjectPattern = /const DATA_FILES = \{([\s\S]*?)\};/;
const assetMimeByExt = new Map([
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
]);

function readText(path) {
  if (!existsSync(path)) throw new Error(`Missing standalone source: ${path}`);
  return readFileSync(path, "utf8");
}

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, "utf8");
}

function parseDataFiles(gameJs) {
  const match = gameJs.match(csvObjectPattern);
  if (!match) throw new Error("Cannot locate DATA_FILES in src/game.js");
  return [...match[1].matchAll(/(\w+):\s*"([^"]+\.csv)"/g)].map(([, key, path]) => ({ key, path }));
}

function extname(path) {
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot).toLowerCase() : "";
}

function assetDataUrl(path) {
  const mime = assetMimeByExt.get(extname(path));
  if (!mime) throw new Error(`Unsupported embedded asset type: ${path}`);
  const raw = readFileSync(path);
  if (mime === "image/svg+xml") {
    return `data:${mime};charset=utf-8,${encodeURIComponent(raw.toString("utf8"))}`;
  }
  return `data:${mime};base64,${raw.toString("base64")}`;
}

function listAssets() {
  if (!existsSync("assets")) throw new Error("Missing assets directory");
  const found = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(path);
      } else if (assetMimeByExt.has(extname(entry.name))) {
        found.push(path.replaceAll("\\", "/"));
      }
    }
  };
  walk("assets");
  return found.sort();
}

function inlineHtml({ html, css, gameJs, csvPayload, assetPayload }) {
  const embeddedDataScript = [
    "<script>",
    "globalThis.XIANNONG_EMBEDDED_CSV = ",
    JSON.stringify(csvPayload),
    ";",
    "globalThis.XIANNONG_EMBEDDED_ASSETS = ",
    JSON.stringify(assetPayload),
    ";",
    "</script>",
  ].join("");

  const standaloneJs = gameJs.replace(/\/\/# sourceMappingURL=.*$/gm, "");
  return html
    .replace(/<link rel="stylesheet" href="src\/styles\.css" \/>/, () => `<style>\n${css}\n</style>`)
    .replace(/src="assets\/capsule-main\.svg"/g, () => `src="${assetPayload["assets/capsule-main.svg"]}"`)
    .replace(/<script type="module" src="src\/game\.js"><\/script>/, () => `${embeddedDataScript}\n    <script type="module">\n${standaloneJs}\n    </script>`);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const html = readText("index.html");
const css = readText("src/styles.css");
const gameJs = readText("src/game.js");
const dataFiles = parseDataFiles(gameJs);
const assets = listAssets();

const csvPayload = Object.fromEntries(
  dataFiles.map(({ path }) => {
    if (!existsSync(path)) throw new Error(`Missing embedded CSV: ${path}`);
    return [path, readText(path)];
  }),
);
const assetPayload = Object.fromEntries(assets.map((path) => [path, assetDataUrl(path)]));
const standaloneHtml = inlineHtml({ html, css, gameJs, csvPayload, assetPayload });

writeText(outHtml, standaloneHtml);

const manifest = {
  name: "仙农洞天：精怪工坊 Standalone Offline HTML",
  version: "0.7.0-standalone",
  status: "offline_html_staging",
  generated_at: new Date().toISOString(),
  output: "index.html",
  embedded_globals: ["XIANNONG_EMBEDDED_CSV", "XIANNONG_EMBEDDED_ASSETS"],
  embedded_csv_files: dataFiles.map(({ key, path }) => ({ key, path, bytes: statSync(path).size })),
  embedded_assets: assets.map((path) => ({ path, bytes: statSync(path).size })),
  launch: {
    direct_file: "index.html",
    recommended_review: "Open index.html in a Chromium-based browser or desktop shell; packaged Steam builds should still use a signed Windows x64 executable.",
  },
  commercial_boundaries: [
    "Standalone HTML removes the dev-server dependency for review and desktop-shell input.",
    "It is not a signed Windows executable, installer, or final Steam depot.",
    "Steamworks SDK, real AppID/DepotID, final capture media, and 2-hour manual QA remain required before Steam release.",
  ],
};

writeText(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifest, null, 2));

writeText(
  join(outDir, "STANDALONE_README.md"),
  `# 《仙农洞天：精怪工坊》Standalone Offline HTML

当前状态：\`offline_html_staging\`

这个包把当前 Demo 的 HTML、CSS、JS、CSV 配置表和程序化 SVG 资产内嵌到单个 \`index.html\` 中。它用于离线评审、发行候选检查，以及后续 Electron/Tauri/原生壳封装的输入。

## 启动

直接打开：

\`\`\`text
index.html
\`\`\`

推荐使用 Chromium 内核浏览器或桌面壳进行评审。存档、设置、成就 mock 和 Steam Cloud mirror 仍会写入浏览器 \`localStorage\`。

## 当前具备

- 内嵌 \`${dataFiles.length}\` 个运行时 CSV 文件。
- 内嵌 \`${assets.length}\` 个 SVG/图片资产。
- 不依赖 \`node tools/dev-server.mjs\` 加载配置和图像。
- 保留 \`XIANNONG_EMBEDDED_CSV\` 与 \`XIANNONG_EMBEDDED_ASSETS\` 两个全局数据入口，普通开发服务器模式仍可继续使用原始文件路径。

## 上架前边界

- 这不是最终 Windows \`.exe\` 或安装器。
- 这不是已替换真实 AppID/DepotID 的 Steam depot。
- 仍需真实 Steamworks SDK、签名桌面包体、最终实机截图/PV、SteamCMD preview、2 小时人工 QA 和平台/法务证据。
`,
);

console.log(`Standalone package created: ${outDir}`);
console.log(`Embedded ${dataFiles.length} CSV files and ${assets.length} assets into index.html.`);
