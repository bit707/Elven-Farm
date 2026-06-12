export function createEmptyShopSeasonCycleStats() {
  return {
    sales: 0,
    soldCount: 0,
    visitors: 0,
    buyers: 0,
    positive: 0,
    themeTotal: 0,
    sessions: 0,
    itemSales: {},
    customerVisits: {},
    customerBuys: {},
    themeUsage: {},
    diagnosisCounts: {},
    stockWarnings: 0,
    stockSafeSessions: 0,
  };
}

export function createInitialShopStats() {
  return {
    sales: 0,
    soldCount: 0,
    visitors: 0,
    buyers: 0,
    positive: 0,
    themeTotal: 0,
    sessions: 0,
    itemSales: {},
    customerVisits: {},
    customerBuys: {},
    themeUsage: {},
    diagnosisCounts: {},
    stockWarnings: 0,
    stockSafeSessions: 0,
    seasonScoreBoosts: {},
    ledgerMemoryPages: [],
    currentSeasonId: "season_shop_001",
    currentCycleStartDay: 1,
    season: createEmptyShopSeasonCycleStats(),
    history: [],
    pendingSettlement: null,
    activeBuffs: {},
    wordOfMouth: null,
    wordOfMouthHistory: [],
    honeyTeaParty: createInitialHoneyTeaPartyState(),
  };
}

export function createInitialShopWordOfMouthState() {
  return {
    id: "",
    sourceType: "returning",
    createdDay: 0,
    activeDay: 0,
    expiresDay: 0,
    hotTag: "",
    hotTagLabel: "",
    leadItemName: "",
    sourceLabels: [],
    preferredArchetypes: [],
    preferredLabels: [],
    introducedCount: 0,
    returningCount: 0,
    soldCount: 0,
    visitorBonus: 0,
    budgetBonus: 0,
    visitBias: 0,
    tagVisitBias: 0,
    tagBudgetBonus: 0,
    headline: "",
    summary: "",
    detail: "",
    nextAction: "",
    tone: "note",
  };
}

export function normalizeShopWordOfMouth(entry = null) {
  if (!entry) return null;
  const defaults = createInitialShopWordOfMouthState();
  return {
    ...defaults,
    ...entry,
    createdDay: Number(entry.createdDay || 0),
    activeDay: Number(entry.activeDay || 0),
    expiresDay: Number(entry.expiresDay || 0),
    introducedCount: Number(entry.introducedCount || 0),
    returningCount: Number(entry.returningCount || 0),
    soldCount: Number(entry.soldCount || 0),
    visitorBonus: Number(entry.visitorBonus || 0),
    budgetBonus: Number(entry.budgetBonus || 0),
    visitBias: Number(entry.visitBias || 0),
    tagVisitBias: Number(entry.tagVisitBias || 0),
    tagBudgetBonus: Number(entry.tagBudgetBonus || 0),
    sourceLabels: Array.isArray(entry.sourceLabels) ? entry.sourceLabels.map(String).filter(Boolean).slice(0, 4) : [],
    preferredArchetypes: Array.isArray(entry.preferredArchetypes) ? entry.preferredArchetypes.map(String).filter(Boolean).slice(0, 5) : [],
    preferredLabels: Array.isArray(entry.preferredLabels) ? entry.preferredLabels.map(String).filter(Boolean).slice(0, 5) : [],
  };
}

export function cloneShopSeasonCycleStats(stats = {}) {
  return {
    ...createEmptyShopSeasonCycleStats(),
    ...stats,
    itemSales: { ...(stats.itemSales || {}) },
    customerVisits: { ...(stats.customerVisits || {}) },
    customerBuys: { ...(stats.customerBuys || {}) },
    themeUsage: { ...(stats.themeUsage || {}) },
    diagnosisCounts: { ...(stats.diagnosisCounts || {}) },
  };
}

export function cloneShopSeasonSettlement(settlement = null) {
  if (!settlement) return null;
  return {
    ...settlement,
    focusTags: Array.isArray(settlement.focusTags) ? [...settlement.focusTags] : [],
    parts: Array.isArray(settlement.parts) ? settlement.parts.map((part) => ({ ...part })) : [],
    reward: settlement.reward ? { ...settlement.reward } : null,
  };
}

export function createInitialHoneyTeaPartyState() {
  return {
    lastHostedDay: 0,
    activeDay: 0,
    lastBoostedCustomers: 0,
    lastDessertSales: 0,
    history: [],
  };
}

export function normalizeHoneyTeaPartyState(honeyTeaParty = {}) {
  const defaults = createInitialHoneyTeaPartyState();
  return {
    ...defaults,
    ...honeyTeaParty,
    lastHostedDay: Number(honeyTeaParty.lastHostedDay || 0),
    activeDay: Number(honeyTeaParty.activeDay || 0),
    lastBoostedCustomers: Number(honeyTeaParty.lastBoostedCustomers || 0),
    lastDessertSales: Number(honeyTeaParty.lastDessertSales || 0),
    history: Array.isArray(honeyTeaParty.history) ? honeyTeaParty.history.map((entry) => ({ ...entry })).slice(0, 8) : [],
  };
}

export function normalizeShopStats(stats = {}) {
  const defaults = createInitialShopStats();
  return {
    ...defaults,
    ...stats,
    itemSales: { ...(stats.itemSales || {}) },
    customerVisits: { ...(stats.customerVisits || {}) },
    customerBuys: { ...(stats.customerBuys || {}) },
    themeUsage: { ...(stats.themeUsage || {}) },
    diagnosisCounts: { ...(stats.diagnosisCounts || {}) },
    stockWarnings: Number(stats.stockWarnings || 0),
    stockSafeSessions: Number(stats.stockSafeSessions || 0),
    seasonScoreBoosts: { ...(stats.seasonScoreBoosts || {}) },
    ledgerMemoryPages: Array.isArray(stats.ledgerMemoryPages) ? stats.ledgerMemoryPages.map((entry) => ({ ...entry })).slice(0, 8) : [],
    season: cloneShopSeasonCycleStats(stats.season),
    history: Array.isArray(stats.history) ? stats.history.map((entry) => cloneShopSeasonSettlement(entry)).slice(0, 12) : [],
    pendingSettlement: cloneShopSeasonSettlement(stats.pendingSettlement),
    activeBuffs: { ...(stats.activeBuffs || {}) },
    wordOfMouth: normalizeShopWordOfMouth(stats.wordOfMouth),
    wordOfMouthHistory: Array.isArray(stats.wordOfMouthHistory)
      ? stats.wordOfMouthHistory.map((entry) => normalizeShopWordOfMouth(entry)).filter(Boolean).slice(0, 8)
      : [],
    honeyTeaParty: normalizeHoneyTeaPartyState(stats.honeyTeaParty),
    currentSeasonId: stats.currentSeasonId || defaults.currentSeasonId,
    currentCycleStartDay: Number(stats.currentCycleStartDay || defaults.currentCycleStartDay),
  };
}
