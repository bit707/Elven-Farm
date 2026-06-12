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
