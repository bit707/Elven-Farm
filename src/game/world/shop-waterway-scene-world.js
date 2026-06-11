export const WATERWAY_SHELF_TAGS = ["water_food", "drink", "route_rare", "cooling", "clean_food", "fresh_food"];
export const WATERWAY_SIGNATURE_ITEM_IDS = [
  "item_food_qingbo_yukuai",
  "item_food_lingchi_sanxian_geng",
  "item_drink_helu_tangshui",
  "crop_water_lotus_seed",
];

export function shopDoorstepSceneCrowdBoostWorld(row = {}) {
  const chance = Number(row.chance || 0);
  if (row.hostArchetype || row.hostLabel) {
    if (row.bought && ["guest", "faction", "trader"].includes(row.hostArchetype || "")) return chance >= 60 ? 2 : 1;
    if (row.bought) return 1;
    return chance >= 58 ? 1 : 0;
  }
  if (row.bought && ["guest", "faction", "trader"].includes(row.customerArchetype || "")) return chance >= 60 ? 2 : 1;
  if (row.bought) return chance >= 60 ? 1 : 0;
  return chance >= 58 ? 1 : 0;
}

export function shopDoorstepSceneSpecWorld({
  opening = null,
  day = 1,
  crowdBoost = shopDoorstepSceneCrowdBoostWorld,
} = {}) {
  const safeOpening = opening || {};
  const sessionDay = Number(safeOpening.lastSession?.day || 0);
  if (sessionDay !== day) return null;
  const returningRows = Array.isArray(safeOpening.returningCustomers) && safeOpening.returningCustomers.length
    ? safeOpening.returningCustomers
    : Array.isArray(safeOpening.lastSession?.returningCustomers)
      ? safeOpening.lastSession.returningCustomers
      : [];
  const introducedRows = Array.isArray(safeOpening.introducedCustomers) && safeOpening.introducedCustomers.length
    ? safeOpening.introducedCustomers
    : Array.isArray(safeOpening.lastSession?.introducedCustomers)
      ? safeOpening.lastSession.introducedCustomers
      : [];
  if (!returningRows.length && !introducedRows.length) return null;
  const boughtRows = returningRows.filter((row) => row.bought);
  const introducedBoughtRows = introducedRows.filter((row) => row.bought);
  const crowd = [...returningRows, ...introducedRows].reduce((sum, row) => sum + crowdBoost(row), 0);
  const leadRow = returningRows[0] || introducedRows[0];
  const returningNames = returningRows.slice(0, 3).map((row) => row.customerLabel).join(" / ");
  const introducedNames = introducedRows.slice(0, 3).map((row) => row.customerLabel).join(" / ");
  const displayRows = [
    ...returningRows.map((row) => ({ ...row, sceneType: "returning" })),
    ...introducedRows.map((row) => ({ ...row, sceneType: "introduced" })),
  ].slice(0, 4);
  const title = introducedRows.length > 0
    ? crowd >= 3
      ? "熟脸带新脚步，门口更热了"
      : "熟脸把新客领进门"
    : crowd >= 2
      ? "门口熟脸又带热了"
      : boughtRows.length > 0
        ? "熟脸回门，小铺有续声"
        : "熟脸先回来探路";
  const headline = introducedRows.length > 0
    ? `${returningNames || leadRow?.hostLabel || "熟客"}回门后，又把${introducedNames || "新的脚步"}领到了旧铺门前。`
    : crowd >= 2
      ? `${returningNames} 这批昨天记住旧铺的人回来后，门口又跟着多了几双脚步。`
      : boughtRows.length > 0
        ? `${returningNames} 又回门认货，小铺开始有了“隔天还会再来”的声音。`
        : `${returningNames} 先回来探路，门口已经不是只有生客匆匆路过。`;
  const sceneLine = introducedRows.length > 0
    ? `回门 ${returningRows.length} 位 · 新脚步 ${introducedRows.length} 位${introducedBoughtRows.length > 0 ? ` · 新客成交 ${introducedBoughtRows.length} 单` : " · 先把门认住了"}`
    : crowd >= 2
      ? `回门 ${returningRows.length} 位 · 跟热闹的脚步 +${crowd}`
      : `回门 ${returningRows.length} 位${boughtRows.length > 0 ? ` · 再成交 ${boughtRows.length} 单` : " · 先把旧印象接住了"}`;
  const detail = introducedRows[0]?.detail || leadRow?.detail || "把昨天被记住的那件货继续留在头排，门口熟脸会越来越自然地回来。";
  return {
    active: true,
    title,
    headline,
    sceneLine,
    detail,
    rows: displayRows,
    returningCount: returningRows.length,
    introducedCount: introducedRows.length,
    boughtCount: boughtRows.length,
    crowdBoost: crowd,
    tone: crowd >= 2 || boughtRows.length > 0 || introducedBoughtRows.length > 0 ? "good" : "mid",
  };
}

export function shopDoorstepSceneMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  return `
    <div class="shop-doorstep-scene ${spec.tone}">
      <strong>${spec.title}</strong>
      <span>${spec.headline}</span>
      <small>${spec.sceneLine}</small>
      ${spec.rows.slice(0, 3).map((row) => `
        <div class="shop-doorstep-row ${row.bought ? "good" : "mid"}">
          <b>${row.sceneType === "introduced" ? `${row.customerLabel} · ${row.hostLabel || "熟客"}带来的新脚步` : `${row.customerLabel}${row.bought ? " · 回门后又买了" : " · 回门看看"}`}</b>
          <span>${row.resultText || row.arrivalText || row.needText || row.headline}</span>
        </div>
      `).join("")}
      <small>门前小景：${spec.detail}</small>
    </div>
  `;
}

export function shopDoorstepSceneSummaryTextWorld(spec = null) {
  if (!spec?.active) return "";
  return `${spec.rows.map((row) => row.sceneType === "introduced" ? `${row.hostLabel || "熟客"}带来${row.customerLabel}${row.bought ? " 并成交" : " 来认门"}` : `${row.customerLabel}${row.bought ? " 回门又买了" : " 回门看货"}`).join(" / ")}；${spec.sceneLine}；${spec.detail}`;
}

export function shopWaterwayBrokerSceneSpecWorld({
  opening = null,
  report = [],
  day = 1,
  waterwayUnlocked = false,
  itemName = (itemId) => itemId,
  itemsById = new Map(),
  shopTagsForItem = () => [],
  shopTagsOverlap = () => false,
} = {}) {
  if (!waterwayUnlocked) return null;
  const safeOpening = opening || {};
  const sessionDay = Number(safeOpening.lastSession?.day || 0);
  if (sessionDay !== day) return null;
  const rows = (Array.isArray(report) ? report : [])
    .filter((entry) => entry.customerArchetype === "waterway_broker" && entry.reason !== "diagnosis")
    .slice(0, 4);
  if (!rows.length) return null;
  const boughtRows = rows.filter((entry) => entry.reason === "buy");
  const boughtNames = boughtRows.map((entry) => itemName(entry.itemId)).filter(Boolean);
  const waterwayGoods = rows
    .filter((entry) => {
      const item = itemsById.get(entry.itemId);
      const tags = item ? shopTagsForItem(item) : [];
      return shopTagsOverlap(tags, ["water_food", "drink", "route_rare", "cooling"]);
    })
    .map((entry) => itemName(entry.itemId))
    .filter(Boolean);
  const leadItem = boughtNames[0] || waterwayGoods[0] || "水鲜货";
  const boughtCount = boughtRows.length;
  const title = boughtCount > 0 ? "莲泽客船认门成交" : "莲泽客船到店看货";
  const headline = boughtCount > 0
    ? `水航客把${leadItem}认作熟路货，旧铺门前第一次有了“能带回莲泽”的回声。`
    : "水航客顺着青禾跑熟的水路停在旧铺门前，先看水鲜、饮品和能回订的货。";
  const sceneLine = `水航客 ${rows.length} 位 · 成交 ${boughtCount} 单 · ${waterwayGoods.length ? `熟路货 ${waterwayGoods.slice(0, 2).join(" / ")}` : "正在确认水路来头"}`;
  const detail = boughtCount > 0
    ? "这不是普通来客成交，而是商路内容反哺店铺：水航客会把水鲜口碑、回订预期和莲泽熟路一起带回去。"
    : "如果清波鱼脍、灵池三鲜羹或荷露糖水断档，水航客会先记住“路熟但货薄”。";
  const nextAction = boughtCount > 0
    ? "继续保持水鲜和饮品不断档，让水航客从尝鲜变成长单。"
    : "明天优先补一件水鲜或饮品，把熟路客船真正留成成交。";
  return {
    active: true,
    title,
    headline,
    sceneLine,
    detail,
    nextAction,
    rows,
    boughtCount,
    visitorCount: rows.length,
    leadItem,
    waterwayGoods,
    tone: boughtCount > 0 ? "good" : "mid",
    accent: "#4d91a6",
  };
}

export function shopWaterwayBrokerSceneMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  return `
    <div class="shop-waterway-broker-scene ${spec.tone}" data-shop-board="waterway-broker">
      <strong>${spec.title}</strong>
      <span>${spec.headline}</span>
      <small>${spec.sceneLine}</small>
      <div class="shop-waterway-broker-chips">
        <b>莲泽熟路</b>
        <b>${spec.boughtCount > 0 ? `成交 ${spec.boughtCount}` : "先看货"}</b>
        <b>${spec.leadItem}</b>
      </div>
      ${spec.rows.slice(0, 3).map((row) => `
        <div class="shop-waterway-broker-row ${row.reason === "buy" ? "good" : "mid"}">
          <b>${row.name || "水航客"} · ${row.reason === "buy" ? "认门成交" : "泊船看货"}</b>
          <span>${row.text || row.detail || "正在看旧铺水路来头"}</span>
        </div>
      `).join("")}
      <small>掌柜建议：${spec.nextAction}</small>
      <small>画面反馈：水航客船会停在旧铺旁，表示青禾水路内容已经反哺店铺经营。</small>
    </div>
  `;
}

export function shopWaterwayBrokerSceneSummaryTextWorld(spec = null) {
  if (!spec?.active) return "";
  return `${spec.title}：${spec.sceneLine}；${spec.detail} 下一步：${spec.nextAction}`;
}

export function shopWaterwayShelfSpotlightSpecWorld({
  goods = [],
  theme = null,
  waterwayScene = null,
  waterwayUnlocked = false,
  ecologyGarden = null,
  splitTags = () => [],
  itemName = (itemId) => itemId,
  shopTagsForItem = () => [],
  shopTagsOverlap = () => false,
  shopTagLabel = (tag) => tag,
} = {}) {
  if (!waterwayUnlocked) return null;
  const safeGoods = (goods || []).filter(({ item, count }) => item && Number(count || 0) > 0);
  const themeTags = splitTags(theme?.required_item_tags || "");
  const waterwayGoods = safeGoods
    .map(({ item, itemId, count }) => {
      const tags = shopTagsForItem(item || itemId, ecologyGarden);
      const matchedTags = WATERWAY_SHELF_TAGS.filter((tag) => shopTagsOverlap(tags, [tag]));
      const signature = WATERWAY_SIGNATURE_ITEM_IDS.includes(itemId);
      const themeMatch = themeTags.some((tag) => shopTagsOverlap(tags, [tag]));
      const score = matchedTags.length * 4 + (signature ? 5 : 0) + (themeMatch ? 2 : 0) + Math.min(3, Number(count || 0));
      return {
        itemId,
        itemName: itemName(itemId),
        count: Number(count || 0),
        tags,
        matchedTags,
        signature,
        themeMatch,
        score,
        tagText: [...new Set([...matchedTags, ...tags])].slice(0, 3).map(shopTagLabel).join(" / "),
      };
    })
    .filter((entry) => entry.matchedTags.length > 0 || entry.signature)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
    .slice(0, 4);
  const topGood = waterwayGoods[0] || null;
  const missingTags = WATERWAY_SHELF_TAGS
    .filter((tag) => !waterwayGoods.some((good) => shopTagsOverlap(good.tags, [tag])))
    .slice(0, 3);
  const active = Boolean(waterwayScene?.active || waterwayGoods.length > 0);
  if (!active) return null;
  const ready = waterwayGoods.length >= 2 || (topGood && topGood.count >= 2);
  const title = ready ? "水航水鲜货架已亮" : "水航水鲜货架待补";
  const headline = topGood
    ? `${topGood.itemName}适合摆到水航客视线第一格，先让莲泽熟路货有一个明确锚点。`
    : "莲泽熟路已经跑通，但旧铺货架还缺一件能让水航客立刻认门的水鲜或饮品。";
  const detail = waterwayScene?.active
    ? `${waterwayScene.sceneLine}。${topGood ? `他们正在看${topGood.itemName}这类熟路货。` : "他们已经到门口，但货架还没接住水路需求。"}`
    : topGood
      ? `当前水航货 ${waterwayGoods.length} 件，适合等下一批水航客进店时把${topGood.itemName}放头排。`
      : "先从清波鱼脍、灵池三鲜羹、荷露糖水或莲实类货里补一件。";
  const nextAction = ready
    ? "保持水鲜和饮品不断档，水航客会更容易把回订口碑带回莲泽。"
    : missingTags.length > 0
      ? `优先补${missingTags.map(shopTagLabel).join(" / ")}，让熟路货架不只是一件孤品。`
      : "把现有水航货补到 2 件以上，避免水航客刚认门就遇到断档。";
  return {
    active: true,
    ready,
    title,
    headline,
    detail,
    nextAction,
    topGood,
    goods: waterwayGoods,
    missingTags,
    missingTagText: missingTags.map(shopTagLabel).join(" / "),
    tone: ready ? "good" : "mid",
    waterwaySceneActive: Boolean(waterwayScene?.active),
    accent: "#4d91a6",
  };
}

export function shopWaterwayShelfSpotlightMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  const goodsMarkup = spec.goods.length
    ? spec.goods.slice(0, 3).map((good, index) => `
      <div class="shop-waterway-shelf-good ${index === 0 ? "feature" : ""}">
        <b>${index === 0 ? "头排水航货" : "续补水航货"} · ${good.itemName} x${good.count}</b>
        <span>${good.tagText || "水航货"}</span>
      </div>
    `).join("")
    : "<small>货架暂无水航货，先补一件水鲜或饮品。</small>";
  return `
    <div class="shop-waterway-shelf-spotlight ${spec.tone}" data-shop-board="waterway-shelf">
      <strong>${spec.title}</strong>
      <span>${spec.headline}</span>
      <small>${spec.detail}</small>
      <div class="shop-waterway-shelf-chips">
        <b>${spec.ready ? "可接熟路客" : "货架偏薄"}</b>
        <b>${spec.topGood?.itemName || "待补水鲜"}</b>
        <b>${spec.waterwaySceneActive ? "客船已到" : "预备来客"}</b>
      </div>
      <div class="shop-waterway-shelf-goods">${goodsMarkup}</div>
      ${spec.missingTagText ? `<small>缺口标签：${spec.missingTagText}</small>` : ""}
      <small>掌柜建议：${spec.nextAction}</small>
    </div>
  `;
}

export function shopWaterwayShelfSpotlightSummaryTextWorld(spec = null) {
  if (!spec?.active) return "";
  return `${spec.title}：${spec.headline} ${spec.nextAction}`;
}

export function shopWaterwayCustomerBrowseSpecWorld({
  opening = null,
  report = [],
  shelf = null,
  day = 1,
  waterwayUnlocked = false,
  itemName = (itemId) => itemId,
  shopTagsForItem = () => [],
  shopTagLabel = (tag) => tag,
  localize = (_key, fallback = "") => fallback,
} = {}) {
  if (!waterwayUnlocked) return null;
  const safeOpening = opening || {};
  if (Number(safeOpening.lastSession?.day || 0) !== day) return null;
  const rows = (Array.isArray(report) ? report : [])
    .map((entry, reportIndex) => ({ ...entry, reportIndex }))
    .filter((entry) => entry.customerArchetype === "waterway_broker" && entry.reason !== "diagnosis")
    .slice(0, 3);
  if (!rows.length) return null;
  const lead = rows.find((entry) => entry.reason === "buy") || rows[0];
  const targetGood = shelf?.topGood || (lead?.itemId ? {
    itemId: lead.itemId,
    itemName: itemName(lead.itemId),
    tagText: shopTagsForItem(lead.itemId).slice(0, 3).map(shopTagLabel).join(" / "),
  } : null);
  const bought = rows.some((entry) => entry.reason === "buy");
  const warned = rows.some((entry) => ["price", "stock", "tag"].includes(entry.reason));
  const flowHint = localize("customer_flow_hint_waterway_check", "水航客正在看水鲜、饮品和能带回莲泽的熟路货。");
  const routeHint = localize("customer_flow_hint_waterway_route", "水航客会为稳定熟路和可回订口碑接受更高价格。");
  const bubble = bought
    ? "这件带回莲泽有人认。"
    : warned
      ? "路是熟的，货还要稳。"
      : "先看水鲜和回订口碑。";
  const title = bought ? "水航客挑中熟路货" : warned ? "水航客挑货后犹豫" : "水航客正在挑货";
  const headline = targetGood
    ? `水航客停在${targetGood.itemName}前，正在判断这件货能不能带回莲泽认门。`
    : "水航客停在水航货架前，先确认旧铺是不是有稳定水鲜和饮品。";
  const detail = bought
    ? `${routeHint} 今天这条线已经从“看路”变成“认货”。`
    : warned
      ? `${flowHint} 今天的短板会直接影响水航客是否愿意回订。`
      : `${flowHint} 如果头排货够清楚，他们会更愿意把口碑带回莲泽。`;
  const nextAction = shelf?.nextAction || (bought
    ? "保持水鲜不断档，让这批熟路客变成长单。"
    : "先补厚水鲜和饮品，再开铺接下一批水航客。");
  return {
    active: true,
    title,
    headline,
    detail,
    nextAction,
    bubble,
    rows,
    lead,
    targetGood,
    bought,
    warned,
    tone: bought ? "good" : warned ? "warn" : "mid",
    reportIndex: Number(lead?.reportIndex ?? -1),
    customerLabel: lead?.name || "水航客",
    actionLabel: bought ? "认门成交" : warned ? "挑货犹豫" : "驻足挑货",
    accent: "#4d91a6",
  };
}

export function shopWaterwayCustomerBrowseMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  return `
    <div class="shop-waterway-browse-scene ${spec.tone}" data-shop-board="waterway-browse">
      <strong>${spec.title} · ${spec.customerLabel}</strong>
      <span>${spec.headline}</span>
      <small>${spec.detail}</small>
      <div class="shop-waterway-browse-focus">
        <b>${spec.actionLabel}</b>
        <span>${spec.bubble}</span>
        <small>${spec.targetGood?.itemName || "水航货架"} · ${spec.targetGood?.tagText || "水鲜 / 饮品 / 熟路货"}</small>
      </div>
      <small>掌柜建议：${spec.nextAction}</small>
      ${spec.reportIndex >= 0 ? `<button type="button" data-shop-focus-report="${spec.reportIndex}">定位水航客反馈</button>` : ""}
    </div>
  `;
}

export function shopWaterwayCustomerBrowseSummaryTextWorld(spec = null) {
  if (!spec?.active) return "";
  return `${spec.title}：${spec.headline} ${spec.nextAction}`;
}

export function shopWaterwayReorderFollowupSceneSpecWorld({
  opening = null,
  report = [],
  followup = null,
  day = 1,
  reorderUnlocked = false,
  itemName = (itemId) => itemId,
} = {}) {
  if (!reorderUnlocked) return null;
  const safeOpening = opening || {};
  if (Number(safeOpening.lastSession?.day || 0) !== day) return null;
  const rows = (Array.isArray(report) ? report : [])
    .map((entry, reportIndex) => ({ ...entry, reportIndex }))
    .filter((entry) => entry.customerArchetype === "waterway_broker" && entry.reason !== "diagnosis")
    .slice(0, 4);
  const followupReport = (Array.isArray(report) ? report : [])
    .map((entry, reportIndex) => ({ ...entry, reportIndex }))
    .find((entry) => entry.reason === "waterway_reorder_followup");
  const supportedRows = rows.filter((entry) => entry.waterwayReorderFollowup || String(entry.detail || "").includes("不断档熟路货") || entry.reason === "buy");
  if (!followupReport && !supportedRows.length) return null;
  const boughtRows = supportedRows.filter((entry) => entry.reason === "buy");
  const lead = supportedRows[0] || rows[0] || followupReport || {};
  const leadItemName = lead.itemId ? itemName(lead.itemId) : followup?.leadItemName || "水航熟路货";
  const budgetBonus = Math.round(Number(followup?.budgetBonus || 0) * 100);
  const title = boughtRows.length > 0 ? "莲泽熟路长单回响" : "莲泽熟路复访待接";
  const headline = boughtRows.length > 0
    ? `${lead.name || "水航客"}把${leadItemName}当成长单样品，旧铺不再只是“今天碰巧有货”。`
    : "水航客又顺着熟路回到旧铺门前，正在看这条回订单是不是还能不断档。";
  const sceneLine = boughtRows.length > 0
    ? `水航复访 ${rows.length || 1} 位 · 长单成交 ${boughtRows.length} 单 · 预算 +${budgetBonus}%`
    : `水航复访 ${rows.length || 1} 位 · ${followup?.stocked ? "货架待确认" : "缺熟路货"} · 先稳住补货`;
  const detail = followupReport?.detail || followup?.detail || "完成水航回订补货后，水航客会把稳定备货当作再次进店的理由。";
  const nextAction = boughtRows.length > 0
    ? "继续让水鲜、饮品和路线稀货不断档，把水航复访养成长单客群。"
    : "先补回清波鱼脍、灵池三鲜羹或荷露糖水，再开铺接下一轮复访。";
  return {
    active: true,
    title,
    headline,
    sceneLine,
    detail,
    nextAction,
    rows,
    boughtRows,
    lead,
    leadItemName,
    budgetBonus,
    visitorBonus: Number(followup?.visitorBonus || 0),
    stocked: Boolean(followup?.stocked),
    bubble: boughtRows.length > 0 ? "这家货不断档。" : "熟路要看厚货。",
    reportIndex: Number(followupReport?.reportIndex ?? lead?.reportIndex ?? -1),
    tone: boughtRows.length > 0 ? "good" : followup?.stocked ? "mid" : "warn",
    accent: "#4d91a6",
  };
}

export function shopWaterwayReorderFollowupMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  return `
    <div class="shop-waterway-reorder-followup ${spec.tone}" data-shop-board="waterway-reorder-followup">
      <strong>${spec.title}</strong>
      <span>${spec.headline}</span>
      <small>${spec.sceneLine}</small>
      <div class="shop-waterway-reorder-chips">
        <b>水航回订</b>
        <b>${spec.leadItemName}</b>
        <b>${spec.budgetBonus > 0 ? `预算 +${spec.budgetBonus}%` : "先补货"}</b>
        ${spec.visitorBonus > 0 ? `<b>来客 +${spec.visitorBonus}</b>` : ""}
      </div>
      ${spec.rows.slice(0, 3).map((row) => `
        <div class="shop-waterway-reorder-row ${row.reason === "buy" ? "good" : "mid"}">
          <b>${row.name || "水航客"} · ${row.reason === "buy" ? "长单认货" : "复访看货"}</b>
          <span>${row.waterwayReorderFollowupText || row.text || row.detail || "正在确认旧铺熟路货是否不断档"}</span>
        </div>
      `).join("")}
      <small>掌柜建议：${spec.nextAction}</small>
      ${spec.reportIndex >= 0 ? `<button type="button" data-shop-focus-report="${spec.reportIndex}">定位熟路回访</button>` : ""}
    </div>
  `;
}

export function shopWaterwayReorderFollowupSummaryTextWorld(spec = null) {
  if (!spec?.active) return "";
  return `${spec.title}：${spec.sceneLine}；${spec.detail} 下一步：${spec.nextAction}`;
}

export function drawShopWaterwayBrokerSceneWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawLabel = () => {},
} = {}) {
  if (!ctx || !spec?.active) return false;
  const x = 238;
  const y = 214;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.6) * 2;
  const accent = spec.accent || "#4d91a6";
  ctx.save();
  ctx.globalAlpha = 0.94;

  ctx.strokeStyle = "rgba(77, 145, 166, 0.34)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(x - 28 + i * 9, y + 46 + i * 8);
    ctx.bezierCurveTo(x + 18, y + 34 + i * 8, x + 82, y + 58 + i * 8, x + 138, y + 42 + i * 8);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(241, 249, 251, 0.94)";
  ctx.beginPath();
  ctx.roundRect(x - 14, y - 20 + bob, 144, 62, 17);
  ctx.fill();
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(143, 95, 63, 0.88)";
  ctx.beginPath();
  ctx.moveTo(x + 6, y + 24 + bob);
  ctx.quadraticCurveTo(x + 54, y + 44 + bob, x + 108, y + 22 + bob);
  ctx.lineTo(x + 96, y + 38 + bob);
  ctx.quadraticCurveTo(x + 50, y + 55 + bob, x + 16, y + 39 + bob);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(224, 182, 109, 0.92)";
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.roundRect(x + 22 + i * 22, y + 8 + bob + (i % 2) * 3, 18, 15, 4);
    ctx.fill();
  }

  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 72, y + 22 + bob);
  ctx.lineTo(x + 72, y - 14 + bob);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 253, 245, 0.95)";
  ctx.beginPath();
  ctx.moveTo(x + 74, y - 12 + bob);
  ctx.lineTo(x + 112, y - 2 + bob);
  ctx.lineTo(x + 74, y + 10 + bob);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = `${accent}aa`;
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText("水航", x + 80, y + 2 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(spec.boughtCount > 0 ? "认门成交" : "泊船看货", x + 14, y - 4 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.visitorCount} 位水航客 · ${spec.leadItem}`.slice(0, 18), x + 14, y + 13 + bob);

  drawLabel("莲泽客船到店", x - 10, y - 32 + bob, accent);
  ctx.restore();
  return true;
}

export function drawShopWaterwayShelfSpotlightWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawLabel = () => {},
} = {}) {
  if (!ctx || !spec?.active) return false;
  const x = 74;
  const y = 252;
  const accent = spec.accent || "#4d91a6";
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2) * 2;
  ctx.save();
  ctx.globalAlpha = 0.94;

  ctx.fillStyle = "rgba(241, 249, 251, 0.9)";
  ctx.beginPath();
  ctx.roundRect(x, y, 158, 72, 16);
  ctx.fill();
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = "rgba(77, 145, 166, 0.28)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 54 + i * 5 + pulse * 0.2);
    ctx.quadraticCurveTo(x + 44, y + 46 + i * 5, x + 80, y + 54 + i * 5);
    ctx.quadraticCurveTo(x + 116, y + 62 + i * 5, x + 148, y + 52 + i * 5);
    ctx.stroke();
  }

  const goods = spec.goods.slice(0, 3);
  for (let i = 0; i < Math.max(2, goods.length || 2); i += 1) {
    const gx = x + 18 + i * 42;
    const gy = y + 24 + (i % 2) * 4 + pulse;
    const good = goods[i] || null;
    if (good?.itemId === "item_drink_helu_tangshui" || (good?.matchedTags || []).includes("drink")) {
      ctx.fillStyle = "rgba(224, 182, 109, 0.9)";
      ctx.beginPath();
      ctx.roundRect(gx + 7, gy - 8, 12, 24, 5);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
      ctx.fillRect(gx + 10, gy - 2, 6, 5);
    } else {
      ctx.fillStyle = i === 0 ? "rgba(122, 195, 213, 0.86)" : "rgba(202, 235, 210, 0.86)";
      ctx.beginPath();
      ctx.ellipse(gx + 14, gy + 8, 19, 9, -0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
      ctx.beginPath();
      ctx.ellipse(gx + 13, gy + 8, 11, 4, -0.18, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = i === 0 ? `${accent}aa` : "rgba(143, 95, 63, 0.44)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(gx + 2, gy + 18, 32, 14, 5);
    ctx.stroke();
  }

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(x + 10, y + 8, 54, 18, 6);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText("水航货架", x + 14, y + 21);

  ctx.fillStyle = "#17231d";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText((spec.topGood?.itemName || "待补水鲜").slice(0, 7), x + 72, y + 21);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.ready ? "熟路货架已亮" : "补厚水鲜饮品", x + 72, y + 38);

  drawLabel(spec.ready ? "水鲜货架被认门" : "水航货架待补", x + 2, y - 12, accent);
  ctx.restore();
  return true;
}

export function drawShopWaterwayCustomerBrowseWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawLabel = () => {},
  drawShopCrowdPerson = () => {},
} = {}) {
  if (!ctx || !spec?.active) return false;
  const x = 178;
  const y = 314;
  const accent = spec.accent || "#4d91a6";
  const bob = reducedMotion ? 0 : Math.sin(motion * 2.2) * 2;
  ctx.save();
  ctx.globalAlpha = 0.95;

  ctx.strokeStyle = `${accent}66`;
  ctx.lineWidth = 2.4;
  ctx.setLineDash([5, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(232, 296);
  ctx.quadraticCurveTo(212, 294 + bob, x + 24, y - 18);
  ctx.stroke();
  ctx.setLineDash([]);

  drawShopCrowdPerson(ctx, x, y - 42 + bob, {
    buyer: spec.bought,
    leaver: spec.warned,
    looker: !spec.bought && !spec.warned,
    color: accent,
    accent,
    alpha: 0.96,
  }, motion);

  ctx.strokeStyle = `${accent}aa`;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 20, y - 24 + bob);
  ctx.quadraticCurveTo(x + 38, y - 30 + bob, x + 56, y - 42 + bob);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 253, 245, 0.95)";
  ctx.beginPath();
  ctx.arc(x + 58, y - 43 + bob, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const bubbleX = x + 38;
  const bubbleY = y - 104 + bob;
  ctx.fillStyle = spec.tone === "good"
    ? "rgba(237, 243, 223, 0.94)"
    : spec.tone === "warn"
      ? "rgba(255, 240, 232, 0.94)"
      : "rgba(241, 249, 251, 0.94)";
  ctx.strokeStyle = `${accent}77`;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, 154, 58, 16);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(spec.actionLabel, bubbleX + 12, bubbleY + 19);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(String(spec.bubble || "正在挑货").slice(0, 12), bubbleX + 12, bubbleY + 37);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText((spec.targetGood?.itemName || "水航货架").slice(0, 12), bubbleX + 12, bubbleY + 50);

  ctx.strokeStyle = `${accent}55`;
  ctx.beginPath();
  ctx.moveTo(bubbleX + 18, bubbleY + 58);
  ctx.lineTo(x + 18, y - 48 + bob);
  ctx.stroke();

  if (!reducedMotion) {
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(122, 195, 213, 0.58)" : "rgba(224, 182, 109, 0.5)";
      ctx.beginPath();
      ctx.arc(x + 72 + i * 12, y - 38 + Math.sin(motion * 2 + i) * 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawLabel("水航客挑货", x - 8, y + 6 + bob, accent);
  ctx.restore();
  return true;
}

export function drawShopWaterwayReorderFollowupSceneWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  drawLabel = () => {},
} = {}) {
  if (!ctx || !spec?.active) return false;
  const x = 306;
  const y = 306;
  const accent = spec.accent || "#4d91a6";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.9) * 2;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.8) * 2;
  ctx.save();
  ctx.globalAlpha = 0.95;

  ctx.strokeStyle = `${accent}55`;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(x - 48, y + 42);
  ctx.bezierCurveTo(x - 10, y + 16 + pulse, x + 54, y + 76 - pulse, x + 128, y + 30);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(241, 249, 251, 0.94)";
  ctx.beginPath();
  ctx.roundRect(x - 8, y - 32 + bob, 162, 82, 18);
  ctx.fill();
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(224, 182, 109, 0.86)";
  ctx.beginPath();
  ctx.roundRect(x + 18, y + 2 + bob, 38, 24, 6);
  ctx.fill();
  ctx.fillStyle = "rgba(143, 95, 63, 0.8)";
  ctx.fillRect(x + 24, y - 6 + bob, 26, 8);
  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.fillRect(x + 25, y + 10 + bob, 24, 3);

  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.beginPath();
  ctx.roundRect(x + 74, y - 18 + bob, 50, 48, 12);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.34)";
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText("回订单", x + 82, y - 1 + bob);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.leadItemName.slice(0, 6), x + 82, y + 15 + bob);

  ctx.strokeStyle = `${accent}aa`;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(x + 142, y + 8 + bob, 18, Math.PI * 0.25, Math.PI * 1.84);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(x + 128, y + 20 + bob);
  ctx.lineTo(x + 116, y + 20 + bob);
  ctx.lineTo(x + 123, y + 30 + bob);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#17231d";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(spec.boughtRows.length > 0 ? "熟路长单成形" : "熟路复访待接", x + 8, y - 14 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(spec.sceneLine.slice(0, 22), x + 8, y + 42 + bob);

  const bubbleX = x + 42;
  const bubbleY = y - 74 + bob;
  ctx.fillStyle = spec.tone === "good" ? "rgba(237, 243, 223, 0.94)" : "rgba(255, 248, 232, 0.94)";
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, 130, 38, 14);
  ctx.fill();
  ctx.strokeStyle = `${accent}66`;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText("莲泽熟路", bubbleX + 12, bubbleY + 16);
  ctx.fillStyle = "#17231d";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.bubble.slice(0, 12), bubbleX + 12, bubbleY + 31);

  if (!reducedMotion) {
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(122, 195, 213, 0.5)" : "rgba(224, 182, 109, 0.46)";
      ctx.beginPath();
      ctx.arc(x - 22 + i * 28, y + 58 + Math.sin(motion * 2 + i) * 4, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawLabel("莲泽熟路回访", x - 6, y + 62 + bob, accent);
  ctx.restore();
  return true;
}
