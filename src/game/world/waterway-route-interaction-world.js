import { selectorDataValue } from "../shared/selectors.js";

const WATERWAY_FIRST_ORDER_ID = "order_year2_water_0001";
const WATERWAY_FOLLOWUP_ORDER_ID = "order_year2_water_0002";
const LOTUS_BASIN_ROUTE_ID = "route_lotus_basin_03";

export function waterwayFreshRouteTargetWorld({
  active = false,
  followupDone = false,
  followupReady = false,
  returned = false,
  tradeDone = false,
  year2Open = false,
} = {}) {
  if (!active) return null;
  return {
    id: "qinghe_waterway_fresh_route",
    type: "waterway_fresh_route",
    label: followupDone
      ? "莲泽熟路长单"
      : followupReady
        ? "莲泽熟路续订"
        : returned
          ? "莲泽水航返货"
          : tradeDone
            ? "莲泽水航商船"
            : year2Open
              ? "水航鲜货单"
              : "水航鲜货路标",
    orderId: followupDone || followupReady ? WATERWAY_FOLLOWUP_ORDER_ID : WATERWAY_FIRST_ORDER_ID,
    rect: { x: 744, y: 470, width: 176, height: 104 },
  };
}

export function waterwayFreshRouteFocusTargetWorld({
  target = null,
  waterOrderTitle = "",
  followupOrderTitle = "",
  routeReturned = false,
  routePreviewState = null,
  routeRun = null,
  lotusRouteVisible = false,
  lotusUnlockConditionLabel = "",
  delivered = false,
  followupDelivered = false,
  unlocked = false,
  followupUnlocked = false,
  needStatus = null,
  followupNeedStatus = null,
} = {}) {
  return waterwayFreshRouteFocusSpecWorld({
    target,
    waterOrderTitle,
    followupOrderTitle,
    routeReturned,
    routePreviewReady: Boolean(routePreviewState?.ready),
    routePreviewUnlocked: Boolean(routePreviewState?.unlocked),
    routeFamiliarDetail: routePreviewState?.familiar?.detail || "",
    routeRunReturnDay: routeRun?.returnDay || 0,
    lotusRouteVisible,
    lotusUnlockConditionLabel,
    delivered,
    followupDelivered,
    unlocked,
    followupUnlocked,
    needReady: Boolean(needStatus?.completion >= 1),
    followupNeedReady: Boolean(followupNeedStatus?.completion >= 1),
    missingText: needStatus?.missing.slice(0, 2).join(" / ") || "水航莲实 / 荷露糖水",
    followupMissingText: followupNeedStatus?.missing.slice(0, 2).join(" / ") || "荷露糖水 / 灵池三鲜羹",
  });
}

export function waterwayFreshRouteFocusSpecWorld({
  target = null,
  waterOrderTitle = "",
  followupOrderTitle = "",
  routeReturned = false,
  routePreviewReady = false,
  routePreviewUnlocked = false,
  routeFamiliarDetail = "",
  routeRunReturnDay = 0,
  lotusRouteVisible = false,
  lotusUnlockConditionLabel = "",
  delivered = false,
  followupDelivered = false,
  unlocked = false,
  followupUnlocked = false,
  needReady = false,
  followupNeedReady = false,
  missingText = "水航莲实 / 荷露糖水",
  followupMissingText = "荷露糖水 / 灵池三鲜羹",
} = {}) {
  if (!target) return null;
  const targetLabel = target.label || "水航鲜货路标";
  const routeSelector = `[data-trade-route="${selectorDataValue(LOTUS_BASIN_ROUTE_ID)}"]`;
  const waterOrderSelector = `[data-year2-order-id="${selectorDataValue(WATERWAY_FIRST_ORDER_ID)}"]`;
  const followupOrderSelector = `[data-year2-order-id="${selectorDataValue(WATERWAY_FOLLOWUP_ORDER_ID)}"]`;
  const showRoute = routeReturned || (delivered && lotusRouteVisible);

  return {
    selector: followupUnlocked
      ? followupOrderSelector
      : showRoute
        ? routeSelector
        : unlocked
          ? waterOrderSelector
          : '[data-pond-action="catch"]',
    fallbackSelector: followupUnlocked
      ? "#shopReport"
      : showRoute
        ? "#spiritList"
        : unlocked
          ? "#shopReport"
          : ".build-panel",
    label: `点选水航：${targetLabel}`,
    log: followupUnlocked
      ? `${followupOrderTitle} 已在名铺订单预览里高亮。${followupNeedReady ? "续订货已经备齐，可以把莲泽熟路真正接成长期回单。" : `还差 ${followupMissingText}，先回灵池、水润田和工坊把熟路续货补厚。`}`
      : followupDelivered
        ? `${target.label || "莲泽熟路长单"} 已把莲泽水航商路线高亮。${followupOrderTitle || "莲泽熟路续订单"}已经完成，旧铺水鲜从第一趟返货变成长期回单。后续继续维持荷露糖水、灵池三鲜羹和水航莲实库存，就能把这条熟路养成稳定水鲜招牌。`
        : routeReturned
          ? `${target.label || "莲泽水航返货"} 已把莲泽水航商路线高亮。第一趟返货已经证明这条水路能跑熟，${routeFamiliarDetail || "熟路加成已经生效。"}${routeRunReturnDay ? `当前还有商队在途，第 ${routeRunReturnDay} 天返程。` : routePreviewReady ? "补给齐备，可以继续发一趟水航商队。" : "先补清凉饮和成套贸易包，再把这条熟路继续跑厚。"}`
          : delivered && lotusRouteVisible
            ? `${target.label || "莲泽水航商船"} 已把莲泽水航商路线高亮。水航鲜货单已经交付，${routePreviewUnlocked ? routePreviewReady ? "补给达标，可派精怪探路或发队。" : "商路已开，但清凉饮或成套贸易包还没备稳。" : `还需要 ${lotusUnlockConditionLabel}。`}`
            : delivered
              ? `${target.label || "莲泽水航商船"} 已把水路回响点亮。${waterOrderTitle || "灵池水航鲜货单"}已经交付，旧铺水鲜线现在真正接到了莲泽水航。后续可以继续围绕莲实、鱼鲜和水系饮品扩展更高阶商路。`
              : unlocked
                ? `${waterOrderTitle} 已在名铺订单预览里高亮。${needReady ? "水航鲜货已经备齐，可以把青禾这条后续订单接走。" : `还差 ${missingText}，先顺着灵池、水润田和工坊把水航补给备稳。`}`
                : `${target.label || "水航鲜货路标"} 已把灵池卡高亮。水鲜回订单已经把旧铺口碑接到河岸；等蟠桃大宴后、青禾五心和水航莲实都稳住，就会开出灵池水航鲜货单。`,
    panelGroup: showRoute || unlocked ? "core" : "systems",
    missingTitle: `点选水航：${targetLabel}`,
    missingLog: "水航对应的订单或灵池卡暂时没有找到，先确认核心试玩或系统深挖分组是否可见。",
  };
}
