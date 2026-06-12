export const EARLY_NPC_ROADMAP_LINES = [
  {
    npcId: "npc_xubo",
    tone: "root",
    role: "许伯：镇务 / 旧铺 / 修复归属",
    promise: "他决定玩家是不是能从外来散修变成凡仙镇自己人，也把旧铺、断桥、灵渠和终章后方串成一条线。",
    memoryHook: "记住他 = 镇上的根、旧铺的门、修复后的路。",
    payoff: "把第一笔收成、第一间旧铺和第一段修复都交到镇民眼前。",
    routeLabel: "镇务信任线",
    questIds: ["quest_main_0002_fanxian_zhenlulai", "quest_main_0201_jiupu_kaimen", "quest_main_0401_jiuyao_dahan"],
    milestones: [
      { id: "xubo_spirit", label: "收成能活", check: "spirit", action: "先收获灵气白萝卜，让许伯看见洞天真的能产出。" },
      { id: "xubo_shop", label: "旧铺开门", check: "shop", action: "把加工货摆进旧铺，完成第一轮开铺成交。" },
      { id: "xubo_repair", label: "路接回镇上", check: "repair", action: "继续攒灵石和材料，把第一段修复变化做成镇上能看见的事。" },
    ],
  },
  {
    npcId: "npc_zhang_tieshan",
    tone: "forge",
    role: "张铁山：工具 / 工坊 / 火候",
    promise: "他让玩家理解生产不是凭空变强，而是工具、火候、设备和工坊纪律一点点变可靠。",
    memoryHook: "记住他 = 嘴硬但会护短的火候老师。",
    payoff: "从第一锅菜、第一块矿料到第二只精怪，把后厂成长讲得更有手感。",
    routeLabel: "工坊火候线",
    questIds: ["quest_main_0102_tonghuo_chuming"],
    milestones: [
      { id: "zhang_craft", label: "第一锅出炉", check: "craft", action: "先做出白萝卜汤或清炒白菜，让工坊有第一口火候。" },
      { id: "zhang_second_spirit", label: "第二只精怪", check: "second_spirit", action: "继续种植和加工，等第二只精怪把工坊脾气带出来。" },
      { id: "zhang_story", label: "赤铜压火", check: "zhang_story", action: "触发张铁山基础事件，拿到他给出的第一批锻造材料。" },
    ],
  },
  {
    npcId: "npc_baizhi",
    tone: "herb",
    role: "白芷：医馆 / 灵植 / 药线",
    promise: "她把灵植价值从“能卖钱”翻成“能救人”，让医馆、药材、稳净品质和支线情感慢慢接起来。",
    memoryHook: "记住她 = 清醒、求稳、把救人放在买卖前面。",
    payoff: "让玩家明白干净灵气、稳定供给和药线委托为什么值得追。",
    routeLabel: "灵植药线",
    questIds: ["quest_main_0202_baizhi_zhiqiu"],
    milestones: [
      { id: "baizhi_assist", label: "精怪协助", check: "assist", action: "先让萝卜精完成一次代浇，证明洞天灵气可以稳定照料作物。" },
      { id: "baizhi_clean_food", label: "稳净入药", check: "clean_food", action: "做出第一份干净菜品，让白芷看见灵植可入药的可能。" },
      { id: "baizhi_visit", label: "石斛之求", check: "baizhi_visit", action: "继续完成首单和关系反馈，等待白芷把医馆委托带到旧铺。" },
    ],
  },
];

export function earlyNpcRoadmapStageDoneWorld(check = "", {
  state = {},
} = {}) {
  if (check === "spirit") return state.completed?.has("spirit") || state.spirits?.length > 0 || state.npcStoryEvents?.has("npc_event_xubo_first_recognition");
  if (check === "shop") return state.completed?.has("shop") || state.missionDone?.has("quest_main_0201_jiupu_kaimen");
  if (check === "repair") return state.completed?.has("repair") || Boolean(state.canalRepaired) || state.npcStoryEvents?.has("npc_event_xubo_bridge_trust");
  if (check === "craft") return state.completed?.has("craft") || state.npcStoryEvents?.has("npc_event_zhang_tieshan_workshop_fire");
  if (check === "second_spirit") return state.completed?.has("second_spirit") || state.spirits?.length >= 2;
  if (check === "zhang_story") return state.npcStoryEvents?.has("npc_event_zhang_tieshan_workshop_fire");
  if (check === "assist") return state.completed?.has("assist");
  if (check === "clean_food") return state.completed?.has("craft") || state.npcStoryEvents?.has("npc_event_baizhi_clean_crop");
  if (check === "baizhi_visit") {
    return state.missionDone?.has("quest_main_0202_baizhi_zhiqiu")
      || state.claimedQuestRewards?.has("quest_main_0202_baizhi_zhiqiu")
      || state.completed?.has("baizhi_order_visit")
      || state.storyVisitFeedback?.npcId === "npc_baizhi";
  }
  return false;
}

function earlyNpcRoadmapCardSpecWorld(entry, townRows = [], {
  canvasTownLifeFocusRow = () => null,
  state = {},
  npcStoryEvents = [],
  dataQuests = [],
  favorLevel = (value) => value,
  npcPortraitSrc = (npcId = "") => npcId,
} = {}) {
  const npcId = entry.npcId;
  const row = townRows.find((candidate) => candidate?.npc?.npc_id === npcId) || canvasTownLifeFocusRow(npcId);
  const milestones = entry.milestones.map((milestone) => ({
    ...milestone,
    done: earlyNpcRoadmapStageDoneWorld(milestone.check, { state }),
  }));
  const doneCount = milestones.filter((milestone) => milestone.done).length;
  const current = milestones.find((milestone) => !milestone.done) || milestones[milestones.length - 1];
  const storyEvents = npcStoryEvents.filter((event) => event.npcId === npcId);
  const storyDone = storyEvents.filter((event) => state.npcStoryEvents?.has(event.id)).length;
  const questRows = entry.questIds
    .map((questId) => dataQuests.find((quest) => quest.quest_id === questId))
    .filter(Boolean);
  const questSeen = questRows.filter((quest) => state.missionDone?.has(quest.quest_id) || state.claimedQuestRewards?.has(quest.quest_id)).length;
  const favor = Number(state.npcFavor?.[npcId] || 0);
  return {
    ...entry,
    row,
    milestones,
    doneCount,
    totalCount: milestones.length,
    current,
    storyDone,
    storyTotal: storyEvents.length,
    questSeen,
    questTotal: questRows.length,
    favor,
    favorLevel: favorLevel(favor),
    status: doneCount >= milestones.length ? "done" : doneCount > 0 ? "active" : "waiting",
    statusLabel: doneCount >= milestones.length ? "早期记忆已成形" : doneCount > 0 ? "正在被玩家记住" : "等待第一次认识",
    scheduleText: row ? `${row.area} · ${row.action} · ${row.status.label}` : "今日未在镇上露面",
    portrait: npcPortraitSrc(npcId),
  };
}

export function earlyNpcRoadmapSpecWorld(townRows = [], {
  earlyNpcRoadmapLines = EARLY_NPC_ROADMAP_LINES,
  canvasTownLifeFocusRow = () => null,
  state = {},
  npcStoryEvents = [],
  dataQuests = [],
  favorLevel = (value) => value,
  npcPortraitSrc = (npcId = "") => npcId,
} = {}) {
  const cards = earlyNpcRoadmapLines.map((entry) => earlyNpcRoadmapCardSpecWorld(entry, townRows, {
    canvasTownLifeFocusRow,
    state,
    npcStoryEvents,
    dataQuests,
    favorLevel,
    npcPortraitSrc,
  }));
  const totalMilestones = cards.reduce((sum, card) => sum + card.totalCount, 0);
  const doneMilestones = cards.reduce((sum, card) => sum + card.doneCount, 0);
  const priority = cards.find((card) => card.status !== "done") || cards[0] || null;
  return {
    cards,
    totalMilestones,
    doneMilestones,
    priority,
    safety: "只定位关系卡，不会自动寒暄、赠礼、交付托付或推进剧情。",
  };
}

export function earlyNpcRoadmapMarkupWorld(spec = null, {
  npcName = (npcId = "") => npcId,
} = {}) {
  if (!spec?.cards?.length) return "";
  return `
    <div class="early-npc-roadmap" data-early-npc-roadmap-board="p1">
      <div class="early-npc-roadmap-head">
        <strong>凡仙镇三位早期路标</strong>
        <span>${spec.doneMilestones}/${spec.totalMilestones} 个记忆钩子已点亮 · 当前优先 ${spec.priority ? npcName(spec.priority.npcId) : "镇民关系"}</span>
      </div>
      <div class="early-npc-roadmap-grid">
        ${spec.cards.map((card) => `
          <article class="early-npc-card ${card.tone} ${card.status}" data-early-npc-card="${card.npcId}">
            <div class="early-npc-hero">
              <img src="${card.portrait}" alt="${npcName(card.npcId)}头像" loading="lazy" />
              <div>
                <b>${card.role}</b>
                <span>${card.routeLabel} · 好感 Lv.${card.favorLevel}（${card.favor}/100）</span>
              </div>
            </div>
            <p>${card.promise}</p>
            <small>${card.memoryHook}</small>
            <div class="early-npc-milestones">
              ${card.milestones.map((milestone) => `<span class="${milestone.done ? "done" : "todo"}">${milestone.done ? "已亮" : "待做"} · ${milestone.label}</span>`).join("")}
            </div>
            <em>${card.statusLabel} · 基础事件 ${card.storyDone}/${card.storyTotal || 1} · 任务书 ${card.questSeen}/${card.questTotal || 1}</em>
            <span class="early-npc-next">下一步：${card.current?.done ? card.payoff : card.current?.action || card.payoff}</span>
            <span class="early-npc-schedule">今日位置：${card.scheduleText}</span>
            <button type="button" data-early-npc-roadmap="${card.npcId}">查看关系卡</button>
          </article>
        `).join("")}
      </div>
      <small class="early-npc-roadmap-safety">${spec.safety}</small>
    </div>
  `;
}

export function focusEarlyNpcRoadmapNpcWorld(npcId = "", {
  earlyNpcRoadmapSpec = () => ({ cards: [] }),
  canvasTownLifeFocusRow = () => null,
  stateDay = 0,
  selectorDataValue = (value = "") => String(value ?? ""),
  npcName = (value = "") => value,
  queueStoryCompassFocusTarget = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const card = earlyNpcRoadmapSpec().cards.find((entry) => entry.npcId === npcId);
  const row = card?.row || canvasTownLifeFocusRow(npcId);
  if (row?.npc?.npc_id) {
    setCanvasTownLifeFocus({
      npcId,
      day: stateDay,
      area: row.area,
      action: row.action,
      source: "early_npc_roadmap",
      point: null,
    });
  }
  queueStoryCompassFocusTarget({
    selector: `[data-npc-id="${selectorDataValue(npcId)}"]`,
    fallbackSelector: ".early-npc-roadmap",
    label: "早期镇民路标",
    log: `${npcName(npcId)} 的关系卡已定位：${card?.routeLabel || "早期关系线"}。当前下一步：${card?.current?.done ? card?.payoff : card?.current?.action || "先看今日动线"}。这里只定位关系卡，不会自动寒暄、赠礼、交付托付或推进剧情。`,
    panelGroup: "systems",
    missingTitle: "早期镇民路标",
    missingLog: `${npcName(npcId)} 的关系卡暂时没有找到，先打开凡仙镇关系面板查看三位早期路标。`,
  });
  return true;
}

export function earlyNpcWorldRoadsignSpecWorld(rows = [], canvasWidth = 960, canvasHeight = 640, {
  stateDay = 0,
  earlyNpcRoadmapSpec = () => ({ cards: [] }),
  townLifeWorldPoint = () => null,
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  const roadmap = earlyNpcRoadmapSpec(rows);
  if (!roadmap.cards.length) return null;
  const visibleRows = (rows || []).filter((row) => row?.status?.key !== "away").slice(0, 5);
  const width = 326;
  const rowHeight = 30;
  const height = 68 + roadmap.cards.length * rowHeight;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, 26)),
    y: Math.max(284, Math.min(canvasHeight - height - 18, 408)),
    width,
    height,
  };
  const entries = roadmap.cards.map((card, index) => {
    const pointIndex = visibleRows.findIndex((row) => row?.npc?.npc_id === card.npcId);
    const point = pointIndex >= 0 ? townLifeWorldPoint(visibleRows[pointIndex], pointIndex) : null;
    const accent = card.tone === "forge" ? "#be4f37" : card.tone === "herb" ? "#286f58" : "#8f5f3f";
    const badge = card.tone === "forge" ? "火" : card.tone === "herb" ? "药" : "镇";
    const nextText = card.current?.done ? card.payoff : card.current?.label || card.routeLabel;
    return {
      ...card,
      key: `${stateDay}:${card.npcId}:${card.doneCount}:${card.totalCount}`,
      accent,
      badge,
      point,
      nextText,
      shortRoute: townLifeWorldBoardShortText(card.routeLabel, 8),
      shortNext: townLifeWorldBoardShortText(nextText, 16),
      rowRect: {
        x: rect.x + 12,
        y: rect.y + 54 + index * rowHeight,
        width: rect.width - 24,
        height: rowHeight - 4,
      },
    };
  });
  return {
    key: `${stateDay}:early_npc_world:${entries.map((entry) => `${entry.npcId}:${entry.doneCount}`).join("|")}`,
    rect,
    entries,
    priority: entries.find((entry) => entry.status !== "done") || entries[0],
    doneMilestones: roadmap.doneMilestones,
    totalMilestones: roadmap.totalMilestones,
    safety: roadmap.safety,
  };
}

export function earlyNpcWorldRoadsignAtCanvasPointWorld(px, py, {
  earlyNpcWorldRoadsignSpec = () => null,
} = {}) {
  const spec = earlyNpcWorldRoadsignSpec();
  if (!spec?.rect) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeEntry = spec.entries.find((entry) => {
    const rowRect = entry.rowRect;
    return rowRect && px >= rowRect.x && px <= rowRect.x + rowRect.width && py >= rowRect.y && py <= rowRect.y + rowRect.height;
  }) || spec.priority;
  return { ...spec, activeEntry };
}

export function focusEarlyNpcWorldRoadsignFromCanvasWorld(spec = null, {
  earlyNpcWorldRoadsignSpec = () => null,
  stateDay = 0,
  canvasTownLifeFocusRow = () => null,
  selectorDataValue = (value = "") => String(value ?? ""),
  npcName = (value = "") => value,
  queueStoryCompassFocusTarget = () => null,
  setEarlyNpcWorldRoadsignFocus = () => null,
  setCanvasTownLifeFocus = () => null,
} = {}) {
  const resolvedSpec = spec?.rect ? spec : earlyNpcWorldRoadsignSpec();
  const entry = resolvedSpec?.activeEntry || resolvedSpec?.priority;
  if (!entry?.npcId) return false;
  setEarlyNpcWorldRoadsignFocus({
    key: resolvedSpec.key,
    rowKey: entry.key,
    npcId: entry.npcId,
    day: stateDay,
  });
  const row = entry.row || canvasTownLifeFocusRow(entry.npcId);
  if (row?.npc?.npc_id) {
    setCanvasTownLifeFocus({
      npcId: entry.npcId,
      day: stateDay,
      area: row.area,
      action: row.action,
      source: "early_npc_world_roadsign",
      point: entry.point ? { x: Math.round(entry.point.x), y: Math.round(entry.point.y) } : null,
    });
  }
  queueStoryCompassFocusTarget({
    selector: `[data-npc-id="${selectorDataValue(entry.npcId)}"]`,
    fallbackSelector: ".early-npc-roadmap",
    label: "点选三位镇民路标",
    log: `${npcName(entry.npcId)} · ${entry.routeLabel}：进度 ${entry.doneCount}/${entry.totalCount}，下一步 ${entry.current?.done ? entry.payoff : entry.current?.action || entry.nextText}。这里只定位关系卡，不会自动寒暄、赠礼、交付托付或推进剧情。`,
    panelGroup: "systems",
    missingTitle: "点选三位镇民路标",
    missingLog: `${npcName(entry.npcId)} 的早期关系卡暂时没有找到，先打开凡仙镇关系面板查看三位早期路标。`,
  });
  return true;
}
