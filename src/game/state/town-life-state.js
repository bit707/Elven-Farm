export function createInitialTownLifeInteractionStateData() {
  return {
    greetedByDay: {},
    errandsByDay: {},
    giftsByDay: {},
    interactionCounts: {},
    memoryByNpc: {},
    history: [],
    errandHistory: [],
    weatherErrandHistory: [],
    giftHistory: [],
    memoryHistory: [],
    shopMomentHistory: [],
    last: null,
    lastWeatherErrand: null,
    lastMemory: null,
    lastShopMoment: null,
  };
}

export function normalizeTownLifeShopMomentData(entry = null, options = {}) {
  if (!entry) return null;
  const day = Number(entry.day || options.day || 0);
  const npcId = entry.npcId || "";
  const itemId = entry.itemId || "";
  const title = entry.title || "旧铺后话";
  const area = entry.area || "凡仙镇";
  const npcNameFor = typeof options.npcName === "function" ? options.npcName : () => "";
  const itemNameFor = typeof options.itemName === "function" ? options.itemName : () => "";
  return {
    id: entry.id || [npcId || "npc", day, itemId || "item", title, area].join("|"),
    day,
    npcId,
    npcName: entry.npcName || npcNameFor(npcId) || "镇民",
    itemId,
    itemName: entry.itemName || (itemId ? itemNameFor(itemId) : "旧铺货"),
    count: Math.max(1, Number(entry.count || 1)),
    title,
    summary: entry.summary || "",
    detail: entry.detail || "",
    line: entry.line || "",
    area,
    rewardText: entry.rewardText || "",
    memoryTitle: entry.memoryTitle || "",
    sceneTag: entry.sceneTag || "",
    followup: entry.followup || "",
    favorAfter: Number(entry.favorAfter || 0),
    fresh: Boolean(entry.fresh),
  };
}

export function normalizeTownLifeInteractionStateData(townLifeInteractionState = {}, options = {}) {
  const defaults = createInitialTownLifeInteractionStateData();
  const normalizeShopMoment = (entry) => normalizeTownLifeShopMomentData(entry, options);
  return {
    ...defaults,
    ...townLifeInteractionState,
    greetedByDay: { ...(townLifeInteractionState.greetedByDay || {}) },
    errandsByDay: { ...(townLifeInteractionState.errandsByDay || {}) },
    giftsByDay: { ...(townLifeInteractionState.giftsByDay || {}) },
    interactionCounts: Object.fromEntries(Object.entries(townLifeInteractionState.interactionCounts || {}).map(([npcId, counts]) => [npcId, {
      greet: Number(counts?.greet || 0),
      errand: Number(counts?.errand || 0),
      gift: Number(counts?.gift || 0),
      total: Number(counts?.total || 0),
    }])),
    memoryByNpc: Object.fromEntries(Object.entries(townLifeInteractionState.memoryByNpc || {}).map(([npcId, memories]) => [npcId, { ...(memories || {}) }])),
    history: Array.isArray(townLifeInteractionState.history)
      ? townLifeInteractionState.history.map((entry) => ({ ...entry })).slice(0, 12)
      : [],
    errandHistory: Array.isArray(townLifeInteractionState.errandHistory)
      ? townLifeInteractionState.errandHistory.map((entry) => ({ ...entry })).slice(0, 12)
      : [],
    weatherErrandHistory: Array.isArray(townLifeInteractionState.weatherErrandHistory)
      ? townLifeInteractionState.weatherErrandHistory.map((entry) => ({ ...entry })).slice(0, 12)
      : [],
    giftHistory: Array.isArray(townLifeInteractionState.giftHistory)
      ? townLifeInteractionState.giftHistory.map((entry) => ({ ...entry })).slice(0, 16)
      : [],
    memoryHistory: Array.isArray(townLifeInteractionState.memoryHistory)
      ? townLifeInteractionState.memoryHistory.map((entry) => ({ ...entry })).slice(0, 16)
      : [],
    shopMomentHistory: Array.isArray(townLifeInteractionState.shopMomentHistory)
      ? townLifeInteractionState.shopMomentHistory.map(normalizeShopMoment).filter(Boolean).slice(0, 16)
      : [],
    last: townLifeInteractionState.last ? { ...townLifeInteractionState.last } : null,
    lastWeatherErrand: townLifeInteractionState.lastWeatherErrand ? { ...townLifeInteractionState.lastWeatherErrand } : null,
    lastMemory: townLifeInteractionState.lastMemory ? { ...townLifeInteractionState.lastMemory } : null,
    lastShopMoment: normalizeShopMoment(townLifeInteractionState.lastShopMoment),
  };
}
