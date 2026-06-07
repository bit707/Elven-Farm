import { cpSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { readSteamReleaseConfig } from "./steam-release-config.mjs";

const outDir = join("dist", "xiannong-dongtian-desktop-shell");
const copied = [];
const steamConfig = readSteamReleaseConfig();

const entries = [
  "desktop-shell",
  "PROJECT_CONTEXT.md",
  "README_GAME.md",
];

const standaloneDir = join("dist", "xiannong-dongtian-standalone");

function copyEntry(source, target) {
  if (!existsSync(source)) throw new Error(`Missing desktop shell source: ${source}`);
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

for (const entry of entries) {
  copyEntry(entry, join(outDir, entry));
}

copyEntry(standaloneDir, join(outDir, "standalone-offline"));

writeText(
  join(outDir, "steam_appid.txt"),
  `${steamConfig.appId}\n`,
);

writeText(
  join(outDir, "DESKTOP_SHELL_README.md"),
  `
# 《仙农洞天：精怪工坊》Desktop Shell Staging 包

当前状态：\`desktop_shell_staging\`

这个包把 \`standalone-offline/index.html\`、Electron main/preload、Steamworks stub bridge 和打包模板集中到一个可审查目录。它比脚本启动版 Windows staging 更接近最终 Steam 桌面客户端，但仍不是已签名的 Windows x64 可执行文件。

## 结构

- \`desktop-shell/main.mjs\`：Electron 主进程入口。
- \`desktop-shell/preload.cjs\`：向页面注入 \`globalThis.XiannongSteamworks\`，并通过 IPC 写入本地 Steamworks stub 证据。
- \`desktop-shell/package.template.json\`：Electron/electron-builder 模板，需要复制为最终客户端 package 配置并填真实依赖版本。
- \`standalone-offline/index.html\`：内嵌 CSV 和 SVG 的离线 Demo。
- \`steam_appid.txt\`：当前 AppID 为 \`${steamConfig.appId}\`，配置源 \`${steamConfig.source}\`；占位值必须在正式上传前替换。

## 当前桥接状态

\`XiannongSteamworks.bridgeReady = true\` 且 \`XiannongSteamworks.sdkReady = false\`。游戏内 Steamworks 面板会识别到桌面壳桥接形态，并将成就、Remote Storage、Overlay 与 Stats stub 调用写入 Electron \`userData/steamworks-stub-evidence/\`；但不会把 Release Gate \`rrg_012\` 误判为通过。

## 上架前必须完成

- 安装并锁定 Electron/electron-builder 或改用 Tauri/正式引擎壳。
- 将 \`preload.cjs\` 的 stub 替换为真实 Steamworks SDK 调用。
- 替换真实 Steam AppID/DepotID，或填写 \`steam-release.config.json\` / 环境变量，并生成可上传 depot 的 Windows x64 \`.exe\` 或安装器。
- 完成签名、SteamCMD preview、崩溃日志、路径权限、Steam Deck/手柄、2 小时人工 QA 和法务/平台证据。
`,
);

const manifest = {
  name: "仙农洞天：精怪工坊 Desktop Shell Staging",
  version: "0.8.0-desktop-shell",
  status: "desktop_shell_staging",
  generated_at: new Date().toISOString(),
  entry: "desktop-shell/main.mjs",
  preload: "desktop-shell/preload.cjs",
  web_entry: "standalone-offline/index.html",
  app_id: steamConfig.appId,
  steam_release_config: {
    source: steamConfig.source,
    configured: steamConfig.configured,
    example: "steam-release.config.example.json",
  },
  bridge: {
    global: "XiannongSteamworks",
    adapter_id: "desktop-shell-steamworks-bridge-v1",
    bridge_ready: true,
    sdk_ready: false,
    mode: "desktop-shell-stub",
    evidence_mode: "desktop-shell-local-file-staging",
    evidence_path: "Electron userData/steamworks-stub-evidence",
    required_replacement: "real Steamworks SDK bridge before rrg_012 can pass",
  },
  target_final_artifacts: [
    "XiannongDongtian.exe",
    "steam_appid.txt with real AppID",
    "steam_api64.dll or approved SDK bridge",
    "signed NSIS/portable package or Steam depot content",
  ],
  blockers: [
    "Electron/Tauri dependencies not installed in this repo",
    "Steamworks SDK calls are stubbed",
    "Desktop executable not built or signed",
    steamConfig.configured ? "Steam DepotID still must match Steamworks backend and depot package" : "Steam AppID/DepotID placeholders remain",
    "Manual QA and SteamCMD preview evidence missing",
  ],
  files: copied.map(({ source, target }) => ({
    source,
    path: target.replace(`${outDir}\\`, "").replaceAll("\\", "/"),
    kind: existsSync(target) && statSync(target).isDirectory() ? "directory" : "file",
    name: basename(target),
  })),
};

writeFileSync(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifest, null, 2), "utf8");

console.log(`Desktop shell staging package created: ${outDir}`);
console.log("Status: desktop_shell_staging; replace Steamworks stub and build a signed Windows executable before Steam upload.");
