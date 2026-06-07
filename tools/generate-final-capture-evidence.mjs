import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const outDir = join("dist", "xiannong-dongtian-final-capture");

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

const assetPlan = parseCsv(readFileSync("csv/steam_asset_production_plan.csv", "utf8"));
const releaseGates = parseCsv(readFileSync("csv/release_readiness_gate.csv", "utf8"));
const rrg011 = releaseGates.find((entry) => entry.gate_id === "rrg_011") || {};
const p0Assets = assetPlan.filter((entry) => entry.priority === "P0");
const screenshots = p0Assets.filter((entry) => entry.asset_type === "screenshot");
const trailers = p0Assets.filter((entry) => entry.asset_type === "trailer");
const capsules = p0Assets.filter((entry) => entry.asset_type === "capsule");

const checklistRows = [
  ["asset_plan_id", "asset_type", "asset_name", "required_capture", "acceptance_criteria", "final_file_path", "capture_source", "approval_status", "review_note"],
  ...p0Assets.map((entry) => [
    entry.asset_plan_id,
    entry.asset_type,
    entry.asset_name,
    entry.required_capture,
    entry.acceptance_criteria,
    "",
    "final executable capture required",
    "unapproved",
    "",
  ]),
];

writeText(
  join(outDir, "FINAL_CAPTURE_CHECKLIST.csv"),
  checklistRows.map((row) => row.map(csvEscape).join(",")).join("\n"),
);

const approvalTemplate = {
  status: "needs_final_capture",
  gate: "rrg_011",
  gate_requirement: rrg011.requirement || "商店素材实机化",
  pass_condition: rrg011.pass_condition || "截图和PV均来自实机",
  build_under_capture: {
    executable_path: "",
    build_manifest_sha1: "",
    steam_app_id: "",
    depot_id: "",
  },
  capture_session: {
    captured_at: "",
    capture_owner: "",
    machine: "",
    resolution: "1920x1080 screenshots; 75s trailer target",
    storage_path: "",
  },
  final_assets: p0Assets.map((entry) => ({
    id: entry.asset_plan_id,
    type: entry.asset_type,
    name: entry.asset_name,
    required_capture: entry.required_capture,
    final_file_path: "",
    source_is_final_executable: false,
    approved: false,
    note: "",
  })),
  approval: {
    marketing_owner: "",
    producer_owner: "",
    all_screenshots_from_final_executable: false,
    trailer_from_final_executable: false,
    rrg_011_passed: false,
  },
};

writeText(join(outDir, "FINAL_CAPTURE_APPROVAL_TEMPLATE.json"), JSON.stringify(approvalTemplate, null, 2));

const summary = {
  generated_at: new Date().toISOString(),
  status: "needs_final_capture",
  gate: "rrg_011",
  required_screenshots: screenshots.length,
  required_trailers: trailers.length,
  required_capsules: capsules.length,
  p0_assets: p0Assets.length,
  placeholder_pack: "assets/steam-ready remains procedural placeholder until this evidence is signed",
};

writeText(join(outDir, "FINAL_CAPTURE_SUMMARY.json"), JSON.stringify(summary, null, 2));

writeText(
  join(outDir, "FINAL_CAPTURE_RUNBOOK.md"),
  `# 《仙农洞天：精怪工坊》Steam 最终实机素材 Runbook

状态：\`${summary.status}\`

目标门禁：\`rrg_011\`，要求「${rrg011.pass_condition || "截图和PV均来自实机"}」。

当前 \`assets/steam-ready\` 中的 PNG/SVG 是项目自有程序化占位素材，可用于尺寸、商店页布局和发行预审；它们不能替代最终实机截图与核心玩法 PV。

## 必交 P0 素材

- 商店胶囊图：${summary.required_capsules} 项。
- Steam 商店截图：${summary.required_screenshots} 张，均需来自最终可执行文件。
- 核心玩法 PV：${summary.required_trailers} 支，目标 75 秒，需来自最终可执行文件或最终可执行文件捕获素材剪辑。

## 捕获步骤

1. 使用签名候选或最终 Windows executable 启动，而不是开发服务器裸页面。
2. 记录 build manifest sha1、AppID/DepotID、捕获机器、分辨率、录制软件。
3. 按 \`FINAL_CAPTURE_CHECKLIST.csv\` 逐项捕获。
4. 将最终文件路径填入 \`FINAL_CAPTURE_APPROVAL_TEMPLATE.json\`。
5. 确认每项 \`source_is_final_executable=true\`，并由 marketing / producer 设置 approval。
6. 保存为 \`FINAL_CAPTURE_APPROVAL_SIGNED.json\`，重新运行 \`npm run evidence:qa\`。

## 截图/PV 对照

${p0Assets.map((entry) => `- ${entry.asset_plan_id} · ${entry.asset_type} · ${entry.asset_name}：${entry.required_capture}；通过标准：${entry.acceptance_criteria}`).join("\n")}
`,
);

const manifest = {
  name: "仙农洞天：精怪工坊 Final Capture Evidence Template",
  version: "0.1.0-final-capture",
  status: summary.status,
  generated_at: summary.generated_at,
  files: [
    "FINAL_CAPTURE_RUNBOOK.md",
    "FINAL_CAPTURE_CHECKLIST.csv",
    "FINAL_CAPTURE_APPROVAL_TEMPLATE.json",
    "FINAL_CAPTURE_SUMMARY.json",
  ],
};

if (existsSync(join(outDir, "FINAL_CAPTURE_APPROVAL_SIGNED.json"))) {
  manifest.files.push("FINAL_CAPTURE_APPROVAL_SIGNED.json");
}

writeText(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifest, null, 2));

console.log(`Final capture evidence template created: ${outDir}`);
console.log(`Status: ${summary.status}; screenshots: ${summary.required_screenshots}; trailers: ${summary.required_trailers}.`);
