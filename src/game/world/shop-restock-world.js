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
