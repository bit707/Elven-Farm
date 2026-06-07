import { cpSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { readSteamReleaseConfig } from "./steam-release-config.mjs";

const outDir = join("dist", "xiannong-dongtian-steam-depot");
const contentDir = join(outDir, "content");
const steamworksDir = join(outDir, "steamworks");
const qaDir = join(outDir, "qa");
const copied = [];

const steamConfig = readSteamReleaseConfig();
const STEAM_APP_ID = steamConfig.appId;
const STEAM_DEPOT_ID = steamConfig.depotId;
const BUILD_BRANCH = steamConfig.branch;
const standaloneDir = join("dist", "xiannong-dongtian-standalone");
const desktopShellDir = join("dist", "xiannong-dongtian-desktop-shell");
const windowsStagingDir = join("dist", "xiannong-dongtian-windows-staging");

const contentEntries = [
  "index.html",
  "package.json",
  "README_GAME.md",
  "PROJECT_CONTEXT.md",
  "assets",
  "src",
  "tools/dev-server.mjs",
  "csv",
];

const qaEntries = [
  "csv/release_readiness_gate.csv",
  "csv/demo_qa_checklist.csv",
  "csv/vertical_slice_acceptance.csv",
  "csv/achievement_config.csv",
  "csv/save_schema_registry.csv",
  "csv/save_migration_plan.csv",
  "csv/steam_asset_production_plan.csv",
  "仙农洞天-Steam首发发行交付清单.md",
  "仙农洞天-Steam商店页文案草案.md",
  "仙农洞天-Steam截图执行脚本.md",
];

function copyEntry(source, target) {
  if (!existsSync(source)) throw new Error(`Missing Steam depot source: ${source}`);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
  copied.push({ source, target });
}

function writeText(target, text) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text.trimStart(), "utf8");
  copied.push({ source: "generated", target });
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const entry of contentEntries) {
  copyEntry(entry, join(contentDir, entry));
}

if (existsSync(standaloneDir)) {
  copyEntry(standaloneDir, join(contentDir, "standalone-offline"));
}

if (existsSync(desktopShellDir)) {
  copyEntry(desktopShellDir, join(contentDir, "desktop-shell-staging"));
}

if (existsSync(join(windowsStagingDir, "bin"))) {
  copyEntry(join(windowsStagingDir, "bin"), join(contentDir, "bin"));
  if (existsSync(join(windowsStagingDir, "launcher"))) copyEntry(join(windowsStagingDir, "launcher"), join(contentDir, "windows-staging", "launcher"));
  if (existsSync(join(windowsStagingDir, "release-evidence"))) copyEntry(join(windowsStagingDir, "release-evidence"), join(contentDir, "windows-staging", "release-evidence"));
  for (const entry of ["desktop-manifest.json", "WINDOWS_STAGING_README.md"]) {
    if (existsSync(join(windowsStagingDir, entry))) copyEntry(join(windowsStagingDir, entry), join(contentDir, "windows-staging", entry));
  }
}

for (const entry of qaEntries) {
  copyEntry(entry, join(qaDir, basename(entry)));
}

writeText(join(contentDir, "steam_appid.txt"), `${STEAM_APP_ID}\n`);

writeText(
  join(contentDir, "launch-local.cmd"),
  `
@echo off
cd /d "%~dp0"
node tools\\dev-server.mjs
`
);

writeText(
  join(contentDir, "launch-local.ps1"),
  `
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
node tools/dev-server.mjs
`
);

writeText(
  join(steamworksDir, `app_build_${STEAM_APP_ID}.vdf`),
  `
"AppBuild"
{
  "AppID" "${STEAM_APP_ID}"
  "Desc" "${steamConfig.description}${steamConfig.configured ? "" : " - replace placeholders before upload"}"
  "Preview" "1"
  "Local" "..\\content"
  "SetLive" "${BUILD_BRANCH}"
  "ContentRoot" "..\\content"
  "BuildOutput" "..\\steam_build_output"
  "Depots"
  {
    "${STEAM_DEPOT_ID}" "depot_build_${STEAM_DEPOT_ID}.vdf"
  }
}
`
);

writeText(
  join(steamworksDir, `depot_build_${STEAM_DEPOT_ID}.vdf`),
  `
"DepotBuild"
{
  "DepotID" "${STEAM_DEPOT_ID}"
  "ContentRoot" "..\\content"
  "FileMapping"
  {
    "LocalPath" "*"
    "DepotPath" "."
    "recursive" "1"
  }
}
`
);

writeText(
  join(steamworksDir, "README_STEAMPIPE.md"),
  `
# SteamPipe Staging 说明

这个目录是 Steam 上传前的 staging 模板，不是已授权的最终 Steamworks 配置。

## 当前内容

- \`../content/\`：当前可运行 Web Demo 内容，包含 \`steam_appid.txt\` 占位文件和本地启动脚本。
- \`../content/standalone-offline/\`：如果已运行 \`npm run package:standalone\`，会带入单文件离线 HTML，作为桌面壳/离线评审输入。
- \`../content/desktop-shell-staging/\`：如果已运行 \`npm run package:desktop-shell\`，会带入 Electron main/preload 与 Steamworks stub 桥接骨架。
- \`../content/bin/XiannongDongtian.exe\`：如果已运行 \`npm run package:windows\` 且本机有 C# 编译器，会带入未签名 launcher exe 候选。
- \`../content/windows-staging/launcher/\`：launcher 源码、图标和自检证据。
- \`app_build_${STEAM_APP_ID}.vdf\`：SteamPipe AppBuild 模板。
- \`depot_build_${STEAM_DEPOT_ID}.vdf\`：SteamPipe DepotBuild 模板。
- \`../qa/\`：上传前需要对照的 Demo QA、Release Gate、成就、存档、Steam 素材和商店页资料。

## 配置来源

- 当前配置源：\`${steamConfig.source}\`
- AppID：\`${STEAM_APP_ID}\`
- DepotID：\`${STEAM_DEPOT_ID}\`
- Branch：\`${BUILD_BRANCH}\`

可复制根目录 \`steam-release.config.example.json\` 为 \`steam-release.config.json\`，或使用环境变量 \`XIANNONG_STEAM_APP_ID\`、\`XIANNONG_STEAM_DEPOT_ID\`、\`XIANNONG_STEAM_BRANCH\`、\`XIANNONG_STEAM_BUILD_DESC\` 覆盖。

## 上传前必须替换

- 将 \`${STEAM_APP_ID}\` 替换为 Steamworks 后台真实 AppID。
- 将 \`${STEAM_DEPOT_ID}\` 替换为 Windows depot 的真实 DepotID。
- 可先运行 \`npm run package:windows\` 审查 Windows staging；正式上传前仍必须将当前 Node 本地服务器启动方式替换为 Windows x64 桌面可执行文件。
- 当前 launcher exe 只用于结构预审；正式上传前仍必须替换/升级为已签名、带 Steamworks SDK 的 Windows x64 客户端。
- 将 \`Preview\` 从 \`1\` 改为正式策略前，先使用 SteamCMD preview 构建确认文件映射。
- 将 \`SetLive\` 分支改为团队实际使用的 beta/default 分支。
- 运行 \`npm run steam:preflight\` 生成本地文件哈希、VDF 摘要和阻塞项报告，再进行 SteamCMD preview。

## 建议 SteamCMD 命令

\`\`\`powershell
steamcmd +login <steam_user> +run_app_build .\\steamworks\\app_build_${STEAM_APP_ID}.vdf +quit
\`\`\`

当前阶段请只用于结构审查和 QA 对齐，不要直接上传到正式分支。
`
);

writeText(
  join(qaDir, "STEAM_DEPOT_READINESS.md"),
  `
# Steam Depot Readiness

当前 depot staging 包状态：\`not_upload_ready\`。

## 已具备

- 可运行 Web Demo 内容已放入 \`content/\`。
- 已生成 standalone 包时，会同步放入 \`content/standalone-offline/\`，降低对 Node dev-server 的评审依赖。
- 已生成 desktop shell staging 时，会同步放入 \`content/desktop-shell-staging/\`，作为替换正式 Windows executable 前的工程审查输入。
- 已生成 Windows staging 时，会同步放入 \`content/bin/XiannongDongtian.exe\`，作为未签名 launcher executable 候选。
- \`steam_appid.txt\`、AppBuild VDF 和 DepotBuild VDF 已生成占位模板。
- QA、Release Gate、成就、存档、Steam 素材计划和商店页资料已集中到 \`qa/\`。
- 本地启动脚本可用于上传前冒烟测试。
- 可运行 \`npm run steam:preflight\` 生成 \`preflight/STEAM_PREFLIGHT_REPORT.md\` 与 \`preflight/STEAM_FILE_MANIFEST.json\`。

## 未完成

- 缺少真实 Steam AppID / DepotID。
- 可生成 Windows staging 包，但缺少正式 Windows x64 executable 或安装器。
- Steamworks SDK 尚未注入 \`XiannongSteamworks\`。
- 未完成 SteamCMD preview build、depot diff、分支发布和回滚演练。
- Release Gate rrg_012 仍需真实平台/法务/授权证据。
`
);

const manifest = {
  name: "仙农洞天：精怪工坊 Steam Depot Staging",
  version: "0.4.0-steam-depot-staging",
  status: "not_upload_ready",
  generated_at: new Date().toISOString(),
  app_id: STEAM_APP_ID,
  depot_id: STEAM_DEPOT_ID,
  branch: BUILD_BRANCH,
  steam_release_config: {
    source: steamConfig.source,
    configured: steamConfig.configured,
    example: "steam-release.config.example.json",
    environment: ["XIANNONG_STEAM_APP_ID", "XIANNONG_STEAM_DEPOT_ID", "XIANNONG_STEAM_BRANCH", "XIANNONG_STEAM_BUILD_DESC"],
  },
  launch_local: ["content/launch-local.cmd", "content/launch-local.ps1"],
  steamworks_templates: [
    `steamworks/app_build_${STEAM_APP_ID}.vdf`,
    `steamworks/depot_build_${STEAM_DEPOT_ID}.vdf`,
  ],
  preflight: "npm run steam:preflight",
  blockers: [
    "Replace placeholder Steam AppID and DepotID",
    "Replace unsigned launcher with signed Steamworks-enabled Windows x64 executable",
    "Inject real Steamworks SDK bridge",
    "Replace desktop-shell stub with signed executable output",
    "Run SteamCMD preview build and QA smoke test",
    "Attach platform/legal approval evidence for rrg_012",
  ],
  files: copied.map(({ source, target }) => ({
    source,
    path: target.replace(`${outDir}\\`, "").replaceAll("\\", "/"),
    kind: existsSync(target) && statSync(target).isDirectory() ? "directory" : "file",
    name: basename(target),
  })),
};

writeFileSync(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifest, null, 2), "utf8");

console.log(`Steam depot staging package created: ${outDir}`);
console.log(`Included ${copied.length} entries.`);
console.log(steamConfig.configured
  ? "Status: not_upload_ready; Steam IDs configured, replace desktop executable and Steamworks SDK before SteamCMD upload."
  : "Status: not_upload_ready; replace AppID/DepotID and desktop executable before SteamCMD upload.");
