export function shopSaleFeedbackSpecWorld({
  sale = null,
  openingFeedback = {},
  state = null,
  shopTagsForItem = () => [],
  ecologyCourtyardSummary = () => null,
  prioritizeShopTag = () => "food",
  shopCustomerShortReview = () => "",
  shopReturnVisitPreviewSpec = () => null,
  shopTagLabel = (tag) => tag,
  itemName = (itemId) => itemId,
  now = 0,
} = {}) {
  if (!sale) return null;
  const price = Number((sale.text.match(/成交 (\d+)/) || [0, 0])[1]);
  const itemTags = shopTagsForItem(sale.itemId || "", ecologyCourtyardSummary());
  const itemTag = prioritizeShopTag(itemTags, new Map(), "food");
  const returningCustomer = Boolean(sale.returningCustomer);
  const wordOfMouthLead = Boolean(sale.wordOfMouthLead);
  const introducedCustomer = Boolean(sale.introducedCustomer);
  const qingboFirstSale = sale.itemId === "item_food_qingbo_yukuai" && !state.completed.has("first_qingbo_yukuai_sold");
  const shortReason = String(sale.detail || "")
    .split("→")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(-1)[0] || "顾客觉得商品和价格都合适。";
  const reviewQuote = qingboFirstSale
    ? shopCustomerShortReview(sale, openingFeedback.hotTag, openingFeedback.liveFocus)
    : openingFeedback.reviewQuote || shopCustomerShortReview(sale, openingFeedback.hotTag, openingFeedback.liveFocus);
  const returnPreview = qingboFirstSale ? shopReturnVisitPreviewSpec(sale, openingFeedback, {
    themeScore: openingFeedback.liveFocus?.themeScore || 0,
    hotTag: openingFeedback.hotTag,
  }) : openingFeedback.returnPreview || shopReturnVisitPreviewSpec(sale, openingFeedback, {
    themeScore: openingFeedback.liveFocus?.themeScore || 0,
    hotTag: openingFeedback.hotTag,
  });
  const needBubble = (openingFeedback.needBubbles || []).find((entry) => (
    (sale.customerArchetype && entry.customerArchetype === sale.customerArchetype)
    || (sale.name && entry.name === sale.name)
  )) || (openingFeedback.needBubbles || [])[0] || null;
  const needBubbleText = needBubble?.text || `想找${openingFeedback.hotTagLabel || shopTagLabel(itemTag)}`;
  const needBubbleDetail = needBubble?.detail || `${sale.name || "顾客"}先看懂了货架上的${shopTagLabel(itemTag)}标签。`;
  const returnPathSteps = returnPreview
    ? [
      { label: "想买什么", text: needBubbleText, tone: "need" },
      { label: "为什么买", text: shortReason, tone: "reason" },
      { label: "会不会回来", text: `${returnPreview.chance || 0}% · ${returnPreview.summary || returnPreview.headline}`, tone: returnPreview.tone || "note" },
    ]
    : [];
  const returnPathTitle = returnPreview
    ? returningCustomer
      ? "熟客回门证据"
      : openingFeedback.firstSale
        ? "首单回头路径"
        : "回头客苗头"
    : "";
  const restockHint = returnPreview?.cta
    || (openingFeedback.hotTagLabel ? `明天继续补 ${openingFeedback.hotTagLabel} 相关货。` : "明天按这条购买理由补货。");
  return {
    customerName: sale.name || "顾客",
    customerArchetype: sale.customerArchetype || "",
    itemId: sale.itemId || "",
    itemName: itemName(sale.itemId || ""),
    itemTag,
    itemTagLabel: shopTagLabel(itemTag),
    price,
    firstSale: Boolean(openingFeedback.firstSale),
    returningCustomer,
    wordOfMouthLead,
    wordOfMouthLeadText: sale.wordOfMouthLeadText || "",
    introducedCustomer,
    introducedByLabel: sale.introducedByLabel || "",
    introducedVisitText: sale.introducedVisitText || "",
    returnVisitText: sale.returnVisitText || "",
    hotTagLabel: openingFeedback.hotTagLabel || "",
    qingboFirstSale,
    headline: qingboFirstSale ? "灵池水鲜第一次卖出去了" : openingFeedback.firstSale ? "第一位顾客买单了" : returningCustomer ? "熟脸回门又买了一件" : introducedCustomer ? "熟客带来的新客买单了" : wordOfMouthLead ? "铺前来帖真的落到门前了" : "旧铺又成交了一单",
    detail: `${sale.name || "顾客"} 买走 ${itemName(sale.itemId || "")}，成交 ${price} 灵石。`,
    needBubbleText,
    needBubbleDetail,
    reasonText: shortReason,
    reviewQuote,
    returnPreview,
    returnPathTitle,
    returnPathSteps,
    restockHint,
    decisionPath: [
      `想法泡泡：${needBubbleText}`,
      `购买理由：${shortReason}`,
      reviewQuote ? `顾客短评：${reviewQuote}` : "",
    ].filter(Boolean),
    exchangeLabel: qingboFirstSale ? "水鲜递出 · 灵石入账" : `${shopTagLabel(itemTag)}递出 · 灵石入账`,
    exchangeTrail: price >= 80 ? "big" : price >= 32 ? "mid" : "small",
    cta: qingboFirstSale
      ? "灵池水鲜首卖已写进账页，继续备鱼、露珠芹和净水，把这条招牌线做厚。"
      : openingFeedback.firstSale
      ? `旧铺日结已解锁，${returnPreview?.cta || "继续沿着这个理由补货"}`
      : introducedCustomer
        ? `把${sale.introducedByLabel || "熟客"}带来的那股新脚步继续留在门前`
        : wordOfMouthLead
          ? "把这张来帖点名的那件货继续留在头排，让下一波传话接得更顺"
      : "沿着这条购买理由继续陈列同类商品",
    createdAt: now,
    day: state.day,
  };
}

export function shopSaleReflectionSpecWorld({
  opening = null,
  normalizeShopOpeningState = (value) => value,
  shopCustomerShortReview = () => "",
  shopReturnVisitPreviewSpec = () => null,
} = {}) {
  const safeOpening = normalizeShopOpeningState(opening);
  const session = safeOpening.lastSession || null;
  const firstSale = safeOpening.firstSale || null;
  const reviewQuote = firstSale?.reviewQuote
    || session?.reviewQuote
    || (firstSale
      ? shopCustomerShortReview({
        itemId: firstSale.itemId,
        customerArchetype: firstSale.customerArchetype,
        name: firstSale.name,
      }, session?.hotTag || "", session?.liveFocus || null)
      : "");
  const returnPreview = firstSale?.returnPreview
    || session?.returnPreview
    || (firstSale
      ? shopReturnVisitPreviewSpec({
        itemId: firstSale.itemId,
        customerArchetype: firstSale.customerArchetype,
        name: firstSale.name,
      }, {
        firstSale: Boolean(firstSale),
        hotTag: session?.hotTag || "",
        hotTagLabel: safeOpening.hotTagLabel || session?.hotTagLabel || "",
        liveFocus: session?.liveFocus || null,
      }, {
        themeScore: session?.themeScore || 0,
        hotTag: session?.hotTag || "",
      })
      : null);
  if (!(safeOpening.summaryUnlocked || session || reviewQuote || returnPreview)) return null;
  const headline = safeOpening.summaryUnlocked ? "首单小日结" : "试营业手记";
  const digest = firstSale
    ? `${firstSale.name} 买走 ${firstSale.itemName}，成交 ${firstSale.price} 灵石；原因：${firstSale.reasonText || "商品和价格刚好对上。"}`
    : session
      ? `今日旧铺来客 ${session.visitors || 0} 位，成交 ${session.buyers || 0} 单，热卖方向是 ${safeOpening.hotTagLabel || session.hotTagLabel || "等待陈列"}。`
      : "";
  const scoreLine = session
    ? `来客 ${session.visitors || 0} · 成交 ${session.buyers || 0} · 收入 ${session.sales || 0} 灵石 · 主题 ${session.themeScore || 0}%`
    : "";
  return {
    active: Boolean(digest || reviewQuote || returnPreview),
    headline,
    digest,
    scoreLine,
    reviewQuote,
    returnPreview,
  };
}

export function shopSaleReflectionMarkupWorld(spec = null) {
  if (!spec?.active) return "";
  return `
    <div class="shop-sale-reflection">
      <strong>${spec.headline}</strong>
      ${spec.digest ? `<span>${spec.digest}</span>` : ""}
      ${spec.scoreLine ? `<small>${spec.scoreLine}</small>` : ""}
      ${spec.reviewQuote ? `<div class="shop-sale-quote"><b>顾客短评</b><span>${spec.reviewQuote}</span></div>` : ""}
      ${spec.returnPreview ? `<div class="shop-return-preview ${spec.returnPreview.tone}"><b>${spec.returnPreview.headline}</b><span>${spec.returnPreview.detail}</span><small>回头客预告：${spec.returnPreview.summary} · ${spec.returnPreview.cta}</small></div>` : ""}
    </div>
  `;
}

export function shopActionFeedbackSpecWorld({
  actionId = "",
  options = {},
  theme = null,
  itemName = (itemId) => itemId,
  state = null,
  now = 0,
} = {}) {
  const actionProfiles = {
    price_down: {
      kind: "price",
      title: "价签已调",
      verb: "降价留客",
      accent: "#be4f37",
      soft: "rgba(255, 240, 232, 0.94)",
      icon: "价",
    },
    price_adjust: {
      kind: "price",
      title: "价签已调",
      verb: "利润试探",
      accent: "#b47d2f",
      soft: "rgba(255, 248, 232, 0.94)",
      icon: "价",
    },
    theme_fit: {
      kind: "theme",
      title: "货架换题",
      verb: "陈列翻新",
      accent: "#286f58",
      soft: "rgba(237, 248, 243, 0.94)",
      icon: "架",
    },
    stock_mark: {
      kind: "stock",
      title: "补货已挂牌",
      verb: "明早追货",
      accent: "#b47d2f",
      soft: "rgba(255, 248, 232, 0.94)",
      icon: "补",
    },
  };
  const profile = actionProfiles[actionId] || {
    kind: "note",
    title: "旧铺动作",
    verb: "经营调整",
    accent: "#8f5f3f",
    soft: "rgba(255, 248, 232, 0.94)",
    icon: "铺",
  };
  const priceText = Number.isFinite(options.beforePrice) && Number.isFinite(options.afterPrice)
    ? `${Math.round(options.beforePrice * 100)}% -> ${Math.round(options.afterPrice * 100)}%`
    : `${Math.round(state.shopPriceMultiplier * 100)}%`;
  const themeText = theme?.note || options.themeName || state.shopShelfTheme || "旧铺主题";
  const itemText = options.itemName || (options.itemId ? itemName(options.itemId) : "") || "旧铺货";
  const detailMap = {
    price_down: `价签 ${priceText}，先把犹豫客留下。`,
    price_adjust: `价签 ${priceText}，试探今日利润空间。`,
    theme_fit: `${themeText} 已翻到头排，顾客会先看见这组标签。`,
    stock_mark: `${itemText} 已挂补货牌，路线会跟到追货卡。`,
  };
  return {
    actionId,
    kind: profile.kind,
    title: profile.title,
    verb: profile.verb,
    accent: profile.accent,
    soft: profile.soft,
    icon: profile.icon,
    detail: options.detail || detailMap[actionId] || "旧铺经营动作已执行。",
    itemName: itemText,
    themeName: themeText,
    priceText,
    source: options.source || "",
    weatherName: options.weatherName || "",
    weatherShelfLabel: options.weatherShelfLabel || "",
    createdAt: now,
    day: state.day,
  };
}

export function activeShopSaleFeedbackWorld({
  feedback = null,
  now = 0,
} = {}) {
  if (!feedback) return null;
  const age = now - Number(feedback.createdAt || 0);
  if (age > 5600) return null;
  return { ...feedback, age, fade: age < 4400 ? 1 : Math.max(0, 1 - (age - 4400) / 1200) };
}

export function activeShopActionFeedbackWorld({
  feedback = null,
  now = 0,
} = {}) {
  if (!feedback) return null;
  const age = now - Number(feedback.createdAt || 0);
  if (age > 3600) return null;
  return { ...feedback, age, fade: age < 2800 ? 1 : Math.max(0, 1 - (age - 2800) / 800) };
}

export function shopSaleExchangePaletteWorld({
  feedback = {},
  ecologyShopAuraVisitorColor = () => "#b47d2f",
} = {}) {
  const itemColors = {
    medicine: "#4d91a6",
    herb: "#286f58",
    clean_food: "#9fd1df",
    refreshing: "#7ac3d5",
    water_food: "#4d91a6",
    dessert: "#d87f8d",
    gift: "#d87f8d",
    premium: "#b47d2f",
    material: "#8f5f3f",
    route_rare: "#8c7ab8",
    spirit_crafted: "#dea952",
    ecology_product: "#286f58",
  };
  return {
    item: itemColors[feedback.itemTag] || "#b47d2f",
    customer: ecologyShopAuraVisitorColor(feedback.customerArchetype || ""),
    gold: feedback.exchangeTrail === "big" ? "#f6f0b6" : "#dea952",
    soft: feedback.firstSale ? "rgba(246, 240, 182, 0.32)" : "rgba(224, 182, 109, 0.22)",
  };
}

export function drawShopSaleExchangeAnimationWorld({
  ctx,
  x = 0,
  y = 0,
  feedback = {},
  progress = 0,
  reducedMotion = false,
  ecologyShopAuraVisitorColor = () => "#b47d2f",
} = {}) {
  if (!ctx) return false;
  const palette = shopSaleExchangePaletteWorld({ feedback, ecologyShopAuraVisitorColor });
  const p = Math.max(0, Math.min(1, progress));
  const eased = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
  const counterX = x + 20;
  const counterY = y + 88;
  const customerX = x + 252;
  const handoffX = counterX + (customerX - counterX) * eased;
  const goldX = customerX + (counterX + 52 - customerX) * eased;
  const bob = reducedMotion ? 0 : Math.sin(p * Math.PI * 2) * 4;

  ctx.save();
  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.ellipse(x + 156, y + 76, 146, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(143, 95, 63, 0.82)";
  ctx.beginPath();
  ctx.roundRect(counterX - 8, counterY - 16, 128, 28, 10);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 248, 232, 0.86)";
  ctx.beginPath();
  ctx.roundRect(counterX + 8, counterY - 28, 92, 24, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText("旧铺柜台", counterX + 28, counterY - 12);

  ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
  ctx.beginPath();
  ctx.ellipse(customerX + 16, counterY + 9, 24, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.customer;
  ctx.beginPath();
  ctx.roundRect(customerX, counterY - 36 + bob, 34, 42, 12);
  ctx.fill();
  ctx.fillStyle = "#fff0d4";
  ctx.beginPath();
  ctx.arc(customerX + 17, counterY - 44 + bob, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.item;
  ctx.beginPath();
  ctx.roundRect(handoffX, counterY - 58 - bob, 34, 28, 8);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.fillRect(handoffX + 8, counterY - 48 - bob, 18, 3);
  ctx.fillRect(handoffX + 8, counterY - 40 - bob, 14, 3);

  for (let i = 0; i < 4; i += 1) {
    const coinX = goldX + i * 9;
    const coinY = counterY - 4 - Math.sin(p * Math.PI + i) * 8;
    ctx.fillStyle = palette.gold;
    ctx.beginPath();
    ctx.arc(coinX, coinY, feedback.exchangeTrail === "big" ? 4.5 : 3.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(143, 95, 63, 0.45)";
    ctx.fillRect(coinX - 2, coinY - 1, 4, 1.5);
  }

  ctx.strokeStyle = "rgba(224, 182, 109, 0.46)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -p * 24;
  ctx.beginPath();
  ctx.moveTo(counterX + 76, counterY - 48);
  ctx.quadraticCurveTo(x + 160, counterY - 86, customerX + 10, counterY - 48);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.beginPath();
  ctx.roundRect(x + 106, y + 12, 126, 25, 10);
  ctx.fill();
  ctx.fillStyle = palette.item;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText((feedback.exchangeLabel || "递货收钱").slice(0, 12), x + 118, y + 29);
  ctx.restore();
  return true;
}

export function drawShopSaleFeedbackWorld({
  ctx,
  feedback = null,
  reducedMotion = false,
  now = 0,
  activeCutscene = null,
  activeDialogueCount = 0,
  drawCanvasCard = () => {},
  customerImage = null,
  drawShopSaleExchangeAnimation = () => {},
} = {}) {
  if (!ctx || !feedback || activeCutscene || activeDialogueCount > 0) return false;
  const pulse = reducedMotion ? 0 : Math.sin(now / 280) * 4;
  const x = 46;
  const y = 214 + pulse;
  const decisionPath = Array.isArray(feedback.decisionPath) ? feedback.decisionPath.slice(0, 3) : [];
  const returnPathSteps = Array.isArray(feedback.returnPathSteps) ? feedback.returnPathSteps.slice(0, 3) : [];
  const cardHeight = feedback.returnPreview ? (feedback.firstSale ? 276 : 248) : feedback.firstSale || decisionPath.length >= 3 ? 226 : 192;
  const exchangeProgress = reducedMotion ? 1 : Math.min(1, Math.max(0, feedback.age || 0) / 1350);
  const previewText = feedback.returnPreview
    ? `回头客 ${feedback.returnPreview.chance}% · ${feedback.returnPreview.cta}`
    : feedback.hotTagLabel
      ? `热卖预告 ${feedback.hotTagLabel} · ${feedback.cta}`
      : feedback.cta;
  ctx.save();
  ctx.globalAlpha = feedback.fade;
  drawCanvasCard(ctx, x, y, 396, cardHeight, "rgba(255, 248, 232, 0.95)");
  ctx.fillStyle = "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.arc(x + 356, y + 28, 42, 0, Math.PI * 2);
  ctx.fill();

  if (customerImage) {
    ctx.drawImage(customerImage, x + 18, y + 22, 64, 64);
  } else {
    ctx.fillStyle = "#b47d2f";
    ctx.beginPath();
    ctx.roundRect(x + 28, y + 34, 44, 42, 16);
    ctx.fill();
    ctx.fillStyle = "#fff0d4";
    ctx.beginPath();
    ctx.arc(x + 51, y + 28, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#b47d2f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(feedback.qingboFirstSale ? "水鲜首卖" : feedback.firstSale ? "旧铺首单" : "旧铺成交", x + 96, y + 26);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 18px Microsoft YaHei";
  ctx.fillText(feedback.headline.slice(0, 18), x + 96, y + 52);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 14px Microsoft YaHei";
  ctx.fillText(`${feedback.customerName} · ${feedback.itemName} · ${feedback.price} 灵石`.slice(0, 27), x + 96, y + 76);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  if (feedback.needBubbleText) {
    ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
    ctx.strokeStyle = "rgba(224, 182, 109, 0.42)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(x + 94, y + 86, 258, 25, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(`想法泡泡：${feedback.needBubbleText}`.slice(0, 30), x + 108, y + 103);
  } else {
    ctx.fillText(feedback.reasonText.slice(0, 32), x + 96, y + 96);
  }
  const pathY = feedback.needBubbleText ? y + 126 : y + 116;
  if (decisionPath.length) {
    ctx.fillStyle = "#5d6f65";
    ctx.font = "11px Microsoft YaHei";
    decisionPath.slice(1).forEach((line, index) => {
      ctx.fillText(line.slice(0, 42), x + 96, pathY + index * 17);
    });
  }
  const visitLineActive = (feedback.returningCustomer && feedback.returnVisitText) || (feedback.introducedCustomer && feedback.introducedVisitText);
  if (feedback.returningCustomer && feedback.returnVisitText) {
    ctx.fillStyle = "#286f58";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText(`熟脸回门：${feedback.returnVisitText}`.slice(0, 34), x + 96, pathY + decisionPath.length * 12);
  } else if (feedback.introducedCustomer && feedback.introducedVisitText) {
    ctx.fillStyle = "#b47d2f";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText(`熟客带新客：${feedback.introducedVisitText}`.slice(0, 34), x + 96, pathY + decisionPath.length * 12);
  } else if (feedback.reviewQuote && !decisionPath.some((line) => line.includes("顾客短评"))) {
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText(`顾客短评：${feedback.reviewQuote}`.slice(0, 34), x + 96, visitLineActive ? y + 136 : pathY + 17);
  }
  drawShopSaleExchangeAnimation(ctx, x + 34, y + 68, feedback, exchangeProgress);
  if (returnPathSteps.length) {
    const routeY = y + cardHeight - 82;
    ctx.fillStyle = feedback.returnPreview?.tone === "good" ? "rgba(40, 111, 88, 0.12)" : feedback.returnPreview?.tone === "mid" ? "rgba(224, 182, 109, 0.16)" : "rgba(255, 253, 245, 0.68)";
    ctx.strokeStyle = feedback.returnPreview?.tone === "good" ? "rgba(40, 111, 88, 0.32)" : "rgba(224, 182, 109, 0.38)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(x + 18, routeY, 360, 50, 16);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = feedback.returnPreview?.tone === "good" ? "#286f58" : "#b47d2f";
    ctx.font = "800 11px Microsoft YaHei";
    ctx.fillText((feedback.returnPathTitle || "回头客苗头").slice(0, 13), x + 30, routeY + 17);
    returnPathSteps.forEach((step, index) => {
      const nodeX = x + 32 + index * 114;
      const nodeY = routeY + 25;
      const nodeColor = step.tone === "need" ? "#4d91a6" : step.tone === "reason" ? "#8f5f3f" : feedback.returnPreview?.tone === "good" ? "#286f58" : "#b47d2f";
      if (index > 0) {
        ctx.strokeStyle = "rgba(143, 95, 63, 0.26)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(nodeX - 30, nodeY + 10);
        ctx.lineTo(nodeX - 6, nodeY + 10);
        ctx.stroke();
      }
      ctx.fillStyle = `${nodeColor}22`;
      ctx.beginPath();
      ctx.roundRect(nodeX, nodeY, 88, 18, 9);
      ctx.fill();
      ctx.fillStyle = nodeColor;
      ctx.font = "800 9px Microsoft YaHei";
      ctx.fillText(`${step.label}：${String(step.text || "").slice(0, 6)}`, nodeX + 7, nodeY + 12);
    });
  }
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(previewText.slice(0, 46), x + 24, y + cardHeight - 18);
  ctx.restore();
  return true;
}

export function drawShopActionFeedbackWorld({
  ctx,
  feedback = null,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !feedback) return false;
  const age = Number(feedback.age || 0);
  const p = reducedMotion ? 1 : Math.min(1, age / 900);
  const ease = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
  const bob = reducedMotion ? 0 : Math.sin(motion * 5) * 2;
  const x = 58;
  const y = 176 - ease * 10 + bob;
  const accent = feedback.accent || "#b47d2f";

  ctx.save();
  ctx.globalAlpha = feedback.fade;
  ctx.fillStyle = feedback.soft || "rgba(255, 248, 232, 0.94)";
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y, 188, 82, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(x + 12, y + 14, 34, 34, 12);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "700 16px Microsoft YaHei";
  ctx.fillText(feedback.icon || "铺", x + 21, y + 37);

  if (feedback.kind === "price") {
    const tagX = x + 120 + ease * 12;
    ctx.strokeStyle = "rgba(143, 95, 63, 0.5)";
    ctx.beginPath();
    ctx.moveTo(tagX + 14, y + 6);
    ctx.lineTo(tagX + 14, y + 28);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
    ctx.beginPath();
    ctx.roundRect(tagX, y + 24, 42, 24, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(190, 79, 55, 0.45)";
    ctx.stroke();
    ctx.fillStyle = "#be4f37";
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText("留客价", tagX + 6, y + 40);
  } else if (feedback.kind === "theme") {
    for (let i = 0; i < 3; i += 1) {
      const flagX = x + 122 + i * 16;
      const flip = reducedMotion ? 1 : Math.abs(Math.sin(ease * Math.PI + i * 0.4));
      ctx.fillStyle = i % 2 ? "#fffdf5" : accent;
      ctx.beginPath();
      ctx.moveTo(flagX, y + 14);
      ctx.lineTo(flagX + 12 * flip, y + 19);
      ctx.lineTo(flagX, y + 28);
      ctx.closePath();
      ctx.fill();
    }
  } else if (feedback.kind === "stock") {
    const crateX = x + 124;
    ctx.fillStyle = "#8f5f3f";
    ctx.beginPath();
    ctx.roundRect(crateX, y + 28 - ease * 6, 42, 24, 7);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 248, 232, 0.95)";
    ctx.beginPath();
    ctx.roundRect(crateX + 10, y + 12, 24, 26, 5);
    ctx.fill();
    ctx.strokeStyle = "rgba(180, 125, 47, 0.62)";
    ctx.stroke();
    ctx.fillStyle = "#b47d2f";
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText("补", crateX + 17, y + 29);
  }

  if (!reducedMotion) {
    for (let i = 0; i < 5; i += 1) {
      const mote = (age / 700 + i * 0.21) % 1;
      ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.76)" : "rgba(202, 235, 210, 0.7)";
      ctx.beginPath();
      ctx.arc(x + 54 + i * 22, y + 54 - mote * 22, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "#17231d";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(feedback.title, x + 56, y + 24);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(feedback.verb, x + 56, y + 42);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 24), x + 12, y + 72);
  ctx.restore();
  return true;
}
