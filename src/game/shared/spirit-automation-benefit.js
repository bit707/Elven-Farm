export function spiritAutomationBenefitRowsData(groups = {}, options = {}) {
  const state = options.state || {};
  const spiritJobWorkPower = typeof options.spiritJobWorkPower === "function" ? options.spiritJobWorkPower : () => 0;
  const sellableInventoryGoods = typeof options.sellableInventoryGoods === "function" ? options.sellableInventoryGoods : () => [];
  const unresolvedRisks = typeof options.unresolvedRisks === "function" ? options.unresolvedRisks : () => [];
  const workshopProductionLineSpec = typeof options.workshopProductionLineSpec === "function" ? options.workshopProductionLineSpec : () => ({ activeJob: null });
  const workshopSpiritBonus = typeof options.workshopSpiritBonus === "function" ? options.workshopSpiritBonus : () => 0;
  const multiplierText = typeof options.multiplierText === "function" ? options.multiplierText : (value) => `${value}`;
  const unwatered = (state.plots || []).filter((plot) => plot.cropId && !plot.mature && !plot.watered).length;
  const queue = state.workshopQueue || [];
  const sellable = sellableInventoryGoods();
  const risks = unresolvedRisks();
  const rows = [];
  const jobPower = (job) => (groups[job] || []).reduce((sum, entry) => sum + Number(entry.power || 0), 0);
  const firstName = (job) => groups[job]?.[0]?.spirit?.name || "";

  if (groups.farm?.length) {
    const waterCount = Math.max(1, Math.min(unwatered || groups.farm.length * 3, Math.round(jobPower("farm") * 3)));
    rows.push({
      job: "farm",
      tone: unwatered ? "ready" : "stable",
      glyph: "田",
      title: "农田代劳",
      value: `省体力 ${waterCount * 2}`,
      detail: unwatered
        ? `${firstName("farm")} 可接手 ${waterCount}/${unwatered} 格补水`
        : `${firstName("farm")} 巡田，今晚少漏一格水`,
      selector: "#spiritList",
      panelGroup: "core",
      priority: unwatered ? 92 : 50,
    });
  }

  if (groups.workshop?.length) {
    const savedWork = Math.max(6, Math.round(jobPower("workshop") * 12));
    const activeJob = workshopProductionLineSpec(queue).activeJob;
    rows.push({
      job: "workshop",
      tone: queue.length ? "hot" : "ready",
      glyph: "炊",
      title: queue.length ? "后厂跑线" : "灶边候工",
      value: queue.length ? `工时 -${savedWork}` : `速度 ${multiplierText(workshopSpiritBonus())}`,
      detail: activeJob
        ? `${firstName("workshop")} 正看 ${activeJob.currentStage.label} · ${activeJob.outputItemName}`
        : `${firstName("workshop")} 候在灶边，排产后立刻投料`,
      selector: queue.length ? "[data-workshop-queue]" : ".workshop-production-line",
      fallbackSelector: "#buildPanel",
      panelGroup: "systems",
      priority: queue.length ? 90 : 68,
    });
  }

  if (groups.shop?.length) {
    const expectedGold = Math.max(8, Math.round(jobPower("shop") * 10));
    rows.push({
      job: "shop",
      tone: sellable.length ? "gold" : "stable",
      glyph: "铺",
      title: "铺前招呼",
      value: `预订 +${expectedGold}`,
      detail: sellable.length
        ? `${firstName("shop")} 可替 ${sellable[0]?.itemName || "货架"} 挂热卖签`
        : `${firstName("shop")} 整理空货架，等第一件货`,
      selector: "#shopReport",
      fallbackSelector: "#shopButton",
      panelGroup: "core",
      priority: sellable.length ? 84 : 46,
    });
  }

  if (groups.patrol?.length) {
    rows.push({
      job: "patrol",
      tone: risks.length ? "urgent" : "stable",
      glyph: "巡",
      title: "巡灯护场",
      value: risks.length ? `风险 ${risks.length}` : "夜路稳定",
      detail: risks.length
        ? `${firstName("patrol")} 盯着 ${risks[0].title}`
        : `${firstName("patrol")} 把夜路先照了一遍`,
      selector: risks.length ? "#riskPanel" : "#spiritList",
      fallbackSelector: "#spiritList",
      panelGroup: risks.length ? "systems" : "core",
      priority: risks.length ? 96 : 48,
    });
  }

  if (groups.expedition?.length) {
    rows.push({
      job: "expedition",
      tone: "water",
      glyph: "旗",
      title: "短途探路",
      value: `线索 +${groups.expedition.length}`,
      detail: `${firstName("expedition")} 可先看商路、秘境和补给缺口`,
      selector: "#spiritList",
      fallbackSelector: "#spiritList",
      panelGroup: "core",
      priority: 54,
    });
  }

  if (groups.garden?.length) {
    const moodGain = Math.max(4, Math.round(jobPower("garden") * 4));
    rows.push({
      job: "garden",
      tone: "flower",
      glyph: "院",
      title: "庭院安抚",
      value: `心情 +${moodGain}`,
      detail: `${firstName("garden")} 可把疲惫伙伴往回养`,
      selector: "#spiritList",
      fallbackSelector: "#spiritList",
      panelGroup: "core",
      priority: (state.spirits || []).some((spirit) => Number(spirit.mood || 0) < 45) ? 78 : 52,
    });
  }

  return rows.sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
}

export function spiritAutomationNextAssignmentAdviceData(groups = {}, options = {}) {
  const state = options.state || {};
  const sellableInventoryGoods = typeof options.sellableInventoryGoods === "function" ? options.sellableInventoryGoods : () => [];
  const unresolvedRisks = typeof options.unresolvedRisks === "function" ? options.unresolvedRisks : () => [];
  const plots = Array.isArray(state.plots) ? state.plots : [];
  const spirits = Array.isArray(state.spirits) ? state.spirits : [];
  const unwatered = plots.filter((plot) => plot.cropId && !plot.mature && !plot.watered).length;
  const queue = Array.isArray(state.workshopQueue) ? state.workshopQueue : [];
  const sellable = sellableInventoryGoods();
  const risks = unresolvedRisks();
  const idle = spirits.find((spirit) => !spirit.job);
  if (idle) return { job: "farm", label: `${idle.name} 还没定岗，先放到农田岗把第一条代劳线点亮。` };
  if (unwatered > 0 && !groups.farm?.length) return { job: "farm", label: `还有 ${unwatered} 格缺水，调一只精怪去农田岗最立刻省体力。` };
  if (queue.length > 0 && !groups.workshop?.length) return { job: "workshop", label: "工坊有排产但没人看火，调一只精怪去工坊岗能让产线更像真正自动化。" };
  if (sellable.length > 0 && !groups.shop?.length) return { job: "shop", label: "背包已有可卖货，调一只精怪去店铺岗，门口会出现补货和招呼动作。" };
  if (risks.length > 0 && !groups.patrol?.length) return { job: "patrol", label: "节气风险还没处理，巡逻岗能把夜间损失变成可见防线。" };
  if (groups.farm?.length && groups.workshop?.length) return { job: "workshop", label: "农田和工坊已经接线，今晚容易打出“清晨备料链”。" };
  if (groups.workshop?.length && groups.shop?.length) return { job: "shop", label: "工坊和旧铺已经接线，下一步冲“出锅上架链”。" };
  return { job: "farm", label: "岗位已覆盖，继续观察主世界里的搬运、补货、巡灯和庭院动作。" };
}

export function spiritAutomationBenefitBoardSpecData({
  day = 1,
  spiritCount = 0,
  groups = {},
  rows = [],
  advice = null,
  width = 960,
  height = 640,
} = {}) {
  const safeGroups = groups && typeof groups === "object" ? groups : {};
  const safeRows = Array.isArray(rows) ? rows : [];
  const top = safeRows[0] || null;
  if (!top) return null;
  const coveredJobs = Object.keys(safeGroups).length;
  const totalPower = Object.values(safeGroups)
    .flat()
    .reduce((sum, entry) => sum + Number(entry?.power || 0), 0);
  const rect = {
    x: Math.max(18, Math.min(width - 304, 330)),
    y: Math.max(176, Math.min(height - 154, 398)),
    width: 304,
    height: 146,
  };
  return {
    key: `${day}:${coveredJobs}:${top.job}:${Math.round(totalPower * 10)}`,
    day,
    groups: safeGroups,
    rows: safeRows,
    top,
    advice,
    coveredJobs,
    totalPower,
    headline: coveredJobs >= 3 ? "精怪岗位已经接成半自动院线" : "精怪正在替你接手重复劳动",
    summary: `岗位 ${coveredJobs}/6 · 精怪 ${spiritCount} · 省工 ${Math.round(totalPower * 10)}`,
    rect,
  };
}

export function spiritAutomationBenefitBoardAtPointData(spec = null, px = 0, py = 0) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? spec
    : null;
}

export function spiritAutomationBenefitBoardFocusData(spec = null, day = 1) {
  if (!spec) return null;
  const target = spec.top || spec.rows?.[0] || null;
  const adviceLabel = spec.advice?.label || "";
  return {
    focus: {
      key: spec.key,
      day,
      job: target?.job || "",
    },
    compassTarget: {
      selector: target?.selector || "#spiritList",
      fallbackSelector: target?.fallbackSelector || "#spiritList",
      label: "点选省工看板",
      log: `${spec.headline}：${target?.title || "自动化"} ${target?.value || ""}。${target?.detail || adviceLabel} 下一步：${adviceLabel}`,
      panelGroup: target?.panelGroup || "core",
      missingTitle: "点选省工看板",
      missingLog: "省工看板已经判断出岗位方向，但对应面板暂时没有找到。",
    },
  };
}

export function spiritAutomationGroundTraceSpecData({
  day = 1,
  promenadeRows = [],
  benefitSpec = null,
  width = 960,
  height = 640,
  anchorForJob = () => ({ x: 0, y: 0 }),
  jobName = (job) => job,
  lineTarget = () => null,
} = {}) {
  const safeRows = Array.isArray(promenadeRows) ? promenadeRows : [];
  if (!safeRows.length) return null;
  const benefitByJob = new Map((benefitSpec?.rows || []).map((row) => [row.job, row]));
  const traces = safeRows.map((row) => {
    const benefit = benefitByJob.get(row.job) || null;
    const anchor = anchorForJob(row.job, width, height) || { x: 0, y: 0 };
    const active = Boolean(row.active || benefit);
    const rect = {
      x: Math.max(12, Math.min(width - 124, anchor.x - 46)),
      y: Math.max(82, Math.min(height - 64, anchor.y - 34)),
      width: 116,
      height: 54,
    };
    return {
      key: `${day}:${row.job}:${active ? "active" : "idle"}:${benefit?.value || row.metric || ""}`,
      job: row.job,
      label: row.label || jobName(row.job),
      glyph: benefit?.glyph || row.glyph || "灵",
      tone: benefit?.tone || row.tone || "stable",
      title: benefit?.title || (active ? `${row.label}留痕` : `${row.label}待接线`),
      value: benefit?.value || (active ? row.metric : "待接线"),
      detail: benefit?.detail || row.detail || row.impact || "",
      helperText: row.helperText || "空岗",
      action: row.action || "",
      active,
      anchor,
      rect,
      target: lineTarget(row.job),
    };
  });
  const activeTraces = traces.filter((trace) => trace.active);
  return {
    key: `${day}:${activeTraces.map((trace) => trace.job).join("|")}:${benefitSpec?.key || "no-benefit"}`,
    title: "自动化收益留痕",
    headline: activeTraces.length
      ? `今日 ${activeTraces.length}/6 条岗位在场景里留下动作`
      : "精怪定岗后，场景会留下自动化动作痕迹",
    detail: "把后台省工翻译成田水、灶火、货签、巡灯、旗路和庭院花息。",
    activeCount: activeTraces.length,
    traces,
    benefitKey: benefitSpec?.key || "",
    safetyText: "点击留痕只定位对应系统，不会自动切岗、派工、排产、开铺、发商队、处理风险、入夜或消耗资源。",
  };
}

export function spiritAutomationGroundTraceAtPointData(spec = null, px = 0, py = 0) {
  if (!spec?.traces?.length) return null;
  return spec.traces
    .slice()
    .reverse()
    .find((trace) => (
      px >= trace.rect.x
      && px <= trace.rect.x + trace.rect.width
      && py >= trace.rect.y
      && py <= trace.rect.y + trace.rect.height
    )) || null;
}

export function spiritAutomationGroundTraceFocusLogData(trace = null, safetyText = "") {
  if (!trace) return null;
  return {
    title: "点选自动化收益留痕",
    message: `${trace.label}：${trace.active ? `${trace.title} ${trace.value}` : "这条线还在待接线"}。${trace.detail || trace.action} ${safetyText || "这里只定位回看，不会自动执行动作。"}`,
    job: trace.job || "farm",
  };
}

export function spiritAutomationRelaySpecData({
  day = 1,
  traceSpec = null,
  width = 960,
  height = 640,
  anchorForJob = () => ({ x: 0, y: 0 }),
  jobName = (job) => job,
} = {}) {
  if (!traceSpec?.traces?.length) return null;
  const routeJobs = ["farm", "workshop", "shop", "patrol", "expedition", "garden"];
  const routeNames = {
    farm: "田垄",
    workshop: "后厂",
    shop: "旧铺",
    patrol: "巡灯",
    expedition: "远征",
    garden: "庭院",
  };
  const ordered = routeJobs
    .map((job) => traceSpec.traces.find((trace) => trace.job === job))
    .filter(Boolean);
  const activeNodes = ordered.filter((trace) => trace.active);
  const chosen = [];
  const addTrace = (trace) => {
    if (trace && !chosen.some((entry) => entry.job === trace.job)) chosen.push(trace);
  };

  if (activeNodes.length >= 2) {
    activeNodes.slice(0, 4).forEach(addTrace);
  } else {
    addTrace(activeNodes[0] || ordered[0]);
    const seedIndex = Math.max(0, ordered.findIndex((trace) => trace.job === chosen[0]?.job));
    ordered.slice(seedIndex + 1).forEach((trace) => {
      if (chosen.length < 3) addTrace(trace);
    });
  }

  if (!chosen.length) return null;
  const activeCount = activeNodes.length;
  const safeBannerX = Math.max(18, Math.min(width - 314, 614));
  const safeBannerY = Math.max(92, Math.min(height - 90, 116));
  const nodes = chosen.slice(0, 4).map((trace, index) => {
    const anchor = trace.anchor || anchorForJob(trace.job, width, height) || { x: 0, y: 0 };
    const rect = {
      x: Math.max(18, Math.min(width - 86, anchor.x - 36)),
      y: Math.max(86, Math.min(height - 54, anchor.y - 64)),
      width: 82,
      height: 34,
    };
    return {
      ...trace,
      index,
      routeName: routeNames[trace.job] || trace.label || jobName(trace.job),
      nodeTitle: `接力节点 ${index + 1}`,
      rect,
      anchor,
    };
  });
  const activeRoute = activeNodes
    .slice(0, 4)
    .map((trace) => routeNames[trace.job] || trace.label || jobName(trace.job))
    .join(" -> ");
  const previewRoute = nodes
    .map((node) => node.routeName)
    .join(" -> ");
  const nextNode = nodes.find((node) => !node.active) || nodes[nodes.length - 1] || null;
  const headline = activeCount >= 3
    ? `${activeRoute} 正在省工接力`
    : activeCount >= 2
      ? `${activeRoute} 已经接成小循环`
      : `${nodes[0]?.routeName || "田垄"} -> ${nextNode?.routeName || "后厂"} 等待下一位精怪接棒`;
  const detail = activeCount >= 2
    ? "把分散岗位串成一条玩家能看见的精怪接力线。"
    : `${nextNode?.routeName || "下一岗"}点亮后，后台省工会变成连续的岗位动作。`;

  return {
    key: `${day}:${nodes.map((node) => `${node.job}:${node.active ? 1 : 0}`).join("|")}:${traceSpec.key}`,
    title: "精怪接力线",
    headline,
    detail,
    routeText: "田垄 -> 后厂 -> 旧铺 -> 巡灯 -> 远征 -> 庭院",
    previewRoute,
    activeRoute: activeRoute || previewRoute,
    activeCount,
    totalCount: routeJobs.length,
    nodes,
    rect: { x: safeBannerX, y: safeBannerY, width: 300, height: 78 },
    safetyText: "点选精怪接力线只定位接力节点和岗位说明，不会自动切岗、派工、排产、开铺、发商队、处理风险、入夜或消耗资源。",
  };
}

export function spiritAutomationRelayAtPointData(spec = null, px = 0, py = 0) {
  if (!spec?.nodes?.length) return null;
  const node = spec.nodes
    .slice()
    .reverse()
    .find((entry) => (
      px >= entry.rect.x
      && px <= entry.rect.x + entry.rect.width
      && py >= entry.rect.y
      && py <= entry.rect.y + entry.rect.height
    ));
  if (node) return { type: "node", spec, node };
  const { rect } = spec;
  if (px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height) {
    return { type: "banner", spec, node: spec.nodes.find((entry) => entry.active) || spec.nodes[0] };
  }
  return null;
}

export function spiritAutomationRelayFocusData(hit = null, fallbackSpec = null, targetForJob = () => ({}), day = 1) {
  const spec = hit?.spec || fallbackSpec;
  const node = hit?.node || spec?.nodes?.find((entry) => entry.active) || spec?.nodes?.[0] || null;
  if (!spec || !node) return null;
  const target = targetForJob(node.job) || {};
  return {
    focus: {
      key: spec.key,
      day,
      job: node.job,
    },
    compassTarget: {
      selector: target.selector,
      fallbackSelector: target.fallbackSelector,
      panelGroup: target.panelGroup,
      label: `点选精怪接力线：${node.routeName}`,
      log: `${spec.title}：${spec.headline}。当前接力节点：${spec.previewRoute}；省工接力 ${spec.activeCount}/${spec.totalCount}。${node.nodeTitle} ${node.routeName}：${node.active ? `${node.title} ${node.value}` : "等待岗位接手"}，${node.detail || node.action || "查看岗位缺口"}。${spec.safetyText}`,
      missingTitle: "点选精怪接力线",
      missingLog: `精怪接力线已经定位到${node.routeName}，但对应面板暂时没有找到。${spec.safetyText}`,
    },
  };
}
