export function shopDiagnosisWorldBoardSpecWorld({
  opening = null,
  report = [],
  journey = null,
  liveFocus = null,
  failure = null,
  day = 1,
} = {}) {
  const ledger = opening?.customerDecisionLedger || opening?.lastSession?.customerDecisionLedger || null;
  const diagnostics = (Array.isArray(report) ? report : [])
    .map((entry, reportIndex) => ({ ...entry, reportIndex }))
    .filter((entry) => entry.reason === "diagnosis");
  const blockers = ledger?.blockers?.length
    ? ledger.blockers
    : liveFocus?.topBlocker
      ? [{
        reason: liveFocus.topBlocker,
        label: liveFocus.topBlockerLabel,
        count: Number(liveFocus.leavers || 0),
        nextAction: liveFocus.shelfAdvice,
      }]
      : [];
  const topDiagnosis = diagnostics[0] || null;
  const topBlocker = blockers[0] || null;
  const hasActivity = opening?.opened || opening?.lastSession || liveFocus || ledger || diagnostics.length > 0 || (Array.isArray(report) && report.length > 0);
  if (!hasActivity) return null;
  const buyers = Number(ledger?.buyers ?? journey?.buyers ?? liveFocus?.buyers ?? report.filter((entry) => entry.reason === "buy").length);
  const leavers = Number(ledger?.leavers ?? journey?.leavers ?? liveFocus?.leavers ?? report.filter((entry) => ["price", "stock", "tag"].includes(entry.reason)).length);
  const visitors = Math.max(ledger?.visitors || journey?.visitors || buyers + leavers || 0, buyers + leavers);
  const conversion = visitors ? Math.round((buyers / visitors) * 100) : Number(ledger?.conversion || journey?.conversion || 0);
  const mainReason = topBlocker?.label
    || topDiagnosis?.text
    || (buyers > 0 ? "成交理由清楚" : "客群还在试探");
  const evidence = ledger?.summaryLines?.[1]
    || topDiagnosis?.detail
    || journey?.headline
    || liveFocus?.headline
    || "顾客反馈已经写进旧铺账页。";
  const nextAction = failure?.tomorrowAction
    || topBlocker?.nextAction
    || ledger?.nextAction
    || journey?.nextAction
    || liveFocus?.shelfAdvice
    || "先改一个最明显的货架短板，再开铺验证。";
  const tone = topBlocker || leavers > buyers
    ? "warn"
    : buyers > 0
      ? "good"
      : "note";
  const selector = topDiagnosis?.reportIndex >= 0
    ? `[data-shop-report-index="${Number(topDiagnosis.reportIndex)}"]`
    : ledger
      ? '[data-shop-board="decision-ledger"]'
      : '[data-shop-board="customer-journey"]';
  return {
    key: `${day}:${buyers}:${leavers}:${conversion}:${mainReason}:${Array.isArray(report) ? report.length : 0}`,
    day,
    title: "主世界旧铺诊断挂签",
    cta: "诊断挂签 · 可点",
    headline: mainReason,
    evidence,
    nextAction,
    tone,
    buyers,
    leavers,
    visitors,
    conversion,
    hotTagLabel: ledger?.hotTagLabel || liveFocus?.hotTagLabel || opening?.hotTagLabel || "今日客需",
    mainCustomer: ledger?.mainCustomer || journey?.mainCustomer || "路过客",
    selector,
    fallbackSelector: '[data-shop-board="decision-ledger"]',
    rect: { x: 224, y: 236, width: 282, height: 104 },
    anchor: { x: 146, y: 216 },
  };
}

export function shopDiagnosisWorldBoardAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return (
    px >= rect.x
    && px <= rect.x + rect.width
    && py >= rect.y
    && py <= rect.y + rect.height
  ) ? spec : null;
}

export function shopCustomerForecastToneWorld(display = null, shelf = null, goods = []) {
  if (!goods.length) return "empty";
  if (shelf?.active && shelf.tone === "warn") return "warn";
  if (display?.tone === "warn") return "warn";
  if (display?.themeScore >= Math.max(70, Number(display?.minThemeScore || 0))) return "ready";
  return "focus";
}

export function shopCustomerForecastWorldSpecWorld({
  opening = null,
  goods = [],
  display = null,
  weatherReaction = null,
  shelf = null,
  journey = null,
  activeSegment = null,
  currentWeatherLine = "",
  hotTagLabel = "",
  customerDisplayName = (archetype) => archetype || "第一批路过客",
  day = 1,
  reportCount = 0,
} = {}) {
  const active = goods.length > 0 || display?.active || shelf?.active || opening?.opened || reportCount > 0;
  if (!active) return null;
  const topGood = shelf?.topGoods?.[0] || display?.featuredGoods?.[0] || null;
  const customerTarget = display?.customerTargets?.[0] || null;
  const customerName = customerTarget?.name
    || journey?.mainCustomer
    || (activeSegment?.customer_archetype ? customerDisplayName(activeSegment.customer_archetype) : "第一批路过客");
  const itemText = topGood
    ? `${topGood.itemName} x${topGood.count}`
    : display?.missingTagText
      ? `缺 ${display.missingTagText}`
      : "先补一件可卖货";
  const weatherLine = shelf?.active
    ? `${shelf.weatherName} · ${shelf.title}`
    : weatherReaction?.active
      ? `${weatherReaction.weatherName} · ${weatherReaction.tagHint}`
      : currentWeatherLine || "日常客流";
  const themeLine = display?.active
    ? `${display.themeName} ${display.themeScore}% · ${display.hotTagLabel}`
    : "货架未成型 · 先备一件主推";
  const openingLine = opening?.liveFocus
    ? `${opening.liveFocus.buyers || 0} 单成交 · ${opening.liveFocus.topBlockerLabel || "读顾客反馈"}`
    : opening?.opened
      ? "今日已开铺，适合复盘顾客理由"
      : goods.length
        ? "可开铺试卖，先看客群和天气货签"
        : "旧铺待备货";
  const advice = shelf?.active
    ? shelf.actionText
    : display?.advice || "先准备一件能匹配节气或主题的商品，再开铺试卖。";
  const tone = shopCustomerForecastToneWorld(display, shelf, goods);
  return {
    key: `${day}:${tone}:${hotTagLabel}:${itemText}:${customerName}`,
    day,
    active,
    tone,
    title: "今日顾客风向",
    customerName,
    hotTagLabel,
    itemText,
    weatherLine,
    themeLine,
    openingLine,
    advice,
    topGood,
    display,
    shelf,
    journey,
    rect: { x: 376, y: 64, width: 288, height: 100 },
  };
}

export function shopCustomerForecastCanvasTargetWorld(spec = null) {
  if (!spec?.rect) return null;
  return {
    type: "customer_forecast",
    label: "今日顾客风向",
    selector: spec.shelf?.active ? '[data-shop-board="weather-shelf"]' : '[data-shop-board="display-diagnosis"]',
    fallbackSelector: '[data-shop-board="opening"]',
    forecastSpec: spec,
    rect: spec.rect,
  };
}

export function shopLiveFocusSpecWorld({
  report = [],
  theme = null,
  themeName = "",
  themeScore = 0,
  hotTag = "",
  lowStockGoods = [],
  itemName = (itemId) => itemId || "",
  shopTagLabel = (tag) => tag || "",
} = {}) {
  const safeReport = Array.isArray(report) ? report : [];
  const buys = safeReport.filter((entry) => entry.reason === "buy");
  const leaves = safeReport.filter((entry) => ["price", "stock", "tag"].includes(entry.reason));
  const itemCounts = buys.reduce((counts, entry) => {
    if (!entry.itemId) return counts;
    counts[entry.itemId] = Number(counts[entry.itemId] || 0) + 1;
    return counts;
  }, {});
  const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0] || null;
  const blockerCounts = leaves.reduce((counts, entry) => {
    counts[entry.reason] = Number(counts[entry.reason] || 0) + 1;
    return counts;
  }, {});
  const topBlocker = Object.entries(blockerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
  const blockerLabels = {
    price: "价格偏高",
    stock: "货架太薄",
    tag: "标签不合",
  };
  const advice = topBlocker === "price"
    ? "下次先把倍率压低一点，让第一批熟客留下来。"
    : topBlocker === "stock"
      ? `先补 ${lowStockGoods[0]?.itemName || (lowStockGoods[0]?.itemId ? itemName(lowStockGoods[0].itemId) : "热卖货")}，薄货架会让谨慎顾客退开。`
      : topBlocker === "tag"
        ? `围绕“${shopTagLabel(hotTag)}”补一件匹配商品，主题会更像真正的货架。`
        : buys.length > 0
          ? "成交理由已经写进账页，可以沿着这个标签继续补货。"
          : "先准备一件高匹配加工品，再开铺更稳。";
  return {
    buyers: buys.length,
    leavers: leaves.length,
    topItemId: topItem?.[0] || "",
    topItemName: topItem ? itemName(topItem[0]) : "",
    topItemCount: topItem ? Number(topItem[1] || 0) : 0,
    topBlocker,
    topBlockerLabel: blockerLabels[topBlocker] || (buys.length > 0 ? "成交顺利" : "等待首单"),
    themeName: theme?.note || themeName,
    themeScore: Math.round(themeScore * 100),
    hotTag,
    hotTagLabel: shopTagLabel(hotTag),
    shelfAdvice: advice,
    headline: topItem
      ? `${itemName(topItem[0])} 今日最亮眼`
      : leaves.length > 0
        ? `${blockerLabels[topBlocker] || "顾客犹豫"} 是今日短板`
        : "旧铺等下一批客人",
  };
}

export function shopCustomerReasonCompassWorldSpecWorld({
  lesson = null,
  journey = null,
  diagnosis = null,
  day = 1,
  shopCustomerDayLessonSpec = () => null,
  shopCustomerJourneySpec = () => null,
  shopDiagnosisWorldBoardSpec = () => null,
} = {}) {
  const activeLesson = lesson || shopCustomerDayLessonSpec();
  if (!activeLesson?.active) return null;
  const activeJourney = journey || shopCustomerJourneySpec();
  const activeDiagnosis = diagnosis || shopDiagnosisWorldBoardSpec();
  const buyCard = activeLesson.cards?.find((card) => card.key === "buy_reason") || activeLesson.cards?.[0] || null;
  const hesitateCard = activeLesson.cards?.find((card) => card.key === "hesitate_reason") || activeLesson.cards?.[1] || null;
  const fixCard = activeLesson.cards?.find((card) => card.key === "tomorrow_fix") || activeLesson.cards?.[2] || null;
  return {
    key: `${activeLesson.key}:reason_compass`,
    day,
    title: "顾客三因罗盘 · 可点",
    headline: activeLesson.headline || "把旧铺顾客三因复盘成一张能回看的罗盘。",
    selector: '[data-shop-board="reason-cards"]',
    fallbackSelector: '[data-shop-board="customer-journey"]',
    rect: { x: 696, y: 338, width: 214, height: 126 },
    anchor: { x: 640, y: 402 },
    rows: [
      { key: "buy", title: "为什么买", text: buyCard?.body || activeLesson.reviewLine || "先把最有力的成交原因说清楚。", accent: "#286f58" },
      { key: "hesitate", title: "为什么犹豫/离店", text: hesitateCard?.body || activeLesson.blockerLine || activeJourney?.blockerText || "把离店短板钉在旧铺报告上。", accent: "#be4f37" },
      { key: "fix", title: "明日怎么改", text: fixCard?.body || activeDiagnosis?.nextAction || activeLesson.nextAction || "先改最明显的一处短板。", accent: "#b47d2f" },
    ],
    safety: "只定位旧铺三因复盘、顾客旅线和诊断牌，不会自动开铺、调价、补货、成交、交单或消耗资源",
  };
}

export function shopCustomerReasonCompassWorldAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "customer_reason_compass",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      customerReasonCompass: spec,
      rect,
    }
    : null;
}

export function shopThoughtBubbleEntriesWorld({
  opening = null,
  report = [],
  waterwayBrowse = null,
  waterwayReorderFollowup = null,
  solarMoodEcho = null,
} = {}) {
  const needs = (opening?.needBubbles || []).map((entry) => ({
    ...entry,
    reason: "need",
    text: entry.text,
  }));
  const reports = (Array.isArray(report) ? report : [])
    .map((entry, reportIndex) => ({ ...entry, reportIndex }))
    .filter((entry) => entry.reason !== "diagnosis");
  const waterwayEntry = waterwayBrowse?.active
    ? [{
      name: waterwayBrowse.customerLabel,
      customerArchetype: "waterway_broker",
      reason: "waterway_browse",
      text: waterwayBrowse.bubble,
      detail: waterwayBrowse.detail,
      reportIndex: waterwayBrowse.reportIndex,
    }]
    : [];
  const waterwayReorderEntry = waterwayReorderFollowup?.active
    ? [{
      name: "莲泽熟路",
      customerArchetype: "waterway_broker",
      reason: "waterway_reorder_followup",
      text: waterwayReorderFollowup.bubble,
      detail: waterwayReorderFollowup.detail,
      reportIndex: waterwayReorderFollowup.reportIndex,
    }]
    : [];
  const solarMoodEntry = solarMoodEcho
    ? [{
      name: solarMoodEcho.customerName,
      customerArchetype: solarMoodEcho.customerArchetype,
      reason: "solar_mood_shop_display",
      text: solarMoodEcho.bubble,
      detail: solarMoodEcho.detail,
      stampId: solarMoodEcho.stampId,
      displayEcho: solarMoodEcho,
    }]
    : [];
  return [...waterwayReorderEntry, ...waterwayEntry, ...solarMoodEntry, ...needs, ...reports].slice(0, 3);
}

export function shopThoughtBubbleChainStatusWorld(entry = {}) {
  if (entry.reason === "buy") return { label: "买了", tone: "good", advice: "复现这件货的标签、价格和陈列位置。" };
  if (["price", "stock", "tag"].includes(entry.reason)) {
    const advice = entry.reason === "price"
      ? "明天先轻压价签，再观察同客群是否留下。"
      : entry.reason === "stock"
        ? "明天先补厚头排库存，别让热卖需求断档。"
        : "明天换一件更贴近需求标签的货。";
    return { label: "犹豫", tone: "warn", advice };
  }
  if (entry.reason === "need") return { label: "想要", tone: "need", advice: "围绕这条需求准备一件对口货。" };
  if (entry.reason === "waterway_browse" || entry.reason === "waterway_reorder_followup") return { label: "水航", tone: "water", advice: "保持水鲜和饮品不断档，接住回访客。" };
  if (entry.reason === "solar_mood_shop_display") return { label: "画境", tone: "gold", advice: "继续保留节气印记陈设，让顾客先读懂店铺气质。" };
  return { label: "看货", tone: "note", advice: entry.detail || "把顾客想法、货架标签和价格连起来复盘。" };
}

export function shopThoughtBubbleChainSpecWorld({
  opening = null,
  entries = [],
  positions = [],
  day = 1,
  thoughtBubbleChainStatus = () => ({ label: "", tone: "note", advice: "" }),
} = {}) {
  const rows = (Array.isArray(entries) ? entries : [])
    .map((entry, index) => {
      const status = thoughtBubbleChainStatus(entry);
      const position = positions[index] || positions[0] || { x: 0, y: 0 };
      return {
        ...entry,
        index,
        statusLabel: status.label,
        tone: status.tone,
        advice: entry.nextAction || status.advice,
        text: entry.text || entry.detail || "进门看看",
        detail: entry.detail || entry.text || "等待旧铺试营业验证。",
        point: {
          x: position.x + 92,
          y: position.y + 26,
        },
      };
    })
    .filter((entry) => entry.text)
    .slice(0, 3);
  if (rows.length < 2) return null;
  const liveFocus = opening?.liveFocus || opening?.lastSession?.liveFocus || null;
  const buyers = Number(liveFocus?.buyers || rows.filter((entry) => entry.reason === "buy").length || 0);
  const leavers = Number(liveFocus?.leavers || rows.filter((entry) => ["price", "stock", "tag"].includes(entry.reason)).length || 0);
  const warnCount = rows.filter((entry) => entry.tone === "warn").length;
  const lead = rows[0];
  const cta = warnCount > 0
    ? rows.find((entry) => entry.tone === "warn")?.advice || "先修正最明显的离店原因。"
    : buyers > 0
      ? liveFocus?.shelfAdvice || "把成交原因变成明日补货路线。"
      : lead.advice || "先准备对口货，再开铺观察。";
  return {
    key: `${day}:${rows.map((row) => `${row.name}:${row.reason}:${row.text}`).join("|")}:${buyers}:${leavers}`,
    day,
    title: "门口想法串 · 可点",
    lineLabel: "顾客想法线",
    headline: warnCount > 0 ? "有人说明了为什么犹豫" : buyers > 0 ? "顾客需求已经接成成交线" : "开铺前先看几位顾客想什么",
    summary: rows.map((row) => `${row.name || "顾客"}：${row.text}`).join(" / "),
    cta,
    buyers,
    leavers,
    warnCount,
    rows,
    rect: { x: 540, y: 252, width: 260, height: 112 },
    selector: '[data-shop-board="customer-journey"]',
    fallbackSelector: '[data-shop-board="opening"]',
  };
}

export function shopThoughtBubbleChainAtCanvasPointWorld({
  px = 0,
  py = 0,
  spec = null,
} = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "thought_chain",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      thoughtChain: spec,
      rect,
    }
    : null;
}

function shopThoughtShelfBridgeSplitTagsFallback(value = "") {
  return String(value || "")
    .split(/[,\s，、/]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function shopThoughtShelfBridgeTagsOverlapFallback(leftTags = [], rightTags = []) {
  const rightSet = new Set(Array.isArray(rightTags) ? rightTags : []);
  return (Array.isArray(leftTags) ? leftTags : []).some((tag) => rightSet.has(tag));
}

export function shopThoughtShelfBridgeReportEntryWorld({
  entry = {},
  index = 0,
  context = {},
  shopShelfTheme = "",
  thoughtBubbleChainStatus = shopThoughtBubbleChainStatusWorld,
  splitTags = shopThoughtShelfBridgeSplitTagsFallback,
  shopTagsForItem = () => [],
  shopTagsOverlap = shopThoughtShelfBridgeTagsOverlapFallback,
  shopTagLabel = (tag) => tag || "",
  itemName = (itemId) => itemId || "对口货",
} = {}) {
  const status = thoughtBubbleChainStatus(entry) || {};
  const ecologyGarden = context?.ecologyGarden || null;
  const display = context?.display || null;
  const shelf = context?.shelf || null;
  const theme = context?.theme || null;
  const goods = Array.isArray(context?.goods) ? context.goods : [];
  const themeTags = splitTags(theme?.required_item_tags || "");
  const shelfTags = Array.isArray(shelf?.desiredTags) ? shelf.desiredTags : [];
  const entryItemId = entry.itemId || entry.item_id || entry.outputItemId || entry.targetItemId || "";
  const focusTags = [...new Set([...(shelfTags || []), display?.hotTag, ...(themeTags || [])].filter(Boolean))];
  const matchedGood = goods.find(({ itemId }) => itemId && itemId === entryItemId)
    || goods.find(({ item, itemId }) => {
      const tags = shopTagsForItem(item || itemId, ecologyGarden);
      return focusTags.some((tag) => shopTagsOverlap(tags, [tag]));
    })
    || goods[0]
    || null;
  const matchedGoodTags = matchedGood ? shopTagsForItem(matchedGood.item || matchedGood.itemId, ecologyGarden) : [];
  const matchedTags = [...new Set([
    ...focusTags.filter((tag) => matchedGoodTags.length === 0 || shopTagsOverlap(matchedGoodTags, [tag])),
    ...matchedGoodTags.filter((tag) => focusTags.length === 0 || focusTags.includes(tag)).slice(0, 2),
  ].filter(Boolean))].slice(0, 3);
  const tone = status.tone === "good"
    ? "good"
    : status.tone === "warn"
      ? "warn"
      : "focus";
  const reasonLabel = entry.reason === "buy"
    ? "成交复盘"
    : ["price", "stock", "tag"].includes(entry.reason)
      ? "犹豫复盘"
      : entry.reason === "need"
        ? "进门想法"
        : status.label || "看货";
  return {
    key: `${entry.name || "customer"}:${entry.reason || "need"}:${entry.text || entry.detail || index}`,
    customerName: entry.name || display?.customerTargets?.[index]?.name || "路过客",
    statusLabel: status.label,
    reasonLabel,
    tone,
    text: entry.text || entry.detail || display?.headline || "先看这位顾客在门口想什么。",
    detail: entry.detail || entry.nextAction || status.advice || display?.advice || "把想法、标签和货架连成下一步。",
    advice: entry.nextAction || status.advice || display?.advice || "先准备一件对口货，再手动开铺验证。",
    matchedTags,
    tagText: matchedTags.map(shopTagLabel).join(" / ") || display?.hotTagLabel || shelf?.title || "待试卖",
    themeName: display?.themeName || theme?.note || shopShelfTheme || "旧铺主题",
    itemId: matchedGood?.itemId || entryItemId || "",
    itemName: matchedGood?.itemName || (matchedGood?.itemId ? itemName(matchedGood.itemId) : entry.itemName || display?.featuredGoods?.[0]?.itemName || "对口货"),
  };
}

export function shopThoughtShelfBridgeProductionRowsWorld({
  itemId = "",
  itemLabel = "",
  tag = "",
  display = null,
  shelf = null,
  day = 1,
  shopRestockRouteCandidates = () => [],
  bestRecipeForOutput = () => null,
  recipeCraftReady = () => false,
  recipeName = (recipe) => recipe?.name || recipe?.recipe_id || "配方",
  recipeMachineHint = () => "工坊",
  recipeInputStatus = () => "",
  cropForHarvestTarget = () => null,
  itemName = (value) => value || "对口货",
  shopTagLabel = (value) => value || "",
} = {}) {
  const safeItemName = itemLabel || (itemId ? itemName(itemId) : "对口货");
  const restock = itemId
    ? {
      day,
      itemId,
      itemName: safeItemName,
      note: "门口想法对口牌备货路线",
    }
    : null;
  const candidates = restock ? shopRestockRouteCandidates(restock) : [];
  const recipeCandidate = candidates.find((route) => route.action === "recipe")
    || (() => {
      const recipe = itemId ? bestRecipeForOutput(itemId) : null;
      return recipe
        ? {
          type: "recipe",
          label: recipeCraftReady(recipe) ? "可立即制作" : "工坊补货",
          title: recipeName(recipe),
          detail: `${recipeMachineHint(recipe)} · ${recipeInputStatus(recipe, 4) || "先看原料缺口"}`,
          action: "recipe",
          recipeId: recipe.recipe_id,
        }
        : null;
    })();
  const seedCandidate = candidates.find((route) => route.action === "seed")
    || (() => {
      const crop = itemId ? cropForHarvestTarget(itemId) : null;
      if (!crop?.seed_item_id) return null;
      return {
        type: "seed",
        label: "种植补货",
        title: itemName(crop.seed_item_id),
        detail: `${Number(crop.grow_days || 1)} 夜后可收 ${itemName(crop.crop_id || itemId)}，适合把对口标签补厚。`,
        action: "seed",
        seedId: crop.seed_item_id,
      };
    })();
  const shopCandidate = candidates.find((route) => route.action === "shop")
    || {
      type: "stock",
      label: "旧铺货签",
      title: safeItemName,
      detail: `围绕${display?.hotTagLabel || shelf?.tagLabel || shopTagLabel(tag) || "对口标签"}检查当前陈列。`,
      action: "shop",
      shopTag: tag || display?.hotTag || shelf?.desiredTags?.[0] || "",
      itemId,
    };
  return [
    recipeCandidate ? { ...recipeCandidate, buttonText: "先看配方" } : null,
    seedCandidate ? { ...seedCandidate, buttonText: "先看种子" } : null,
    shopCandidate ? { ...shopCandidate, buttonText: "先看旧铺货签" } : null,
  ].filter(Boolean);
}

export function shopThoughtShelfBridgeSpecWorld({
  day = 1,
  report = [],
  goods = [],
  theme = null,
  ecologyGarden = null,
  display = null,
  shelf = null,
  entries = [],
  shopShelfTheme = "",
  shopThoughtShelfBridgeReportEntry = (entry, index, context) => shopThoughtShelfBridgeReportEntryWorld({
    entry,
    index,
    context,
    shopShelfTheme,
  }),
  shopThoughtShelfBridgeProductionRows = () => [],
  splitTags = shopThoughtShelfBridgeSplitTagsFallback,
  shopTagsForItem = () => [],
  shopTagLabel = (tag) => tag || "",
  itemName = (itemId) => itemId || "对口货",
} = {}) {
  const syntheticEntry = display?.active || shelf?.active
    ? {
      name: "门口想法",
      reason: display?.tone === "warn" || shelf?.tone === "warn" ? "tag" : "need",
      text: display?.headline || shelf?.headline || "先把今日客意接到货架上。",
      detail: display?.advice || shelf?.actionText || "看顾客想法、对口标签和备货路线。",
    }
    : null;
  const sourceEntries = (Array.isArray(entries) && entries.length ? entries : [syntheticEntry]).filter(Boolean).slice(0, 3);
  const rows = sourceEntries
    .map((entry, index) => shopThoughtShelfBridgeReportEntry(entry, index, { display, shelf, theme, goods, ecologyGarden }))
    .filter((row) => row.text);
  const goodsById = new Map();
  for (const good of display?.featuredGoods || []) {
    if (!good?.itemName) continue;
    goodsById.set(good.itemId || good.itemName, {
      source: "陈列主题",
      itemId: good.itemId || "",
      itemName: good.itemName,
      count: Number(good.count || 0),
      tagText: good.tagText || display.hotTagLabel || "",
      customerText: good.customerText || display.customerTargets?.map((target) => target.name).join(" / ") || "路过客",
    });
  }
  for (const good of shelf?.topGoods || []) {
    if (!good?.itemName) continue;
    goodsById.set(good.itemId || good.itemName, {
      source: "天气货签",
      itemId: good.itemId || "",
      itemName: good.itemName,
      count: Number(good.count || 0),
      tagText: good.tagText || shelf.title || "",
      customerText: shelf.weatherName || "天气客意",
    });
  }
  if (goodsById.size === 0) {
    for (const good of goods.slice(0, 3)) {
      const tags = shopTagsForItem(good.item || good.itemId, ecologyGarden).slice(0, 3);
      goodsById.set(good.itemId, {
        source: "可卖库存",
        itemId: good.itemId,
        itemName: good.itemName || itemName(good.itemId),
        count: Number(good.count || 0),
        tagText: tags.map(shopTagLabel).join(" / ") || "旧铺货",
        customerText: "先试卖验证",
      });
    }
  }
  const goodsRows = [...goodsById.values()].slice(0, 4);
  const tagCandidates = [...new Set([
    ...rows.flatMap((row) => row.matchedTags || []),
    display?.hotTag,
    ...(shelf?.desiredTags || []),
    ...splitTags(theme?.required_item_tags || ""),
  ].filter(Boolean))];
  const focusTag = tagCandidates[0] || "";
  const leadGood = goodsRows[0] || null;
  const leadRow = rows[0] || null;
  const productionRows = shopThoughtShelfBridgeProductionRows(
    leadGood?.itemId || leadRow?.itemId || "",
    leadGood?.itemName || leadRow?.itemName || "",
    focusTag,
    display,
    shelf,
  );
  const customerText = display?.customerTargets?.map((target) => target.name).filter(Boolean).join(" / ")
    || rows.map((row) => row.customerName).filter(Boolean).slice(0, 2).join(" / ")
    || "第一批路过客";
  const summaryRows = [
    { label: "今日先做什么", value: leadRow?.advice || display?.advice || shelf?.actionText || "先准备一件对口货。" },
    { label: "对口标签", value: tagCandidates.slice(0, 3).map(shopTagLabel).join(" / ") || display?.hotTagLabel || "待试卖" },
    { label: "陈列主题", value: display?.themeName || theme?.note || shopShelfTheme || "旧铺主题" },
    { label: "更容易打动谁", value: customerText },
    { label: "先摆哪件", value: leadGood ? `${leadGood.itemName} x${leadGood.count}` : leadRow?.itemName || "先补一件对口货" },
  ];
  const tone = rows.some((row) => row.tone === "warn") || display?.tone === "warn" || shelf?.tone === "warn"
    ? "warn"
    : goodsRows.length > 0
      ? "good"
      : "focus";
  const active = rows.length > 0 || goodsRows.length > 0 || display?.active || shelf?.active || (Array.isArray(report) && report.length > 0);
  if (!active) return null;
  return {
    active: true,
    key: `${day}:${rows.map((row) => row.key).join("|")}:${leadGood?.itemId || ""}:${focusTag}`,
    title: "门口想法对口牌",
    headline: leadRow
      ? `${leadRow.customerName}：${leadRow.text}`
      : display?.headline || shelf?.headline || "先把门口想法、货架标签和备货路线对齐。",
    tone,
    rows,
    goodsRows,
    productionRows,
    productionTitle: leadGood?.itemName || leadRow?.itemName || "对口货",
    summaryRows,
    safetyIntro: "只解释顾客想法、货架标签和备货路线",
    safetyLimit: "不会自动换主题、开铺、调价、补货或消耗资源",
  };
}

export function shopThoughtShelfBridgeMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  const summaryText = spec.summaryRows.map((row) => `
    <b>${row.label}<small>${row.value}</small></b>
  `).join("");
  const rowsText = spec.rows.map((row) => `
    <div class="shop-thought-shelf-row ${row.tone}">
      <div class="shop-thought-shelf-row-head">
        <b>${row.customerName} · ${row.statusLabel}</b>
        <small>${row.reasonLabel}</small>
      </div>
      <span>${row.text}</span>
      <small>${row.detail}</small>
      <div class="shop-thought-shelf-chipline">
        <em class="shop-thought-shelf-chip">对口标签 ${row.tagText}</em>
        <em class="shop-thought-shelf-chip theme">陈列主题 ${row.themeName}</em>
      </div>
    </div>
  `).join("");
  const goodsText = spec.goodsRows.length
    ? spec.goodsRows.map((good, index) => `
      <div class="shop-thought-shelf-good ${index === 0 ? "feature" : ""}">
        <b>${index === 0 ? "先摆哪件" : good.source} · ${good.itemName} x${good.count}</b>
        <small>${good.tagText}</small>
        <small>更容易打动谁：${good.customerText}</small>
      </div>
    `).join("")
    : `<div class="shop-thought-shelf-good"><b>先摆哪件 · 待补对口货</b><small>先看配方、种子或旧铺货签，把第一件能解释顾客想法的货接上。</small></div>`;
  const productionText = spec.productionRows.length
    ? `
      <div class="shop-thought-shelf-production">
        <strong>备货路线 · ${spec.productionTitle}</strong>
        ${spec.productionRows.map((route) => `
          <div class="shop-thought-shelf-production-row ${route.type || route.action}">
            <b>${route.label} · ${route.title}</b>
            <span>${route.detail}</span>
            <button type="button" data-shop-thought-shelf-route="${route.action}" data-shop-thought-shelf-recipe="${route.recipeId || ""}" data-shop-thought-shelf-seed="${route.seedId || ""}" data-shop-thought-shelf-tag="${route.shopTag || ""}" data-shop-thought-shelf-item="${route.itemId || ""}">${route.buttonText}</button>
          </div>
        `).join("")}
      </div>
    `
    : `<small>今日暂无可定位备货路线，先看旧铺货签和现有库存。</small>`;
  return `
    <div class="shop-thought-shelf-bridge ${spec.tone}" data-shop-board="thought-shelf-bridge">
      <strong>${spec.title}</strong>
      <span>${spec.headline}</span>
      <div class="shop-thought-shelf-summary">${summaryText}</div>
      <div class="shop-thought-shelf-rows">${rowsText}</div>
      <div class="shop-thought-shelf-goods">${goodsText}</div>
      ${productionText}
      <small>${spec.safetyIntro}；${spec.safetyLimit}。</small>
    </div>
  `;
}

export function drawShopDiagnosisWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 2;
  const accent = spec.tone === "warn" ? "#be4f37" : spec.tone === "good" ? "#286f58" : "#b47d2f";
  const fill = spec.tone === "warn" ? "rgba(255, 240, 232, 0.94)" : spec.tone === "good" ? "rgba(237, 243, 223, 0.92)" : "rgba(255, 248, 232, 0.92)";
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + 36, cardY + rect.height + 20, rect.x + 36, cardY + rect.height - 8);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.ellipse(anchor.x, anchor.y + 18, 54 + Math.abs(bob), 15, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, fill);
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.6 : 1.4;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}24`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 50, 48, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(spec.tone === "warn" ? "诊" : spec.tone === "good" ? "旺" : "账", rect.x + 30, cardY + 45);
  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 53, 38, 15, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 29, cardY + 64);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.hotTagLabel}`.slice(0, 23), rect.x + 78, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 78, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.evidence.slice(0, 32), rect.x + 78, cardY + 65);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 76, rect.width - 32, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`改法：${spec.nextAction}`.slice(0, 36), rect.x + 26, cardY + 89);

  ctx.fillStyle = active ? accent : "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`主客 ${spec.mainCustomer} · 成交 ${spec.buyers}/${spec.visitors} · 离店 ${spec.leavers} · ${spec.conversion}%`, rect.x + 18, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function drawShopCustomerReasonCompassWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.55) * 2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.9)" : "rgba(180, 125, 47, 0.56)";
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.quadraticCurveTo(rect.x + 24, cardY + rect.height + 26, rect.x + 24, cardY + rect.height - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 249, 238, 0.94)");
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.92)" : "rgba(180, 125, 47, 0.6)";
  ctx.lineWidth = active ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 18, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "12px Microsoft YaHei";
  spec.rows.slice(0, 3).forEach((row, index) => {
    const rowY = cardY + 48 + index * 22;
    ctx.fillStyle = row.accent || "#8f5f3f";
    ctx.font = "bold 12px Microsoft YaHei";
    ctx.fillText(row.title, rect.x + 18, rowY);
    ctx.fillStyle = "#465448";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText((row.text || "").slice(0, 18), rect.x + 102, rowY);
  });
  ctx.restore();
  return true;
}

export function drawCustomerThoughtBubblesWorld({
  ctx,
  entries = [],
  positions = [],
} = {}) {
  if (!ctx || !Array.isArray(entries) || entries.length === 0 || !Array.isArray(positions) || positions.length === 0) return false;
  ctx.save();
  entries.forEach((entry, index) => {
    const { x, y } = positions[index] || positions[0] || { x: 0, y: 0 };
    const isCompendium = Boolean(entry.compendiumRemark || entry.reason === "compendium");
    const isEcologyAura = entry.reason === "ecology_shop_aura";
    const isWaterway = entry.reason === "waterway_browse" || entry.customerArchetype === "waterway_broker";
    const isSolarMoodDisplay = entry.reason === "solar_mood_shop_display";
    const text = entry.reason === "buy" ? `成交：${entry.text.replace(/，.*/, "")}` : entry.reason === "need" ? entry.text : entry.text;
    const textLimit = isCompendium || isEcologyAura || isSolarMoodDisplay ? 20 : 18;
    const shortText = text.length > textLimit ? `${text.slice(0, textLimit)}...` : text;
    ctx.fillStyle = isEcologyAura
      ? "rgba(236, 248, 243, 0.94)"
      : isCompendium
        ? "rgba(255, 248, 232, 0.96)"
        : isSolarMoodDisplay
          ? "rgba(255, 253, 245, 0.96)"
          : isWaterway
            ? "rgba(241, 249, 251, 0.95)"
            : entry.reason === "buy" ? "rgba(237, 243, 223, 0.92)" : entry.reason === "need" ? "rgba(255, 253, 245, 0.94)" : "rgba(255, 248, 232, 0.92)";
    ctx.strokeStyle = isEcologyAura
      ? "rgba(40, 111, 88, 0.44)"
      : isCompendium
        ? "rgba(143, 95, 63, 0.46)"
        : isSolarMoodDisplay
          ? "rgba(180, 125, 47, 0.46)"
          : isWaterway
            ? "rgba(77, 145, 166, 0.48)"
            : entry.reason === "buy" ? "rgba(40, 111, 88, 0.34)" : entry.reason === "need" ? "rgba(224, 182, 109, 0.42)" : "rgba(190, 79, 55, 0.28)";
    ctx.lineWidth = isCompendium || isEcologyAura || isWaterway || isSolarMoodDisplay ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(x, y, 184, 52, 18);
    ctx.fill();
    ctx.stroke();
    if (isCompendium || isEcologyAura || isWaterway || isSolarMoodDisplay) {
      ctx.fillStyle = isSolarMoodDisplay ? "rgba(224, 182, 109, 0.28)" : isWaterway ? "rgba(122, 195, 213, 0.32)" : isEcologyAura ? "rgba(202, 235, 210, 0.4)" : "rgba(224, 182, 109, 0.26)";
      ctx.beginPath();
      ctx.arc(x + 160, y + 17, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = isSolarMoodDisplay ? "#b47d2f" : isWaterway ? "#4d91a6" : isEcologyAura ? "#286f58" : "#8f5f3f";
      ctx.font = "700 10px Microsoft YaHei";
      ctx.fillText(isSolarMoodDisplay ? "画" : isWaterway ? "水" : isEcologyAura ? "院" : "印", x + 155, y + 21);
    }
    ctx.fillStyle = isSolarMoodDisplay ? "#b47d2f" : isWaterway ? "#4d91a6" : isEcologyAura ? "#286f58" : isCompendium ? "#8f5f3f" : entry.reason === "buy" ? "#286f58" : entry.reason === "need" ? "#8f5f3f" : "#be4f37";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText(entry.name, x + 16, y + 22);
    ctx.fillStyle = "#17231d";
    ctx.font = "13px Microsoft YaHei";
    ctx.fillText(shortText, x + 16, y + 40);
    ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
    ctx.beginPath();
    ctx.arc(x + 28, y + 60, 5, 0, Math.PI * 2);
    ctx.arc(x + 16, y + 70, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
  return true;
}

export function drawShopThoughtBubbleChainWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.rows?.length) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2;
  const accent = spec.warnCount > 0 ? "#be4f37" : spec.buyers > 0 ? "#286f58" : "#b47d2f";
  const cardY = rect.y + pulse;
  const toneColor = {
    good: "#286f58",
    warn: "#be4f37",
    need: "#8f5f3f",
    water: "#4d91a6",
    gold: "#b47d2f",
    note: "#5b6f9a",
  };

  ctx.save();
  ctx.strokeStyle = active ? `${accent}cc` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  spec.rows.forEach((row, index) => {
    const point = row.point || { x: rect.x, y: rect.y };
    if (index === 0) ctx.moveTo(point.x, point.y);
    else {
      const prev = spec.rows[index - 1]?.point || point;
      ctx.bezierCurveTo(prev.x + 38, prev.y - 18, point.x - 38, point.y - 18, point.x, point.y);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);

  for (const row of spec.rows) {
    const point = row.point || { x: rect.x, y: rect.y };
    const color = toneColor[row.tone] || toneColor.note;
    ctx.fillStyle = `${color}33`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10 + Math.abs(pulse) * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.warnCount > 0 ? "rgba(255, 240, 232, 0.94)" : "rgba(255, 248, 232, 0.95)");
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}88`;
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 13, 48, 46, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("想", rect.x + 28, cardY + 43);
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 50, 38, 15, 8);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 30, cardY + 61);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.lineLabel || "顾客想法线"} · 可点`.slice(0, 15), rect.x + 76, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 76, cardY + 43);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`成交 ${spec.buyers} · 犹豫 ${spec.leavers} · ${spec.rows.length} 个泡泡`.slice(0, 28), rect.x + 76, cardY + 59);

  spec.rows.slice(0, 3).forEach((row, index) => {
    const color = toneColor[row.tone] || toneColor.note;
    const rowX = rect.x + 16 + index * 80;
    const rowY = cardY + 72;
    ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
    ctx.strokeStyle = `${color}44`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(rowX, rowY, 72, 21, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(row.statusLabel.slice(0, 4), rowX + 7, rowY + 9);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(row.text || "").slice(0, 8), rowX + 7, rowY + 18);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`明日改法：${spec.cta} · 不会自动开铺、调价、补货或消耗资源`.slice(0, 48), rect.x + 16, cardY + rect.height - 8);
  ctx.restore();
  return true;
}
