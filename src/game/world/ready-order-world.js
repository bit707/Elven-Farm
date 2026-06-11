export function readyOrderWorldRowsWorld({
  limit = 3,
  orders = [],
  canDeliverOrder = () => false,
  orderNeeds = () => [],
  itemName = (itemId) => itemId,
  npcName = (npcId) => npcId,
  orderTitle = (order) => order?.order_id || "订单",
} = {}) {
  return (orders || [])
    .filter((order) => canDeliverOrder(order))
    .map((order) => {
      const needs = orderNeeds(order);
      const rewardGold = Number(order.reward_gold || 0);
      const rewardFame = Number(order.reward_fame || 0);
      const rewardFavor = Number(order.reward_favor_value || 0);
      const issuerId = order.issuer_id || order.reward_favor_npc || "";
      const favorNpcId = order.reward_favor_npc || issuerId;
      const npc = npcName(issuerId || favorNpcId) || "镇上来客";
      const needText = needs
        .slice(0, 2)
        .map(({ itemId, count }) => `${itemName(itemId)} x${count}`)
        .join(" / ");
      const rewardText = [
        rewardGold ? `${rewardGold} 灵石` : "",
        rewardFame ? `声望 +${rewardFame}` : "",
        rewardFavor ? `${npcName(favorNpcId)}好感 +${rewardFavor}` : "",
      ].filter(Boolean).join(" / ") || "订单奖励";
      const priority = rewardGold / 30
        + rewardFame * 8
        + rewardFavor * 5
        + (String(order.order_id || "").startsWith("order_year2_") ? 24 : 0)
        + (String(order.order_id || "").includes("story") ? 18 : 0)
        + Math.max(0, 4 - needs.length);
      return {
        order,
        orderId: order.order_id,
        title: orderTitle(order),
        npc,
        needText: `${needText}${needs.length > 2 ? ` 等 ${needs.length} 项` : ""}`,
        rewardText,
        rewardGold,
        rewardFame,
        rewardFavor,
        priority,
      };
    })
    .sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title, "zh-Hans-CN"))
    .slice(0, limit);
}

export function readyOrderWorldBoardSpecWorld({
  width = 960,
  height = 640,
  rows = [],
  day = 1,
} = {}) {
  if (!rows.length) return null;
  const top = rows[0];
  const cardWidth = 312;
  const cardHeight = 112 + rows.length * 22;
  const x = Math.max(424, Math.min(width - cardWidth - 42, width - cardWidth - 54));
  const y = Math.max(182, Math.min(height - cardHeight - 42, 226));
  return {
    key: `${day}:${rows.map((row) => row.orderId).join("|")}`,
    day,
    rows,
    top,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 742, y: 384 },
    title: "主世界可交订单",
    headline: rows.length > 1 ? `${rows.length} 张订单已备齐` : "订单已备齐",
    detail: `${top.title} · ${top.npc}`,
    rewardText: top.rewardText,
    needText: top.needText,
    cta: "可交单 · 可点",
  };
}

export function readyOrderWorldBoardAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function readyOrderSealSafetyTextWorld() {
  return "只定位订单卡和交付按钮，不会自动交单、扣除物品、发放奖励、推进剧情、开铺、入夜或消耗资源";
}

export function readyOrderSealNodesWorld(row = null) {
  if (!row) return [];
  return [
    {
      key: "goods",
      badge: "齐",
      title: "货已齐",
      detail: row.needText || "订单货物",
      accent: "#286f58",
    },
    {
      key: "seal",
      badge: "封",
      title: "打包封签",
      detail: row.npc || "镇上来客",
      accent: "#b47d2f",
    },
    {
      key: "reward",
      badge: "赏",
      title: "手动交付",
      detail: row.rewardText || "订单奖励",
      accent: "#8f5f3f",
    },
  ];
}

export function readyOrderSealWorldSpecWorld({
  width = 960,
  height = 640,
  board = null,
  day = 1,
  selectorDataValue = (value) => String(value ?? ""),
} = {}) {
  if (!board?.top?.orderId) return null;
  const top = board.top;
  const cardWidth = 318;
  const cardHeight = 114;
  const x = Math.max(248, Math.min(width - cardWidth - 34, 330));
  const y = Math.max(332, Math.min(height - cardHeight - 34, 372));
  return {
    key: `${day}:${top.orderId}:${top.needText}:${top.rewardText}:order_seal`,
    day,
    orderId: top.orderId,
    orderTitle: top.title,
    npc: top.npc,
    rewardText: top.rewardText,
    needText: top.needText,
    title: "订单备齐封签小景 · 可点",
    headline: `${top.title} 已能封签送出`,
    detail: `${top.needText} 已备齐，交给 ${top.npc} 前先看订单卡确认。`,
    routeText: "备齐货物 -> 打包封签 -> 手动交付",
    selector: `[data-order-card-id="${selectorDataValue(top.orderId)}"]`,
    fallbackSelector: "#orderPanel",
    safety: readyOrderSealSafetyTextWorld(),
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: board.anchor.x, y: board.anchor.y },
    packagePoint: { x: 748, y: 374 },
    nodes: readyOrderSealNodesWorld(top),
  };
}

export function readyOrderSealWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function drawReadyOrderWorldBoardWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = performance.now() / 1000,
  day = 1,
  focus = null,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !drawCanvasCard) return false;
  const { rect, rows, top, anchor } = spec;
  const safeMotion = reducedMotion ? 0 : motion;
  const bob = reducedMotion ? 0 : Math.sin(safeMotion * 1.95) * 2.4;
  const cardY = rect.y + bob;
  const active = focus?.day === day && focus?.key === spec.key;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.9)" : "rgba(209, 154, 74, 0.58)";
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -safeMotion * 13;
  ctx.beginPath();
  ctx.moveTo(rect.x + 36, cardY + rect.height - 8);
  ctx.quadraticCurveTo(rect.x + 88, cardY + rect.height + 36, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.95)" : "rgba(180, 125, 47, 0.66)";
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 56, 52, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 125, 47, 0.72)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 56, 52, 16);
  ctx.stroke();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("单", rect.x + 31, cardY + 47);
  for (let coin = 0; coin < 3; coin += 1) {
    const coinX = rect.x + 55 + coin * 10;
    const coinY = cardY + 58 - coin * 5;
    ctx.fillStyle = coin % 2 ? "#f5f0b6" : "#e0b66d";
    ctx.beginPath();
    ctx.arc(coinX, coinY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(143, 95, 63, 0.45)";
    ctx.stroke();
  }

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.headline}`, rect.x + 84, cardY + 26);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 20), rect.x + 84, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`奖励 ${spec.rewardText}`.slice(0, 34), rect.x + 84, cardY + 66);
  ctx.fillStyle = "#286f58";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`货已齐：${spec.needText}`.slice(0, 36), rect.x + 84, cardY + 82);

  rows.slice(0, 3).forEach((row, index) => {
    const rowY = cardY + 108 + index * 22;
    const primary = row.orderId === top.orderId;
    ctx.fillStyle = primary ? "rgba(72, 168, 104, 0.16)" : "rgba(255, 253, 245, 0.7)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 16, rowY - 15, rect.width - 32, 18, 8);
    ctx.fill();
    ctx.fillStyle = primary ? "#286f58" : "#8f5f3f";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(primary ? "先交" : "可交", rect.x + 28, rowY - 2);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(row.title.slice(0, 13), rect.x + 64, rowY - 2);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText(row.rewardText.slice(0, 14), rect.x + 178, rowY - 2);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 55, cardY + 12, 40, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 46, cardY + 25);
  ctx.restore();
  return true;
}

export function drawReadyOrderSealWorldWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = performance.now() / 1000,
  day = 1,
  focus = null,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !drawCanvasCard) return false;
  const { rect, packagePoint } = spec;
  const safeMotion = reducedMotion ? 0 : motion;
  const active = focus?.day === day && focus?.key === spec.key;
  const pulse = reducedMotion ? 0 : Math.sin(safeMotion * 2.15) * 2.6;
  const cardY = rect.y + pulse * 0.45;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.86)" : "rgba(180, 125, 47, 0.52)";
  ctx.lineWidth = active ? 3.2 : 2;
  ctx.setLineDash([8, 9]);
  ctx.lineDashOffset = reducedMotion ? 0 : -safeMotion * 14;
  ctx.beginPath();
  ctx.moveTo(packagePoint.x, packagePoint.y - 8);
  ctx.quadraticCurveTo((packagePoint.x + rect.x + 42) / 2, cardY + 132, rect.x + 42, cardY + 78);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let bead = 0; bead < 6; bead += 1) {
    const t = reducedMotion ? bead / 5 : (safeMotion * 0.11 + bead * 0.17) % 1;
    const beadX = packagePoint.x + (rect.x + 42 - packagePoint.x) * t;
    const beadY = packagePoint.y - 8 + (cardY + 78 - packagePoint.y + 8) * t - Math.sin(t * Math.PI) * 26;
    ctx.fillStyle = bead % 2 ? "rgba(246, 240, 182, 0.78)" : "rgba(202, 235, 210, 0.68)";
    ctx.beginPath();
    ctx.arc(beadX, beadY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(23, 35, 29, 0.14)";
  ctx.beginPath();
  ctx.ellipse(packagePoint.x + 2, packagePoint.y + 24, 46, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(224, 182, 109, 0.92)";
  ctx.strokeStyle = "rgba(143, 95, 63, 0.68)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(packagePoint.x - 34, packagePoint.y - 2 + pulse * 0.22, 68, 36, 9);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
  ctx.fillRect(packagePoint.x - 24, packagePoint.y + 8 + pulse * 0.22, 48, 5);
  ctx.fillStyle = "#be4f37";
  ctx.beginPath();
  ctx.arc(packagePoint.x + 24, packagePoint.y + 24 + pulse * 0.22, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("封", packagePoint.x + 20, packagePoint.y + 27 + pulse * 0.22);
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(packagePoint.x - 42, packagePoint.y - 32 + pulse * 0.2, 92, 22, 10);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("货已齐 · 待手动交付", packagePoint.x - 32, packagePoint.y - 17 + pulse * 0.2);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.9)" : "rgba(180, 125, 47, 0.66)";
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 52, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 125, 47, 0.58)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("封", rect.x + 31, cardY + 48);
  ctx.fillStyle = "#be4f37";
  ctx.beginPath();
  ctx.arc(rect.x + 56, cardY + 55, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 84, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 84, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.needText} · ${spec.npc} · ${spec.rewardText}`.slice(0, 38), rect.x + 84, cardY + 62);

  const nodeY = cardY + 82;
  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 14 + index * 98;
    ctx.fillStyle = index === 1 ? `${node.accent}18` : "rgba(255, 253, 245, 0.78)";
    ctx.strokeStyle = `${node.accent}52`;
    ctx.lineWidth = active && index === 1 ? 1.8 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 10, 86, 26, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 14, nodeY + 3, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge.slice(0, 1), nodeX + 10, nodeY + 6);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 4), nodeX + 28, nodeY - 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 8), nodeX + 28, nodeY + 12);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 16, rect.width - 36, 12, 6);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 47), rect.x + 26, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function orderDeliveryEchoSafetyTextWorld() {
  return "只回看订单结果和定位订单板，不会再次交单、扣除物品、发放奖励、增加好感、推进剧情、开铺、入夜或消耗资源";
}

export function orderDeliveryEchoSpecWorld({
  feedback = null,
  order = null,
  day = 1,
  npcName = (npcId) => npcId || "镇上来客",
  orderNeeds = () => [],
  itemName = (itemId) => itemId,
} = {}) {
  if (!feedback?.orderId) return null;
  return {
    key: `${day}:${feedback.orderId}:delivery_echo`,
    day,
    orderId: feedback.orderId,
    title: "订单交付回响留签 · 可点",
    headline: feedback.firstOrder ? "第一单谢礼落袋" : `${feedback.npcLabel}把谢礼压在签下`,
    orderTitle: feedback.title,
    npcLabel: feedback.npcLabel || (order ? npcName(order.issuer_id || order.reward_favor_npc) : "镇上来客"),
    rewardGold: Number(feedback.rewardGold || 0),
    rewardFame: Number(feedback.rewardFame || 0),
    favorGain: Number(feedback.favorGain || 0),
    needText: feedback.needText || (order ? orderNeeds(order).map(({ itemId, count }) => `${itemName(itemId)} x${count}`).join(" / ") : ""),
    response: feedback.response || "",
    nextAdvice: feedback.nextAdvice || "",
    safety: orderDeliveryEchoSafetyTextWorld(),
    createdAt: performance.now(),
  };
}

export function orderDeliveryEchoWorldSpecWorld({
  width = 960,
  height = 640,
  echo = null,
  day = 1,
} = {}) {
  if (!echo?.orderId || echo.day !== day) return null;
  const cardWidth = 334;
  const cardHeight = 132;
  const x = Math.max(36, Math.min(width - cardWidth - 34, 54));
  const y = Math.max(272, Math.min(height - cardHeight - 34, 334));
  return {
    ...echo,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 432, y: 350 },
    ledgerPoint: { x: 248, y: 386 },
  };
}

export function orderDeliveryEchoWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function drawOrderDeliveryEchoWorldWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = performance.now() / 1000,
  day = 1,
  focus = null,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !drawCanvasCard) return false;
  const { rect, anchor, ledgerPoint } = spec;
  const safeMotion = reducedMotion ? 0 : motion;
  const active = focus?.day === day && focus?.key === spec.key;
  const bob = reducedMotion ? 0 : Math.sin(safeMotion * 1.85) * 2.2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.86)" : "rgba(180, 125, 47, 0.54)";
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -safeMotion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 14);
  ctx.quadraticCurveTo((anchor.x + rect.x + rect.width - 36) / 2, cardY + 172, rect.x + rect.width - 36, cardY + rect.height - 18);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(23, 35, 29, 0.14)";
  ctx.beginPath();
  ctx.ellipse(ledgerPoint.x, ledgerPoint.y + 28, 54, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.strokeStyle = "rgba(180, 125, 47, 0.58)";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(ledgerPoint.x - 42, ledgerPoint.y - 10 + bob * 0.18, 84, 48, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#8f5f3f";
  ctx.fillRect(ledgerPoint.x - 26, ledgerPoint.y + 4 + bob * 0.18, 42, 3);
  ctx.fillRect(ledgerPoint.x - 26, ledgerPoint.y + 15 + bob * 0.18, 34, 3);
  ctx.fillStyle = "#be4f37";
  ctx.beginPath();
  ctx.arc(ledgerPoint.x + 24, ledgerPoint.y + 24 + bob * 0.18, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("收", ledgerPoint.x + 20, ledgerPoint.y + 27 + bob * 0.18);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.9)" : "rgba(180, 125, 47, 0.62)";
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 16, 62, 56, 17);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 24px Microsoft YaHei";
  ctx.fillText("谢", rect.x + 34, cardY + 52);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 92, cardY + 26);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 92, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.orderTitle} · ${spec.npcLabel}`.slice(0, 34), rect.x + 92, cardY + 64);

  const chips = [
    { label: `灵石 +${spec.rewardGold}`, color: "#8f5f3f", fill: "rgba(224, 182, 109, 0.18)" },
    { label: `声望 +${spec.rewardFame}`, color: "#286f58", fill: "rgba(40, 111, 88, 0.14)" },
    { label: `好感 +${spec.favorGain}`, color: "#be4f37", fill: "rgba(190, 79, 55, 0.12)" },
  ].filter((chip, index) => index < 2 || spec.favorGain > 0);
  chips.forEach((chip, index) => {
    const chipX = rect.x + 18 + index * 102;
    const chipY = cardY + 84;
    ctx.fillStyle = chip.fill;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 92, 22, 11);
    ctx.fill();
    ctx.fillStyle = chip.color;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(chip.label.slice(0, 10), chipX + 10, chipY + 15);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 20, rect.width - 36, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`回看订单板 · ${spec.safety}`.slice(0, 48), rect.x + 26, cardY + rect.height - 10);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 14, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, cardY + 27);
  ctx.restore();
  return true;
}

export function orderRewardNextUseSafetyTextWorld() {
  return "只定位下一步面板或选中种子/配方，不会自动买种、播种、加工、交单、上架、开铺、扣钱、扣材料、发奖励、入夜或消耗资源";
}

export function orderRewardNextUseWorldSpecWorld({
  width = 960,
  height = 640,
  echo = null,
  candidate = null,
  day = 1,
} = {}) {
  if (!echo?.orderId || echo.day !== day || !candidate) return null;
  const cardWidth = 316;
  const cardHeight = 118;
  const x = Math.max(586, Math.min(width - cardWidth - 34, 604));
  const y = Math.max(382, Math.min(height - cardHeight - 32, 446));
  return {
    ...candidate,
    key: `${day}:${echo.orderId}:${candidate.type}:${candidate.orderId || candidate.itemId || candidate.seedId || candidate.recipeId || "next"}`,
    day,
    sourceOrderId: echo.orderId,
    sourceOrderTitle: echo.orderTitle,
    rewardText: `${Number(echo.rewardGold || 0)} 灵石 / 声望 +${Number(echo.rewardFame || 0)}`,
    routeText: "回款入账 -> 补下一步 -> 手动确认",
    safety: orderRewardNextUseSafetyTextWorld(),
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 252, y: 404 },
  };
}

export function orderRewardNextUseWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function drawOrderRewardNextUseWorldWorld({
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
  const safeMotion = reducedMotion ? 0 : motion;
  const active = focus?.day === day && focus?.key === spec.key;
  const bob = reducedMotion ? 0 : Math.sin(safeMotion * 1.72) * 2.4;
  const cardY = rect.y + bob;
  const accent = spec.type === "shop" ? "#8f5f3f" : spec.type === "seed" ? "#286f58" : spec.type === "recipe" ? "#b47d2f" : "#be4f37";

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}88`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -safeMotion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 10);
  ctx.quadraticCurveTo(rect.x + 26, cardY + rect.height + 34, rect.x + 42, cardY + rect.height - 16);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 5; i += 1) {
    const t = reducedMotion ? i / 4 : (safeMotion * 0.13 + i * 0.19) % 1;
    const moteX = anchor.x + (rect.x + 42 - anchor.x) * t;
    const moteY = anchor.y + 10 + (cardY + rect.height - 16 - anchor.y - 10) * t - Math.sin(t * Math.PI) * 24;
    ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.75)" : `${accent}55`;
    ctx.beginPath();
    ctx.arc(moteX, moteY, 3.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}1f`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 16, 58, 50, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 21px Microsoft YaHei";
  const icon = spec.type === "shop" ? "铺" : spec.type === "seed" ? "种" : spec.type === "recipe" ? "锅" : spec.type === "ready_order" ? "单" : "补";
  ctx.fillText(icon, rect.x + 34, cardY + 49);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("回款下一步 · 可点", rect.x + 88, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 88, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.label} · ${spec.metric}`.slice(0, 34), rect.x + 88, cardY + 64);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + 78, rect.width - 36, 20, 10);
  ctx.fill();
  ctx.fillStyle = "#5d6f65";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 44), rect.x + 28, cardY + 92);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 17, rect.width - 36, 12, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 48), rect.x + 26, cardY + rect.height - 8);

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

export function orderRewardReinvestTrailSafetyTextWorld() {
  return "只定位订单板、旧铺、种子栏或配方栏，不会自动买种、播种、加工、交单、上架、开铺、扣钱、扣材料、发奖励、入夜或消耗资源";
}

export function orderRewardReinvestTrailWorldSpecWorld({
  width = 960,
  height = 640,
  echo = null,
  candidate = null,
  day = 1,
} = {}) {
  if (!echo?.orderId || echo.day !== day || !candidate) return null;
  const rewardGold = Number(echo.rewardGold || 0);
  const rewardFame = Number(echo.rewardFame || 0);
  if (rewardGold <= 0 && rewardFame <= 0) return null;
  const cardWidth = 352;
  const cardHeight = 122;
  const x = Math.max(336, Math.min(width - cardWidth - 34, 396));
  const y = Math.max(86, Math.min(height - cardHeight - 34, 128));
  const investLabel = candidate.type === "ready_order"
    ? "趁热接单"
    : candidate.type === "shop"
      ? "补旧铺头排"
      : candidate.type === "seed"
        ? "补种子袋"
        : candidate.type === "recipe"
          ? "补下一锅"
          : "补订单缺口";
  const nodes = [
    { key: "income", badge: "账", title: "回款入账", detail: `${rewardGold} 灵石`, accent: "#b47d2f" },
    { key: "invest", badge: "投", title: investLabel, detail: candidate.label || candidate.title, accent: candidate.type === "shop" ? "#8f5f3f" : candidate.type === "seed" ? "#286f58" : "#be4f37" },
    { key: "confirm", badge: "手", title: "手动确认", detail: candidate.metric || "不自动执行", accent: "#4d9a6a" },
  ];
  return {
    ...candidate,
    key: `${day}:${echo.orderId}:${candidate.type}:${candidate.orderId || candidate.itemId || candidate.seedId || candidate.recipeId || "trail"}:${rewardGold}:${rewardFame}`,
    day,
    title: "回款再投入账串 · 可点",
    headline: "这笔钱下一步怎么滚起来",
    sourceOrderId: echo.orderId,
    sourceOrderTitle: echo.orderTitle,
    rewardText: `${rewardGold} 灵石 / 声望 +${rewardFame}`,
    routeText: "回款入账 -> 再投入 -> 手动确认",
    safety: orderRewardReinvestTrailSafetyTextWorld(),
    nodes,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 254, y: 404 },
  };
}

export function orderRewardReinvestTrailWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function drawOrderRewardReinvestTrailWorldWorld({
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
  const safeMotion = reducedMotion ? 0 : motion;
  const active = focus?.day === day && focus?.key === spec.key;
  const bob = reducedMotion ? 0 : Math.sin(safeMotion * 1.48) * 2;
  const shimmer = reducedMotion ? 0.5 : (Math.sin(safeMotion * 2.6) + 1) / 2;
  const cardY = rect.y + bob;
  const accent = spec.type === "shop" ? "#8f5f3f" : spec.type === "seed" ? "#286f58" : spec.type === "recipe" ? "#b47d2f" : "#be4f37";

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.7;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -safeMotion * 10;
  ctx.beginPath();
  ctx.moveTo(anchor.x + 4, anchor.y - 2);
  ctx.quadraticCurveTo(rect.x + 36, cardY + rect.height + 24, rect.x + 56, cardY + rect.height - 12);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 6; i += 1) {
    const t = reducedMotion ? i / 5 : (safeMotion * 0.12 + i * 0.17) % 1;
    const moteX = anchor.x + (rect.x + 56 - anchor.x) * t;
    const moteY = anchor.y - 2 + (cardY + rect.height - 12 - anchor.y + 2) * t - Math.sin(t * Math.PI) * 30;
    ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.72)" : `${accent}5f`;
    ctx.beginPath();
    ctx.arc(moteX, moteY, 2.8 + shimmer * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}7a`;
  ctx.lineWidth = active ? 2.7 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}1f`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 56, 50, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 21px Microsoft YaHei";
  ctx.fillText("账", rect.x + 32, cardY + 48);
  ctx.fillStyle = `rgba(255, 253, 245, ${0.5 + shimmer * 0.26})`;
  ctx.beginPath();
  ctx.arc(rect.x + 58, cardY + 25 - shimmer * 3, 5 + shimmer * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 86, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 86, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.rewardText} · ${spec.label || spec.metric}`.slice(0, 40), rect.x + 86, cardY + 63);

  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 18 + index * 108;
    const nodeY = cardY + 86;
    ctx.fillStyle = `${node.accent}18`;
    ctx.strokeStyle = `${node.accent}55`;
    ctx.lineWidth = active && index === 1 ? 1.9 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 10, 98, 27, 11);
    ctx.fill();
    ctx.stroke();
    if (index < spec.nodes.length - 1) {
      ctx.strokeStyle = `${accent}55`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(nodeX + 98, nodeY + 3);
      ctx.lineTo(nodeX + 108, nodeY + 3);
      ctx.stroke();
    }
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 14, nodeY + 4, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge, nodeX + 10, nodeY + 7);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 5), nodeX + 28, nodeY + 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 10), nodeX + 28, nodeY + 12);
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
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 56), rect.x + 26, cardY + rect.height - 7);

  ctx.restore();
  return true;
}

export function orderCraftPrepWorldBoardSpecWorld({
  width = 960,
  height = 640,
  rows = [],
  day = 1,
  copy = null,
} = {}) {
  if (!rows.length) return null;
  const top = rows[0];
  const cardWidth = 306;
  const cardHeight = 110 + rows.length * 22;
  const x = Math.max(560, Math.min(width - cardWidth - 36, 618));
  const y = Math.max(328, Math.min(height - cardHeight - 34, 392));
  return {
    key: `${day}:${rows.map((row) => `${row.orderId}:${row.recipeId}`).join("|")}`,
    day,
    rows,
    top,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 764, y: 438 },
    title: copy?.title || "主世界订单缺口可入锅",
    headline: `${top.itemName} 还差 ${top.missingCount}`,
    detail: `${top.recipeTitle} 原料已齐`,
    cta: copy?.cta || "缺口可入锅 · 可点",
  };
}

export function orderCraftPrepWorldBoardAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function drawOrderCraftPrepWorldBoardWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = performance.now() / 1000,
  day = 1,
  focus = null,
  drawCanvasCard,
} = {}) {
  if (!spec?.rect || !drawCanvasCard) return false;
  const { rect, rows, top, anchor } = spec;
  const safeMotion = reducedMotion ? 0 : motion;
  const bob = reducedMotion ? 0 : Math.sin(safeMotion * 1.82) * 2.2;
  const cardY = rect.y + bob;
  const active = focus?.day === day && focus?.key === spec.key;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.84)" : "rgba(190, 79, 55, 0.46)";
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.setLineDash([5, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -safeMotion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + 30, cardY + 18);
  ctx.quadraticCurveTo(rect.x + 96, cardY - 42, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 244, 232, 0.96)");
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.88)" : "rgba(190, 79, 55, 0.58)";
  ctx.lineWidth = active ? 2.8 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 56, 52, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(190, 79, 55, 0.66)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 56, 52, 16);
  ctx.stroke();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("锅", rect.x + 31, cardY + 47);
  for (let puff = 0; puff < 3; puff += 1) {
    const lift = reducedMotion ? puff * 5 : (safeMotion * 18 + puff * 13) % 28;
    ctx.strokeStyle = `rgba(255, 253, 245, ${0.68 - puff * 0.12})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(rect.x + 30 + puff * 11, cardY + 17 - lift * 0.35, 6 + puff, Math.PI * 0.05, Math.PI * 1.2);
    ctx.stroke();
  }

  ctx.fillStyle = "#be4f37";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.headline}`, rect.x + 84, cardY + 26);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(top.orderTitle.slice(0, 18), rect.x + 84, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.detail} · ${top.machineText}`.slice(0, 34), rect.x + 84, cardY + 66);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`原料 ${top.inputText}`.slice(0, 36), rect.x + 84, cardY + 82);

  rows.slice(0, 3).forEach((row, index) => {
    const rowY = cardY + 108 + index * 22;
    const primary = row.recipeId === top.recipeId && row.orderId === top.orderId;
    ctx.fillStyle = primary ? "rgba(190, 79, 55, 0.14)" : "rgba(255, 253, 245, 0.72)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 16, rowY - 15, rect.width - 32, 18, 8);
    ctx.fill();
    ctx.fillStyle = primary ? "#be4f37" : "#8f5f3f";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(primary ? "先做" : "可做", rect.x + 28, rowY - 2);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(row.recipeTitle.slice(0, 13), rect.x + 64, rowY - 2);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText(`${row.itemName} ${row.haveText}`.slice(0, 14), rect.x + 178, rowY - 2);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 55, cardY + 12, 40, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 46, cardY + 25);
  ctx.restore();
  return true;
}
