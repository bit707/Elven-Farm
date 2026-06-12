export function createInitialGoalBookState() {
  return {
    year2Claims: {},
    freeplayClaims: {},
    ecologyClaims: {},
    lifeCodexFilter: "all",
    daily: {
      cycleKey: "day:1",
      spiritCareCount: 0,
      ordersDelivered: 0,
      expeditionsSent: 0,
    },
    weekly: {
      cycleKey: "week:0",
      expeditionComplete: 0,
    },
    seasonal: {
      cycleKey: "term:term_lichun",
      flowerThemeCount: 0,
      lanternDungeonClears: 0,
    },
    lifetime: {
      expeditionComplete: 0,
      solarTrialRankACount: 0,
    },
  };
}

export function normalizeGoalBookState(goalBookState = {}) {
  const defaults = createInitialGoalBookState();
  return {
    ...defaults,
    ...goalBookState,
    year2Claims: { ...(goalBookState.year2Claims || {}) },
    freeplayClaims: { ...(goalBookState.freeplayClaims || {}) },
    ecologyClaims: { ...(goalBookState.ecologyClaims || {}) },
    daily: { ...defaults.daily, ...(goalBookState.daily || {}) },
    weekly: { ...defaults.weekly, ...(goalBookState.weekly || {}) },
    seasonal: { ...defaults.seasonal, ...(goalBookState.seasonal || {}) },
    lifetime: { ...defaults.lifetime, ...(goalBookState.lifetime || {}) },
  };
}
