export function townLifeWorldBoardShortText(text = "", limit = 18) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  return normalized.length > limit ? `${normalized.slice(0, limit)}...` : normalized;
}

export function townLifeOpportunityActionMarkup(opportunity) {
  if (!opportunity) return "";
  if (opportunity.actionKind === "shop_errand") {
    return `<button type="button" data-shop-town-errand-action="${opportunity.actionMode || "focus"}" data-shop-town-errand-route="${opportunity.routeAction || ""}" data-shop-town-errand-recipe="${opportunity.recipeId || ""}" data-shop-town-errand-seed="${opportunity.seedId || ""}" data-shop-town-errand-tag="${opportunity.shopTag || ""}" data-shop-town-errand-item="${opportunity.itemId || ""}">${opportunity.actionLabel}</button>`;
  }
  const disabled = opportunity.disabled ? "disabled" : "";
  if (opportunity.actionKind === "errand_route") return `<button type="button" data-town-opportunity-errand-route="${opportunity.npcId}" ${disabled}>${opportunity.actionLabel}</button>`;
  if (opportunity.actionKind === "errand") return `<button type="button" data-town-opportunity-errand="${opportunity.npcId}" ${disabled}>${opportunity.actionLabel}</button>`;
  if (opportunity.actionKind === "gift") return `<button type="button" data-town-opportunity-gift="${opportunity.npcId}" ${disabled}>${opportunity.actionLabel}</button>`;
  if (opportunity.actionKind === "side") return `<button type="button" data-town-opportunity-side-quest="${opportunity.questId}" data-town-opportunity-side-npc="${opportunity.npcId}" ${disabled}>${opportunity.actionLabel}</button>`;
  if (opportunity.actionKind === "memory") return `<button type="button" data-town-opportunity-memory-npc="${opportunity.npcId}" data-town-opportunity-memory-id="${opportunity.memoryId}" ${disabled}>${opportunity.actionLabel}</button>`;
  return `<button type="button" data-town-opportunity-greet="${opportunity.npcId}" ${disabled}>${opportunity.actionLabel}</button>`;
}

export function townLifeOpportunityRows(rows = [], limit = 4, {
  shopTownErrandDisplaySpec = () => null,
  shopTownErrandPrimaryActionSpec = () => null,
  townLifeGreetingSeen = () => false,
  townLifeErrandStatus = () => null,
  recommendedNpcGift = () => null,
  townLifeGiftSeen = () => false,
  sideQuestClueForNpc = () => null,
  latestTownLifeMemory = () => null,
  townLifeNextMemoryPreview = () => null,
  townLifeInteractionCounts = () => ({ total: 0 }),
  npcName = (npcId = "") => npcId,
  questTitle = (quest) => quest?.quest_id || "",
  sideQuestClueStatusText = () => "",
  stepLabel = () => "",
  townLifeErrandRouteSpec = () => null,
} = {}) {
  const opportunities = [];
  const shopTownErrand = shopTownErrandDisplaySpec();
  if (shopTownErrand && !shopTownErrand.completed && !shopTownErrand.failed) {
    const primary = shopTownErrandPrimaryActionSpec(shopTownErrand);
    opportunities.push({
      type: "shop_errand",
      tone: shopTownErrand.ready ? "reward" : shopTownErrand.preview ? "memory" : "urgent",
      priority: shopTownErrand.ready ? 98 : shopTownErrand.preview ? 76 : 92,
      npcId: shopTownErrand.npcId,
      title: shopTownErrand.ready ? "旧铺捎话可交付" : shopTownErrand.preview ? "旧铺捎话明日可送" : "旧铺捎话待备货",
      detail: `${shopTownErrand.npcLabel} · ${shopTownErrand.requestItemName} ${shopTownErrand.have}/${shopTownErrand.count}`,
      meta: `${shopTownErrand.areaLabel} · ${shopTownErrand.note}`,
      actionKind: "shop_errand",
      actionMode: primary?.mode || "focus",
      routeAction: primary?.route?.action || "",
      recipeId: primary?.route?.recipeId || "",
      seedId: primary?.route?.seedId || "",
      shopTag: primary?.route?.shopTag || "",
      itemId: primary?.route?.itemId || shopTownErrand.requestItemId || "",
      actionLabel: primary?.label || "看镇上动线",
    });
  }
  for (const row of rows) {
    const npcId = row.npc.npc_id;
    const greetingSeen = townLifeGreetingSeen(npcId);
    const errand = townLifeErrandStatus(row);
    const gift = recommendedNpcGift(npcId);
    const giftDone = townLifeGiftSeen(npcId);
    const sideClue = sideQuestClueForNpc(npcId);
    const memory = latestTownLifeMemory(npcId);
    const nextMemory = townLifeNextMemoryPreview(npcId);
    const counts = townLifeInteractionCounts(npcId);
    const needFavor = nextMemory ? Math.max(0, Number(nextMemory.level || 0) - row.level) : 0;
    const needInteractions = nextMemory ? Math.max(0, Number(nextMemory.interactions || 0) - counts.total) : 0;
    const areaLine = `${npcName(npcId)} · ${row.area} · ${row.status.label}`;

    if (sideClue && (sideClue.rewardReady || sideClue.active || sideClue.ready)) {
      opportunities.push({
        type: "side",
        tone: sideClue.rewardReady ? "reward" : sideClue.active ? "active" : "ready",
        priority: sideClue.rewardReady ? 96 : sideClue.active ? 82 : 74,
        npcId,
        questId: sideClue.quest.quest_id,
        title: sideClue.rewardReady ? "支线可收束" : sideClue.active ? "支线正在推进" : "支线线索可承接",
        detail: `${questTitle(sideClue.quest)} · ${sideQuestClueStatusText(sideClue)}${sideClue.currentStep ? ` · ${stepLabel(sideClue.currentStep)}` : ""}`,
        meta: areaLine,
        actionKind: "side",
        actionLabel: sideClue.rewardReady ? "去领取奖励" : sideClue.active ? "追踪支线" : "承接支线",
      });
    }

    if (errand && !errand.completed) {
      if (greetingSeen && errand.ready) {
        opportunities.push({
          type: "errand",
          tone: "ready",
          priority: row.status.key === "urgent" ? 94 : 86,
          npcId,
          title: "今日小托付可交付",
          detail: `${errand.title} · ${errand.itemName} ${errand.have}/${errand.count}`,
          meta: `${errand.weatherLabel ? `${errand.weatherLabel} · ` : ""}回礼 ${errand.rewardGold} 灵石${errand.rewardFame ? ` / 声望 +${errand.rewardFame}` : ""} / 好感 +${errand.rewardFavor}`,
          actionKind: "errand",
          actionLabel: "交付小托付",
        });
      } else if (greetingSeen && !errand.ready) {
        const route = townLifeErrandRouteSpec(errand);
        opportunities.push({
          type: "errand_route",
          tone: route?.type === "harvest" ? "ready" : row.status.key === "urgent" ? "urgent" : "active",
          priority: row.status.key === "urgent" ? 88 : 70,
          npcId,
          title: errand.weatherLabel ? "天气托付待备货" : "今日小托付待备货",
          detail: `${errand.title} · ${errand.itemName} ${errand.have}/${errand.count}`,
          meta: route
            ? `${route.label}：${route.title} · ${route.detail}`
            : `${areaLine} · 先看背包、灵田和工坊来源`,
          actionKind: "errand_route",
          actionLabel: route?.buttonLabel || "看备货路线",
        });
      } else if (!greetingSeen && row.status.key !== "away") {
        opportunities.push({
          type: "greet",
          tone: row.status.key === "urgent" ? "urgent" : "daily",
          priority: row.status.key === "urgent" ? 90 : 66,
          npcId,
          title: "先寒暄接小托付",
          detail: `${errand.title} · 需要 ${errand.itemName} x${errand.count}`,
          meta: `${errand.weatherLabel ? `${errand.weatherLabel} · ` : ""}${areaLine}`,
          actionKind: "greet",
          actionLabel: "打个招呼",
        });
      }
    }

    if (!giftDone && gift) {
      opportunities.push({
        type: "gift",
        tone: gift.tone === "liked" ? "liked" : "plain",
        priority: gift.tone === "liked" ? 78 : 54,
        npcId,
        title: gift.tone === "liked" ? "今日赠礼很合适" : "今日可顺手赠礼",
        detail: `${gift.itemName} · ${gift.reason}`,
        meta: `好感 +${gift.favorGain} · ${areaLine}`,
        actionKind: "gift",
        actionLabel: "赠送推荐礼物",
      });
    }

    if (nextMemory && needFavor <= 0 && needInteractions <= 1) {
      const canGreet = row.status.key !== "away" && !greetingSeen;
      const canGift = Boolean(gift && !giftDone);
      opportunities.push({
        type: "memory",
        tone: "memory",
        priority: needInteractions <= 0 ? 84 : 72,
        npcId,
        title: needInteractions <= 0 ? "关系记忆待触发" : "关系记忆临门",
        detail: `下一记忆「${nextMemory.title}」· ${nextMemory.summary}`,
        meta: needInteractions <= 0 ? `${areaLine} · 再来往一次即可写入关系册` : `还差 ${needInteractions} 次来往`,
        actionKind: canGreet ? "greet" : canGift ? "gift" : "greet",
        actionLabel: canGreet ? "寒暄触发" : canGift ? "赠礼推进" : "今日已互动",
        disabled: !canGreet && !canGift,
      });
    } else if (memory) {
      opportunities.push({
        type: "memory",
        tone: "archive",
        priority: 46,
        npcId,
        memoryId: memory.memoryId,
        title: "关系册可回看",
        detail: `${memory.title} · ${memory.summary}`,
        meta: `来往 ${counts.total} 次 · ${areaLine}`,
        actionKind: "memory",
        actionLabel: "翻看记忆",
      });
    }

    if (!greetingSeen && row.status.key !== "away") {
      opportunities.push({
        type: "greet",
        tone: row.status.key === "festival" ? "festival" : row.status.key === "urgent" ? "urgent" : "daily",
        priority: row.status.key === "festival" ? 70 : row.status.key === "urgent" ? 88 : 52,
        npcId,
        title: row.status.key === "festival" ? "节气寒暄" : row.status.key === "urgent" ? "救急寒暄" : "今日寒暄",
        detail: row.bark,
        meta: areaLine,
        actionKind: "greet",
        actionLabel: "打个招呼",
      });
    }
  }
  return opportunities
    .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0))
    .filter((entry, index, list) => list.findIndex((other) => other.npcId === entry.npcId && other.type === entry.type) === index)
    .slice(0, limit)
    .map((entry) => ({
      ...entry,
      npcName: entry.npcName || (entry.npcId ? npcName(entry.npcId) : "镇民"),
    }));
}

export function townLifeOpportunityBoardMarkup(rows = [], {
  townLifeOpportunityRows = () => [],
  townLifeOpportunityActionMarkup = () => "",
} = {}) {
  const opportunities = townLifeOpportunityRows(rows, 4);
  if (!opportunities.length) return "";
  const main = opportunities[0];
  return `
    <div class="town-life-opportunity-board ${main.tone}" data-town-opportunity-board="today">
      <div class="town-life-opportunity-head">
        <strong>今日关系机会</strong>
        <span>${opportunities.length} 条可行动线 · 优先 ${main.title}</span>
      </div>
      <div class="town-life-opportunity-list">
        ${opportunities.map((opportunity) => `
          <div class="town-life-opportunity ${opportunity.tone}" data-town-opportunity="${opportunity.type}">
            <b>${opportunity.title}</b>
            <span>${opportunity.detail}</span>
            <small>${opportunity.meta}</small>
            ${townLifeOpportunityActionMarkup(opportunity)}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

export function townLifeRouteWorldBoardEntry(row = null, index = 0, {
  townLifeGreetingSeen = () => false,
  townLifeErrandStatus = () => null,
  townLifeErrandRouteSpec = () => null,
  latestTownLifeShopMoment = () => null,
  stateDay = 0,
  townLifeWeatherMomentSpec = () => null,
  npcName = (npcId = "") => npcId,
  townLifeWorldBoardShortText = (text = "") => text,
  townLifeWorldPoint = () => null,
} = {}) {
  if (!row?.npc?.npc_id || row.status?.key === "away") return null;
  const npcId = row.npc.npc_id;
  const greeted = townLifeGreetingSeen(npcId);
  const errand = greeted ? townLifeErrandStatus(row) : null;
  const route = errand && !errand.completed && !errand.ready ? townLifeErrandRouteSpec(errand) : null;
  const shopMoment = latestTownLifeShopMoment(npcId);
  const shopMomentToday = Boolean(shopMoment && Number(shopMoment.day || 0) === Number(stateDay || 0));
  const weatherMoment = row.weatherMoment || townLifeWeatherMomentSpec(row);
  let type = "daily";
  let tone = row.status?.key === "urgent" ? "urgent" : row.status?.key === "festival" ? "festival" : "daily";
  let badge = row.status?.key === "urgent" ? "急" : row.status?.key === "festival" ? "节" : "见";
  let title = greeted ? row.status.label : "可寒暄";
  let detail = greeted ? `${row.area} · ${row.action}` : `${row.area} · ${row.action}，还没打招呼`;
  let nextLabel = greeted ? "看关系卡" : "定位寒暄";
  let priority = row.status?.key === "urgent" ? 96 : row.status?.key === "festival" ? 88 : 58;

  if (shopMomentToday) {
    type = "shop_moment";
    tone = "shop";
    badge = "铺";
    title = "旧铺后话在镇上";
    detail = shopMoment.summary || shopMoment.followup || "今天有人在旧铺留下了后话。";
    nextLabel = "定位后话";
    priority = 142;
  } else if (errand?.ready && !errand.completed) {
    type = "errand_ready";
    tone = "ready";
    badge = "交";
    title = "小托付可交";
    detail = `${errand.title} · ${errand.itemName} ${errand.have}/${errand.count}`;
    nextLabel = "定位交付";
    priority = 132;
  } else if (route) {
    type = "errand_route";
    tone = "route";
    badge = route.type === "recipe" ? "炊" : route.type === "seed" ? "种" : route.type === "harvest" ? "收" : "备";
    title = route.label || "小托付备货";
    detail = `${errand.title} · ${route.title || errand.itemName}`;
    nextLabel = route.buttonLabel || "看路线";
    priority = 118;
  } else if (!greeted) {
    type = "greet";
    tone = row.status?.key === "urgent" ? "urgent" : "greet";
    badge = row.status?.key === "urgent" ? "急" : "见";
    title = weatherMoment?.label || "今日可寒暄";
    detail = `${row.area} · ${row.action}`;
    nextLabel = "定位寒暄";
    priority = row.status?.key === "urgent" ? 112 : 104;
  } else if (shopMoment) {
    type = "shop_archive";
    tone = "archive";
    badge = "册";
    title = "旧铺后话可回看";
    detail = shopMoment.summary || "旧铺来往已经写进关系册。";
    nextLabel = "看关系册";
    priority = 74;
  }

  return {
    key: `${stateDay}:${npcId}:${type}:${title}`,
    row,
    npcId,
    npcName: npcName(npcId),
    area: row.area,
    action: row.action,
    statusLabel: row.status?.label || "日常",
    type,
    tone,
    badge,
    title,
    detail,
    shortTitle: townLifeWorldBoardShortText(title, 9),
    shortDetail: townLifeWorldBoardShortText(detail, 17),
    nextLabel,
    greeted,
    errand,
    route,
    shopMoment,
    shopMomentToday,
    priority,
    point: townLifeWorldPoint(row, index),
  };
}

export function townLifeRouteWorldBoardSpec(rowsInput = null, canvasWidth = 960, canvasHeight = 640, {
  stateDay = 0,
  townLifeRows = () => [],
  townLifeRouteWorldBoardEntry = () => null,
  clockMinuteText = () => "",
  localize = (value = "") => value,
  currentTermConfig = () => null,
  currentTermId = () => "",
} = {}) {
  const rows = (rowsInput || townLifeRows(6))
    .filter((row) => row.status.key !== "away")
    .slice(0, 5);
  if (!rows.length) return null;
  const entries = rows
    .map((row, index) => townLifeRouteWorldBoardEntry(row, index))
    .filter(Boolean)
    .sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0))
    .slice(0, 3);
  if (!entries.length) return null;
  const width = 248;
  const rowHeight = 26;
  const height = 78 + entries.length * rowHeight;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, 696)),
    y: Math.max(42, Math.min(canvasHeight - height - 22, 58)),
    width,
    height,
  };
  entries.forEach((entry, index) => {
    entry.rect = {
      x: rect.x + 12,
      y: rect.y + 58 + index * rowHeight,
      width: rect.width - 24,
      height: rowHeight - 3,
    };
  });
  const main = entries[0];
  return {
    key: `${stateDay}:town_life_route:${entries.map((entry) => `${entry.npcId}:${entry.type}`).join("|")}`,
    day: stateDay,
    rect,
    entries,
    main,
    count: entries.length,
    title: "主世界镇民今日动线",
    subtitle: `${clockMinuteText()} · ${localize(currentTermConfig()?.term_name_key, currentTermId())}`,
  };
}

export function townLifeRouteWorldBoardAtCanvasPoint(px, py, {
  townLifeRouteWorldBoardSpec = () => null,
} = {}) {
  const spec = townLifeRouteWorldBoardSpec();
  if (!spec?.rect) return null;
  const { rect } = spec;
  if (px < rect.x || px > rect.x + rect.width || py < rect.y || py > rect.y + rect.height) return null;
  const activeEntry = spec.entries.find((entry) => {
    const rowRect = entry.rect;
    return rowRect && px >= rowRect.x && px <= rowRect.x + rowRect.width && py >= rowRect.y && py <= rowRect.y + rowRect.height;
  }) || spec.main;
  return { ...spec, activeEntry };
}

export function townLifeRelationshipWorldBoardPalette(tone = "daily") {
  const palettes = {
    urgent: { accent: "#be4f37", soft: "rgba(255, 240, 232, 0.96)", glow: "rgba(190, 79, 55, 0.18)", ink: "#5b3928", badge: "急" },
    ready: { accent: "#286f58", soft: "rgba(237, 243, 223, 0.96)", glow: "rgba(40, 111, 88, 0.18)", ink: "#17231d", badge: "交" },
    reward: { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.97)", glow: "rgba(224, 182, 109, 0.24)", ink: "#5b3928", badge: "奖" },
    active: { accent: "#4d91a6", soft: "rgba(241, 249, 251, 0.96)", glow: "rgba(77, 145, 166, 0.18)", ink: "#17231d", badge: "追" },
    liked: { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(224, 182, 109, 0.2)", ink: "#5b3928", badge: "礼" },
    plain: { accent: "#5d6f65", soft: "rgba(255, 253, 245, 0.94)", glow: "rgba(93, 111, 101, 0.14)", ink: "#17231d", badge: "礼" },
    memory: { accent: "#8f5f3f", soft: "rgba(255, 248, 232, 0.97)", glow: "rgba(143, 95, 63, 0.18)", ink: "#5b3928", badge: "记" },
    archive: { accent: "#5d6f65", soft: "rgba(255, 253, 245, 0.92)", glow: "rgba(93, 111, 101, 0.12)", ink: "#17231d", badge: "册" },
    festival: { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.97)", glow: "rgba(224, 182, 109, 0.22)", ink: "#5b3928", badge: "节" },
    daily: { accent: "#286f58", soft: "rgba(237, 243, 223, 0.94)", glow: "rgba(40, 111, 88, 0.14)", ink: "#17231d", badge: "见" },
  };
  return palettes[tone] || palettes.daily;
}

export function townLifeRelationshipWorldBoardSpec(rows = [], canvasWidth = 960, canvasHeight = 640, {
  stateDay = 0,
  townLifeOpportunityRows = () => [],
  townLifeRows = () => [],
  canvasTownLifeFocusRow = () => null,
  townLifeWorldPoint = () => null,
  stateNpcFavor = {},
  favorLevel = (value = 0) => value,
  cohabStatusFor = () => null,
  nextCohabEvent = () => null,
  cohabRequirementText = () => "",
  townLifeRelationshipWorldBoardPalette = () => ({}),
  npcName = (npcId = "") => npcId,
  townLifeWorldBoardShortText = (text = "") => text,
} = {}) {
  const visibleRows = (rows || []).filter((row) => row.status.key !== "away").slice(0, 5);
  const opportunityRows = townLifeOpportunityRows(visibleRows.length ? visibleRows : townLifeRows(8), 3);
  if (!opportunityRows.length) return null;
  const main = opportunityRows[0];
  const npcId = main.npcId || "";
  const row = visibleRows.find((entry) => entry.npc.npc_id === npcId)
    || canvasTownLifeFocusRow(npcId)
    || visibleRows[0]
    || null;
  const rowIndex = row ? visibleRows.findIndex((entry) => entry.npc.npc_id === row.npc.npc_id) : -1;
  const point = row ? townLifeWorldPoint(row, Math.max(0, rowIndex)) : null;
  const favorValue = Number(stateNpcFavor[npcId] || row?.value || 0);
  const favorLv = Number.isFinite(Number(row?.level)) ? Number(row.level) : favorLevel(favorValue);
  const cohab = npcId ? cohabStatusFor(npcId) : null;
  const cohabEvent = cohab?.epilogue ? nextCohabEvent(cohab.epilogue.epilogue_id) : null;
  const cohabLine = cohab?.epilogue
    ? cohab.unlocked
      ? `同住：${cohab.epilogue.route_name}${cohabEvent ? ` · ${cohabEvent.event_name || cohabEvent.scene_key}` : ""}`
      : `同住：${cohabRequirementText(cohab)}`
    : main.type === "side"
      ? "支线关系可继续推进"
      : "日常来往会写进关系册";
  const width = 312;
  const height = 136;
  const rect = {
    x: Math.max(18, Math.min(canvasWidth - width - 18, 620)),
    y: Math.max(148, Math.min(canvasHeight - height - 24, 214)),
    width,
    height,
  };
  const palette = townLifeRelationshipWorldBoardPalette(main.tone);
  return {
    key: `${stateDay}:${npcId || "town"}:${main.type}:${main.title}`,
    day: stateDay,
    npcId,
    npcName: main.npcName || (npcId ? npcName(npcId) : "镇民"),
    row,
    point,
    rect,
    palette,
    tone: main.tone,
    type: main.type,
    title: main.title || "今日关系机会",
    detail: main.detail || "今天镇上有一段可以推进的关系。",
    meta: main.meta || `${row?.area || "凡仙镇"} · ${row?.action || "今日动线"}`,
    area: row?.area || "凡仙镇",
    action: row?.action || main.actionLabel || "今日互动",
    actionKind: main.actionKind || "greet",
    actionLabel: main.actionLabel || "看关系",
    favorValue,
    favorLv,
    cohabLine,
    count: opportunityRows.length,
    nextTitle: opportunityRows[1]?.title || "",
    shortTitle: townLifeWorldBoardShortText(main.title || "今日关系机会", 13),
    shortDetail: townLifeWorldBoardShortText(main.detail || main.meta || "今天镇上有一段可以推进的关系。", 24),
    shortMeta: townLifeWorldBoardShortText(main.meta || `${row?.area || "凡仙镇"} · ${row?.action || "今日动线"}`, 24),
    shortCohab: townLifeWorldBoardShortText(cohabLine, 24),
  };
}
