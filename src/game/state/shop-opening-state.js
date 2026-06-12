export function createInitialShopOpeningStateData() {
  return {
    opened: false,
    firstOpenDay: 0,
    firstSaleDay: 0,
    summaryUnlocked: false,
    hotTag: "",
    hotTagLabel: "",
    needBubbles: [],
    firstSale: null,
    lastSession: null,
    liveFocus: null,
    failureRecovery: null,
    customerDecisionLedger: null,
    regularBoard: null,
    returningCustomers: [],
    introducedCustomers: [],
    visitPledge: null,
    townErrand: null,
    restockTarget: null,
    restockHistory: [],
    history: [],
  };
}

export function normalizeShopRestockTargetData(target = null, options = {}) {
  if (!target) return null;
  const itemId = target.itemId || "";
  const day = Number(options.day || 1);
  const itemNameFor = typeof options.itemName === "function" ? options.itemName : () => "";
  const createdDay = Number(target.createdDay || target.day || day);
  return {
    id: target.id || `shop_restock_${itemId || "goods"}_${createdDay}`,
    itemId,
    itemName: target.itemName || (itemId ? itemNameFor(itemId) : "可卖货"),
    desiredCount: Math.max(1, Number(target.desiredCount || 1)),
    createdDay,
    dueDay: Number(target.dueDay || createdDay + 2),
    source: target.source || "customer_focus",
    reason: target.reason || "",
    note: target.note || "",
    status: target.status || "active",
    completedDay: Number(target.completedDay || 0),
    canceledDay: Number(target.canceledDay || 0),
  };
}

export function normalizeShopCustomerDecisionLedgerData(ledger = null, options = {}) {
  if (!ledger) return null;
  const day = Number(options.day || 0);
  const shopTagLabelFor = typeof options.shopTagLabel === "function" ? options.shopTagLabel : () => "";
  return {
    day: Number(ledger.day || day),
    title: ledger.title || "顾客决策账页",
    headline: ledger.headline || "旧铺还在等一条清楚的成交理由",
    mainCustomer: ledger.mainCustomer || "客群未定",
    mainCustomerArchetype: ledger.mainCustomerArchetype || "",
    hotTag: ledger.hotTag || "",
    hotTagLabel: ledger.hotTagLabel || (ledger.hotTag ? shopTagLabelFor(ledger.hotTag) : "应季货"),
    visitors: Number(ledger.visitors || 0),
    buyers: Number(ledger.buyers || 0),
    leavers: Number(ledger.leavers || 0),
    sales: Number(ledger.sales || 0),
    conversion: Number(ledger.conversion || 0),
    themeName: ledger.themeName || "",
    themeScore: Number(ledger.themeScore || 0),
    summaryLines: Array.isArray(ledger.summaryLines) ? ledger.summaryLines.map(String).slice(0, 3) : [],
    chains: Array.isArray(ledger.chains) ? ledger.chains.map((entry) => ({ ...entry })).slice(0, 4) : [],
    blockers: Array.isArray(ledger.blockers) ? ledger.blockers.map((entry) => ({ ...entry })).slice(0, 3) : [],
    nextAction: ledger.nextAction || "",
    mood: ledger.mood || "",
    evidence: ledger.evidence || "",
  };
}

export function normalizeShopRegularBoardData(board = null, options = {}) {
  if (!board) return null;
  const shopTagLabelFor = typeof options.shopTagLabel === "function" ? options.shopTagLabel : () => "";
  const customerDisplayNameFor = typeof options.customerDisplayName === "function" ? options.customerDisplayName : () => "";
  return {
    title: board.title || "熟客留言墙",
    headline: board.headline || "",
    summary: board.summary || "",
    nextAction: board.nextAction || "",
    hotTag: board.hotTag || "",
    hotTagLabel: board.hotTagLabel || (board.hotTag ? shopTagLabelFor(board.hotTag) : ""),
    rows: Array.isArray(board.rows)
      ? board.rows.map((row) => ({
        customerArchetype: row.customerArchetype || "",
        customerLabel: row.customerLabel || customerDisplayNameFor(row.customerArchetype || "") || "来客",
        visits: Number(row.visits || 0),
        buys: Number(row.buys || 0),
        chance: Number(row.chance || 0),
        headline: row.headline || "",
        quote: row.quote || "",
        detail: row.detail || "",
        metricsText: row.metricsText || "",
        tone: row.tone || "note",
      })).slice(0, 3)
      : [],
  };
}

export function normalizeShopReturningCustomerVisitData(entry = null, options = {}) {
  if (!entry) return null;
  const customerDisplayNameFor = typeof options.customerDisplayName === "function" ? options.customerDisplayName : () => "";
  const itemNameFor = typeof options.itemName === "function" ? options.itemName : () => "";
  return {
    customerArchetype: entry.customerArchetype || "",
    customerLabel: entry.customerLabel || customerDisplayNameFor(entry.customerArchetype || "") || "来客",
    chance: Number(entry.chance || 0),
    headline: entry.headline || "",
    needText: entry.needText || "",
    arrivalText: entry.arrivalText || "",
    detail: entry.detail || "",
    quote: entry.quote || "",
    bought: Boolean(entry.bought),
    itemId: entry.itemId || "",
    itemName: entry.itemName || (entry.itemId ? itemNameFor(entry.itemId) : ""),
    resultText: entry.resultText || "",
    tone: entry.tone || (entry.bought ? "good" : "mid"),
  };
}

export function normalizeShopIntroducedCustomerVisitData(entry = null, options = {}) {
  if (!entry) return null;
  const customerDisplayNameFor = typeof options.customerDisplayName === "function" ? options.customerDisplayName : () => "";
  const itemNameFor = typeof options.itemName === "function" ? options.itemName : () => "";
  return {
    hostArchetype: entry.hostArchetype || "",
    hostLabel: entry.hostLabel || customerDisplayNameFor(entry.hostArchetype || "") || "熟客",
    customerArchetype: entry.customerArchetype || "",
    customerLabel: entry.customerLabel || customerDisplayNameFor(entry.customerArchetype || "") || "新客",
    chance: Number(entry.chance || entry.hostChance || 0),
    headline: entry.headline || "",
    needText: entry.needText || "",
    arrivalText: entry.arrivalText || "",
    detail: entry.detail || "",
    quote: entry.quote || "",
    broughtByText: entry.broughtByText || "",
    bought: Boolean(entry.bought),
    itemId: entry.itemId || "",
    itemName: entry.itemName || (entry.itemId ? itemNameFor(entry.itemId) : ""),
    resultText: entry.resultText || "",
    tone: entry.tone || (entry.bought ? "good" : "mid"),
  };
}

export function normalizeShopVisitPledgeData(entry = null, options = {}) {
  if (!entry) return null;
  const customerDisplayNameFor = typeof options.customerDisplayName === "function" ? options.customerDisplayName : () => "";
  const shopTagLabelFor = typeof options.shopTagLabel === "function" ? options.shopTagLabel : () => "";
  const itemNameFor = typeof options.itemName === "function" ? options.itemName : () => "";
  return {
    id: entry.id || "",
    status: entry.status || "active",
    createdDay: Number(entry.createdDay || 0),
    activeDay: Number(entry.activeDay || 0),
    dueDay: Number(entry.dueDay || 0),
    customerArchetype: entry.customerArchetype || "",
    customerLabel: entry.customerLabel || customerDisplayNameFor(entry.customerArchetype || "") || "来客",
    sourceLabel: entry.sourceLabel || "",
    hotTag: entry.hotTag || "",
    hotTagLabel: entry.hotTagLabel || (entry.hotTag ? shopTagLabelFor(entry.hotTag) : ""),
    targetItemId: entry.targetItemId || "",
    targetItemName: entry.targetItemName || (entry.targetItemId ? itemNameFor(entry.targetItemId) : ""),
    rewardGold: Number(entry.rewardGold || 0),
    rewardFame: Number(entry.rewardFame || 0),
    headline: entry.headline || "",
    detail: entry.detail || "",
    cta: entry.cta || "",
    note: entry.note || "",
    resultText: entry.resultText || "",
    fulfilledDay: Number(entry.fulfilledDay || 0),
    expiredDay: Number(entry.expiredDay || 0),
    tone: entry.tone || "mid",
  };
}

export function normalizeShopTownErrandData(entry = null, options = {}) {
  if (!entry) return null;
  const npcNameFor = typeof options.npcName === "function" ? options.npcName : () => "";
  const customerDisplayNameFor = typeof options.customerDisplayName === "function" ? options.customerDisplayName : () => "";
  const shopTagLabelFor = typeof options.shopTagLabel === "function" ? options.shopTagLabel : () => "";
  const itemNameFor = typeof options.itemName === "function" ? options.itemName : () => "";
  return {
    id: entry.id || "",
    status: entry.status || "active",
    createdDay: Number(entry.createdDay || 0),
    activeDay: Number(entry.activeDay || 0),
    dueDay: Number(entry.dueDay || 0),
    npcId: entry.npcId || "",
    npcLabel: entry.npcLabel || npcNameFor(entry.npcId || "") || "镇民",
    areaLabel: entry.areaLabel || "凡仙镇",
    sourceLabel: entry.sourceLabel || "",
    customerLabel: entry.customerLabel || customerDisplayNameFor(entry.customerArchetype || "") || "来客",
    hotTag: entry.hotTag || "",
    hotTagLabel: entry.hotTagLabel || (entry.hotTag ? shopTagLabelFor(entry.hotTag) : ""),
    requestItemId: entry.requestItemId || "",
    requestItemName: entry.requestItemName || (entry.requestItemId ? itemNameFor(entry.requestItemId) : ""),
    count: Math.max(1, Number(entry.count || 1)),
    rewardGold: Number(entry.rewardGold || 0),
    rewardFame: Number(entry.rewardFame || 0),
    rewardFavor: Number(entry.rewardFavor || 0),
    headline: entry.headline || "",
    detail: entry.detail || "",
    requestText: entry.requestText || "",
    cta: entry.cta || "",
    note: entry.note || "",
    resultText: entry.resultText || "",
    fulfilledDay: Number(entry.fulfilledDay || 0),
    expiredDay: Number(entry.expiredDay || 0),
    tone: entry.tone || "mid",
  };
}

export function normalizeShopOpeningStateData(shopOpeningState = {}, options = {}) {
  const normalizeShopCustomerDecisionLedgerFor = typeof options.normalizeShopCustomerDecisionLedger === "function"
    ? options.normalizeShopCustomerDecisionLedger
    : (entry) => normalizeShopCustomerDecisionLedgerData(entry, options);
  const normalizeShopRegularBoardFor = typeof options.normalizeShopRegularBoard === "function"
    ? options.normalizeShopRegularBoard
    : (entry) => normalizeShopRegularBoardData(entry, options);
  const normalizeShopReturningCustomerVisitFor = typeof options.normalizeShopReturningCustomerVisit === "function"
    ? options.normalizeShopReturningCustomerVisit
    : (entry) => normalizeShopReturningCustomerVisitData(entry, options);
  const normalizeShopIntroducedCustomerVisitFor = typeof options.normalizeShopIntroducedCustomerVisit === "function"
    ? options.normalizeShopIntroducedCustomerVisit
    : (entry) => normalizeShopIntroducedCustomerVisitData(entry, options);
  const normalizeShopVisitPledgeFor = typeof options.normalizeShopVisitPledge === "function"
    ? options.normalizeShopVisitPledge
    : (entry) => normalizeShopVisitPledgeData(entry, options);
  const normalizeShopTownErrandFor = typeof options.normalizeShopTownErrand === "function"
    ? options.normalizeShopTownErrand
    : (entry) => normalizeShopTownErrandData(entry, options);
  const normalizeShopRestockTargetFor = typeof options.normalizeShopRestockTarget === "function"
    ? options.normalizeShopRestockTarget
    : (entry) => normalizeShopRestockTargetData(entry, options);
  const qingboWaterFreshSignatureAuraSnapshotFor = typeof options.qingboWaterFreshSignatureAuraSnapshot === "function"
    ? options.qingboWaterFreshSignatureAuraSnapshot
    : (entry) => (entry ? { ...entry } : null);
  const normalizeSession = (entry = null) => {
    if (!entry) return null;
    return {
      ...entry,
      liveFocus: entry.liveFocus ? { ...entry.liveFocus } : null,
      failureRecovery: entry.failureRecovery ? { ...entry.failureRecovery } : null,
      customerDecisionLedger: normalizeShopCustomerDecisionLedgerFor(entry.customerDecisionLedger),
      regularBoard: normalizeShopRegularBoardFor(entry.regularBoard),
      returningCustomers: Array.isArray(entry.returningCustomers)
        ? entry.returningCustomers.map((row) => normalizeShopReturningCustomerVisitFor(row)).filter(Boolean).slice(0, 4)
        : [],
      introducedCustomers: Array.isArray(entry.introducedCustomers)
        ? entry.introducedCustomers.map((row) => normalizeShopIntroducedCustomerVisitFor(row)).filter(Boolean).slice(0, 4)
        : [],
      visitPledge: normalizeShopVisitPledgeFor(entry.visitPledge),
      townErrand: normalizeShopTownErrandFor(entry.townErrand),
      ecologyShopAura: entry.ecologyShopAura ? { ...entry.ecologyShopAura } : null,
      qingboSignatureAura: entry.qingboSignatureAura
        ? qingboWaterFreshSignatureAuraSnapshotFor(entry.qingboSignatureAura)
        : null,
      compendiumDisplays: Array.isArray(entry.compendiumDisplays)
        ? entry.compendiumDisplays.map((display) => ({ ...display })).slice(0, 3)
        : [],
      spiritFinaleEffects: entry.spiritFinaleEffects
        ? {
          ...entry.spiritFinaleEffects,
          rows: Array.isArray(entry.spiritFinaleEffects.rows)
            ? entry.spiritFinaleEffects.rows.map((row) => ({ ...row }))
            : [],
        }
        : null,
    };
  };
  const defaults = createInitialShopOpeningStateData();
  return {
    ...defaults,
    ...shopOpeningState,
    needBubbles: Array.isArray(shopOpeningState.needBubbles) ? shopOpeningState.needBubbles.map((entry) => ({ ...entry })).slice(0, 4) : [],
    firstSale: shopOpeningState.firstSale ? { ...shopOpeningState.firstSale } : null,
    liveFocus: shopOpeningState.liveFocus ? { ...shopOpeningState.liveFocus } : null,
    failureRecovery: shopOpeningState.failureRecovery ? { ...shopOpeningState.failureRecovery } : null,
    customerDecisionLedger: normalizeShopCustomerDecisionLedgerFor(shopOpeningState.customerDecisionLedger),
    regularBoard: normalizeShopRegularBoardFor(shopOpeningState.regularBoard),
    returningCustomers: Array.isArray(shopOpeningState.returningCustomers)
      ? shopOpeningState.returningCustomers.map((entry) => normalizeShopReturningCustomerVisitFor(entry)).filter(Boolean).slice(0, 4)
      : [],
    introducedCustomers: Array.isArray(shopOpeningState.introducedCustomers)
      ? shopOpeningState.introducedCustomers.map((entry) => normalizeShopIntroducedCustomerVisitFor(entry)).filter(Boolean).slice(0, 4)
      : [],
    visitPledge: normalizeShopVisitPledgeFor(shopOpeningState.visitPledge),
    townErrand: normalizeShopTownErrandFor(shopOpeningState.townErrand),
    lastSession: normalizeSession(shopOpeningState.lastSession),
    restockTarget: normalizeShopRestockTargetFor(shopOpeningState.restockTarget),
    restockHistory: Array.isArray(shopOpeningState.restockHistory)
      ? shopOpeningState.restockHistory.map((entry) => normalizeShopRestockTargetFor(entry)).filter(Boolean).slice(0, 8)
      : [],
    history: Array.isArray(shopOpeningState.history)
      ? shopOpeningState.history.map((entry) => normalizeSession(entry)).filter(Boolean).slice(0, 8)
      : [],
  };
}
