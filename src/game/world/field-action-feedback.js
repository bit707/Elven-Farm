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
