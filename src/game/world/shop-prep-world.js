export function drawShopShelfPrepWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.55) * 2.2;
  const cardY = rect.y + bob;
  const accent = spec.tone === "warn" ? "#be4f37" : spec.tone === "ready" ? "#286f58" : "#b47d2f";

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(rect.x + 54, cardY + rect.height - 6);
  ctx.quadraticCurveTo(rect.x + 82, cardY + rect.height + 36, anchor.x, anchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.tone === "warn" ? "rgba(255, 240, 232, 0.96)" : "rgba(255, 253, 245, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 18, 54, 54, 15);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.count,
  }, rect.x + 24, cardY + 26, 34, {
    accent,
    missing: false,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.2) * 1.2,
  });
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("主推", rect.x + 28, cardY + 76);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 84, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} x${spec.count}`.slice(0, 18), rect.x + 84, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.themeName} ${spec.themeScore}% · ${spec.hotTagLabel}`.slice(0, 30), rect.x + 84, cardY + 66);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`客群 ${spec.customerName} · ${spec.weatherText}`.slice(0, 34), rect.x + 84, cardY + 84);

  ctx.fillStyle = spec.tone === "warn" ? "rgba(190, 79, 55, 0.12)" : "rgba(202, 235, 210, 0.6)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 94, rect.width - 32, 20, 10);
  ctx.fill();
  ctx.fillStyle = spec.tone === "warn" ? "#be4f37" : "#286f58";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.openingExpectation}`.slice(0, 36), rect.x + 28, cardY + 108);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.9)" : "rgba(224, 182, 109, 0.58)";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 44 + i * 9, cardY + 21 + Math.sin(motion * 2 + i) * 2, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function shopShelfPrepWorldBoardSpecWorld({
  goods = [],
  day = 1,
  width = 960,
  height = 640,
  opening = null,
  ecologyGarden = null,
  theme = null,
  diagnosis = null,
  weatherReaction = null,
  weatherShelf = null,
  wordShelf = null,
  shelfThemeName = "",
  itemName = (itemId) => itemId,
  resolveItemForTags = (itemId) => itemId,
  shopTagsForItem = () => [],
  shopTagLabel = (tag) => tag,
  splitTags = () => [],
  activeCustomerSegments = () => [],
  customerDisplayName = (customer) => customer,
} = {}) {
  if (!Array.isArray(goods) || !goods.length) return null;
  const fallbackGood = goods[0]
    ? {
      itemId: goods[0].itemId,
      itemName: itemName(goods[0].itemId),
      count: Number(goods[0].count || 0),
      tagText: shopTagsForItem(goods[0].item || goods[0].itemId, ecologyGarden).slice(0, 3).map(shopTagLabel).join(" / ") || "应季货",
      customerText: "第一批路过客",
    }
    : null;
  const topGood = wordShelf?.topGood
    || diagnosis?.featuredGoods?.[0]
    || weatherShelf?.topGoods?.[0]
    || fallbackGood;
  if (!topGood?.itemId) return null;
  const itemTags = shopTagsForItem(resolveItemForTags(topGood.itemId), ecologyGarden);
  const themeScore = Math.max(0, Number(diagnosis?.themeScore || 0));
  const minThemeScore = Math.max(0, Number(diagnosis?.minThemeScore || 0));
  const customerTarget = diagnosis?.customerTargets?.[0] || null;
  const activeSegment = activeCustomerSegments()[0] || null;
  const customerName = wordShelf?.customerName
    || customerTarget?.name
    || topGood.customerText
    || (activeSegment?.customer_archetype ? customerDisplayName(activeSegment.customer_archetype) : "第一批路过客");
  const customerText = wordShelf ? `${wordShelf.sourceLabel}传来的${wordShelf.hotTagLabel}客` : customerTarget?.tagText || topGood.customerText || "先用应季货测试脚步";
  const hotTag = wordShelf?.hotTag
    || diagnosis?.hotTag
    || weatherShelf?.desiredTags?.[0]
    || splitTags(theme?.required_item_tags || "")[0]
    || itemTags[0]
    || "";
  const hotTagLabel = wordShelf?.hotTagLabel || diagnosis?.hotTagLabel || (hotTag ? shopTagLabel(hotTag) : topGood.tagText || "应季货");
  const weatherFocus = !wordShelf && Boolean(weatherShelf?.active && weatherShelf.topGoods?.some((good) => good.itemId === topGood.itemId));
  const selector = wordShelf?.selector || (weatherFocus ? '[data-shop-board="weather-shelf"]' : '[data-shop-board="display-diagnosis"]');
  const themeReady = themeScore >= Math.max(1, minThemeScore);
  const tone = wordShelf
    ? wordShelf.ready ? "ready" : "focus"
    : diagnosis?.tone === "warn" || (weatherShelf?.tone === "warn" && !weatherFocus)
      ? "warn"
      : themeReady && Number(topGood.count || 0) >= 2
        ? "ready"
        : "focus";
  const openingExpectation = wordShelf?.openingExpectation || (weatherFocus
    ? `${weatherShelf.weatherName}客会先看${weatherShelf.title}`
    : themeReady
      ? `${customerName}更容易被${hotTagLabel}留住`
      : `先看陈列诊断，补齐${diagnosis?.missingTagText || hotTagLabel}`);
  const advice = wordShelf?.advice
    || diagnosis?.advice
    || weatherShelf?.actionText
    || "先把主推货放到头排，再决定是否开铺。";
  const cardWidth = 292;
  const cardHeight = 124;
  const x = Math.max(42, Math.min(width - cardWidth - 36, 70));
  const y = Math.max(96, Math.min(height - cardHeight - 48, 118));
  return {
    active: true,
    key: `${day}:${topGood.itemId}:${topGood.count}:${theme?.theme_tag || "shop"}:${themeScore}:${weatherShelf?.kind || "daily"}:${wordShelf?.sourceId || "normal"}`,
    day,
    title: wordShelf ? "主世界来帖头排推荐" : "主世界旧铺上架推荐",
    cta: wordShelf ? "来帖头排 · 可点" : "旧铺主推 · 可点",
    itemId: topGood.itemId,
    itemName: topGood.itemName || itemName(topGood.itemId),
    count: Number(topGood.count || 0),
    tagText: wordShelf?.tagText || topGood.tagText || itemTags.slice(0, 3).map(shopTagLabel).join(" / ") || hotTagLabel,
    themeName: diagnosis?.themeName || theme?.note || shelfThemeName || "旧铺主题",
    themeScore,
    minThemeScore,
    hotTag,
    hotTagLabel,
    customerName,
    customerText,
    weatherText: weatherShelf?.active ? `${weatherShelf.weatherName} · ${weatherShelf.title}` : "日常客流 · 看陈列",
    openingExpectation,
    advice,
    selector,
    weatherFocus,
    wordOfMouthFocus: Boolean(wordShelf),
    wordOfMouthLabel: wordShelf?.label || "",
    safeNote: wordShelf ? "只定位旧铺市闻和来帖，不会自动开铺、接客、成交、改价、补货或消耗库存" : "不会自动开铺或消耗库存",
    tone,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 154, y: 232 },
  };
}

export function shopShelfPrepWorldBoardAtCanvasPointWorld({
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

export function shopShelfPrepWorldBoardFocusLogSpecWorld({
  spec = null,
} = {}) {
  if (!spec?.itemId) return null;
  return {
    title: spec.wordOfMouthFocus ? "点选来帖头排推荐" : "点选旧铺上架推荐",
    missingTitle: spec.wordOfMouthFocus ? "点选来帖头排推荐" : "点选旧铺上架推荐",
    missingLog: spec.wordOfMouthFocus
      ? "来帖头排牌已经点到，但右侧市闻/来帖卡暂时没有找到；先确认核心试玩分组是否可见。"
      : "旧铺主推牌已经点到，但右侧陈列诊断暂时没有找到；先确认核心试玩分组是否可见。",
    detail: spec.wordOfMouthFocus
      ? `${spec.itemName} x${spec.count} 适合接住${spec.wordOfMouthLabel || "铺前来帖"}，目标客群：${spec.customerName}。已定位旧铺市闻/来帖卡，${spec.safeNote}。`
      : `${spec.itemName} x${spec.count} 适合做今日主推，主题 ${spec.themeName} ${spec.themeScore}%；目标客群：${spec.customerName}。已定位旧铺${spec.weatherFocus ? "天气货签" : "陈列诊断"}，${spec.safeNote}。`,
  };
}

export function shopDailyGoodsEyeWorldSpecWorld({
  goods = [],
  day = 1,
  width = 960,
  height = 640,
  opening = null,
  ecologyGarden = null,
  theme = null,
  diagnosis = null,
  weatherReaction = null,
  weatherShelf = null,
  wordSpec = null,
  wordShelf = null,
  shelfThemeName = "",
  itemName = (itemId) => itemId,
  resolveItemForTags = (itemId) => itemId,
  shopTagsForItem = () => [],
  shopTagLabel = (tag) => tag,
  currentWeather = null,
  fallbackWeatherId = "",
  localize = (_key, fallback = "") => fallback,
  shopDailyGoodsEyeReasonCopy = () => ({
    headline: "",
    reason: "",
    eye: "",
    route: "",
    badge: "",
  }),
} = {}) {
  if (!Array.isArray(goods) || !goods.length) return null;
  const fallbackGood = goods[0]
    ? {
      itemId: goods[0].itemId,
      itemName: itemName(goods[0].itemId),
      count: Number(goods[0].count || 0),
      tagText: shopTagsForItem(goods[0].item || goods[0].itemId, ecologyGarden).slice(0, 3).map(shopTagLabel).join(" / "),
      customerText: "路过客",
    }
    : null;
  const wordGood = wordShelf?.topGood
    ? {
      itemId: wordShelf.itemId,
      itemName: wordShelf.itemName,
      count: wordShelf.count,
      tagText: wordShelf.tagText,
      customerText: wordShelf.customerName,
    }
    : null;
  const weatherGood = weatherShelf?.topGoods?.[0] || null;
  const diagnosisGood = diagnosis?.featuredGoods?.[0] || null;
  const topGood = wordGood || weatherGood || diagnosisGood || fallbackGood;
  if (!topGood?.itemId) return null;

  const itemTags = shopTagsForItem(resolveItemForTags(topGood.itemId), ecologyGarden);
  const tagText = topGood.tagText || itemTags.slice(0, 3).map(shopTagLabel).join(" / ") || "应季货";
  const hotTag = wordShelf?.hotTag
    || diagnosis?.hotTag
    || weatherShelf?.desiredTags?.[0]
    || itemTags[0]
    || "";
  const hotTagLabel = wordShelf?.hotTagLabel || diagnosis?.hotTagLabel || (hotTag ? shopTagLabel(hotTag) : tagText);
  const weatherFocus = !wordShelf && Boolean(weatherShelf?.active && weatherGood?.itemId === topGood.itemId);
  const mode = wordShelf ? "word" : weatherFocus ? "weather" : "diagnosis";
  const customerTarget = diagnosis?.customerTargets?.[0] || null;
  const customerName = wordShelf?.customerName
    || customerTarget?.name
    || topGood.customerText
    || "路过客";
  const themeName = diagnosis?.themeName || theme?.note || shelfThemeName || "旧铺陈列";
  const themeScore = Math.max(0, Number(diagnosis?.themeScore || 0));
  const selector = wordShelf?.selector || (weatherFocus ? '[data-shop-board="weather-shelf"]' : '[data-shop-board="display-diagnosis"]');
  const currentWeatherName = localize(currentWeather?.weather_name_key, currentWeather?.weather_id || fallbackWeatherId || "天气");
  const reasonCopy = shopDailyGoodsEyeReasonCopy({
    mode,
    itemName: topGood.itemName || itemName(topGood.itemId),
    customerName,
    hotTagLabel,
    sourceLabel: wordShelf?.sourceLabel || wordSpec?.sourceLabels?.[0] || "",
    weatherName: weatherShelf?.weatherName || currentWeatherName,
    themeName,
    themeScore,
    opening,
    weatherReaction,
  });
  const tone = mode === "word"
    ? wordShelf?.ready ? "ready" : "focus"
    : mode === "weather"
      ? "weather"
      : diagnosis?.tone === "warn"
        ? "warn"
        : "focus";
  const cardWidth = 308;
  const cardHeight = 132;
  const x = Math.max(318, Math.min(width - cardWidth - 32, 520));
  const y = Math.max(74, Math.min(height - cardHeight - 44, 96));
  return {
    active: true,
    key: `${day}:${topGood.itemId}:${topGood.count}:${mode}:${theme?.theme_tag || "shop"}:${themeScore}:${weatherShelf?.kind || "daily"}:${wordShelf?.sourceId || "normal"}`,
    day,
    title: "旧铺今日货眼小景",
    cta: "旧铺今日货眼小景 · 可点",
    itemId: topGood.itemId,
    itemName: topGood.itemName || itemName(topGood.itemId),
    count: Number(topGood.count || 0),
    tagText,
    hotTagLabel,
    customerName,
    themeName,
    themeScore,
    weatherName: weatherShelf?.weatherName || currentWeatherName,
    mode,
    tone,
    selector,
    headline: reasonCopy.headline,
    reason: reasonCopy.reason,
    eye: reasonCopy.eye,
    route: reasonCopy.route,
    badge: reasonCopy.badge,
    safeNote: "只定位旧铺反馈、陈列诊断、天气货签或市闻来帖，不会自动上架、开铺、改价、成交、补货或消耗库存",
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 232, y: 234 },
  };
}

export function shopDailyGoodsEyeWorldAtCanvasPointWorld({
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

export function shopDailyGoodsEyeWorldFocusLogSpecWorld({
  spec = null,
} = {}) {
  if (!spec?.itemId) return null;
  return {
    title: "点选旧铺今日货眼小景",
    missingTitle: "点选旧铺今日货眼小景",
    missingLog: "旧铺今日货眼小景已经点到，但右侧旧铺反馈暂时没有找到；先确认核心试玩分组是否可见。",
    detail: `${spec.itemName} x${spec.count} 为什么值得摆出来：${spec.reason} 已定位旧铺反馈；${spec.safeNote}。`,
  };
}

export function drawShopDailyGoodsEyeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.tone === "ready"
    ? "#286f58"
    : spec.tone === "weather"
      ? "#4d91a6"
      : spec.tone === "warn"
        ? "#be4f37"
        : "#b47d2f";
  const fill = spec.tone === "warn"
    ? "rgba(255, 240, 232, 0.96)"
    : spec.tone === "weather"
      ? "rgba(236, 248, 250, 0.96)"
      : "rgba(255, 253, 245, 0.96)";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.35) * 2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}58`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 11;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.bezierCurveTo(anchor.x + 58, anchor.y - 54, rect.x + 36, cardY + rect.height + 30, rect.x + 42, cardY + rect.height - 6);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(23, 35, 29, 0.13)";
  ctx.beginPath();
  ctx.ellipse(rect.x + rect.width * 0.5, cardY + rect.height + 8, rect.width * 0.38, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, fill);
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}8a`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  if (active) {
    ctx.strokeStyle = `${accent}66`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
    ctx.beginPath();
    ctx.roundRect(rect.x - 5, cardY - 5, rect.width + 10, rect.height + 10, 21);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 16, 58, 58, 16);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.count,
  }, rect.x + 24, cardY + 25, 38, {
    accent,
    missing: false,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.4) * 1.1,
  });
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("货眼", rect.x + 25, cardY + 84);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.badge}`.slice(0, 24), rect.x + 86, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} x${spec.count}`.slice(0, 18), rect.x + 86, cardY + 48);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`为什么值得摆出来：${spec.headline}`.slice(0, 32), rect.x + 86, cardY + 66);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`客眼 ${spec.customerName} · ${spec.hotTagLabel} · ${spec.themeScore}%`.slice(0, 35), rect.x + 86, cardY + 83);

  const chips = [
    { label: "货签", text: spec.tagText || spec.hotTagLabel },
    { label: "客眼", text: spec.customerName },
    { label: "理由", text: spec.mode === "word" ? "市闻对口" : spec.mode === "weather" ? "天气对口" : "陈列顺眼" },
  ];
  chips.forEach((chip, index) => {
    const chipX = rect.x + 18 + index * 94;
    const chipY = cardY + 96;
    ctx.fillStyle = index === 2 ? `${accent}18` : "rgba(255, 253, 245, 0.78)";
    ctx.strokeStyle = `${accent}36`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 82, 22, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(chip.label, chipX + 8, chipY + 9);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(String(chip.text || "").slice(0, 7), chipX + 29, chipY + 16);
  });

  ctx.fillStyle = spec.tone === "warn" ? "rgba(190, 79, 55, 0.12)" : "rgba(202, 235, 210, 0.45)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 26, rect.width - 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = spec.tone === "warn" ? "#be4f37" : "#286f58";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.route.slice(0, 31), rect.x + 28, cardY + rect.height - 14);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.9)" : "rgba(224, 182, 109, 0.56)";
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 44 + i * 8, cardY + 22 + Math.sin(motion * 1.8 + i) * 2.6, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function shopCustomerPickShadowRowsWorld({
  goodsEye = null,
  forecast = null,
  trial = null,
} = {}) {
  if (!goodsEye?.itemId) return [];
  const rows = [];
  const primaryCustomer = goodsEye.customerName || forecast?.customerName || trial?.customerLabel || "第一批路过客";
  rows.push({
    key: "notice",
    badge: "看",
    customerName: primaryCustomer,
    itemName: goodsEye.itemName,
    thought: `${goodsEye.hotTagLabel || "应季货"}味道对口`,
    reason: goodsEye.mode === "word"
      ? "听见铺前来帖，先看头排有没有对口货。"
      : goodsEye.mode === "weather"
        ? "天气让这类货更好解释，脚步会先停一下。"
        : "陈列标签顺眼，顾客能先读懂这件货。",
    tone: goodsEye.tone === "warn" ? "warn" : "ready",
    accent: goodsEye.tone === "weather" ? "#4d91a6" : goodsEye.tone === "warn" ? "#be4f37" : "#286f58",
  });
  const goodsCount = Number(goodsEye.count || 0);
  const trialText = trial?.thoughtText || forecast?.advice || "先看价格和头排厚度";
  rows.push({
    key: goodsCount >= 2 ? "compare" : "hesitate",
    badge: goodsCount >= 2 ? "挑" : "缺",
    customerName: forecast?.customerName && forecast.customerName !== primaryCustomer ? forecast.customerName : "旁边路过客",
    itemName: goodsEye.itemName,
    thought: goodsCount >= 2 ? "头排够厚，可以挑一挑" : "货少，怕一问就断档",
    reason: goodsCount >= 2
      ? `会比较${goodsEye.itemName}和同标签货，再决定要不要等开铺。`
      : `只剩 ${goodsCount} 件，先补货或确认价格，再手动开铺更稳。`,
    tone: goodsCount >= 2 ? "focus" : "warn",
    accent: goodsCount >= 2 ? "#b47d2f" : "#be4f37",
    hint: trialText,
  });
  return rows.slice(0, 2);
}

export function shopCustomerPickShadowWorldSpecWorld({
  opening = null,
  goodsEye = null,
  forecast = null,
  trial = null,
  rows = [],
  day = 1,
  width = 960,
  height = 640,
  safetyText = "",
} = {}) {
  if (opening?.opened || !goodsEye?.itemId || !Array.isArray(rows) || !rows.length) return null;
  const warningRow = rows.find((row) => row.tone === "warn") || null;
  const readyRow = rows.find((row) => row.tone === "ready") || rows[0];
  const headline = warningRow
    ? `${readyRow.customerName}会停步，但${warningRow.thought}`
    : `${readyRow.customerName}会先被${goodsEye.itemName}吸引`;
  const routeText = warningRow
    ? "影子停步 -> 看清犹豫 -> 手动调整"
    : "影子进门 -> 头排挑货 -> 手动开铺";
  const selector = trial?.active
    ? "#shopTrialPreview"
    : forecast?.shelf?.active
      ? '[data-shop-board="weather-shelf"]'
      : goodsEye.selector || '[data-shop-board="display-diagnosis"]';
  const fallbackSelector = forecast?.active ? '[data-shop-board="opening"]' : "#shopReport";
  const cardWidth = 318;
  const cardHeight = 122;
  const x = Math.max(322, Math.min(width - cardWidth - 34, 452));
  const y = Math.max(218, Math.min(height - cardHeight - 46, 258));
  return {
    active: true,
    key: `${day}:${goodsEye.itemId}:${goodsEye.count}:${goodsEye.mode}:${rows.map((row) => `${row.key}:${row.customerName}:${row.tone}`).join("|")}`,
    day,
    title: "旧铺挑货影子 · 可点",
    headline,
    itemId: goodsEye.itemId,
    itemName: goodsEye.itemName,
    count: goodsEye.count,
    hotTagLabel: goodsEye.hotTagLabel,
    mode: goodsEye.mode,
    tone: warningRow ? "warn" : goodsEye.tone === "weather" ? "weather" : "ready",
    routeLabel: "下一步看哪",
    routeText,
    selector,
    fallbackSelector,
    rows,
    safeNote: safetyText,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 154, y: 232 },
  };
}

export function shopCustomerPickShadowWorldAtCanvasPointWorld({
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

export function shopCustomerPickShadowWorldFocusLogSpecWorld({
  spec = null,
} = {}) {
  if (!spec?.itemId) return null;
  return {
    title: "点选旧铺挑货影子",
    missingTitle: "点选旧铺挑货影子",
    missingLog: "旧铺挑货影子已经点到，但旧铺试营业/顾客风向面板暂时没有找到；先确认核心试玩分组是否可见。",
    detail: `${spec.itemName} 的开铺前挑货影子已展开：${spec.rows.map((row) => `${row.customerName}${row.badge}${row.thought}`).join("；")}。${spec.safeNote}。`,
  };
}

export function drawShopCustomerPickShadowWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
  drawShopCrowdPerson = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.tone === "warn" ? "#be4f37" : spec.tone === "weather" ? "#4d91a6" : "#286f58";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.6) * 2.2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}5f`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([5, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 12);
  ctx.quadraticCurveTo(rect.x - 28, cardY + rect.height - 18, rect.x + 30, cardY + rect.height - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.tone === "warn" ? "rgba(255, 240, 232, 0.95)" : "rgba(255, 253, 245, 0.95)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 15, 58, 58, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("影", rect.x + 31, cardY + 50);
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.count,
  }, rect.x + 48, cardY + 48, 24, {
    accent,
    missing: false,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.2) * 1,
  });

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 86, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 86, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} x${spec.count} · ${spec.hotTagLabel}`.slice(0, 34), rect.x + 86, cardY + 64);

  const shelfX = rect.x + 24;
  const shelfY = cardY + 87;
  ctx.strokeStyle = `${accent}55`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(shelfX, shelfY);
  ctx.lineTo(rect.x + rect.width - 24, shelfY);
  ctx.stroke();
  spec.rows.forEach((row, index) => {
    const personX = rect.x + 66 + index * 138;
    const personY = shelfY + 2 + (reducedMotion ? 0 : Math.sin(motion * 2.1 + index) * 1.4);
    drawShopCrowdPerson(ctx, personX - 18, personY + 4, {
      coat: row.tone === "warn" ? "#be4f37" : row.tone === "ready" ? "#286f58" : "#b47d2f",
      scarf: index === 0 ? "#f6f0b6" : "#9fd1df",
      scale: 0.56,
    }, motion + index);
    ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
    ctx.beginPath();
    ctx.roundRect(personX - 26, personY - 45, 118, 32, 12);
    ctx.fill();
    ctx.strokeStyle = `${row.accent}44`;
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.fillStyle = row.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(`${row.badge} ${row.customerName}`.slice(0, 9), personX - 16, personY - 32);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(row.thought.slice(0, 12), personX - 16, personY - 19);
  });

  ctx.fillStyle = spec.tone === "warn" ? "rgba(190, 79, 55, 0.12)" : "rgba(202, 235, 210, 0.44)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 18, rect.width - 36, 14, 7);
  ctx.fill();
  ctx.fillStyle = spec.tone === "warn" ? "#be4f37" : "#286f58";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safeNote}`.slice(0, 46), rect.x + 26, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function shopSpiritGreeterActionCopyWorld({
  opening = null,
  goodsEye = null,
  pickShadow = null,
  greeterName = "精怪",
} = {}) {
  if (opening?.opened) {
    return {
      key: "guide_guest",
      badge: "迎",
      title: "引路过客",
      action: `${greeterName}在门口把犹豫客往货签前带一步`,
      detail: "旧铺已开张，动作只解释客流正在被照应。",
      route: "迎客 -> 看想法 -> 手动复盘",
      accent: "#286f58",
    };
  }
  if (pickShadow?.tone === "warn") {
    return {
      key: "point_queue",
      badge: "排",
      title: "指头排",
      action: `${greeterName}指着头排空位，提醒先看犹豫原因`,
      detail: "顾客影子已经停步，先读懂缺口再手动调整。",
      route: "影子停步 -> 看犹豫 -> 手动调整",
      accent: "#be4f37",
    };
  }
  if (goodsEye?.mode === "word" || goodsEye?.mode === "weather") {
    return {
      key: "hand_tag",
      badge: "签",
      title: "递货签",
      action: `${greeterName}捧着${goodsEye.itemName || "今日主推"}货签，往客眼前递`,
      detail: goodsEye.mode === "word" ? "铺前来帖已有话头，先把对口货摆明。" : "天气正在替这件货说话，货签要先亮。",
      route: "来客起意 -> 递货签 -> 手动开铺",
      accent: goodsEye.mode === "weather" ? "#4d91a6" : "#286f58",
    };
  }
  return {
    key: "wipe_sign",
    badge: "擦",
    title: "擦招牌",
    action: `${greeterName}踮脚擦亮旧铺招牌，把今日主推让出来`,
    detail: "开铺前先让陈列更可读，顾客才能知道看哪件。",
    route: "擦招牌 -> 亮头排 -> 手动开铺",
    accent: "#b47d2f",
  };
}

export function shopSpiritGreeterWorldSpecWorld({
  greeters = [],
  opening = null,
  goodsEye = null,
  pickShadow = null,
  forecast = null,
  displayDiagnosis = null,
  liveFocus = null,
  day = 1,
  reportCount = 0,
  width = 960,
  height = 640,
  safetyText = "",
  actionCopy = () => null,
} = {}) {
  if (!Array.isArray(greeters) || !greeters.length) return null;
  const hasShopContext = Boolean(goodsEye?.itemId || pickShadow?.active || forecast?.active || displayDiagnosis?.active || reportCount > 0 || liveFocus);
  if (!hasShopContext) return null;
  const greeter = greeters[0];
  const greeterNames = greeters.slice(0, 2).map((spirit) => spirit.name || "精怪").join("、");
  const greeterText = greeters.length > 2 ? `${greeterNames}等 ${greeters.length} 只` : greeterNames || greeter.name || "精怪";
  const copy = actionCopy({ opening, goodsEye, pickShadow, greeterName: greeter.name || "精怪" });
  const routeSelector = opening?.opened
    ? "#shopReport"
    : pickShadow?.selector || goodsEye?.selector || (forecast?.active ? '[data-shop-board="opening"]' : '[data-shop-board="display-diagnosis"]');
  const fallbackSelector = pickShadow?.fallbackSelector || goodsEye?.selector || "#shopReport";
  const itemText = goodsEye?.itemName
    ? `${goodsEye.itemName} x${goodsEye.count || 0}`
    : liveFocus?.topItemName
      ? `${liveFocus.topItemName} · 今日焦点`
      : displayDiagnosis?.featuredGoods?.[0]?.itemName || "今日旧铺货签";
  const customerText = pickShadow?.rows?.[0]?.customerName || goodsEye?.customerName || forecast?.customerName || liveFocus?.topCustomerName || "路过客";
  const cardWidth = 316;
  const cardHeight = 116;
  const x = Math.max(302, Math.min(width - cardWidth - 32, 344));
  const y = Math.max(346, Math.min(height - cardHeight - 32, 394));
  return {
    active: true,
    key: `${day}:${greeter.id}:${copy?.key || "shop"}:${goodsEye?.itemId || "shop"}:${opening?.opened ? "open" : "prep"}:${greeters.length}:${reportCount}`,
    day,
    title: "旧铺精怪迎客小动作 · 可点",
    headline: `${greeter.name || "精怪"}在旧铺门口${copy?.title || "迎客"}`,
    greeter,
    greeterId: greeter.id,
    greeterName: greeter.name || "精怪",
    greeterText,
    greeterCount: greeters.length,
    actionKey: copy?.key || "shop",
    actionTitle: copy?.title || "迎客",
    actionText: copy?.action || "",
    detail: copy?.detail || "",
    routeText: copy?.route || "",
    itemText,
    customerText,
    opened: Boolean(opening?.opened),
    selector: routeSelector,
    fallbackSelector,
    safety: safetyText,
    accent: copy?.accent || "#b47d2f",
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 168, y: 216 },
    nodes: [
      {
        key: "who",
        badge: "精",
        title: "谁迎客",
        detail: greeterText,
        accent: "#8f5f3f",
      },
      {
        key: "action",
        badge: copy?.badge || "迎",
        title: copy?.title || "迎客",
        detail: (copy?.action || "").replace(`${greeter.name || "精怪"}`, "").slice(0, 10) || copy?.title || "迎客",
        accent: copy?.accent || "#b47d2f",
      },
      {
        key: "route",
        badge: opening?.opened ? "看" : "铺",
        title: "看哪块牌",
        detail: opening?.opened ? "旧铺报告" : pickShadow?.active ? "顾客风向" : "陈列诊断",
        accent: opening?.opened ? "#286f58" : "#b47d2f",
      },
    ],
  };
}

export function shopSpiritGreeterWorldAtCanvasPointWorld({
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

export function shopSpiritGreeterWorldFocusLogSpecWorld({
  spec = null,
} = {}) {
  if (!spec?.greeterId) return null;
  return {
    title: "点选旧铺精怪迎客小动作",
    missingTitle: "点选旧铺精怪迎客小动作",
    missingLog: "旧铺精怪迎客小动作已经点到，但旧铺反馈/顾客风向面板暂时没有找到；先确认核心试玩分组是否可见。",
    detail: `${spec.headline}：${spec.actionText}。看向 ${spec.itemText} / ${spec.customerText}；${spec.safety}。`,
    seasonalLabel: "旧铺精怪迎客小动作",
    seasonalDetail: spec.headline,
    seasonalEffect: `${spec.actionText}。${spec.detail}`,
  };
}

export function drawShopSpiritGreeterWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.accent || "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.8) * 2.2;
  const cardY = rect.y + bob;
  const footPulse = reducedMotion ? 0 : Math.sin(motion * 3.2) * 2.2;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}d8` : `${accent}62`;
  ctx.lineWidth = active ? 3.1 : 1.9;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 10);
  ctx.bezierCurveTo(anchor.x + 40, anchor.y + 82, rect.x - 16, cardY + 92, rect.x + 26, cardY + 76);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 4; i += 1) {
    const t = reducedMotion ? i / 3 : (motion * 0.12 + i * 0.22) % 1;
    const beadX = anchor.x + (rect.x + 28 - anchor.x) * t;
    const beadY = anchor.y + 10 + (cardY + 76 - anchor.y - 10) * t - Math.sin(t * Math.PI) * 18;
    ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.72)" : "rgba(202, 235, 210, 0.68)";
    ctx.beginPath();
    ctx.arc(beadX, beadY, 3.6 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.opened ? "rgba(239, 249, 236, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 58, 16);
  ctx.fill();
  ctx.fillStyle = "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.ellipse(rect.x + 44, cardY + 72, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff6d7";
  ctx.beginPath();
  ctx.arc(rect.x + 42, cardY + 35 + footPulse * 0.25, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.beginPath();
  ctx.roundRect(rect.x + 30, cardY + 47 + footPulse * 0.2, 24, 18, 7);
  ctx.fill();
  ctx.fillStyle = accent;
  if (spec.actionKey === "wipe_sign") {
    ctx.fillRect(rect.x + 52, cardY + 25 + footPulse * 0.2, 18, 5);
    ctx.fillRect(rect.x + 58, cardY + 18 + footPulse * 0.2, 5, 18);
  } else if (spec.actionKey === "point_queue") {
    ctx.fillRect(rect.x + 55, cardY + 45 + footPulse * 0.2, 20, 4);
    ctx.fillRect(rect.x + 70, cardY + 40 + footPulse * 0.2, 4, 10);
  } else {
    ctx.beginPath();
    ctx.roundRect(rect.x + 54, cardY + 42 + footPulse * 0.2, 20, 15, 4);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.75)";
    ctx.fillRect(rect.x + 58, cardY + 47 + footPulse * 0.2, 12, 2);
  }
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.nodes[1]?.badge || "迎", rect.x + 38, cardY + 60);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 19), rect.x + 86, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 86, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.actionTitle} · ${spec.itemText} · ${spec.customerText}`.slice(0, 37), rect.x + 86, cardY + 62);

  const nodeY = cardY + 80;
  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 16 + index * 100;
    ctx.fillStyle = index === 1 ? `${node.accent}18` : "rgba(255, 253, 245, 0.78)";
    ctx.strokeStyle = `${node.accent}52`;
    ctx.lineWidth = active && index === 1 ? 1.8 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 10, 88, 27, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 15, nodeY + 3, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge.slice(0, 1), nodeX + 11, nodeY + 6);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 4), nodeX + 30, nodeY - 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 8), nodeX + 30, nodeY + 12);
  });

  ctx.fillStyle = spec.opened ? "rgba(202, 235, 210, 0.48)" : "rgba(224, 182, 109, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 18, rect.width - 36, 14, 7);
  ctx.fill();
  ctx.fillStyle = spec.opened ? "#286f58" : "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 45), rect.x + 26, cardY + rect.height - 8);

  ctx.restore();
  return true;
}

export function shopRestockRunnerWorldSpecWorld({
  target = null,
  summary = null,
  day = 1,
  width = 960,
  height = 640,
  itemName = (itemId) => itemId,
  shopRestockRouteCandidates = () => [],
  shopRestockTargetIsWaterFresh = () => false,
} = {}) {
  if (!target || target.status !== "active" || !summary) return null;
  const restock = {
    day,
    itemId: target.itemId,
    itemName: target.itemName || summary.itemName,
    desiredCount: target.desiredCount || summary.desiredCount,
    source: target.source || "",
    note: target.note || target.reason || "",
  };
  const routes = shopRestockRouteCandidates(restock);
  const route = routes[0] || null;
  const cardWidth = 314;
  const cardHeight = 126;
  const x = Math.max(392, Math.min(width - cardWidth - 34, 430));
  const y = Math.max(182, Math.min(height - cardHeight - 52, 236));
  const waterFresh = shopRestockTargetIsWaterFresh(target);
  const waterwayReorder = target.source === "lianze_waterway_reorder";
  const daysLeft = Number(target.dueDay || day) - Number(day || 0);
  const routeText = route ? `${route.label}：${route.title}` : summary.routeText || "先准备任意可卖货";
  const runnerAction = summary.ready
    ? "回旧铺交签"
    : route?.action === "recipe"
      ? "去工坊补锅"
      : route?.action === "seed"
        ? "去灵田下种"
        : route?.action === "shop"
          ? "看货签上架"
          : "找可卖货";
  const path = [
    { x: x + 28, y: y + cardHeight - 8 },
    { x: 344, y: 336 },
    { x: 252, y: 300 },
    { x: 178, y: 244 },
    { x: 116, y: 214 },
  ];
  return {
    active: true,
    key: `${day}:${summary.id || target.id || "restock"}:${summary.have}:${summary.ready ? "ready" : "running"}:${route?.action || "shop"}`,
    day,
    title: "主世界旧铺补货跑腿",
    cta: summary.ready ? "补货可完成 · 可点" : "补货跑腿 · 可点",
    itemId: summary.itemId || target.itemId || "",
    itemName: summary.itemName || target.itemName || itemName(target.itemId),
    have: summary.have,
    desiredCount: summary.desiredCount,
    ready: summary.ready,
    overdue: summary.overdue,
    waterFresh,
    waterwayReorder,
    sourceLabel: summary.sourceLabel || (waterwayReorder ? "莲泽水航回订" : waterFresh ? "水鲜补货" : "旧铺补货"),
    statusText: summary.statusText,
    dueDay: summary.dueDay,
    dueText: summary.overdue ? `逾期 ${Math.abs(daysLeft)} 天` : daysLeft <= 0 ? "今天到期" : `还剩 ${daysLeft} 天`,
    route,
    routeText,
    runnerAction,
    nextAction: summary.nextAction || route?.action || "shop",
    recipeId: summary.recipeId || route?.recipeId || "",
    seedId: summary.seedId || route?.seedId || "",
    shopTag: summary.shopTag || route?.shopTag || "",
    note: summary.note || target.note || target.reason || "",
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 154, y: 218 },
    path,
    selector: summary.ready ? "[data-shop-restock-complete]" : '[data-shop-board="restock-tracker"]',
    fallbackSelector: '[data-shop-board="restock-tracker"]',
  };
}

export function shopRestockRunnerWorldAtCanvasPointWorld({
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

export function shopRestockRunnerWorldFocusLogSpecWorld({
  spec = null,
} = {}) {
  if (!spec?.itemId) return null;
  return {
    title: "点选旧铺补货跑腿",
    missingTitle: "点选旧铺补货跑腿",
    missingLog: "旧铺补货跑腿牌已经点到，但补货追踪卡暂时没有找到；先确认核心试玩分组是否可见。",
    detail: spec.ready
      ? `${spec.itemName} 已备到 ${spec.have}/${spec.desiredCount}，已定位旧铺补货完成按钮。点击这里只做定位，不会自动交付或开铺。`
      : `${spec.itemName} 补货进度 ${spec.have}/${spec.desiredCount}，${spec.dueText}；下一步：${spec.routeText}。已定位补货追踪和推荐路线，不会自动制作、播种或消耗库存。`,
  };
}

export function drawShopRestockRunnerWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawShopWeatherShelfGoodIcon = () => {},
  pointOnPolyline = () => ({ x: 0, y: 0 }),
} = {}) {
  if (!ctx || !spec?.rect || !Array.isArray(spec.path)) return false;
  const { rect, path } = spec;
  const accent = spec.waterFresh ? "#4d91a6" : spec.ready ? "#286f58" : spec.overdue ? "#be4f37" : "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 2.2;
  const progress = Math.max(0, Math.min(1, Number(spec.have || 0) / Math.max(1, Number(spec.desiredCount || 1))));
  const runnerPoint = pointOnPolyline(path, reducedMotion ? 0.58 : (motion * 0.16) % 1);
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}cc` : `${accent}66`;
  ctx.lineWidth = active ? 3.2 : 2.2;
  ctx.setLineDash([8, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  path.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y + bob);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
  ctx.beginPath();
  ctx.ellipse(runnerPoint.x, runnerPoint.y + 17, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "rgba(226, 244, 238, 0.96)" : spec.waterFresh ? "rgba(226, 241, 247, 0.96)" : "rgba(255, 246, 215, 0.96)";
  ctx.beginPath();
  ctx.arc(runnerPoint.x, runnerPoint.y + bob, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `${accent}aa`;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(runnerPoint.x - 10, runnerPoint.y + 6 + bob, 20, 11, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(224, 182, 109, 0.94)";
  ctx.beginPath();
  ctx.roundRect(runnerPoint.x + 12, runnerPoint.y + 3 + bob, 17, 13, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.58)";
  ctx.stroke();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.ready ? "交" : "跑", runnerPoint.x - 6, runnerPoint.y + 2 + bob);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.overdue ? "rgba(255, 240, 232, 0.96)" : "rgba(255, 253, 245, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}18`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 17, 62, 62, 16);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.have,
  }, rect.x + 25, cardY + 27, 38, {
    accent,
    missing: !spec.ready && Number(spec.have || 0) <= 0,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.6) * 1.2,
  });
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.ready ? "可交" : "跑腿", rect.x + 30, cardY + 84);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 92, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${spec.itemName} ${spec.have}/${spec.desiredCount}`.slice(0, 18), rect.x + 92, cardY + 47);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${spec.sourceLabel} · ${spec.dueText} · ${spec.runnerAction}`.slice(0, 32), rect.x + 92, cardY + 66);

  ctx.fillStyle = "rgba(23, 35, 29, 0.1)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 92, cardY + 76, rect.width - 112, 9, 5);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "#286f58" : accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 92, cardY + 76, Math.max(10, (rect.width - 112) * progress), 9, 5);
  ctx.fill();

  ctx.fillStyle = spec.ready ? "rgba(202, 235, 210, 0.72)" : spec.overdue ? "rgba(239, 217, 208, 0.72)" : "rgba(255, 246, 215, 0.76)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 96, rect.width - 32, 20, 10);
  ctx.fill();
  ctx.fillStyle = spec.ready ? "#286f58" : spec.overdue ? "#be4f37" : "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.routeText}`.slice(0, 42), rect.x + 28, cardY + 110);

  if (!reducedMotion) {
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.88)" : "rgba(224, 182, 109, 0.55)";
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 50 + i * 8, cardY + 23 + Math.sin(motion * 2 + i) * 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}
