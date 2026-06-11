import { selectorDataValue } from "../shared/selectors.js";
import {
  droughtStoryFocusSpecWorld,
  lanternRouteFocusSpecWorld,
  missionArcFocusSpecWorld,
  shopSpecialFocusSpecWorld,
  tradeRouteFocusSpecWorld,
} from "./world-change-interaction-world.js";

export function shopSpecialFocusTargetWorld({
  target = null,
  year2Open = false,
  honeyFeastActive = false,
  ledgerFinalActive = false,
  ledgerStockWarningActive = false,
} = {}) {
  return shopSpecialFocusSpecWorld({
    target,
    selector: `[data-shop-season-board="${selectorDataValue(target?.board || "rank")}"]`,
    year2Open,
    honeyFeastActive,
    ledgerFinalActive,
    ledgerStockWarningActive,
  });
}

export function missionArcFocusTargetWorld({
  target = null,
  questTitle = "",
  questStarted = false,
  finalNestReady = false,
} = {}) {
  return missionArcFocusSpecWorld({
    target,
    selector: `[data-main-quest-id="${selectorDataValue(target?.questId || "")}"]`,
    questTitle,
    questStarted,
    finalNestReady,
  });
}

export function droughtStoryFocusTargetWorld({
  target = null,
  reliefDelivered = false,
  orderVisible = false,
  orderTitle = "",
  needText = "",
  hintCta = "",
  orderId = "",
  questId = "",
} = {}) {
  const selector = !reliefDelivered && orderVisible
    ? `[data-order-card-id="${selectorDataValue(orderId)}"]`
    : `[data-main-quest-id="${selectorDataValue(questId)}"]`;
  const fallbackSelector = !reliefDelivered && orderVisible ? "#orderPanel" : "#missionPanel";
  return droughtStoryFocusSpecWorld({
    target,
    selector,
    fallbackSelector,
    reliefDelivered,
    orderVisible,
    orderTitle,
    needText,
    hintCta,
  });
}

export function tradeRouteFocusTargetWorld({
  target = null,
  routeName = "",
  activeReturnDay = 0,
  previewUnlocked = false,
  previewReady = false,
  missingSupply = "",
  unlockConditionLabel = "",
} = {}) {
  return tradeRouteFocusSpecWorld({
    target,
    selector: `[data-trade-route="${selectorDataValue(target?.routeId || "")}"]`,
    routeName,
    activeReturnDay,
    previewUnlocked,
    previewReady,
    missingSupply,
    unlockConditionLabel,
  });
}

export function lanternRouteFocusTargetWorld({
  target = null,
  revealed = false,
  lanternCardVisible = false,
  revealedDungeonName = "",
  bondFinalDone = false,
  revealReady = false,
} = {}) {
  const selector = revealed
    ? '[data-dungeon-reveal-card="hidden_rotation"]'
    : lanternCardVisible
      ? '[data-shop-season-board="lantern"]'
      : "#dungeonPanel";
  const fallbackSelector = revealed ? "#dungeonPanel" : lanternCardVisible ? "#shopReport" : "#dungeonPanel";
  return lanternRouteFocusSpecWorld({
    target,
    selector,
    fallbackSelector,
    revealedDungeonName,
    lanternCardVisible,
    bondFinalDone,
    revealReady,
  });
}
