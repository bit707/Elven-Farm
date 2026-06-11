export function fieldActionFeedbackSpecWorld(kind = "work") {
  const specs = {
    clear: { label: "清开灵田", core: [190, 79, 55], soft: [224, 182, 109], mote: [111, 80, 57], duration: 760 },
    plant: { label: "种子入土", core: [40, 111, 88], soft: [202, 235, 210], mote: [224, 182, 109], duration: 820 },
    water: { label: "水纹润开", core: [77, 145, 166], soft: [202, 235, 210], mote: [122, 195, 213], duration: 760 },
    harvest: { label: "灵光入篓", core: [180, 125, 47], soft: [246, 240, 182], mote: [255, 253, 245], duration: 900 },
    spirit: { label: "精怪代浇", core: [72, 168, 104], soft: [246, 240, 182], mote: [202, 235, 210], duration: 1280 },
    risk: { label: "风险化解", core: [190, 79, 55], soft: [255, 220, 202], mote: [246, 240, 182], duration: 820 },
    craft: { label: "灶火起香", core: [190, 79, 55], soft: [224, 182, 109], mote: [246, 240, 182], duration: 820 },
    shop: { label: "旧铺成交", core: [180, 125, 47], soft: [255, 248, 232], mote: [202, 235, 210], duration: 820 },
    work: { label: "灵息回应", core: [40, 111, 88], soft: [246, 240, 182], mote: [255, 253, 245], duration: 720 },
  };
  return specs[kind] || specs.work;
}

export function colorWithAlphaWorld(rgb = [0, 0, 0], alpha = 1) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${Math.max(0, Math.min(1, alpha))})`;
}

export function drawFieldActionFeedbackWorld({
  ctx,
  pulse = null,
  originX = 0,
  originY = 0,
  tile = 72,
  gap = 6,
  now = performance.now(),
  spirits = [],
  spiritVisualProfile = (spirit = {}) => ({
    base: spirit.base || "#fff6d7",
    accent: spirit.accent || "#286f58",
    glyph: spirit.glyph || "灵",
  }),
  drawCanvasCard = null,
} = {}) {
  if (!ctx || !pulse) return false;
  const spec = fieldActionFeedbackSpecWorld(pulse.kind);
  const elapsed = now - Number(pulse.start || now);
  if (elapsed >= spec.duration) return false;

  const progress = Math.max(0, Math.min(1, elapsed / spec.duration));
  const fade = 1 - progress;
  const cx = originX + pulse.x * (tile + gap) + tile / 2;
  const cy = originY + pulse.y * (tile + gap) + tile / 2;
  const ringRadius = tile * 0.22 + progress * tile * 0.46;
  const bob = Math.sin(progress * Math.PI) * 12;

  ctx.save();
  ctx.lineWidth = 3 + fade * 2;
  ctx.strokeStyle = colorWithAlphaWorld(spec.core, fade * 0.82);
  ctx.beginPath();
  ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = colorWithAlphaWorld(spec.soft, 0.16 + fade * 0.2);
  ctx.beginPath();
  ctx.ellipse(cx, cy + tile * 0.18, tile * (0.28 + progress * 0.2), tile * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  const moteCount = pulse.kind === "harvest" ? 9 : pulse.kind === "clear" ? 7 : 6;
  for (let i = 0; i < moteCount; i += 1) {
    const angle = i * 2.399 + progress * (pulse.kind === "water" ? 1.2 : 0.62);
    const distance = tile * (0.12 + progress * (pulse.kind === "clear" ? 0.48 : 0.38)) + (i % 3) * 4;
    const mx = cx + Math.cos(angle) * distance;
    const my = cy + Math.sin(angle) * distance * 0.62 - progress * (pulse.kind === "harvest" ? 26 : 10);
    ctx.fillStyle = colorWithAlphaWorld(spec.mote, fade * 0.78);
    ctx.beginPath();
    ctx.arc(mx, my, Math.max(1.8, 4.2 - progress * 2 + (i % 2)), 0, Math.PI * 2);
    ctx.fill();
  }

  if (pulse.kind === "clear") {
    ctx.strokeStyle = colorWithAlphaWorld(spec.mote, fade * 0.62);
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      const sx = cx - 24 + i * 16;
      ctx.beginPath();
      ctx.moveTo(sx, cy + 16 - progress * 8);
      ctx.lineTo(sx + 10 + progress * 8, cy + 22 + i % 2 * 4);
      ctx.stroke();
    }
  } else if (pulse.kind === "plant") {
    ctx.strokeStyle = colorWithAlphaWorld(spec.core, fade * 0.78);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i += 1) {
      const sx = cx - 12 + i * 12;
      ctx.beginPath();
      ctx.moveTo(sx, cy + 14);
      ctx.quadraticCurveTo(sx + (i - 1) * 8, cy - 2 - bob * 0.18, sx + (i - 1) * 5, cy - 12 - bob * 0.35);
      ctx.stroke();
    }
  } else if (pulse.kind === "water") {
    ctx.strokeStyle = colorWithAlphaWorld(spec.core, fade * 0.72);
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12 + i * 6, tile * (0.16 + progress * 0.28) + i * 4, tile * 0.05, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (pulse.kind === "spirit") {
    const plots = Array.isArray(pulse.wateredPlots) ? pulse.wateredPlots : [];
    const assistPrimer = Boolean(pulse.assistPrimer);
    if (plots.length > 0) {
      const bounds = plots.reduce((acc, plot) => ({
        minX: Math.min(acc.minX, plot.x),
        minY: Math.min(acc.minY, plot.y),
        maxX: Math.max(acc.maxX, plot.x),
        maxY: Math.max(acc.maxY, plot.y),
      }), { minX: plots[0].x, minY: plots[0].y, maxX: plots[0].x, maxY: plots[0].y });
      const left = originX + bounds.minX * (tile + gap) - 4;
      const top = originY + bounds.minY * (tile + gap) - 4;
      const boxWidth = (bounds.maxX - bounds.minX + 1) * tile + Math.max(0, bounds.maxX - bounds.minX) * gap + 8;
      const boxHeight = (bounds.maxY - bounds.minY + 1) * tile + Math.max(0, bounds.maxY - bounds.minY) * gap + 8;

      ctx.strokeStyle = colorWithAlphaWorld(spec.core, fade * 0.78);
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.roundRect(left, top, boxWidth, boxHeight, 16);
      ctx.stroke();
      ctx.setLineDash([]);

      for (const [index, plot] of plots.entries()) {
        const px = originX + plot.x * (tile + gap);
        const py = originY + plot.y * (tile + gap);
        const stepProgress = Math.max(0, Math.min(1, progress * (plots.length + 1) - index * 0.82));
        const stepGlow = stepProgress > 0 ? Math.sin(Math.min(1, stepProgress) * Math.PI) : 0;
        ctx.fillStyle = colorWithAlphaWorld(spec.soft, 0.16 + fade * 0.12 + stepGlow * 0.28);
        ctx.beginPath();
        ctx.roundRect(px + 3, py + 3, tile - 6, tile - 6, 12);
        ctx.fill();
        ctx.strokeStyle = colorWithAlphaWorld(spec.core, fade * (0.22 + stepGlow * 0.62));
        ctx.lineWidth = 1.8 + stepGlow * 1.4;
        ctx.beginPath();
        ctx.roundRect(px + 7, py + 7, tile - 14, tile - 14, 12);
        ctx.stroke();
        ctx.fillStyle = colorWithAlphaWorld(spec.core, fade * (0.28 + stepGlow * 0.58));
        ctx.beginPath();
        ctx.arc(px + tile * 0.52, py + tile * 0.42, tile * (0.07 + stepGlow * 0.08), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = colorWithAlphaWorld(spec.mote, fade * 0.72);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px + tile * 0.22, py + tile * 0.62);
        ctx.quadraticCurveTo(px + tile * 0.46, py + tile * (0.34 - stepGlow * 0.08), px + tile * 0.74, py + tile * 0.36);
        ctx.stroke();
        ctx.fillStyle = colorWithAlphaWorld(spec.core, fade * (0.24 + stepGlow * 0.5));
        ctx.font = "800 10px Microsoft YaHei";
        ctx.fillText(String(index + 1), px + tile * 0.72, py + tile * 0.26);
      }

      if (!assistPrimer && plots.length > 1) {
        ctx.strokeStyle = colorWithAlphaWorld(spec.core, fade * 0.5);
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        plots.forEach((plot, index) => {
          const px = originX + plot.x * (tile + gap) + tile / 2;
          const py = originY + plot.y * (tile + gap) + tile * 0.52;
          if (index === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (!assistPrimer && plots.length > 1) {
        const routeProgress = Math.min(plots.length - 1, progress * Math.max(1, plots.length - 1));
        const routeIndex = Math.max(0, Math.min(plots.length - 1, Math.floor(routeProgress)));
        const routeNext = Math.min(plots.length - 1, routeIndex + 1);
        const t = routeNext === routeIndex ? 0 : routeProgress - routeIndex;
        const routePlot = plots[routeIndex];
        const nextPlot = plots[routeNext];
        if (routePlot && nextPlot) {
          const sx = originX + routePlot.x * (tile + gap) + tile / 2;
          const sy = originY + routePlot.y * (tile + gap) + tile * 0.38;
          const ex = originX + nextPlot.x * (tile + gap) + tile / 2;
          const ey = originY + nextPlot.y * (tile + gap) + tile * 0.38;
          const spiritX = sx + (ex - sx) * t;
          const spiritY = sy + (ey - sy) * t - Math.sin(progress * Math.PI * 6) * 3;
          ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
          ctx.strokeStyle = colorWithAlphaWorld(spec.core, fade * 0.78);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(spiritX, spiritY, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#48a868";
          ctx.beginPath();
          ctx.ellipse(spiritX - 6, spiritY - 9, 7, 4, -0.55, 0, Math.PI * 2);
          ctx.ellipse(spiritX + 6, spiritY - 9, 7, 4, 0.55, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#286f58";
          ctx.font = "900 12px Microsoft YaHei";
          ctx.fillText("萝", spiritX - 6, spiritY + 5);
        }
      }
    }

    const spirit = spirits.find((entry) => entry.id === pulse.spiritId) || spirits[0] || null;
    const cardWidth = 286;
    const cardHeight = 94;
    const cardX = Math.max(24, Math.min(ctx.canvas.width - cardWidth - 24, cx + tile * 0.78));
    const cardY = Math.max(28, Math.min(ctx.canvas.height - cardHeight - 28, cy - cardHeight - tile * 0.45));
    const profile = spiritVisualProfile(spirit || {
      id: pulse.spiritId || "spirit_luobo_01",
      lineId: pulse.lineId || "spirit_line_luobo",
      name: pulse.spiritName || "大胖萝卜精",
      job: "farm",
    });

    if (drawCanvasCard) {
      drawCanvasCard(ctx, cardX, cardY, cardWidth, cardHeight, "rgba(255, 253, 245, 0.94)");
      ctx.fillStyle = profile.base;
      ctx.beginPath();
      ctx.roundRect(cardX + 16, cardY + 18, 46, 46, 16);
      ctx.fill();
      ctx.fillStyle = profile.accent;
      ctx.font = "700 24px Microsoft YaHei";
      ctx.fillText(profile.glyph, cardX + 27, cardY + 49);
      ctx.fillStyle = profile.accent;
      ctx.font = "700 13px Microsoft YaHei";
      ctx.fillText(`${pulse.spiritName || spirit?.name || "精怪"} ${assistPrimer ? "协助预览，未执行" : pulse.firstAssist ? "第一次接手农活" : "正在代浇"}`, cardX + 76, cardY + 28);
      ctx.fillStyle = "#17231d";
      ctx.font = "700 16px Microsoft YaHei";
      ctx.fillText(assistPrimer ? `${Number(pulse.wateredCount || plots.length || 0)} 格 3x3 协助预览` : `${Number(pulse.wateredCount || plots.length || 0)} 格 3x3 自动浇水`, cardX + 76, cardY + 54);
      ctx.fillStyle = "#5d6f65";
      ctx.font = "12px Microsoft YaHei";
      ctx.fillText(assistPrimer ? "只定位示范格 · 不会消耗体力" : `省下约 ${Number(pulse.staminaSaved || (plots.length * 5) || 0)} 点体力 · 自动化减负`, cardX + 76, cardY + 76);
    }
  } else if (pulse.kind === "harvest") {
    ctx.fillStyle = colorWithAlphaWorld(spec.soft, fade * 0.86);
    ctx.beginPath();
    ctx.moveTo(cx, cy - 22 - bob);
    ctx.lineTo(cx + 7, cy - 4 - bob);
    ctx.lineTo(cx + 26, cy - 2 - bob);
    ctx.lineTo(cx + 10, cy + 8 - bob);
    ctx.lineTo(cx + 15, cy + 26 - bob);
    ctx.lineTo(cx, cy + 14 - bob);
    ctx.lineTo(cx - 15, cy + 26 - bob);
    ctx.lineTo(cx - 10, cy + 8 - bob);
    ctx.lineTo(cx - 26, cy - 2 - bob);
    ctx.lineTo(cx - 7, cy - 4 - bob);
    ctx.closePath();
    ctx.fill();

    if (pulse.harvestText || pulse.qualityStars || pulse.qualityLabel) {
      const harvestText = String(pulse.harvestText || "收获入仓").slice(0, 14);
      const qualityText = `${pulse.qualityLabel || "品质星级"} ${pulse.qualityStars || ""}`.trim().slice(0, 12);
      const textY = Math.max(22, cy - tile * 0.82 - bob - 18);
      ctx.textAlign = "center";
      ctx.font = "800 15px Microsoft YaHei";
      ctx.lineWidth = 4;
      ctx.strokeStyle = `rgba(255, 253, 245, ${0.72 + fade * 0.24})`;
      ctx.strokeText(harvestText, cx, textY);
      ctx.fillStyle = colorWithAlphaWorld([190, 79, 55], fade * 0.96);
      ctx.fillText(harvestText, cx, textY);
      if (qualityText) {
        ctx.font = "700 12px Microsoft YaHei";
        ctx.strokeStyle = `rgba(255, 248, 232, ${0.68 + fade * 0.2})`;
        ctx.strokeText(qualityText, cx, textY + 17);
        ctx.fillStyle = colorWithAlphaWorld([180, 125, 47], fade * 0.9);
        ctx.fillText(qualityText, cx, textY + 17);
      }
    }

    if (pulse.useRoute?.badge) {
      const routeLabel = pulse.useRoute.badge;
      ctx.font = "700 12px Microsoft YaHei";
      const tagWidth = Math.min(150, Math.max(72, ctx.measureText(routeLabel).width + 26));
      const tagX = Math.max(12, Math.min(ctx.canvas.width - tagWidth - 12, cx - tagWidth / 2));
      const tagY = Math.max(18, cy - tile * 0.98 - bob);
      ctx.fillStyle = `rgba(255, 248, 232, ${0.74 + fade * 0.18})`;
      ctx.strokeStyle = colorWithAlphaWorld(spec.core, fade * 0.46);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagWidth, 25, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = colorWithAlphaWorld([143, 95, 63], fade * 0.92);
      ctx.textAlign = "center";
      ctx.fillText(routeLabel, tagX + tagWidth / 2, tagY + 17);
    }
  }

  ctx.fillStyle = colorWithAlphaWorld([23, 35, 29], fade * 0.78);
  ctx.font = "700 13px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(spec.label, cx, cy - tile * 0.54 - bob);
  ctx.restore();
  return true;
}

export function seedRestockBagSafetyTextWorld() {
  return "只定位种子栏、空田和播种按钮，不会自动播种、买种、浇水、入夜、扣除种子、扣除体力或消耗资源";
}

export function seedRestockBagFeedbackSpecWorld({
  seedId = "",
  count = 0,
  total = 0,
  crop = null,
  emptyPlot = null,
  day = 1,
  stock = 0,
  itemName = (itemId) => itemId,
} = {}) {
  return {
    key: `${day}:${seedId}:${count}:${total}:seed_restock_bag`,
    day,
    seedId,
    seedName: itemName(seedId),
    cropId: crop?.crop_id || "",
    cropName: crop ? itemName(crop.crop_id) : "作物",
    count: Number(count || 0),
    total: Number(total || 0),
    stock: Number(stock || 0),
    targetPlot: emptyPlot ? { x: emptyPlot.x, y: emptyPlot.y } : null,
    plotLabel: emptyPlot ? `(${emptyPlot.x + 1},${emptyPlot.y + 1}) 号空田` : "空田",
    routeText: "种子入袋 -> 点空田 -> 手动播种",
    safety: seedRestockBagSafetyTextWorld(),
  };
}

export function seedRestockBagWorldSpecWorld({
  width = 960,
  height = 640,
  spec = null,
  day = 1,
  metrics = null,
  plot = null,
} = {}) {
  if (!spec?.seedId || spec.day !== day || !metrics) return null;
  const plotX = plot ? metrics.originX + plot.x * (metrics.tile + metrics.gap) + metrics.tile / 2 : metrics.originX + metrics.tile * 2;
  const plotY = plot ? metrics.originY + plot.y * (metrics.tile + metrics.gap) + metrics.tile * 0.55 : metrics.originY + metrics.tile * 2;
  const cardWidth = 310;
  const cardHeight = 120;
  const x = Math.max(24, Math.min(width - cardWidth - 28, plotX + 42));
  const y = Math.max(112, Math.min(height - cardHeight - 34, plotY - 72));
  return {
    ...spec,
    plot: plot ? { x: plot.x, y: plot.y } : null,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: plotX, y: plotY },
  };
}

export function seedRestockBagWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect, anchor } = spec;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  const onAnchor = px >= anchor.x - 30 && px <= anchor.x + 30 && py >= anchor.y - 26 && py <= anchor.y + 26;
  return onCard || onAnchor ? spec : null;
}

export function drawSeedRestockBagWorldWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = performance.now() / 1000,
  day = 1,
  focus = null,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !drawCanvasCard) return false;
  const { rect, anchor } = spec;
  const active = focus?.day === day && focus?.key === spec.key;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.8) * 2.3;
  const cardY = rect.y + bob;
  const accent = "#286f58";

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.86)" : "rgba(40, 111, 88, 0.52)";
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + 24, cardY + rect.height + 26, rect.x + 36, cardY + rect.height - 16);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(23, 35, 29, 0.14)";
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 24, 38, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(202, 235, 210, 0.86)";
  ctx.strokeStyle = "rgba(40, 111, 88, 0.64)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(anchor.x - 22, anchor.y - 10 + bob * 0.16, 44, 34, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("种", anchor.x - 5, anchor.y + 9 + bob * 0.16);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.9)" : "rgba(40, 111, 88, 0.62)";
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(40, 111, 88, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 16, 58, 52, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("袋", rect.x + 34, cardY + 50);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("补种入袋去向签 · 可点", rect.x + 88, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${spec.seedName} x${spec.count} 已入袋`.slice(0, 20), rect.x + 88, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.cropName} · 库存 ${spec.stock} · 花费 ${spec.total} 灵石`.slice(0, 36), rect.x + 88, cardY + 64);

  const steps = [
    { title: "入袋", value: `x${spec.count}`, color: "#286f58" },
    { title: "空田", value: spec.plotLabel, color: "#8f5f3f" },
    { title: "播种", value: "手动确认", color: "#b47d2f" },
  ];
  steps.forEach((step, index) => {
    const stepX = rect.x + 18 + index * 96;
    const stepY = cardY + 82;
    ctx.fillStyle = `${step.color}1d`;
    ctx.beginPath();
    ctx.roundRect(stepX, stepY, 86, 24, 11);
    ctx.fill();
    ctx.fillStyle = step.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.title, stepX + 8, stepY + 10);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(step.value || "").slice(0, 8), stepX + 8, stepY + 20);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 16, rect.width - 36, 12, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 48), rect.x + 26, cardY + rect.height - 7);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 13, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, cardY + 26);
  ctx.restore();
  return true;
}

export function plantingAftercareSafetyTextWorld() {
  return "只定位已播田块、补水按钮或入夜按钮，不会自动浇水、入夜、播种、扣除体力、推进天数或消耗资源";
}

export function plantingAftercareFeedbackSpecWorld({
  plot = null,
  crop = null,
  seedRoute = null,
  day = 1,
  itemName = (itemId) => itemId,
} = {}) {
  if (!plot || !crop) return null;
  return {
    key: `${day}:${plot.x}_${plot.y}:${crop.seed_item_id}:${crop.crop_id}:plant_aftercare`,
    day,
    plot: { x: plot.x, y: plot.y },
    seedId: crop.seed_item_id,
    seedName: itemName(crop.seed_item_id),
    cropId: crop.crop_id,
    cropName: itemName(crop.crop_id),
    growDays: Number(crop.grow_days || 1),
    routeLabel: seedRoute?.badge || seedRoute?.label || "生产循环",
    routeDetail: seedRoute?.targetName || seedRoute?.detail || seedRoute?.logText || "先补水，再入夜成长",
    watered: Boolean(plot.watered),
    routeText: "种子落土 -> 补水 -> 入夜成长",
    safety: plantingAftercareSafetyTextWorld(),
  };
}

export function plantingAftercareWorldSpecWorld({
  width = 960,
  height = 640,
  feedback = null,
  day = 1,
  metrics = null,
  plot = null,
} = {}) {
  if (!feedback?.plot || feedback.day !== day || !metrics) return null;
  if (!plot?.cropId || plot.cropId !== feedback.cropId) return null;
  const plotRect = {
    x: metrics.originX + plot.x * (metrics.tile + metrics.gap),
    y: metrics.originY + plot.y * (metrics.tile + metrics.gap),
    width: metrics.tile,
    height: metrics.tile,
  };
  const cardWidth = 306;
  const cardHeight = 112;
  const cardX = Math.max(28, Math.min(width - cardWidth - 28, plotRect.x + metrics.tile + 28));
  const cardY = Math.max(116, Math.min(height - cardHeight - 30, plotRect.y - 54));
  const action = plot.watered ? "入夜成长" : "先补水";
  const selector = plot.watered ? "#sleepButton" : "#waterButton";
  return {
    ...feedback,
    key: `${feedback.key}:${plot.watered ? "watered" : "dry"}`,
    watered: Boolean(plot.watered),
    action,
    selector,
    fallbackSelector: "#selectedPlotCard",
    rect: { x: cardX, y: cardY, width: cardWidth, height: cardHeight },
    plotRect,
    anchor: { x: plotRect.x + plotRect.width / 2, y: plotRect.y + plotRect.height * 0.42 },
  };
}

export function plantingAftercareWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect || !spec.plotRect) return null;
  const { rect, plotRect } = spec;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  const onPlot = px >= plotRect.x && px <= plotRect.x + plotRect.width && py >= plotRect.y && py <= plotRect.y + plotRect.height;
  return onCard || onPlot ? spec : null;
}

export function drawPlantingAftercareWorldWorld({
  ctx,
  spec = null,
  focus = null,
  day = 1,
  reducedMotion = false,
  motion = performance.now() / 1000,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !spec.plotRect || !drawCanvasCard) return false;
  const { rect, plotRect, anchor } = spec;
  const active = focus?.day === day && focus?.key === spec.key;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.95) * 2.1;
  const shimmer = reducedMotion ? 0.45 : (Math.sin(motion * 2.6) + 1) / 2;
  const accent = spec.watered ? "#4d91a6" : "#286f58";
  const cardY = rect.y + bob;

  ctx.save();
  ctx.fillStyle = spec.watered ? "rgba(159, 209, 223, 0.18)" : `rgba(202, 235, 210, ${0.18 + shimmer * 0.1})`;
  ctx.beginPath();
  ctx.roundRect(plotRect.x + 8, plotRect.y + 8, plotRect.width - 16, plotRect.height - 16, 14);
  ctx.fill();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.9)" : `${accent}88`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 18, plotRect.width * 0.26, plotRect.height * 0.1, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.86)" : `${accent}72`;
  ctx.lineWidth = active ? 2.7 : 1.7;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(anchor.x + 18, anchor.y - 8);
  ctx.quadraticCurveTo((anchor.x + rect.x) / 2, cardY + rect.height + 22, rect.x + 34, cardY + rect.height - 14);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.92)" : `${accent}82`;
  ctx.lineWidth = active ? 2.5 : 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}1f`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 16, 58, 50, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText(spec.watered ? "润" : "芽", rect.x + 34, cardY + 50);
  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("落土补水签 · 可点", rect.x + 88, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${spec.cropName}刚落土`.slice(0, 18), rect.x + 88, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.routeLabel} · ${spec.growDays} 夜成长 · ${spec.action}`.slice(0, 36), rect.x + 88, cardY + 64);

  const steps = [
    { title: "落土", value: spec.seedName, color: "#286f58" },
    { title: "补水", value: spec.watered ? "已润" : "待补", color: "#4d91a6" },
    { title: "入夜", value: "手动", color: "#8f5f3f" },
  ];
  steps.forEach((step, index) => {
    const stepX = rect.x + 18 + index * 96;
    const stepY = cardY + 78;
    ctx.fillStyle = `${step.color}1b`;
    ctx.beginPath();
    ctx.roundRect(stepX, stepY, 86, 22, 11);
    ctx.fill();
    ctx.fillStyle = step.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.title, stepX + 8, stepY + 9);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(step.value || "").slice(0, 8), stepX + 8, stepY + 19);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 15, rect.width - 36, 11, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 48), rect.x + 26, cardY + rect.height - 7);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 13, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, cardY + 26);
  ctx.restore();
  return true;
}

export function manualWaterAfterglowSafetyTextWorld() {
  return "只定位已润田块和入夜按钮，不会自动入夜、浇水、收获、推进天数、扣除体力或消耗资源";
}

export function manualWaterAfterglowFeedbackSpecWorld({
  plot = null,
  crop = null,
  day = 1,
  itemName = (itemId) => itemId,
} = {}) {
  if (!plot?.cropId) return null;
  const growDays = Number(crop?.grow_days || 1);
  const age = Math.max(0, Number(day || 1) - Number(plot.plantedDay || day || 1));
  const remaining = plot.mature ? 0 : Math.max(0, growDays - age);
  return {
    key: `${day}:${plot.x}_${plot.y}:${plot.cropId}:manual_water_afterglow`,
    day,
    plot: { x: plot.x, y: plot.y },
    cropId: plot.cropId,
    cropName: itemName(plot.cropId),
    seedId: plot.seedItemId || crop?.seed_item_id || "",
    growDays,
    age,
    remaining,
    routeText: "水痕已稳 -> 手动入夜 -> 明晨长势",
    safety: manualWaterAfterglowSafetyTextWorld(),
  };
}

export function manualWaterAfterglowWorldSpecWorld({
  width = 960,
  height = 640,
  feedback = null,
  day = 1,
  metrics = null,
  plot = null,
} = {}) {
  if (!feedback?.plot || feedback.day !== day || !metrics) return null;
  if (!plot?.cropId || plot.cropId !== feedback.cropId || !plot.watered) return null;
  const plotRect = {
    x: metrics.originX + plot.x * (metrics.tile + metrics.gap),
    y: metrics.originY + plot.y * (metrics.tile + metrics.gap),
    width: metrics.tile,
    height: metrics.tile,
  };
  const cardWidth = 300;
  const cardHeight = 108;
  const cardX = Math.max(30, Math.min(width - cardWidth - 28, plotRect.x - cardWidth - 30));
  const cardY = Math.max(128, Math.min(height - cardHeight - 30, plotRect.y + 14));
  return {
    ...feedback,
    key: `${feedback.key}:${plot.mature ? "mature" : "growing"}`,
    mature: Boolean(plot.mature),
    action: plot.mature ? "明晨可收" : "手动入夜",
    selector: plot.mature ? "#harvestButton" : "#sleepButton",
    fallbackSelector: "#selectedPlotCard",
    rect: { x: cardX, y: cardY, width: cardWidth, height: cardHeight },
    plotRect,
    anchor: { x: plotRect.x + plotRect.width / 2, y: plotRect.y + plotRect.height * 0.62 },
  };
}

export function manualWaterAfterglowWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect || !spec.plotRect) return null;
  const { rect, plotRect } = spec;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  const onPlot = px >= plotRect.x && px <= plotRect.x + plotRect.width && py >= plotRect.y && py <= plotRect.y + plotRect.height;
  return onCard || onPlot ? spec : null;
}

export function drawManualWaterAfterglowWorldWorld({
  ctx,
  spec = null,
  focus = null,
  day = 1,
  reducedMotion = false,
  motion = performance.now() / 1000,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !spec.plotRect || !drawCanvasCard) return false;
  const { rect, plotRect, anchor } = spec;
  const active = focus?.day === day && focus?.key === spec.key;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.85) * 2;
  const ripple = reducedMotion ? 0.5 : (Math.sin(motion * 2.8) + 1) / 2;
  const accent = "#4d91a6";
  const cardY = rect.y + bob;

  ctx.save();
  ctx.fillStyle = `rgba(159, 209, 223, ${0.18 + ripple * 0.12})`;
  ctx.beginPath();
  ctx.roundRect(plotRect.x + 8, plotRect.y + 8, plotRect.width - 16, plotRect.height - 16, 14);
  ctx.fill();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.9)" : "rgba(77, 145, 166, 0.68)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 10, plotRect.width * (0.22 + ripple * 0.06), plotRect.height * 0.1, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(246, 240, 182, 0.58)";
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y + 10, 12 + i * 9 + ripple * 4, 0.08 * Math.PI, 0.92 * Math.PI);
    ctx.stroke();
  }

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.86)" : "rgba(77, 145, 166, 0.62)";
  ctx.lineWidth = active ? 2.7 : 1.7;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(anchor.x - 16, anchor.y + 4);
  ctx.quadraticCurveTo((anchor.x + rect.x + rect.width) / 2, cardY + rect.height + 28, rect.x + rect.width - 34, cardY + rect.height - 12);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(240, 248, 242, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.92)" : "rgba(77, 145, 166, 0.72)";
  ctx.lineWidth = active ? 2.5 : 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 16, 56, 48, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 21px Microsoft YaHei";
  ctx.fillText("水", rect.x + 34, cardY + 49);
  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("补水润田入夜签 · 可点", rect.x + 86, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${spec.cropName}水痕已稳`.slice(0, 18), rect.x + 86, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`生长 ${spec.age}/${spec.growDays} 夜 · ${spec.action}`.slice(0, 34), rect.x + 86, cardY + 62);

  const steps = [
    { title: "水痕", value: "已稳", color: "#4d91a6" },
    { title: "入夜", value: "手动", color: "#8f5f3f" },
    { title: "明晨", value: spec.mature ? "可收" : `${spec.remaining}夜`, color: "#286f58" },
  ];
  steps.forEach((step, index) => {
    const stepX = rect.x + 18 + index * 92;
    const stepY = cardY + 76;
    ctx.fillStyle = `${step.color}1b`;
    ctx.beginPath();
    ctx.roundRect(stepX, stepY, 82, 21, 10);
    ctx.fill();
    ctx.fillStyle = step.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.title, stepX + 8, stepY + 9);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(step.value || "").slice(0, 8), stepX + 8, stepY + 18);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 15, rect.width - 36, 11, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 48), rect.x + 26, cardY + rect.height - 7);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 13, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, cardY + 26);
  ctx.restore();
  return true;
}

export function morningGrowthDewSafetyTextWorld() {
  return "只定位田块、收获按钮或补水按钮，不会自动收获、浇水、入夜、播种、扣除体力、推进天数或消耗资源";
}

export function morningGrowthDewGrowingPlotWorld({
  plots = [],
  cropsById = new Map(),
  crops = [],
  day = 1,
} = {}) {
  const safePlots = Array.isArray(plots) ? plots : [];
  const safeCrops = Array.isArray(crops) ? crops : [];
  const safeDay = Number(day || 1);
  return safePlots
    .filter((plot) => plot?.cropId && !plot.mature)
    .map((plot) => {
      const crop = cropsById?.get?.(plot.cropId) || safeCrops.find((entry) => entry.crop_id === plot.cropId) || null;
      const growDays = Math.max(1, Number(crop?.grow_days || 1));
      const age = Math.max(0, safeDay - Number(plot.plantedDay || safeDay));
      const remaining = Math.max(1, growDays - age);
      return {
        plot,
        crop,
        age,
        growDays,
        remaining,
        priority: (plot.watered ? 20 : 60) + (plot.waterSoil ? 8 : 0) + Math.max(0, 12 - remaining),
      };
    })
    .sort((a, b) => b.priority - a.priority || a.remaining - b.remaining || a.plot.y - b.plot.y || a.plot.x - b.plot.x)[0] || null;
}

export function morningGrowthDewWorldSpecFromRuntimeWorld({
  width = 960,
  height = 640,
  originXInput = null,
  originYInput = null,
  tileInput = null,
  gapInput = null,
  summary = null,
  day = 1,
  harvestPlans = [],
  growing = null,
  metrics = null,
  routeForPlot = () => null,
  routeSafe = (route) => route,
  badgeForRoute = () => null,
  itemName = (itemId) => itemId,
  weatherName = "澶╂皵",
  termName = "鑺傛皵",
} = {}) {
  if (!summary || Number(summary.nextDay || 0) !== Number(day || 0) || !metrics) return null;
  const growth = summary.nightGrowth || {};
  const safeHarvestPlans = Array.isArray(harvestPlans) ? harvestPlans : [];
  const maturePlan = safeHarvestPlans[0] || null;
  const safeGrowing = maturePlan ? null : growing;
  const plot = maturePlan?.plot || safeGrowing?.plot || null;
  if (!plot) return null;
  const route = routeSafe(maturePlan ? maturePlan.route || routeForPlot(plot) : routeForPlot(plot));
  const badge = badgeForRoute(route);
  const cropName = maturePlan ? (maturePlan.cropName || itemName(plot.cropId)) : itemName(plot.cropId);
  const { tile, gap, originX, originY } = metrics;
  return morningGrowthDewWorldSpecWorld({
    width,
    height,
    summary,
    day,
    growth,
    maturePlan,
    growing: safeGrowing,
    metrics: {
      originX: Number(originXInput ?? originX),
      originY: Number(originYInput ?? originY),
      tile: Number(tileInput ?? tile),
      gap: Number(gapInput ?? gap),
    },
    route,
    badge,
    cropName,
    weatherName: growth.weatherName || weatherName,
    termName: growth.termName || termName,
  });
}

export function morningGrowthDewWorldSpecWorld({
  width = 960,
  height = 640,
  summary = null,
  day = 1,
  growth = {},
  maturePlan = null,
  growing = null,
  metrics = null,
  route = null,
  badge = null,
  cropName = "作物",
  weatherName = "天气",
  termName = "节气",
} = {}) {
  if (!summary || Number(summary.nextDay || 0) !== Number(day || 0) || !metrics) return null;
  const maturedCount = Number(growth.maturedCount || summary.maturedPlotActions?.length || 0);
  const grownCount = Number(growth.grownCount || 0);
  const caredCount = Number(growth.caredCount || 0);
  if (maturedCount <= 0 && grownCount <= 0 && caredCount <= 0) return null;
  if (!maturePlan && !growing?.plot) return null;

  const mode = maturePlan ? "mature" : "growing";
  const plot = maturePlan?.plot || growing.plot;
  const safeBadge = badge || { label: "入仓", text: "#286f58" };
  const plotRect = {
    x: metrics.originX + plot.x * (metrics.tile + metrics.gap),
    y: metrics.originY + plot.y * (metrics.tile + metrics.gap),
    width: metrics.tile,
    height: metrics.tile,
  };
  const anchor = {
    x: plotRect.x + plotRect.width * 0.5,
    y: plotRect.y + plotRect.height * 0.42,
  };
  const cardWidth = 326;
  const cardHeight = 126;
  const cardX = Math.max(24, Math.min(width - cardWidth - 24, anchor.x + (anchor.x > width * 0.54 ? -cardWidth - 62 : 68)));
  const cardY = Math.max(72, Math.min(height - cardHeight - 32, anchor.y + (anchor.y > height * 0.52 ? -cardHeight - 54 : 42)));
  const routeText = mode === "mature"
    ? "夜间成长 -> 成熟亮起 -> 手动收获"
    : "夜间成长 -> 今日补水 -> 等待成熟";
  const headline = mode === "mature"
    ? `晨露照出 ${cropName}`
    : `${cropName} 还在续长`;
  const detail = mode === "mature"
    ? `昨夜${weatherName}过田，新熟 ${maturedCount} 块；先手动收获，再接${route?.badge || safeBadge.label}。`
    : `昨夜${weatherName}让 ${grownCount || caredCount || 1} 块田继续长势；今天先补水，约余 ${growing.remaining} 夜。`;
  const nodes = mode === "mature"
    ? [
      { title: "夜间", value: weatherName, color: "#4d91a6" },
      { title: "成熟", value: `${maturedCount}块`, color: "#b47d2f" },
      { title: "手动", value: "收获", color: "#286f58" },
    ]
    : [
      { title: "夜间", value: grownCount ? `续长${grownCount}` : `代顾${caredCount}`, color: "#4d91a6" },
      { title: "今日", value: plot.watered ? "已润" : "补水", color: "#286f58" },
      { title: "等待", value: `余${growing.remaining}夜`, color: "#8f5f3f" },
    ];
  return {
    key: `${day}:${mode}:${plot.x},${plot.y}:${maturedCount}:${grownCount}:${caredCount}`,
    day,
    mode,
    title: "晨露长势牌 · 可点",
    headline,
    detail,
    routeText,
    safety: morningGrowthDewSafetyTextWorld(),
    cropName,
    weatherName,
    termName,
    termChanged: Boolean(growth.termChanged),
    grownCount,
    maturedCount,
    caredCount,
    plot,
    route,
    badge: safeBadge,
    nodes,
    selector: mode === "mature" ? "#harvestButton" : "#waterButton",
    fallbackSelector: "#selectedPlotCard",
    action: mode === "mature" ? "手动收获" : "今日补水",
    rect: { x: cardX, y: cardY, width: cardWidth, height: cardHeight },
    plotRect,
    anchor,
    dewPoint: {
      x: anchor.x + (mode === "mature" ? 24 : -22),
      y: anchor.y - 24,
    },
  };
}

export function morningGrowthDewWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect || !spec.plotRect) return null;
  const { rect, plotRect } = spec;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  const onPlot = px >= plotRect.x && px <= plotRect.x + plotRect.width && py >= plotRect.y && py <= plotRect.y + plotRect.height;
  return onCard || onPlot ? spec : null;
}

export function drawMorningGrowthDewWorldWorld({
  ctx,
  spec = null,
  focus = null,
  day = 1,
  reducedMotion = false,
  motion = performance.now() / 1000,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !spec.plotRect || !drawCanvasCard) return false;
  const { rect, plotRect, anchor, dewPoint, badge } = spec;
  const active = focus?.day === day && focus?.key === spec.key;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 2;
  const shimmer = reducedMotion ? 0.45 : (Math.sin(motion * 2.4) + 1) / 2;
  const accent = spec.mode === "mature" ? "#b47d2f" : "#4d91a6";
  const leaf = spec.mode === "mature" ? "#286f58" : "#5b8f6a";
  const cardY = rect.y + bob;

  ctx.save();
  ctx.fillStyle = spec.mode === "mature"
    ? `rgba(246, 240, 182, ${0.2 + shimmer * 0.12})`
    : `rgba(159, 209, 223, ${0.16 + shimmer * 0.12})`;
  ctx.beginPath();
  ctx.roundRect(plotRect.x + 7, plotRect.y + 7, plotRect.width - 14, plotRect.height - 14, 14);
  ctx.fill();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.95)" : `${accent}76`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 18, plotRect.width * (0.23 + shimmer * 0.06), plotRect.height * 0.1, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.strokeStyle = "rgba(77, 145, 166, 0.62)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i += 1) {
    const dropX = dewPoint.x + Math.cos(motion + i * 1.7) * (14 + i * 4);
    const dropY = dewPoint.y + Math.sin(motion * 1.2 + i) * 7 + i * 3;
    ctx.beginPath();
    ctx.ellipse(dropX, dropY, 4.5, 7, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.88)" : `${accent}66`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x + (spec.mode === "mature" ? 16 : -16), anchor.y - 10);
  ctx.quadraticCurveTo((anchor.x + rect.x + 36) / 2, Math.min(anchor.y, cardY) - 24, rect.x + 36, cardY + rect.height - 16);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.mode === "mature" ? "rgba(255, 248, 232, 0.96)" : "rgba(240, 248, 242, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.94)" : `${accent}86`;
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = spec.mode === "mature" ? "rgba(246, 240, 182, 0.42)" : "rgba(159, 209, 223, 0.24)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 16, 58, 52, 16);
  ctx.fill();
  ctx.strokeStyle = `${accent}70`;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("露", rect.x + 34, cardY + 50);
  ctx.fillStyle = leaf;
  ctx.beginPath();
  ctx.ellipse(rect.x + 55, cardY + 30, 9, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 88, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 88, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  const termText = spec.termChanged ? `节气转入 ${spec.termName}` : `${spec.weatherName} · ${spec.action}`;
  ctx.fillText(`${termText} · ${spec.detail}`.slice(0, 42), rect.x + 88, cardY + 64);

  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 18 + index * 98;
    const nodeY = cardY + 82;
    ctx.fillStyle = `${node.color}1b`;
    ctx.strokeStyle = `${node.color}55`;
    ctx.lineWidth = active && index === 1 ? 1.8 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 8, 88, 25, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title, nodeX + 9, nodeY + 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.value || "").slice(0, 8), nodeX + 9, nodeY + 12);
    if (index < spec.nodes.length - 1) {
      ctx.strokeStyle = `${node.color}55`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(nodeX + 88, nodeY + 4);
      ctx.lineTo(nodeX + 98, nodeY + 4);
      ctx.stroke();
    }
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 13, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = badge.text || accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, cardY + 26);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 15, rect.width - 36, 11, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 52), rect.x + 26, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function harvestStorageRouteSafetyTextWorld() {
  return "只定位背包、订单板、配方栏或旧铺货签，不会自动交单、加工、上架、开铺、售卖、扣库存、发奖励、入夜或消耗资源";
}

export function harvestStorageRouteFeedbackSpecFromRuntimeWorld({
  feedback = null,
  plot = null,
  day = 1,
  routeForHarvest = () => null,
  routeSafe = (route) => route,
  badgeForRoute = () => null,
  itemName = (itemId) => itemId,
  now = performance.now(),
} = {}) {
  if (!feedback?.cropId) return null;
  const route = routeSafe(feedback.route || routeForHarvest(feedback.cropId, feedback.amount));
  const badge = badgeForRoute(route);
  return harvestStorageRouteFeedbackSpecWorld({
    feedback,
    plot,
    day,
    route,
    badge,
    itemName,
    now,
  });
}

export function harvestStorageRouteFeedbackSpecWorld({
  feedback = null,
  plot = null,
  day = 1,
  route = null,
  badge = null,
  itemName = (itemId) => itemId,
  now = performance.now(),
} = {}) {
  if (!feedback?.cropId) return null;
  const safeBadge = badge || { label: "收进仓" };
  const plotSnapshot = plot
    ? { x: plot.x, y: plot.y, waterSoil: Boolean(plot.waterSoil), newlyExpanded: Boolean(plot.newlyExpanded) }
    : null;
  return {
    key: `${day}:${feedback.cropId}:${Number(feedback.amount || 1)}:${route?.type || "stock"}:${Math.round(now)}`,
    day,
    cropId: feedback.cropId,
    cropName: feedback.cropName || itemName(feedback.cropId),
    amount: Number(feedback.amount || 1),
    qualityLabel: feedback.qualityLabel || "凡品",
    qualityStars: feedback.qualityStars || "",
    qualityItemName: feedback.qualityItemName || "",
    qualityCount: Number(feedback.qualityCount || 0),
    route,
    routeBadge: route?.badge || safeBadge.label || "收进仓",
    routeTarget: route?.targetName || route?.recipeName || route?.orderTitle || route?.shopTagLabel || "库存",
    routeDetail: route?.detail || feedback.routeDetail || "先收进仓库，再决定接订单、工坊或旧铺。",
    bonusText: feedback.bonusText || "",
    firstHarvest: Boolean(feedback.firstHarvest),
    plot: plotSnapshot,
    createdAt: now,
    safety: harvestStorageRouteSafetyTextWorld(),
  };
}

export function harvestStorageRouteWorldSpecFromRuntimeWorld({
  width = 960,
  height = 640,
  originXInput = null,
  originYInput = null,
  tileInput = null,
  gapInput = null,
  feedback = null,
  day = 1,
  inventory = {},
  metrics = null,
  routeSafe = (route) => route,
  badgeForRoute = () => null,
} = {}) {
  if (!feedback?.cropId || Number(feedback.day || 0) !== Number(day || 0) || !metrics) return null;
  const route = routeSafe(feedback.route);
  const badge = badgeForRoute(route);
  const { tile, gap, originX, originY } = metrics;
  return harvestStorageRouteWorldSpecWorld({
    width,
    height,
    feedback,
    day,
    stock: Number(inventory?.[feedback.cropId] || 0),
    metrics: {
      originX: Number(originXInput ?? originX),
      originY: Number(originYInput ?? originY),
      tile: Number(tileInput ?? tile),
      gap: Number(gapInput ?? gap),
    },
    route,
    badge,
  });
}

export function harvestStorageRouteWorldSpecWorld({
  width = 960,
  height = 640,
  feedback = null,
  day = 1,
  stock = 0,
  metrics = null,
  route = null,
  badge = null,
} = {}) {
  if (!feedback?.cropId || Number(feedback.day || 0) !== Number(day || 0) || !metrics) return null;
  if (Number(stock || 0) <= 0) return null;
  const safeBadge = badge || { label: "收进仓", text: "#286f58", stroke: "#286f58", glyph: "仓" };
  const plotRect = feedback.plot
    ? {
      x: metrics.originX + Number(feedback.plot.x || 0) * (metrics.tile + metrics.gap),
      y: metrics.originY + Number(feedback.plot.y || 0) * (metrics.tile + metrics.gap),
      width: metrics.tile,
      height: metrics.tile,
    }
    : null;
  const anchor = plotRect
    ? { x: plotRect.x + plotRect.width * 0.5, y: plotRect.y + plotRect.height * 0.5 }
    : { x: 246, y: 124 };
  const routeType = route?.type || "stock";
  const actionLabel = routeType === "order"
    ? "看订单"
    : routeType === "recipe"
      ? "看配方"
      : routeType === "shop"
        ? "看旧铺"
        : "看背包";
  const targetLabel = route?.targetName || route?.recipeName || route?.orderTitle || route?.shopTagLabel || "库存";
  const cardWidth = 336;
  const cardHeight = 132;
  const x = Math.max(34, Math.min(width - cardWidth - 34, 408));
  const y = Math.max(104, Math.min(height - cardHeight - 34, plotRect ? plotRect.y + (plotRect.y > height * 0.5 ? -cardHeight - 40 : 64) : 214));
  const nodes = [
    { title: "入仓", value: `${feedback.cropName}x${feedback.amount}`, color: "#b47d2f", badge: "仓" },
    { title: "去向", value: feedback.routeBadge || safeBadge.label, color: safeBadge.stroke, badge: safeBadge.glyph },
    { title: "手动", value: actionLabel, color: "#286f58", badge: "点" },
  ];
  return {
    ...feedback,
    key: `${feedback.key}:${routeType}:${Number(stock || 0)}`,
    route,
    badge: safeBadge,
    title: "收获入仓去向留签 · 可点",
    headline: `${feedback.cropName} x${feedback.amount} 已入仓`,
    detail: `${feedback.qualityLabel}${feedback.qualityStars ? ` ${feedback.qualityStars}` : ""} · ${targetLabel}`,
    routeText: `手动收获 -> 入仓清点 -> ${feedback.routeBadge || safeBadge.label}`,
    actionLabel,
    targetLabel,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor,
    plotRect,
    nodes,
    stock: Number(stock || 0),
  };
}

export function harvestStorageRouteWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect, plotRect } = spec;
  const onCard = px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
  const onPlot = plotRect
    ? px >= plotRect.x && px <= plotRect.x + plotRect.width && py >= plotRect.y && py <= plotRect.y + plotRect.height
    : false;
  return onCard || onPlot ? spec : null;
}

export function drawHarvestStorageRouteWorldWorld({
  ctx,
  spec = null,
  focus = null,
  day = 1,
  reducedMotion = false,
  motion = performance.now() / 1000,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !drawCanvasCard) return false;
  const { rect, anchor, badge } = spec;
  const active = focus?.day === day && focus?.key === spec.key;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.75) * 2.2;
  const shimmer = reducedMotion ? 0.5 : (Math.sin(motion * 2.5) + 1) / 2;
  const cardY = rect.y + bob;
  const chestX = rect.x + 48;
  const chestY = cardY + 48;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.92)" : `${badge.stroke}6f`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo((anchor.x + rect.x + 38) / 2, Math.min(anchor.y, cardY) - 28, rect.x + 38, cardY + rect.height - 14);
  ctx.stroke();
  ctx.setLineDash([]);

  if (spec.plotRect) {
    ctx.fillStyle = `rgba(246, 240, 182, ${0.14 + shimmer * 0.1})`;
    ctx.beginPath();
    ctx.roundRect(spec.plotRect.x + 8, spec.plotRect.y + 8, spec.plotRect.width - 16, spec.plotRect.height - 16, 14);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.92)" : `${badge.stroke}80`;
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.ellipse(chestX + 3, chestY + 40, 42 + shimmer * 4, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(180, 125, 47, 0.86)";
  ctx.strokeStyle = "rgba(91, 51, 40, 0.68)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(chestX - 28, chestY - 10, 58, 38, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 248, 232, 0.92)";
  ctx.beginPath();
  ctx.roundRect(chestX - 22, chestY - 24 + bob * 0.3, 46, 20, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = badge.stroke;
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText("仓", chestX - 8, chestY + 15);

  ctx.fillStyle = badge.text;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 88, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 88, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.detail} · 库存 ${spec.stock} · ${spec.actionLabel}`.slice(0, 42), rect.x + 88, cardY + 66);

  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 18 + index * 102;
    const nodeY = cardY + 86;
    ctx.fillStyle = `${node.color}1b`;
    ctx.strokeStyle = `${node.color}55`;
    ctx.lineWidth = active && index === 1 ? 1.8 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 9, 92, 26, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(nodeX + 14, nodeY + 4, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(node.badge || "").slice(0, 1), nodeX + 10, nodeY + 7);
    ctx.fillStyle = node.color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title, nodeX + 28, nodeY + 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.value || "").slice(0, 9), nodeX + 28, nodeY + 12);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 13, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = badge.text;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, cardY + 26);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 15, rect.width - 36, 11, 6);
  ctx.fill();
  ctx.fillStyle = badge.stroke;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 54), rect.x + 26, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function matureHarvestBasketSafetyTextWorld() {
  return "只定位成熟田、订单板、配方栏或旧铺货签，不会自动收获、加物品、交单、加工、上架、开铺、入夜或消耗资源";
}

export function matureHarvestBasketRouteNodesWorld({ route = null, badge = null } = {}) {
  const safe = route || {};
  const safeBadge = badge || { glyph: "仓", label: "再决定", stroke: "#9aa99d" };
  const routeType = safe?.type || "stock";
  const middle = routeType === "order"
    ? { key: "order", badge: "单", title: "订单口", detail: safe.orderTitle || safe.targetName || "待交订单", accent: "#d19a4a" }
    : routeType === "recipe"
      ? { key: "recipe", badge: "锅", title: "工坊口", detail: safe.recipeName || safe.targetName || "可入锅", accent: "#be4f37" }
      : routeType === "shop"
        ? { key: "shop", badge: "铺", title: "旧铺口", detail: safe.shopTagLabel || safe.targetName || "可挂货签", accent: "#4d91a6" }
        : { key: "stock", badge: "仓", title: "先入仓", detail: safe?.targetName || "库存沉淀", accent: "#9aa99d" };
  return [
    { key: "crop", badge: "收", title: "成熟田", detail: safe?.itemName || "今日收成", accent: "#b47d2f" },
    middle,
    {
      key: "confirm",
      badge: safeBadge.glyph,
      title: "手动确认",
      detail: safe?.cta || safe?.badge || safeBadge.label || "再决定",
      accent: safeBadge.stroke,
    },
  ];
}

export function matureHarvestBasketWorldSpecFromRuntimeWorld({
  width = 960,
  height = 640,
  originXInput = null,
  originYInput = null,
  tileInput = null,
  gapInput = null,
  rows = [],
  day = 1,
  metrics = null,
  routeForItem = () => null,
  routeSafe = (route) => route,
  badgeForRoute = () => null,
} = {}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const top = safeRows[0] || null;
  if (!top || !metrics) return null;
  const route = routeSafe(top.route || routeForItem(top.itemId, 1));
  const badge = badgeForRoute(route);
  const { tile, gap, originX, originY } = metrics;
  return matureHarvestBasketWorldSpecWorld({
    width,
    height,
    rows: safeRows,
    top,
    route,
    badge,
    day,
    metrics: {
      originX: Number(originXInput ?? originX),
      originY: Number(originYInput ?? originY),
      tile: Number(tileInput ?? tile),
      gap: Number(gapInput ?? gap),
    },
    nodes: matureHarvestBasketRouteNodesWorld({ route, badge }),
  });
}

export function matureHarvestBasketWorldSpecWorld({
  width = 960,
  height = 640,
  rows = [],
  top = null,
  route = null,
  badge = null,
  day = 1,
  metrics = null,
  nodes = null,
} = {}) {
  if (!rows.length || !top || !metrics) return null;
  const safeBadge = badge || { label: "入仓", text: "#286f58", stroke: "#286f58", fill: "rgba(202, 235, 210, 0.35)", glyph: "仓" };
  const plotPoint = {
    x: metrics.originX + top.x * (metrics.tile + metrics.gap) + metrics.tile * 0.5,
    y: metrics.originY + top.y * (metrics.tile + metrics.gap) + metrics.tile * 0.5,
  };
  const cardWidth = 306;
  const cardHeight = 112;
  const x = Math.max(18, Math.min(width - cardWidth - 18, plotPoint.x + (plotPoint.x > width * 0.56 ? -cardWidth - 46 : 70)));
  const y = Math.max(64, Math.min(height - cardHeight - 28, plotPoint.y + (plotPoint.y > height * 0.54 ? -cardHeight - 42 : 46)));
  return {
    key: `${day}:${top.x},${top.y}:${route?.type || "stock"}:${route?.orderId || route?.recipeId || route?.shopTag || route?.itemId || top.itemId}`,
    day,
    top,
    rows,
    route,
    badge: safeBadge,
    title: "成熟入筐去向小景 · 可点",
    headline: `${top.itemName} 已熟，先看入筐去向`,
    detail: route?.detail || route?.headline || "收进竹筐后再接订单、工坊或旧铺。",
    routeText: `成熟发光 -> 竹筐接住 -> ${route?.badge || safeBadge.label}`,
    itemName: top.itemName,
    plotLabel: `(${top.x + 1},${top.y + 1})`,
    targetText: route?.targetName || route?.cta || route?.badge || safeBadge.label,
    safetyText: matureHarvestBasketSafetyTextWorld(),
    rect: { x, y, width: cardWidth, height: cardHeight },
    plotPoint,
    basketPoint: {
      x: plotPoint.x + (x > plotPoint.x ? 38 : -38),
      y: plotPoint.y + metrics.tile * 0.34,
    },
    nodes: nodes || matureHarvestBasketRouteNodesWorld({ route, badge: safeBadge }),
  };
}

export function matureHarvestBasketWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function drawMatureHarvestBasketWorldWorld({
  ctx,
  spec = null,
  focus = null,
  day = 1,
  reducedMotion = false,
  motion = performance.now() / 1000,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !spec.top || !drawCanvasCard) return false;
  const { rect, plotPoint, basketPoint, route, badge } = spec;
  const active = focus?.day === day && focus?.key === spec.key;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2.4;
  const cardY = rect.y + pulse * 0.4;

  ctx.save();
  ctx.strokeStyle = active ? `${badge.stroke}dd` : `${badge.stroke}68`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(plotPoint.x, plotPoint.y - 8);
  ctx.quadraticCurveTo((plotPoint.x + rect.x + 34) / 2, Math.min(plotPoint.y, cardY) - 38, rect.x + 34, cardY + 66);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(246, 240, 182, 0.26)";
  ctx.beginPath();
  ctx.ellipse(plotPoint.x, plotPoint.y + 16, 54 + Math.abs(pulse) * 3, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 5; i += 1) {
    const angle = motion * 1.4 + i * (Math.PI * 2 / 5);
    const sparkX = plotPoint.x + Math.cos(angle) * (24 + (i % 2) * 8);
    const sparkY = plotPoint.y - 4 + Math.sin(angle) * 12;
    ctx.fillStyle = i % 2 ? "rgba(224, 182, 109, 0.86)" : "rgba(255, 253, 245, 0.88)";
    ctx.beginPath();
    ctx.arc(sparkX, sparkY, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(143, 95, 63, 0.18)";
  ctx.beginPath();
  ctx.ellipse(basketPoint.x, basketPoint.y + 14, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(224, 182, 109, 0.88)";
  ctx.strokeStyle = "rgba(143, 95, 63, 0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(basketPoint.x - 24, basketPoint.y - 4 + pulse * 0.25, 48, 28, 9);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.74)";
  ctx.beginPath();
  ctx.arc(basketPoint.x, basketPoint.y - 3 + pulse * 0.25, 18, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = badge.stroke;
  ctx.font = "900 12px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(badge.glyph, basketPoint.x, basketPoint.y + 15 + pulse * 0.25);
  ctx.textAlign = "left";

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${badge.stroke}ee` : `${badge.stroke}8a`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = badge.fill;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 52, 48, 15);
  ctx.fill();
  ctx.strokeStyle = badge.stroke;
  ctx.lineWidth = 1.3;
  ctx.stroke();
  ctx.fillStyle = badge.stroke;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("筐", rect.x + 29, cardY + 44);

  ctx.fillStyle = badge.text;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 80, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 80, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.plotLabel} · ${spec.targetText} · ${route?.ready ? "已接上" : "先确认"}`.slice(0, 37), rect.x + 80, cardY + 62);

  const nodeY = cardY + 82;
  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 14 + index * 96;
    ctx.fillStyle = index === 1 ? `${node.accent}18` : "rgba(255, 253, 245, 0.76)";
    ctx.strokeStyle = `${node.accent}50`;
    ctx.lineWidth = active && index === 1 ? 1.8 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 10, 84, 25, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 14, nodeY + 2, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge.slice(0, 1), nodeX + 10, nodeY + 5);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 4), nodeX + 28, nodeY - 2);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 8), nodeX + 28, nodeY + 11);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 16, rect.width - 36, 12, 6);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safetyText}`.slice(0, 46), rect.x + 26, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function harvestRouteWorldPriorityWorld({ route = null, plot = null } = {}) {
  const safe = route || {};
  const base = safe?.type === "order" ? 90 : safe?.type === "recipe" ? 72 : safe?.type === "shop" ? 58 : 34;
  return base + (safe?.ready ? 18 : 0) + (plot?.waterSoil ? 4 : 0);
}

/*
export function nightGrowthRouteBadgeSpecWorld(route = null) {
  const safe = route || null;
  if (!safe) return { glyph: "浠?, label: "鍏堝叆浠?, fill: "rgba(255, 253, 245, 0.86)", stroke: "#9aa99d", text: "#5d6f65" };
  if (safe.type === "order") return { glyph: "鍗?, label: safe.badge || "璁㈠崟澶囪揣", fill: "rgba(255, 248, 232, 0.92)", stroke: "#d19a4a", text: "#8f5f3f" };
  if (safe.type === "recipe") return { glyph: "閿?, label: safe.badge || "鍙叆閿?, fill: "rgba(255, 244, 232, 0.9)", stroke: "#be4f37", text: "#8f5f3f" };
  if (safe.type === "shop") return { glyph: "閾?, label: safe.badge || "鏃ч摵澶囪揣", fill: "rgba(248, 252, 247, 0.92)", stroke: "#4d91a6", text: "#286f58" };
  return { glyph: "浠?, label: safe.badge || "鍏堝叆浠?, fill: "rgba(255, 253, 245, 0.86)", stroke: "#9aa99d", text: "#5d6f65" };
}
*/

export function nightGrowthRouteBadgeSpecWorld(route = null) {
  const safe = route || null;
  if (!safe) return { glyph: "IN", label: "Stock First", fill: "rgba(255, 253, 245, 0.86)", stroke: "#9aa99d", text: "#5d6f65" };
  if (safe.type === "order") return { glyph: "OD", label: safe.badge || "Order Prep", fill: "rgba(255, 248, 232, 0.92)", stroke: "#d19a4a", text: "#8f5f3f" };
  if (safe.type === "recipe") return { glyph: "RC", label: safe.badge || "Recipe Ready", fill: "rgba(255, 244, 232, 0.9)", stroke: "#be4f37", text: "#8f5f3f" };
  if (safe.type === "shop") return { glyph: "SH", label: safe.badge || "Shop Stock", fill: "rgba(248, 252, 247, 0.92)", stroke: "#4d91a6", text: "#286f58" };
  return { glyph: "IN", label: safe.badge || "Stock First", fill: "rgba(255, 253, 245, 0.86)", stroke: "#9aa99d", text: "#5d6f65" };
}

export function harvestRouteWorldRowsWorld({
  limit = 4,
  plots = [],
  cropsById = new Map(),
  routeForPlot = () => null,
  routeSafe = (route) => route,
  badgeForRoute = () => null,
  priorityForRoute = ({ route, plot }) => 0,
  itemName = (itemId) => itemId,
} = {}) {
  const safePlots = Array.isArray(plots) ? plots : [];
  return safePlots
    .filter((plot) => plot?.cropId && plot.mature)
    .map((plot) => {
      const route = routeSafe(routeForPlot(plot));
      const crop = cropsById?.get?.(plot.cropId) || null;
      return {
        x: plot.x,
        y: plot.y,
        plot,
        crop,
        itemId: plot.cropId,
        itemName: itemName(plot.cropId),
        route,
        badge: badgeForRoute(route),
        priority: Number(priorityForRoute({ route, plot }) || 0),
      };
    })
    .sort((a, b) => b.priority - a.priority || a.y - b.y || a.x - b.x)
    .slice(0, limit);
}

export function activeMorningHarvestPlansWorld({
  summary = null,
  day = 1,
  plots = [],
  routeForPlot = () => null,
} = {}) {
  if (!summary || Number(summary.nextDay || 0) !== Number(day || 0)) return [];
  const safePlots = Array.isArray(plots) ? plots : [];
  return (summary.maturedPlotActions || [])
    .map((entry) => {
      const plot = safePlots.find((candidate) => candidate.x === entry.x && candidate.y === entry.y);
      if (!plot?.cropId || !plot.mature) return null;
      return {
        ...entry,
        route: entry.route || routeForPlot(plot),
        plot,
      };
    })
    .filter(Boolean)
    .slice(0, 4);
}

export function harvestRouteWorldBoardSpecFromRuntimeWorld({
  width = 960,
  height = 640,
  originXInput = null,
  originYInput = null,
  tileInput = null,
  gapInput = null,
  rows = [],
  day = 1,
  metrics = null,
  routeForItem = () => null,
} = {}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const top = safeRows[0] || null;
  if (!top || !metrics) return null;
  const route = top.route || routeForItem(top.itemId, 1);
  const { tile, gap, originX, originY } = metrics;
  return harvestRouteWorldBoardSpecWorld({
    width,
    height,
    rows: safeRows,
    day,
    metrics: {
      originX: Number(originXInput ?? originX),
      originY: Number(originYInput ?? originY),
      tile: Number(tileInput ?? tile),
      gap: Number(gapInput ?? gap),
    },
    route,
  });
}

export function harvestRouteWorldBoardSpecWorld({
  width = 960,
  height = 640,
  rows = [],
  day = 1,
  metrics = null,
  route = null,
} = {}) {
  if (!rows.length || !metrics) return null;
  const top = rows[0];
  const targetX = metrics.originX + top.x * (metrics.tile + metrics.gap) + metrics.tile * 0.5;
  const targetY = metrics.originY + top.y * (metrics.tile + metrics.gap) + metrics.tile * 0.5;
  const routeCounts = rows.reduce((counts, row) => {
    const key = row.route?.type || "stock";
    counts[key] = Number(counts[key] || 0) + 1;
    return counts;
  }, {});
  const cardWidth = 318;
  const cardHeight = rows.length > 2 ? 142 : 118;
  const x = Math.max(386, Math.min(width - cardWidth - 286, metrics.originX + 96));
  const y = Math.max(42, Math.min(height - cardHeight - 24, metrics.originY - 98));
  return {
    key: `${day}:${rows.map((row) => `${row.x},${row.y}:${row.route?.type || "stock"}`).join("|")}`,
    day,
    rows,
    top,
    route,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: targetX, y: targetY },
    routeCounts,
    title: "今日收成去向 · 可点",
    headline: `${rows.length} 块成熟田等收`,
    detail: route?.headline || `先收 ${top.itemName}`,
    nextAction: route?.cta || "先收成熟作物",
  };
}

export function harvestRouteWorldBoardAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function drawHarvestRouteWorldBoardWorld({
  ctx,
  spec = null,
  focus = null,
  day = 1,
  reducedMotion = false,
  motion = performance.now() / 1000,
  drawCanvasCard,
  badgeForRoute = () => ({ fill: "rgba(255, 253, 245, 0.86)", stroke: "#9aa99d", text: "#5d6f65", glyph: "仓" }),
} = {}) {
  if (!spec?.rect || !drawCanvasCard) return false;
  const { rect, rows, top, route, anchor } = spec;
  const badge = badgeForRoute(route);
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.85) * 2;
  const active = focus?.day === day && focus?.key === spec.key;
  const cardY = rect.y + bob;
  const orderCount = Number(spec.routeCounts.order || 0);
  const recipeCount = Number(spec.routeCounts.recipe || 0);
  const shopCount = Number(spec.routeCounts.shop || 0);
  const summaryText = [
    orderCount ? `订单 ${orderCount}` : "",
    recipeCount ? `入锅 ${recipeCount}` : "",
    shopCount ? `旧铺 ${shopCount}` : "",
  ].filter(Boolean).join(" · ") || "先入仓";

  ctx.save();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.82)" : `${badge.stroke}66`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + 30, cardY + rect.height - 12);
  ctx.quadraticCurveTo((rect.x + anchor.x) / 2, cardY + rect.height + 42, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.88)" : `${badge.stroke}88`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = badge.fill;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 54, 48, 15);
  ctx.fill();
  ctx.strokeStyle = badge.stroke;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 54, 48, 15);
  ctx.stroke();
  ctx.fillStyle = badge.stroke;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(badge.glyph, rect.x + 32, cardY + 43);

  ctx.fillStyle = badge.text;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 82, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 82, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${summaryText} · ${spec.nextAction}`.slice(0, 34), rect.x + 82, cardY + 64);

  rows.slice(0, 3).forEach((row, index) => {
    const rowBadge = badgeForRoute(row.route);
    const rowY = cardY + 86 + index * 18;
    ctx.fillStyle = `${rowBadge.stroke}18`;
    ctx.beginPath();
    ctx.roundRect(rect.x + 16, rowY - 12, rect.width - 32, 15, 7);
    ctx.fill();
    ctx.fillStyle = rowBadge.stroke;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(rowBadge.glyph, rect.x + 28, rowY);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(`${row.itemName} (${row.x + 1},${row.y + 1})`.slice(0, 15), rect.x + 46, rowY);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText(String(row.route?.badge || "入仓").slice(0, 11), rect.x + 170, rowY);
    ctx.fillStyle = rowBadge.text;
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(String(row.route?.targetName || row.route?.cta || "").slice(0, 11), rect.x + 228, rowY);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 54, cardY + 12, 40, 19, 10);
  ctx.fill();
  ctx.fillStyle = badge.text;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 45, cardY + 26);
  ctx.restore();
  return true;
}

export function drawNightGrowthRouteBadgeWorld({
  ctx,
  plot = null,
  cx = 0,
  cy = 0,
  tile = 72,
  index = 0,
  fade = 1,
  progress = 0,
  reducedMotion = false,
  badgeForRoute = () => ({ fill: "rgba(255, 253, 245, 0.86)", stroke: "#9aa99d", text: "#5d6f65", glyph: "仓", label: "先入仓" }),
} = {}) {
  if (!ctx || !plot) return false;
  const badge = badgeForRoute(plot.useRoute);
  const label = badge.label.slice(0, 7);
  const bob = reducedMotion ? 0 : Math.sin(progress * Math.PI * 2 + index) * 2;
  ctx.save();
  ctx.font = "800 12px Microsoft YaHei";
  const width = Math.max(58, Math.min(108, ctx.measureText(label).width + 36));
  const x = Math.max(12, Math.min(ctx.canvas.width - width - 12, cx - width / 2));
  const y = Math.max(18, cy - tile * 0.88 - bob);
  ctx.globalAlpha = Math.max(0.18, fade);
  ctx.fillStyle = badge.fill;
  ctx.strokeStyle = badge.stroke;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(x, y, width, 25, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = badge.stroke;
  ctx.beginPath();
  ctx.arc(x + 14, y + 12.5, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.textAlign = "center";
  ctx.fillText(badge.glyph, x + 14, y + 17);
  ctx.fillStyle = badge.text;
  ctx.textAlign = "left";
  ctx.fillText(label, x + 27, y + 17);
  ctx.restore();
  return true;
}

export function drawMorningHarvestPlanFlagsWorld({
  ctx,
  plans = [],
  originX = 0,
  originY = 0,
  tile = 72,
  gap = 6,
  reducedMotion = false,
  motion = 0,
  routeSafe = (route) => route,
  badgeForRoute = () => ({ fill: "rgba(255, 253, 245, 0.86)", stroke: "#9aa99d", text: "#5d6f65", glyph: "仓", label: "先入仓" }),
} = {}) {
  if (!ctx || !plans.length) return false;
  ctx.save();
  for (const [index, plan] of plans.entries()) {
    const x = originX + plan.x * (tile + gap);
    const y = originY + plan.y * (tile + gap);
    const route = routeSafe(plan.route);
    const badge = badgeForRoute(route);
    const bob = reducedMotion ? 0 : Math.sin(motion * 2.2 + index) * 2.4;
    const flagX = x + tile * 0.5;
    const flagY = y - 18 + bob;
    const label = index === 0 ? "先收" : badge.glyph;
    const width = index === 0 ? 54 : 30;

    ctx.strokeStyle = "rgba(91, 51, 40, 0.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(flagX - width / 2 + 8, flagY + 24);
    ctx.lineTo(flagX - width / 2 + 8, flagY + 50);
    ctx.stroke();

    ctx.fillStyle = badge.fill;
    ctx.strokeStyle = badge.stroke;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(flagX - width / 2, flagY, width, 24, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = badge.text;
    ctx.font = index === 0 ? "800 12px Microsoft YaHei" : "900 13px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(label, flagX, flagY + 16);

    if (index === 0 && route?.badge) {
      ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
      ctx.strokeStyle = "rgba(224, 182, 109, 0.3)";
      const text = route.badge.slice(0, 7);
      ctx.font = "700 11px Microsoft YaHei";
      const textWidth = Math.min(94, Math.max(46, ctx.measureText(text).width + 14));
      ctx.beginPath();
      ctx.roundRect(flagX - textWidth / 2, flagY + 28, textWidth, 20, 9);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#8f5f3f";
      ctx.fillText(text, flagX, flagY + 42);
    }
  }
  ctx.restore();
  return true;
}
