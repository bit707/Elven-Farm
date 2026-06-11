export function drawFirstSpiritAssistPrimerWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawSpiritSprite = () => {},
  colorWithAlpha = () => "rgba(202, 235, 210, 0.3)",
} = {}) {
  if (!ctx || !spec?.rect || !spec?.previewPlots?.length || !spec?.bounds || !spec?.profile || !spec?.spirit) return false;
  const { rect, bounds, profile, spirit } = spec;
  const takeoverPlots = spec.takeoverPlots?.length ? spec.takeoverPlots : spec.previewPlots;

  ctx.save();
  ctx.fillStyle = active ? "rgba(246, 240, 182, 0.18)" : "rgba(202, 235, 210, 0.13)";
  ctx.strokeStyle = active ? `${profile.accent}cc` : `${profile.accent}77`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 10, bounds.minY - 10, bounds.maxX - bounds.minX + 20, bounds.maxY - bounds.minY + 20, 18);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 4, bounds.minY - 34, 154, 24, 12);
  ctx.fill();
  ctx.strokeStyle = `${profile.accent}66`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 4, bounds.minY - 34, 154, 24, 12);
  ctx.stroke();
  ctx.fillStyle = profile.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.previewLabel || "3x3 预览"} · 3x3 接管范围`, bounds.minX + 8, bounds.minY - 18);

  if (takeoverPlots.length > 1) {
    ctx.strokeStyle = "rgba(77, 145, 166, 0.58)";
    ctx.lineWidth = active ? 3 : 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([6, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 20;
    ctx.beginPath();
    takeoverPlots.forEach((plot, index) => {
      const px = plot.screenX + spec.tile / 2;
      const py = plot.screenY + spec.tile * 0.52;
      if (index === 0) ctx.moveTo(px, py);
      else {
        const prev = takeoverPlots[index - 1];
        ctx.quadraticCurveTo((prev.screenX + plot.screenX) / 2 + spec.tile / 2, Math.min(prev.screenY, plot.screenY) + spec.tile * 0.32, px, py);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    const beadIndex = Math.floor((reducedMotion ? 0.55 : (motion * 0.82) % 1) * Math.max(1, takeoverPlots.length - 1));
    const beadPlot = takeoverPlots[Math.max(0, Math.min(takeoverPlots.length - 1, beadIndex))];
    if (beadPlot) {
      ctx.fillStyle = "rgba(159, 209, 223, 0.88)";
      ctx.beginPath();
      ctx.ellipse(beadPlot.screenX + spec.tile / 2, beadPlot.screenY + spec.tile * 0.52 + bob, 9 + pulse * 0.35, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
      ctx.font = "900 8px Microsoft YaHei";
      ctx.fillText("接管水脉", beadPlot.screenX + spec.tile * 0.18, beadPlot.screenY + spec.tile * 0.82);
    }
  }

  takeoverPlots.forEach((plot, index) => {
    const localPulse = plot.needsWater ? 0.3 + Math.max(0, Math.sin(motion * 2.2 + index * 0.55)) * 0.36 : 0.12;
    ctx.fillStyle = plot.needsWater ? colorWithAlpha([202, 235, 210], localPulse) : "rgba(255, 253, 245, 0.14)";
    ctx.beginPath();
    ctx.roundRect(plot.screenX + 5, plot.screenY + 5, spec.tile - 10, spec.tile - 10, 12);
    ctx.fill();
    ctx.strokeStyle = plot.x === spec.targetPlot.x && plot.y === spec.targetPlot.y ? profile.accent : `${profile.accent}55`;
    ctx.lineWidth = plot.x === spec.targetPlot.x && plot.y === spec.targetPlot.y ? 2.4 : 1.4;
    ctx.beginPath();
    ctx.roundRect(plot.screenX + 8, plot.screenY + 8, spec.tile - 16, spec.tile - 16, 10);
    ctx.stroke();
    ctx.fillStyle = plot.needsWater ? "#286f58" : plot.hasCrop ? "#8f5f3f" : "#7a8d80";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(plot.needsWater ? "代劳" : plot.hasCrop ? "待命" : "接管", plot.screenX + spec.tile * 0.14, plot.screenY + spec.tile * 0.82);
    ctx.fillStyle = plot.needsWater ? "#4d91a6" : `${profile.accent}aa`;
    ctx.beginPath();
    ctx.arc(plot.screenX + spec.tile * 0.76, plot.screenY + spec.tile * 0.24, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(String(index + 1), plot.screenX + spec.tile * 0.76 - 3, plot.screenY + spec.tile * 0.24 + 3);
    if (plot.needsWater) {
      ctx.fillStyle = "#4d91a6";
      ctx.beginPath();
      ctx.ellipse(plot.screenX + spec.tile * 0.5, plot.screenY + spec.tile * 0.55, 7, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.strokeStyle = `${profile.accent}88`;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(bounds.maxX, (bounds.minY + bounds.maxY) / 2);
  ctx.quadraticCurveTo(rect.x + 20, rect.y + rect.height / 2 + bob, rect.x + 28, rect.y + rect.height - 24 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.95)");
  ctx.strokeStyle = active ? profile.accent : `${profile.accent}88`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + bob, rect.width, rect.height, 20);
  ctx.stroke();

  ctx.fillStyle = `${profile.accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 16 + bob, 76, 76, 20);
  ctx.fill();
  drawSpiritSprite(ctx, spirit, rect.x + 18, rect.y + 18 + bob + pulse / 2, 72);

  ctx.fillStyle = profile.accent;
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 106, rect.y + 24 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 106, rect.y + 48 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.coverageLabel || "这 9 格会被伙伴接手", rect.x + 106, rect.y + 67 + bob);
  ctx.fillText((spec.detail || "").slice(0, 34), rect.x + 106, rect.y + 81 + bob);

  ctx.fillStyle = "rgba(202, 235, 210, 0.68)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 106, rect.y + 92 + bob, rect.width - 122, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(`伙伴代劳预演 · ${spec.benefitLabel || `预计省下 ${spec.staminaHint} 点体力`}`, rect.x + 118, rect.y + 107 + bob);

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 123 + bob, rect.width - 28, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("只定位伙伴栏与示范格，不会自动协助浇水、不会消耗体力", rect.x + 22, rect.y + 136 + bob);

  ctx.restore();
  return true;
}

export function spiritAssistTrailWorldSpecWorld({
  width = 960,
  height = 640,
  originX = 0,
  originY = 0,
  tile = 56,
  gap = 0,
  feedback = null,
  day = 1,
  dungeon = null,
  spirits = [],
  spiritVisualProfile = (spirit) => spirit,
  copy = {},
} = {}) {
  if (!feedback || feedback.day !== day || (dungeon && !dungeon.finished)) return null;
  const plots = Array.isArray(feedback.wateredPlots) ? feedback.wateredPlots.slice(0, 9) : [];
  if (!plots.length) return null;
  const fallbackSpirit = {
    id: feedback.spiritId || "spirit_luobo_01",
    lineId: feedback.lineId || "spirit_line_luobo",
    name: feedback.spiritName || copy.defaultSpiritName || "精怪",
    job: "farm",
  };
  const spirit = (spirits || []).find((entry) => entry.id === feedback.spiritId)
    || spirits[0]
    || fallbackSpirit;
  const profile = spiritVisualProfile(spirit || fallbackSpirit);
  const points = plots.map((plot) => ({
    ...plot,
    screenX: originX + plot.x * (tile + gap) + tile / 2,
    screenY: originY + plot.y * (tile + gap) + tile / 2,
    rect: {
      x: originX + plot.x * (tile + gap),
      y: originY + plot.y * (tile + gap),
      width: tile,
      height: tile,
    },
  }));
  const bounds = points.reduce((acc, point) => ({
    minX: Math.min(acc.minX, point.rect.x),
    minY: Math.min(acc.minY, point.rect.y),
    maxX: Math.max(acc.maxX, point.rect.x + point.rect.width),
    maxY: Math.max(acc.maxY, point.rect.y + point.rect.height),
  }), {
    minX: points[0].rect.x,
    minY: points[0].rect.y,
    maxX: points[0].rect.x + points[0].rect.width,
    maxY: points[0].rect.y + points[0].rect.height,
  });
  const rectWidth = 292;
  const rectHeight = 106;
  const preferRight = bounds.maxX < width - rectWidth - 34;
  const rect = {
    x: preferRight ? bounds.maxX + 24 : Math.max(24, bounds.minX - rectWidth - 24),
    y: Math.max(72, Math.min(height - rectHeight - 28, bounds.minY - 10)),
    width: rectWidth,
    height: rectHeight,
  };
  const wateredCount = Number(feedback.wateredCount || points.length);
  const staminaSaved = Number(feedback.staminaSaved || points.length * 5);
  return {
    key: `${feedback.day}:${feedback.spiritId}:${points.map((point) => `${point.x},${point.y}`).join("|")}`,
    day: feedback.day,
    title: feedback.firstAssist ? (copy.firstTitle || "第一次精怪代浇足迹 · 可点") : (copy.title || "精怪代浇足迹 · 可点"),
    headline: `${feedback.spiritName || spirit?.name || copy.defaultSpiritName || "精怪"}跑完 3x3 灵田`,
    detail: `浇水 ${wateredCount} 格 · 省下约 ${staminaSaved} 点体力`,
    cta: copy.cta || "只定位足迹与伙伴栏，不会再次触发协助",
    spirit,
    profile,
    points,
    bounds,
    rect,
    anchor: {
      x: (bounds.minX + bounds.maxX) / 2,
      y: bounds.minY,
    },
    wateredCount,
    staminaSaved,
  };
}

export function spiritAssistTrailWorldAtCanvasPointWorld({
  px,
  py,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  const targetPlot = spec.points.find((point) => (
    px >= point.rect.x
    && px <= point.rect.x + point.rect.width
    && py >= point.rect.y
    && py <= point.rect.y + point.rect.height
  )) || null;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  return onCard || targetPlot ? { ...spec, targetPlot } : null;
}

export function spiritAssistNineGridActionWorldSpecWorld({
  width = 960,
  height = 640,
  originX = 0,
  originY = 0,
  tile = 56,
  gap = 0,
  feedback = null,
  day = 1,
  dungeon = null,
  spirits = [],
  spiritVisualProfile = (spirit) => spirit,
  copy = {},
} = {}) {
  if (!feedback || feedback.day !== day || (dungeon && !dungeon.finished)) return null;
  const plots = Array.isArray(feedback.wateredPlots) ? feedback.wateredPlots.slice(0, 9) : [];
  if (!plots.length) return null;
  const fallbackSpirit = {
    id: feedback.spiritId || "spirit_luobo_01",
    lineId: feedback.lineId || "spirit_line_luobo",
    name: feedback.spiritName || copy.defaultSpiritName || "精怪",
    job: "farm",
  };
  const spirit = (spirits || []).find((entry) => entry.id === feedback.spiritId)
    || spirits[0]
    || fallbackSpirit;
  const profile = spiritVisualProfile(spirit || fallbackSpirit);
  const points = plots.map((plot) => ({
    ...plot,
    screenX: originX + plot.x * (tile + gap) + tile / 2,
    screenY: originY + plot.y * (tile + gap) + tile / 2,
    rect: {
      x: originX + plot.x * (tile + gap),
      y: originY + plot.y * (tile + gap),
      width: tile,
      height: tile,
    },
  }));
  const bounds = points.reduce((acc, point) => ({
    minX: Math.min(acc.minX, point.rect.x),
    minY: Math.min(acc.minY, point.rect.y),
    maxX: Math.max(acc.maxX, point.rect.x + point.rect.width),
    maxY: Math.max(acc.maxY, point.rect.y + point.rect.height),
  }), {
    minX: points[0].rect.x,
    minY: points[0].rect.y,
    maxX: points[0].rect.x + points[0].rect.width,
    maxY: points[0].rect.y + points[0].rect.height,
  });
  const cardWidth = 340;
  const cardHeight = 142;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const preferAbove = bounds.minY - cardHeight - 24 > 68;
  const x = Math.max(24, Math.min(width - cardWidth - 24, centerX - cardWidth / 2));
  const y = preferAbove
    ? bounds.minY - cardHeight - 24
    : Math.max(76, Math.min(height - cardHeight - 28, bounds.maxY + 24));
  const wateredCount = Number(feedback.wateredCount || points.length);
  const staminaSaved = Number(feedback.staminaSaved || points.length * 5);
  const steps = [
    {
      key: "start",
      label: copy.startLabel || "起步",
      value: points[0] ? `从 (${points[0].x + 1},${points[0].y + 1}) 抬桶` : (copy.startFallback || "从选中田起步"),
      detail: `${feedback.spiritName || spirit?.name || copy.defaultSpiritName || "精怪"}接手重复手浇`,
      color: profile.accent || "#286f58",
    },
    {
      key: "waterline",
      label: copy.waterlineLabel || "九格走水",
      value: `${wateredCount} 格连成水路`,
      detail: copy.waterlineDetail || "按 1-9 顺序跑完水痕",
      color: "#4d91a6",
    },
    {
      key: "ledger",
      label: copy.ledgerLabel || "省力入账",
      value: `省下约 ${staminaSaved} 体力`,
      detail: copy.ledgerDetail || "体力可转去加工或旧铺",
      color: "#b47d2f",
    },
  ];
  steps.forEach((step, index) => {
    step.rect = {
      x: x + 18 + index * 101,
      y: y + 82,
      width: 94,
      height: 42,
    };
  });
  return {
    key: `${feedback.day}:${feedback.spiritId}:${points.map((point) => `${point.x},${point.y}`).join("|")}:nine-grid-action`,
    day: feedback.day,
    title: feedback.firstAssist ? (copy.firstTitle || "第一次九宫格动作签 · 可点") : (copy.title || "精怪代浇九宫格动作签 · 可点"),
    headline: `${feedback.spiritName || spirit?.name || copy.defaultSpiritName || "精怪"}不是瞬移，是跑完 1-9 格`,
    detail: `${copy.routeText || "起步 -> 九格走水 -> 省力入账"} · 浇水 ${wateredCount} 格，省下约 ${staminaSaved} 体力`,
    safety: copy.safety || "只定位九宫格动作、水痕和伙伴栏，不会再次触发精怪协助、不会自动浇水或消耗体力。",
    spirit,
    profile,
    points,
    bounds,
    steps,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: centerX, y: preferAbove ? bounds.minY : bounds.maxY },
    wateredCount,
    staminaSaved,
  };
}

export function spiritAssistNineGridActionWorldAtCanvasPointWorld({
  px,
  py,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const targetPlot = spec.points.find((point) => (
    px >= point.rect.x
    && px <= point.rect.x + point.rect.width
    && py >= point.rect.y
    && py <= point.rect.y + point.rect.height
  )) || null;
  const step = spec.steps.find((entry) => {
    const rect = entry.rect;
    return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  }) || null;
  const { rect } = spec;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  return targetPlot || step || onCard
    ? { ...spec, targetPlot, activeStep: step || spec.steps[1] }
    : null;
}

export function spiritAssistSavingsLedgerWorldSpecWorld({
  width = 960,
  height = 640,
  originX = 0,
  originY = 0,
  tile = 56,
  gap = 0,
  feedback = null,
  day = 1,
  dungeon = null,
  spirits = [],
  plots = [],
  spiritVisualProfile = (spirit) => spirit,
  copy = {},
} = {}) {
  if (!feedback || feedback.day !== day || (dungeon && !dungeon.finished)) return null;
  const wateredPlots = Array.isArray(feedback.wateredPlots) ? feedback.wateredPlots.slice(0, 9) : [];
  if (!wateredPlots.length) return null;
  const fallbackSpirit = {
    id: feedback.spiritId || "spirit_luobo_01",
    lineId: feedback.lineId || "spirit_line_luobo",
    name: feedback.spiritName || copy.defaultSpiritName || "精怪",
    job: "farm",
  };
  const spirit = (spirits || []).find((entry) => entry.id === feedback.spiritId)
    || spirits[0]
    || fallbackSpirit;
  const profile = spiritVisualProfile(spirit || fallbackSpirit);
  const points = wateredPlots.map((plot) => ({
    ...plot,
    screenX: originX + plot.x * (tile + gap) + tile / 2,
    screenY: originY + plot.y * (tile + gap) + tile / 2,
    rect: {
      x: originX + plot.x * (tile + gap),
      y: originY + plot.y * (tile + gap),
      width: tile,
      height: tile,
    },
  }));
  const bounds = points.reduce((acc, point) => ({
    minX: Math.min(acc.minX, point.rect.x),
    minY: Math.min(acc.minY, point.rect.y),
    maxX: Math.max(acc.maxX, point.rect.x + point.rect.width),
    maxY: Math.max(acc.maxY, point.rect.y + point.rect.height),
  }), {
    minX: points[0].rect.x,
    minY: points[0].rect.y,
    maxX: points[0].rect.x + points[0].rect.width,
    maxY: points[0].rect.y + points[0].rect.height,
  });
  const center = feedback.center || { x: points[0].x, y: points[0].y };
  const remainingPlots = (plots || [])
    .filter((plot) => plot.cropId && !plot.watered)
    .map((plot) => ({
      ...plot,
      distance: Math.abs(plot.x - Number(center.x || 0)) + Math.abs(plot.y - Number(center.y || 0)),
      screenX: originX + plot.x * (tile + gap) + tile / 2,
      screenY: originY + plot.y * (tile + gap) + tile / 2,
      rect: {
        x: originX + plot.x * (tile + gap),
        y: originY + plot.y * (tile + gap),
        width: tile,
        height: tile,
      },
    }))
    .sort((a, b) => a.distance - b.distance || a.y - b.y || a.x - b.x);
  const nextPlot = remainingPlots[0] || null;
  const cardWidth = 316;
  const cardHeight = 118;
  const x = Math.max(24, Math.min(width - cardWidth - 24, bounds.minX + (bounds.maxX - bounds.minX - cardWidth) / 2));
  const belowY = bounds.maxY + 18;
  const aboveY = bounds.minY - cardHeight - 22;
  const y = belowY + cardHeight < height - 28
    ? belowY
    : Math.max(76, Math.min(height - cardHeight - 28, aboveY));
  const wateredCount = Number(feedback.wateredCount || points.length);
  const staminaSaved = Number(feedback.staminaSaved || points.length * 5);
  const rows = [
    {
      key: "watered",
      label: copy.wateredLabel || "水痕",
      value: `${wateredCount} 格`,
      detail: copy.wateredDetail || "刚由精怪跑完",
      color: "#4d91a6",
    },
    {
      key: "stamina",
      label: copy.staminaLabel || "省力",
      value: `${staminaSaved} 体力`,
      detail: copy.staminaDetail || "少做同等手浇",
      color: "#b47d2f",
    },
    {
      key: "next",
      label: copy.nextLabel || "下一片",
      value: nextPlot ? `${remainingPlots.length} 格待浇` : (copy.nextDoneValue || "今日已润"),
      detail: nextPlot ? `可接 (${nextPlot.x + 1},${nextPlot.y + 1})` : (copy.nextDoneDetail || "明日再接水线"),
      color: nextPlot ? "#be4f37" : "#286f58",
    },
  ];
  rows.forEach((row, index) => {
    row.rect = {
      x: x + 16 + index * 94,
      y: y + 72,
      width: 84,
      height: 30,
    };
  });
  return {
    key: `${feedback.day}:${feedback.spiritId}:${points.map((point) => `${point.x},${point.y}`).join("|")}:savings`,
    day: feedback.day,
    title: feedback.firstAssist ? (copy.firstTitle || "第一次省力账留签 · 可点") : (copy.title || "精怪省力账留签 · 可点"),
    headline: `${feedback.spiritName || spirit?.name || copy.defaultSpiritName || "精怪"}把手浇变成一趟水线`,
    detail: `浇水 ${wateredCount} 格 · 省下约 ${staminaSaved} 点体力`,
    nextText: nextPlot
      ? `还有 ${remainingPlots.length} 格待浇，下一轮可从 (${nextPlot.x + 1},${nextPlot.y + 1}) 接手。`
      : (copy.nextTextDone || "今日作物水分已经稳住，省下的体力可以转去加工、旧铺或摸摸伙伴。"),
    safety: copy.safety || "只定位省力账、伙伴栏和田格，不会再次触发精怪协助、不会自动浇水或消耗体力。",
    spirit,
    profile,
    points,
    bounds,
    nextPlot,
    remainingCount: remainingPlots.length,
    rows,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: (bounds.minX + bounds.maxX) / 2, y: bounds.maxY },
    wateredCount,
    staminaSaved,
  };
}

export function spiritAssistSavingsLedgerWorldAtCanvasPointWorld({
  px,
  py,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const row = spec.rows.find((entry) => {
    const rect = entry.rect;
    return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  }) || null;
  const wateredPlot = spec.points.find((point) => (
    px >= point.rect.x
    && px <= point.rect.x + point.rect.width
    && py >= point.rect.y
    && py <= point.rect.y + point.rect.height
  )) || null;
  const nextPlot = spec.nextPlot
    && px >= spec.nextPlot.rect.x
    && px <= spec.nextPlot.rect.x + spec.nextPlot.rect.width
    && py >= spec.nextPlot.rect.y
    && py <= spec.nextPlot.rect.y + spec.nextPlot.rect.height
    ? spec.nextPlot
    : null;
  const { rect } = spec;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  return row || wateredPlot || nextPlot || onCard
    ? {
      ...spec,
      activeRow: row || spec.rows[0],
      targetPlot: wateredPlot || nextPlot || null,
      targetKind: nextPlot ? "next" : wateredPlot ? "watered" : "card",
    }
    : null;
}

export function spiritAssistToWorkshopBridgeWorldSpecWorld({
  width = 960,
  height = 640,
  originX = 0,
  originY = 0,
  tile = 56,
  gap = 0,
  feedback = null,
  day = 1,
  dungeon = null,
  wateredPlots = [],
  candidates = [],
  top = null,
  craftCompleted = false,
  copy = {},
} = {}) {
  if (!feedback || feedback.day !== day || (dungeon && !dungeon.finished)) return null;
  if (!wateredPlots.length || !top) return null;
  const points = wateredPlots.map((plot) => ({
    ...plot,
    screenX: originX + plot.x * (tile + gap) + tile / 2,
    screenY: originY + plot.y * (tile + gap) + tile / 2,
    rect: {
      x: originX + plot.x * (tile + gap),
      y: originY + plot.y * (tile + gap),
      width: tile,
      height: tile,
    },
  }));
  const bounds = points.reduce((acc, point) => ({
    minX: Math.min(acc.minX, point.rect.x),
    minY: Math.min(acc.minY, point.rect.y),
    maxX: Math.max(acc.maxX, point.rect.x + point.rect.width),
    maxY: Math.max(acc.maxY, point.rect.y + point.rect.height),
  }), {
    minX: points[0].rect.x,
    minY: points[0].rect.y,
    maxX: points[0].rect.x + points[0].rect.width,
    maxY: points[0].rect.y + points[0].rect.height,
  });
  const rectWidth = 326;
  const rectHeight = 118;
  const x = Math.max(24, Math.min(width - rectWidth - 24, bounds.maxX + 34));
  const y = Math.max(210, Math.min(height - rectHeight - 42, bounds.maxY + 18));
  const orderText = top.orderMatch
    ? top.orderMatch.ready
      ? `这锅出完可交「${top.orderMatch.orderTitle}」`
      : `接上「${top.orderMatch.orderTitle}」，还差 ${top.orderMatch.missingText || "余料"}`
    : craftCompleted
      ? (copy.shopFallbackText || "出锅后可留作旧铺备货")
      : (copy.firstCookText || "第一锅会把工坊和订单线点亮");
  const staminaSaved = Number(feedback.staminaSaved || wateredPlots.length * 5);
  const steps = [
    {
      key: "saved",
      glyph: copy.savedGlyph || "省",
      label: copy.savedLabel || "省下体力",
      text: `约 ${staminaSaved} 点`,
      done: true,
    },
    {
      key: "cook",
      glyph: copy.cookGlyph || "锅",
      label: copy.cookLabel || "转去入锅",
      text: top.recipeTitle,
      done: false,
      active: true,
    },
    {
      key: top.orderMatch ? "order" : "shop",
      glyph: top.orderMatch ? (copy.orderGlyph || "单") : (copy.shopGlyph || "铺"),
      label: top.orderMatch ? (copy.orderLabel || "订单/回款") : (copy.shopLabel || "旧铺备货"),
      text: top.orderMatch ? (top.orderMatch.ready ? (copy.orderReadyText || "可交单") : (copy.orderPendingText || "补缺口")) : (copy.shopStepText || "先入仓"),
      done: false,
    },
  ];
  const stepStartX = x + 48;
  const stepY = y + 86;
  steps.forEach((step, index) => {
    const pointX = stepStartX + index * 84;
    step.point = { x: pointX, y: stepY };
    step.hit = { x: pointX - 26, y: stepY - 24, width: 52, height: 48 };
  });
  return {
    key: `${day}:${feedback.spiritId}:${top.recipeId}:${feedback.wateredCount || wateredPlots.length}:assist_workshop_bridge`,
    day,
    title: copy.title || "精怪省力去向桥 · 可点",
    headline: `${feedback.spiritName || copy.defaultSpiritName || "精怪"}省下的手工，正好转去第一锅`,
    detail: `代浇 ${Number(feedback.wateredCount || wateredPlots.length)} 格 -> ${top.recipeTitle} -> ${orderText}`,
    routeText: copy.routeText || "省下体力 -> 转去入锅 -> 订单/旧铺备货",
    safety: copy.safety || "只定位配方栏、订单板或旧铺备货说明，不会自动加工、排产、出锅、交单、开铺、入夜或消耗材料。",
    feedback,
    points,
    bounds,
    top,
    candidates: (candidates || []).slice(0, 3),
    orderText,
    steps,
    rect: { x, y, width: rectWidth, height: rectHeight },
    anchor: {
      x: (bounds.minX + bounds.maxX) / 2,
      y: bounds.maxY,
    },
    workshopAnchor: copy.workshopAnchor || { x: 708, y: 470 },
  };
}

export function spiritAssistToWorkshopBridgeWorldAtCanvasPointWorld({
  px,
  py,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const step = spec.steps.find((entry) => (
    entry.hit
    && px >= entry.hit.x
    && px <= entry.hit.x + entry.hit.width
    && py >= entry.hit.y
    && py <= entry.hit.y + entry.hit.height
  )) || null;
  const { rect } = spec;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  return step || onCard ? { ...spec, focusStep: step || spec.steps[1] } : null;
}

export function spiritAssistRhythmWorldSpecWorld({
  width = 960,
  height = 640,
  originX = 0,
  originY = 0,
  tile = 56,
  gap = 0,
  day = 1,
  dungeon = null,
  spirits = [],
  plots = [],
  assistCompleted = false,
  spiritVisualProfile = (spirit) => spirit,
  copy = {},
} = {}) {
  if (!(spirits || []).length || !assistCompleted || (dungeon && !dungeon.finished)) return null;
  const spirit = (spirits || []).find((entry) => (entry.job || "farm") === "farm") || spirits[0];
  if (!spirit) return null;
  const cropPlots = (plots || []).filter((plot) => plot.cropId);
  if (!cropPlots.length) return null;
  const needsWater = cropPlots.filter((plot) => !plot.watered);
  const watered = cropPlots.filter((plot) => plot.watered);
  const activePlots = (needsWater.length ? needsWater : watered)
    .slice(0, 6)
    .map((plot, index) => ({
      ...plot,
      runIndex: index,
      needsWater: !plot.watered,
      screenX: originX + plot.x * (tile + gap) + tile / 2,
      screenY: originY + plot.y * (tile + gap) + tile / 2,
      rect: {
        x: originX + plot.x * (tile + gap),
        y: originY + plot.y * (tile + gap),
        width: tile,
        height: tile,
      },
    }));
  const mood = Math.round(Number(spirit.mood || 0));
  const hunger = Math.round(Number(spirit.hunger || 0));
  const stamina = Math.round(Number(spirit.stamina || 0));
  const tired = stamina < 18 || hunger < 30 || mood < 40;
  const ready = needsWater.length > 0 && !tired;
  const settled = needsWater.length === 0;
  const profile = spiritVisualProfile(spirit);
  const rectWidth = 318;
  const rectHeight = 126;
  const rect = {
    x: Math.max(24, Math.min(width - rectWidth - 24, originX + (tile + gap) * ((plots || []).length > 36 ? 8 : 6) + 42)),
    y: Math.max(154, Math.min(height - rectHeight - 28, originY + 72)),
    width: rectWidth,
    height: rectHeight,
  };
  return {
    key: `${day}:${spirit.id}:${needsWater.length}:${watered.length}:${mood}:${hunger}:${stamina}:assist_rhythm`,
    day,
    title: copy.title || "伙伴上工节奏牌 · 可点",
    headline: tired
      ? `${spirit.name}${copy.tiredHeadlineSuffix || "需要缓一口气"}`
      : ready
        ? `${spirit.name}${copy.readyHeadlineSuffix || "在田埂旁待命"}`
        : `${spirit.name}${copy.settledHeadlineSuffix || "把水痕守住了"}`,
    detail: tired
      ? `体力 ${stamina} · 心情 ${mood} · 饱腹 ${hunger}，${copy.tiredDetailTail || "先照顾伙伴再派工更稳。"}`
      : ready
        ? `待浇 ${needsWater.length} 格 · 已润 ${watered.length} 格，${copy.readyDetailTail || "适合再接一轮 3x3 协助。"}`
        : `今日作物已润 ${watered.length} 格，${copy.settledDetailTail || "自动化的省力感已经留在田里。"} `,
    nextAction: tired
      ? (copy.tiredNextAction || "先摸摸、喂食或入夜休息，让伙伴别被连续压榨。")
      : ready
        ? (copy.readyNextAction || "选一块待浇地，再到伙伴栏点「让精怪协助」。")
        : (copy.settledNextAction || "明天有新待浇地时，再让伙伴接手最密的一片。"),
    cta: copy.cta || "只定位田格和伙伴栏，不会自动触发精怪协助",
    spirit,
    profile,
    activePlots,
    needsWaterCount: needsWater.length,
    wateredCount: watered.length,
    stamina,
    mood,
    hunger,
    tired,
    ready,
    settled,
    rect,
    anchor: activePlots.length
      ? { x: activePlots[0].screenX, y: activePlots[0].screenY }
      : { x: originX + tile * 2, y: originY + tile * 2 },
    accent: tired ? "#be4f37" : ready ? profile.accent : "#286f58",
  };
}

export function spiritAssistRhythmWorldAtCanvasPointWorld({
  px,
  py,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const targetPlot = spec.activePlots.find((plot) => (
    px >= plot.rect.x
    && px <= plot.rect.x + plot.rect.width
    && py >= plot.rect.y
    && py <= plot.rect.y + plot.rect.height
  )) || null;
  const { rect } = spec;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  return onCard || targetPlot ? { ...spec, targetPlot } : null;
}

export function drawSpiritAssistTrailWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0,
  active = false,
  activePlotKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.points?.length || !spec?.bounds || !spec?.profile || !spec?.anchor) return false;
  const { rect, bounds, points, profile } = spec;

  ctx.save();

  ctx.fillStyle = active ? "rgba(202, 235, 210, 0.22)" : "rgba(202, 235, 210, 0.14)";
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.74)" : "rgba(77, 145, 166, 0.42)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 9, bounds.minY - 9, bounds.maxX - bounds.minX + 18, bounds.maxY - bounds.minY + 18, 18);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.86)" : "rgba(77, 145, 166, 0.58)";
  ctx.lineWidth = active ? 3 : 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([7, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 20;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.screenX, point.screenY);
    else {
      const prev = points[index - 1];
      ctx.quadraticCurveTo((prev.screenX + point.screenX) / 2, Math.min(prev.screenY, point.screenY) - 18, point.screenX, point.screenY);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);

  points.forEach((point, index) => {
    const localActive = active && activePlotKey === `${point.x},${point.y}`;
    const step = reducedMotion ? 0.5 : (motion * 0.75 + index * 0.13) % 1;
    const shimmer = Math.sin(step * Math.PI) * 0.28;
    ctx.fillStyle = localActive ? "rgba(255, 253, 245, 0.46)" : `rgba(159, 209, 223, ${0.2 + shimmer})`;
    ctx.beginPath();
    ctx.roundRect(point.rect.x + 6, point.rect.y + 6, point.rect.width - 12, point.rect.height - 12, 13);
    ctx.fill();
    ctx.strokeStyle = localActive ? "rgba(224, 182, 109, 0.86)" : "rgba(77, 145, 166, 0.48)";
    ctx.lineWidth = localActive ? 3 : 1.6;
    ctx.beginPath();
    ctx.roundRect(point.rect.x + 9, point.rect.y + 9, point.rect.width - 18, point.rect.height - 18, 13);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 253, 245, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(point.screenX, point.screenY + 12 + pulse * 0.2, point.rect.width * (0.22 + shimmer * 0.18), point.rect.height * 0.07, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = localActive ? "#b47d2f" : "#4d91a6";
    ctx.beginPath();
    ctx.arc(point.screenX + point.rect.width * 0.22, point.screenY - point.rect.height * 0.22, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(String(index + 1), point.screenX + point.rect.width * 0.22 - 3, point.screenY - point.rect.height * 0.22 + 3);
  });

  const bead = points[Math.floor((reducedMotion ? 0.6 : (motion * 0.62) % 1) * Math.max(0, points.length - 1))] || points[0];
  ctx.fillStyle = profile.glow || "rgba(202, 235, 210, 0.7)";
  ctx.beginPath();
  ctx.ellipse(bead.screenX, bead.screenY + 20 + bob, 28 + pulse, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.strokeStyle = profile.accent || "#286f58";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(bead.screenX, bead.screenY - 8 + bob, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = profile.accent || "#286f58";
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText((profile.glyph || "灵").slice(0, 1), bead.screenX - 6, bead.screenY - 4 + bob);

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.82)" : "rgba(77, 145, 166, 0.46)";
  ctx.lineWidth = active ? 2.5 : 1.8;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y - 8);
  ctx.quadraticCurveTo((spec.anchor.x + rect.x) / 2, rect.y + rect.height + 24 + bob, rect.x + 34, rect.y + rect.height - 12 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(236, 248, 243, 0.94)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : "rgba(77, 145, 166, 0.52)";
  ctx.lineWidth = active ? 2.6 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + bob, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + bob, 48, 44, 15);
  ctx.fill();
  ctx.fillStyle = profile.accent || "#286f58";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("浇", rect.x + 28, rect.y + 42 + bob);
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 74, rect.y + 24 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 74, rect.y + 47 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail, rect.x + 74, rect.y + 65 + bob);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 28 + bob, rect.width - 32, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 36), rect.x + 26, rect.y + rect.height - 16 + bob);
  ctx.restore();
  return true;
}

export function drawSpiritAssistNineGridActionWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0,
  active = false,
  activePlotKey = "",
  activeStepKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawSpiritSprite = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.points?.length || !spec?.bounds || !spec?.profile || !spec?.anchor || !spec?.steps?.length) return false;
  const { rect, bounds, profile, points, steps } = spec;
  const routeT = reducedMotion ? 0.68 : (motion * 0.58) % 1;
  const routeIndex = Math.max(0, Math.min(points.length - 1, Math.floor(routeT * points.length)));
  const bead = points[routeIndex] || points[0];

  ctx.save();

  ctx.fillStyle = active ? "rgba(202, 235, 210, 0.24)" : "rgba(202, 235, 210, 0.13)";
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.76)" : "rgba(77, 145, 166, 0.42)";
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 12, bounds.minY - 12, bounds.maxX - bounds.minX + 24, bounds.maxY - bounds.minY + 24, 18);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.9)" : "rgba(77, 145, 166, 0.62)";
  ctx.lineWidth = active ? 3.2 : 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.screenX, point.screenY + bob * 0.2);
    else {
      const prev = points[index - 1];
      ctx.quadraticCurveTo((prev.screenX + point.screenX) / 2, Math.min(prev.screenY, point.screenY) - 20 + bob, point.screenX, point.screenY + bob * 0.2);
    }
  });
  ctx.stroke();

  points.forEach((point, index) => {
    const focused = active && activePlotKey === `${point.x},${point.y}`;
    const passed = index <= routeIndex;
    const shimmer = reducedMotion ? 0.5 : (Math.sin(motion * 2.4 + index * 0.48) + 1) / 2;
    ctx.fillStyle = focused
      ? "rgba(255, 253, 245, 0.48)"
      : passed
        ? `rgba(159, 209, 223, ${0.22 + shimmer * 0.16})`
        : "rgba(255, 253, 245, 0.14)";
    ctx.beginPath();
    ctx.roundRect(point.rect.x + 8, point.rect.y + 8, point.rect.width - 16, point.rect.height - 16, 12);
    ctx.fill();
    ctx.strokeStyle = focused ? "rgba(224, 182, 109, 0.9)" : passed ? "rgba(77, 145, 166, 0.58)" : "rgba(141, 164, 98, 0.38)";
    ctx.lineWidth = focused ? 3 : 1.5;
    ctx.beginPath();
    ctx.roundRect(point.rect.x + 11, point.rect.y + 11, point.rect.width - 22, point.rect.height - 22, 10);
    ctx.stroke();
    ctx.fillStyle = passed ? "#4d91a6" : "#7a8d80";
    ctx.beginPath();
    ctx.arc(point.screenX + point.rect.width * 0.22, point.screenY - point.rect.height * 0.2, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(String(index + 1), point.screenX + point.rect.width * 0.22 - 3, point.screenY - point.rect.height * 0.2 + 3);
    if (passed) {
      ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
      ctx.beginPath();
      ctx.ellipse(point.screenX, point.screenY + 15, point.rect.width * 0.2, 5 + shimmer * 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  if (bead) {
    ctx.fillStyle = profile.glow || "rgba(202, 235, 210, 0.74)";
    ctx.beginPath();
    ctx.ellipse(bead.screenX, bead.screenY + 20 + bob, 27 + pulse, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
    ctx.strokeStyle = profile.accent || "#286f58";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bead.screenX, bead.screenY - 8 + bob, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = profile.accent || "#286f58";
    ctx.font = "900 11px Microsoft YaHei";
    ctx.fillText((profile.glyph || "灵").slice(0, 1), bead.screenX - 6, bead.screenY - 4 + bob);
    ctx.fillStyle = "#4d91a6";
    ctx.beginPath();
    ctx.ellipse(bead.screenX + 23, bead.screenY - 6 + bob, 5, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.82)" : "rgba(77, 145, 166, 0.46)";
  ctx.lineWidth = active ? 2.6 : 1.8;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo((spec.anchor.x + rect.x + 34) / 2, rect.y + rect.height / 2 + bob, rect.x + 34, rect.y + rect.height - 18 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.86)" : `${profile.accent || "#286f58"}88`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + bob, rect.width, rect.height, 20);
  ctx.stroke();

  ctx.fillStyle = `${profile.accent || "#286f58"}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 16 + bob, 58, 58, 18);
  ctx.fill();
  drawSpiritSprite(ctx, spec.spirit, rect.x + 20, rect.y + 18 + bob + pulse * 0.24, 52);

  ctx.fillStyle = profile.accent || "#286f58";
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 90, rect.y + 25 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 90, rect.y + 49 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.wateredCount} 格水痕按序亮起 · 省下约 ${spec.staminaSaved} 体力`, rect.x + 90, rect.y + 67 + bob);

  steps.forEach((step, index) => {
    const focused = active && activeStepKey === step.key;
    ctx.fillStyle = focused ? "rgba(255, 253, 245, 0.96)" : `${step.color}18`;
    ctx.strokeStyle = focused ? `${step.color}cc` : `${step.color}55`;
    ctx.lineWidth = focused ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(step.rect.x, step.rect.y + bob, step.rect.width, step.rect.height, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = step.color;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(step.label, step.rect.x + 10, step.rect.y + 16 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(step.value.slice(0, 12), step.rect.x + 10, step.rect.y + 31 + bob);
    if (index < steps.length - 1) {
      ctx.fillStyle = "rgba(77, 145, 166, 0.62)";
      ctx.font = "900 12px Microsoft YaHei";
      ctx.fillText(">", step.rect.x + step.rect.width + 4, step.rect.y + 27 + bob);
    }
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + rect.height - 16 + bob, rect.width - 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("只定位九宫格动作 · 不再次协助 / 不自动浇水 / 不消耗体力", rect.x + 28, rect.y + rect.height - 3 + bob);

  ctx.restore();
  return true;
}

export function drawSpiritAssistSavingsLedgerWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  active = false,
  activePlotKey = "",
  activeRowKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.points?.length || !spec?.profile || !spec?.anchor || !spec?.rows?.length) return false;
  const { rect, profile, rows } = spec;
  const accent = profile?.accent || "#4d91a6";

  ctx.save();

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.86)" : "rgba(77, 145, 166, 0.44)";
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y + 8);
  ctx.quadraticCurveTo((spec.anchor.x + rect.x) / 2, rect.y + rect.height + 22 + bob, rect.x + 34, rect.y + rect.height - 14 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  spec.points.forEach((point, index) => {
    const focused = active && activePlotKey === `${point.x},${point.y}`;
    const shimmer = reducedMotion ? 0.5 : (Math.sin(motion * 2.8 + index * 0.6) + 1) / 2;
    ctx.fillStyle = focused ? "rgba(255, 253, 245, 0.36)" : `rgba(159, 209, 223, ${0.14 + shimmer * 0.12})`;
    ctx.beginPath();
    ctx.roundRect(point.rect.x + 12, point.rect.y + 12, point.rect.width - 24, point.rect.height - 24, 12);
    ctx.fill();
    ctx.strokeStyle = focused ? "rgba(224, 182, 109, 0.82)" : "rgba(77, 145, 166, 0.36)";
    ctx.lineWidth = focused ? 2.4 : 1.4;
    ctx.beginPath();
    ctx.ellipse(point.screenX, point.screenY + 14, point.rect.width * 0.2, point.rect.height * 0.07, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  if (spec.nextPlot) {
    const focused = active && activePlotKey === `${spec.nextPlot.x},${spec.nextPlot.y}`;
    ctx.fillStyle = focused ? "rgba(255, 248, 232, 0.32)" : "rgba(190, 79, 55, 0.12)";
    ctx.beginPath();
    ctx.roundRect(spec.nextPlot.rect.x + 7, spec.nextPlot.rect.y + 7, spec.nextPlot.rect.width - 14, spec.nextPlot.rect.height - 14, 12);
    ctx.fill();
    ctx.strokeStyle = focused ? "rgba(190, 79, 55, 0.86)" : "rgba(190, 79, 55, 0.42)";
    ctx.lineWidth = focused ? 2.6 : 1.5;
    ctx.beginPath();
    ctx.roundRect(spec.nextPlot.rect.x + 10, spec.nextPlot.rect.y + 10, spec.nextPlot.rect.width - 20, spec.nextPlot.rect.height - 20, 10);
    ctx.stroke();
    ctx.fillStyle = "#be4f37";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText("下一片", spec.nextPlot.rect.x + 16, spec.nextPlot.rect.y + spec.nextPlot.rect.height - 14);
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.92)" : "rgba(77, 145, 166, 0.52)";
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + bob, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + bob, 48, 44, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("账", rect.x + 28, rect.y + 42 + bob);
  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 74, rect.y + 24 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 74, rect.y + 46 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.nextText.slice(0, 35), rect.x + 74, rect.y + 63 + bob);

  rows.forEach((row) => {
    const rowActive = active && activeRowKey === row.key;
    ctx.fillStyle = rowActive ? "rgba(255, 253, 245, 0.96)" : `${row.color}18`;
    ctx.strokeStyle = rowActive ? `${row.color}cc` : `${row.color}55`;
    ctx.lineWidth = rowActive ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(row.rect.x, row.rect.y + bob, row.rect.width, row.rect.height, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = row.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(row.label, row.rect.x + 8, row.rect.y + 12 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(String(row.value).slice(0, 8), row.rect.x + 8, row.rect.y + 24 + bob);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 14 + bob, rect.width - 32, 10, 5);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText("只定位省力账 · 不再次协助 / 不自动浇水", rect.x + 24, rect.y + rect.height - 6 + bob);
  ctx.restore();
  return true;
}

export function drawSpiritAssistToWorkshopBridgeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0,
  active = false,
  activeStepKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.top || !spec?.anchor || !spec?.workshopAnchor || !spec?.steps?.length) return false;
  const { rect, anchor, workshopAnchor, top } = spec;
  const cardY = rect.y + bob;
  const accent = top.orderMatch?.ready ? "#286f58" : top.orderMatch ? "#be4f37" : "#b47d2f";

  ctx.save();
  ctx.strokeStyle = active ? `${accent}cc` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 10);
  ctx.bezierCurveTo(anchor.x + 36, anchor.y + 62, rect.x + 22, cardY + rect.height - 22, rect.x + 34, cardY + rect.height - 16);
  ctx.moveTo(rect.x + rect.width - 38, cardY + rect.height - 18);
  ctx.bezierCurveTo(rect.x + rect.width + 34, cardY + 98, workshopAnchor.x - 52, workshopAnchor.y + 8, workshopAnchor.x, workshopAnchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  spec.points.forEach((point, index) => {
    const shimmer = reducedMotion ? 0.45 : (Math.sin(motion * 2.1 + index * 0.6) + 1) / 2;
    ctx.fillStyle = `rgba(77, 145, 166, ${0.12 + shimmer * 0.14})`;
    ctx.beginPath();
    ctx.roundRect(point.rect.x + 10, point.rect.y + 10, point.rect.width - 20, point.rect.height - 20, 12);
    ctx.fill();
  });

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.95)");
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 50, 48, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("桥", rect.x + 29, cardY + 45);
  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 78, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 78, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${top.recipeTitle} · ${spec.orderText}`.slice(0, 36), rect.x + 78, cardY + 63);

  ctx.strokeStyle = "rgba(141, 164, 98, 0.42)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  spec.steps.forEach((step, index) => {
    const pointY = step.point.y + bob;
    if (index === 0) ctx.moveTo(step.point.x, pointY);
    else ctx.lineTo(step.point.x, pointY);
  });
  ctx.stroke();

  spec.steps.forEach((step) => {
    const focused = active && activeStepKey === step.key;
    const live = step.active || focused;
    const radius = live ? 12 + Math.max(0, pulse) : 10;
    const pointY = step.point.y + bob;
    ctx.fillStyle = step.done ? "rgba(141, 164, 98, 0.22)" : live ? `${accent}22` : "rgba(23, 35, 29, 0.08)";
    ctx.beginPath();
    ctx.arc(step.point.x, pointY, radius + 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = step.done ? "#8da462" : live ? accent : "#a8b2aa";
    ctx.beginPath();
    ctx.arc(step.point.x, pointY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(step.glyph, step.point.x, pointY + 4);
    ctx.fillStyle = live ? "#17231d" : "#5d6f65";
    ctx.font = live ? "800 9px Microsoft YaHei" : "700 8px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 5), step.point.x, cardY + 108);
  });
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 68, cardY + 13, 50, 20, 10);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("只定位", rect.x + rect.width - 57, cardY + 27);
  ctx.restore();
  return true;
}

export function drawSpiritAssistRhythmWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0,
  active = false,
  activePlotKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawSpiritSprite = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.spirit || !spec?.anchor) return false;
  const { rect, profile } = spec;
  const accent = spec.accent || profile?.accent || "#4d91a6";

  ctx.save();

  ctx.strokeStyle = active ? `${accent}bb` : `${accent}55`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([8, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x - 24, rect.y + 44 + bob, rect.x + 20, rect.y + rect.height - 24 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  spec.activePlots.forEach((plot, index) => {
    const localActive = active && activePlotKey === `${plot.x},${plot.y}`;
    const waterAlpha = plot.needsWater ? 0.15 + Math.max(0, Math.sin(motion * 2 + index)) * 0.22 : 0.2;
    ctx.fillStyle = plot.needsWater ? `rgba(77, 145, 166, ${waterAlpha})` : "rgba(202, 235, 210, 0.22)";
    ctx.beginPath();
    ctx.roundRect(plot.rect.x + 6, plot.rect.y + 6, plot.rect.width - 12, plot.rect.height - 12, 12);
    ctx.fill();
    ctx.strokeStyle = localActive ? `${accent}cc` : `${accent}55`;
    ctx.lineWidth = localActive ? 2.6 : 1.4;
    ctx.beginPath();
    ctx.roundRect(plot.rect.x + 9, plot.rect.y + 9, plot.rect.width - 18, plot.rect.height - 18, 10);
    ctx.stroke();
    ctx.fillStyle = plot.needsWater ? "#4d91a6" : "#286f58";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(plot.needsWater ? "待" : "润", plot.rect.x + plot.rect.width - 20, plot.rect.y + 19);
  });

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, spec.tired ? "rgba(255, 240, 232, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? accent : `${accent}88`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + bob, rect.width, rect.height, 20);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 15 + bob, 74, 74, 20);
  ctx.fill();
  drawSpiritSprite(ctx, spec.spirit, rect.x + 18, rect.y + 18 + bob + pulse * 0.4, 70);

  ctx.fillStyle = accent;
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 104, rect.y + 25 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 104, rect.y + 49 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 34), rect.x + 104, rect.y + 68 + bob);

  const chips = [
    { label: "待浇", value: spec.needsWaterCount, color: "#4d91a6" },
    { label: "已润", value: spec.wateredCount, color: "#286f58" },
    { label: "体力", value: spec.stamina, color: spec.stamina < 35 ? "#be4f37" : "#b47d2f" },
  ];
  chips.forEach((chip, index) => {
    const chipX = rect.x + 104 + index * 66;
    ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
    ctx.strokeStyle = `${chip.color}44`;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(chipX, rect.y + 80 + bob, 56, 21, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = chip.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(chip.label, chipX + 7, rect.y + 93 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(String(chip.value), chipX + 37, rect.y + 93 + bob);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 20 + bob, rect.width - 32, 15, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`下一步：${spec.nextAction} · 不会自动协助浇水`.slice(0, 46), rect.x + 24, rect.y + rect.height - 9 + bob);
  ctx.restore();
  return true;
}
