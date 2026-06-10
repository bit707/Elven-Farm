export function renderReleasePanelUi({
  refs,
  state,
  settings,
  data,
  buildInfo,
  captureScenes,
  checklistSummary,
  evaluateVerticalAcceptance,
  evaluateQaCheck,
  evaluateReleaseGate,
  localizationSummary,
  communityCalendarSummary,
  conditionQaSummary,
  stabilityQaStatus,
  stabilityQaEvidenceMarkup,
  mainStoryFullClearSpec,
  mainStoryFullClearPass,
}) {
  const p0Assets = data.steamAssets.filter((asset) => asset.priority === "P0");
  const verticalP0 = data.verticalSlice.filter((entry) => entry.priority === "P0");
  const qaP0 = data.demoQa.filter((entry) => entry.priority === "P0");
  const releaseP0 = data.releaseGates.filter((entry) => entry.priority === "P0");
  const vertical = checklistSummary(verticalP0, evaluateVerticalAcceptance);
  const qa = checklistSummary(qaP0, evaluateQaCheck);
  const gates = checklistSummary(releaseP0, evaluateReleaseGate);
  const localizationP0 = localizationSummary("P0");
  const community = communityCalendarSummary();
  const conditionQa = conditionQaSummary();
  const stability = stabilityQaStatus();
  const mainStory = mainStoryFullClearSpec();
  const checks = [
    {
      title: `版本 ${buildInfo.version}`,
      text: `${buildInfo.phase} · Build ${buildInfo.buildDate}`,
      pass: true,
    },
    {
      title: "垂直切片验收",
      text: `P0 验收 ${vertical.label} 通过，来源 vertical_slice_acceptance.csv。`,
      pass: vertical.passed === vertical.total,
    },
    {
      title: "Demo QA",
      text: `P0 QA ${qa.label} 通过，来源 demo_qa_checklist.csv。`,
      pass: qa.passed === qa.total,
    },
    {
      title: "Steam 素材",
      text: `已接入 ${p0Assets.length} 条 P0 素材计划，当前预置：${captureScenes[state.currentCaptureScene].label}。`,
      pass: p0Assets.length >= 4,
    },
    {
      title: "本地化覆盖",
      text: `P0 本地化 ${localizationP0.passed}/${localizationP0.total} 项达标，平均覆盖 ${localizationP0.avg}%。`,
      pass: localizationP0.total > 0 && localizationP0.passed === localizationP0.total,
    },
    {
      title: "宣发节奏",
      text: `社区日历 ${community.ready}/${community.total} 条素材可制作，Steam 触点 ${community.steamBeats} 条，Demo CTA ${community.demoBeats} 条。`,
      pass: community.total >= 6 && community.ready >= Math.ceil(community.total * 0.75),
    },
    {
      title: "条件系统",
      text: `条件组 ${conditionQa.supported}/${conditionQa.total} 可解析，当前满足 ${conditionQa.passed} 条，来源 condition_group.csv。`,
      pass: conditionQa.total > 0 && conditionQa.supported === conditionQa.total,
    },
    {
      title: "控制提示",
      text: settings.controllerHints ? "键鼠与 Gamepad 基础映射已启用。" : "手柄提示已隐藏，输入映射仍可用。",
      pass: settings.controllerHints,
    },
    {
      title: "性能稳定哨兵",
      text: `${stability.summary}；最差帧 ${stability.worstFrameMs}ms；采样 ${stability.samples} 帧；${stability.evidence}。`,
      pass: stability.pass,
      detail: "vsa_009：前3小时无阻断问题 · 无崩溃无软锁目标帧稳定。只显示 QA 状态，不会自动执行任何玩法动作。",
    },
    {
      title: "成就与云存档",
      text: `已解锁 ${state.unlockedAchievements.size}/${data.achievements.length} 项，云存档镜像 ${state.cloudMirrorAt ? "已生成" : "待保存生成"}。`,
      pass: data.achievements.length > 0 && state.unlockedAchievements.size > 0,
    },
    {
      title: "Release 门禁",
      text: `P0 门禁 ${gates.label} 通过，来源 release_readiness_gate.csv。`,
      pass: gates.passed === gates.total,
    },
    {
      title: "四章主线通关",
      text: `${mainStory.summary} 当前章节 ${mainStory.progressLabel}。`,
      pass: mainStoryFullClearPass(),
      detail: "rrg_008：新开档到终章可完整通关。该条不再用单次秘境通关替代主线完成证据。",
    },
    {
      title: "错误日志",
      text: state.errors.length === 0 ? "本次运行暂无错误。" : `${state.errors.length} 条错误已记录到本地日志。`,
      pass: state.errors.length === 0,
    },
  ];

  refs.releasePanel.innerHTML = "";
  const stabilityEvidenceNode = document.createElement("div");
  stabilityEvidenceNode.innerHTML = stabilityQaEvidenceMarkup(stability);
  refs.releasePanel.append(stabilityEvidenceNode.firstElementChild);
  for (const check of checks) {
    const node = document.createElement("div");
    node.className = `release-item ${check.pass ? "pass" : "warn"}`;
    node.innerHTML = `<strong>${check.title}</strong>${check.text}${check.detail ? `<small>${check.detail}</small>` : ""}`;
    refs.releasePanel.append(node);
  }
}

export function renderAchievementPanelUi({ refs, state, data }) {
  refs.achievementPanel.innerHTML = "";
  const summary = document.createElement("div");
  summary.className = "achievement-summary";
  summary.innerHTML = `<strong>${state.unlockedAchievements.size}/${data.achievements.length}</strong><span>Steam 成就映射 · 云存档镜像：${state.cloudMirrorAt ? "已生成" : "待保存"}</span>`;
  refs.achievementPanel.append(summary);

  for (const achievement of data.achievements) {
    const unlocked = state.unlockedAchievements.has(achievement.achievement_id);
    const node = document.createElement("div");
    node.className = `achievement-card ${unlocked ? "unlocked" : "locked"}`;
    node.innerHTML = `
      <strong>${achievement.title}</strong>
      <span>${achievement.description}</span>
      <small>${achievement.steam_api_name} · ${unlocked ? "已解锁" : "未解锁"}</small>
    `;
    refs.achievementPanel.append(node);
  }
}

export function renderPlatformPanelUi({
  refs,
  state,
  buildInfo,
  steamworksBridge,
  steamworksAdapter,
  runtimeDataLoader,
  saveRuntime,
}) {
  const platform = state.platformState || {};
  const adapter = steamworksAdapter();
  const dataRuntime = runtimeDataLoader?.status?.();
  const saveAdapter = saveRuntime?.adapterLabel?.() || "browser-localStorage";
  const featureRows = steamworksBridge.requiredFeatures.map((feature) => {
    const ready = adapter.sdkReady;
    const bridgeReady = adapter.bridgeReady;
    const label = {
      achievements: "成就同步",
      remote_storage: "Remote Storage",
      overlay: "Overlay",
      stats: "Stats/StoreStats",
    }[feature] || feature;
    return `<div class="platform-feature ${ready ? "ready" : bridgeReady ? "bridge" : "mock"}"><span>${label}</span><strong>${ready ? "SDK" : bridgeReady ? "Bridge" : "Mock"}</strong></div>`;
  }).join("");

  refs.platformPanel.innerHTML = "";
  const summary = document.createElement("div");
  summary.className = `platform-summary ${adapter.sdkReady ? "pass" : "warn"}`;
  summary.innerHTML = `
    <strong>${adapter.sdkReady ? "Steamworks SDK 已探测" : adapter.bridgeReady ? "桌面壳桥接已探测" : "Local Mock 平台桥接"}</strong>
    <span>AppID ${buildInfo.steamAppId} · Adapter ${platform.adapterId || adapter.id} · Bridge ${steamworksBridge.adapterId}</span>
    <small>${adapter.sdkReady ? "真实 SDK 可用，后续可写入 Steam depot 验证。" : adapter.bridgeReady ? `桌面壳 stub 会写入本地证据：${adapter.evidenceMode || "local-file-staging"}，但 rrg_012 仍需真实 SDK。` : "当前等待桌面包体注入 XiannongSteamworks，全流程先写入本地证据。"}</small>
  `;
  refs.platformPanel.append(summary);

  const sync = document.createElement("div");
  sync.className = "platform-card";
  sync.innerHTML = `
    <strong>同步状态</strong>
    <span>成就：${platform.lastAchievementSync ? `${platform.lastAchievementSync.apiName} · ${platform.lastAchievementSync.status}` : "尚未同步"}</span>
    <span>云存档：${platform.lastCloudSync ? `${platform.lastCloudSync.path} · ${platform.lastCloudSync.status}` : "尚未生成"}</span>
    <span>Overlay：${platform.lastOverlayRequest ? `${platform.lastOverlayRequest.target} · ${platform.lastOverlayRequest.status}` : "尚未请求"}</span>
    <span>Local JSON: ${platform.lastLocalJsonSave ? `${platform.lastLocalJsonSave.path} · ${platform.lastLocalJsonSave.status}` : `${saveAdapter} · waiting for save`}</span>
    <span>Runtime Data: ${dataRuntime ? `${dataRuntime.mode} · ${dataRuntime.contentHash ? dataRuntime.contentHash.slice(0, 12) : dataRuntime.error || "pending"}` : "legacy csv"}</span>
    <button type="button" data-platform-overlay="store">测试 Overlay 请求</button>
  `;
  refs.platformPanel.append(sync);

  const feature = document.createElement("div");
  feature.className = "platform-card";
  feature.innerHTML = `<strong>SDK 功能位</strong><div class="platform-feature-grid">${featureRows}</div><small>待办：${(platform.pending || []).join(" / ") || "无"}</small>`;
  refs.platformPanel.append(feature);
}
