import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const stagingDir = join("dist", "xiannong-dongtian-windows-staging");
const outDir = join(stagingDir, "preflight");
const reportJson = join(outDir, "WINDOWS_PREFLIGHT_REPORT.json");
const reportMd = join(outDir, "WINDOWS_PREFLIGHT_REPORT.md");
const fileManifestPath = join(outDir, "WINDOWS_FILE_MANIFEST.json");
const depotContentDir = join("dist", "xiannong-dongtian-steam-depot", "content");

function readText(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

function readJson(path) {
  const text = readText(path);
  if (!text) return null;
  return JSON.parse(text);
}

function sha1(path) {
  return createHash("sha1").update(readFileSync(path)).digest("hex");
}

function walkFiles(root) {
  if (!existsSync(root)) return [];
  const result = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === "preflight") continue;
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...walkFiles(path));
    else result.push(path);
  }
  return result.sort();
}

function fileEvidence(path) {
  if (!existsSync(path)) return null;
  const stats = statSync(path);
  return {
    path: relative(stagingDir, path).replaceAll("\\", "/"),
    bytes: stats.size,
    sha1: sha1(path),
  };
}

function checkFile(id, path, label, minBytes = 1) {
  const evidence = fileEvidence(path);
  if (!evidence) return { id, status: "fail", evidence: `${label} missing: ${path}` };
  if (evidence.bytes < minBytes) return { id, status: "fail", evidence: `${label} too small: ${evidence.bytes} bytes.` };
  return { id, status: "pass", evidence: `${label} exists: ${evidence.path} (${evidence.bytes} bytes).` };
}

function extensionCounts(files) {
  const counts = new Map();
  for (const file of files) {
    const extension = extname(file).toLowerCase() || "(none)";
    counts.set(extension, (counts.get(extension) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([extension, count]) => ({ extension, count }));
}

function sameHash(left, right) {
  if (!existsSync(left) || !existsSync(right)) return false;
  return sha1(left) === sha1(right);
}

function finalBlocker(id, severity, evidence, nextStep) {
  return { id, severity, evidence, nextStep };
}

mkdirSync(outDir, { recursive: true });

const desktopManifest = readJson(join(stagingDir, "desktop-manifest.json"));
const buildManifest = readJson(join(stagingDir, "BUILD_MANIFEST.json"));
const launcherSelfCheck = readJson(join(stagingDir, "launcher", "launcher-self-check.json"));
const files = walkFiles(stagingDir);
const manifest = files.map((path) => {
  const stats = statSync(path);
  return {
    path: relative(stagingDir, path).replaceAll("\\", "/"),
    bytes: stats.size,
    sha1: sha1(path),
  };
});
const totalBytes = manifest.reduce((sum, file) => sum + file.bytes, 0);

const launcherExe = join(stagingDir, "bin", "XiannongDongtian.exe");
const launcherIcon = join(stagingDir, "launcher", "XiannongDongtian.ico");
const launcherSelfCheckPath = join(stagingDir, "launcher", "launcher-self-check.json");
const standaloneHtml = join(stagingDir, "standalone-offline", "index.html");
const appHtml = join(stagingDir, "app", "index.html");
const desktopShellMain = join(stagingDir, "desktop-shell-staging", "desktop-shell", "main.mjs");
const launchCmd = join(stagingDir, "仙农洞天-启动Demo.cmd");
const launchPs1 = join(stagingDir, "仙农洞天-启动Demo.ps1");

const checks = [
  checkFile("build_manifest", join(stagingDir, "BUILD_MANIFEST.json"), "Windows staging BUILD_MANIFEST"),
  checkFile("desktop_manifest", join(stagingDir, "desktop-manifest.json"), "desktop-manifest"),
  checkFile("launcher_exe", launcherExe, "launcher executable", 16 * 1024),
  checkFile("launcher_icon", launcherIcon, "launcher icon", 8 * 1024),
  checkFile("launcher_self_check", launcherSelfCheckPath, "launcher self-check"),
  checkFile("standalone_html", standaloneHtml, "standalone offline HTML", 32 * 1024),
  checkFile("app_html", appHtml, "app HTML", 1024),
  checkFile("desktop_shell_main", desktopShellMain, "desktop shell main"),
  checkFile("launch_cmd", launchCmd, "CMD launch script"),
  checkFile("launch_ps1", launchPs1, "PowerShell launch script"),
];

checks.push({
  id: "launcher_platform",
  status: desktopManifest?.launcher_exe?.platform === "x64" && launcherSelfCheck?.platform === "x64" ? "pass" : "fail",
  evidence: `desktop-manifest platform=${desktopManifest?.launcher_exe?.platform || "(missing)"}, self-check platform=${launcherSelfCheck?.platform || "(missing)"}.`,
});

checks.push({
  id: "launcher_routes_to_offline_html",
  status: launcherSelfCheck?.standalone_exists === true && launcherSelfCheck?.app_html_exists === true ? "pass" : "fail",
  evidence: `standalone_exists=${String(launcherSelfCheck?.standalone_exists)}, app_html_exists=${String(launcherSelfCheck?.app_html_exists)}.`,
});

const depotMirrorChecks = [
  {
    id: "depot_launcher_exe",
    source: launcherExe,
    target: join(depotContentDir, "bin", "XiannongDongtian.exe"),
  },
  {
    id: "depot_launcher_icon",
    source: launcherIcon,
    target: join(depotContentDir, "windows-staging", "launcher", "XiannongDongtian.ico"),
  },
  {
    id: "depot_launcher_self_check",
    source: launcherSelfCheckPath,
    target: join(depotContentDir, "windows-staging", "launcher", "launcher-self-check.json"),
  },
  {
    id: "depot_desktop_manifest",
    source: join(stagingDir, "desktop-manifest.json"),
    target: join(depotContentDir, "windows-staging", "desktop-manifest.json"),
  },
].map((entry) => ({
  id: entry.id,
  status: sameHash(entry.source, entry.target) ? "pass" : "warn",
  evidence: existsSync(entry.target)
    ? `${entry.target} ${sameHash(entry.source, entry.target) ? "matches" : "differs from"} Windows staging source.`
    : `${entry.target} not found; run npm run package:steam-depot after npm run package:windows.`,
}));

const stagingFailures = checks.filter((entry) => entry.status === "fail");
const depotWarnings = depotMirrorChecks.filter((entry) => entry.status !== "pass");
const finalBlockers = [];
const releaseEvidence = desktopManifest?.release_evidence || {};
const signatureReady = releaseEvidence.signature === "signed_evidence_attached" && Boolean(releaseEvidence.signature_evidence);
const steamworksReady = releaseEvidence.steamworks_sdk === "sdk_ready_evidence_attached" && Boolean(releaseEvidence.steamworks_evidence);

checks.push({
  id: "signature_release_evidence",
  status: signatureReady ? "pass" : "warn",
  evidence: `signature=${releaseEvidence.signature || launcherSelfCheck?.signature || "(missing)"}, evidence=${releaseEvidence.signature_evidence || "(missing)"}.`,
});

checks.push({
  id: "steamworks_release_evidence",
  status: steamworksReady ? "pass" : "warn",
  evidence: `steamworks_sdk=${releaseEvidence.steamworks_sdk || launcherSelfCheck?.steamworks_sdk || "(missing)"}, evidence=${releaseEvidence.steamworks_evidence || "(missing)"}.`,
});

if (!signatureReady) {
  finalBlockers.push(finalBlocker(
    "unsigned_launcher_executable",
    "high",
    "Current XiannongDongtian.exe is unsigned or lacks attached signature evidence.",
    "Set windows-release.config.json signed_exe_path and signature_evidence_path, or provide XIANNONG_SIGNED_EXE_PATH and XIANNONG_SIGNATURE_EVIDENCE_PATH.",
  ));
}

if (!steamworksReady) {
  finalBlockers.push(finalBlocker(
    "steamworks_sdk_not_linked",
    "high",
    "Launcher and desktop shell still lack attached Steamworks SDK evidence.",
    "Set windows-release.config.json steamworks_evidence_path and steamworks_sdk_ready=true after linking achievements, overlay, stats, and Steam Cloud.",
  ));
}

if (!desktopManifest?.target_final_artifacts?.includes("signed installer or Steam depot content")) {
  finalBlockers.push(finalBlocker(
    "installer_or_signing_plan_missing",
    "medium",
    "desktop-manifest target_final_artifacts does not include installer/signing evidence.",
    "Track signed installer or signed depot executable evidence in the desktop manifest.",
  ));
}

const report = {
  generated_at: new Date().toISOString(),
  status: stagingFailures.length
    ? "staging_blocked"
    : depotWarnings.length
      ? "staging_ready_depot_refresh_needed"
      : "staging_review_ready_final_blockers",
  staging_dir: stagingDir,
  file_count: manifest.length,
  total_bytes: totalBytes,
  extension_counts: extensionCounts(files),
  launcher: fileEvidence(launcherExe),
  icon: fileEvidence(launcherIcon),
  self_check: launcherSelfCheck,
  build_manifest_status: buildManifest?.status || null,
  desktop_manifest_status: desktopManifest?.status || null,
  checks,
  depot_mirror_checks: depotMirrorChecks,
  staging_failures: stagingFailures,
  final_blockers: finalBlockers,
};

writeFileSync(fileManifestPath, JSON.stringify(manifest, null, 2), "utf8");
writeFileSync(reportJson, JSON.stringify(report, null, 2), "utf8");
writeFileSync(
  reportMd,
  `# Windows Desktop Preflight Report

状态：\`${report.status}\`

生成时间：${report.generated_at}

这个报告只验证 Windows staging 包体结构是否足够进入 Steam depot 结构审查；它不会把当前 launcher 误判为最终可上架客户端。

## 包体概览

- 文件数：${report.file_count}
- 总大小：${report.total_bytes} bytes
- Launcher：${report.launcher ? `${report.launcher.path} (${report.launcher.bytes} bytes)` : "missing"}
- Icon：${report.icon ? `${report.icon.path} (${report.icon.bytes} bytes)` : "missing"}
- Build manifest status：${report.build_manifest_status || "(missing)"}
- Desktop manifest status：${report.desktop_manifest_status || "(missing)"}

## Staging 检查

${report.checks.map((entry) => `- ${entry.status.toUpperCase()} · ${entry.id}：${entry.evidence}`).join("\n")}

## Depot 镜像检查

${report.depot_mirror_checks.map((entry) => `- ${entry.status.toUpperCase()} · ${entry.id}：${entry.evidence}`).join("\n")}

## 最终上架阻塞

${report.final_blockers.length ? report.final_blockers.map((entry) => `- ${entry.severity.toUpperCase()} · ${entry.id}：${entry.evidence} 下一步：${entry.nextStep}`).join("\n") : "- 无。"}

## 结论

当前 Windows staging 已经可以作为 Steam depot 结构审查输入，但正式上架前仍需要真实 Steamworks SDK、签名 Windows x64 executable 或安装器、SteamCMD preview build 与 2 小时人工 QA 稳定性证据。
`,
  "utf8",
);

const manifestOut = {
  name: "仙农洞天：精怪工坊 Windows Preflight Evidence",
  status: report.status,
  generated_at: report.generated_at,
  files: ["WINDOWS_PREFLIGHT_REPORT.json", "WINDOWS_PREFLIGHT_REPORT.md", "WINDOWS_FILE_MANIFEST.json"],
};
writeFileSync(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifestOut, null, 2), "utf8");

console.log(`Windows preflight report created: ${outDir}`);
console.log(`Status: ${report.status}; files: ${report.file_count}; final blockers: ${report.final_blockers.length}.`);
