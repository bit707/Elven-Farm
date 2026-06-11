import { selectorDataValue } from "../shared/selectors.js";

export const YEAR2_LIFE_WORLD_SLOTS_WORLD = [
  { id: "year2_life_goal_book", mode: "goals", label: "自由目标年册", x: 438, y: 454, width: 184, height: 92, accent: "#286f58" },
  { id: "year2_life_cohab_table", mode: "cohab", label: "后日谈共桌", x: 92, y: 486, width: 228, height: 86, accent: "#be4f37" },
  { id: "year2_life_trade_banner", mode: "trade", label: "远路商旗台", x: 760, y: 414, width: 160, height: 98, accent: "#b47d2f" },
];

export function year2LifePlazaTargetsWorld({
  plaza = null,
  slots = YEAR2_LIFE_WORLD_SLOTS_WORLD,
  hasTradeRoutes = false,
  hasCohabEpilogues = false,
} = {}) {
  if (!plaza?.active) return [];
  return (slots || [])
    .filter((slot) => slot.mode !== "trade" || hasTradeRoutes)
    .filter((slot) => slot.mode !== "cohab" || hasCohabEpilogues)
    .map((slot) => ({
      ...slot,
      type: "year2_life_plaza",
      goalId: slot.mode === "goals" ? (plaza.freeGoal?.goal_id || plaza.dailyGoal?.goal_id || "") : "",
      goalKind: slot.mode === "goals" && plaza.freeGoal ? "freeplay" : "year2",
      npcId: slot.mode === "cohab" ? (plaza.cohabProspect?.npc_id || "") : "",
      routeId: slot.mode === "trade" ? (plaza.routePreview?.route?.route_id || "") : "",
      rect: { x: slot.x, y: slot.y, width: slot.width, height: slot.height },
    }));
}

export function year2LifeGoalBookFocusSpecWorld({
  target = null,
  freeGoalId = "",
  dailyGoalId = "",
  goalTitle = "第二年目标册",
  readyCount = 0,
} = {}) {
  if (!target) return null;
  const selector = freeGoalId
    ? `[data-freeplay-goal="${selectorDataValue(freeGoalId)}"]`
    : dailyGoalId
      ? `[data-year2-goal="${selectorDataValue(dailyGoalId)}"]`
      : "#goalBookPanel";
  return {
    selector,
    fallbackSelector: "#goalBookPanel",
    label: `点选年册：${target.label}`,
    log: readyCount > 0
      ? `${target.label} 已把目标册高亮。当前有 ${readyCount} 项可收录或可领取，先处理「${goalTitle}」，把宴后的日常变成长期节奏。`
      : `${target.label} 已把目标册高亮。今天先顺着「${goalTitle}」推进一点，第二年的日目标、周目标和自由追求会慢慢滚起来。`,
    panelGroup: "core",
    missingTitle: `点选年册：${target.label}`,
    missingLog: "第二年目标册暂时没有找到，先确认核心试玩分组是否可见。",
  };
}

export function year2LifeCohabFocusSpecWorld({
  target = null,
  npcId = "",
  npcNameText = "伙伴",
  routeName = "后日谈",
  unlocked = false,
  latestEventName = "",
  nextEventName = "",
  requirementText = "更高好感与居所条件",
} = {}) {
  if (!target) return null;
  const hasRoute = Boolean(npcId);
  return {
    selector: hasRoute ? `[data-npc-id="${selectorDataValue(npcId)}"]` : ".relationship-panel",
    fallbackSelector: ".relationship-panel",
    label: `点选后日谈：${target.label}`,
    log: hasRoute
      ? unlocked
        ? `${target.label} 已把 ${npcNameText} 的关系卡高亮。${latestEventName ? `最近生活小事「${latestEventName}」已经写入家中。` : `这条「${routeName}」已经可推进。`}${nextEventName ? ` 下一件事：${nextEventName}。` : " 继续通过每日、周常和节气事件把家里过成长期内容。"}`
        : `${target.label} 已把 ${npcNameText} 的关系卡高亮。还需要 ${requirementText}，才能把后日谈从约定变成真正的共同生活。`
      : `${target.label} 已把关系面板高亮。第二年同住后日谈会从高好感 NPC、居所升级和节气生活事件里慢慢展开。`,
    panelGroup: "systems",
    missingTitle: `点选后日谈：${target.label}`,
    missingLog: "关系面板暂时没有找到，先确认系统深挖分组是否可见。",
  };
}

export function year2LifeTradeFocusSpecWorld({
  target = null,
  routeId = "",
  routeName = "",
  activeReturnDay = 0,
  unlocked = false,
  ready = false,
  missingSupply = "",
  unlockConditionLabel = "",
} = {}) {
  if (!target) return null;
  const hasRoute = Boolean(routeId);
  return {
    selector: hasRoute ? `[data-trade-route="${selectorDataValue(routeId)}"]` : "#spiritList",
    fallbackSelector: "#spiritList",
    label: `点选商旗：${target.label}`,
    log: hasRoute
      ? `${routeName} 已在商路线卡高亮。${activeReturnDay ? `商队正在路上，第 ${activeReturnDay} 天回来。` : unlocked ? ready ? "补给和货物都够，可以先探路或直接发商队。" : `还差 ${missingSupply || "几样补给"}，先把远路备稳。` : `还需要 ${unlockConditionLabel} 才能开这条远路。`}`
      : `${target.label} 已把精怪与商路面板高亮。第二年远路会把订单、补给、稀有材料和隐藏秘境接起来。`,
    panelGroup: "core",
    missingTitle: `点选商旗：${target.label}`,
    missingLog: "商路线卡暂时没有找到，先确认核心试玩分组是否可见。",
  };
}
