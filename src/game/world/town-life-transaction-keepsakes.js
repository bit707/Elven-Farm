export function townLifeErrandDeliverySafetyText() {
  return "这里只定位小托付交付入口，不会自动交付托付、扣除物品、发放回礼、增加好感或消耗资源。";
}

export function townLifeErrandDeliveryKeepsakeNodes(row = null, errand = null, {
  selectorDataValue = (value = "") => String(value ?? ""),
  itemName = (itemId = "") => itemId,
  stateInventory = {},
  npcName = (npcId = "") => npcId,
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  if (!row?.npc?.npc_id || !errand) return [];
  const selector = `button[data-town-life-errand="${selectorDataValue(row.npc.npc_id)}"]`;
  const haveText = `${errand.itemName || itemName(errand.itemId)} ${Number(stateInventory[errand.itemId] || 0)}/${Math.max(1, Number(errand.count || 1))}`;
  const rewardText = `${Number(errand.rewardGold || 0)} 灵石${errand.rewardFame ? ` / 声望 +${errand.rewardFame}` : ""}${errand.rewardFavor ? ` / 好感 +${errand.rewardFavor}` : ""}`;
  return [
    {
      key: "npc",
      label: "交给谁",
      badge: "人",
      title: errand.npcName || npcName(row.npc.npc_id),
      text: `${row.area || "凡仙镇"} · ${row.action || "今日动线"}`,
      detail: errand.request || `${errand.npcName || npcName(row.npc.npc_id)}正在等这件小托付。`,
      selector,
    },
    {
      key: "item",
      label: "带什么",
      badge: "物",
      title: haveText,
      text: errand.title || "今日小托付",
      detail: `背包已备齐 ${haveText}`,
      selector,
    },
    {
      key: "confirm",
      label: "确认入口",
      badge: "交",
      title: "关系面板确认",
      text: rewardText,
      detail: "只定位确认，不自动交付",
      selector,
    },
  ].map((node) => ({
    ...node,
    shortLabel: townLifeWorldBoardShortText(node.label, 6),
    shortTitle: townLifeWorldBoardShortText(node.title, 8),
    shortText: townLifeWorldBoardShortText(node.text, 14),
  }));
}

export function townLifeErrandDeliveryKeepsakeSpec(target = null, rows = [], canvasWidth = 960, canvasHeight = 640, {
  activeFocus = null,
  stateDay = 0,
  townLifeRows = () => [],
  canvasTownLifeFocusRow = () => null,
  townLifeErrandStatus = () => null,
  townLifeWorldPoint = () => null,
  townLifeErrandDeliveryKeepsakeNodes = () => [],
  itemName = (itemId = "") => itemId,
  stateInventory = {},
  npcName = (npcId = "") => npcId,
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  const npcId = target?.errand?.npcId || target?.row?.npc?.npc_id || target?.npcId || activeFocus?.npcId || "";
  if (!npcId) return null;
  const visibleRows = (rows || townLifeRows(6)).filter((entry) => entry.status.key !== "away").slice(0, 5);
  const row = target?.row
    || visibleRows.find((entry) => entry.npc.npc_id === npcId)
    || canvasTownLifeFocusRow(npcId)
    || null;
  if (!row?.npc?.npc_id) return null;
  const errand = target?.errand || townLifeErrandStatus(row);
  if (!errand || errand.completed || !errand.ready) return null;
  const rowIndex = visibleRows.findIndex((entry) => entry.npc.npc_id === row.npc.npc_id);
  const point = rowIndex >= 0 ? townLifeWorldPoint(visibleRows[rowIndex], rowIndex) : activeFocus?.point || null;
  const width = 318;
  const height = 152;
  const preferLeft = point ? point.x > canvasWidth * 0.58 : false;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, point ? point.x + (preferLeft ? -width - 26 : 70) : 386)),
    y: Math.max(84, Math.min(canvasHeight - height - 28, point ? point.y - 118 : 348)),
    width,
    height,
  };
  const nodes = townLifeErrandDeliveryKeepsakeNodes(row, errand);
  const nodeWidth = Math.floor((width - 52) / 3);
  nodes.forEach((node, index) => {
    node.rect = {
      x: rect.x + 16 + index * (nodeWidth + 10),
      y: rect.y + 98,
      width: nodeWidth,
      height: 34,
    };
  });
  const haveText = `${errand.itemName || itemName(errand.itemId)} ${Number(stateInventory[errand.itemId] || 0)}/${Math.max(1, Number(errand.count || 1))}`;
  const rewardText = `${Number(errand.rewardGold || 0)} 灵石${errand.rewardFame ? ` · 声望 +${errand.rewardFame}` : ""}${errand.rewardFavor ? ` · 好感 +${errand.rewardFavor}` : ""}`;
  return {
    key: `${stateDay}:${row.npc.npc_id}:${errand.key || errand.itemId}:errand_delivery_keepsake`,
    day: stateDay,
    npcId: row.npc.npc_id,
    row,
    errand,
    point,
    rect,
    nodes,
    activeNode: target?.activeNode || nodes.find((node) => node.key === activeFocus?.nodeKey) || nodes[2] || nodes[0],
    title: "小托付交付留签 · 可点",
    subtitle: `${errand.npcName || npcName(row.npc.npc_id)} · ${errand.title || "今日小托付"}`,
    haveText: townLifeWorldBoardShortText(haveText, 20),
    rewardText: townLifeWorldBoardShortText(rewardText, 24),
    requestText: townLifeWorldBoardShortText(errand.request || "这件小托付已经备齐，等待面板确认。", 25),
    safety: "只定位确认，不自动交付",
  };
}

export function townLifeErrandDeliveryKeepsakeAtCanvasPoint(px, py, {
  townLifeErrandDeliveryKeepsakeSpec = () => null,
  activeFocusDay = 0,
  stateDay = 0,
} = {}) {
  const spec = townLifeErrandDeliveryKeepsakeSpec();
  if (!spec?.rect || activeFocusDay !== stateDay) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[2] || spec.nodes[0];
  return { ...spec, activeNode };
}

export function townLifeShopMomentSafetyText() {
  return "这里只定位旧铺后话回看入口，不会自动打开后话页、播放对白、推进演出、写入完成标记或消耗资源。";
}

export function townLifeShopMomentKeepsakeNodes(entry = null, {
  selectorDataValue = (value = "") => String(value ?? ""),
  npcName = (npcId = "") => npcId,
  stateDay = 0,
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  if (!entry) return [];
  const selector = `button[data-town-shop-moment-npc="${selectorDataValue(entry.npcId)}"][data-town-shop-moment-id="${selectorDataValue(entry.id)}"]`;
  const itemLine = `${entry.itemName || "旧铺货"} x${Math.max(1, Number(entry.count || 1))}`;
  return [
    {
      key: "speaker",
      label: "谁说起",
      badge: "人",
      title: entry.npcName || npcName(entry.npcId),
      text: entry.area ? `${entry.area} · ${entry.title}` : entry.title,
      detail: entry.line || entry.summary || "这位镇民把旧铺的一笔来往记在心上。",
      selector,
    },
    {
      key: "trade",
      label: "哪笔来往",
      badge: "账",
      title: itemLine,
      text: entry.summary || `${entry.title}已经写入旧铺来往册。`,
      detail: entry.rewardText || entry.followup || `第 ${entry.day || stateDay} 天留下的旧铺后话。`,
      selector,
    },
    {
      key: "replay",
      label: "回看入口",
      badge: "翻",
      title: "关系面板回看",
      text: "定位旧铺来往册里的回看按钮。",
      detail: "只定位回看，不自动播放对白",
      selector,
    },
  ].map((node) => ({
    ...node,
    shortLabel: townLifeWorldBoardShortText(node.label, 6),
    shortTitle: townLifeWorldBoardShortText(node.title, 7),
    shortText: townLifeWorldBoardShortText(node.text, 14),
  }));
}

export function townLifeShopMomentKeepsakeTargetPoint(target = null, entry = null, rows = [], {
  townLifeRows = () => [],
  canvasTownLifeFocusRow = () => null,
  townLifeWorldPoint = () => null,
} = {}) {
  const visibleRows = (rows || townLifeRows(6)).filter((row) => row.status.key !== "away").slice(0, 5);
  const npcId = entry?.npcId || target?.moment?.npcId || target?.npcId || "";
  const row = target?.row
    || visibleRows.find((candidate) => candidate.npc.npc_id === npcId)
    || canvasTownLifeFocusRow(npcId)
    || null;
  if (!row?.npc?.npc_id) return { row: null, point: null };
  const index = visibleRows.findIndex((candidate) => candidate.npc.npc_id === row.npc.npc_id);
  return {
    row,
    point: townLifeWorldPoint(row, Math.max(0, index)),
  };
}

export function townLifeShopMomentKeepsakeSpec(target = null, rows = [], canvasWidth = 960, canvasHeight = 640, {
  activeFocus = null,
  stateDay = 0,
  townLifeShopMomentEntry = () => null,
  townLifeShopMomentKeepsakeTargetPoint = () => ({ row: null, point: null }),
  townLifeShopMomentKeepsakeNodes = () => [],
  npcName = (npcId = "") => npcId,
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  const moment = target?.moment || target || null;
  const npcId = moment?.npcId || target?.npcId || activeFocus?.npcId || "";
  const momentId = moment?.id || target?.momentId || activeFocus?.momentId || "";
  const entry = townLifeShopMomentEntry(npcId, momentId);
  if (!entry) return null;
  const targetPoint = townLifeShopMomentKeepsakeTargetPoint(target, entry, rows);
  const point = targetPoint.point || activeFocus?.point || null;
  const width = 316;
  const height = 150;
  const preferLeft = point ? point.x > canvasWidth * 0.58 : false;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, point ? point.x + (preferLeft ? -width - 26 : 68) : 392)),
    y: Math.max(76, Math.min(canvasHeight - height - 28, point ? point.y - 126 : 334)),
    width,
    height,
  };
  const nodes = townLifeShopMomentKeepsakeNodes(entry);
  const nodeWidth = Math.floor((width - 52) / 3);
  nodes.forEach((node, index) => {
    node.rect = {
      x: rect.x + 16 + index * (nodeWidth + 10),
      y: rect.y + 96,
      width: nodeWidth,
      height: 34,
    };
  });
  return {
    key: `${stateDay}:${entry.npcId}:${entry.id}:shop_moment_keepsake`,
    day: stateDay,
    npcId: entry.npcId,
    momentId: entry.id,
    npcName: entry.npcName || npcName(entry.npcId),
    row: targetPoint.row,
    point,
    rect,
    nodes,
    activeNode: target?.activeNode || nodes.find((node) => node.key === activeFocus?.nodeKey) || nodes[2] || nodes[0],
    source: activeFocus?.source || target?.source || "canvas",
    title: "旧铺后话留签 · 可点",
    subtitle: `${entry.npcName || npcName(entry.npcId)} · ${entry.title}`,
    shortSummary: townLifeWorldBoardShortText(entry.summary || entry.detail || "旧铺的一笔来往已经写进关系册。", 25),
    tradeLine: townLifeWorldBoardShortText(`${entry.itemName || "旧铺货"} x${Math.max(1, Number(entry.count || 1))}${entry.rewardText ? ` · ${entry.rewardText}` : ""}`, 22),
    safety: "只定位回看，不自动播放对白",
  };
}

export function townLifeShopMomentKeepsakeAtCanvasPoint(px, py, {
  townLifeShopMomentKeepsakeSpec = () => null,
  activeFocusDay = 0,
  stateDay = 0,
} = {}) {
  const spec = townLifeShopMomentKeepsakeSpec();
  if (!spec?.rect || activeFocusDay !== stateDay) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[2] || spec.nodes[0];
  return { ...spec, activeNode };
}
