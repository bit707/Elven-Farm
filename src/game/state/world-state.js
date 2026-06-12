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

export function pondWaterLevelSpecData(level = 1) {
  const map = {
    0: {
      level: 0,
      label: "浅水",
      shortLabel: "偏浅",
      cropDelta: -1,
      fishDelta: 0,
      autoWater: false,
      summary: "池边露出泥沿，适合歇水，但水生菜会吃亏。",
    },
    1: {
      level: 1,
      label: "平水",
      shortLabel: "正稳",
      cropDelta: 1,
      fishDelta: 0,
      autoWater: true,
      summary: "水线刚好压过田沟，最适合养露珠芹这类嫩水菜。",
    },
    2: {
      level: 2,
      label: "丰水",
      shortLabel: "偏满",
      cropDelta: 0,
      fishDelta: 1,
      autoWater: true,
      summary: "池水更深，灵鱼回得快，但嫩菜容易长得散。",
    },
  };
  return map[Math.max(0, Math.min(2, Number(level || 0)))] || map[1];
}

export function pondWaterLevelTextData(level = 1) {
  const spec = pondWaterLevelSpecData(level);
  return `${spec.label} · ${spec.summary}`;
}

export function pondLotusStageTextData(stage = "none") {
  const map = {
    none: "水面还在养静气",
    bud: "月白莲苞刚冒头",
    bloom: "月白莲已经开稳",
  };
  return map[stage] || map.none;
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
