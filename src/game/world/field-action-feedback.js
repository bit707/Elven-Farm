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
