export function careChainJournalTargetWorld({
  chainState = null,
} = {}) {
  if (
    !chainState
    || (
      Number(chainState.bestStreak || 0) <= 0
      && !(chainState.history || []).length
      && !(chainState.eventHistory || []).length
    )
  ) {
    return null;
  }
  return {
    id: "care_chain_journal_stand",
    type: "care_chain_journal",
    label: "照应札记台",
    rect: { x: 676, y: 392, width: 222, height: 92 },
  };
}

export function careChainJournalFocusSpecWorld({
  target = null,
  streak = 0,
  bestStreak = 0,
} = {}) {
  if (!target) return null;
  return {
    selector: ".care-chain-journal",
    fallbackSelector: "#goalBookPanel",
    label: `点选札记：${target.label || "照应札记台"}`,
    log: `洞天照应札记已在目标册高亮。当前连续 ${streak} 日，最佳 ${bestStreak} 日；从这里可回看阶段事件或续今日照应。`,
    panelGroup: "core",
    missingTitle: "点选札记：洞天照应札记",
    missingLog: "目标册里的照应札记暂时没有找到；先让田地、精怪和旧铺至少两端在同一天接上线，入夜后札记会落页。",
  };
}

export function compendiumMonumentTargetWorld({
  memoryPages = [],
  compendium = null,
} = {}) {
  if (!(compendium?.entries || []).length) return null;
  return {
    id: "dungeon_compendium_monument",
    type: "compendium",
    label: "年轮纪念碑",
    pageKey: memoryPages[0]?.key || compendium.entries[0]?.key || "",
    rect: { x: 308, y: 182, width: 190, height: 182 },
  };
}

export function compendiumMonumentFocusSpecWorld({
  target = null,
  selector = "#goalBookPanel",
  pageTitle = "",
} = {}) {
  if (!target) return null;
  return {
    selector,
    fallbackSelector: "#goalBookPanel",
    label: `点选陈设：${target.label}`,
    log: pageTitle
      ? `${target.label} 已把 ${pageTitle} 定位到年鉴里。先翻回忆页，看这枚印记怎么反馈到节气试炼。`
      : `${target.label} 已经亮起。先去目标册查看秘境图鉴和最近的回忆页。`,
    panelGroup: "core",
    missingTitle: "点选陈设：年轮纪念碑",
    missingLog: "年鉴里的回忆页入口暂时没有找到，先确认核心试玩分组是否可见。",
  };
}

export function year2OrderPrepTargetWorld({
  previewOrder = null,
  needStatus = null,
} = {}) {
  if (!previewOrder || !needStatus) return null;
  return {
    id: "year2_order_prep_table",
    type: "year2_order",
    label: needStatus.completion >= 1 ? "名铺订单已备齐" : "名铺订单备货台",
    orderId: previewOrder.order_id,
    ready: needStatus.completion >= 1,
    rect: { x: 382, y: 262, width: 244, height: 126 },
  };
}

export function year2OrderPrepFocusSpecWorld({
  target = null,
  selector = "",
  orderTitle = "",
  completion = 0,
  missingText = "",
} = {}) {
  if (!target) return null;
  return {
    selector,
    fallbackSelector: "#shopReport",
    label: `点选陈设：${target.label}`,
    log: orderTitle
      ? `${orderTitle} 已在名铺订单预览里高亮。${completion >= 1 ? "货已经齐了，可以直接接这单。" : `还差 ${missingText || "几件货"}，先按备货台提示继续补。`}`
      : "这张名铺订单已经被定位到右侧，先看本季订单预览继续接后主线经营。",
    panelGroup: "core",
    missingTitle: "点选陈设：名铺订单备货台",
    missingLog: "右侧名铺订单预览暂时没有找到，先确认核心试玩分组是否可见。",
  };
}

export function shopSeasonTargetWorld({
  cycle = null,
  pendingSettlement = false,
} = {}) {
  if (!cycle?.season) return null;
  return {
    id: "year2_shop_season_billboard",
    type: "shop_season",
    label: pendingSettlement ? "名铺月评榜" : "名铺赛季榜",
    pending: Boolean(pendingSettlement),
    rect: { x: 672, y: 56, width: 236, height: 178 },
  };
}

export function shopSeasonFocusSpecWorld({
  target = null,
  pendingSettlement = false,
} = {}) {
  if (!target) return null;
  return {
    selector: `[data-shop-season-board="${pendingSettlement ? "settlement" : "rank"}"]`,
    fallbackSelector: "#shopReport",
    label: `点选陈设：${target.label}`,
    log: pendingSettlement
      ? `${target.label} 已在右侧结算卡高亮。先看这一季的短板、奖励和下季建议，再决定今天补哪条经营线。`
      : `${target.label} 已在右侧赛季榜高亮。当前评分、重点标签和预计奖励都已经展开，适合顺着榜单修正经营节奏。`,
    panelGroup: "core",
    missingTitle: "点选陈设：名铺月评榜",
    missingLog: "月评榜对应卡片暂时没有找到，先确认核心试玩分组是否可见。",
  };
}

export function solarTrialTargetWorld({
  trial = null,
  activeTrialId = "",
} = {}) {
  if (!trial) return null;
  return {
    id: "year2_solar_trial_dial",
    type: "solar_trial",
    label: activeTrialId === trial.trial_id ? "年轮试炼进行中" : "年轮试炼盘",
    trialId: trial.trial_id,
    rect: { x: 646, y: 250, width: 262, height: 132 },
  };
}

export function solarTrialFocusSpecWorld({
  target = null,
  selector = "",
  trialName = "",
  activeDayIndex = 0,
  challengeDays = 0,
  supportSummary = "",
} = {}) {
  if (!target) return null;
  const activeText = activeDayIndex > 0
    ? `当前正在第 ${activeDayIndex}/${Math.max(1, challengeDays || 3)} 天。`
    : "可以直接开卷。";
  return {
    selector,
    fallbackSelector: "#solarTrialPanel",
    label: `点选陈设：${target.label}`,
    log: trialName
      ? `${trialName} 已在试炼面板高亮。${activeText}${supportSummary ? ` 印记共鸣：${supportSummary}。` : ""}`
      : "节气试炼入口已在右侧高亮，适合把种植、店铺、秘境和风险压成三天挑战。",
    panelGroup: "systems",
    missingTitle: "点选陈设：年轮试炼盘",
    missingLog: "试炼盘对应入口暂时没有找到，先确认系统深挖分组是否可见。",
  };
}
