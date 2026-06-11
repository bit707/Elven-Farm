import { selectorDataValue } from "../shared/selectors.js";
import {
  careChainJournalFocusSpecWorld,
  compendiumMonumentFocusSpecWorld,
  shopSeasonFocusSpecWorld,
  solarTrialFocusSpecWorld,
  year2OrderPrepFocusSpecWorld,
} from "./goalbook-world.js";

function addTarget(targets, target) {
  if (target) targets.push(target);
}

export function careChainRecentEventTargetWorld({
  recentEvent = null,
} = {}) {
  if (!recentEvent) return null;
  return {
    id: "care_chain_recent_event",
    type: "care_chain_recent_event",
    label: "照应阶段余温",
    eventId: recentEvent.eventId || "",
    rect: { x: 678, y: 304, width: 224, height: 82 },
  };
}

export function goalbookInteractionTargetsWorld({
  compendiumTarget = null,
  careChainJournalTarget = null,
  careChainRecentEvent = null,
  year2OrderTarget = null,
  shopSeasonTarget = null,
  solarTrialTarget = null,
} = {}) {
  const targets = [];
  addTarget(targets, compendiumTarget);
  addTarget(targets, careChainJournalTarget);
  addTarget(targets, careChainRecentEventTargetWorld({ recentEvent: careChainRecentEvent }));
  addTarget(targets, year2OrderTarget);
  addTarget(targets, shopSeasonTarget);
  addTarget(targets, solarTrialTarget);
  return targets;
}

export function careChainJournalFocusTargetWorld({
  target = null,
  chainState = null,
} = {}) {
  return careChainJournalFocusSpecWorld({
    target,
    streak: Number(chainState?.streak || 0),
    bestStreak: Number(chainState?.bestStreak || 0),
  });
}

export function compendiumMonumentFocusTargetWorld({
  target = null,
  pageKey = "",
  pageTitle = "",
} = {}) {
  return compendiumMonumentFocusSpecWorld({
    target,
    selector: pageKey ? `[data-dungeon-memory-open="${selectorDataValue(pageKey)}"]` : "#goalBookPanel",
    pageTitle,
  });
}

export function year2OrderPrepFocusTargetWorld({
  target = null,
  orderId = "",
  orderTitle = "",
  needStatus = null,
} = {}) {
  return year2OrderPrepFocusSpecWorld({
    target,
    selector: `[data-year2-order-id="${selectorDataValue(orderId)}"]`,
    orderTitle,
    completion: Number(needStatus?.completion || 0),
    missingText: needStatus?.missing.slice(0, 2).join(" / ") || "",
  });
}

export function shopSeasonFocusTargetWorld({
  target = null,
  pendingSettlement = false,
} = {}) {
  return shopSeasonFocusSpecWorld({
    target,
    pendingSettlement,
  });
}

export function solarTrialFocusTargetWorld({
  target = null,
  trialId = "",
  trialName = "",
  activeDayIndex = 0,
  challengeDays = 0,
  supportSummary = "",
} = {}) {
  return solarTrialFocusSpecWorld({
    target,
    selector: `[data-solar-trial="${selectorDataValue(trialId)}"]`,
    trialName,
    activeDayIndex,
    challengeDays,
    supportSummary,
  });
}
