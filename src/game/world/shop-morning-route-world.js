export function shopWordOfMouthMorningFollowupWorldSpecWorld({
  summary = null,
  day = 1,
} = {}) {
  if (!summary || Number(summary.nextDay || 0) !== Number(day || 0)) return null;
  const itemText = summary.itemName || "对口货";
  const sourceText = summary.sourceLabel || "铺前市闻";
  const customerText = summary.customerName || "来帖客";
  const steps = Array.isArray(summary.steps) && summary.steps.length
    ? summary.steps.slice(0, 3)
    : [
      { key: "sold", title: "昨日卖出", text: itemText },
      { key: "restock", title: "今晨续货", text: `补回 ${itemText}` },
      { key: "front", title: "放回头排", text: sourceText },
    ];
  return {
    key: `${summary.key || `${day}:word_followup`}:morning_lamp`,
    day,
    title: "来帖续货清晨灯 · 可点",
    headline: summary.headline || "昨天的口碑今天别断档",
    customerName: customerText,
    sourceLabel: sourceText,
    itemId: summary.itemId || "",
    itemName: itemText,
    price: summary.price,
    reportIndex: Number(summary.reportIndex ?? -1),
    selector: "#shopReport",
    fallbackSelector: '[data-shop-board="opening"]',
    rect: { x: 430, y: 126, width: 230, height: 118 },
    anchor: { x: 132, y: 182 },
    steps: steps.map((step, index) => ({
      key: step.key || `step_${index}`,
      title: index === 0 && step.title === "今日卖出" ? "昨日卖出" : index === 1 && step.title === "明日续货" ? "今晨续货" : step.title,
      text: step.text || "",
      accent: index === 0 ? "#be4f37" : index === 1 ? "#286f58" : "#b47d2f",
    })),
    morningDetail: summary.morningDetail || `${sourceText}带来的${customerText}昨天买过，今天先手动补货并放回头排。`,
    cta: summary.safeNote || "只定位旧铺报告和来帖续货复盘，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存",
  };
}

export function shopWordOfMouthMorningFollowupWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_word_of_mouth_morning_followup",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      shopWordOfMouthMorningFollowup: spec,
      rect,
    }
    : null;
}

export function shopThoughtRouteMorningFollowupSpecWorld({
  entries = [],
  day = 1,
  hotTagLabel = "",
  itemName = (itemId) => itemId,
} = {}) {
  const lead = (Array.isArray(entries) ? entries : [])
    .find((entry) => entry && ["need", "price", "stock", "tag", "buy"].includes(entry.reason))
    || (Array.isArray(entries) ? entries.find(Boolean) : null)
    || null;
  if (!lead) return null;
  const itemId = lead.itemId || lead.goods?.[0]?.itemId || "";
  const itemText = lead.itemName || (itemId ? itemName(itemId) : "") || lead.text || "对口货";
  const customerText = lead.name || "门口来客";
  const reasonTag = lead.tagShortText || hotTagLabel || "今日客需";
  const routeAction = lead.reason === "price"
    ? "price"
    : lead.reason === "tag"
      ? "tag"
      : lead.reason === "stock"
        ? "stock"
        : "review";
  const routeLabel = routeAction === "price"
    ? "价签路线"
    : routeAction === "tag"
      ? "标签路线"
      : routeAction === "stock"
        ? "备货路线"
        : "先看入口";
  return {
    key: `${day}:${routeAction}:${itemId}:${reasonTag}:${customerText}`,
    day,
    title: "旧铺想法续路线",
    actionTitle: "清晨行动牌：旧铺想法续路线",
    headline: "昨天门口的想法，今天先顺着一条线接住",
    customerName: customerText,
    hotTagLabel: reasonTag,
    reasonTag,
    itemId,
    itemName: itemText,
    routeAction,
    routeLabel,
    routeTitle: itemText,
    routeDetail: lead.detail || lead.nextAction || `先顺着${routeLabel}回看旧铺报告，再手动决定怎么接。`,
    selector: "#shopReport",
    fallbackSelector: '[data-shop-board="opening"]',
    cta: "只延续旧铺顾客想法、标签判断和备货路线，不会自动制作、播种、补货、开铺、调价或消耗资源",
  };
}

export function shopThoughtRouteMorningFollowupWorldSpecWorld({
  summary = null,
  day = 1,
} = {}) {
  if (!summary) return null;
  return {
    key: `${summary.key}:morning_followup`,
    day,
    title: "旧铺想法续路线签 · 可点",
    headline: summary.headline || "昨天门口的想法，今天先顺着一条线接住",
    customerName: summary.customerName || "门口来客",
    hotTagLabel: summary.hotTagLabel || summary.reasonTag || "今日客需",
    reasonTag: summary.reasonTag || summary.hotTagLabel || "今日客需",
    itemId: summary.itemId || "",
    itemName: summary.itemName || "对口货",
    routeAction: summary.routeAction || "review",
    routeLabel: summary.routeLabel || "备货路线",
    routeTitle: summary.routeTitle || summary.itemName || "对口货",
    routeDetail: summary.routeDetail || "先看入口，再决定今天怎么接住。",
    selector: summary.selector || "#shopReport",
    fallbackSelector: summary.fallbackSelector || '[data-shop-board="opening"]',
    rect: { x: 430, y: 126, width: 232, height: 118 },
    anchor: { x: 160, y: 208 },
    steps: [
      { key: "follow", title: "今晨续线", text: summary.routeLabel || "备货路线", accent: "#4d91a6" },
      { key: "entry", title: "先看入口", text: summary.routeDetail || "先看旧铺报告", accent: "#b47d2f" },
      { key: "hold", title: "手动接住", text: summary.itemName || "对口货", accent: "#286f58" },
    ],
    cta: summary.cta || "只延续旧铺顾客想法、标签判断和备货路线，不会自动制作、播种、补货、开铺、调价或消耗资源",
  };
}

export function shopThoughtRouteMorningFollowupWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_thought_route_morning_followup",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      shopThoughtRouteMorningFollowup: spec,
      rect,
    }
    : null;
}

export function shopThoughtRouteReadyMorningWorldSpecWorld({
  summary = null,
  day = 1,
  inventory = {},
  itemName = (itemId) => itemId,
} = {}) {
  const morning = summary?.shopThoughtRouteMorningFollowup || summary;
  const itemId = morning?.itemId || "";
  if (!morning || !itemId) return null;
  const have = Number(inventory[itemId] || 0);
  if (have <= 0) return null;
  return {
    key: `${morning.key}:ready:${have}`,
    day,
    title: "旧铺想法备妥签 · 可点",
    headline: "这条想法路线已经备到手边",
    customerName: morning.customerName,
    hotTagLabel: morning.hotTagLabel,
    reasonTag: morning.reasonTag,
    itemId,
    itemName: morning.itemName || itemName(itemId),
    have,
    routeLabel: morning.routeLabel,
    routeTitle: morning.routeTitle,
    routeDetail: morning.routeDetail,
    selector: morning.selector,
    fallbackSelector: morning.fallbackSelector,
    rect: { x: 432, y: 252, width: 232, height: 118 },
    anchor: { x: morning.rect.x + morning.rect.width - 14, y: morning.rect.y + 62 },
    steps: [
      { key: "ready", title: "已备在手", text: `${morning.itemName} x${have}`, accent: "#286f58" },
      { key: "route", title: "顺线回看", text: morning.routeLabel, accent: "#b47d2f" },
      { key: "verify", title: "手动验证", text: "再决定开铺", accent: "#be4f37" },
    ],
    cta: "只确认这条想法路线已备到位并定位旧铺报告，不会自动上架、补货、开铺、接客、成交、改价或消耗库存",
  };
}

export function shopThoughtRouteReadyMorningWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_thought_route_ready_morning",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      shopThoughtRouteReadyMorning: spec,
      rect,
    }
    : null;
}

export function shopThoughtRouteCaughtWorldSpecWorld({
  summary = null,
  shopReport = [],
  day = 1,
  itemName = (itemId) => itemId,
} = {}) {
  const morning = summary?.shopThoughtRouteMorningFollowup || summary;
  if (!morning) return null;
  const reportIndex = shopReport.findIndex((entry) =>
    entry.reason === "buy"
    && (!morning.itemId || entry.itemId === morning.itemId));
  if (reportIndex < 0) return null;
  const reportEntry = shopReport[reportIndex];
  const priceMatch = String(reportEntry?.text || "").match(/成交\s*(\d+)/);
  const price = Number(priceMatch?.[1] || reportEntry?.price || 0);
  const customerName = reportEntry?.name || morning.customerName || "门口来客";
  return {
    key: `${morning.key}:caught:${reportIndex}:${price}`,
    day,
    title: "旧铺想法接住签 · 可点",
    headline: "昨天门口的想法，今天真的接住了",
    customerName,
    itemId: morning.itemId,
    itemName: morning.itemName || itemName(morning.itemId),
    price,
    routeLabel: morning.routeLabel,
    routeTitle: morning.routeTitle,
    routeDetail: morning.routeDetail,
    resultText: reportEntry?.text || `${customerName} 顺着这条想法路线买走了 ${morning.itemName}。`,
    selector: "#shopReport",
    fallbackSelector: '[data-shop-board="opening"]',
    reportIndex,
    rect: { x: 676, y: 188, width: 220, height: 114 },
    anchor: { x: morning.rect.x + morning.rect.width + 12, y: morning.rect.y + 40 },
    steps: [
      { key: "caught", title: "今日接住", text: customerName, accent: "#286f58" },
      { key: "result", title: "成交回响", text: morning.itemName || "对口货", accent: "#be4f37" },
      { key: "route", title: "顺线复用", text: morning.routeLabel || "备货路线", accent: "#b47d2f" },
    ],
    cta: "只回看这条想法路线如何接住成交并定位旧铺报告，不会自动上架、开铺、接客、成交、改价、补货或消耗库存",
  };
}

export function shopThoughtRouteCaughtWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_thought_route_caught",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      shopThoughtRouteCaught: spec,
      rect,
    }
    : null;
}

export function shopThoughtRouteMissedWorldSpecWorld({
  summary = null,
  shopReport = [],
  day = 1,
  itemName = (itemId) => itemId,
  shopThoughtRouteCaughtWorldSpec = () => null,
} = {}) {
  const morning = summary?.shopThoughtRouteMorningFollowup || summary;
  if (!morning || shopThoughtRouteCaughtWorldSpec(morning)) return null;
  const reportEntry = [...shopReport].reverse().find((entry) =>
    ["price", "stock", "tag"].includes(entry.reason)
    && (!morning.itemId || !entry.itemId || entry.itemId === morning.itemId));
  if (!reportEntry && !shopReport.length) return null;
  const reasonLabel = reportEntry?.reason === "price"
    ? "价签没接稳"
    : reportEntry?.reason === "stock"
      ? "备货断档了"
      : reportEntry?.reason === "tag"
        ? "标签没对上"
        : "这条想法今天还没接住";
  return {
    key: `${morning.key}:missed:${reportEntry?.reason || "pending"}`,
    day,
    title: "旧铺想法落空签 · 可点",
    headline: "这条想法路线今天还没接稳",
    customerName: morning.customerName,
    itemId: morning.itemId,
    itemName: morning.itemName || itemName(morning.itemId),
    routeLabel: morning.routeLabel,
    routeTitle: morning.routeTitle,
    routeDetail: morning.routeDetail,
    selector: "#shopReport",
    fallbackSelector: '[data-shop-board="opening"]',
    reportIndex: reportEntry ? Number(shopReport.indexOf(reportEntry)) : -1,
    rect: { x: 676, y: 314, width: 220, height: 114 },
    anchor: { x: morning.rect.x + morning.rect.width + 10, y: morning.rect.y + morning.rect.height - 8 },
    steps: [
      { key: "missed", title: "今日落空", text: reasonLabel, accent: "#be4f37" },
      { key: "next", title: "下一手", text: reportEntry?.detail || morning.routeDetail || "先看入口", accent: "#b47d2f" },
      { key: "back", title: "回到旧铺", text: morning.routeLabel || "备货路线", accent: "#4d91a6" },
    ],
    cta: "只回看这条想法路线今天卡在什么地方并定位旧铺报告，不会自动上架、开铺、接客、成交、改价、补货或消耗库存",
  };
}

export function shopThoughtRouteMissedWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_thought_route_missed",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      shopThoughtRouteMissed: spec,
      rect,
    }
    : null;
}

export function shopWordOfMouthRestockedMorningWorldSpecWorld({
  summary = null,
  morning = null,
  inventory = {},
  haveInput = null,
  day = 1,
} = {}) {
  if (!morning?.itemId) return null;
  const have = Number(haveInput ?? (inventory[morning.itemId] || 0));
  const targetCount = Math.max(2, Number(summary?.targetCount || 2));
  if (have < targetCount) return null;
  return {
    key: `${morning.key}:restocked_ready:${have}`,
    day,
    title: "来帖续货备回签 · 可点",
    headline: "货已经备回，口碑能接住",
    customerName: morning.customerName,
    sourceLabel: morning.sourceLabel,
    itemId: morning.itemId,
    itemName: morning.itemName,
    have,
    targetCount,
    reportIndex: morning.reportIndex,
    selector: morning.selector,
    fallbackSelector: morning.fallbackSelector,
    rect: { x: 676, y: 124, width: 224, height: 116 },
    anchor: { x: morning.rect.x + morning.rect.width - 18, y: morning.rect.y + 62 },
    steps: [
      { key: "stock", title: "已备回", text: `${have}/${targetCount}`, accent: "#286f58" },
      { key: "front", title: "放头排", text: morning.itemName, accent: "#b47d2f" },
      { key: "open", title: "手动开铺", text: morning.sourceLabel, accent: "#be4f37" },
    ],
    cta: "只确认库存已备回并定位旧铺报告，不会自动上架、补货、开铺、接客、成交、改价或消耗库存",
  };
}

export function shopWordOfMouthRestockedMorningWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_word_of_mouth_restocked_morning",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      shopWordOfMouthRestockedMorning: spec,
      rect,
    }
    : null;
}

export function shopWordOfMouthRestockCaughtWorldSpecWorld({
  summary = null,
  morning = null,
  opening = null,
  shopReport = [],
  day = 1,
  itemName = (itemId) => itemId,
} = {}) {
  if (!morning?.itemId) return null;
  const session = opening?.lastSession?.day === day ? opening.lastSession : null;
  if (!session) return null;
  const reportIndex = shopReport.findIndex((entry) =>
    entry.reason === "buy"
    && entry.wordOfMouthLead
    && entry.itemId === morning.itemId);
  if (reportIndex < 0) return null;
  const reportEntry = shopReport[reportIndex];
  const price = Number((String(reportEntry?.text || "").match(/成交 (\d+)/) || [0, 0])[1] || 0);
  const customerName = reportEntry?.name || morning.customerName || "来帖客";
  const itemText = morning.itemName || (morning.itemId ? itemName(morning.itemId) : "对口货");
  const sourceText = morning.sourceLabel || "铺前市闻";
  return {
    key: `${day}:${morning.itemId}:${customerName}:${price}:word_of_mouth_restock_caught`,
    day,
    title: "来帖续货接住签 · 可点",
    headline: "昨天的口碑今天续上了",
    customerName,
    sourceLabel: sourceText,
    itemId: morning.itemId,
    itemName: itemText,
    price,
    reportIndex,
    resultText: reportEntry?.text || `${customerName}再次顺着来帖买走了${itemText}。`,
    selector: `[data-shop-report-index="${Number(reportIndex)}"]`,
    fallbackSelector: '[data-shop-board="opening"]',
    rect: { x: 628, y: 498, width: 286, height: 118 },
    anchor: { x: 778, y: 238 },
    steps: [
      { key: "restocked", title: "备回上架", text: itemText, accent: "#286f58" },
      { key: "return", title: "来客再认", text: customerName, accent: "#b47d2f" },
      { key: "sale", title: "续货成交", text: price ? `${price} 灵石` : "成交", accent: "#be4f37" },
    ],
    cta: "只回看续货成交和定位旧铺报告，不会自动上架、开铺、接客、成交、改价、补货或消耗库存",
  };
}

export function shopWordOfMouthRestockCaughtWorldAtCanvasPointWorld({ px, py, spec = null } = {}) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? {
      type: "shop_word_of_mouth_restock_caught",
      label: spec.title,
      selector: spec.selector,
      fallbackSelector: spec.fallbackSelector,
      shopWordOfMouthRestockCaught: spec,
      rect,
    }
    : null;
}
