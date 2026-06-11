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
