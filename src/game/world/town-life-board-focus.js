function visibleTownLifeRows(townLifeRows = () => []) {
  return townLifeRows(6).filter((entry) => entry.status.key !== "away").slice(0, 5);
}

function townLifeFocusPointForNpc(npcId = "", fallbackPoint = null, {
  townLifeRows = () => [],
  townLifeWorldPoint = () => null,
} = {}) {
  const visibleRows = visibleTownLifeRows(townLifeRows);
  const pointIndex = visibleRows.findIndex((entry) => entry.npc.npc_id === npcId);
  return pointIndex >= 0 ? townLifeWorldPoint(visibleRows[pointIndex], pointIndex) : fallbackPoint;
}

export function townLifeRelationshipWorldBoardAtCanvasPointWorld(px, py, {
  townLifeRelationshipWorldBoardSpec = () => null,
} = {}) {
  const spec = townLifeRelationshipWorldBoardSpec();
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? spec
    : null;
}

export function focusTownLifeRelationshipWorldBoardFromCanvasWorld(spec = null, {
  townLifeRelationshipWorldBoardSpec = () => null,
  canvasTownLifeFocusRow = () => null,
  townLifeRows = () => [],
  townLifeWorldPoint = () => null,
  stateDay = 0,
  selectorDataValue = (value = "") => String(value ?? ""),
  queueStoryCompassFocusTarget = () => null,
  setCanvasTownLifeFocus = () => null,
  setRelationshipWorldBoardFocus = () => null,
} = {}) {
  const resolvedSpec = spec?.rect ? spec : townLifeRelationshipWorldBoardSpec();
  if (!resolvedSpec) return false;
  const row = resolvedSpec.row || canvasTownLifeFocusRow(resolvedSpec.npcId);
  if (resolvedSpec.npcId) {
    const point = townLifeFocusPointForNpc(resolvedSpec.npcId, resolvedSpec.point, {
      townLifeRows,
      townLifeWorldPoint,
    });
    setCanvasTownLifeFocus({
      npcId: resolvedSpec.npcId,
      day: stateDay,
      area: row?.area || resolvedSpec.area,
      action: row?.action || resolvedSpec.action,
      source: "relationship_board",
      point: point ? { x: Math.round(point.x), y: Math.round(point.y) } : null,
    });
  }
  setRelationshipWorldBoardFocus({
    key: resolvedSpec.key,
    day: stateDay,
    npcId: resolvedSpec.npcId,
    title: resolvedSpec.title,
    actionLabel: resolvedSpec.actionLabel,
  });
  queueStoryCompassFocusTarget({
    selector: resolvedSpec.npcId ? `[data-npc-id="${selectorDataValue(resolvedSpec.npcId)}"]` : ".town-life-opportunity-board",
    fallbackSelector: ".town-life-opportunity-board",
    label: "点选关系路标",
    log: resolvedSpec.npcId
      ? `${resolvedSpec.npcName} · ${resolvedSpec.title}：${resolvedSpec.detail} 已高亮关系卡；下一步建议 ${resolvedSpec.actionLabel}。`
      : `${resolvedSpec.title}：${resolvedSpec.detail} 已展开今日关系机会。`,
    panelGroup: "systems",
    missingTitle: "点选关系路标",
    missingLog: "关系路标已经判断出今日机会，但关系面板里暂时没有找到对应卡片。",
  });
  return true;
}

export function focusTownLifeRouteWorldBoardFromCanvasWorld(spec = null, {
  townLifeRouteWorldBoardSpec = () => null,
  canvasTownLifeFocusRow = () => null,
  townLifeRows = () => [],
  townLifeWorldPoint = () => null,
  stateDay = 0,
  selectorDataValue = (value = "") => String(value ?? ""),
  queueStoryCompassFocusTarget = () => null,
  queueTownLifeErrandRouteWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
  setRouteWorldBoardFocus = () => null,
} = {}) {
  const resolvedSpec = spec?.rect ? spec : townLifeRouteWorldBoardSpec();
  const entry = resolvedSpec?.activeEntry || resolvedSpec?.main || resolvedSpec?.entries?.[0];
  if (!entry?.npcId) return false;
  const row = entry.row || canvasTownLifeFocusRow(entry.npcId);
  const point = townLifeFocusPointForNpc(entry.npcId, entry.point, {
    townLifeRows,
    townLifeWorldPoint,
  });
  setCanvasTownLifeFocus({
    npcId: entry.npcId,
    day: stateDay,
    area: row?.area || entry.area,
    action: row?.action || entry.action,
    source: "town_life_route_board",
    point: point ? { x: Math.round(point.x), y: Math.round(point.y) } : null,
  });
  setRouteWorldBoardFocus({
    key: resolvedSpec.key,
    entryKey: entry.key,
    day: stateDay,
    npcId: entry.npcId,
    type: entry.type,
  });
  if (entry.type === "errand_route" && row && entry.errand && entry.route) {
    queueTownLifeErrandRouteWorldFocus(row, entry.errand, entry.route);
  }
  const shopLine = entry.type === "shop_moment" ? "旧铺后话在镇上，" : "";
  queueStoryCompassFocusTarget({
    selector: `[data-npc-id="${selectorDataValue(entry.npcId)}"]`,
    fallbackSelector: ".town-life-opportunity-board",
    label: "点选镇民动线牌",
    log: `${entry.npcName} · ${entry.title}：${shopLine}${entry.detail} 已高亮关系卡；这里只定位下一步，不会自动寒暄/交付/领奖。`,
    panelGroup: "systems",
    missingTitle: "点选镇民动线牌",
    missingLog: `${entry.npcName}的今日动线已经定位，但关系面板里暂时没有找到对应卡片。`,
  });
  return true;
}
