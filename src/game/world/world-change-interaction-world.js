export function worldChangeTargetsWorld({
  worldChangeByType = new Map(),
  honeyFeastActive = false,
  ledgerFinalActive = false,
  ledgerStockWarningActive = false,
  fireQuestId = "",
  thunderRouteActive = false,
  thunderRouteUnlocked = false,
  pondBuilt = false,
  pondLotusStage = "none",
} = {}) {
  const targets = [];

  if (worldChangeByType.has("flower_honey")) {
    targets.push({
      id: "flower_honey_yard",
      type: "shop_special",
      label: honeyFeastActive ? "百花茶席" : "花蜜甜庭",
      board: "honey",
      rect: { x: 80, y: 330, width: 176, height: 72 },
    });
  }

  if (worldChangeByType.has("old_relic")) {
    targets.push({
      id: "shuqi_ledger_relic",
      type: "shop_special",
      label: ledgerFinalActive ? "金边旧账" : ledgerStockWarningActive ? "缺货签页" : "书契账房",
      board: "ledger",
      rect: { x: 228, y: 430, width: 86, height: 92 },
    });
  }

  if (worldChangeByType.has("fire_core_beacon")) {
    targets.push({
      id: "fire_core_beacon",
      type: "mission_arc",
      label: "火位核心",
      questId: fireQuestId,
      rect: { x: 484, y: 452, width: 128, height: 140 },
    });
  }

  if (worldChangeByType.has("drought_cracked_well")) {
    targets.push({
      id: "drought_cracked_well",
      type: "drought_story",
      label: "主街枯井",
      stage: "well",
      rect: { x: 700, y: 286, width: 98, height: 96 },
    });
  }

  if (worldChangeByType.has("drought_relief_shed")) {
    targets.push({
      id: "drought_relief_shed",
      type: "drought_story",
      label: "井边水棚",
      stage: "shed",
      rect: { x: 802, y: 272, width: 132, height: 118 },
    });
  }

  if (worldChangeByType.has("thunder_route")) {
    targets.push({
      id: "thunder_route_marker",
      type: "trade_route",
      label: thunderRouteActive ? "旧雷道押运旗" : thunderRouteUnlocked ? "旧雷道路标" : "雷竹路标",
      routeId: "route_thunder_old_06",
      rect: { x: 792, y: 232, width: 70, height: 112 },
    });
  }

  if (worldChangeByType.has("moon_pool") && pondBuilt) {
    targets.push({
      id: "moon_pool_marker",
      type: "moon_pool",
      label: pondLotusStage === "bloom" ? "月莲静池" : "月池水纹",
      rect: { x: 604, y: 486, width: 164, height: 92 },
    });
  }

  if (worldChangeByType.has("lantern_road")) {
    targets.push({
      id: "lantern_route_marker",
      type: "lantern_route",
      label: "夜巡灯路",
      rect: { x: 646, y: 132, width: 54, height: 82 },
    });
  }

  return targets;
}

export function shopSpecialFocusSpecWorld({
  target = null,
  selector = "",
  year2Open = false,
  honeyFeastActive = false,
  ledgerFinalActive = false,
  ledgerStockWarningActive = false,
} = {}) {
  if (!target) return null;
  const log = target.board === "ledger"
    ? ledgerFinalActive
      ? `${target.label} 已在右侧账页批注高亮。先誊一页回忆页，把当前或待领取的名铺结算再抬高一截。`
      : ledgerStockWarningActive
        ? `${target.label} 已在右侧账页批注高亮。先看缺货签和订单预判，补最该补的那几格货。`
        : year2Open
          ? `${target.label} 已在右侧账房批注高亮。先看书契替你圈出的短板和顺手高值单，再决定今天先补哪条经营线。`
          : `${target.label} 已经把旧铺短板先圈出来了。先看右侧店铺复盘，等宴后开季就能把这本账真正用满。`
    : honeyFeastActive
      ? `${target.label} 已在右侧蜂蜜精经营卡高亮。今天可以直接开百花茶会，把甜口客留得更久。`
      : year2Open
        ? `${target.label} 已在右侧花蜜调和卡高亮。继续接甜单、做甜锅、摆甜系陈列，这条生意会越养越香。`
        : `${target.label} 已经把甜味生意的苗头养起来了。先看旧铺经营面板，等宴后开季再把这份香气做成真正的长线招牌。`;
  return {
    selector,
    fallbackSelector: "#shopReport",
    label: `点选异象：${target.label}`,
    log,
    panelGroup: "core",
    missingTitle: `点选异象：${target.label}`,
    missingLog: "对应的店铺经营卡暂时没有找到，先确认核心试玩分组是否可见。",
  };
}

export function missionArcFocusSpecWorld({
  target = null,
  selector = "",
  questTitle = "",
  questStarted = false,
  finalNestReady = false,
} = {}) {
  if (!target) return null;
  return {
    selector,
    fallbackSelector: "#missionPanel",
    label: `点选异象：${target.label}`,
    log: finalNestReady
      ? `${target.label} 的后续主线已在任务书高亮。去看 ${questTitle}，把终巢、终阵和蟠桃大宴继续接成完整终章。`
      : questStarted
        ? `${target.label} 已把 ${questTitle} 烫亮。先顺着二十四枢、水线和定海神珠继续往终巢推进。`
        : `${target.label} 已经把后续主线烧红了一线。先回任务书确认第四章焦点，再把大旱、水线和终章入口一段段接上。`,
    panelGroup: "story",
    missingTitle: "点选异象：火位核心",
    missingLog: "后续主线任务卡暂时没有找到，先确认任务书分组是否可见。",
  };
}

export function droughtStoryFocusSpecWorld({
  target = null,
  selector = "",
  fallbackSelector = "",
  reliefDelivered = false,
  orderVisible = false,
  orderTitle = "",
  needText = "",
  hintCta = "",
} = {}) {
  if (!target) return null;
  const log = target.stage === "shed"
    ? reliefDelivered
      ? `${target.label} 已把九曜大旱主线高亮。第一批水囊已经送到镇上，下一步该回残碑听陆三笑把二十四枢讲明白。`
      : orderTitle
        ? `${target.label} 已把 ${orderTitle} 定位到右侧。还得先凑齐 ${needText || "第一批救援物资"}，镇上这口气才能真正缓下来。`
        : `${target.label} 已把应急救援线定位到右侧，先把第一批物资送出去。`
    : reliefDelivered
      ? `${target.label} 还在冒热，但右侧九曜大旱主线已经高亮。先领任务奖励，再把终章水线继续接下去。`
      : orderTitle
        ? `${target.label} 已把 ${orderTitle} 定位到右侧。镇井已经见底，先把 ${needText || "救援物资"} 送到镇上。`
        : `${target.label} 已把九曜大旱主线定位到右侧。先处理镇上的第一波救援。`;
  return {
    selector,
    fallbackSelector,
    label: `点选异象：${target.label}`,
    log: hintCta ? `${log} ${hintCta}` : log,
    panelGroup: !reliefDelivered && orderVisible ? "core" : "story",
    missingTitle: `点选异象：${target.label}`,
    missingLog: "对应的大旱任务或订单卡暂时没有找到，先确认核心和任务分组是否可见。",
  };
}

export function tradeRouteFocusSpecWorld({
  target = null,
  selector = "",
  routeName = "",
  activeReturnDay = 0,
  previewUnlocked = false,
  previewReady = false,
  missingSupply = "",
  unlockConditionLabel = "",
} = {}) {
  if (!target) return null;
  return {
    selector,
    fallbackSelector: "#spiritList",
    label: `点选异象：${target.label}`,
    log: routeName
      ? `${routeName} 已在商路线卡高亮。${activeReturnDay ? `商队还在路上，第 ${activeReturnDay} 天返程。` : previewUnlocked ? previewReady ? "补给已齐，可以先派精怪探路，再决定要不要今天发队。" : `补给还差 ${missingSupply || "几样行路物资"}，先把押运线备稳。` : `这条线还没真正开通，先满足 ${unlockConditionLabel}。`}`
      : "旧雷道入口已在右侧高亮，先看商路线卡和补给需求。",
    panelGroup: "systems",
    missingTitle: "点选异象：雷竹路标",
    missingLog: "旧雷道商路线暂时没有找到，先确认系统深挖分组是否可见。",
  };
}

export function lanternRouteFocusSpecWorld({
  target = null,
  selector = "",
  fallbackSelector = "",
  revealedDungeonName = "",
  lanternCardVisible = false,
  bondFinalDone = false,
  revealReady = false,
} = {}) {
  if (!target) return null;
  const log = revealedDungeonName
    ? `${revealedDungeonName} 的隐藏入口已在右侧高亮。趁今晚顺着这段长灯路走一趟，进门前半段会更容易看清。`
    : lanternCardVisible
      ? bondFinalDone
        ? `${target.label} 已在右侧灯影卡高亮。${revealReady ? "今晚可以手动点亮一条隐藏入口。" : "先等新的冬夜轮换，或去消化今天已经点亮过的那段灯路。"}`
        : `${target.label} 已在右侧灯影卡高亮。继续补冬至通关和羁绊，把长灯真正练成能照出入口的路。`
      : `${target.label} 已经把夜路照亮了一段。先去秘境面板看看今夜轮换和隐藏入口。`;
  return {
    selector,
    fallbackSelector,
    label: `点选异象：${target.label}`,
    log,
    panelGroup: revealedDungeonName || !lanternCardVisible ? "systems" : "core",
    missingTitle: `点选异象：${target.label}`,
    missingLog: "灯影对应的入口暂时没有找到，先确认秘境或店铺分组是否可见。",
  };
}
