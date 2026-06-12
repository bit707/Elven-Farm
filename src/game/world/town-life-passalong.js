export function townLifePassalongSafetyText() {
  return "这里只定位镇上传话来源和回看入口，不会自动寒暄、赠礼、接支线、交托付、交单、开铺、领奖、播放对白或消耗资源。";
}

export function townLifePassalongCandidateForRow(row = null, {
  npcName = (npcId = "") => npcId,
  syncShopOpeningState = () => ({ lastSession: null }),
  shopReputationTownBarkSpec = () => null,
  careChainEchoSpec = () => null,
  stateCareChainState = null,
  townLifeWeatherMomentSpec = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  shopReputationStageSpec = () => ({ stageKey: "", progressCount: 0 }),
  stateCompleted = new Set(),
  stateCanalRepaired = false,
  stateClearedDebris = 0,
} = {}) {
  if (!row?.npc?.npc_id || row.status?.key === "away") return null;
  const npcId = row.npc.npc_id;
  const npcLabel = npcName(npcId);
  const opening = syncShopOpeningState();
  const reputation = row.shopReputationBark || shopReputationTownBarkSpec(row);
  const careEcho = row.careChainBark || careChainEchoSpec(stateCareChainState, row);
  const weatherMoment = row.weatherMoment || townLifeWeatherMomentSpec(row);
  const firstSale = opening.firstSale || opening.lastSession?.firstSale || null;
  const candidates = [];
  if (reputation) {
    const reputationStage = shopReputationStageSpec();
    candidates.push({
      id: `shop:${reputation.stageName || "stage"}:${npcId}`,
      type: "shop_reputation",
      tone: reputation.tone || "shop",
      badge: "铺",
      title: "旧铺名声顺路传开",
      headline: reputation.label || reputation.stageName || "镇上传话",
      line: reputation.line,
      detail: reputation.detail,
      sourceLabel: reputation.stageName || "旧铺名声",
      routeLabel: "看旧铺名声",
      selector: `[data-shop-reputation-stage="${selectorDataValue(reputationStage.stageKey)}"]`,
      fallbackSelector: "#shopReport",
      panelGroup: "core",
      priority: 136 + Number(reputationStage.progressCount || 0),
    });
  }
  if (firstSale && (opening.summaryUnlocked || stateCompleted.has("shop") || stateCompleted.has("first_shop_sale_summary"))) {
    candidates.push({
      id: `first_sale:${firstSale.itemId || firstSale.itemName || "goods"}:${npcId}`,
      type: "first_sale_seen",
      tone: "warm",
      badge: "账",
      title: "首单被镇上看见",
      headline: `${firstSale.itemName || "第一件货"}有了第一句后话`,
      line: `${npcLabel}顺路听见有人提起旧铺首单：${firstSale.name || "第一位顾客"}买走${firstSale.itemName || "一件货"}，这扇门开始被记住了。`,
      detail: `成交原因：${firstSale.reasonText || firstSale.reviewQuote || "货、价和今日客需对上了。"} 这会把旧铺从一次买卖推向熟客苗头。`,
      sourceLabel: "旧铺首单",
      routeLabel: "看首单账页",
      selector: "[data-shop-board=\"opening\"]",
      fallbackSelector: "#shopReport",
      panelGroup: "core",
      priority: 122,
    });
  }
  if (careEcho) {
    candidates.push({
      id: `care:${careEcho.tone || "chain"}:${npcId}`,
      type: "care_chain",
      tone: careEcho.tone || "care",
      badge: "生",
      title: "洞天生机传到镇上",
      headline: careEcho.title || careEcho.stageName || "照应成线",
      line: careEcho.townLine || `${npcLabel}听见洞天这几日有人照应，顺手把这句好话带回镇上。`,
      detail: `${careEcho.detail || "连续照应让镇民开始把洞天当成稳定日常。"}${careEcho.streak ? ` · 连续照应 ${careEcho.streak} 日` : ""}`,
      sourceLabel: careEcho.stageName || "洞天照应札记",
      routeLabel: "看照应札记",
      selector: ".care-chain-journal",
      fallbackSelector: "#goalBookPanel",
      panelGroup: "core",
      priority: 118 + Number(careEcho.streak || 0),
    });
  }
  if (stateCanalRepaired || stateCompleted.has("repair")) {
    candidates.push({
      id: `canal:${npcId}`,
      type: "canal_repaired",
      tone: "water",
      badge: "渠",
      title: "灵渠复流传进镇口",
      headline: "水路重新有了声音",
      line: `${npcLabel}经过镇口时说，洞天那边的水声已经能听见了，断掉的路像是重新接回凡仙镇。`,
      detail: `${weatherMoment?.label ? `${weatherMoment.label}里，` : ""}灵渠复流让水田、料理和镇上小托付都多了一条能被看见的来路。`,
      sourceLabel: "灵渠修复",
      routeLabel: "看修复路线",
      selector: "#missionPanel",
      fallbackSelector: "#goalBookPanel",
      panelGroup: "core",
      priority: 110,
    });
  }
  if ((stateCompleted.has("clear") || Number(stateClearedDebris || 0) > 0) && !stateCompleted.has("shop")) {
    candidates.push({
      id: `clear:${npcId}`,
      type: "grotto_clear",
      tone: "sprout",
      badge: "露",
      title: "清荒露纹被人看见",
      headline: "第一口气传到镇上",
      line: `${npcLabel}顺路看见洞天露纹亮了一下，说那块荒地终于不像被人忘在山里。`,
      detail: "清荒后的露纹不只是特效，它把修复目标提前变成镇民能看见的一点变化。",
      sourceLabel: "开场清荒",
      routeLabel: "看复苏总览",
      selector: "#missionPanel",
      fallbackSelector: "#goalBookPanel",
      panelGroup: "core",
      priority: 96,
    });
  }
  return candidates
    .filter((candidate) => candidate.line)
    .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0))[0] || null;
}

export function townLifePassalongRows(rowsInput = null, limit = 3, {
  townLifeRows = () => [],
  townLifePassalongCandidateForRow = () => null,
  townLifeWorldPoint = () => null,
} = {}) {
  const rows = (rowsInput || townLifeRows(6))
    .filter((row) => row.status.key !== "away")
    .slice(0, 5);
  return rows
    .map((row, index) => {
      const passalong = townLifePassalongCandidateForRow(row);
      if (!passalong) return null;
      return {
        row,
        index,
        point: townLifeWorldPoint(row, index),
        passalong,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.passalong.priority || 0) - Number(a.passalong.priority || 0))
    .slice(0, limit);
}

export function townLifePassalongLanternSpec(target = null, rows = [], canvasWidth = 960, canvasHeight = 640, {
  activeFocus = null,
  stateDay = 0,
  townLifePassalongRows = () => [],
  townLifeWorldPoint = () => null,
  townLifeWorldBoardShortText = (text = "") => text,
  npcName = (npcId = "") => npcId,
  selectorDataValue = (value = "") => String(value ?? ""),
} = {}) {
  const passalongRows = townLifePassalongRows(rows, 3);
  const picked = target?.row && target?.passalong
    ? { row: target.row, index: target.index || 0, point: target.point || townLifeWorldPoint(target.row, target.index || 0), passalong: target.passalong }
    : activeFocus?.npcId
      ? passalongRows.find((entry) => entry.row.npc.npc_id === activeFocus.npcId && entry.passalong.type === activeFocus.type) || passalongRows[0]
      : passalongRows[0];
  if (!picked?.row?.npc?.npc_id || !picked.passalong) return null;
  const { row, passalong, point } = picked;
  const width = 328;
  const height = 156;
  const preferLeft = point ? point.x > canvasWidth * 0.54 : false;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, point ? point.x + (preferLeft ? -width - 38 : 76) : 354)),
    y: Math.max(70, Math.min(canvasHeight - height - 24, point ? point.y - 132 : 282)),
    width,
    height,
  };
  const nodes = [
    {
      key: "who",
      label: "谁捎来",
      badge: "人",
      title: npcName(row.npc.npc_id),
      text: `${row.area || "凡仙镇"} · ${row.action || "今日动线"}`,
      detail: passalong.line,
      selector: `[data-npc-id="${selectorDataValue(row.npc.npc_id)}"]`,
      fallbackSelector: "#relationshipPanel",
      panelGroup: "systems",
    },
    {
      key: "what",
      label: "捎哪件事",
      badge: passalong.badge || "话",
      title: passalong.headline,
      text: passalong.detail,
      detail: passalong.sourceLabel,
      selector: passalong.selector,
      fallbackSelector: passalong.fallbackSelector,
      panelGroup: passalong.panelGroup || "core",
    },
    {
      key: "where",
      label: "回看入口",
      badge: "看",
      title: passalong.routeLabel || "定位来源",
      text: "定位这句传话背后的关系、店铺或目标册证据。",
      detail: "只定位来源，不自动推进",
      selector: passalong.selector,
      fallbackSelector: passalong.fallbackSelector,
      panelGroup: passalong.panelGroup || "core",
    },
  ].map((node) => ({
    ...node,
    shortLabel: townLifeWorldBoardShortText(node.label, 6),
    shortTitle: townLifeWorldBoardShortText(node.title, 8),
    shortText: townLifeWorldBoardShortText(node.text, 15),
  }));
  const nodeWidth = Math.floor((width - 52) / 3);
  nodes.forEach((node, index) => {
    node.rect = {
      x: rect.x + 16 + index * (nodeWidth + 10),
      y: rect.y + 100,
      width: nodeWidth,
      height: 34,
    };
  });
  return {
    key: `${stateDay}:${row.npc.npc_id}:${passalong.type}:${passalong.id}:passalong_lantern`,
    day: stateDay,
    npcId: row.npc.npc_id,
    row,
    point,
    rect,
    passalong,
    nodes,
    activeNode: target?.activeNode || nodes.find((node) => node.key === activeFocus?.nodeKey) || nodes[2] || nodes[0],
    title: "镇民顺路捎话灯 · 可点",
    subtitle: `${npcName(row.npc.npc_id)} · ${passalong.title}`,
    shortLine: townLifeWorldBoardShortText(passalong.line, 27),
    shortDetail: townLifeWorldBoardShortText(passalong.detail, 24),
    safety: "只定位来源，不自动推进",
  };
}

export function townLifePassalongLanternAtCanvasPoint(px, py, {
  townLifePassalongLanternSpec = () => null,
} = {}) {
  const spec = townLifePassalongLanternSpec();
  if (!spec?.rect) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[2] || spec.nodes[0];
  return { ...spec, activeNode };
}

export function townLifePassalongMarkerAtCanvasPoint(px, py, {
  townLifePassalongRows = () => [],
  townLifeRows = () => [],
} = {}) {
  return townLifePassalongRows(townLifeRows(6), 3)
    .find(({ point }) => {
      const rect = point ? { x: point.x + 72, y: point.y - 10, width: 76, height: 34 } : null;
      return rect && px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height;
    })
    || null;
}
