import { selectorDataValue } from "../shared/selectors.js";

export function finalBanquetTargetWorld({
  active = false,
  banquetDone = false,
  pantaoPlanted = false,
  gridCenterX = 0,
  gridCenterY = 0,
} = {}) {
  if (!active) return null;

  if (banquetDone) {
    return {
      id: "final_banquet_table",
      type: "banquet_story",
      label: "蟠桃大宴",
      phase: "banquet",
      rect: { x: 112, y: 500, width: 332, height: 96 },
    };
  }

  if (!pantaoPlanted) return null;
  return {
    id: "final_banquet_vigil",
    type: "banquet_story",
    label: "阵心守夜",
    phase: "vigil",
    rect: { x: gridCenterX - 122, y: gridCenterY + 60, width: 244, height: 76 },
  };
}

export function finalBanquetVigilFocusTargetWorld({
  target = null,
  pantaoQuestId = "",
  pantaoQuestTitle = "",
  pantaoPlot = null,
  growingRoute = null,
} = {}) {
  const routeText = growingRoute
    ? `${pantaoPlot?.mature ? "收后去向" : "长成去向"}：${growingRoute.badge}。`
    : "";
  return finalBanquetVigilFocusSpecWorld({
    target,
    pantaoQuestId,
    pantaoQuestTitle,
    hasPantaoPlot: Boolean(pantaoPlot),
    pantaoMature: Boolean(pantaoPlot?.mature),
    pantaoWatered: Boolean(pantaoPlot?.watered),
    remainingDays: growingRoute?.remainingDays ?? 0,
    routeText,
  });
}

export function finalBanquetAftermathFocusTargetWorld({
  target = null,
  pendingSettlement = null,
  previewOrder = null,
  previewOrderTitle = "",
  needStatus = null,
  cycle = null,
  firstWeekDone = false,
} = {}) {
  return finalBanquetAftermathFocusSpecWorld({
    target,
    pendingSettlement,
    previewOrderId: previewOrder?.order_id || "",
    previewOrderTitle,
    firstWeekDone,
    seasonActive: Boolean(cycle?.season),
    needReady: Boolean(needStatus?.completion >= 1),
    missingText: needStatus?.missing.slice(0, 2).join(" / ") || "几件体面货",
  });
}

export function finalBanquetVigilFocusSpecWorld({
  target = null,
  pantaoQuestId = "",
  pantaoQuestTitle = "",
  hasPantaoPlot = false,
  pantaoMature = false,
  pantaoWatered = false,
  remainingDays = 0,
  routeText = "",
} = {}) {
  if (!target) return null;
  return {
    selector: hasPantaoPlot
      ? "#selectedPlotCard"
      : `[data-main-quest-id="${selectorDataValue(pantaoQuestId)}"]`,
    fallbackSelector: hasPantaoPlot ? "#missionPanel" : "#finalSupportPanel",
    label: `点选异象：${target.label}`,
    log: hasPantaoPlot
      ? pantaoMature
        ? `${target.label} 已把万年蟠桃所在灵田高亮。果子已经熟了，先收下这一枚阵心果，再去把 ${pantaoQuestTitle} 真正接成宴席。${routeText}`
        : pantaoWatered
          ? `${target.label} 已把万年蟠桃所在灵田高亮。今晚水气已稳，还需约 ${remainingDays} 夜成熟；可以直接入夜推进，或先把终章支援再压实一点。${routeText}`
          : `${target.label} 已把万年蟠桃所在灵田高亮。今天这格还没续水，先补一轮水，让阵心别断了这口气。${routeText}`
      : `${target.label} 已把 ${pantaoQuestTitle} 定位到右侧。先确认终阵后的蟠桃种植与宴席准备，再把这一段终章亲手收完。`,
    panelGroup: "core",
    missingTitle: `点选异象：${target.label}`,
    missingLog: "阵心对应的灵田卡或终章任务卡暂时没有找到，先确认核心和任务分组是否可见。",
  };
}

export function finalBanquetAftermathFocusSpecWorld({
  target = null,
  pendingSettlement = false,
  previewOrderId = "",
  previewOrderTitle = "",
  firstWeekDone = false,
  seasonActive = false,
  needReady = false,
  missingText = "几件体面货",
} = {}) {
  if (!target) return null;
  const selector = pendingSettlement
    ? '[data-shop-season-board="settlement"]'
    : previewOrderId && !firstWeekDone
      ? `[data-year2-order-id="${selectorDataValue(previewOrderId)}"]`
      : seasonActive
        ? '[data-shop-season-board="rank"]'
        : previewOrderId
          ? `[data-year2-order-id="${selectorDataValue(previewOrderId)}"]`
          : "#goalBookPanel";
  const fallbackSelector = pendingSettlement || seasonActive || previewOrderId ? "#shopReport" : "#goalBookPanel";
  const log = pendingSettlement
    ? `${target.label} 已把右侧月评结算卡高亮。先领这一季的奖励，再看短板和下季建议，把宴后的名气真正接成长线生意。`
    : previewOrderId && !firstWeekDone
      ? `${target.label} 已把 ${previewOrderTitle} 定位到右侧。${needReady ? "宴后第一周的体面货已经齐了，可以直接接单。" : `还差 ${missingText}，先把第一周门面稳住。`}`
      : seasonActive
        ? `${target.label} 已把右侧名铺赛季榜高亮。镇上的宴灯已经变成持续开门的口碑，顺着评分、标签和预计奖励继续做生意就行。`
        : previewOrderId
          ? `${target.label} 已把下一张名铺单定位到右侧。${needReady ? "货已经齐了，可以继续接这桌后面的生意。" : `还差 ${missingText}，先把下一轮体面单补齐。`}`
          : `${target.label} 已把第二年目标入口点亮。先去目标册看新的长期收藏、经营和自由造景目标。`;

  return {
    selector,
    fallbackSelector,
    label: `点选异象：${target.label}`,
    log,
    panelGroup: "core",
    missingTitle: `点选异象：${target.label}`,
    missingLog: "宴后对应的订单、月评或目标入口暂时没有找到，先确认核心试玩分组是否可见。",
  };
}
