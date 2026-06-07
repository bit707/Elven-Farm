import { cpSync, existsSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, dirname, join } from "node:path";
import { readWindowsReleaseConfig } from "./windows-release-config.mjs";

const outDir = join("dist", "xiannong-dongtian-windows-staging");
const appDir = join(outDir, "app");
const binDir = join(outDir, "bin");
const copied = [];
const launcherExe = join(binDir, "XiannongDongtian.exe");
const launcherSource = join(outDir, "launcher", "XiannongDongtianLauncher.cs");
const launcherIcon = join(outDir, "launcher", "XiannongDongtian.ico");
const launcherSelfCheck = join(outDir, "launcher", "launcher-self-check.json");
const releaseEvidenceDir = join(outDir, "release-evidence");
const cscPath = "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe";
const windowsConfig = readWindowsReleaseConfig();
const bundledPython = join(
  process.env.USERPROFILE || process.env.HOME || "",
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "python",
  "python.exe",
);

const appEntries = [
  "index.html",
  "package.json",
  "README_GAME.md",
  "PROJECT_CONTEXT.md",
  "assets",
  "src",
  "tools/dev-server.mjs",
  "csv",
];

const standaloneDir = join("dist", "xiannong-dongtian-standalone");
const desktopShellDir = join("dist", "xiannong-dongtian-desktop-shell");

function copyEntry(source, target) {
  if (!existsSync(source)) throw new Error(`Missing Windows staging source: ${source}`);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
  copied.push({ source, target });
}

function writeText(target, text) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text.trimStart(), "utf8");
  copied.push({ source: "generated", target });
}

function generateIcon() {
  const python = existsSync(bundledPython) ? bundledPython : "python";
  try {
    execFileSync(python, ["tools/generate-windows-icon.py", launcherIcon], { stdio: "pipe" });
    copied.push({ source: "generated", target: launcherIcon });
    return {
      path: launcherIcon.replaceAll("\\", "/"),
      bytes: statSync(launcherIcon).size,
      status: "icon_ready",
    };
  } catch (error) {
    return {
      path: launcherIcon.replaceAll("\\", "/"),
      bytes: 0,
      status: "icon_generation_failed",
      error: String(error.message || error),
    };
  }
}

function compileLauncher() {
  if (!existsSync(cscPath)) return null;
  const iconBuild = generateIcon();
  mkdirSync(dirname(launcherExe), { recursive: true });
  writeText(
    launcherSource,
    `
using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Windows.Forms;

namespace XiannongDongtianLauncher
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            string root = AppDomain.CurrentDomain.BaseDirectory;
            string packageRoot = Path.GetFullPath(Path.Combine(root, ".."));
            string standalone = Path.Combine(packageRoot, "standalone-offline", "index.html");
            string appHtml = Path.Combine(packageRoot, "app", "index.html");
            string desktopShell = Path.Combine(packageRoot, "desktop-shell-staging", "desktop-shell", "main.mjs");
            string evidencePath = Path.Combine(packageRoot, "launcher", "launcher-self-check.json");
            string target = File.Exists(standalone) ? standalone : appHtml;
            WriteSelfCheck(evidencePath, target, standalone, appHtml, desktopShell);

            if (!File.Exists(target))
            {
                MessageBox.Show("未找到可启动的 index.html。请确认 standalone-offline 或 app 目录完整。", "仙农洞天：精怪工坊", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = target,
                    UseShellExecute = true
                });
            }
            catch (Exception error)
            {
                MessageBox.Show(error.Message, "仙农洞天：精怪工坊 启动失败", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        static void WriteSelfCheck(string evidencePath, string target, string standalone, string appHtml, string desktopShell)
        {
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(evidencePath));
                string json = "{"
                    + "\\"generated_at\\":\\"" + DateTime.UtcNow.ToString("o") + "\\","
                    + "\\"launcher\\":\\"XiannongDongtian.exe\\","
                    + "\\"platform\\":\\"x64\\","
                    + "\\"target\\":\\"" + Escape(target) + "\\","
                    + "\\"standalone_exists\\":" + (File.Exists(standalone) ? "true" : "false") + ","
                    + "\\"app_html_exists\\":" + (File.Exists(appHtml) ? "true" : "false") + ","
                    + "\\"desktop_shell_exists\\":" + (File.Exists(desktopShell) ? "true" : "false") + ","
                    + "\\"steamworks_sdk\\":\\"not_linked\\","
                    + "\\"signature\\":\\"unsigned_staging\\""
                    + "}";
                File.WriteAllText(evidencePath, json, Encoding.UTF8);
            }
            catch
            {
                // Launch should not fail only because the evidence file could not be written.
            }
        }

        static string Escape(string value)
        {
            return value.Replace("\\\\", "\\\\\\\\").Replace("\\"", "\\\\\\"");
        }
    }
}
`,
  );
  try {
    const args = [
      "/nologo",
      "/target:winexe",
      "/platform:x64",
      `/out:${launcherExe}`,
      "/reference:System.dll",
      "/reference:System.Windows.Forms.dll",
    ];
    if (iconBuild.status === "icon_ready") args.push(`/win32icon:${launcherIcon}`);
    args.push(launcherSource);
    execFileSync(cscPath, args, { stdio: "pipe" });
    copied.push({ source: "generated", target: launcherExe });
    writeText(
      launcherSelfCheck,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          launcher: "XiannongDongtian.exe",
          platform: "x64",
          target: "standalone-offline/index.html",
          standalone_exists: existsSync(join(outDir, "standalone-offline", "index.html")),
          app_html_exists: existsSync(join(outDir, "app", "index.html")),
          desktop_shell_exists: existsSync(join(outDir, "desktop-shell-staging", "desktop-shell", "main.mjs")),
          steamworks_sdk: "not_linked",
          signature: "unsigned_staging",
        },
        null,
        2,
      ),
    );
    return {
      path: launcherExe.replaceAll("\\", "/"),
      bytes: statSync(launcherExe).size,
      compiler: cscPath,
      platform: "x64",
      icon: iconBuild,
      self_check: launcherSelfCheck.replaceAll("\\", "/"),
      status: "unsigned_launcher_exe",
    };
  } catch (error) {
    return {
      path: launcherExe.replaceAll("\\", "/"),
      bytes: 0,
      compiler: cscPath,
      status: "launcher_compile_failed",
      error: String(error.message || error),
    };
  }
}

function applyReleaseOverrides(launcherBuild) {
  const releaseEvidence = {
    source: windowsConfig.source,
    configured: windowsConfig.configured,
    signature: "unsigned_staging",
    steamworks_sdk: "not_linked",
    signed_exe: null,
    signature_evidence: null,
    steamworks_evidence: null,
  };

  if (windowsConfig.signedExePath) {
    if (!existsSync(windowsConfig.signedExePath)) throw new Error(`Configured signed exe not found: ${windowsConfig.signedExePath}`);
    copyEntry(windowsConfig.signedExePath, launcherExe);
    releaseEvidence.signed_exe = {
      source: windowsConfig.signedExePath,
      path: launcherExe.replaceAll("\\", "/"),
      bytes: statSync(launcherExe).size,
    };
    releaseEvidence.signature = windowsConfig.signatureReady ? "signed_evidence_attached" : "signed_exe_without_signature_evidence";
    launcherBuild = {
      ...(launcherBuild || {}),
      path: launcherExe.replaceAll("\\", "/"),
      bytes: statSync(launcherExe).size,
      platform: "x64",
      status: releaseEvidence.signature === "signed_evidence_attached" ? "signed_release_exe_candidate" : "unsigned_launcher_exe",
      replacement_source: windowsConfig.signedExePath,
    };
  }

  if (windowsConfig.signatureEvidencePath) {
    if (!existsSync(windowsConfig.signatureEvidencePath)) throw new Error(`Configured signature evidence not found: ${windowsConfig.signatureEvidencePath}`);
    const target = join(releaseEvidenceDir, basename(windowsConfig.signatureEvidencePath));
    copyEntry(windowsConfig.signatureEvidencePath, target);
    releaseEvidence.signature_evidence = target.replaceAll("\\", "/");
  }

  if (windowsConfig.steamworksEvidencePath) {
    if (!existsSync(windowsConfig.steamworksEvidencePath)) throw new Error(`Configured Steamworks evidence not found: ${windowsConfig.steamworksEvidencePath}`);
    const target = join(releaseEvidenceDir, basename(windowsConfig.steamworksEvidencePath));
    copyEntry(windowsConfig.steamworksEvidencePath, target);
    releaseEvidence.steamworks_evidence = target.replaceAll("\\", "/");
  }

  if (windowsConfig.steamworksSdkReady && releaseEvidence.steamworks_evidence) {
    releaseEvidence.steamworks_sdk = "sdk_ready_evidence_attached";
  }

  if (existsSync(launcherSelfCheck)) {
    writeText(
      launcherSelfCheck,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          launcher: "XiannongDongtian.exe",
          platform: "x64",
          target: "standalone-offline/index.html",
          standalone_exists: existsSync(join(outDir, "standalone-offline", "index.html")),
          app_html_exists: existsSync(join(outDir, "app", "index.html")),
          desktop_shell_exists: existsSync(join(outDir, "desktop-shell-staging", "desktop-shell", "main.mjs")),
          steamworks_sdk: releaseEvidence.steamworks_sdk,
          signature: releaseEvidence.signature,
        },
        null,
        2,
      ),
    );
  }

  return { launcherBuild, releaseEvidence };
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const entry of appEntries) {
  copyEntry(entry, join(appDir, entry));
}

if (existsSync(standaloneDir)) {
  copyEntry(standaloneDir, join(outDir, "standalone-offline"));
}

if (existsSync(desktopShellDir)) {
  copyEntry(desktopShellDir, join(outDir, "desktop-shell-staging"));
}

let launcherBuild = compileLauncher();
const releaseOverride = applyReleaseOverrides(launcherBuild);
launcherBuild = releaseOverride.launcherBuild;

writeText(
  join(outDir, "仙农洞天-启动Demo.cmd"),
  `
@echo off
setlocal
cd /d "%~dp0app"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js runtime was not found. Use the bundled desktop runtime in the final executable build.
  pause
  exit /b 1
)
start "" "http://127.0.0.1:4173"
node tools\\dev-server.mjs
`
);

writeText(
  join(outDir, "仙农洞天-启动Demo.ps1"),
  `
$ErrorActionPreference = "Stop"
Set-Location -Path (Join-Path $PSScriptRoot "app")
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js runtime was not found. Use the bundled desktop runtime in the final executable build."
}
Start-Process "http://127.0.0.1:4173"
node tools/dev-server.mjs
`
);

writeText(
  join(outDir, "WINDOWS_STAGING_README.md"),
  `
# 《仙农洞天：精怪工坊》Windows Staging 包

当前状态：\`${launcherBuild?.status === "unsigned_launcher_exe" ? "unsigned_launcher_exe_staging" : "not_executable_final"}\`

这是从 Web playable slice 过渡到 Windows 桌面包体的 staging 目录。当前会生成一个未签名的 Windows launcher executable，用于上传前包体结构预审；它还不是最终 Steam 可上传的签名 Windows x64 游戏客户端。

## 启动

\`\`\`cmd
bin\\XiannongDongtian.exe
\`\`\`

脚本启动备用入口：

\`\`\`cmd
仙农洞天-启动Demo.cmd
\`\`\`

或：

\`\`\`powershell
.\\仙农洞天-启动Demo.ps1
\`\`\`

## 当前具备

- \`app/\` 内含当前 Demo、CSV、资产和本地 dev server。
- \`standalone-offline/\` 会在已运行 \`npm run package:standalone\` 后被自动带入，提供不依赖本地 dev server 的单文件 HTML 评审入口。
- \`desktop-shell-staging/\` 会在已运行 \`npm run package:desktop-shell\` 后被自动带入，提供 Electron main/preload 与 \`XiannongSteamworks\` stub 桥接骨架。
- \`bin/XiannongDongtian.exe\` 默认是由本机 .NET Framework C# 编译器生成的未签名 launcher；若配置 \`windows-release.config.json\` 或环境变量提供正式 exe，则会替换为签名候选。
- 启动脚本会打开 \`http://127.0.0.1:4173\`。
- \`desktop-manifest.json\` 记录窗口、Steam 桥接、存档和替换 exe 需求。

## 上架前必须替换

- 用 Electron/Tauri/正式引擎壳或原生客户端生成正式 Windows x64 executable，或将当前 launcher 升级为带内嵌 WebView/Steamworks SDK 的客户端。
- 复制 \`windows-release.config.example.json\` 为 \`windows-release.config.json\`，填写 \`signed_exe_path\`、\`signature_evidence_path\`、\`steamworks_evidence_path\` 和 \`steamworks_sdk_ready\`。
- 对最终 \`.exe\` 或安装器签名，并完成安装/卸载与路径权限测试。
- 注入真实 \`XiannongSteamworks\` 桥接对象和 Steam AppID，并附上 SDK 回调/Overlay/Cloud/成就证据。
- 完成签名、安装/卸载、崩溃日志、路径权限、Steam Deck/手柄回归。
`
);

const desktopManifest = {
  name: "仙农洞天：精怪工坊",
  version: "0.6.0-windows-staging",
  status: launcherBuild?.status === "unsigned_launcher_exe" ? "unsigned_launcher_exe_staging" : "not_executable_final",
  entry: "app/index.html",
  standalone_entry: existsSync(join(outDir, "standalone-offline", "index.html")) ? "standalone-offline/index.html" : null,
  desktop_shell_entry: existsSync(join(outDir, "desktop-shell-staging", "desktop-shell", "main.mjs")) ? "desktop-shell-staging/desktop-shell/main.mjs" : null,
  launcher_exe: launcherBuild,
  release_evidence: releaseOverride.releaseEvidence,
  local_url: "http://127.0.0.1:4173",
  launchers: ["bin/XiannongDongtian.exe", "仙农洞天-启动Demo.cmd", "仙农洞天-启动Demo.ps1"],
  target_final_artifacts: [
    "XiannongDongtian.exe",
    "steam_appid.txt",
    "steam_api64.dll",
    "crash/log directory",
    "signed installer or Steam depot content",
  ],
  steamworks_bridge: {
    expected_global: "XiannongSteamworks",
    current_adapter: releaseOverride.releaseEvidence.steamworks_sdk === "sdk_ready_evidence_attached" ? "steamworks-sdk-evidence" : "local-mock",
    required_features: ["achievements", "remote_storage", "overlay", "stats"],
  },
  save_paths: {
    current_browser_storage: "localStorage",
    target_windows_path: "%USERPROFILE%/AppData/LocalLow/XiannongDongtian/profile.json",
    steam_cloud_path: "steam_cloud/xiannong_dongtian_profile.json",
  },
  blockers: [
    releaseOverride.releaseEvidence.signature === "signed_evidence_attached" ? "Signature evidence attached; verify certificate chain before upload" : "Launcher executable is unsigned or missing signature evidence",
    releaseOverride.releaseEvidence.steamworks_sdk === "sdk_ready_evidence_attached" ? "Steamworks SDK evidence attached; verify against real AppID before upload" : "Steamworks SDK not linked",
    "Installer/signing not configured",
    "Desktop shell bridge is stubbed until a real Steamworks SDK adapter is installed",
    "2-hour QA stability run not attached",
    "Final capture assets not replaced",
  ],
};

writeFileSync(join(outDir, "desktop-manifest.json"), JSON.stringify(desktopManifest, null, 2), "utf8");

const manifest = {
  name: "仙农洞天：精怪工坊 Windows Desktop Staging",
  version: desktopManifest.version,
  status: desktopManifest.status,
  generated_at: new Date().toISOString(),
  launchers: desktopManifest.launchers,
  files: copied.map(({ source, target }) => ({
    source,
    path: target.replace(`${outDir}\\`, "").replaceAll("\\", "/"),
    kind: existsSync(target) && statSync(target).isDirectory() ? "directory" : "file",
    name: basename(target),
  })),
};

writeFileSync(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifest, null, 2), "utf8");

console.log(`Windows staging package created: ${outDir}`);
console.log(`Status: ${desktopManifest.status}; replace launcher with a signed Steamworks-enabled Windows x64 executable before Steam upload.`);
