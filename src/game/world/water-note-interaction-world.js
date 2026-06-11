import { selectorDataValue } from "../shared/selectors.js";

function noteTitle(title = "") {
  return String(title || "").replace(" · 可点", "");
}

function addNoteTarget(targets, spec, type, extra = {}) {
  if (!spec) return;
  targets.push({
    id: spec.id,
    type,
    label: spec.title,
    ...extra,
    rect: spec.rect,
  });
}

export function waterNoteInteractionTargetsWorld({
  qingboFirstSaleRestockSeedNote = null,
  qingboWaterFreshRestockNote = null,
  lingchiWaterFreshMenuNote = null,
  waterFreshRegularPledgeNote = null,
  waterFreshMenuRegularReasonNote = null,
  qingheWaterFreshReturnOrderNote = null,
  qingheWaterwayPreludeNote = null,
  waterFreshReturnToWaterwayReasonNote = null,
  qingheLotusBasinTradeDispatchNote = null,
  qingheLotusBasinFollowupOrderNote = null,
  lotusBasinReturnFollowupReasonNote = null,
  qingheLotusBasinLongOrderNote = null,
  qingheLotusBasinStandingOrderNote = null,
  qingheWaterwayAfterwordNote = null,
  qingheWaterwayTownRumorNote = null,
} = {}) {
  const targets = [];

  addNoteTarget(targets, qingboFirstSaleRestockSeedNote, "qingbo_first_sale_restock_seed_note", {
    ready: qingboFirstSaleRestockSeedNote?.ready,
  });
  addNoteTarget(targets, qingboWaterFreshRestockNote, "qingbo_water_fresh_restock_note", {
    phase: qingboWaterFreshRestockNote?.phase,
    ready: qingboWaterFreshRestockNote?.ready,
  });
  addNoteTarget(targets, lingchiWaterFreshMenuNote, "lingchi_water_fresh_menu_note", {
    phase: lingchiWaterFreshMenuNote?.phase,
    ready: Boolean(lingchiWaterFreshMenuNote?.readyToCraft || lingchiWaterFreshMenuNote?.phase === "shop"),
  });
  addNoteTarget(targets, waterFreshRegularPledgeNote, "water_fresh_regular_pledge_note", {
    phase: waterFreshRegularPledgeNote?.phase,
    ready: waterFreshRegularPledgeNote?.ready,
  });
  addNoteTarget(targets, waterFreshMenuRegularReasonNote, "water_fresh_menu_regular_reason_note", {
    ready: waterFreshMenuRegularReasonNote?.ready,
  });
  addNoteTarget(targets, qingheWaterFreshReturnOrderNote, "qinghe_water_fresh_return_order_note", {
    phase: qingheWaterFreshReturnOrderNote?.phase,
    ready: qingheWaterFreshReturnOrderNote?.ready,
  });
  addNoteTarget(targets, qingheWaterwayPreludeNote, "qinghe_waterway_prelude_note", {
    phase: qingheWaterwayPreludeNote?.phase,
    ready: qingheWaterwayPreludeNote?.ready,
  });
  addNoteTarget(targets, waterFreshReturnToWaterwayReasonNote, "water_fresh_return_to_waterway_reason_note", {
    ready: waterFreshReturnToWaterwayReasonNote?.ready,
  });
  addNoteTarget(targets, qingheLotusBasinTradeDispatchNote, "qinghe_lotus_basin_trade_dispatch_note", {
    phase: qingheLotusBasinTradeDispatchNote?.phase,
    ready: qingheLotusBasinTradeDispatchNote?.ready,
  });
  addNoteTarget(targets, qingheLotusBasinFollowupOrderNote, "qinghe_lotus_basin_followup_order_note", {
    phase: qingheLotusBasinFollowupOrderNote?.phase,
    ready: qingheLotusBasinFollowupOrderNote?.ready,
  });
  addNoteTarget(targets, lotusBasinReturnFollowupReasonNote, "lotus_basin_return_followup_reason_note", {
    ready: lotusBasinReturnFollowupReasonNote?.ready,
  });
  addNoteTarget(targets, qingheLotusBasinLongOrderNote, "qinghe_lotus_basin_long_order_note", {
    phase: qingheLotusBasinLongOrderNote?.phase,
    ready: qingheLotusBasinLongOrderNote?.ready,
  });
  addNoteTarget(targets, qingheLotusBasinStandingOrderNote, "qinghe_lotus_basin_standing_order_note", {
    phase: qingheLotusBasinStandingOrderNote?.phase,
    ready: qingheLotusBasinStandingOrderNote?.ready,
  });
  addNoteTarget(targets, qingheWaterwayAfterwordNote, "qinghe_waterway_afterword_note", {
    ready: Boolean(qingheWaterwayAfterwordNote?.momentId),
  });
  addNoteTarget(targets, qingheWaterwayTownRumorNote, "qinghe_waterway_town_rumor_note", {
    ready: qingheWaterwayTownRumorNote?.ready,
  });

  return targets;
}

export function qingboWaterFreshRestockFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  const title = noteTitle(spec.title);
  const selector = spec.phase === "return_sale"
    ? "#shopReport"
    : spec.ready
      ? '[data-shop-restock-complete="true"]'
      : '[data-shop-board="restock-tracker"]';
  return {
    selector,
    fallbackSelector: "#shopReport",
    label: `点选水鲜：${title}`,
    log: spec.phase === "return_sale"
      ? `${title} 已把旧铺经营面板高亮。${spec.itemName} 已补到 ${spec.have} 份，下一次开铺若卖出清波鱼脍，就能把“补货 -> 回头成交 -> 水鲜招牌”这条线正式收成稳定客群。`
      : spec.ready
        ? `${title} 已把旧铺补货完成按钮高亮。${spec.itemName} ${spec.have}/${spec.desiredCount} 已够数，先完成补货，再开铺看回头客是否认这口灵池水鲜。`
        : `${title} 已把旧铺补货追踪卡高亮。${spec.itemName} ${spec.have}/${spec.desiredCount}，推荐路线：${spec.routeText}。补齐后回来点“完成补货”。`,
    panelGroup: "core",
    missingTitle: "点选水鲜：补货签",
    missingLog: "旧铺补货追踪或经营面板暂时没有找到，先确认核心试玩分组是否可见。",
  };
}

export function lingchiWaterFreshMenuFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  const title = noteTitle(spec.title);
  return {
    selector: spec.phase === "shop" ? "#shopReport" : "#recipeSelect",
    fallbackSelector: spec.phase === "shop" ? "#shopReport" : ".build-panel",
    label: `点选水鲜：${title}`,
    log: spec.phase === "shop"
      ? `${title} 已把旧铺经营面板高亮。${spec.dishName} 库存 ${spec.dishCount}，清波鱼脍库存 ${spec.qingboCount}；开铺若卖出三鲜羹，就能把水鲜招牌扩成双水鲜小菜单。`
      : spec.readyToCraft
        ? `${spec.recipeName} 已切到加工栏，原料已齐。先做出 ${spec.dishName}，再和清波鱼脍一起摆给认清口的熟客看。`
        : spec.recipeReady
          ? `${spec.recipeName} 已切到加工栏。当前还差 ${spec.missingText || "几味水鲜料"}；补齐后就能把第二道水鲜接上案板。`
          : `${title} 已尝试定位工坊配方。水鲜招牌已经成型，但 ${spec.recipeName} 暂时还未亮起，先确认任务奖励和配方解锁状态。`,
    panelGroup: spec.phase === "shop" ? "core" : "systems",
    missingTitle: "点选水鲜：灵池三鲜羹",
    missingLog: "三鲜羹配方或旧铺面板暂时没有找到，先确认核心试玩和系统深挖分组是否可见。",
  };
}

export function waterFreshRegularPledgeFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  const title = noteTitle(spec.title);
  const selector = spec.routeAction === "recipe"
    ? "#recipeSelect"
    : spec.routeAction === "seed"
      ? "#seedSelect"
      : ".shop-visit-pledge";
  return {
    selector,
    fallbackSelector: spec.routeAction === "shop" ? "#shopReport" : ".mission-panel",
    label: `点选熟客帖：${title}`,
    log: spec.phase === "preview"
      ? `${spec.customerLabel} 的水鲜熟客帖已经在任务/旧铺面板高亮。明日会来认 ${spec.targetItemName}；先按路线准备：${spec.routeText}。兑现后会把水鲜小菜单推进到固定客群。`
      : spec.ready
        ? `${spec.customerLabel} 今日会来认 ${spec.targetItemName}。${spec.routeAction === "shop" ? "旧铺面板已高亮，开铺接住这张熟客帖。" : `推荐路线已定位：${spec.routeText}。备好后开铺接帖。`}兑现奖励：${spec.rewardText}。`
        : `${spec.customerLabel} 的熟客帖还差目标货。已定位推荐路线：${spec.routeText}；先补 ${spec.targetItemName}，再开铺兑现固定客群。`,
    panelGroup: spec.routeAction === "shop" ? "core" : "systems",
    missingTitle: "点选熟客帖：水鲜留单",
    missingLog: "水鲜熟客帖或推荐路线暂时没有找到，先确认任务面板、旧铺面板和系统深挖分组是否可见。",
  };
}

export function qingheWaterFreshReturnOrderFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: spec.visible ? `[data-order-card-id="${selectorDataValue(spec.orderId)}"]` : "#orderPanel",
    fallbackSelector: "#orderPanel",
    label: `点选回订单：${noteTitle(spec.title)}`,
    log: spec.ready
      ? `${spec.orderTitle} 已在订单板高亮。${spec.needText} 已备齐，可以交付给青禾，把固定熟客正式接成水鲜回订单。交付奖励：${spec.rewardText}。`
      : spec.visible
        ? `${spec.orderTitle} 已在订单板高亮。需求 ${spec.needText}，还差 ${spec.missingText || "几件水鲜货"}；补齐后交付，会把这条线推向水航鲜货。`
        : `固定水鲜熟客已经形成，但 ${spec.orderTitle} 还没稳定落到订单板。先打开订单板刷新确认，目标是 ${spec.needText}，随后接到“${spec.routeText}”。`,
    panelGroup: "core",
    missingTitle: "点选回订单：青禾水鲜",
    missingLog: "青禾水鲜回订单卡暂时没有找到，先确认核心试玩分组和订单板是否可见。",
  };
}

export function qingheWaterwayPreludeFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  const selector = spec.ready || spec.unlocked
    ? `[data-order-card-id="${selectorDataValue(spec.orderId)}"]`
    : spec.phase === "favor"
      ? `[data-npc-id="${selectorDataValue("npc_qinghe")}"]`
      : "#finalSupportPanel";
  return {
    selector,
    fallbackSelector: spec.ready || spec.unlocked ? "#orderPanel" : spec.phase === "favor" ? "#relationshipPanel" : "#finalSupportPanel",
    label: `点选水航牌：${noteTitle(spec.title)}`,
    log: spec.ready
      ? `${spec.orderTitle} 已在订单板高亮。${spec.needText} 已备齐，可以把第一趟水航鲜货交给青禾。交付奖励：${spec.rewardText}。`
      : spec.unlocked
        ? `${spec.orderTitle} 已在订单板高亮。需求 ${spec.needText}，还差 ${spec.missingText}；先从灵池、水润田和工坊把水航补给备稳。`
        : spec.phase === "favor"
          ? `水航鲜货路已经写在青禾小簿上，但青禾还需五心才会把第一趟水单托给你。当前 Lv.${spec.qingheFavorLevel}/5，继续交水鲜单、照看灵池或完成她的镇上小事。`
          : `水航鲜货路标已经落在河岸。先把终章蟠桃大宴收束到第二年，再回来接 ${spec.orderTitle}；目标路线是 ${spec.routeText}。`,
    panelGroup: spec.ready || spec.unlocked ? "core" : "story",
    missingTitle: "点选水航牌：灵池水航",
    missingLog: "对应的订单、青禾关系卡或终章支援面板暂时没有找到，先确认核心试玩和剧情分组是否可见。",
  };
}

export function qingheLotusBasinTradeDispatchFocusSpecWorld({
  spec = null,
  unlockConditionLabel = "",
} = {}) {
  if (!spec) return null;
  return {
    selector: `[data-trade-route="${selectorDataValue(spec.routeId)}"]`,
    fallbackSelector: "#spiritList",
    label: `点选商队牌：${noteTitle(spec.title)}`,
    log: spec.phase === "travel"
      ? `${spec.routeName} 商队已经在路上，第 ${spec.returnDay} 天返航，约 ${spec.daysLeft} 天后会结算首次返货。返货后会点亮莲泽熟路、青禾返货对白和后续水鲜续订单。`
      : spec.phase === "dispatch"
        ? `${spec.routeName} 已在商路线卡高亮。补给达标，推荐装货 ${spec.cargoText}，货值约 ${spec.cargoValue}；可以先探路，也可以选择冒险或稳妥发队。`
        : spec.phase === "supply"
          ? `${spec.routeName} 已在商路线卡高亮。现在能发队，但补给还差 ${spec.supplyText}，预估风险 ${spec.riskText}；补齐清凉饮后再发会更稳。`
          : spec.phase === "cargo"
            ? `${spec.routeName} 已在商路线卡高亮。小舟缺装货，先准备鱼鲜、水作物或甜口货，让莲泽水航有货可押。`
            : spec.phase === "spirit"
              ? `${spec.routeName} 已在商路线卡高亮。跨界水路需要至少一只精怪领路，先让作物成精并留出体力。`
              : `${spec.routeName} 已在商路线卡高亮。还需要满足 ${unlockConditionLabel}，通常是青禾五心并完成第一张水航鲜货单。`,
    panelGroup: "core",
    missingTitle: "点选商队牌：莲泽水航",
    missingLog: "莲泽水航商路线卡暂时没有找到，先确认核心试玩分组和精怪面板是否可见。",
  };
}

export function qingheLotusBasinFollowupOrderFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: spec.visible ? `[data-order-card-id="${selectorDataValue(spec.orderId)}"]` : "#orderPanel",
    fallbackSelector: "#orderPanel",
    label: `点选续订单：${noteTitle(spec.title)}`,
    log: spec.ready
      ? `${spec.orderTitle} 已在订单板高亮。${spec.needText} 已备齐，可以交付给青禾，把莲泽水航从首次返货接成长期熟路。交付奖励：${spec.rewardText}。`
      : spec.visible
        ? `${spec.orderTitle} 已在订单板高亮。需求 ${spec.needText}，还差 ${spec.missingText || "几件续订货"}；补齐后交付，会开启莲泽熟路长单账页。`
        : `首次莲泽返货已经完成，但 ${spec.orderTitle} 还没稳定落到订单板。先打开订单板确认，目标是 ${spec.needText}，随后接到“${spec.routeText}”。`,
    panelGroup: "core",
    missingTitle: "点选续订单：莲泽熟路",
    missingLog: "莲泽熟路续订单卡暂时没有找到，先确认核心试玩分组和订单板是否可见。",
  };
}

export function qingheLotusBasinLongOrderFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  const selector = spec.phase === "restock_ready"
    ? '[data-shop-restock-complete="true"]'
    : spec.phase === "restock"
      ? '[data-shop-board="restock-tracker"]'
      : spec.phase === "stable" || spec.phase === "ledger"
        ? '[data-shop-board="waterway-long-order"]'
        : spec.phase === "visit"
          ? '[data-shop-board="waterway-reorder-followup"]'
          : "#shopReport";
  return {
    selector,
    fallbackSelector: "#shopReport",
    label: `点选长单账：${noteTitle(spec.title)}`,
    log: spec.phase === "stable"
      ? "莲泽水航长单已经稳定。旧铺面板已高亮，后续保持清波鱼脍、灵池三鲜羹、荷露糖水和路线稀货不断档，水航客会成为长期客群证据。"
      : spec.phase === "ledger"
        ? `莲泽水航长单账已在旧铺高亮。当前进度 ${spec.progressText}，继续让水航客买到熟路货，累计到 3 单会把这条长单稳定下来。`
        : spec.phase === "visit"
          ? `${spec.targetItemName} 已能接水航复访。旧铺经营面板已高亮，下一次开铺如果水航客买到熟路货，就会把回订推进到长单账。`
          : spec.phase === "stock"
            ? "莲泽回订补货已兑现，但货架还需要继续补厚。先把清波鱼脍、灵池三鲜羹、荷露糖水或路线稀货摆回旧铺，再接复访。"
            : spec.phase === "restock_ready"
              ? `${spec.targetItemName} 已补到 ${spec.have}/${spec.desiredCount}，旧铺补货完成按钮已高亮。完成后下一次开铺会触发水航回订复访。`
              : spec.phase === "restock"
                ? `莲泽水航回订补货牌已高亮。${spec.targetItemName} ${spec.have}/${spec.desiredCount}，期限第 ${spec.dueDay} 天；先按补货路线把熟路货补到不断档。`
                : "莲泽续订单已经交付。先开一次旧铺，让水航客回门挑货，系统会根据成交或驻足生成莲泽水航回订补货目标。",
    panelGroup: "core",
    missingTitle: "点选长单账：莲泽水航",
    missingLog: "莲泽长单账或旧铺补货卡暂时没有找到，先确认核心试玩分组和旧铺经营面板是否可见。",
  };
}

export function qingheLotusBasinStandingOrderFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: '[data-shop-board="waterway-standing-order"]',
    fallbackSelector: "#shopReport",
    label: `点选常单牌：${noteTitle(spec.title)}`,
    log: spec.ready
      ? spec.echoDone
        ? `莲泽常单备货已经在旧铺高亮。${spec.stockedKinds} 类熟路货 / 共 ${spec.totalStock} 件，继续保持清波鱼脍、灵池三鲜羹、荷露糖水和水航莲实不断档。`
        : "莲泽常单备货已经够厚。旧铺常单板已高亮，下一次开铺时青禾会把这批压舱货写进水路小簿，形成镇上后话。"
      : `莲泽常单备货偏薄。旧铺常单板已高亮，当前最该补 ${spec.focusItemName} ${spec.focusHave}/${spec.focusTarget}${spec.routeAction !== "focus" ? `；推荐路线已经在常单板里列出，可从${spec.routeAction === "recipe" ? "工坊配方" : spec.routeAction === "seed" ? "种子栏" : "旧铺货签"}接过去。` : "；先补任意水鲜、饮品或路线稀货。"}`,
    panelGroup: "core",
    missingTitle: "点选常单牌：莲泽常单",
    missingLog: "莲泽常单备货板暂时没有找到，先确认核心试玩分组和旧铺经营面板是否可见。",
  };
}

export function qingheWaterwayAfterwordFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: `[data-npc-id="${selectorDataValue(spec.npcId)}"]`,
    fallbackSelector: "#relationshipPanel",
    label: `点选水路小簿：${noteTitle(spec.title)}`,
    log: `${spec.npcName}的水路小簿已在关系面板高亮。${spec.detail} 后续继续维持莲泽常单不断档，会让这类旧铺后话持续写进镇上来往册。`,
    panelGroup: "story",
    missingTitle: "点选水路小簿：青禾",
    missingLog: "青禾关系卡暂时没有找到，先确认剧情分组和关系面板是否可见。",
  };
}

export function qingheWaterwayTownRumorFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  return {
    selector: spec.ready ? '[data-shop-board="waterway-standing-order"]' : `[data-npc-id="${selectorDataValue(spec.npcId)}"]`,
    fallbackSelector: spec.ready ? "#shopReport" : "#relationshipPanel",
    label: `点选传话灯：${noteTitle(spec.title)}`,
    log: `${spec.headline}。${spec.routeText}；${spec.detail} ${spec.safeNote}。`,
    panelGroup: spec.ready ? "core" : "story",
    missingTitle: "点选传话灯：莲泽常单",
    missingLog: `莲泽常单后话或旧铺常单板暂时没有找到，先回看青禾关系册或旧铺经营面板。${spec.safeNote}。`,
  };
}
