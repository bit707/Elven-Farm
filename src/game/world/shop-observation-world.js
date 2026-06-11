export function shopDailyGoodsEyeReasonCopyWorld({
  mode = "diagnosis",
  itemName: goodsName = "这件货",
  customerName = "路过客",
  hotTagLabel = "应季货",
  sourceLabel = "",
  weatherName = "",
  themeName = "",
  themeScore = 0,
} = {}) {
  if (mode === "word") {
    return {
      headline: "市闻已经把客眼引到这件货上",
      reason: `${sourceLabel || "铺前来帖"}带来${customerName}，他们会先认${goodsName}的${hotTagLabel}味道。`,
      eye: `${customerName}眼里：有话头、有对口货、头排一眼能看见。`,
      route: "市闻来客 -> 头排有货 -> 手动开铺",
      badge: "来帖客眼",
    };
  }
  if (mode === "weather") {
    return {
      headline: "天气正好替这件货说话",
      reason: `${weatherName || "今日天气"}让${hotTagLabel}更容易被问起，${goodsName}可以先挂天气货签。`,
      eye: `${customerName}眼里：天气有需求，货签能解释，价格再看手动调整。`,
      route: "天气起意 -> 货签照亮 -> 手动开铺",
      badge: "天气客眼",
    };
  }
  return {
    headline: "陈列主题能把这件货托出来",
    reason: `${themeName || "当前陈列"}匹配 ${themeScore}%：${goodsName}能先把${hotTagLabel}讲清楚。`,
    eye: `${customerName}眼里：标签顺、货架稳，先知道为什么值得摆出来。`,
    route: "主题顺眼 -> 客眼停步 -> 手动开铺",
    badge: "陈列客眼",
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

export function shopCustomerPickShadowSafetyTextWorld() {
  return "只定位旧铺试营业看板、顾客风向或陈列诊断，不会自动上架、开铺、接客、成交、改价、补货或消耗库存";
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
