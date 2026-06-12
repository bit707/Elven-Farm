export function createInitialRareSpiritLifeStateData() {
  return {
    cycleKey: "",
    momentsBySpirit: {},
    claimedGiftDays: {},
    history: [],
  };
}

export function normalizeRareSpiritLifeStateData(rareSpiritLifeState = {}) {
  const defaults = createInitialRareSpiritLifeStateData();
  return {
    ...defaults,
    ...rareSpiritLifeState,
    momentsBySpirit: Object.fromEntries(
      Object.entries(rareSpiritLifeState.momentsBySpirit || {}).map(([spiritId, moment]) => [spiritId, { ...moment }]),
    ),
    claimedGiftDays: { ...(rareSpiritLifeState.claimedGiftDays || {}) },
    history: Array.isArray(rareSpiritLifeState.history) ? rareSpiritLifeState.history.map((entry) => ({ ...entry })) : [],
  };
}

export function createInitialSpiritSproutStateData() {
  return {
    stage: "none",
    firstSignalDay: 0,
    peekDay: 0,
    birthDay: 0,
    lastPlot: null,
    history: [],
  };
}

export function normalizeSpiritSproutStateData(spiritSproutState = {}) {
  const defaults = createInitialSpiritSproutStateData();
  return {
    ...defaults,
    ...spiritSproutState,
    lastPlot: spiritSproutState.lastPlot ? { ...spiritSproutState.lastPlot } : null,
    history: Array.isArray(spiritSproutState.history) ? spiritSproutState.history.map((entry) => ({ ...entry })) : [],
  };
}
