export function createInitialCohabStateData() {
  return {
    dailySeen: {},
    weeklyClaims: {},
    festivalClaims: {},
    activeBuffs: {},
    history: [],
  };
}

export function normalizeCohabStateData(cohabState = {}) {
  const defaults = createInitialCohabStateData();
  return {
    ...defaults,
    ...cohabState,
    dailySeen: { ...(cohabState.dailySeen || {}) },
    weeklyClaims: { ...(cohabState.weeklyClaims || {}) },
    festivalClaims: { ...(cohabState.festivalClaims || {}) },
    activeBuffs: { ...(cohabState.activeBuffs || {}) },
    history: Array.isArray(cohabState.history) ? cohabState.history.map((entry) => ({ ...entry })) : [],
  };
}

export function createInitialEcologyDailyStateData() {
  return {
    lastEventDay: 0,
    last: null,
    history: [],
    inspectionDay: 0,
    inspectedCombos: [],
    inspectionHistory: [],
  };
}

export function normalizeEcologyDailyStateData(ecologyDailyState = {}) {
  const defaults = createInitialEcologyDailyStateData();
  const inspectionDay = Number(ecologyDailyState.inspectionDay || 0);
  return {
    ...defaults,
    ...ecologyDailyState,
    lastEventDay: Number(ecologyDailyState.lastEventDay || 0),
    last: ecologyDailyState.last ? { ...ecologyDailyState.last } : null,
    history: Array.isArray(ecologyDailyState.history) ? ecologyDailyState.history.map((entry) => ({ ...entry })).slice(0, 8) : [],
    inspectionDay,
    inspectedCombos: Array.isArray(ecologyDailyState.inspectedCombos)
      ? [...new Set(ecologyDailyState.inspectedCombos.filter(Boolean))].slice(0, 12)
      : [],
    inspectionHistory: Array.isArray(ecologyDailyState.inspectionHistory)
      ? ecologyDailyState.inspectionHistory.map((entry) => ({ ...entry })).slice(0, 12)
      : [],
  };
}
