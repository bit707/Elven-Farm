export function failureCodexWorldToneWorld(entry = null) {
  const tone = entry?.tone || entry?.type || "learn";
  if (tone === "support" || entry?.type === "order") return "support";
  if (tone === "shop" || entry?.type === "shop") return "shop";
  if (tone === "boss" || entry?.type === "dungeon") return "dungeon";
  if (entry?.type === "risk") return "risk";
  return "learn";
}

export function failureCodexWorldPaletteWorld(entry = null) {
  const palettes = {
    support: { accent: "#b47d2f", soft: "rgba(246, 240, 182, 0.28)", fill: "rgba(255, 248, 232, 0.96)" },
    shop: { accent: "#8f5f3f", soft: "rgba(224, 182, 109, 0.2)", fill: "rgba(255, 248, 232, 0.95)" },
    risk: { accent: "#be4f37", soft: "rgba(190, 79, 55, 0.18)", fill: "rgba(255, 240, 232, 0.95)" },
    dungeon: { accent: "#4d91a6", soft: "rgba(77, 145, 166, 0.18)", fill: "rgba(236, 248, 243, 0.95)" },
    learn: { accent: "#286f58", soft: "rgba(202, 235, 210, 0.22)", fill: "rgba(248, 252, 247, 0.95)" },
  };
  return palettes[failureCodexWorldToneWorld(entry)] || palettes.learn;
}

export function failureCodexWorldTargetSpecWorld({
  entry = null,
  allOrderConfigs = () => [],
  orderTitle = (order) => order?.order_id || "订单板",
  selectorDataValue = (value) => String(value ?? ""),
} = {}) {
  if (!entry) return {
    selector: "#goalBookPanel",
    fallbackSelector: "#goalBookPanel",
    panelGroup: "core",
    targetLabel: "失败见闻册",
  };
  if (entry.type === "order") {
    const order = entry.sourceId ? allOrderConfigs().find((candidate) => candidate.order_id === entry.sourceId) : null;
    return {
      selector: entry.sourceId ? `[data-order-card-id="${selectorDataValue(entry.sourceId)}"]` : "#orderPanel",
      fallbackSelector: "#orderPanel",
      panelGroup: "core",
      targetLabel: order ? orderTitle(order) : "订单板",
    };
  }
  if (entry.type === "shop") {
    return {
      selector: '[data-shop-board="decision-ledger"]',
      fallbackSelector: '[data-shop-board="opening"]',
      panelGroup: "core",
      targetLabel: "旧铺复盘",
    };
  }
  if (entry.type === "risk") {
    return {
      selector: entry.sourceId ? `[data-risk-card-id="${selectorDataValue(entry.sourceId)}"]` : "#riskPanel",
      fallbackSelector: "#riskPanel",
      panelGroup: "systems",
      targetLabel: "节气风险",
    };
  }
  if (entry.type === "dungeon") {
    const dungeonId = String(entry.sourceId || "").split(":")[0];
    return {
      selector: dungeonId ? `[data-dungeon-card-id="${selectorDataValue(dungeonId)}"]` : "#dungeonPanel",
      fallbackSelector: "#dungeonPanel",
      panelGroup: "systems",
      targetLabel: "秘境面板",
    };
  }
  if (entry.type === "trade") {
    const routeId = String(entry.sourceId || "").split(":")[0];
    return {
      selector: routeId ? `[data-trade-route="${selectorDataValue(routeId)}"]` : "#spiritList",
      fallbackSelector: "#spiritList",
      panelGroup: "core",
      targetLabel: "跨界商路与商队",
    };
  }
  return {
    selector: "#goalBookPanel",
    fallbackSelector: "#goalBookPanel",
    panelGroup: "core",
    targetLabel: "失败见闻册",
  };
}

export function failureLearningTriptychSpecWorld({
  rows = [],
  codex = {},
  day = 1,
  failureCodexTypeLabel = (type) => type || "见闻",
} = {}) {
  const safeRows = rows.filter(Boolean);
  if (!safeRows.length) return null;
  const top = safeRows[0];
  const typeCounts = safeRows.reduce((counts, entry) => {
    counts[entry.type] = Number(counts[entry.type] || 0) + 1;
    return counts;
  }, {});
  const supportRows = safeRows.filter((entry) => entry.rewardText || entry.support);
  const nextRows = safeRows.filter((entry) => entry.nextAction);
  return {
    active: true,
    title: "失败学习三联牌",
    headline: `${failureCodexTypeLabel(top.type)} · ${top.title}`,
    top,
    total: Number(codex.total || safeRows.length),
    recent: safeRows.length,
    typeCounts,
    cards: [
      {
        key: "why",
        label: "为什么没稳住",
        title: top.problem || top.headline || "原因已经写进见闻册",
        body: top.insight || "系统已经把这次卡住的点变成可复盘线索。",
        detail: `${failureCodexTypeLabel(top.type)} · 第 ${top.day || day} 天`,
        tone: "warn",
      },
      {
        key: "support",
        label: "带回了什么",
        title: top.rewardText || top.support || "见闻和路线保留下来",
        body: supportRows.length > 1
          ? `最近 ${supportRows.length} 条见闻都有托底、线索或部分收益。`
          : "即使没有完全成功，也不会把玩家推回空白状态。",
        detail: "失败后仍获得线索或部分收益",
        tone: "support",
      },
      {
        key: "next",
        label: "下一步怎么补",
        title: top.nextAction || "先修一处最明确短板",
        body: nextRows.length > 1
          ? `还可继续处理 ${nextRows.slice(1, 3).map((entry) => failureCodexTypeLabel(entry.type)).join(" / ")} 的补救路线。`
          : "优先按当前见闻定位到对应面板，再做一次更稳的尝试。",
        detail: "只复盘和定位，不会自动领取托底、交付订单、开铺、处理风险、发商队、进入秘境或消耗资源。",
        tone: "fix",
      },
    ],
    chips: Object.entries(typeCounts).map(([type, count]) => ({
      label: failureCodexTypeLabel(type),
      count,
    })),
  };
}

export function failureLearningTriptychMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  return `
    <div class="goal-card failure-learning-triptych ${spec.top?.tone === "boss" ? "boss" : spec.top?.tone === "support" ? "ready" : "active"}">
      <strong>${spec.title} · 最近 ${spec.recent}/${Math.max(4, spec.total)}</strong>
      <span>${spec.headline}</span>
      <div class="failure-learning-grid">
        ${spec.cards.map((card) => `
          <div class="failure-learning-card ${card.tone}" data-failure-learning-card="${card.key}">
            <b>${card.label}</b>
            <em>${card.title}</em>
            <small>${card.body}</small>
            <small>${card.detail}</small>
          </div>
        `).join("")}
      </div>
      <div class="failure-learning-chips">
        ${spec.chips.map((chip) => `<span>${chip.label} ${chip.count}</span>`).join("")}
      </div>
    </div>
  `;
}

export function failureCodexWorldBoardSpecWorld({
  width = 960,
  height = 640,
  codex = {},
  rows = [],
  day = 1,
  failureCodexTypeLabel = (type) => type || "见闻",
  failureCodexWorldTargetSpec = () => failureCodexWorldTargetSpecWorld(),
} = {}) {
  if (!rows.length) return null;
  const top = rows[0];
  const palette = failureCodexWorldPaletteWorld(top);
  const cardHeight = rows.length > 2 ? 164 : rows.length > 1 ? 144 : 122;
  const rect = {
    x: Math.max(24, width - 348),
    y: Math.max(372, height - cardHeight - 24),
    width: 318,
    height: cardHeight,
  };
  return {
    key: `${day}:${top.id}:${rows.length}`,
    day,
    codex,
    rows,
    top,
    palette,
    rect,
    title: "失败见闻/补救小票",
    headline: top.headline || top.title || "这次没有白走",
    target: failureCodexWorldTargetSpec(top),
    summary: `${failureCodexTypeLabel(top.type)} · ${top.title}`,
    supportText: top.rewardText || top.support || "见闻已经写入账页",
    nextAction: top.nextAction || "按见闻册调整下一步",
  };
}

export function failureCodexWorldBoardAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function failureRecoveryRouteWorldRectWorld(boardSpec = null) {
  const width = 344;
  const height = 96;
  const boardRect = boardSpec?.rect;
  if (!boardRect) return { x: 260, y: 506, width, height };
  return {
    x: Math.max(24, boardRect.x - width - 16),
    y: Math.max(348, Math.min(640 - height - 20, boardRect.y + boardRect.height - height)),
    width,
    height,
  };
}

export function failureRecoveryRouteWorldSpecWorld({
  boardSpec = null,
  day = 1,
  failureCodexTypeLabel = (type) => type || "见闻",
  failureCodexWorldTargetSpec = () => failureCodexWorldTargetSpecWorld(),
} = {}) {
  if (!boardSpec?.top) return null;
  const entry = boardSpec.top;
  const palette = failureCodexWorldPaletteWorld(entry);
  const problem = entry.problem || entry.headline || "先看见这次卡住在哪里。";
  const insight = entry.insight || "这次没有白走，系统已经留下可复盘线索。";
  const nextAction = entry.nextAction || "下一步先改一处最明确的短板。";
  const support = entry.rewardText || entry.support || "补救路线已写入见闻册。";
  const steps = [
    { key: "problem", label: "问题", title: "看见问题", text: problem, tone: "warn" },
    { key: "insight", label: "线索", title: "学到线索", text: insight, tone: "learn" },
    { key: "gentle_fix", label: "改法", title: "温和改法", text: nextAction, tone: "fix" },
    { key: "support", label: "托底", title: "托底奖励", text: support, tone: "support" },
  ];
  return {
    id: "failure_recovery_route_world",
    key: `${day}:${entry.id}:${entry.type}:${entry.sourceId}:${support}`,
    entry,
    boardSpec,
    palette,
    steps,
    title: "失败托底路线图 · 可点",
    headline: `${failureCodexTypeLabel(entry.type)} · ${entry.title}`,
    summary: `${problem} -> ${nextAction}`,
    target: failureCodexWorldTargetSpec(entry),
    rect: failureRecoveryRouteWorldRectWorld(boardSpec),
  };
}

export function failureRecoveryRouteWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function shopLeaveRecoveryRouteStepsWorld(reason = "tag", profile = {}, feedback = {}, context = {}) {
  const reasonLabels = {
    price: "价签卡住",
    stock: "货架太薄",
    tag: "口味不合",
  };
  const reasonText = feedback.learningLine || profile.problem || "顾客留下了离店原因。";
  const gentleText = reason === "price"
    ? "不是货不好，是顾客还没被说服这个价值得今天掏钱。"
    : reason === "stock"
      ? "不是没人想买，是货架太薄会让谨慎客人先退一步。"
      : "不是客人没需求，是货架还没把“为谁准备”讲清楚。";
  const tomorrowText = feedback.tomorrowAction
    || profile.action
    || (context.lowStockGoods?.[0]?.itemName
      ? `明早先补 ${context.lowStockGoods[0].itemName}，再开一轮试营业。`
      : "明天先修正一处短板，再开一轮试营业。");
  return [
    {
      key: "reason",
      label: "离店原因",
      title: reasonLabels[reason] || "原因待观察",
      text: reasonText,
      tone: "warn",
    },
    {
      key: "gentle_fix",
      label: "温和改法",
      title: feedback.gentleFix || "先改一处",
      text: gentleText,
      tone: "mid",
    },
    {
      key: "tomorrow",
      label: "明日改法",
      title: "明天可执行",
      text: tomorrowText,
      tone: "good",
    },
  ];
}

export function shopLeaveRecoveryWorldSpecWorld({
  recovery = null,
  routeSteps = [],
  day = 1,
} = {}) {
  if (!recovery) return null;
  const safeRouteSteps = Array.isArray(routeSteps) && routeSteps.length
    ? routeSteps
    : shopLeaveRecoveryRouteStepsWorld(recovery.reason, recovery, {
      learningLine: recovery.learningLine || recovery.detail,
      gentleFix: recovery.gentleFix,
      tomorrowAction: recovery.tomorrowAction || recovery.action,
    });
  return {
    key: `${day}:${recovery.reason || "shop"}:${recovery.leavers || 0}`,
    day,
    title: recovery.routeTitle || "离店补救路线",
    headline: recovery.problem || "旧铺把流失原因圈出来了",
    recovery,
    routeSteps: safeRouteSteps,
    nextAction: recovery.tomorrowAction || recovery.action || safeRouteSteps[2]?.text || "明天先按补救路线调整一处短板。",
    support: recovery.support || "补救路线已写入账页",
    rect: { x: 220, y: 416, width: 238, height: 126 },
  };
}

export function shopLeaveRecoveryMarkupWorld(recovery = null, routeSteps = []) {
  if (!recovery) return "";
  const safeRouteSteps = Array.isArray(routeSteps) && routeSteps.length
    ? routeSteps
    : shopLeaveRecoveryRouteStepsWorld(recovery.reason, recovery, {
      learningLine: recovery.learningLine || recovery.detail,
      gentleFix: recovery.gentleFix,
      tomorrowAction: recovery.tomorrowAction || recovery.action,
    });
  return `
    <div class="shop-recovery-ticket" data-shop-board="leave-recovery">
      <strong>${recovery.title}</strong>
      <span>${recovery.problem}</span>
      <div class="shop-leave-recovery-route">
        ${safeRouteSteps.map((step, index) => `
          <i class="${step.tone || "mid"}">
            <b>${index + 1}. ${step.label}</b>
            <em>${step.title}</em>
            <small>${step.text}</small>
          </i>
        `).join("")}
      </div>
      <small>温和改法：${recovery.gentleFix || recovery.detail}</small>
      <small>明日改法：${recovery.tomorrowAction || recovery.action}</small>
      <small>托底：${recovery.support} · ${recovery.detail}</small>
    </div>
  `;
}

export function drawShopLeaveRecoveryWorldNoteWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.routeSteps?.length) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4) * 2;
  const cardY = rect.y + pulse;
  const accent = spec.recovery?.reason === "price"
    ? "#be4f37"
    : spec.recovery?.reason === "stock"
      ? "#b47d2f"
      : "#8f5f3f";
  ctx.save();
  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.94)");
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 46, 42, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText("救", rect.x + 28, cardY + 42);

  ctx.fillStyle = accent;
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText("离店补救路线 · 可点", rect.x + 72, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText((spec.headline || spec.title).slice(0, 16), rect.x + 72, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText((spec.support || "补救路线已写入账页").slice(0, 25), rect.x + 72, cardY + 62);

  const startX = rect.x + 26;
  const stepY = cardY + 78;
  const gap = 72;
  ctx.strokeStyle = `${accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX + 14, stepY);
  ctx.lineTo(startX + gap * 2 + 14, stepY);
  ctx.stroke();
  spec.routeSteps.slice(0, 3).forEach((step, index) => {
    const dotX = startX + index * gap;
    const toneColor = step.tone === "good" ? "#286f58" : step.tone === "warn" ? "#be4f37" : "#b47d2f";
    ctx.fillStyle = `${toneColor}dd`;
    ctx.beginPath();
    ctx.arc(dotX + 14, stepY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(String(index + 1), dotX + 11, stepY + 3);
    ctx.fillStyle = toneColor;
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 4), dotX - 2, stepY + 24);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 18, rect.width - 36, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`明日改法：${spec.nextAction}`.slice(0, 31), rect.x + 28, cardY + rect.height - 8);

  ctx.restore();
  return true;
}

export function failureMercyLanternWorldSpecWorld({
  boardSpec = null,
  routeSpec = null,
  day = 1,
  failureCodexTypeLabel = (type) => type || "见闻",
  failureCodexWorldTargetSpec = () => failureCodexWorldTargetSpecWorld(),
} = {}) {
  if (!routeSpec?.entry || !routeSpec?.rect) return null;
  const entry = routeSpec.entry;
  const palette = failureCodexWorldPaletteWorld(entry);
  const rect = {
    x: routeSpec.rect.x,
    y: Math.max(250, routeSpec.rect.y - 78),
    width: routeSpec.rect.width,
    height: 68,
  };
  const nodes = [
    {
      key: "comfort",
      glyph: "灯",
      title: "先稳住",
      text: entry.headline || "这次没有白走",
      detail: "先把挫败转成一条可回看的灯签。",
    },
    {
      key: "takeaway",
      glyph: "记",
      title: "带回了",
      text: entry.rewardText || entry.support || entry.insight || "线索已入册",
      detail: "失败后仍获得线索或部分收益。",
    },
    {
      key: "retry",
      glyph: "路",
      title: "再试路",
      text: entry.nextAction || "下一步先修一处短板",
      detail: "只定位下一步，不替你执行。",
    },
  ];
  nodes.forEach((node, index) => {
    const x = rect.x + 54 + index * 104;
    const y = rect.y + 40;
    node.point = { x, y };
    node.hit = { x: x - 38, y: y - 34, width: 76, height: 56 };
  });
  return {
    key: `${day}:${entry.id}:${entry.type}:${entry.rewardText || entry.support || ""}`,
    title: "失败不白走灯",
    headline: `${failureCodexTypeLabel(entry.type)} · ${entry.title}`,
    entry,
    boardSpec,
    routeSpec,
    palette,
    rect,
    nodes,
    target: failureCodexWorldTargetSpec(entry),
    safety: "只安抚、解释和定位，不会自动领取托底、交付订单、开铺、处理风险、发商队、进入秘境、挑战 Boss 或消耗资源。",
  };
}

export function failureMercyLanternWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const node = spec.nodes.find((entry) => {
    const hit = entry.hit;
    return px >= hit.x && px <= hit.x + hit.width && py >= hit.y && py <= hit.y + hit.height;
  }) || null;
  const { rect } = spec;
  if (node || (px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height)) {
    return {
      ...spec,
      focusNode: node || spec.nodes[0],
    };
  }
  return null;
}

export function drawFailureCodexWorldBoardWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = performance.now() / 1000,
  day = 1,
  focus = null,
  drawCanvasCard,
  failureCodexTypeLabel = (type) => type || "见闻",
} = {}) {
  if (!spec?.rect || !drawCanvasCard) return false;
  const { rect, palette, rows, top } = spec;
  const safeMotion = reducedMotion ? 0 : motion;
  const bob = reducedMotion ? 0 : Math.sin(safeMotion * 1.75) * 2;
  const cardY = rect.y + bob;
  const active = focus?.day === day && focus?.key === spec.key;
  const entryRows = rows.slice(0, 3);

  ctx.save();
  ctx.strokeStyle = `${palette.accent}55`;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -safeMotion * 10;
  ctx.beginPath();
  ctx.moveTo(rect.x + 18, cardY + rect.height - 28);
  ctx.quadraticCurveTo(rect.x - 54, cardY + 84, 512, 538);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, palette.fill);
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.86)" : `${palette.accent}77`;
  ctx.lineWidth = active ? 2.8 : 1.9;
  ctx.beginPath();
  ctx.roundRect(rect.x + 2, cardY + 2, rect.width - 4, rect.height - 4, 18);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 54, 50, 16);
  ctx.fill();
  ctx.strokeStyle = `${palette.accent}66`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 22, cardY + 22, 38, 34, 10);
  ctx.stroke();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(top.icon || "记", rect.x + 34, cardY + 45);

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 82, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.summary.slice(0, 18), rect.x + 82, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 30), rect.x + 82, cardY + 64);

  entryRows.forEach((entry, index) => {
    const rowY = cardY + 86 + index * 20;
    const rowPalette = failureCodexWorldPaletteWorld(entry);
    ctx.fillStyle = `${rowPalette.accent}18`;
    ctx.beginPath();
    ctx.roundRect(rect.x + 16, rowY - 13, rect.width - 32, 17, 8);
    ctx.fill();
    ctx.fillStyle = rowPalette.accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(`${entry.icon || "记"} ${failureCodexTypeLabel(entry.type)}`.slice(0, 8), rect.x + 26, rowY);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 11px Microsoft YaHei";
    ctx.fillText(String(entry.title || "").slice(0, 13), rect.x + 92, rowY);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText(String(entry.nextAction || entry.rewardText || entry.problem || "").slice(0, 20), rect.x + 194, rowY);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.strokeStyle = "rgba(224, 182, 109, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 24, rect.width - 32, 18, 9);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`下一步：${spec.nextAction}`.slice(0, 35), rect.x + 26, cardY + rect.height - 11);
  ctx.fillStyle = palette.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 43, cardY + 25);
  ctx.restore();
  return true;
}

export function drawFailureRecoveryRouteWorldWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = performance.now() / 1000,
  day = 1,
  focus = null,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !drawCanvasCard) return false;
  const { rect, palette, steps } = spec;
  const safeMotion = reducedMotion ? 0 : motion;
  const pulse = reducedMotion ? 0 : Math.sin(safeMotion * 1.8) * 2;
  const cardY = rect.y + pulse;
  const active = focus?.day === day && focus?.key === spec.key;

  ctx.save();
  ctx.strokeStyle = active ? `${palette.accent}cc` : `${palette.accent}55`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -safeMotion * 10;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width, cardY + 48);
  ctx.quadraticCurveTo(rect.x + rect.width + 38, cardY + 62, rect.x + rect.width + 58, cardY + 32);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 253, 245, 0.92)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.88)" : `${palette.accent}77`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = palette.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 16, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 16, cardY + 43);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.summary.slice(0, 38), rect.x + 16, cardY + rect.height - 11);

  const startX = rect.x + 20;
  const laneY = cardY + 66;
  const gap = 80;
  ctx.strokeStyle = `${palette.accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX + 10, laneY);
  ctx.lineTo(startX + gap * 3 + 10, laneY);
  ctx.stroke();

  steps.slice(0, 4).forEach((step, index) => {
    const dotX = startX + index * gap;
    const colors = {
      warn: { fill: "rgba(255, 240, 232, 0.94)", stroke: "#be4f37", text: "#be4f37" },
      learn: { fill: "rgba(236, 248, 243, 0.94)", stroke: "#4d91a6", text: "#4d91a6" },
      fix: { fill: "rgba(255, 248, 232, 0.96)", stroke: "#b47d2f", text: "#8f5f3f" },
      support: { fill: "rgba(237, 243, 223, 0.96)", stroke: "#286f58", text: "#286f58" },
    }[step.tone] || { fill: "rgba(255, 253, 245, 0.94)", stroke: palette.accent, text: palette.accent };
    ctx.fillStyle = colors.fill;
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = index === steps.length - 1 || active ? 2.1 : 1.5;
    ctx.beginPath();
    ctx.arc(dotX + 10, laneY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = colors.text;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(index + 1), dotX + 7, laneY + 3);
    ctx.fillStyle = colors.text;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(step.label, dotX - 1, laneY + 24);
  });

  if (!reducedMotion) {
    for (let i = 0; i < 5; i += 1) {
      const moteX = rect.x + 44 + i * 56 + Math.sin(safeMotion * 1.3 + i) * 3;
      const moteY = cardY + 30 + Math.cos(safeMotion * 1.6 + i) * 2;
      ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.86)" : `${palette.accent}66`;
      ctx.beginPath();
      ctx.arc(moteX, moteY, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(255, 248, 232, 0.78)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 88, cardY + 12, 70, 19, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("只定位", rect.x + rect.width - 70, cardY + 25);

  ctx.restore();
  return true;
}

export function drawFailureMercyLanternWorldWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = performance.now() / 1000,
  day = 1,
  focus = null,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !spec.nodes?.length || !drawCanvasCard) return false;
  const { rect, palette, nodes } = spec;
  const safeMotion = reducedMotion ? 0 : motion;
  const bob = reducedMotion ? 0 : Math.sin(safeMotion * 1.55) * 1.8;
  const glow = reducedMotion ? 0.5 : (Math.sin(safeMotion * 2.7) + 1) / 2;
  const focused = focus?.day === day && focus?.key === spec.key;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = focused ? `${palette.accent}cc` : `${palette.accent}66`;
  ctx.lineWidth = focused ? 3 : 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -safeMotion * 10;
  ctx.beginPath();
  ctx.moveTo(rect.x + 20, cardY + rect.height - 6);
  ctx.quadraticCurveTo(rect.x + rect.width * 0.5, cardY + rect.height + 16, rect.x + rect.width - 18, cardY + rect.height - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 253, 245, 0.9)");
  ctx.strokeStyle = focused ? "rgba(224, 182, 109, 0.78)" : `${palette.accent}55`;
  ctx.lineWidth = focused ? 2.4 : 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 17);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, cardY + 10, 114, 20, 10);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 22, cardY + 25);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 22), rect.x + 136, cardY + 24);

  nodes.forEach((node, index) => {
    const x = node.point.x;
    const y = node.point.y + bob;
    const active = focused && focus?.nodeKey === node.key;
    const alpha = 0.22 + glow * 0.16 + (active ? 0.18 : 0);
    ctx.fillStyle = `rgba(246, 240, 182, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(x, y + 12, active ? 38 : 30, active ? 12 : 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = active ? `${palette.accent}ee` : index === 0 ? "#b47d2f" : index === 1 ? "#286f58" : "#4d91a6";
    ctx.beginPath();
    ctx.roundRect(x - 18, y - 19, 36, 30, 10);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
    ctx.font = "900 13px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(node.glyph, x, y);
    ctx.fillStyle = active ? "#17231d" : "#5d6f65";
    ctx.font = active ? "800 10px Microsoft YaHei" : "700 9px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 4), x, y + 25);
    if (active) {
      ctx.strokeStyle = "rgba(224, 182, 109, 0.82)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y - 4, 24, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 9, 36, 17, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 40, cardY + 21);
  ctx.restore();
  return true;
}
