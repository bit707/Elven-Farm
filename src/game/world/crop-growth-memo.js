export function cropGrowthMemoWorldRowsWorld({
  limit = 3,
  state,
  data,
  itemName,
  cropWorldGrowthVisualSpec,
  growingCropUseRouteSpec,
  cropGrowthMemoToneSpec,
  cropGrowthMemoReason,
  cropGrowthMemoActionForRow,
}) {
  const rows = state.plots
    .filter((plot) => plot.cropId)
    .map((plot) => {
      const crop = data.cropsById.get(plot.cropId);
      if (!crop) return null;
      const visual = cropWorldGrowthVisualSpec(crop, plot);
      const route = growingCropUseRouteSpec(plot);
      const tone = plot.mature
        ? "harvest"
        : visual?.affinity?.state === "risk"
          ? "risk"
          : visual?.needsWater
            ? "water"
            : Number(visual?.yieldBonus?.amount || 0) > 0
              ? "boost"
              : visual?.affinity?.state === "season"
                ? "season"
                : "offseason";
      const palette = cropGrowthMemoToneSpec(tone);
      const growDays = Math.max(1, Number(crop.grow_days || 1));
      const age = Math.max(0, state.day - Number(plot.plantedDay || state.day));
      const progress = plot.mature ? 1 : Math.max(0.08, Math.min(0.96, age / growDays));
      const score = {
        risk: 96,
        harvest: 90,
        water: 82,
        boost: 76,
        season: 56,
        offseason: 42,
      }[tone] || 36;
      return {
        key: `${plot.x},${plot.y}:${plot.cropId}:${tone}:${visual?.stage || "growing"}`,
        plot,
        crop,
        route,
        visual,
        tone,
        palette,
        x: plot.x,
        y: plot.y,
        cropName: itemName(plot.cropId),
        stageLabel: visual?.stageLabel || "生长",
        title: `${itemName(plot.cropId)} · ${palette.label}`,
        reason: cropGrowthMemoReason(visual, route),
        progress,
        progressText: plot.mature ? "可收" : `${Math.round(progress * 100)}%`,
        action: cropGrowthMemoActionForRow({ tone, route }),
        score: score + Number(visual?.yieldBonus?.amount || 0) * 5 + (plot.waterSoil ? 2 : 0),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.y - b.y || a.x - b.x);
  return rows.slice(0, limit);
}

export function cropGrowthMemoWorldSpecWorld({
  width = 960,
  height = 640,
  originXInput = null,
  originYInput = null,
  tileInput = null,
  gapInput = null,
  rows = [],
  metrics,
  day,
  termName,
}) {
  if (!rows.length) return null;
  const { tile, gap, originX, originY } = metrics;
  const safeOriginX = Number(originXInput ?? originX);
  const safeOriginY = Number(originYInput ?? originY);
  const safeTile = Number(tileInput ?? tile);
  const safeGap = Number(gapInput ?? gap);
  const top = rows[0];
  const point = {
    x: safeOriginX + top.x * (safeTile + safeGap) + safeTile * 0.5,
    y: safeOriginY + top.y * (safeTile + safeGap) + safeTile * 0.5,
  };
  const cardWidth = 332;
  const cardHeight = rows.length > 1 ? 150 : 118;
  const rect = {
    x: Math.max(18, Math.min(width - cardWidth - 18, point.x + (point.x > width * 0.58 ? -cardWidth - 44 : 72))),
    y: Math.max(52, Math.min(height - cardHeight - 30, point.y - 118)),
    width: cardWidth,
    height: cardHeight,
  };
  rows.forEach((row, index) => {
    row.badgeRect = {
      x: safeOriginX + row.x * (safeTile + safeGap) + safeTile * 0.5 - 27,
      y: safeOriginY + row.y * (safeTile + safeGap) - 23,
      width: 54,
      height: 24,
    };
    row.cardRect = {
      x: rect.x + 14,
      y: rect.y + 48 + index * 28,
      width: rect.width - 28,
      height: 24,
    };
  });
  return {
    key: `${day}:${rows.map((row) => row.key).join("|")}:crop_growth_memo`,
    day,
    rows,
    top,
    point,
    rect,
    title: "田垄今日长势小札 · 可点",
    subtitle: `${termName} · 已种田块 ${rows.length} 处`,
    safetyText: "只定位田块、节气或去向入口，不会自动浇水、收获、播种、入夜或消耗资源。",
  };
}

export function cropGrowthMemoWorldAtCanvasPointWorld({ px, py, spec = null }) {
  if (!spec?.rect) return null;
  const badgeRow = spec.rows.find((row) => {
    const rect = row.badgeRect;
    return rect && px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  });
  if (badgeRow) return { ...spec, activeRow: badgeRow, source: "badge" };
  const cardRow = spec.rows.find((row) => {
    const rect = row.cardRect;
    return rect && px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  });
  if (cardRow) return { ...spec, activeRow: cardRow, source: "row" };
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? { ...spec, activeRow: spec.top, source: "card" }
    : null;
}

export function drawCropGrowthMemoWorldWorld({
  ctx,
  spec,
  settings,
  state,
  cropGrowthMemoWorldFocus,
  cropGrowthMemoToneSpec,
  drawCanvasCard,
}) {
  if (!spec?.rect || !spec.rows.length) return false;
  const { rect, point, rows, top } = spec;
  const motion = settings.reducedMotion ? 0 : performance.now() / 1000;
  const bob = settings.reducedMotion ? 0 : Math.sin(motion * 1.7) * 2;
  const active = cropGrowthMemoWorldFocus?.day === state.day && cropGrowthMemoWorldFocus?.key === spec.key;
  const activePlotKey = active ? cropGrowthMemoWorldFocus.plotKey : "";
  const cardY = rect.y + bob;
  const topPalette = top.palette || cropGrowthMemoToneSpec(top.tone);

  ctx.save();
  ctx.strokeStyle = active ? `${topPalette.stroke}dd` : `${topPalette.stroke}77`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = settings.reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - 8);
  ctx.quadraticCurveTo((point.x + rect.x) / 2, cardY + rect.height + 36, rect.x + 28, cardY + rect.height - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const [index, row] of rows.entries()) {
    const badge = row.badgeRect;
    const palette = row.palette || cropGrowthMemoToneSpec(row.tone);
    const rowActive = activePlotKey === `${row.x},${row.y}`;
    const badgeBob = settings.reducedMotion ? 0 : Math.sin(motion * 2.2 + index) * 1.8;
    ctx.fillStyle = palette.glow;
    ctx.beginPath();
    ctx.ellipse(badge.x + badge.width / 2, badge.y + badge.height + 8, 34, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.fill;
    ctx.strokeStyle = rowActive ? `${palette.stroke}ee` : `${palette.stroke}aa`;
    ctx.lineWidth = rowActive ? 2.6 : 1.6;
    ctx.beginPath();
    ctx.roundRect(badge.x, badge.y + badgeBob, badge.width, badge.height, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = palette.stroke;
    ctx.beginPath();
    ctx.arc(badge.x + 13, badge.y + badgeBob + 12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "800 11px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(palette.glyph, badge.x + 13, badge.y + badgeBob + 16);
    ctx.fillStyle = palette.text;
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(row.stageLabel.slice(0, 3), badge.x + 34, badge.y + badgeBob + 16);
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, topPalette.fill);
  ctx.strokeStyle = active ? `${topPalette.stroke}dd` : `${topPalette.stroke}88`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = topPalette.stroke;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 42, 28, 12);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(topPalette.glyph, rect.x + 35, cardY + 34);
  ctx.textAlign = "left";
  ctx.fillStyle = topPalette.text;
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 66, cardY + 25);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(spec.subtitle, rect.x + 66, cardY + 41);

  rows.forEach((row, index) => {
    const rowY = cardY + 62 + index * 28;
    const palette = row.palette || cropGrowthMemoToneSpec(row.tone);
    const rowActive = activePlotKey === `${row.x},${row.y}`;
    ctx.fillStyle = rowActive ? "rgba(255, 253, 245, 0.76)" : "rgba(255, 253, 245, 0.42)";
    ctx.strokeStyle = rowActive ? `${palette.stroke}bb` : "rgba(23, 35, 29, 0.08)";
    ctx.lineWidth = rowActive ? 1.5 : 1;
    ctx.beginPath();
    ctx.roundRect(rect.x + 14, rowY - 14, rect.width - 28, 23, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = palette.stroke;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(palette.glyph, rect.x + 24, rowY + 2);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 11px Microsoft YaHei";
    ctx.fillText(`${row.cropName} · ${row.stageLabel}`.slice(0, 16), rect.x + 42, rowY + 2);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText(row.progressText, rect.x + rect.width - 88, rowY + 2);
    ctx.fillStyle = palette.stroke;
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 58, rowY - 8, 38, 12, 6);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(row.action.label.slice(0, 4), rect.x + rect.width - 39, rowY + 1);
    ctx.textAlign = "left";

    ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 42, rowY + 7, rect.width - 116, 4, 99);
    ctx.fill();
    ctx.fillStyle = palette.stroke;
    ctx.beginPath();
    ctx.roundRect(rect.x + 42, rowY + 7, Math.max(10, (rect.width - 116) * row.progress), 4, 99);
    ctx.fill();
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.safetyText.slice(0, 32), rect.x + 16, cardY + rect.height - 12);

  if (!settings.reducedMotion) {
    ctx.fillStyle = `${topPalette.stroke}55`;
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 24 - i * 14, cardY + 17 + Math.sin(motion * 2 + i) * 3, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}
