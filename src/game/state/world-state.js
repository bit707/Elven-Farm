export function createInitialWorkshopAromaStateData() {
  return {
    recipeId: "",
    itemId: "",
    itemName: "",
    day: 0,
    orderUnlocked: false,
    liveFocus: null,
    history: [],
  };
}

export function normalizeWorkshopAromaStateData(workshopAromaState = {}) {
  const defaults = createInitialWorkshopAromaStateData();
  return {
    ...defaults,
    ...workshopAromaState,
    liveFocus: workshopAromaState.liveFocus ? { ...workshopAromaState.liveFocus } : null,
    history: Array.isArray(workshopAromaState.history) ? workshopAromaState.history.map((entry) => ({ ...entry })) : [],
  };
}

export function createInitialSpiritInteractionStateData() {
  return {
    unlocked: false,
    firstDay: 0,
    last: null,
    floatingText: "",
    moodRepairEvent: null,
    moodRepairHistory: [],
    history: [],
  };
}

export function normalizeSpiritInteractionStateData(spiritInteractionState = {}) {
  const defaults = createInitialSpiritInteractionStateData();
  return {
    ...defaults,
    ...spiritInteractionState,
    last: spiritInteractionState.last ? { ...spiritInteractionState.last } : null,
    moodRepairEvent: spiritInteractionState.moodRepairEvent ? { ...spiritInteractionState.moodRepairEvent } : null,
    moodRepairHistory: Array.isArray(spiritInteractionState.moodRepairHistory) ? spiritInteractionState.moodRepairHistory.map((entry) => ({ ...entry })).slice(0, 8) : [],
    history: Array.isArray(spiritInteractionState.history) ? spiritInteractionState.history.map((entry) => ({ ...entry })).slice(0, 10) : [],
  };
}

export function createInitialCanalRestorationStateData() {
  return {
    restored: false,
    day: 0,
    expandedPlots: 0,
    unlockedSeedId: "",
    unlockedSeedName: "",
    seedGiftCount: 0,
    waterCropUnlocked: false,
    last: null,
    history: [],
  };
}

export function normalizeCanalRestorationStateData(canalRestorationState = {}) {
  const defaults = createInitialCanalRestorationStateData();
  return {
    ...defaults,
    ...canalRestorationState,
    last: canalRestorationState.last ? { ...canalRestorationState.last } : null,
    history: Array.isArray(canalRestorationState.history) ? canalRestorationState.history.map((entry) => ({ ...entry })).slice(0, 8) : [],
  };
}

export function createInitialPondStateData() {
  return {
    unlocked: false,
    builtDay: 0,
    waterLevel: 1,
    waterControlUnlocked: false,
    waterControlMastery: false,
    sereneDays: 0,
    nightWaterCropCareDays: 0,
    restRespiteNights: 0,
    lastRestRespiteDay: 0,
    lastRestRespiteSpiritCount: 0,
    lotusStage: "none",
    lastBlessingDay: 0,
    lastEcologyEvent: null,
    ecologyHistory: [],
    firstCatchDone: false,
    lastCatchDay: 0,
    lastCatch: null,
    history: [],
  };
}

export function normalizePondStateData(pondState = {}) {
  const defaults = createInitialPondStateData();
  return {
    ...defaults,
    ...pondState,
    waterLevel: Math.max(0, Math.min(2, Number(pondState.waterLevel ?? defaults.waterLevel))),
    waterControlUnlocked: Boolean(pondState.waterControlUnlocked),
    waterControlMastery: Boolean(pondState.waterControlMastery),
    sereneDays: Math.max(0, Number(pondState.sereneDays || 0)),
    nightWaterCropCareDays: Math.max(0, Number(pondState.nightWaterCropCareDays || 0)),
    restRespiteNights: Math.max(0, Number(pondState.restRespiteNights || 0)),
    lastRestRespiteDay: Math.max(0, Number(pondState.lastRestRespiteDay || 0)),
    lastRestRespiteSpiritCount: Math.max(0, Number(pondState.lastRestRespiteSpiritCount || 0)),
    lotusStage: ["none", "bud", "bloom"].includes(pondState.lotusStage) ? pondState.lotusStage : defaults.lotusStage,
    lastBlessingDay: Math.max(0, Number(pondState.lastBlessingDay || 0)),
    lastEcologyEvent: pondState.lastEcologyEvent ? { ...pondState.lastEcologyEvent } : null,
    ecologyHistory: Array.isArray(pondState.ecologyHistory) ? pondState.ecologyHistory.map((entry) => ({ ...entry })).slice(0, 8) : [],
    lastCatch: pondState.lastCatch ? { ...pondState.lastCatch } : null,
    history: Array.isArray(pondState.history) ? pondState.history.map((entry) => ({ ...entry })).slice(0, 8) : [],
  };
}

export function createInitialDengyingLanternStateData() {
  return {
    lastRevealDay: 0,
    revealUsedDay: 0,
    revealedRotationId: "",
    revealedAreaId: "",
    revealedThemeTag: "",
    revealedRewardFocus: "",
    revealedEntryModifier: "",
    history: [],
  };
}

export function normalizeDengyingLanternStateData(lanternState = {}) {
  const defaults = createInitialDengyingLanternStateData();
  return {
    ...defaults,
    ...lanternState,
    lastRevealDay: Math.max(0, Number(lanternState.lastRevealDay || 0)),
    revealUsedDay: Math.max(0, Number(lanternState.revealUsedDay || 0)),
    revealedRotationId: String(lanternState.revealedRotationId || ""),
    revealedAreaId: String(lanternState.revealedAreaId || ""),
    revealedThemeTag: String(lanternState.revealedThemeTag || ""),
    revealedRewardFocus: String(lanternState.revealedRewardFocus || ""),
    revealedEntryModifier: String(lanternState.revealedEntryModifier || ""),
    history: Array.isArray(lanternState.history) ? lanternState.history.map((entry) => ({ ...entry })).slice(0, 8) : [],
  };
}
