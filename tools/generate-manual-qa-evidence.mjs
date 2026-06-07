import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const outDir = join("dist", "xiannong-dongtian-manual-qa");

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

const demoQa = parseCsv(readFileSync("csv/demo_qa_checklist.csv", "utf8"));
const releaseGates = parseCsv(readFileSync("csv/release_readiness_gate.csv", "utf8"));
const rrg007 = releaseGates.find((entry) => entry.gate_id === "rrg_007") || {};
const p0Checks = demoQa.filter((entry) => entry.priority === "P0");
const p1Checks = demoQa.filter((entry) => entry.priority === "P1");

const checklistRows = [
  ["check_id", "priority", "area", "source", "acceptance", "expected_evidence", "session_result", "tester_note"],
  ...demoQa.map((entry) => [
    entry.qa_id,
    entry.priority,
    entry.area,
    entry.check_item,
    entry.acceptance_criteria,
    "pass/fail, timestamped note, screenshot/video timestamp if relevant",
    "unrun",
    "",
  ]),
  [
    "rrg_007",
    rrg007.priority || "P0",
    "release_gate",
    rrg007.requirement || "公开试玩稳定",
    rrg007.pass_condition || "2小时试玩无阻断崩溃",
    "single uninterrupted 120-minute session log, no blocking crash, no soft lock, tester signature",
    "unrun",
    "",
  ],
];

writeText(
  join(outDir, "MANUAL_QA_CHECKLIST.csv"),
  checklistRows.map((row) => row.map(csvEscape).join(",")).join("\n"),
);

const sessionTemplate = {
  status: "needs_manual_run",
  project: "仙农洞天：精怪工坊",
  build_under_test: {
    windows_staging: "dist/xiannong-dongtian-windows-staging",
    steam_depot_staging: "dist/xiannong-dongtian-steam-depot",
    standalone: "dist/xiannong-dongtian-standalone/index.html",
  },
  required_duration_minutes: 120,
  tester: "",
  machine: {
    os: "",
    cpu: "",
    gpu: "",
    memory: "",
    controller: "",
  },
  session: {
    started_at: "",
    ended_at: "",
    duration_minutes: 0,
    build_manifest_sha1: "",
    video_or_log_path: "",
    screenshots_path: "",
  },
  pass_conditions: {
    no_blocking_crash: false,
    no_soft_lock: false,
    save_load_verified: false,
    p0_checklist_passed: false,
    rrg_007_passed: false,
  },
  p0_checks: p0Checks.map((entry) => ({
    id: entry.qa_id,
    area: entry.area,
    acceptance: entry.acceptance_criteria,
    result: "unrun",
    note: "",
  })),
  p1_checks: p1Checks.map((entry) => ({
    id: entry.qa_id,
    area: entry.area,
    acceptance: entry.acceptance_criteria,
    result: "unrun",
    note: "",
  })),
  incidents: [],
  tester_signature: "",
};

writeText(
  join(outDir, "MANUAL_QA_SESSION_TEMPLATE.json"),
  JSON.stringify(sessionTemplate, null, 2),
);

const summary = {
  generated_at: new Date().toISOString(),
  status: "needs_manual_run",
  gate: "rrg_007",
  required_duration_minutes: 120,
  p0_checks: p0Checks.length,
  p1_checks: p1Checks.length,
  evidence_required: [
    "completed MANUAL_QA_SESSION_TEMPLATE.json copied to MANUAL_QA_SESSION_SIGNED.json",
    "120-minute uninterrupted playthrough log or video",
    "no blocking crash or soft lock",
    "P0 checklist pass/fail notes",
    "tester signature and machine profile",
  ],
};

writeText(join(outDir, "MANUAL_QA_SUMMARY.json"), JSON.stringify(summary, null, 2));

writeText(
  join(outDir, "MANUAL_QA_RUNBOOK.md"),
  `# 《仙农洞天：精怪工坊》2 小时人工 QA 稳定性 Runbook

状态：\`${summary.status}\`

目标门禁：\`rrg_007\`，要求「${rrg007.pass_condition || "2小时试玩无阻断崩溃"}」。

## 测试前准备

- 先运行 \`npm run verify\`、\`npm run qa:smoke\`、\`npm run package:windows\`、\`npm run windows:preflight\`。
- 使用 \`dist/xiannong-dongtian-windows-staging/bin/XiannongDongtian.exe\` 或 \`standalone-offline/index.html\` 作为测试入口。
- 开始录屏或保存完整日志，记录机器配置、输入设备、开始时间和构建 manifest hash。

## 2 小时路径

1. 前 5 分钟：不看外部说明，完成目标理解、播种、浇水或入夜。
2. 5-30 分钟：触发第一次收获、第一次成精，确认精怪入队且可操作。
3. 30-60 分钟：完成加工、开铺、顾客反馈和至少一次存档读档。
4. 60-90 分钟：推进节气变化、风险提示、订单或支线演出跳过。
5. 90-120 分钟：继续经营、修复灵渠、检查面板分组、Steam-ready 素材面板、成就/存档/本地化面板。

## 通过标准

- 连续 120 分钟无阻断崩溃。
- 无软锁：玩家始终能继续推进、保存/读取、入夜或重新开始。
- P0 Demo QA ${p0Checks.length} 项均有 pass/fail 记录。
- 若出现问题，必须记录复现步骤、时间戳、截图/视频位置和影响范围。

## 产物归档

- 将 \`MANUAL_QA_SESSION_TEMPLATE.json\` 复制为 \`MANUAL_QA_SESSION_SIGNED.json\` 并填写。
- 将录屏、日志、截图路径写入 signed JSON。
- 重新运行 \`npm run evidence:qa\`，证据包会把 manual QA 目录收录为待签收或已签收材料。
`,
);

const manifest = {
  name: "仙农洞天：精怪工坊 Manual QA Evidence Template",
  version: "0.1.0-manual-qa",
  status: summary.status,
  generated_at: summary.generated_at,
  files: [
    "MANUAL_QA_RUNBOOK.md",
    "MANUAL_QA_CHECKLIST.csv",
    "MANUAL_QA_SESSION_TEMPLATE.json",
    "MANUAL_QA_SUMMARY.json",
  ],
};

if (existsSync(join(outDir, "MANUAL_QA_SESSION_SIGNED.json"))) {
  manifest.files.push("MANUAL_QA_SESSION_SIGNED.json");
}

writeText(join(outDir, "BUILD_MANIFEST.json"), JSON.stringify(manifest, null, 2));

console.log(`Manual QA evidence template created: ${outDir}`);
console.log(`Status: ${summary.status}; P0 checks: ${p0Checks.length}; required duration: ${summary.required_duration_minutes} minutes.`);
