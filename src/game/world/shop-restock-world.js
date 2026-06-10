export function shopRestockTargetIsWaterFreshWorld({
  target = null,
  waterwaySignatureItemIds = [],
} = {}) {
  const itemId = typeof target === "string" ? target : target?.itemId || "";
  return itemId === "item_food_qingbo_yukuai"
    || (Array.isArray(waterwaySignatureItemIds) ? waterwaySignatureItemIds : []).includes(itemId)
    || (typeof target === "object" && target?.source === "lianze_waterway_reorder");
}

export function shopRestockFocusSnapshotWorld({
  target = null,
  day = 1,
  inventory = {},
} = {}) {
  if (!target || target.status !== "active") return null;
  return {
    day,
    itemId: target.itemId,
    itemName: target.itemName,
    note: target.note || `目标 ${Number((inventory || {})[target.itemId] || 0)}/${target.desiredCount}`,
  };
}

export function shopRestockActiveFocusWorld({
  syncedRestock = null,
  cachedRestock = null,
  day = 1,
} = {}) {
  if (syncedRestock) return syncedRestock;
  return cachedRestock?.day === day ? cachedRestock : null;
}

export function shopRestockRouteCandidatesWorld({
  restock = null,
  day = 1,
  inventory = {},
  itemsById = new Map(),
  cropsById = new Map(),
  recipes = [],
  itemName = (itemId) => itemId,
  harvestShopRoute = () => null,
  harvestUseRouteSpec = () => null,
  bestRecipeForOutput = () => null,
  recipeCraftReady = () => false,
  recipeUnlocked = () => false,
  recipeName = () => "",
  recipeMachineHint = () => "",
  recipeInputStatus = () => "",
  recipeUsesItem = () => false,
  availableSeedCrops = () => [],
  seedUseRouteSpec = () => null,
} = {}) {
  if (!restock || restock.day !== day) return [];
  const itemId = restock.itemId || "";
  const safeInventory = inventory || {};
  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const candidates = [];
  if (itemId && Number(safeInventory[itemId] || 0) > 0) {
    const route = harvestShopRoute(itemId, Number(safeInventory[itemId] || 1))
      || harvestUseRouteSpec(itemId, Number(safeInventory[itemId] || 1));
    candidates.push({
      type: "stock",
      label: "已有库存",
      title: `${itemName(itemId)} x${safeInventory[itemId]}`,
      detail: route?.detail || "背包里已有这件旧铺货，可以直接查看货签或准备开铺。",
      action: "shop",
      shopTag: route?.shopTag || "",
      itemId,
      score: 120,
    });
  }
  const outputRecipe = itemId ? bestRecipeForOutput(itemId) : null;
  if (outputRecipe) {
    candidates.push({
      type: "recipe",
      label: recipeCraftReady(outputRecipe) ? "可立即制作" : "工坊补货",
      title: recipeName(outputRecipe),
      detail: `${recipeMachineHint(outputRecipe)} · 原料 ${recipeInputStatus(outputRecipe, 4) || "无需额外原料"}`,
      action: "recipe",
      recipeId: outputRecipe.recipe_id,
      score: recipeCraftReady(outputRecipe) ? 100 : recipeUnlocked(outputRecipe) ? 78 : 42,
    });
  }
  const inputRecipes = itemId
    ? safeRecipes.filter((recipe) => recipeUsesItem(recipe, itemId)).slice(0, 2)
    : [];
  for (const recipe of inputRecipes) {
    candidates.push({
      type: "recipe",
      label: recipeCraftReady(recipe) ? "原料可下锅" : "可做成品",
      title: recipeName(recipe),
      detail: `${itemName(itemId)}可转成 ${itemName(recipe.output_item_id)} · ${recipeInputStatus(recipe, 4) || "原料已齐"}`,
      action: "recipe",
      recipeId: recipe.recipe_id,
      score: recipeCraftReady(recipe) ? 88 : recipeUnlocked(recipe) ? 66 : 36,
    });
  }
  const crop = cropsById.get(itemId);
  if (crop && availableSeedCrops().some((entry) => entry.seed_item_id === crop.seed_item_id)) {
    const route = seedUseRouteSpec(crop);
    candidates.push({
      type: "seed",
      label: "种植补货",
      title: itemName(crop.seed_item_id),
      detail: route?.detail || `${Number(crop.grow_days || 1)} 夜后可收 ${itemName(crop.crop_id)}，适合补旧铺鲜货。`,
      action: "seed",
      seedId: crop.seed_item_id,
      score: 82,
    });
  }
  return candidates
    .filter((entry) => entry.action === "shop" || entry.recipeId || entry.seedId)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function shopRestockRouteMarkupWorld({
  routes = [],
  restock = null,
} = {}) {
  if (!Array.isArray(routes) || !routes.length) return "";
  return `
    <div class="shop-restock-routes">
      <strong>补货路线</strong>
      ${routes.map((route) => `
        <div class="shop-restock-route ${route.type}">
          <b>${route.label} · ${route.title}</b>
          <small>${route.detail}</small>
          <button type="button" data-shop-restock-route="${route.action}" data-shop-restock-recipe="${route.recipeId || ""}" data-shop-restock-seed="${route.seedId || ""}" data-shop-restock-tag="${route.shopTag || ""}" data-shop-restock-item="${route.itemId || restock?.itemId || ""}">${route.action === "recipe" ? "看配方" : route.action === "seed" ? "看种子" : "看旧铺货签"}</button>
        </div>
      `).join("")}
    </div>
  `;
}

export function shopRestockSummarySpecWorld({
  target = null,
  day = 1,
  inventory = {},
  sellableCount = 0,
  shopRestockTargetReady = () => false,
  shopRestockRouteCandidates = () => [],
  shopRestockTargetIsWaterFresh = () => false,
} = {}) {
  if (!target || target.status !== "active") return null;
  const have = target.itemId ? Number((inventory || {})[target.itemId] || 0) : Number(sellableCount || 0);
  const ready = shopRestockTargetReady(target);
  const overdue = day > Number(target.dueDay || day);
  const waterwayReorder = target.source === "lianze_waterway_reorder";
  const routes = shopRestockRouteCandidates({
    day,
    itemId: target.itemId,
    itemName: target.itemName,
    note: target.note,
  });
  return {
    id: target.id,
    itemId: target.itemId,
    itemName: target.itemName,
    desiredCount: target.desiredCount,
    have,
    ready,
    overdue,
    dueDay: target.dueDay,
    sourceLabel: waterwayReorder ? "莲泽水航回订" : shopRestockTargetIsWaterFresh(target) ? "水鲜补货" : "旧铺补货",
    statusText: ready
      ? (waterwayReorder ? "水航回订已备齐，可以回旧铺完成目标" : "已经补够，可以回旧铺完成目标")
      : overdue
        ? (waterwayReorder ? "水航回订逾期，明早优先补这件货" : "已经逾期，明早优先补这件货")
        : (waterwayReorder ? "继续按莲泽回订路线补货" : "继续按路线补货"),
    routeText: routes[0] ? `${routes[0].label}：${routes[0].title}` : "先准备任意可卖货",
    nextAction: routes[0]?.action || "shop",
    recipeId: routes[0]?.recipeId || "",
    seedId: routes[0]?.seedId || "",
    shopTag: routes[0]?.shopTag || "",
    note: target.reason || target.note || "",
  };
}

function inactiveShopRestockFulfillmentWorld() {
  return {
    active: false,
    themeBonus: 0,
    budgetBonus: 0,
    visitorBonus: 0,
  };
}

export function shopRestockFulfillmentEffectWorld({
  opening = null,
  goods = [],
  theme = null,
  inventory = {},
  ecologySummary = null,
  itemName = (itemId) => itemId,
  shopTagLabel = (tag) => tag,
  shopTagsForItem = () => [],
  splitTags = () => [],
  shopTagsOverlap = () => false,
  shopRestockTargetIsWaterFresh = () => false,
} = {}) {
  const safeHistory = Array.isArray(opening?.restockHistory) ? opening.restockHistory : [];
  const safeInventory = inventory || {};
  const recent = safeHistory
    .filter((entry) => entry?.status === "done" && entry.itemId && Number(safeInventory[entry.itemId] || 0) > 0)
    .sort((a, b) => Number(b.completedDay || 0) - Number(a.completedDay || 0))[0];
  if (!recent) return inactiveShopRestockFulfillmentWorld();
  const safeGoods = Array.isArray(goods) ? goods : [];
  if (!safeGoods.some((entry) => entry.itemId === recent.itemId)) return inactiveShopRestockFulfillmentWorld();
  const tags = shopTagsForItem(recent.itemId, ecologySummary);
  const themeTags = splitTags(theme?.required_item_tags || "");
  const themeMatched = (Array.isArray(tags) ? tags : []).some((tag) => shopTagsOverlap([tag], themeTags));
  const count = Number(safeInventory[recent.itemId] || 0);
  const desiredCount = Math.max(1, Number(recent.desiredCount || 1));
  const fulfilledCount = count >= desiredCount;
  const waterFresh = shopRestockTargetIsWaterFresh(recent);
  const waterwayReorder = recent.source === "lianze_waterway_reorder";
  const themeBonus = waterFresh ? (themeMatched ? 0.08 : 0.05) : (themeMatched ? 0.04 : 0.02);
  const budgetBonus = waterFresh ? (fulfilledCount ? 0.10 : 0.06) : (fulfilledCount ? 0.05 : 0.025);
  const visitorBonus = waterFresh ? (fulfilledCount ? (themeMatched ? 2 : 1) : 1) : (themeMatched && fulfilledCount ? 1 : 0);
  const itemLabel = recent.itemName || itemName(recent.itemId);
  return {
    active: true,
    target: recent,
    itemId: recent.itemId,
    itemName: itemLabel,
    count,
    desiredCount,
    tagLabel: waterwayReorder
      ? "莲泽水航 / 熟路货"
      : waterFresh
        ? "灵池水鲜 / 清口"
        : (Array.isArray(tags) ? tags.slice(0, 2).map(shopTagLabel).filter(Boolean).join(" / ") : "") || "旧铺货",
    themeMatched,
    waterFresh,
    themeBonus,
    budgetBonus,
    visitorBonus,
    summary: waterwayReorder
      ? `${itemLabel} 已按莲泽水航回订目标备到 ${count}/${desiredCount}`
      : waterFresh
        ? `${itemLabel} 已按水鲜补货目标备到 ${count}/${desiredCount}`
        : `${itemLabel} 已按补货目标备到 ${count}/${desiredCount}`,
    detail: waterwayReorder
      ? "莲泽回订货不断档，水航客会更愿意把旧铺招牌带回熟路。"
      : waterFresh
        ? "灵池水鲜不断档，认清口、认鲜味的顾客会更愿意在旧铺停下。"
        : themeMatched
          ? `正好贴合 ${theme?.note || "当前陈列"}，顾客会觉得货架更稳。`
          : "虽然不是当前主题核心货，也能说明旧铺有认真备货。",
  };
}

export function shopRestockTrackerSpecWorld({
  target = null,
  day = 1,
  inventory = {},
  sellableCount = 0,
  restock = null,
  shopRestockTargetReady = () => false,
  shopRestockTargetIsWaterFresh = () => false,
  shopRestockRouteMarkup = () => "",
} = {}) {
  if (!target || target.status !== "active") return null;
  const have = target.itemId ? Number((inventory || {})[target.itemId] || 0) : Number(sellableCount || 0);
  const ready = shopRestockTargetReady(target);
  const overdue = day > Number(target.dueDay || day);
  const waterFresh = shopRestockTargetIsWaterFresh(target);
  const waterwayReorder = target.source === "lianze_waterway_reorder";
  return {
    target,
    have,
    ready,
    overdue,
    restock,
    waterFresh,
    waterwayReorder,
    routeMarkup: shopRestockRouteMarkup(restock),
  };
}

export function shopRestockTrackerMarkupWorld({
  target = null,
  have = 0,
  ready = false,
  overdue = false,
  restock = null,
  waterFresh = false,
  waterwayReorder = false,
  routeMarkup = "",
} = {}) {
  if (!target || target.status !== "active") return "";
  return `
    <div class="shop-restock-tracker ${ready ? "ready" : overdue ? "overdue" : "active"} ${waterFresh ? "water-fresh" : ""}" data-shop-board="restock-tracker">
      <strong>${ready ? "补货目标已达成" : overdue ? "补货目标逾期" : waterwayReorder ? "莲泽水航回订追踪" : waterFresh ? "灵池水鲜补货追踪" : "旧铺补货追踪"} · ${target.itemName}</strong>
      <span>目标 ${have}/${target.desiredCount} · 第 ${target.createdDay} 天立项 · 期限第 ${target.dueDay} 天</span>
      <small>${target.reason || "根据顾客复盘建立的补货目标"} · ${target.note || "按路线卡继续准备"}</small>
      ${routeMarkup}
      <div class="shop-restock-tracker-actions">
        <button type="button" data-shop-restock-complete="true" ${ready ? "" : "disabled"}>${ready ? "完成补货" : "尚未补够"}</button>
        <button type="button" data-shop-restock-cancel="true">取消追踪</button>
      </div>
    </div>
  `;
}

export function shopRestockFulfillmentFeedbackSpecWorld({
  restockFulfillment = {},
  shopRestockTargetIsWaterFresh = () => false,
  itemName = (itemId) => itemId,
  createdAt = 0,
  day = 1,
} = {}) {
  if (!restockFulfillment?.active) return null;
  const itemId = restockFulfillment.itemId || restockFulfillment.target?.itemId || "";
  const waterwayReorder = restockFulfillment.target?.source === "lianze_waterway_reorder";
  const waterFresh = Boolean(restockFulfillment.waterFresh) || shopRestockTargetIsWaterFresh(restockFulfillment.target || itemId);
  const themeBonus = Math.round(Number(restockFulfillment.themeBonus || 0) * 100);
  const budgetBonus = Math.round(Number(restockFulfillment.budgetBonus || 0) * 100);
  const visitorBonus = Number(restockFulfillment.visitorBonus || 0);
  return {
    itemId,
    waterFresh,
    itemName: restockFulfillment.itemName || itemName(itemId) || "旧铺货",
    count: Number(restockFulfillment.count || 0),
    desiredCount: Math.max(1, Number(restockFulfillment.desiredCount || 1)),
    tagLabel: restockFulfillment.tagLabel || "旧铺货",
    themeMatched: Boolean(restockFulfillment.themeMatched),
    themeBonus,
    budgetBonus,
    visitorBonus,
    headline: waterwayReorder
      ? "莲泽回订补货兑现"
      : waterFresh
        ? "灵池水鲜补货兑现"
        : restockFulfillment.themeMatched
          ? "补货正好压住主题"
          : "补货兑现，货架稳了",
    summary: restockFulfillment.summary || "旧铺补货目标已经兑现。",
    detail: restockFulfillment.detail || "顾客能看出掌柜有认真备货。",
    chips: [
      ...(waterwayReorder ? [{ label: "水航回订", value: "稳住", tone: "good" }] : waterFresh ? [{ label: "水鲜招牌", value: "成线", tone: "good" }] : []),
      { label: "主题映照", value: `+${themeBonus}%`, tone: restockFulfillment.themeMatched || waterFresh ? "good" : "mid" },
      { label: "顾客预算", value: `+${budgetBonus}%`, tone: "good" },
      ...(visitorBonus > 0 ? [{ label: "来客", value: `+${visitorBonus}`, tone: "good" }] : []),
    ],
    createdAt,
    day,
  };
}

export function shopRestockFulfillmentReportEntryWorld({
  restockFulfillment = {},
  shopRestockTargetIsWaterFresh = () => false,
} = {}) {
  if (!restockFulfillment?.active) return null;
  const waterwayReorderRestockDone = restockFulfillment.target?.source === "lianze_waterway_reorder";
  const waterFreshRestock = Boolean(restockFulfillment.waterFresh)
    || shopRestockTargetIsWaterFresh(restockFulfillment.target || restockFulfillment.itemId || "");
  return {
    name: waterwayReorderRestockDone ? "莲泽回订补货兑现" : waterFreshRestock ? "水鲜补货兑现" : "补货兑现",
    text: waterwayReorderRestockDone
      ? `${restockFulfillment.itemName} 回订补货上架，水航客会把“这家旧铺不断档”的话带回莲泽。`
      : waterFreshRestock
        ? `${restockFulfillment.itemName} 补货上架，灵池水鲜不断档，旧铺门口更容易聚起认鲜味的人。`
        : `${restockFulfillment.itemName} 补货上架，货架稳定感更强。`,
    reason: "restock",
    detail: `${restockFulfillment.summary} · ${restockFulfillment.detail} · 主题映照 +${Math.round(Number(restockFulfillment.themeBonus || 0) * 100)}%，顾客预算 +${Math.round(Number(restockFulfillment.budgetBonus || 0) * 100)}%${Number(restockFulfillment.visitorBonus || 0) > 0 ? ` · 来客 +${Number(restockFulfillment.visitorBonus || 0)}` : ""}`,
  };
}

export function shopCustomerFocusRestockMarkupWorld({
  restock = null,
  routeMarkup = "",
} = {}) {
  if (!restock) return "";
  return `
      <small class="shop-customer-restock-mark">已标记补货：${restock.itemName} · ${restock.note}</small>
      ${routeMarkup}
  `;
}
