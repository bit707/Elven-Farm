export function createInitialStabilityStateData() {
  return {
    targetFps: 30,
    minStableFps: 27,
    longFrameMs: 66,
    maxAcceptableFrameMs: 500,
    requiredSamples: 30,
    frameSamples: 0,
    elapsedMs: 0,
    averageFps: 0,
    worstFrameMs: 0,
    longFrames: 0,
    lastFrameAt: 0,
    lastRenderAt: 0,
    lastActionAt: 0,
    actionsLogged: 0,
    renderCount: 0,
    errorCount: 0,
    softlockWarnings: [],
    qaNote: "目标帧稳定哨兵采样中",
  };
}

export function stabilityQaStatusData(stability = createInitialStabilityStateData(), options = {}) {
  const samples = Number(stability.frameSamples || 0);
  const longFrames = Number(stability.longFrames || 0);
  const longFrameRate = samples > 0 ? longFrames / samples : 0;
  const enoughSamples = samples >= Number(stability.requiredSamples || 30);
  const averageFps = Number(stability.averageFps || 0);
  const worstFrameMs = Number(stability.worstFrameMs || 0);
  const softlockWarnings = Array.isArray(options.softlockWarnings) ? options.softlockWarnings : [];
  const errorCount = Number(options.errorCount || 0);
  const fpsStable = !enoughSamples || averageFps >= Number(stability.minStableFps || 27);
  const longFrameStable = !enoughSamples || longFrameRate <= 0.08;
  const worstFrameStable = worstFrameMs <= Number(stability.maxAcceptableFrameMs || 500);
  const pass = errorCount === 0 && softlockWarnings.length === 0 && fpsStable && longFrameStable && worstFrameStable;
  const frameText = enoughSamples
    ? `${averageFps || 0} FPS 平均 · 长帧 ${longFrames}/${samples}`
    : `采样中 ${samples}/${stability.requiredSamples}`;
  const summary = pass
    ? `无崩溃无软锁 · ${frameText}`
    : `${errorCount ? `${errorCount} 条错误` : softlockWarnings[0] || "帧稳定性待观察"} · ${frameText}`;
  return {
    pass,
    enoughSamples,
    samples,
    averageFps,
    longFrames,
    longFrameRate,
    worstFrameMs: Math.round(worstFrameMs),
    renderCount: Number(stability.renderCount || 0),
    actionsLogged: Number(stability.actionsLogged || 0),
    errors: errorCount,
    softlockWarnings,
    summary,
    evidence: "运行时稳定性哨兵 · QA报告前置证据",
  };
}

export function stabilityQaReleaseMarkupData(status = stabilityQaStatusData()) {
  return `
    <strong>性能稳定哨兵</strong>
    ${status.summary}；最差帧 ${status.worstFrameMs}ms；采样 ${status.samples} 帧；${status.evidence}。
    <small>vsa_009：前3小时无阻断问题 · 无崩溃无软锁目标帧稳定。只显示 QA 状态，不会自动执行任何玩法动作。</small>
  `;
}

export function stabilityQaEvidenceSpecData(status = stabilityQaStatusData(), stability = createInitialStabilityStateData()) {
  const requiredSamples = Number(stability.requiredSamples || 30);
  const targetFps = Number(stability.targetFps || 30);
  const minStableFps = Number(stability.minStableFps || 27);
  const longFrameMs = Number(stability.longFrameMs || 66);
  const maxAcceptableFrameMs = Number(stability.maxAcceptableFrameMs || 500);
  const noCrash = Number(status.errors || 0) === 0;
  const noSoftlock = Array.isArray(status.softlockWarnings) && status.softlockWarnings.length === 0;
  const frameReady = Boolean(status.enoughSamples);
  const frameStable = !frameReady
    || (Number(status.averageFps || 0) >= minStableFps
      && Number(status.worstFrameMs || 0) <= maxAcceptableFrameMs
      && Number(status.longFrameRate || 0) <= 0.08);
  const rows = [
    {
      key: "crash",
      label: "无崩溃",
      value: noCrash ? "0 条错误" : `${status.errors} 条错误`,
      detail: "window error / unhandled rejection 会进入错误日志，并影响 vsa_009 判定。",
      tone: noCrash ? "good" : "warn",
    },
    {
      key: "softlock",
      label: "无软锁",
      value: noSoftlock ? "0 个预警" : `${status.softlockWarnings.length} 个预警`,
      detail: noSoftlock ? "对话、演出、秘境看门狗正常。" : status.softlockWarnings.join("；"),
      tone: noSoftlock ? "good" : "warn",
    },
    {
      key: "frame",
      label: "目标帧稳定",
      value: frameReady ? `${status.averageFps || 0} FPS` : `采样 ${status.samples}/${requiredSamples}`,
      detail: `目标 ${targetFps} FPS，稳定线 ${minStableFps} FPS；长帧阈值 ${longFrameMs}ms，最差帧 ${status.worstFrameMs}ms。`,
      tone: frameStable ? frameReady ? "good" : "note" : "warn",
    },
    {
      key: "smoke",
      label: "QA报告路径",
      value: "SMOKE_REPORT.md",
      detail: "npm run qa:smoke 会生成 dist\\xiannong-dongtian-smoke-report，记录 30 天长流程、warnings、softlock_watchdogs 和 frame_budget_note。",
      tone: "note",
    },
  ];
  return {
    title: "vsa_009 QA证据牌",
    subtitle: "前3小时无阻断问题 · QA报告",
    acceptanceText: "无崩溃无软锁目标帧稳定",
    statusText: status.pass ? "当前运行通过" : "当前运行待复核",
    pass: Boolean(status.pass),
    rows,
    safeNote: "只显示运行时稳定性哨兵和 QA 报告路径，不会自动执行任何玩法动作、推进时间、写完成标记或消耗资源。",
  };
}

export function stabilityQaEvidenceMarkupData(spec = stabilityQaEvidenceSpecData(), status = stabilityQaStatusData(), options = {}) {
  const compactClass = options.compact ? " compact" : "";
  const rows = spec.rows.map((row) => `
    <div class="stability-qa-row ${row.tone}">
      <em>${row.label}</em>
      <b>${row.value}</b>
      <small>${row.detail}</small>
    </div>
  `).join("");
  return `
    <div class="stability-qa-evidence ${spec.pass ? "pass" : "warn"}${compactClass}">
      <div class="stability-qa-head">
        <span>
          <strong>${spec.title}</strong>
          <small>${spec.subtitle}</small>
        </span>
        <em>${spec.acceptanceText}</em>
      </div>
      <div class="stability-qa-status">稳定性哨兵：${spec.statusText} · ${status.summary}</div>
      <div class="stability-qa-grid">${rows}</div>
      <small class="stability-qa-safe">${spec.safeNote}</small>
    </div>
  `;
}
