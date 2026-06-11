export function shopRestockRunnerWorldSpecWorld({
  target = null,
  summary = null,
  day = 1,
  width = 960,
  height = 640,
  itemName = (itemId) => itemId,
  shopRestockRouteCandidates = () => [],
  shopRestockTargetIsWaterFresh = () => false,
} = {}) {
  if (!target || target.status !== "active" || !summary) return null;
  const restock = {
    day,
    itemId: target.itemId,
    itemName: target.itemName || summary.itemName,
    desiredCount: target.desiredCount || summary.desiredCount,
    source: target.source || "",
    note: target.note || target.reason || "",
  };
  const routes = shopRestockRouteCandidates(restock);
  const route = routes[0] || null;
  const cardWidth = 314;
  const cardHeight = 126;
  const x = Math.max(392, Math.min(width - cardWidth - 34, 430));
  const y = Math.max(182, Math.min(height - cardHeight - 52, 236));
  const waterFresh = shopRestockTargetIsWaterFresh(target);
  const waterwayReorder = target.source === "lianze_waterway_reorder";
  const daysLeft = Number(target.dueDay || day) - Number(day || 0);
  const routeText = route ? `${route.label}：${route.title}` : summary.routeText || "先准备任意可卖货";
  const runnerAction = summary.ready
    ? "回旧铺交签"
    : route?.action === "recipe"
      ? "去工坊补锅"
      : route?.action === "seed"
        ? "去灵田下种"
        : route?.action === "shop"
          ? "看货签上架"
          : "找可卖货";
  const path = [
    { x: x + 28, y: y + cardHeight - 8 },
    { x: 344, y: 336 },
    { x: 252, y: 300 },
    { x: 178, y: 244 },
    { x: 116, y: 214 },
  ];
  return {
    active: true,
    key: `${day}:${summary.id || target.id || "restock"}:${summary.have}:${summary.ready ? "ready" : "running"}:${route?.action || "shop"}`,
    day,
    title: "主世界旧铺补货跑腿",
    cta: summary.ready ? "补货可完成 · 可点" : "补货跑腿 · 可点",
    itemId: summary.itemId || target.itemId || "",
    itemName: summary.itemName || target.itemName || itemName(target.itemId),
    have: summary.have,
    desiredCount: summary.desiredCount,
    ready: summary.ready,
    overdue: summary.overdue,
    waterFresh,
    waterwayReorder,
    sourceLabel: summary.sourceLabel || (waterwayReorder ? "莲泽水航回订" : waterFresh ? "水鲜补货" : "旧铺补货"),
    statusText: summary.statusText,
    dueDay: summary.dueDay,
    dueText: summary.overdue ? `逾期 ${Math.abs(daysLeft)} 天` : daysLeft <= 0 ? "今天到期" : `还剩 ${daysLeft} 天`,
    route,
    routeText,
    runnerAction,
    nextAction: summary.nextAction || route?.action || "shop",
    recipeId: summary.recipeId || route?.recipeId || "",
    seedId: summary.seedId || route?.seedId || "",
    shopTag: summary.shopTag || route?.shopTag || "",
    note: summary.note || target.note || target.reason || "",
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 154, y: 218 },
    path,
    selector: summary.ready ? "[data-shop-restock-complete]" : '[data-shop-board="restock-tracker"]',
    fallbackSelector: '[data-shop-board="restock-tracker"]',
  };
}

export function shopRestockRunnerWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function shopRestockRunnerWorldFocusLogSpecWorld({
  spec = null,
} = {}) {
  if (!spec?.itemId) return null;
  return {
    title: "点选旧铺补货跑腿",
    missingTitle: "点选旧铺补货跑腿",
    missingLog: "旧铺补货跑腿牌已经点到，但补货追踪卡暂时没有找到；先确认核心试玩分组是否可见。",
    detail: spec.ready
      ? `${spec.itemName} 已备到 ${spec.have}/${spec.desiredCount}，已定位旧铺补货完成按钮。点击这里只做定位，不会自动交付或开铺。`
      : `${spec.itemName} 补货进度 ${spec.have}/${spec.desiredCount}，${spec.dueText}；下一步：${spec.routeText}。已定位补货追踪和推荐路线，不会自动制作、播种或消耗库存。`,
  };
}

export function drawShopRestockRunnerWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
  pointOnPolyline = () => ({ x: 0, y: 0 }),
} = {}) {
  if (!ctx || !spec?.rect || !Array.isArray(spec.path)) return false;
  const { rect, path } = spec;
  const accent = spec.waterFresh ? "#4d91a6" : spec.ready ? "#286f58" : spec.overdue ? "#be4f37" : "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 2.2;
  const progress = Math.max(0, Math.min(1, Number(spec.have || 0) / Math.max(1, Number(spec.desiredCount || 1))));
  const runnerPoint = pointOnPolyline(path, reducedMotion ? 0.58 : (motion * 0.16) % 1);
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}cc` : `${accent}66`;
  ctx.lineWidth = active ? 3.2 : 2.2;
  ctx.setLineDash([8, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  path.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y + bob);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
  ctx.beginPath();
  ctx.ellipse(runnerPoint.x, runnerPoint.y + 17, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "rgba(226, 244, 238, 0.96)" : spec.waterFresh ? "rgba(226, 241, 247, 0.96)" : "rgba(255, 246, 215, 0.96)";
  ctx.beginPath();
  ctx.arc(runnerPoint.x, runnerPoint.y + bob, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `${accent}aa`;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(runnerPoint.x - 10, runnerPoint.y + 6 + bob, 20, 11, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(224, 182, 109, 0.94)";
  ctx.beginPath();
  ctx.roundRect(runnerPoint.x + 12, runnerPoint.y + 3 + bob, 17, 13, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.58)";
  ctx.stroke();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.ready ? "交" : "跑", runnerPoint.x - 6, runnerPoint.y + 2 + bob);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.overdue ? "rgba(255, 240, 232, 0.96)" : "rgba(255, 253, 245, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}18`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 17, 62, 62, 16);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.have,
  }, rect.x + 25, cardY + 27, 38, {
    accent,
    missing: !spec.ready && Number(spec.have || 0) <= 0,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.6) * 1.2,
  });
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.ready ? "可交" : "跑腿", rect.x + 30, cardY + 84);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 92, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} ${spec.have}/${spec.desiredCount}`.slice(0, 18), rect.x + 92, cardY + 47);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${spec.sourceLabel} · ${spec.dueText} · ${spec.runnerAction}`.slice(0, 32), rect.x + 92, cardY + 66);

  ctx.fillStyle = "rgba(23, 35, 29, 0.1)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 92, cardY + 76, rect.width - 112, 9, 5);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "#286f58" : accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 92, cardY + 76, Math.max(10, (rect.width - 112) * progress), 9, 5);
  ctx.fill();

  ctx.fillStyle = spec.ready ? "rgba(202, 235, 210, 0.72)" : spec.overdue ? "rgba(239, 217, 208, 0.72)" : "rgba(255, 246, 215, 0.76)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 96, rect.width - 32, 20, 10);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "#286f58" : spec.overdue ? "#be4f37" : "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.routeText}`.slice(0, 42), rect.x + 28, cardY + 110);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.88)" : "rgba(224, 182, 109, 0.55)";
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 50 + i * 8, cardY + 23 + Math.sin(motion * 2 + i) * 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}
