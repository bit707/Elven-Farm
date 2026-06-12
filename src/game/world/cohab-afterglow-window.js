export function cohabMomentTitleWorld(moment = null, route = null) {
  if (moment?.eventName) return `${moment.routeName || route?.route_name || "同住生活"} · ${moment.eventName}`;
  if (route) return `${route.route_name || "同住生活"} · 已安家`;
  return "同住生活 · 家中有了新动静";
}

export function cohabMomentWindowTextWorld(life = null, {
  cohabMomentTitle = cohabMomentTitleWorld,
} = {}) {
  const latest = life?.latest || null;
  const buff = life?.activeBuff || null;
  if (latest && buff) return `${cohabMomentTitle(latest)}；余韵 ${buff.label} 至第 ${buff.expiresDay} 天。`;
  if (latest) return `${cohabMomentTitle(latest)}；下一件小事等关系卡继续亮起。`;
  if (buff) return `同住生活余韵 ${buff.label} 正在生效，持续到第 ${buff.expiresDay} 天。`;
  return "同住生活已经接入庭院，下一件小事会随日常、周常或节气慢慢出现。";
}

export function cohabActiveBuffSummaryWorld(cohabState = {}, {
  dataCohabById = new Map(),
  stateDay = 1,
  cohabBuffSpec = () => ({ label: "", value: 0 }),
} = {}) {
  return Object.entries(cohabState.activeBuffs || {})
    .map(([buffId, info]) => ({
      buffId,
      label: cohabBuffSpec(buffId).label,
      routeId: info.route || "",
      routeName: dataCohabById.get(info.route)?.route_name || "",
      expiresDay: Number(info.expiresDay || stateDay),
      value: Number(info.value || 0),
    }))
    .sort((a, b) => a.expiresDay - b.expiresDay)[0] || null;
}

export function cohabRouteLifeSnapshotWorld(routes = [], life = null, {
  cohabState = {},
  dataCohabById = new Map(),
  stateDay = 1,
  cohabBuffSpec = () => ({ label: "", value: 0 }),
  festivalEventFor = () => null,
  nextCohabEvent = () => null,
  cohabMomentTitle = cohabMomentTitleWorld,
  cohabMomentWindowText = cohabMomentWindowTextWorld,
} = {}) {
  const latest = life?.latest || (cohabState.history || [])[0] || null;
  const activeBuff = life?.activeBuff || cohabActiveBuffSummaryWorld(cohabState, {
    dataCohabById,
    stateDay,
    cohabBuffSpec,
  });
  const nextRoute = life?.nextRoute || routes.find((epilogue) => !latest || epilogue.epilogue_id !== latest.epilogueId) || routes[0] || null;
  const nextEvent = life?.nextEvent || (nextRoute ? festivalEventFor(nextRoute.epilogue_id) || nextCohabEvent(nextRoute.epilogue_id) : null);
  const latestRoute = latest?.epilogueId ? dataCohabById.get(latest.epilogueId) : nextRoute;
  const latestTitle = latest ? cohabMomentTitle(latest, latestRoute) : `${routes.map((epilogue) => epilogue.route_name).slice(0, 2).join(" / ") || "同住生活"} 已安家`;
  const nextTitle = nextEvent
    ? `${nextRoute?.route_name || "同住生活"} · ${nextEvent.event_name || nextEvent.scene_key || "日常"}`
    : "等下一次日夜流转";
  const buffTitle = activeBuff ? `${activeBuff.label} 至第 ${activeBuff.expiresDay} 天` : "暂无余韵，先把日常过成节奏";
  return {
    routeCount: routes.length,
    routeNames: routes.map((epilogue) => epilogue.route_name),
    latest,
    latestRoute,
    latestTitle,
    activeBuff,
    nextRoute,
    nextEvent,
    nextTitle,
    buffTitle,
    windowText: cohabMomentWindowText({ latest, activeBuff, nextRoute, nextEvent }),
  };
}

export function cohabLifeSummaryWorld(routes = [], {
  cohabState = {},
  dataCohabById = new Map(),
  stateDay = 1,
  cohabBuffSpec = () => ({ label: "", value: 0 }),
  festivalEventFor = () => null,
  nextCohabEvent = () => null,
  cohabRouteLifeSnapshot = cohabRouteLifeSnapshotWorld,
} = {}) {
  const latest = (cohabState.history || [])[0] || null;
  const activeBuff = cohabActiveBuffSummaryWorld(cohabState, {
    dataCohabById,
    stateDay,
    cohabBuffSpec,
  });
  const nextRoute = routes.find((epilogue) => !latest || epilogue.epilogue_id !== latest.epilogueId) || routes[0] || null;
  const nextEvent = nextRoute ? festivalEventFor(nextRoute.epilogue_id) || nextCohabEvent(nextRoute.epilogue_id) : null;
  const life = {
    routeCount: routes.length,
    routeNames: routes.map((epilogue) => epilogue.route_name),
    latest,
    activeBuff,
    nextRoute,
    nextEvent,
  };
  return {
    ...life,
    snapshot: cohabRouteLifeSnapshot(routes, life),
  };
}

export function cohabAfterglowWindowPaletteWorld(life = null) {
  const buffId = life?.activeBuff?.buffId || "";
  if (buffId === "buff_water_yield_up") return { accent: "#4d91a6", soft: "rgba(241, 249, 251, 0.94)", glow: "rgba(77, 145, 166, 0.2)", ink: "#17231d", badge: "水" };
  if (buffId === "buff_night_guard_up") return { accent: "#be4f37", soft: "rgba(255, 240, 232, 0.94)", glow: "rgba(190, 79, 55, 0.18)", ink: "#5b3928", badge: "灯" };
  if (buffId === "buff_trade_margin_up") return { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(224, 182, 109, 0.24)", ink: "#5b3928", badge: "商" };
  return { accent: "#286f58", soft: "rgba(237, 243, 223, 0.94)", glow: "rgba(40, 111, 88, 0.18)", ink: "#17231d", badge: "家" };
}

export function cohabAfterglowWindowSpecWorld(livingState = null, canvasWidth = 960, canvasHeight = 640, {
  stateDay = 1,
  dataCohabById = new Map(),
  cohabLifeSummary = () => null,
  cohabRouteLifeSnapshot = () => null,
  cohabUnlockedRoutes = () => [],
  cohabAfterglowWindowPalette = cohabAfterglowWindowPaletteWorld,
  townLifeWorldBoardShortText = (text = "") => String(text ?? ""),
  selectorDataValue = (value = "") => String(value ?? ""),
} = {}) {
  const life = livingState?.cohabLife || cohabLifeSummary();
  if (!life || life.routeCount <= 0) return null;
  const routes = cohabUnlockedRoutes();
  const snapshot = life.snapshot || cohabRouteLifeSnapshot(routes, life);
  const latest = life.latest || null;
  const buff = life.activeBuff || null;
  const nextRoute = life.nextRoute || (latest?.epilogueId ? dataCohabById.get(latest.epilogueId) : null) || routes[0] || null;
  const latestRoute = latest?.epilogueId ? dataCohabById.get(latest.epilogueId) : nextRoute;
  const buffRoute = buff?.routeId ? dataCohabById.get(buff.routeId) : nextRoute;
  const nextEvent = life.nextEvent || null;
  const palette = cohabAfterglowWindowPalette(life);
  const width = 270;
  const height = 142;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, 42)),
    y: Math.max(300, Math.min(canvasHeight - height - 18, 360)),
    width,
    height,
  };
  const nodeWidth = Math.floor((width - 44) / 3);
  const latestText = snapshot.latestTitle;
  const nextText = snapshot.nextTitle;
  const buffText = snapshot.buffTitle;
  const nodes = [
    {
      key: "latest",
      badge: "昨",
      label: "最近小事",
      title: latestText,
      text: latest ? `第 ${latest.day} 天留下「${latest.eventName}」。` : "家中已经有可发展的同住路线。",
      detail: latest?.rewardText || "日常对话",
      route: latestRoute,
    },
    {
      key: "next",
      badge: "明",
      label: "下一件小事",
      title: nextText,
      text: nextEvent ? "下一段同住日常、周常或节气小事已经在关系卡中排队。" : "暂时没有可预告事件，等入夜、节气或相关玩法触发。",
      detail: nextEvent?.note || nextEvent?.trigger_type || "自然流转",
      route: nextRoute,
    },
    {
      key: "buff",
      badge: "余",
      label: "余韵加成",
      title: buffText,
      text: buff ? "最近同住事件已经把生活余韵转成经营、种植或探索协作。" : "当前没有生效余韵，继续通过同住小事积累。",
      detail: buff ? `数值 ${Math.round(Number(buff.value || 0) * 100)}% / ${Math.max(0, Number(buff.expiresDay || stateDay) - stateDay + 1)} 天` : "无消耗回看",
      route: buffRoute,
    },
  ];
  nodes.forEach((node, index) => {
    node.rect = {
      x: rect.x + 14 + index * (nodeWidth + 8),
      y: rect.y + 100,
      width: nodeWidth,
      height: 28,
    };
    node.shortLabel = townLifeWorldBoardShortText(node.label, 6);
    node.shortTitle = townLifeWorldBoardShortText(node.title, 8);
    node.npcId = node.route?.npc_id || "";
    node.selector = node.npcId ? `[data-npc-id="${selectorDataValue(node.npcId)}"]` : ".relationship-panel";
  });
  return {
    key: `${stateDay}:cohab_afterglow:${latest?.epilogueId || nextRoute?.epilogue_id || "home"}:${latest?.eventName || "quiet"}:${buff?.buffId || "no_buff"}`,
    life,
    rect,
    nodes,
    palette,
    snapshot,
    latest,
    buff,
    nextRoute,
    nextEvent,
    routeCount: life.routeCount,
    headline: latestText,
    detail: latest ? `第 ${latest.day} 天 · ${latest.rewardText || snapshot.windowText || "日常对话"}` : snapshot.windowText || `今日院里多了 ${life.routeNames[0] || "熟悉的人"} 的动静`,
    safety: "这里只定位同住关系卡，不会自动播放同住日常、推进周常、触发节庆事件、赠礼、接支线、交托付或消耗资源。",
  };
}

export function cohabAfterglowWindowAtCanvasPointWorld(px, py, {
  cohabAfterglowWindowSpec = () => null,
} = {}) {
  const spec = cohabAfterglowWindowSpec();
  if (!spec?.rect) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[0];
  return { ...spec, activeNode };
}

export function focusCohabAfterglowWindowFromCanvasWorld(spec = null, {
  cohabAfterglowWindowSpec = () => null,
  canvasTownLifeFocusRow = () => null,
  stateDay = 1,
  npcName = (npcId = "") => npcId,
  queueStoryCompassFocusTarget = () => null,
  setCohabAfterglowWindowWorldFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const resolvedSpec = spec?.rect ? spec : cohabAfterglowWindowSpec();
  const node = resolvedSpec?.activeNode || resolvedSpec?.nodes?.[0];
  if (!resolvedSpec || !node) return false;
  setCohabAfterglowWindowWorldFocus({
    key: resolvedSpec.key,
    nodeKey: node.key,
    day: stateDay,
    npcId: node.npcId || "",
  });
  if (node.npcId) {
    const row = canvasTownLifeFocusRow(node.npcId);
    setCanvasTownLifeFocus({
      npcId: node.npcId,
      day: stateDay,
      area: row?.area || "家中",
      action: row?.action || "同住后日谈",
      source: "cohab_afterglow_window",
      point: null,
    });
  }
  queueStoryCompassFocusTarget({
    selector: node.selector || ".relationship-panel",
    fallbackSelector: ".relationship-panel",
    label: `点选同住后日谈窗灯：${node.label}`,
    log: `${node.route ? npcName(node.route.npc_id) : "同住后日谈"} · ${node.label}：${node.title}。${node.text} ${node.detail}。${resolvedSpec.safety}`,
    panelGroup: "systems",
    missingTitle: "点选同住后日谈窗灯",
    missingLog: `同住后日谈窗灯已经点到，但关系面板暂时没有找到对应卡片。先打开凡仙镇关系面板查看同住日常、周常和节气小事。${resolvedSpec.safety}`,
  });
  return true;
}
