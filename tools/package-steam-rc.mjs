import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const outDir = join("dist", "xiannong-dongtian-steam-rc");
const gameDir = join(outDir, "game");
const standaloneDir = join("dist", "xiannong-dongtian-standalone");
const desktopShellDir = join("dist", "xiannong-dongtian-desktop-shell");
const copied = [];

const gameEntries = [
  "index.html",
  "package.json",
  "README_GAME.md",
  "PROJECT_CONTEXT.md",
  "assets",
  "src",
  "tools",
  "csv",
];

const steamDocs = [
  "仙农洞天-Steam商店页文案草案.md",
  "仙农洞天-Steam截图执行脚本.md",
  "仙农洞天-Steam首发发行交付清单.md",
  "仙农洞天-核心玩法PV分镜脚本.md",
  "仙农洞天-短视频切片执行单.md",
];

const qaTables = [
  "csv/vertical_slice_acceptance.csv",
  "csv/demo_qa_checklist.csv",
  "csv/release_readiness_gate.csv",
  "csv/steam_asset_production_plan.csv",
  "csv/achievement_config.csv",
  "csv/save_schema_registry.csv",
  "csv/save_migration_plan.csv",
  "csv/localization_coverage_plan.csv",
];

function copyEntry(source, target) {
  if (!existsSync(source)) throw new Error(`Missing Steam RC source: ${source}`);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
  copied.push({ source, target });
}

function copyIfExists(source, target) {
  if (existsSync(source)) copyEntry(source, target);
}

function writeText(target, text) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text.trimStart(), "utf8");
  copied.push({ source: "generated", target });
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const entry of gameEntries) {
  copyEntry(entry, join(gameDir, entry));
}

if (existsSync(standaloneDir)) {
  copyEntry(standaloneDir, join(outDir, "standalone-offline"));
}

if (existsSync(desktopShellDir)) {
  copyEntry(desktopShellDir, join(outDir, "desktop-shell-staging"));
}

for (const entry of readdirSync(".")) {
  if (extname(entry).toLowerCase() === ".md") {
    copyEntry(entry, join(outDir, "design-docs", basename(entry)));
  }
}

for (const doc of steamDocs) {
  copyIfExists(doc, join(outDir, "steam", basename(doc)));
}

for (const table of qaTables) {
  copyEntry(table, join(outDir, "qa", basename(table)));
}

writeText(
  join(outDir, "launch-demo.ps1"),
  `
$ErrorActionPreference = "Stop"
Set-Location -Path (Join-Path $PSScriptRoot "game")
node tools/dev-server.mjs
`
);

writeText(
  join(outDir, "launch-demo.cmd"),
  `
@echo off
cd /d "%~dp0game"
node tools\\dev-server.mjs
`
);

writeText(
  join(outDir, "README_STEAM_RC.md"),
  `
# 《仙农洞天：精怪工坊》Steam RC 交付包

这是当前 Web playable slice 的 Steam 发行候选交付包，用于 QA、发行、美术和制作人对齐，不等同于已经可直接上传 Steamworks 的最终商店包。

## 快速启动

\`\`\`powershell
.\\launch-demo.ps1
\`\`\`

或者：

\`\`\`cmd
launch-demo.cmd
\`\`\`

启动后打开：

\`\`\`text
http://127.0.0.1:4173
\`\`\`

## 目录说明

- \`game/\`：当前可运行 Demo 构建，包含 \`index.html\`、\`src/\`、\`assets/\`、\`csv/\` 和开发服务器。
- \`standalone-offline/\`：如果已运行 \`npm run package:standalone\`，会带入单文件离线 HTML，用于不依赖 dev server 的发行评审或桌面壳输入。
- \`desktop-shell-staging/\`：如果已运行 \`npm run package:desktop-shell\`，会带入 Electron main/preload、Steamworks stub bridge 和打包模板。
- \`design-docs/\`：项目根目录下全部 Markdown 方案文件，用于发行、QA、制作和外包追溯。
- \`steam/\`：商店页文案、截图脚本、首发交付清单、PV/短视频执行资料和 Steamworks 缺口说明。
- \`qa/\`：垂直切片、Demo QA、发行门禁、Steam 素材、成就、存档和本地化相关验收表。
- \`BUILD_MANIFEST.json\`：本次 RC 包的文件、状态、启动方式和未完成平台项。

## 当前结论

当前包已经能证明核心 Demo 循环、配置资料、发行素材计划和验收门禁正在收束；但仍必须完成 Steamworks SDK、桌面壳/安装包、最终商店实机截图、平台合规、完整 QA 和法务确认，才能声称可正式上架。
`
);

writeText(
  join(outDir, "steam", "STEAMWORKS_GAP_REPORT.md"),
  `
# Steamworks 缺口说明

当前 RC 包主动标记为 \`not_steam_final\`，原因如下：

- 尚未接入 Steamworks SDK 的真实成就同步、云存档 Remote Storage、Overlay 和 AppID 配置。
- 当前启动方式仍为本地 Node 开发服务器；可通过 \`npm run package:windows\` 生成 Windows staging 包，通过 \`npm run package:steam-depot\` 生成 SteamPipe staging 模板，但尚未生成 Windows 桌面可执行文件、安装包或可上传 depot。
- 当前 SVG/Canvas 素材适合 Demo 和商店素材评审，不代表最终美术、音频、Logo、胶囊图和 PV 已全部定稿。
- \`release_readiness_gate.csv\` 中 Release 阶段的商店素材实机化、平台和法务确认仍需要真实 QA 证据。
- 仍需进行 Steam Deck/手柄兼容、崩溃恢复、存档破坏、性能、字幕、本地化和可访问性回归测试。

建议下一阶段优先：

1. 运行 \`npm run package:windows\` 审查 Windows staging 启动结构。
2. 运行 \`npm run package:steam-depot\` 审查 SteamPipe staging 结构。
3. 引入桌面壳或正式引擎包体，输出 Windows x64 可执行文件。
4. 替换本地成就/云存档镜像为 Steamworks SDK 调用，并保留离线失败重试。
5. 运行 \`npm run evidence:qa\` 生成 QA evidence bundle，并让 QA/发行逐项签收。
6. 用真实运行画面导出至少 8 张 Steam 截图和 1 支核心玩法 PV。
7. 将 \`demo_qa_checklist.csv\` 与 \`release_readiness_gate.csv\` 的每一项绑定到实测证据。
`
);

const manifest = {
  name: "仙农洞天：精怪工坊 Steam Release Candidate",
  version: "0.3.0-steam-rc",
  status: "not_steam_final",
  generated_at: new Date().toISOString(),
  launch: {
    powershell: "launch-demo.ps1",
    cmd: "launch-demo.cmd",
    url: "http://127.0.0.1:4173",
  },
  contents: {
    game: "Playable web demo build with CSV-driven systems and generated assets",
    design_docs: "All root Markdown design, production, narrative, UI, and release documents",
    steam: "Store copy, screenshot/PV plans, launch checklist, and Steamworks gap report",
    qa: "Vertical slice, Demo QA, release readiness, asset, achievement, save, and localization gates",
  },
  release_evidence: {
    current_demo: "P0 loop and static gates are verified by npm run verify before packaging",
    commercial_gap: "Steamworks SDK, desktop executable, final media, legal/platform approval, and full QA remain required",
    windows_staging: "Run npm run package:windows to generate a script-launchable Windows desktop staging package",
    steam_depot_staging: "Run npm run package:steam-depot to generate SteamPipe VDF placeholders and upload readiness notes",
    standalone_offline: "Run npm run package:standalone before RC packaging to include standalone-offline/index.html",
    desktop_shell_staging: "Run npm run package:desktop-shell before RC packaging to include desktop-shell-staging with XiannongSteamworks stub bridge",
    qa_evidence_bundle: "Run npm run evidence:qa to generate QA_EVIDENCE.md and EVIDENCE_SUMMARY.json",
  },
  files: copied.map(({ source, target }) => ({
    source,
    path: target.replace(`${outDir}\\`, "").replaceAll("\\", "/"),
    kind: existsSync(target) && statSync(target).isDirectory() ? "directory" : "file",
    name: basename(target),
  })),
};

writeFileSync(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifest, null, 2), "utf8");

console.log(`Steam RC package created: ${outDir}`);
console.log(`Included ${copied.length} entries.`);
console.log("Status: not_steam_final; Steamworks SDK, desktop executable, final media, legal/platform approval, and full QA remain required.");
