export function drawWorkshopOutputRouteTriptychWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.nodes?.length) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2.6;
  const cardY = rect.y + pulse * 0.35;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.72)" : "rgba(224, 182, 109, 0.5)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width - 46, cardY - 24, rect.x + rect.width - 24, cardY + 32);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 253, 245, 0.94)");
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.86)" : "rgba(180, 125, 47, 0.52)";
  ctx.lineWidth = active ? 2.6 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 54, 42, 14);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("锅", rect.x + 31, cardY + 42);
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 82, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 82, cardY + 43);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.outputLabel} x${spec.outputCount} · 库存 ${spec.haveCount}`.slice(0, 28), rect.x + 82, cardY + 58);

  const nodeY = cardY + 78;
  const nodeW = 92;
  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 18 + index * 102;
    ctx.fillStyle = node.soft;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 12, nodeW, 38, 13);
    ctx.fill();
    ctx.strokeStyle = `${node.accent}66`;
    ctx.lineWidth = active ? 1.8 : 1.1;
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 16, nodeY + 7, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge.slice(0, 1), nodeX + 11, nodeY + 11);
    ctx.fillStyle = node.accent;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 5), nodeX + 34, nodeY + 2);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(node.detail.slice(0, 10), nodeX + 34, nodeY + 17);
  });

  ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 18, rect.width - 32, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.safety}`.slice(0, 42), rect.x + 24, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function drawWorkshopValueLedgerWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.steps?.length) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 3;
  const cardY = rect.y + pulse * 0.4;

  ctx.save();
  ctx.strokeStyle = active ? `${spec.accent}cc` : `${spec.accent}77`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + 42, cardY - 30, rect.x + 34, cardY + 24);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? spec.accent : `${spec.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = spec.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 56, 50, 16);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("账", rect.x + 32, cardY + 46);
  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 53, 44, 15, 8);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 30, cardY + 64);

  ctx.fillStyle = spec.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 84, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 84, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 36), rect.x + 84, cardY + 62);

  const barX = rect.x + 84;
  const barY = cardY + 70;
  const barW = rect.width - 112;
  const barH = 14;
  ctx.fillStyle = "rgba(23, 35, 29, 0.1)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 7);
  ctx.fill();
  ctx.fillStyle = "rgba(143, 95, 63, 0.42)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(10, barW * Number(spec.rawRatio || 0)), barH, 7);
  ctx.fill();
  ctx.fillStyle = "rgba(224, 182, 109, 0.62)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(10, barW * Number(spec.outputRatio || 0)), barH, 7);
  ctx.fill();
  ctx.fillStyle = `${spec.accent}cc`;
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(10, barW * Number(spec.orderRatio || 0)), barH, 7);
  ctx.fill();
  if (!reducedMotion) {
    const shimmerX = barX + ((motion * 0.32) % 1) * Math.max(1, barW - 20);
    ctx.fillStyle = "rgba(255, 253, 245, 0.58)";
    ctx.beginPath();
    ctx.roundRect(shimmerX, barY + 2, 20, barH - 4, 6);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 118, cardY + 66, 96, 22, 11);
  ctx.fill();
  ctx.strokeStyle = `${spec.accent}55`;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.premiumLabel.slice(0, 10), rect.x + rect.width - 106, cardY + 80);

  ctx.fillStyle = spec.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("收益差条", barX, barY + 28);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.profitLabel} · ${spec.conclusion}`.slice(0, 28), barX + 56, barY + 28);

  const stepY = cardY + 98;
  ctx.strokeStyle = `${spec.accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 24, stepY);
  ctx.lineTo(rect.x + rect.width - 24, stepY);
  ctx.stroke();
  spec.steps.forEach((step, index) => {
    const dotX = rect.x + 34 + index * 104;
    ctx.fillStyle = index === 2 ? spec.accent : "rgba(255, 253, 245, 0.96)";
    ctx.strokeStyle = `${spec.accent}88`;
    ctx.lineWidth = index === 2 ? 2.4 : 1.5;
    ctx.beginPath();
    ctx.arc(dotX, stepY, index === 2 ? 8 : 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = index === 2 ? "#fffdf5" : spec.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(index + 1), dotX - 3, stepY + 3);
    ctx.fillStyle = index === 2 ? spec.accent : "#8f5f3f";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 5), dotX - 20, stepY - 12);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(step.value.slice(0, 9), dotX - 24, stepY + 18);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 20, rect.width - 32, 15, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.safety}`.slice(0, 44), rect.x + 24, cardY + rect.height - 9);
  ctx.restore();
  return true;
}

export function drawWorkshopOutputStorageRouteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.nodes?.length) return false;
  const { rect, anchor } = spec;
  const accent = spec.orderVisible
    ? spec.orderReady ? "#286f58" : "#8f5f3f"
    : "#4d91a6";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.8) * 2.2;
  const shimmer = reducedMotion ? 0.5 : (Math.sin(motion * 2.8) + 1) / 2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 22);
  ctx.quadraticCurveTo(rect.x + rect.width - 54, cardY - 22, rect.x + rect.width - 34, cardY + 28);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}84`;
  ctx.lineWidth = active ? 2.7 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 15, cardY + 16, 58, 52, 16);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("锅", rect.x + 34, cardY + 50);
  ctx.fillStyle = `rgba(255, 253, 245, ${0.48 + shimmer * 0.28})`;
  ctx.beginPath();
  ctx.arc(rect.x + 60, cardY + 29 - shimmer * 4, 5 + shimmer * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 88, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 88, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.recipeName} · ${spec.outputItemName} x${spec.outputCount}`.slice(0, 38), rect.x + 88, cardY + 64);

  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 18 + index * 102;
    const nodeY = cardY + 84;
    ctx.fillStyle = `${node.accent}1b`;
    ctx.strokeStyle = `${node.accent}55`;
    ctx.lineWidth = active && index === 2 ? 1.9 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 9, 92, 26, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 14, nodeY + 4, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge, nodeX + 10, nodeY + 7);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 4), nodeX + 28, nodeY + 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 9), nodeX + 28, nodeY + 12);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 13, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, cardY + 26);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 15, rect.width - 36, 11, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 54), rect.x + 26, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function drawWorkshopToShopStockBridgeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  focused = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  pointOnPolyline = (points = []) => points[0] || { x: 0, y: 0 },
  drawShopWeatherShelfGoodIcon = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.shopAnchor || !spec?.nodes?.length) return false;
  const { rect, anchor, shopAnchor } = spec;
  const accent = focused ? "#286f58" : "#4d91a6";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.45) * 2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = focused ? "rgba(40, 111, 88, 0.78)" : "rgba(77, 145, 166, 0.48)";
  ctx.lineWidth = focused ? 3.2 : 2;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 15;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 14);
  ctx.bezierCurveTo(rect.x - 18, cardY + rect.height + 18, rect.x + rect.width + 20, cardY - 20, shopAnchor.x, shopAnchor.y + 22);
  ctx.stroke();
  ctx.setLineDash([]);

  const beadCount = 7;
  for (let i = 0; i < beadCount; i += 1) {
    const t = reducedMotion ? i / Math.max(1, beadCount - 1) : (motion * 0.09 + i / beadCount) % 1;
    const p1 = pointOnPolyline([
      { x: anchor.x, y: anchor.y + 14 },
      { x: rect.x + 40, y: cardY + rect.height - 8 },
      { x: rect.x + rect.width - 42, y: cardY + 20 },
      { x: shopAnchor.x, y: shopAnchor.y + 22 },
    ], t);
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.82)" : "rgba(224, 182, 109, 0.74)";
    ctx.beginPath();
    ctx.roundRect(p1.x - 7, p1.y - 5, 14, 10, 3);
    ctx.fill();
    ctx.strokeStyle = "rgba(77, 145, 166, 0.36)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(244, 250, 238, 0.96)");
  ctx.strokeStyle = focused ? "rgba(40, 111, 88, 0.92)" : "rgba(77, 145, 166, 0.72)";
  ctx.lineWidth = focused ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 16, 58, 58, 16);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.stock,
  }, rect.x + 24, cardY + 25, 38, {
    accent,
    missing: false,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.1) * 1.1,
  });
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("备货桥", rect.x + 22, cardY + 84);

  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 86, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 86, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.recipeName} · 库存 ${spec.stock} · ${spec.shopTagText}`.slice(0, 36), rect.x + 86, cardY + 65);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`门口理由：${String(spec.reason || "").slice(0, 24)}`, rect.x + 86, cardY + 81);

  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 18 + index * 101;
    const nodeY = cardY + 94;
    ctx.fillStyle = index === 2 ? `${node.accent}1c` : "rgba(255, 253, 245, 0.82)";
    ctx.strokeStyle = `${node.accent}4f`;
    ctx.lineWidth = focused && index === 2 ? 1.8 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY, 91, 20, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 12, nodeY + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge, nodeX + 8, nodeY + 13);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 5), nodeX + 25, nodeY + 8);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 8), nodeX + 25, nodeY + 17);
  });

  ctx.fillStyle = focused ? "rgba(40, 111, 88, 0.14)" : "rgba(202, 235, 210, 0.55)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 25, rect.width - 36, 17, 9);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · 可点定位`.slice(0, 38), rect.x + 28, cardY + rect.height - 13);

  if (!reducedMotion) {
    ctx.fillStyle = focused ? "rgba(246, 240, 182, 0.88)" : "rgba(246, 240, 182, 0.52)";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 42 + i * 8, cardY + 22 + Math.sin(motion * 2 + i) * 2.4, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function drawWorkshopReadyOrderDispatchWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  pointOnPolyline = (points = []) => points[0] || { x: 0, y: 0 },
} = {}) {
  if (!ctx || !spec?.rect || !spec?.path?.length) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4) * 3;
  const travel = reducedMotion ? 0.74 : 0.58 + (Math.sin(motion * 0.8) + 1) * 0.17;
  const cart = pointOnPolyline(spec.path, Math.max(0.05, Math.min(0.95, travel)));

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.78)" : "rgba(40, 111, 88, 0.5)";
  ctx.lineWidth = active ? 4 : 3;
  ctx.setLineDash([10, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 22;
  ctx.beginPath();
  spec.path.forEach((point, index) => {
    const y = point.y - 34;
    if (index === 0) ctx.moveTo(point.x, y);
    else ctx.lineTo(point.x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = active ? "rgba(237, 243, 223, 0.95)" : "rgba(255, 253, 245, 0.88)";
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.82)" : "rgba(40, 111, 88, 0.42)";
  ctx.lineWidth = active ? 2.4 : 1.4;
  ctx.beginPath();
  ctx.roundRect(780, 330 + pulse * 0.18, 132, 34, 13);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.boardLabel, 794, 348 + pulse * 0.18);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText("交单路线终点", 804, 360 + pulse * 0.18);

  for (let bead = 0; bead < 7; bead += 1) {
    const point = pointOnPolyline(spec.path, reducedMotion ? bead / 6 : (motion * 0.12 + bead / 7) % 1);
    ctx.fillStyle = bead % 2 ? "rgba(246, 240, 182, 0.78)" : "rgba(202, 235, 210, 0.72)";
    ctx.beginPath();
    ctx.arc(point.x, point.y - 34 + Math.sin(motion * 2 + bead) * 3, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(23, 35, 29, 0.18)";
  ctx.beginPath();
  ctx.ellipse(cart.x + 8, cart.y + 16, 42, 9, -0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.beginPath();
  ctx.roundRect(cart.x - 26, cart.y - 14, 54, 26, 7);
  ctx.fill();
  ctx.fillStyle = "#e0b66d";
  ctx.beginPath();
  ctx.roundRect(cart.x - 18, cart.y - 26 + pulse * 0.15, 38, 18, 6);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.beginPath();
  ctx.arc(cart.x - 14, cart.y + 16, 6, 0, Math.PI * 2);
  ctx.arc(cart.x + 24, cart.y + 16, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.beginPath();
  ctx.roundRect(cart.x + 24, cart.y - 36 + pulse * 0.2, 36, 22, 7);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("可交", cart.x + 31, cart.y - 21 + pulse * 0.2);
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(cart.x - 48, cart.y + 24 + pulse * 0.12, 96, 20, 10);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.routeLabel, cart.x - 34, cart.y + 38 + pulse * 0.12);

  const { rect } = spec;
  drawCanvasCard(ctx, rect.x, rect.y + pulse * 0.45, rect.width, rect.height, "rgba(237, 243, 223, 0.94)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.9)" : "rgba(40, 111, 88, 0.58)";
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, rect.y + 1.5 + pulse * 0.45, rect.width - 3, rect.height - 3, 16);
  ctx.stroke();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.headline}`.slice(0, 24), rect.x + 16, rect.y + 21 + pulse * 0.45);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(`${spec.outputLabel} x${spec.outputCount}`.slice(0, 14), rect.x + 16, rect.y + 43 + pulse * 0.45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.orderTitle} · 奖励 ${spec.rewardText}`.slice(0, 34), rect.x + 16, rect.y + 59 + pulse * 0.45);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 68 + pulse * 0.45, rect.width - 32, 17, 9);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`1 ${spec.boardLabel}  2 ${spec.manualLabel} · ${spec.safety}`.slice(0, 42), rect.x + 24, rect.y + 80 + pulse * 0.45);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, rect.y + 13 + pulse * 0.45, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, rect.y + 26 + pulse * 0.45);
  ctx.restore();
  return true;
}
