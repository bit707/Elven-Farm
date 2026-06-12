export function townLifeMemoryKeepsakePalette(tone = "seeded") {
  const palettes = {
    ready: { accent: "#286f58", soft: "rgba(237, 243, 223, 0.96)", glow: "rgba(40, 111, 88, 0.2)", ink: "#17231d", badge: "成" },
    warming: { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.97)", glow: "rgba(224, 182, 109, 0.24)", ink: "#5b3928", badge: "暖" },
    seeded: { accent: "#8f5f3f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(143, 95, 63, 0.18)", ink: "#5b3928", badge: "心" },
    empty: { accent: "#5d6f65", soft: "rgba(255, 253, 245, 0.94)", glow: "rgba(93, 111, 101, 0.14)", ink: "#17231d", badge: "册" },
  };
  return palettes[tone] || palettes.seeded;
}

export function townLifeMemoryKeepsakeCandidate(rows = [], {
  syncTownLifeInteractionState = () => ({}),
  canvasTownLifeFocusRow = () => null,
  townLifeWorldPoint = () => null,
  latestTownLifeMemory = () => null,
  nextTownLifeMemory = () => null,
  finalSupportBundles = [],
  finalSupportForeshadow = () => null,
  townLifeInteractionCounts = () => ({ total: 0 }),
  stateNpcFavor = {},
  npcName = (npcId = "") => npcId,
  favorLevel = (value = 0) => value,
  townLifeMemoryProgressText = () => "",
} = {}) {
  const visibleRows = (rows || []).filter((row) => row.status.key !== "away").slice(0, 5);
  const history = (syncTownLifeInteractionState().memoryHistory || [])
    .filter((entry) => entry?.npcId && entry?.memoryId);
  if (!history.length) return null;
  const rememberedEntry = history.find((entry) => visibleRows.some((row) => row.npc.npc_id === entry.npcId)) || history[0];
  const npcId = rememberedEntry.npcId;
  const row = visibleRows.find((entry) => entry.npc.npc_id === npcId) || canvasTownLifeFocusRow(npcId);
  if (!row?.npc?.npc_id) return null;
  const pointIndex = visibleRows.findIndex((entry) => entry.npc.npc_id === npcId);
  const point = pointIndex >= 0 ? townLifeWorldPoint(visibleRows[pointIndex], pointIndex) : null;
  const latest = latestTownLifeMemory(npcId) || rememberedEntry;
  const next = nextTownLifeMemory(npcId);
  const bundle = finalSupportBundles.find((entry) => entry.npc_id === npcId) || null;
  const foreshadow = bundle ? finalSupportForeshadow(bundle) : null;
  const counts = townLifeInteractionCounts(npcId);
  const favorValue = Number(stateNpcFavor[npcId] || row.value || 0);
  return {
    npcId,
    npcName: npcName(npcId),
    row,
    point,
    latest,
    next,
    bundle,
    foreshadow,
    counts,
    favorValue,
    favorLv: Number.isFinite(Number(row.level)) ? Number(row.level) : favorLevel(favorValue),
    progressText: townLifeMemoryProgressText(npcId),
  };
}

export function townLifeMemoryKeepsakeSpec(rows = [], canvasWidth = 960, canvasHeight = 640, {
  stateDay = 0,
  townLifeMemoryKeepsakeCandidate = () => null,
  townLifeMemoryKeepsakePalette = () => ({}),
  selectorDataValue = (value = "") => String(value ?? ""),
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  const candidate = townLifeMemoryKeepsakeCandidate(rows);
  if (!candidate?.latest) return null;
  const tone = candidate.foreshadow?.tone || "seeded";
  const palette = townLifeMemoryKeepsakePalette(tone);
  const width = 304;
  const height = 142;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, 344)),
    y: Math.max(344, Math.min(canvasHeight - height - 18, 476)),
    width,
    height,
  };
  const nodeWidth = Math.floor((width - 48) / 3);
  const nodes = [
    {
      key: "latest",
      label: "最近记忆",
      badge: "忆",
      title: candidate.latest.title || "关系册新页",
      text: candidate.latest.summary || "这段镇民小事已经写进关系册。",
      detail: candidate.latest.line || `第 ${candidate.latest.day || stateDay} 天写入 · 来往 ${candidate.counts.total} 次`,
      selector: candidate.latest.memoryId ? `[data-town-memory-id="${selectorDataValue(candidate.latest.memoryId)}"]` : `[data-npc-id="${selectorDataValue(candidate.npcId)}"]`,
    },
    {
      key: "next",
      label: "下一段记忆",
      badge: "续",
      title: candidate.next?.title || "当前篇章完整",
      text: candidate.next?.summary || "这位镇民当前 5 心篇章已经写满，可以把关系沉淀到后日谈与终章支援。",
      detail: candidate.progressText,
      selector: `[data-npc-id="${selectorDataValue(candidate.npcId)}"]`,
    },
    {
      key: "final",
      label: "终章伏笔",
      badge: "阵",
      title: candidate.bundle ? candidate.foreshadow.label : "终章伏笔待配置",
      text: candidate.bundle ? candidate.foreshadow.detail : "这段关系还没有接到终章支援表，先作为日常情感档案保留。",
      detail: candidate.bundle ? candidate.foreshadow.nextText || candidate.bundle.note || "继续累积关系记忆" : "等待 final_support_bundle.csv 接线",
      selector: candidate.bundle ? `[data-final-support-bundle="${selectorDataValue(candidate.bundle.bundle_id)}"]` : `[data-npc-id="${selectorDataValue(candidate.npcId)}"]`,
    },
  ];
  nodes.forEach((node, index) => {
    node.rect = {
      x: rect.x + 16 + index * (nodeWidth + 8),
      y: rect.y + 94,
      width: nodeWidth,
      height: 32,
    };
    node.shortLabel = townLifeWorldBoardShortText(node.label, 6);
    node.shortTitle = townLifeWorldBoardShortText(node.title, 7);
  });
  return {
    ...candidate,
    key: `${stateDay}:${candidate.npcId}:memory_keepsake:${candidate.latest.memoryId}:${candidate.next?.id || "done"}:${tone}`,
    rect,
    nodes,
    palette,
    tone,
    title: "镇民关系心签",
    safety: "这里只翻看/定位关系册，不会自动打招呼、送礼、接支线、交托付、播放同居事件或消耗资源。",
    shortLatest: townLifeWorldBoardShortText(candidate.latest.title || "关系册新页", 11),
    shortSummary: townLifeWorldBoardShortText(candidate.latest.summary || "这段镇民小事已经写进关系册。", 24),
  };
}

export function townLifeMemoryKeepsakeAtCanvasPoint(px, py, {
  townLifeMemoryKeepsakeSpec = () => null,
} = {}) {
  const spec = townLifeMemoryKeepsakeSpec();
  if (!spec?.rect) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[0];
  return { ...spec, activeNode };
}

export function townLifeMemoryNewPageSafetyText() {
  return "这里只定位关系记忆回看入口，不会自动打开记忆页、播放对白、推进剧情、写入完成标记或消耗资源。";
}

export function townLifeMemoryNewPageEntry({
  syncTownLifeInteractionState = () => ({}),
  activeFocus = null,
  stateDay = 0,
} = {}) {
  const townState = syncTownLifeInteractionState();
  const focused = activeFocus?.day === stateDay ? activeFocus : null;
  const history = (townState.memoryHistory || []).filter((entry) => entry?.npcId && entry?.memoryId);
  if (focused?.npcId && focused?.memoryId) {
    const focusedEntry = history.find((entry) => entry.npcId === focused.npcId && entry.memoryId === focused.memoryId);
    if (focusedEntry) return focusedEntry;
  }
  if (townState.lastMemory?.day === stateDay && townState.lastMemory?.npcId && townState.lastMemory?.memoryId) {
    return townState.lastMemory;
  }
  return history.find((entry) => Number(entry.day || 0) === stateDay) || null;
}

export function townLifeMemoryNewPageNodes(entry = null, {
  npcName = (npcId = "") => npcId,
  selectorDataValue = (value = "") => String(value ?? ""),
  stateDay = 0,
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  if (!entry?.npcId || !entry.memoryId) return [];
  return [
    {
      key: "who",
      label: "谁写下",
      badge: "人",
      title: entry.npcName || npcName(entry.npcId),
      text: "这位镇民把今日来往写成了一页关系记忆。",
      detail: `第 ${entry.day || stateDay} 天 · ${entry.level || 1} 心 · 来往 ${entry.interactions || 0} 次`,
      selector: `[data-npc-id="${selectorDataValue(entry.npcId)}"]`,
    },
    {
      key: "memory",
      label: "记了什么",
      badge: "页",
      title: entry.title || "关系册新页",
      text: entry.summary || "一段镇民小事已经落进关系册。",
      detail: entry.line || "翻到关系册可以回看这句对白。",
      selector: `[data-town-memory-id="${selectorDataValue(entry.memoryId)}"]`,
    },
    {
      key: "replay",
      label: "回看入口",
      badge: "看",
      title: "关系册回看",
      text: "关系面板里有显式回看按钮，主世界只负责把入口点亮。",
      detail: "点开面板按钮后再翻页，不由场景直接播放。",
      selector: `[data-town-memory-id="${selectorDataValue(entry.memoryId)}"], [data-npc-id="${selectorDataValue(entry.npcId)}"]`,
    },
  ].map((node) => ({
    ...node,
    shortLabel: townLifeWorldBoardShortText(node.label, 6),
    shortTitle: townLifeWorldBoardShortText(node.title, 8),
    shortText: townLifeWorldBoardShortText(node.text, 15),
  }));
}

export function townLifeMemoryNewPageSpec(rows = [], canvasWidth = 960, canvasHeight = 640, {
  stateDay = 0,
  townLifeMemoryNewPageEntry = () => null,
  canvasTownLifeFocusRow = () => null,
  townLifeWorldPoint = () => null,
  townLifeMemoryNewPageNodes = () => [],
  activeFocus = null,
  npcName = (npcId = "") => npcId,
  townLifeWorldBoardShortText = (text = "") => text,
  townLifeMemoryNewPageSafetyText = () => "",
} = {}) {
  const entry = townLifeMemoryNewPageEntry();
  if (!entry?.npcId || !entry.memoryId) return null;
  const visibleRows = (rows || []).filter((row) => row.status.key !== "away").slice(0, 5);
  const rowIndex = visibleRows.findIndex((row) => row.npc.npc_id === entry.npcId);
  const row = rowIndex >= 0 ? visibleRows[rowIndex] : canvasTownLifeFocusRow(entry.npcId);
  const point = rowIndex >= 0 ? townLifeWorldPoint(visibleRows[rowIndex], rowIndex) : null;
  const width = 330;
  const height = 156;
  const anchorX = point ? point.x + (point.x > canvasWidth * 0.54 ? -width - 46 : 78) : 28;
  const anchorY = point ? point.y - 142 : 254;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, anchorX)),
    y: Math.max(78, Math.min(canvasHeight - height - 24, anchorY)),
    width,
    height,
  };
  const nodes = townLifeMemoryNewPageNodes(entry);
  const nodeWidth = Math.floor((width - 52) / 3);
  nodes.forEach((node, index) => {
    node.rect = {
      x: rect.x + 16 + index * (nodeWidth + 10),
      y: rect.y + 101,
      width: nodeWidth,
      height: 34,
    };
  });
  const key = `${entry.day || stateDay}:${entry.npcId}:${entry.memoryId}:memory_new_page`;
  const matchedFocus = activeFocus?.day === stateDay && activeFocus?.key === key
    ? activeFocus
    : null;
  return {
    entry,
    npcId: entry.npcId,
    npcName: entry.npcName || npcName(entry.npcId),
    memoryId: entry.memoryId,
    row,
    point,
    key,
    rect,
    nodes,
    activeNode: nodes.find((node) => node.key === matchedFocus?.nodeKey) || nodes[1] || nodes[0],
    title: "关系记忆新页 · 可点",
    subtitle: `${entry.npcName || npcName(entry.npcId)} · ${entry.title || "关系册新页"}`,
    shortTitle: townLifeWorldBoardShortText(entry.title || "关系册新页", 12),
    shortSummary: townLifeWorldBoardShortText(entry.summary || "这段镇民小事已经写进关系册。", 27),
    safety: townLifeMemoryNewPageSafetyText(),
  };
}

export function townLifeMemoryNewPageAtCanvasPoint(px, py, {
  townLifeMemoryNewPageSpec = () => null,
} = {}) {
  const spec = townLifeMemoryNewPageSpec();
  if (!spec?.rect) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[1] || spec.nodes[0];
  return { ...spec, activeNode };
}

export function townLifeMemoryThresholdSafetyText() {
  return "这里只定位可推进关系的显式按钮，不会自动寒暄、赠礼、交托付、解锁记忆或播放对白。";
}

export function townLifeMemoryThresholdAction(row = null, next = null, {
  townLifeGreetingSeen = () => false,
  recommendedNpcGift = () => null,
  townLifeGiftSeen = () => false,
  townLifeErrandStatus = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
} = {}) {
  if (!row?.npc?.npc_id) return null;
  const npcId = row.npc.npc_id;
  const greeted = townLifeGreetingSeen(npcId);
  const gift = recommendedNpcGift(npcId);
  const giftDone = townLifeGiftSeen(npcId);
  const errand = greeted ? townLifeErrandStatus(row) : null;
  if (!greeted && row.status.key !== "away") {
    return {
      key: "greet",
      label: "先寒暄",
      title: "打个招呼",
      detail: "一次寒暄会写入今日来往，可能把这段记忆推到可触发。",
      selector: `button[data-canvas-town-greet="${selectorDataValue(npcId)}"], button[data-town-life-greet="${selectorDataValue(npcId)}"], button[data-town-opportunity-greet="${selectorDataValue(npcId)}"]`,
    };
  }
  if (gift && !giftDone) {
    return {
      key: "gift",
      label: "赠礼推进",
      title: gift.itemName,
      detail: `${gift.reason} · 好感 +${gift.favorGain}`,
      selector: `button[data-canvas-town-gift="${selectorDataValue(npcId)}"], button[data-npc-gift="${selectorDataValue(npcId)}"], button[data-town-opportunity-gift="${selectorDataValue(npcId)}"]`,
    };
  }
  if (errand && !errand.completed) {
    return {
      key: errand.ready ? "errand" : "errand_route",
      label: errand.ready ? "交托付" : "备托付",
      title: errand.title,
      detail: errand.ready
        ? `${errand.itemName} ${errand.have}/${errand.count} 已备齐`
        : `${errand.itemName} ${errand.have}/${errand.count} · 先看备货路线`,
      selector: errand.ready
        ? `button[data-canvas-town-errand="${selectorDataValue(npcId)}"], button[data-town-life-errand="${selectorDataValue(npcId)}"], button[data-town-opportunity-errand="${selectorDataValue(npcId)}"]`
        : `button[data-canvas-town-errand-route="${selectorDataValue(npcId)}"], button[data-town-life-errand-route="${selectorDataValue(npcId)}"], button[data-town-opportunity-errand-route="${selectorDataValue(npcId)}"]`,
    };
  }
  return {
    key: "focus",
    label: "看关系卡",
    title: next?.title || "下一段记忆",
    detail: "今天的显式行动可能已经做完，先看关系卡确认还差哪一步。",
    selector: `[data-npc-id="${selectorDataValue(npcId)}"]`,
  };
}

export function townLifeMemoryThresholdCandidate(rows = [], {
  nextTownLifeMemory = () => null,
  townLifeInteractionCounts = () => ({ total: 0 }),
  stateNpcFavor = {},
  favorLevel = (value = 0) => value,
  townLifeMemoryThresholdAction = () => null,
  npcName = (npcId = "") => npcId,
  townLifeWorldPoint = () => null,
  canvasTownLifeFocus = null,
  stateDay = 0,
} = {}) {
  const visibleRows = (rows || []).filter((row) => row.status.key !== "away").slice(0, 5);
  const candidates = visibleRows
    .map((row, index) => {
      const npcId = row.npc.npc_id;
      const next = nextTownLifeMemory(npcId);
      if (!next) return null;
      const counts = townLifeInteractionCounts(npcId);
      const favorValue = Number(stateNpcFavor[npcId] || row.value || 0);
      const favorLv = Number.isFinite(Number(row.level)) ? Number(row.level) : favorLevel(favorValue);
      const needFavor = Math.max(0, Number(next.level || 0) - favorLv);
      const needInteractions = Math.max(0, Number(next.interactions || 0) - counts.total);
      if (needFavor > 0 || needInteractions > 1) return null;
      const action = townLifeMemoryThresholdAction(row, next);
      return {
        npcId,
        npcName: npcName(npcId),
        row,
        point: townLifeWorldPoint(row, index),
        next,
        counts,
        favorValue,
        favorLv,
        needFavor,
        needInteractions,
        action,
        priority: (needInteractions <= 0 ? 120 : 96) + (action?.key === "greet" ? 12 : action?.key === "gift" ? 8 : 0),
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
  const focusedNpcId = canvasTownLifeFocus?.day === stateDay ? canvasTownLifeFocus.npcId : "";
  return candidates.find((entry) => entry.npcId === focusedNpcId) || candidates[0] || null;
}

export function townLifeMemoryThresholdKeepsakeNodes(candidate = null, {
  townLifeMemoryThresholdAction = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  townLifeMemoryProgressText = () => "",
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  if (!candidate?.npcId || !candidate.next) return [];
  const action = candidate.action || townLifeMemoryThresholdAction(candidate.row, candidate.next);
  return [
    {
      key: "progress",
      label: "当前来往",
      badge: "临",
      title: `${candidate.counts.total}/${Number(candidate.next.interactions || 0)} 次`,
      text: `好感 Lv.${candidate.favorLv}/${Number(candidate.next.level || 0)}`,
      detail: candidate.needInteractions <= 0 ? "已经够数，再做一次显式关系行动即可检查触发。" : `还差 ${candidate.needInteractions} 次来往。`,
      selector: `[data-npc-id="${selectorDataValue(candidate.npcId)}"]`,
    },
    {
      key: "next",
      label: "下一段记忆",
      badge: "忆",
      title: candidate.next.title || "关系记忆",
      text: candidate.next.summary || "这段镇民小事快要写进关系册。",
      detail: candidate.next.line || townLifeMemoryProgressText(candidate.npcId),
      selector: `[data-npc-id="${selectorDataValue(candidate.npcId)}"]`,
    },
    {
      key: "action",
      label: "推进入口",
      badge: "去",
      title: action?.label || "看关系卡",
      text: action?.title || "关系面板",
      detail: action?.detail || "先看关系面板确认下一步。",
      selector: action?.selector || `[data-npc-id="${selectorDataValue(candidate.npcId)}"]`,
    },
  ].map((node) => ({
    ...node,
    shortLabel: townLifeWorldBoardShortText(node.label, 6),
    shortTitle: townLifeWorldBoardShortText(node.title, 8),
    shortText: townLifeWorldBoardShortText(node.text, 14),
  }));
}

export function townLifeMemoryThresholdKeepsakeSpec(rows = [], canvasWidth = 960, canvasHeight = 640, {
  stateDay = 0,
  townLifeMemoryThresholdCandidate = () => null,
  townLifeMemoryThresholdKeepsakeNodes = () => [],
  activeFocus = null,
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  const candidate = townLifeMemoryThresholdCandidate(rows);
  if (!candidate) return null;
  const width = 320;
  const height = 152;
  const point = candidate.point;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, point ? point.x + (point.x > canvasWidth * 0.52 ? -width - 32 : 74) : 82)),
    y: Math.max(92, Math.min(canvasHeight - height - 28, point ? point.y + 112 : 402)),
    width,
    height,
  };
  const nodes = townLifeMemoryThresholdKeepsakeNodes(candidate);
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
    ...candidate,
    key: `${stateDay}:${candidate.npcId}:${candidate.next.id}:memory_threshold:${candidate.needInteractions}`,
    rect,
    nodes,
    activeNode: nodes.find((node) => node.key === activeFocus?.nodeKey) || nodes[2] || nodes[0],
    title: "关系记忆临门签 · 可点",
    subtitle: `${candidate.npcName} · ${candidate.next.title}`,
    progressText: candidate.needInteractions <= 0 ? "下一段记忆待触发" : `还差 ${candidate.needInteractions} 次来往`,
    summaryText: townLifeWorldBoardShortText(candidate.next.summary || "下一段镇民记忆快要写进关系册。", 25),
    safety: "只定位推进，不自动解锁记忆",
  };
}

export function townLifeMemoryThresholdKeepsakeAtCanvasPoint(px, py, {
  townLifeMemoryThresholdKeepsakeSpec = () => null,
} = {}) {
  const spec = townLifeMemoryThresholdKeepsakeSpec();
  if (!spec?.rect) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeNode = spec.nodes.find((node) => {
    const nodeRect = node.rect;
    return nodeRect && px >= nodeRect.x && px <= nodeRect.x + nodeRect.width && py >= nodeRect.y && py <= nodeRect.y + nodeRect.height;
  }) || spec.nodes[2] || spec.nodes[0];
  return { ...spec, activeNode };
}
