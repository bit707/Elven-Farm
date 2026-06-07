import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const outDir = join("dist", "xiannong-dongtian-platform-legal");

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
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index] || ""])));
}

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text.trimStart(), "utf8");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const releaseGates = parseCsv(readFileSync("csv/release_readiness_gate.csv", "utf8"));
const achievements = parseCsv(readFileSync("csv/achievement_config.csv", "utf8"));
const localization = parseCsv(readFileSync("csv/localization_coverage_plan.csv", "utf8"));
const rrg012 = releaseGates.find((entry) => entry.gate_id === "rrg_012") || {};

const approvalItems = [
  ["steam_app_id", "Steam AppID", "Steamworks backend AppID is assigned and matches depot/preflight config", "producer"],
  ["steam_depot_id", "Steam DepotID", "Windows depot ID is assigned and matches SteamPipe VDF", "producer"],
  ["steam_achievements", "Steam achievements", `${achievements.filter((entry) => entry.priority === "P0").length} P0 achievements approved and mapped to API names`, "program"],
  ["steam_cloud", "Steam Cloud", "Remote Storage path, quota, conflict behavior and save migration approved", "program"],
  ["steam_overlay_stats", "Overlay and stats", "Overlay, stats and offline retry behavior tested against real SDK", "program"],
  ["localization", "Localization", `${localization.filter((entry) => entry.priority === "P0").length} P0 localization coverage rows reviewed`, "localization"],
  ["asset_rights", "Asset rights", "Final screenshots, PV, capsule art, audio and generated assets have project-owned or licensed provenance", "producer"],
  ["store_page", "Steam store page", "Short/long descriptions, tags, screenshots, trailer and capsule assets approved", "publishing"],
  ["legal", "Legal approval", "Age rating strategy, privacy, EULA/license and regional publishing constraints approved", "legal"],
  ["release_branch", "Release branch", "Steam branch, rollback plan and SteamCMD preview evidence approved", "producer"],
];

writeText(
  join(outDir, "PLATFORM_LEGAL_CHECKLIST.csv"),
  [
    ["item_id", "area", "approval_requirement", "owner", "status", "evidence_path", "note"],
    ...approvalItems.map(([id, area, requirement, owner]) => [id, area, requirement, owner, "unapproved", "", ""]),
  ].map((row) => row.map(csvEscape).join(",")).join("\n"),
);

const approvalTemplate = {
  status: "needs_platform_legal_approval",
  gate: "rrg_012",
  gate_requirement: rrg012.requirement || "平台和法务确认",
  pass_condition: rrg012.pass_condition || "成就云存档授权本地化均确认",
  steamworks: {
    app_id: "",
    depot_id: "",
    branch: "",
    steamcmd_preview_report: "",
    app_build_vdf: "",
    depot_build_vdf: "",
  },
  approvals: Object.fromEntries(
    approvalItems.map(([id, area, requirement, owner]) => [
      id,
      {
        area,
        owner,
        requirement,
        approved: false,
        evidence_path: "",
        approver: "",
        approved_at: "",
        note: "",
      },
    ]),
  ),
  final_decision: {
    rrg_012_passed: false,
    producer_owner: "",
    legal_owner: "",
    publishing_owner: "",
    signed_at: "",
  },
};

writeText(join(outDir, "PLATFORM_LEGAL_APPROVAL_TEMPLATE.json"), JSON.stringify(approvalTemplate, null, 2));

const summary = {
  generated_at: new Date().toISOString(),
  status: "needs_platform_legal_approval",
  gate: "rrg_012",
  approval_items: approvalItems.length,
  p0_achievements: achievements.filter((entry) => entry.priority === "P0").length,
  p0_localization: localization.filter((entry) => entry.priority === "P0").length,
  evidence_required: [
    "PLATFORM_LEGAL_APPROVAL_SIGNED.json with rrg_012_passed=true",
    "Steamworks AppID/DepotID and SteamCMD preview evidence",
    "achievement/cloud/overlay/stats approval",
    "localization and legal approval",
    "asset rights and final store page approval",
  ],
};

writeText(join(outDir, "PLATFORM_LEGAL_SUMMARY.json"), JSON.stringify(summary, null, 2));

writeText(
  join(outDir, "PLATFORM_LEGAL_RUNBOOK.md"),
  `# 《仙农洞天：精怪工坊》平台与法务签收 Runbook

状态：\`${summary.status}\`

目标门禁：\`rrg_012\`，要求「${rrg012.pass_condition || "成就云存档授权本地化均确认"}」。

## 签收范围

${approvalItems.map(([id, area, requirement, owner]) => `- ${id} · ${area} · owner=${owner}：${requirement}`).join("\n")}

## 使用方式

1. 填写 \`PLATFORM_LEGAL_CHECKLIST.csv\` 的 status、evidence_path 和 note。
2. 将 \`PLATFORM_LEGAL_APPROVAL_TEMPLATE.json\` 复制为 \`PLATFORM_LEGAL_APPROVAL_SIGNED.json\`。
3. 填写 Steam AppID、DepotID、SteamCMD preview 报告、成就/云存档/Overlay/Stats 证据。
4. 确认本地化、素材授权、商店页、法务/EULA/隐私/区域发布均通过。
5. 将 \`final_decision.rrg_012_passed\` 设为 true，并填写 producer/legal/publishing 签收人。
6. 重新运行 \`npm run evidence:qa\` 收录签收状态。

## 边界

该模板不会替代真实平台审批、法务意见或 Steamworks 后台证据。没有 \`PLATFORM_LEGAL_APPROVAL_SIGNED.json\` 时，QA evidence 必须继续显示 rrg_012 未完成。
`,
);

const manifest = {
  name: "仙农洞天：精怪工坊 Platform Legal Evidence Template",
  version: "0.1.0-platform-legal",
  status: summary.status,
  generated_at: summary.generated_at,
  files: [
    "PLATFORM_LEGAL_RUNBOOK.md",
    "PLATFORM_LEGAL_CHECKLIST.csv",
    "PLATFORM_LEGAL_APPROVAL_TEMPLATE.json",
    "PLATFORM_LEGAL_SUMMARY.json",
  ],
};

if (existsSync(join(outDir, "PLATFORM_LEGAL_APPROVAL_SIGNED.json"))) {
  manifest.files.push("PLATFORM_LEGAL_APPROVAL_SIGNED.json");
}

writeText(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifest, null, 2));

console.log(`Platform/legal evidence template created: ${outDir}`);
console.log(`Status: ${summary.status}; approval items: ${summary.approval_items}.`);
