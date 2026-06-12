export function createInitialCareChainStateData() {
  return {
    streak: 0,
    bestStreak: 0,
    stage: "none",
    stageName: "照应未成线",
    lastDay: 0,
    lastSummary: "",
    lastTitle: "",
    claimedEventIds: [],
    lastEvent: null,
    eventHistory: [],
    history: [],
  };
}

export function careChainStageForStreakData(streak = 0) {
  const days = Math.max(0, Math.floor(Number(streak || 0)));
  if (days >= 7) return { stage: "town_hears", stageName: "凡仙镇也听见", tier: 5, nextAt: null, bloom: 5 };
  if (days >= 5) return { stage: "rooted", stageName: "洞天生机有根", tier: 4, nextAt: 7, bloom: 4 };
  if (days >= 3) return { stage: "woven", stageName: "三日成线", tier: 3, nextAt: 5, bloom: 3 };
  if (days >= 2) return { stage: "linked", stageName: "两日照应接上", tier: 2, nextAt: 3, bloom: 2 };
  if (days >= 1) return { stage: "first", stageName: "今日照应起笔", tier: 1, nextAt: 2, bloom: 1 };
  return { stage: "none", stageName: "照应未成线", tier: 0, nextAt: 1, bloom: 0 };
}

function normalizeCareChainEvent(entry = {}) {
  return {
    eventId: String(entry.eventId || ""),
    day: Math.max(0, Math.floor(Number(entry.day || 0))),
    title: String(entry.title || ""),
    detail: String(entry.detail || ""),
    rewardText: String(entry.rewardText || ""),
    stageName: String(entry.stageName || ""),
    streak: Math.max(0, Math.floor(Number(entry.streak || 0))),
  };
}

function normalizeCareChainHistoryEntry(entry = {}) {
  return {
    day: Math.max(0, Math.floor(Number(entry.day || 0))),
    streak: Math.max(0, Math.floor(Number(entry.streak || 0))),
    stageName: String(entry.stageName || ""),
    title: String(entry.title || ""),
    summary: String(entry.summary || ""),
    activeCount: Math.max(0, Math.floor(Number(entry.activeCount || 0))),
    complete: Boolean(entry.complete),
  };
}

export function normalizeCareChainStateData(careChainState = {}) {
  const defaults = createInitialCareChainStateData();
  const streak = Math.max(0, Math.floor(Number(careChainState.streak || 0)));
  const bestStreak = Math.max(streak, Math.floor(Number(careChainState.bestStreak || 0)));
  const stage = careChainStageForStreakData(streak);
  return {
    ...defaults,
    ...careChainState,
    streak,
    bestStreak,
    stage: stage.stage,
    stageName: stage.stageName,
    tier: stage.tier,
    nextAt: stage.nextAt,
    bloom: stage.bloom,
    lastDay: Math.max(0, Math.floor(Number(careChainState.lastDay || 0))),
    lastSummary: String(careChainState.lastSummary || ""),
    lastTitle: String(careChainState.lastTitle || ""),
    claimedEventIds: Array.isArray(careChainState.claimedEventIds) ? [...new Set(careChainState.claimedEventIds.map(String).filter(Boolean))] : [],
    lastEvent: careChainState.lastEvent ? normalizeCareChainEvent(careChainState.lastEvent) : null,
    eventHistory: (Array.isArray(careChainState.eventHistory) ? careChainState.eventHistory : []).slice(0, 8).map(normalizeCareChainEvent),
    history: (Array.isArray(careChainState.history) ? careChainState.history : []).slice(0, 8).map(normalizeCareChainHistoryEntry),
  };
}
