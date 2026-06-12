export function townLifeGreetingSafetyText() {
  return "这里只定位今日寒暄确认入口，不会自动寒暄、写入来往记录、增加好感、承接小托付或触发关系记忆。";
}

export function townLifeGreetingKeepsakeNodes(row = null, {
  selectorDataValue = (value = "") => String(value ?? ""),
  townLifeWeatherMomentSpec = () => null,
  townLifeGreetingLine = () => "",
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  if (!row?.npc?.npc_id) return [];
  const npcId = row.npc.npc_id;
  const selector = `button[data-canvas-town-greet="${selectorDataValue(npcId)}"], button[data-town-life-greet="${selectorDataValue(npcId)}"], button[data-town-opportunity-greet="${selectorDataValue(npcId)}"]`;
  const weatherMoment = row.weatherMoment || townLifeWeatherMomentSpec(row);
  return [
    {
      key: "place",
      label: "在哪遇见",
      badge: "地",
      title: row.area || "凡仙镇",
      text: `${row.action || "日常"} · ${row.status?.label || "今日动线"}`,
      detail: weatherMoment ? `${weatherMoment.label} · ${weatherMoment.prop}` : "镇民今日动线已在关系面板展开。",
      selector,
    },
    {
      key: "talk",
      label: "会聊什么",
      badge: "言",
      title: "今日近况",
      text: townLifeGreetingLine(row),
      detail: "寒暄后会写入今日来往，并可能带出小托付。",
      selector,
    },
    {
      key: "confirm",
      label: "确认入口",
      badge: "聊",
      title: "关系面板确认",
      text: "定位“打个招呼”按钮",
      detail: "只定位确认，不自动寒暄",
      selector,
    },
  ].map((node) => ({
    ...node,
    shortLabel: townLifeWorldBoardShortText(node.label, 6),
    shortTitle: townLifeWorldBoardShortText(node.title, 8),
    shortText: townLifeWorldBoardShortText(node.text, 14),
  }));
}

export function townLifeGreetingKeepsakeSpec(target = null, rows = [], canvasWidth = 960, canvasHeight = 640, {
  activeFocus = null,
  stateDay = 0,
  townLifeGreetingSeen = () => false,
  townLifeRows = () => [],
  canvasTownLifeFocusRow = () => null,
  townLifeWorldPoint = () => null,
  townLifeGreetingKeepsakeNodes = () => [],
  townLifeGreetingLine = () => "",
  townLifeWorldBoardShortText = (text = "") => text,
  npcName = (npcId = "") => npcId,
} = {}) {
  const npcId = target?.row?.npc?.npc_id || target?.npcId || activeFocus?.npcId || "";
  if (!npcId || townLifeGreetingSeen(npcId)) return null;
  const visibleRows = (rows || townLifeRows(6)).filter((entry) => entry.status.key !== "away").slice(0, 5);
  const row = target?.row
    || visibleRows.find((entry) => entry.npc.npc_id === npcId)
    || canvasTownLifeFocusRow(npcId)
    || null;
  if (!row?.npc?.npc_id || row.status?.key === "away") return null;
  const rowIndex = visibleRows.findIndex((entry) => entry.npc.npc_id === row.npc.npc_id);
  const point = rowIndex >= 0 ? townLifeWorldPoint(visibleRows[rowIndex], rowIndex) : activeFocus?.point || null;
  const width = 320;
  const height = 152;
  const preferLeft = point ? point.x > canvasWidth * 0.46 : false;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, point ? point.x + (preferLeft ? -width - 34 : 72) : 302)),
    y: Math.max(78, Math.min(canvasHeight - height - 28, point ? point.y - 154 : 286)),
    width,
    height,
  };
  const nodes = townLifeGreetingKeepsakeNodes(row);
  const nodeWidth = Math.floor((width - 52) / 3);
  nodes.forEach((node, index) => {
    node.rect = {
      x: rect.x + 16 + index * (nodeWidth + 10),
      y: rect.y + 98,
      width: nodeWidth,
      height: 34,
    };
  });
  const greetingLine = townLifeGreetingLine(row);
  return {
    key: `${stateDay}:${npcId}:greeting_keepsake:${row.area}:${row.status?.key || "daily"}`,
    day: stateDay,
    npcId,
    row,
    point,
    rect,
    nodes,
    activeNode: target?.activeNode || nodes.find((node) => node.key === activeFocus?.nodeKey) || nodes[2] || nodes[0],
    title: "今日寒暄留签 · 可点",
    subtitle: `${npcName(npcId)} · ${row.area || "凡仙镇"}`,
    lineText: townLifeWorldBoardShortText(greetingLine, 25),
    routeText: townLifeWorldBoardShortText(`${row.action || "日常"} · ${row.status?.label || "今日动线"}`, 22),
    safety: "只定位确认，不自动寒暄",
    tone: row.status?.key || "daily",
  };
}

export function townLifeGreetingKeepsakeAtCanvasPoint(px, py, {
  townLifeGreetingKeepsakeSpec = () => null,
  activeFocusDay = 0,
  stateDay = 0,
} = {}) {
  const spec = townLifeGreetingKeepsakeSpec();
  if (!spec?.rect || activeFocusDay !== stateDay) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[2] || spec.nodes[0];
  return { ...spec, activeNode };
}

export function townLifeGiftSafetyText() {
  return "这里只定位今日赠礼确认入口，不会自动赠礼、扣除物品、增加好感或写入赠礼记录。";
}

export function townLifeGiftKeepsakeNodes(row = null, gift = null, {
  selectorDataValue = (value = "") => String(value ?? ""),
  npcName = (npcId = "") => npcId,
  favorLevel = (value = 0) => value,
  stateNpcFavor = {},
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  if (!row?.npc?.npc_id || !gift) return [];
  const npcId = row.npc.npc_id;
  const selector = `button[data-canvas-town-gift="${selectorDataValue(npcId)}"], button[data-npc-gift="${selectorDataValue(npcId)}"], button[data-town-opportunity-gift="${selectorDataValue(npcId)}"]`;
  return [
    {
      key: "npc",
      label: "送给谁",
      badge: "人",
      title: npcName(npcId),
      text: `${row.area || "凡仙镇"} · ${row.action || "今日动线"}`,
      detail: `好感 Lv.${row.level ?? favorLevel(stateNpcFavor[npcId] || 0)} · 今日还没收礼`,
      selector,
    },
    {
      key: "gift",
      label: "送什么",
      badge: "礼",
      title: gift.itemName,
      text: gift.reason || "普通心意，胜在顺手",
      detail: `好感 +${gift.favorGain} · ${gift.tone === "liked" ? "合偏好" : gift.tone === "bad" ? "有忌口" : "顺手礼"}`,
      selector,
    },
    {
      key: "confirm",
      label: "确认入口",
      badge: "送",
      title: "关系面板确认",
      text: `赠出 ${gift.itemName}`,
      detail: "只定位确认，不自动赠礼",
      selector,
    },
  ].map((node) => ({
    ...node,
    shortLabel: townLifeWorldBoardShortText(node.label, 6),
    shortTitle: townLifeWorldBoardShortText(node.title, 8),
    shortText: townLifeWorldBoardShortText(node.text, 14),
  }));
}

export function townLifeGiftKeepsakeSpec(target = null, rows = [], canvasWidth = 960, canvasHeight = 640, {
  activeFocus = null,
  stateDay = 0,
  townLifeGiftSeen = () => false,
  townLifeRows = () => [],
  canvasTownLifeFocusRow = () => null,
  recommendedNpcGift = () => null,
  townLifeWorldPoint = () => null,
  townLifeGiftKeepsakeNodes = () => [],
  townLifeWorldBoardShortText = (text = "") => text,
  npcName = (npcId = "") => npcId,
} = {}) {
  const npcId = target?.gift?.npcId || target?.row?.npc?.npc_id || target?.npcId || activeFocus?.npcId || "";
  if (!npcId || townLifeGiftSeen(npcId)) return null;
  const visibleRows = (rows || townLifeRows(6)).filter((entry) => entry.status.key !== "away").slice(0, 5);
  const row = target?.row
    || visibleRows.find((entry) => entry.npc.npc_id === npcId)
    || canvasTownLifeFocusRow(npcId)
    || null;
  if (!row?.npc?.npc_id) return null;
  const gift = target?.gift || recommendedNpcGift(npcId);
  if (!gift) return null;
  const rowIndex = visibleRows.findIndex((entry) => entry.npc.npc_id === row.npc.npc_id);
  const point = rowIndex >= 0 ? townLifeWorldPoint(visibleRows[rowIndex], rowIndex) : activeFocus?.point || null;
  const width = 318;
  const height = 152;
  const preferLeft = point ? point.x > canvasWidth * 0.58 : false;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, point ? point.x + (preferLeft ? -width - 28 : 70) : 354)),
    y: Math.max(84, Math.min(canvasHeight - height - 28, point ? point.y + 54 : 322)),
    width,
    height,
  };
  const nodes = townLifeGiftKeepsakeNodes(row, gift);
  const nodeWidth = Math.floor((width - 52) / 3);
  nodes.forEach((node, index) => {
    node.rect = {
      x: rect.x + 16 + index * (nodeWidth + 10),
      y: rect.y + 98,
      width: nodeWidth,
      height: 34,
    };
  });
  return {
    key: `${stateDay}:${npcId}:${gift.itemId}:gift_keepsake`,
    day: stateDay,
    npcId,
    row,
    gift: { ...gift, npcId },
    point,
    rect,
    nodes,
    activeNode: target?.activeNode || nodes.find((node) => node.key === activeFocus?.nodeKey) || nodes[2] || nodes[0],
    title: "今日赠礼留签 · 可点",
    subtitle: `${npcName(npcId)} · ${gift.itemName}`,
    giftLine: townLifeWorldBoardShortText(`${gift.itemName} · 好感 +${gift.favorGain}`, 22),
    reasonText: townLifeWorldBoardShortText(gift.reason || "普通心意，胜在顺手", 25),
    safety: "只定位确认，不自动赠礼",
    tone: gift.tone || "plain",
  };
}

export function townLifeGiftKeepsakeAtCanvasPoint(px, py, {
  townLifeGiftKeepsakeSpec = () => null,
  activeFocusDay = 0,
  stateDay = 0,
} = {}) {
  const spec = townLifeGiftKeepsakeSpec();
  if (!spec?.rect || activeFocusDay !== stateDay) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[2] || spec.nodes[0];
  return { ...spec, activeNode };
}
