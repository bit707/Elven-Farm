export function focusTownLifeGreetingKeepsakeFromCanvasWorld(target = null, options = {}, {
  townLifeGreetingKeepsakeSpec = () => null,
  townLifeRows = () => [],
  npcName = (npcId = "") => npcId,
  townLifeGreetingSafetyText = () => "",
  addLog = () => null,
  renderLogs = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  stateDay = 0,
  queueStoryCompassFocusTarget = () => null,
  setGreetingWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const npcId = target?.npcId || target?.row?.npc?.npc_id || "";
  const spec = townLifeGreetingKeepsakeSpec(target, townLifeRows(6));
  if (!spec?.npcId) {
    addLog("今日寒暄留签", `${npcId ? npcName(npcId) : "这位镇民"}今天暂时没有可定位的寒暄入口。${townLifeGreetingSafetyText()}`);
    return renderLogs();
  }
  const activeNode = target?.activeNode
    || spec.nodes.find((node) => node.key === options.nodeKey)
    || spec.nodes[2]
    || spec.nodes[0];
  setGreetingWorldFocus({
    key: spec.key,
    nodeKey: activeNode?.key || "confirm",
    day: stateDay,
    npcId: spec.npcId,
    point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
    source: options.source || "canvas",
  });
  setCanvasTownLifeFocus({
    npcId: spec.npcId,
    day: stateDay,
    area: spec.row?.area || "凡仙镇",
    action: spec.row?.action || "今日寒暄",
    source: "town_life_greeting_keepsake",
    point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
  });
  queueStoryCompassFocusTarget({
    selector: activeNode?.selector || `button[data-canvas-town-greet="${selectorDataValue(spec.npcId)}"], button[data-town-life-greet="${selectorDataValue(spec.npcId)}"]`,
    fallbackSelector: "#relationshipPanel",
    label: options.source === "keepsake" ? `点选今日寒暄留签：${activeNode?.label || "确认入口"}` : "今日寒暄留签",
    log: `${npcName(spec.npcId)} · ${activeNode?.label || "确认入口"}：${activeNode?.title || spec.row.area}。${activeNode?.text || spec.lineText} ${activeNode?.detail || ""}。${townLifeGreetingSafetyText()}`,
    panelGroup: "systems",
    missingTitle: "今日寒暄留签",
    missingLog: `${npcName(spec.npcId)}的寒暄按钮暂时没有找到，先打开关系面板查看今日动线。${townLifeGreetingSafetyText()}`,
  });
  return true;
}

export function focusTownLifeGiftKeepsakeFromCanvasWorld(target = null, options = {}, {
  townLifeGiftKeepsakeSpec = () => null,
  townLifeRows = () => [],
  npcName = (npcId = "") => npcId,
  townLifeGiftSafetyText = () => "",
  addLog = () => null,
  renderLogs = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  stateDay = 0,
  queueStoryCompassFocusTarget = () => null,
  setGiftWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const npcId = target?.npcId || target?.row?.npc?.npc_id || "";
  const spec = townLifeGiftKeepsakeSpec(target, townLifeRows(6));
  if (!spec?.gift || !spec.npcId) {
    addLog("今日赠礼留签", `${npcId ? npcName(npcId) : "这位镇民"}今天暂无可定位的推荐赠礼。${townLifeGiftSafetyText()}`);
    return renderLogs();
  }
  const activeNode = target?.activeNode
    || spec.nodes.find((node) => node.key === options.nodeKey)
    || spec.nodes[2]
    || spec.nodes[0];
  setGiftWorldFocus({
    key: spec.key,
    nodeKey: activeNode?.key || "confirm",
    day: stateDay,
    npcId: spec.npcId,
    giftItemId: spec.gift.itemId,
    point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
    source: options.source || "canvas",
  });
  setCanvasTownLifeFocus({
    npcId: spec.npcId,
    day: stateDay,
    area: spec.row?.area || "凡仙镇",
    action: spec.row?.action || "今日赠礼",
    source: "town_life_gift_keepsake",
    point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
  });
  queueStoryCompassFocusTarget({
    selector: activeNode?.selector || `button[data-canvas-town-gift="${selectorDataValue(spec.npcId)}"], button[data-npc-gift="${selectorDataValue(spec.npcId)}"]`,
    fallbackSelector: "#relationshipPanel",
    label: options.source === "keepsake" ? `点选今日赠礼留签：${activeNode?.label || "确认入口"}` : "今日赠礼留签",
    log: `${npcName(spec.npcId)} · ${activeNode?.label || "确认入口"}：${activeNode?.title || spec.gift.itemName}。${activeNode?.text || spec.gift.reason} ${activeNode?.detail || ""}。${townLifeGiftSafetyText()}`,
    panelGroup: "systems",
    missingTitle: "今日赠礼留签",
    missingLog: `${npcName(spec.npcId)}的赠礼按钮暂时没有找到，先打开关系面板查看推荐赠礼。${townLifeGiftSafetyText()}`,
  });
  return true;
}

export function focusTownLifeErrandDeliveryConfirmWorld(npcId = "", options = {}, {
  townLifeRows = () => [],
  townLifeErrandStatus = () => null,
  npcName = (npcIdValue = "") => npcIdValue,
  townLifeErrandDeliverySafetyText = () => "",
  addLog = () => null,
  renderLogs = () => null,
  townLifeErrandRouteSpec = () => null,
  queueTownLifeErrandRouteWorldFocus = () => null,
  townLifeErrandDeliveryKeepsakeSpec = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  stateDay = 0,
  stateInventory = {},
  queueStoryCompassFocusTarget = () => null,
  setErrandDeliveryWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const row = townLifeRows(12).find((entry) => entry.npc.npc_id === npcId);
  if (!row) {
    addLog("小托付交付留签", `今天没在镇上找到这位镇民。${townLifeErrandDeliverySafetyText()}`);
    return renderLogs();
  }
  const errand = townLifeErrandStatus(row);
  if (!errand) {
    addLog("小托付交付留签", `${npcName(npcId)}今天暂时没有可交的小托付。${townLifeErrandDeliverySafetyText()}`);
    return renderLogs();
  }
  if (errand.completed) {
    addLog("小托付交付留签", `${errand.title} 今天已经办妥了。${townLifeErrandDeliverySafetyText()}`);
    return renderLogs();
  }
  const route = townLifeErrandRouteSpec(errand);
  if (route) queueTownLifeErrandRouteWorldFocus(row, errand, route);
  const spec = errand.ready ? townLifeErrandDeliveryKeepsakeSpec({ row, errand }, townLifeRows(6)) : null;
  const activeNode = spec?.nodes?.find((node) => node.key === options.nodeKey)
    || spec?.nodes?.[2]
    || spec?.nodes?.[0]
    || null;
  if (spec?.rect) {
    setErrandDeliveryWorldFocus({
      key: spec.key,
      nodeKey: activeNode?.key || "confirm",
      day: stateDay,
      npcId: row.npc.npc_id,
      errandKey: errand.key || errand.itemId,
      point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
      source: options.source || "canvas",
    });
    setCanvasTownLifeFocus({
      npcId: row.npc.npc_id,
      day: stateDay,
      area: row.area || "凡仙镇",
      action: row.action || "小托付",
      source: "town_life_errand_delivery_keepsake",
      point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
    });
  }
  const haveText = `${errand.itemName} ${Number(stateInventory[errand.itemId] || 0)}/${errand.count}`;
  const rewardText = `回礼 ${errand.rewardGold} 灵石${errand.rewardFame ? ` / 声望 +${errand.rewardFame}` : ""}${errand.rewardFavor ? ` / 好感 +${errand.rewardFavor}` : ""}`;
  const readyText = errand.ready ? "材料已经备齐，请在关系面板点明确按钮交付。" : "材料还没备齐，先看备货路线。";
  queueStoryCompassFocusTarget({
    selector: activeNode?.selector || `button[data-town-life-errand="${selectorDataValue(npcId)}"]`,
    fallbackSelector: "#relationshipPanel",
    label: options.source === "plaque" ? "点选小托付交付牌" : options.source === "keepsake" ? `点选小托付交付留签：${activeNode?.label || "确认入口"}` : "小托付交付留签",
    log: `${errand.npcName} · ${activeNode?.label || "确认入口"}：${activeNode?.title || errand.title}。${activeNode?.text || haveText} ${activeNode?.detail || readyText}。${rewardText}。${townLifeErrandDeliverySafetyText()}`,
    panelGroup: "story",
    missingTitle: "小托付交付留签",
    missingLog: `${errand.npcName}的小托付按钮暂时没有找到，先打开关系面板查看凡仙镇今日动线。${townLifeErrandDeliverySafetyText()}`,
  });
  return true;
}

export function focusTownLifeShopMomentFromCanvasWorld(target = null, options = {}, {
  townLifeShopMomentEntry = () => null,
  townLifeShopMomentSafetyText = () => "",
  addLog = () => null,
  renderLogs = () => null,
  townLifeShopMomentKeepsakeSpec = () => null,
  townLifeRows = () => [],
  canvasTownLifeFocusRow = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  stateDay = 0,
  queueStoryCompassFocusTarget = () => null,
  setShopMomentWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const moment = target?.moment || target || null;
  const npcId = moment?.npcId || target?.npcId || "";
  const momentId = moment?.id || target?.momentId || "";
  const entry = townLifeShopMomentEntry(npcId, momentId);
  if (!entry) {
    addLog("旧铺后话留签", `这页旧铺后话还没有写进来往册。${townLifeShopMomentSafetyText()}`);
    return renderLogs();
  }
  const spec = townLifeShopMomentKeepsakeSpec({ ...target, moment: entry }, townLifeRows(6));
  const activeNode = target?.activeNode
    || spec?.nodes?.find((node) => node.key === options.nodeKey)
    || spec?.nodes?.[2]
    || spec?.nodes?.[0]
    || null;
  setShopMomentWorldFocus({
    key: spec?.key || `${stateDay}:${entry.npcId}:${entry.id}:shop_moment_keepsake`,
    nodeKey: activeNode?.key || "replay",
    day: stateDay,
    npcId: entry.npcId,
    momentId: entry.id,
    source: options.source || "canvas",
    point: spec?.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
  });
  const focusRow = spec?.row || target?.row || canvasTownLifeFocusRow(entry.npcId);
  if (focusRow?.npc?.npc_id) {
    setCanvasTownLifeFocus({
      npcId: entry.npcId,
      day: stateDay,
      area: focusRow.area || entry.area || "凡仙镇",
      action: focusRow.action || "旧铺后话",
      source: "town_life_shop_moment_keepsake",
      point: spec?.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
    });
  }
  const selector = `button[data-town-shop-moment-npc="${selectorDataValue(entry.npcId)}"][data-town-shop-moment-id="${selectorDataValue(entry.id)}"]`;
  queueStoryCompassFocusTarget({
    selector: activeNode?.selector || selector,
    fallbackSelector: "#relationshipPanel",
    label: options.source === "marker" ? "点选旧铺后话签" : options.source === "waterway" ? "点选水路小簿" : options.source === "keepsake" ? `点选旧铺后话留签：${activeNode?.label || "回看入口"}` : "点选旧铺后话留签",
    log: `${entry.npcName} · ${activeNode?.label || "回看入口"}：${activeNode?.title || entry.title}。${activeNode?.text || entry.summary} ${activeNode?.detail || ""}。${townLifeShopMomentSafetyText()}`,
    panelGroup: "story",
    missingTitle: "旧铺后话留签",
    missingLog: `${entry.npcName}的旧铺后话按钮暂时没有找到，先打开关系面板查看来往册。${townLifeShopMomentSafetyText()}`,
  });
  return true;
}

export function focusTownLifePassalongLanternFromCanvasWorld(target = null, options = {}, {
  townLifePassalongLanternSpec = () => null,
  townLifeRows = () => [],
  townLifePassalongSafetyText = () => "",
  addLog = () => null,
  renderLogs = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  stateDay = 0,
  npcName = (npcId = "") => npcId,
  queueStoryCompassFocusTarget = () => null,
  setPassalongWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const spec = townLifePassalongLanternSpec(target, townLifeRows(6));
  if (!spec?.npcId || !spec.passalong) {
    addLog("镇民顺路捎话灯", `今天暂时没有可定位的镇上传话。${townLifePassalongSafetyText()}`);
    return renderLogs();
  }
  const activeNode = target?.activeNode
    || spec.nodes.find((node) => node.key === options.nodeKey)
    || spec.nodes[2]
    || spec.nodes[0];
  setPassalongWorldFocus({
    key: spec.key,
    nodeKey: activeNode?.key || "where",
    day: stateDay,
    npcId: spec.npcId,
    type: spec.passalong.type,
    source: options.source || "canvas",
    point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
  });
  setCanvasTownLifeFocus({
    npcId: spec.npcId,
    day: stateDay,
    area: spec.row?.area || "凡仙镇",
    action: spec.row?.action || "镇上传话",
    source: "town_life_passalong_lantern",
    point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
  });
  queueStoryCompassFocusTarget({
    selector: activeNode?.selector || spec.passalong.selector || `[data-npc-id="${selectorDataValue(spec.npcId)}"]`,
    fallbackSelector: activeNode?.fallbackSelector || spec.passalong.fallbackSelector || "#relationshipPanel",
    label: options.source === "marker" ? "点选镇民顺路捎话灯" : `点选镇民顺路捎话灯：${activeNode?.label || "回看入口"}`,
    log: `${npcName(spec.npcId)} · ${activeNode?.label || "回看入口"}：${activeNode?.title || spec.passalong.title}。${activeNode?.text || spec.passalong.line} ${activeNode?.detail || ""}。${townLifePassalongSafetyText()}`,
    panelGroup: activeNode?.panelGroup || spec.passalong.panelGroup || "core",
    missingTitle: "镇民顺路捎话灯",
    missingLog: `${npcName(spec.npcId)}的传话来源暂时没有找到，先打开关系面板或目标册回看。${townLifePassalongSafetyText()}`,
  });
  return true;
}

export function focusTownLifeMemoryKeepsakeFromCanvasWorld(spec = null, {
  stateDay = 0,
  canvasTownLifeFocusRow = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  queueStoryCompassFocusTarget = () => null,
  setMemoryKeepsakeWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const node = spec?.activeNode || spec?.nodes?.[0];
  if (!spec?.npcId || !node) return false;
  setMemoryKeepsakeWorldFocus({
    key: spec.key,
    nodeKey: node.key,
    day: stateDay,
    npcId: spec.npcId,
  });
  const row = spec.row || canvasTownLifeFocusRow(spec.npcId);
  setCanvasTownLifeFocus({
    npcId: spec.npcId,
    day: stateDay,
    area: row?.area || "凡仙镇",
    action: row?.action || "关系册",
    source: "town_life_memory_keepsake",
    point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
  });
  queueStoryCompassFocusTarget({
    selector: node.selector || `[data-npc-id="${selectorDataValue(spec.npcId)}"]`,
    fallbackSelector: ".relationship-panel",
    label: `点选镇民关系心签：${node.label}`,
    log: `${spec.npcName} · ${node.label}：${node.title}。${node.text} ${node.detail}。${spec.safety}`,
    panelGroup: "systems",
    missingTitle: "点选镇民关系心签",
    missingLog: `${spec.npcName} 的关系册暂时没有找到，先打开凡仙镇关系面板回看最近记忆、下一段记忆和终章伏笔。${spec.safety}`,
  });
  return true;
}

export function focusTownLifeMemoryNewPageFromCanvasWorld(spec = null, {
  stateDay = 0,
  canvasTownLifeFocusRow = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  queueStoryCompassFocusTarget = () => null,
  setMemoryNewPageWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const node = spec?.activeNode || spec?.nodes?.[1] || spec?.nodes?.[0];
  if (!spec?.npcId || !node) return false;
  setMemoryNewPageWorldFocus({
    key: spec.key,
    nodeKey: node.key,
    day: stateDay,
    npcId: spec.npcId,
    memoryId: spec.memoryId,
    source: "canvas",
    createdAt: Date.now(),
  });
  const row = spec.row || canvasTownLifeFocusRow(spec.npcId);
  setCanvasTownLifeFocus({
    npcId: spec.npcId,
    day: stateDay,
    area: row?.area || "凡仙镇",
    action: row?.action || "关系记忆新页",
    source: "town_life_memory_new_page",
    point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
  });
  queueStoryCompassFocusTarget({
    selector: node.selector || `[data-npc-id="${selectorDataValue(spec.npcId)}"]`,
    fallbackSelector: "#relationshipPanel",
    label: `点选关系记忆新页：${node.label}`,
    log: `${spec.npcName} · ${node.label}：${node.title}。${node.text} ${node.detail}。${spec.safety}`,
    panelGroup: "systems",
    missingTitle: "关系记忆新页",
    missingLog: `${spec.npcName} 的关系记忆入口暂时没有找到，先打开凡仙镇关系面板回看这页新记忆。${spec.safety}`,
  });
  return true;
}

export function focusTownLifeMemoryThresholdKeepsakeFromCanvasWorld(spec = null, {
  stateDay = 0,
  canvasTownLifeFocusRow = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  townLifeMemoryThresholdSafetyText = () => "",
  queueStoryCompassFocusTarget = () => null,
  setMemoryThresholdWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const node = spec?.activeNode || spec?.nodes?.[2] || spec?.nodes?.[0];
  if (!spec?.npcId || !node) return false;
  setMemoryThresholdWorldFocus({
    key: spec.key,
    nodeKey: node.key,
    day: stateDay,
    npcId: spec.npcId,
  });
  const row = spec.row || canvasTownLifeFocusRow(spec.npcId);
  setCanvasTownLifeFocus({
    npcId: spec.npcId,
    day: stateDay,
    area: row?.area || "凡仙镇",
    action: row?.action || "关系记忆临门",
    source: "town_life_memory_threshold",
    point: spec.point ? { x: Math.round(spec.point.x), y: Math.round(spec.point.y) } : null,
  });
  queueStoryCompassFocusTarget({
    selector: node.selector || `[data-npc-id="${selectorDataValue(spec.npcId)}"]`,
    fallbackSelector: "#relationshipPanel",
    label: `点选关系记忆临门签：${node.label}`,
    log: `${spec.npcName} · ${node.label}：${node.title}。${node.text} ${node.detail}。${townLifeMemoryThresholdSafetyText()}`,
    panelGroup: "systems",
    missingTitle: "关系记忆临门签",
    missingLog: `${spec.npcName} 的关系行动按钮暂时没有找到，先打开凡仙镇关系面板确认下一段记忆进度。${townLifeMemoryThresholdSafetyText()}`,
  });
  return true;
}
