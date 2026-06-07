import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";

const depotDir = join("dist", "xiannong-dongtian-steam-depot");
const contentDir = join(depotDir, "content");
const steamworksDir = join(depotDir, "steamworks");
const qaDir = join(depotDir, "qa");
const outDir = join(depotDir, "preflight");
const reportJson = join(outDir, "STEAM_PREFLIGHT_REPORT.json");
const reportMd = join(outDir, "STEAM_PREFLIGHT_REPORT.md");
const fileManifestPath = join(outDir, "STEAM_FILE_MANIFEST.json");

function readText(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

function sha1(path) {
  return createHash("sha1").update(readFileSync(path)).digest("hex");
}

function walkFiles(root) {
  if (!existsSync(root)) return [];
  const result = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...walkFiles(path));
    else result.push(path);
  }
  return result.sort();
}

function parseQuotedValue(text, key) {
  return text.match(new RegExp(`"${key}"\\s+"([^"]+)"`))?.[1] || "";
}

function parseDepotMap(text) {
  const match = text.match(/"Depots"\s*\{([\s\S]*?)\n\}/);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"\s+"([^"]+)"/g)].map(([, depotId, script]) => ({ depotId, script }));
}

function extensionCounts(files) {
  const counts = new Map();
  for (const file of files) {
    const ext = extname(file).toLowerCase() || "(none)";
    counts.set(ext, (counts.get(ext) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([extension, count]) => ({ extension, count }));
}

function blocker(id, severity, evidence, nextStep) {
  return { id, severity, evidence, nextStep };
}

mkdirSync(outDir, { recursive: true });

const manifest = existsSync(join(depotDir, "BUILD_MANIFEST.json"))
  ? JSON.parse(readText(join(depotDir, "BUILD_MANIFEST.json")))
  : null;
const appBuildPath = manifest?.steamworks_templates?.[0] ? join(depotDir, manifest.steamworks_templates[0]) : "";
const depotBuildPath = manifest?.steamworks_templates?.[1] ? join(depotDir, manifest.steamworks_templates[1]) : "";
const appBuild = readText(appBuildPath);
const depotBuild = readText(depotBuildPath);
const contentFiles = walkFiles(contentDir);
const fileManifest = contentFiles.map((path) => {
  const stats = statSync(path);
  return {
    path: relative(contentDir, path).replaceAll("\\", "/"),
    bytes: stats.size,
    sha1: sha1(path),
  };
});
const totalBytes = fileManifest.reduce((sum, file) => sum + file.bytes, 0);

const appId = parseQuotedValue(appBuild, "AppID") || manifest?.app_id || "";
const depotId = parseQuotedValue(depotBuild, "DepotID") || manifest?.depot_id || "";
const preview = parseQuotedValue(appBuild, "Preview");
const contentRoot = parseQuotedValue(appBuild, "ContentRoot");
const depotContentRoot = parseQuotedValue(depotBuild, "ContentRoot");
const fileMappingLocal = parseQuotedValue(depotBuild, "LocalPath");
const fileMappingDepot = parseQuotedValue(depotBuild, "DepotPath");
const depotMap = parseDepotMap(appBuild);
const exeCandidates = fileManifest.filter((file) => file.path.toLowerCase().endsWith(".exe"));
const launcherExe = exeCandidates.find((file) => file.path === "bin/XiannongDongtian.exe");
const steamReadyPngs = fileManifest.filter((file) => file.path.startsWith("assets/steam-ready/png/") && file.path.endsWith(".png"));
const standaloneHtml = fileManifest.find((file) => file.path === "standalone-offline/index.html");
const desktopShellMain = fileManifest.find((file) => file.path === "desktop-shell-staging/desktop-shell/main.mjs");
const steamAppIdFile = readText(join(contentDir, "steam_appid.txt")).trim();
const windowsDesktopManifest = existsSync(join(contentDir, "windows-staging", "desktop-manifest.json"))
  ? JSON.parse(readText(join(contentDir, "windows-staging", "desktop-manifest.json")))
  : null;
const releaseEvidence = windowsDesktopManifest?.release_evidence || {};
const signatureReady = releaseEvidence.signature === "signed_evidence_attached" && Boolean(releaseEvidence.signature_evidence);
const steamworksReady = releaseEvidence.steamworks_sdk === "sdk_ready_evidence_attached" && Boolean(releaseEvidence.steamworks_evidence);
const launcherSelfCheck = fileManifest.find((file) => file.path === "windows-staging/launcher/launcher-self-check.json");
const launcherIcon = fileManifest.find((file) => file.path === "windows-staging/launcher/XiannongDongtian.ico");

const blockers = [];
if (!manifest) blockers.push(blocker("missing_depot_manifest", "critical", "BUILD_MANIFEST.json is missing.", "Run npm run package:steam-depot."));
if (!appBuild || !depotBuild) blockers.push(blocker("missing_vdf", "critical", "AppBuild or DepotBuild VDF is missing.", "Regenerate Steam depot staging."));
if (appId.includes("TBD") || depotId.includes("TBD") || steamAppIdFile.includes("TBD")) {
  blockers.push(blocker("placeholder_steam_ids", "critical", `AppID=${appId || "(missing)"}, DepotID=${depotId || "(missing)"}, steam_appid.txt=${steamAppIdFile || "(missing)"}.`, "Replace placeholders with Steamworks backend AppID and DepotID before SteamCMD upload."));
}
if (preview !== "1") blockers.push(blocker("preview_disabled", "high", `AppBuild Preview=${preview || "(missing)"}.`, "Keep Preview=1 for first SteamCMD dry-run until depot diff is reviewed."));
if (contentRoot !== "..\\content" || depotContentRoot !== "..\\content") {
  blockers.push(blocker("content_root_mismatch", "high", `AppBuild ContentRoot=${contentRoot}, DepotBuild ContentRoot=${depotContentRoot}.`, "Align both ContentRoot values with the staging content directory."));
}
if (fileMappingLocal !== "*" || fileMappingDepot !== ".") {
  blockers.push(blocker("file_mapping_mismatch", "high", `LocalPath=${fileMappingLocal}, DepotPath=${fileMappingDepot}.`, "Use recursive full-content mapping for the first preview build, then tighten excludes if needed."));
}
if (!contentFiles.length) blockers.push(blocker("empty_content", "critical", "No files found under depot content.", "Regenerate package:steam-depot."));
if (!exeCandidates.length) {
  blockers.push(blocker("missing_windows_executable", "critical", "No .exe found in depot content.", "Replace Node/dev-server staging with a signed Windows x64 executable or installer."));
} else if (launcherExe && (!signatureReady || !steamworksReady)) {
  blockers.push(blocker("unsigned_launcher_executable", "high", `Found ${windowsDesktopManifest?.launcher_exe?.platform || "unknown"} launcher candidate ${launcherExe.path} (${launcherExe.bytes} bytes), icon=${Boolean(launcherIcon)}, self_check=${Boolean(launcherSelfCheck)}, signature=${releaseEvidence.signature || "missing"}, steamworks=${releaseEvidence.steamworks_sdk || "missing"}.`, "Attach signed executable evidence and Steamworks SDK evidence before upload."));
}
if (!desktopShellMain) blockers.push(blocker("missing_desktop_shell_staging", "medium", "Desktop shell staging was not copied into depot content.", "Run package:desktop-shell before package:steam-depot."));
if (!standaloneHtml) blockers.push(blocker("missing_standalone_offline", "medium", "Standalone offline HTML was not copied into depot content.", "Run package:standalone before package:steam-depot."));
if (steamReadyPngs.length < 15) blockers.push(blocker("missing_steam_ready_assets", "medium", `${steamReadyPngs.length}/15 Steam-ready PNGs found.`, "Run npm run assets:generate before packaging."));
if (!appBuild.includes("run_app_build") && !existsSync(join(steamworksDir, "README_STEAMPIPE.md"))) {
  blockers.push(blocker("missing_steamcmd_instructions", "low", "SteamCMD command guidance is missing.", "Restore README_STEAMPIPE.md guidance."));
}

const report = {
  generated_at: new Date().toISOString(),
  status: blockers.some((entry) => entry.severity === "critical") ? "blocked_not_upload_ready" : blockers.length ? "preflight_warnings" : "preview_ready",
  depot_dir: depotDir,
  app_id: appId,
  depot_id: depotId,
  branch: manifest?.branch || "",
  steamcmd_preview_command: `steamcmd +login <steam_user> +run_app_build .\\steamworks\\app_build_${appId || "TBD_APP_ID"}.vdf +quit`,
  vdf: {
    app_build: appBuildPath.replaceAll("\\", "/"),
    depot_build: depotBuildPath.replaceAll("\\", "/"),
    preview,
    contentRoot,
    depotContentRoot,
    fileMappingLocal,
    fileMappingDepot,
    depotMap,
  },
  content: {
    file_count: fileManifest.length,
    total_bytes: totalBytes,
    extension_counts: extensionCounts(contentFiles),
    exe_candidates: exeCandidates,
    steam_ready_pngs: steamReadyPngs.length,
    has_standalone_offline: Boolean(standaloneHtml),
    has_desktop_shell_staging: Boolean(desktopShellMain),
    launcher: launcherExe ? {
      ...launcherExe,
      platform: windowsDesktopManifest?.launcher_exe?.platform || null,
      icon: launcherIcon || null,
      self_check: launcherSelfCheck || null,
      signature: signatureReady ? "signed_evidence_attached" : "unsigned_staging",
      steamworks_sdk: steamworksReady ? "sdk_ready_evidence_attached" : "not_linked",
      signature_evidence: signatureReady ? releaseEvidence.signature_evidence : null,
      steamworks_evidence: steamworksReady ? releaseEvidence.steamworks_evidence : null,
    } : null,
  },
  blockers,
};

writeFileSync(fileManifestPath, JSON.stringify(fileManifest, null, 2), "utf8");
writeFileSync(reportJson, JSON.stringify(report, null, 2), "utf8");
writeFileSync(
  reportMd,
  `# Steam Depot Preflight Report

状态：\`${report.status}\`

生成时间：${report.generated_at}

## SteamPipe 模板

- AppID：${report.app_id || "(missing)"}
- DepotID：${report.depot_id || "(missing)"}
- Branch：${report.branch || "(missing)"}
- Preview：${report.vdf.preview || "(missing)"}
- ContentRoot：${report.vdf.contentRoot || "(missing)"}
- Depot FileMapping：${report.vdf.fileMappingLocal || "(missing)"} -> ${report.vdf.fileMappingDepot || "(missing)"}

建议 preview 命令：

\`\`\`powershell
${report.steamcmd_preview_command}
\`\`\`

## 内容统计

- 文件数：${report.content.file_count}
- 总大小：${report.content.total_bytes} bytes
- Windows exe 候选：${report.content.exe_candidates.length}
- Launcher 平台：${report.content.launcher?.platform || "none"}
- Launcher 图标：${report.content.launcher?.icon ? "yes" : "no"}
- Launcher 自检：${report.content.launcher?.self_check ? "yes" : "no"}
- Steam-ready PNG：${report.content.steam_ready_pngs}/15
- Standalone offline：${report.content.has_standalone_offline ? "yes" : "no"}
- Desktop shell staging：${report.content.has_desktop_shell_staging ? "yes" : "no"}

## 阻塞项

${report.blockers.length ? report.blockers.map((entry) => `- ${entry.severity.toUpperCase()} · ${entry.id}：${entry.evidence} 下一步：${entry.nextStep}`).join("\n") : "- 无。可进入 SteamCMD preview build。"}

## 说明

该 preflight 是本地上传前审计，不会调用 SteamCMD，也不会上传任何内容。它用于提前确认 VDF、文件映射、Steam-ready 素材、standalone/desktop shell staging 和上传阻塞项；真实 AppID/DepotID、签名 Windows 可执行文件、Steamworks SDK 与 SteamCMD preview 仍是最终上架前必需证据。
`,
  "utf8",
);

const manifestOut = {
  name: "仙农洞天：精怪工坊 Steam Preflight Evidence",
  status: report.status,
  generated_at: report.generated_at,
  files: ["STEAM_PREFLIGHT_REPORT.json", "STEAM_PREFLIGHT_REPORT.md", "STEAM_FILE_MANIFEST.json"],
};
writeFileSync(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifestOut, null, 2), "utf8");

console.log(`Steam preflight report created: ${outDir}`);
console.log(`Status: ${report.status}; files: ${report.content.file_count}; blockers: ${report.blockers.length}.`);
