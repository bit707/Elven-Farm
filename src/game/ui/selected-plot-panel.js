function selectedPlotDetailSpecInternal({
  state,
  data,
  selectedPlot,
  plotClearedVeinMemory,
  plotFirstSeedMemory,
  plotSpiritSproutMemory,
  localize,
  currentTermConfig,
  currentTermId,
  seedSolarRecommendation,
  seedUseRouteSpec,
  baizhiQuestGuidanceSpec,
  itemName,
  cropSolarAffinity,
  cropSolarYieldBonus,
  growingCropUseRouteSpec,
  visibleOrders,
  orderNeedStatus,
  recipeCraftReady,
  recipeInputStatus,
  recipeName,
  shopTagLabel,
  baizhiCropId,
  baizhiSeedId,
}) {
  const plot = selectedPlot();
  if (!plot) {
    return {
      state: "missing",
      title: "未选中灵田",
      subtitle: "点击主画布上的灵田格，查看播种与节气建议。",
      lines: [],
      action: "选择地块",
      actionId: "",
    };
  }
  const typeText = plot.waterSoil ? "水润灵田" : plot.newlyExpanded ? "新开灵田" : "普通灵田";
  const veinMemory = plotClearedVeinMemory(plot);
  const firstSeedMemory = plotFirstSeedMemory(plot);
  const sproutMemory = plotSpiritSproutMemory(plot);
  const clearedClass = veinMemory ? " cleared" : "";
  const firstSeedClass = firstSeedMemory ? " first-seed" : "";
  const sproutClass = sproutMemory ? " sprout" : "";
  const spiritBornClass = sproutMemory?.joined ? " spirit-born" : "";
  if (plot.debris) {
    return {
      state: "blocked",
      title: `灵田 (${plot.x + 1}, ${plot.y + 1}) · ${typeText}`,
      subtitle: plot.debris === "stone" ? "碎石压着灵脉，先清理再播种。" : "荒草缠住田垄，先清理再播种。",
      lines: ["下一步：清理", `体力消耗 4 · 当前节气 ${localize(currentTermConfig()?.term_name_key, currentTermId())}`],
      action: "清理",
      actionId: "clear",
    };
  }
  if (!plot.cropId) {
    const crop = data.cropsBySeed.get(state.selectedSeedId);
    const recommendation = seedSolarRecommendation(crop, plot);
    const seedRoute = seedUseRouteSpec(crop, plot);
    const baizhiGuidance = baizhiQuestGuidanceSpec();
    const baseLine = `库存 ${state.inventory[state.selectedSeedId] || 0} · 播种体力 6`;
    const seedRouteLine = seedRoute ? `预计产出：${seedRoute.previewText}` : "";
    return {
      state: `${recommendation.className || "empty"}${baizhiGuidance ? " quest" : ""}${clearedClass}${firstSeedClass}${sproutClass}${spiritBornClass}`,
      title: `灵田 (${plot.x + 1}, ${plot.y + 1}) · ${typeText}`,
      subtitle: `空田 · 准备播种 ${itemName(state.selectedSeedId)} · ${recommendation.text}`,
      lines: baizhiGuidance
        ? [baizhiGuidance.plot, `${baizhiGuidance.progress} · ${baseLine}`, seedRouteLine].filter(Boolean)
        : [recommendation.detail, seedRouteLine, baseLine].filter(Boolean),
      veinMemory,
      firstSeedMemory,
      sproutMemory,
      seedRoute,
      action: "播种",
      actionId: "plant",
    };
  }
  const crop = data.cropsById.get(plot.cropId);
  const affinity = cropSolarAffinity(crop, plot);
  const yieldBonus = cropSolarYieldBonus(crop, plot, affinity);
  const growDays = Number(crop?.grow_days || 1);
  const age = Math.max(0, state.day - Number(plot.plantedDay || state.day));
  const remaining = plot.mature ? 0 : Math.max(0, growDays - age);
  const nextAction = plot.mature ? "收获" : plot.watered ? "入夜" : "浇水";
  const baizhiGuidance = plot.cropId === baizhiCropId ? baizhiQuestGuidanceSpec(baizhiSeedId) : null;
  const growingRoute = growingCropUseRouteSpec(plot);
  const spiritAssistLine = state.spirits.length > 0
    ? (state.completed.has("assist")
      ? "精怪协助已解锁，继续选中有作物的地块就能让伙伴代浇周围 3x3。"
      : "精怪在队时，选中有作物的地块可让伙伴一次浇灌周围 3x3。")
    : "";
  return {
    state: `${affinity.state || "planted"}${baizhiGuidance ? " quest" : ""}${clearedClass}${firstSeedClass}${sproutClass}${spiritBornClass}`,
    title: `灵田 (${plot.x + 1}, ${plot.y + 1}) · ${typeText}`,
    subtitle: `${itemName(plot.cropId)} · ${plot.mature ? "成熟可收" : plot.watered ? "今日已润" : "需要浇水"}`,
    lines: [
      `${affinity.detail}${yieldBonus.amount > 0 ? ` · 预计收获 +${yieldBonus.amount}` : ""}`,
      `生长 ${age}/${growDays} 天${remaining > 0 ? ` · 约 ${remaining} 夜后成熟` : ""}`,
      ...(baizhiGuidance ? [baizhiGuidance.progress] : []),
      ...(spiritAssistLine ? [spiritAssistLine] : []),
    ],
    veinMemory,
    firstSeedMemory,
    sproutMemory,
    growingRoute,
    action: nextAction,
    actionId: plot.mature ? "harvest" : plot.watered ? "sleep" : "water",
  };
}

export function selectedPlotRouteActionSpecsUi(route = null) {
  if (!route) return [];
  const actions = [];
  if (route.orderId) {
    actions.push({
      key: `order:${route.orderId}`,
      attr: `data-plot-route-order="${route.orderId}"`,
      label: "看订单",
    });
  }
  if (route.recipeId) {
    actions.push({
      key: `recipe:${route.recipeId}`,
      attr: `data-plot-route-recipe="${route.recipeId}"`,
      label: "看配方",
    });
  }
  if (route.type === "shop" || route.shopTag) {
    actions.push({
      key: `shop:${route.shopTag || route.itemId}`,
      attr: `data-plot-route-shop="${route.shopTag || ""}" data-plot-route-item="${route.itemId || ""}"`,
      label: "看旧铺",
    });
  }
  if (route.seedId && actions.length === 0) {
    actions.push({
      key: `seed:${route.seedId}`,
      attr: `data-plot-route-seed="${route.seedId}"`,
      label: "看种子",
    });
  }
  const seen = new Set();
  return actions.filter((action) => {
    if (seen.has(action.key)) return false;
    seen.add(action.key);
    return true;
  });
}

export function selectedPlotRouteActionsMarkupUi(route = null) {
  const actions = selectedPlotRouteActionSpecsUi(route);
  if (!actions.length) return "";
  return `
    <div class="selected-plot-route-actions ${route.type || "stock"}">
      <em>去向入口</em>
      ${actions.map((action) => `<button type="button" ${action.attr}>${action.label}</button>`).join("")}
    </div>
  `;
}

export function inventoryRouteActionsMarkupUi(route = null) {
  const actions = selectedPlotRouteActionSpecsUi(route);
  if (!actions.length) return "";
  const inventoryAttr = (attr) => attr
    .replace("data-plot-route-order", "data-inventory-route-order")
    .replace("data-plot-route-recipe", "data-inventory-route-recipe")
    .replace("data-plot-route-seed", "data-inventory-route-seed")
    .replace("data-plot-route-shop", "data-inventory-route-shop")
    .replace("data-plot-route-item", "data-inventory-route-item");
  return `
    <div class="item-use-route-actions ${route.type || "stock"}">
      <em>背包去向</em>
      ${actions.map((action) => `<button type="button" ${inventoryAttr(action.attr)}>${action.label}</button>`).join("")}
    </div>
  `;
}

export function inventoryRouteStatusMarkupUi({
  route = null,
  data,
  visibleOrders,
  orderNeedStatus,
  recipeCraftReady,
  recipeInputStatus,
  recipeName,
  shopTagLabel,
}) {
  if (!route || route.type === "stock") return "";
  const lines = [];
  if (route.orderId) {
    const order = visibleOrders().find((entry) => entry.order_id === route.orderId);
    if (order) {
      const status = orderNeedStatus(order);
      lines.push(status.ready ? "订单已备齐，可去交付" : `订单缺口：${status.missingText || "继续备货"}`);
    } else {
      lines.push("订单暂未上板，先留作备货");
    }
  }
  if (route.recipeId) {
    const recipe = data.recipes.find((entry) => entry.recipe_id === route.recipeId);
    if (recipe) {
      const craftable = recipeCraftReady(recipe);
      const inputText = recipeInputStatus(recipe, 4);
      lines.push(craftable ? `工坊可下锅：${recipeName(recipe)}` : `配方原料：${inputText || "继续备料"}`);
    }
  }
  if (route.type === "shop" || route.shopTag) {
    lines.push(`旧铺货签：${route.shopTagLabel || shopTagLabel(route.shopTag) || "可上架试卖"}`);
  }
  if (!lines.length && route.missingText) lines.push(`还差：${route.missingText}`);
  if (!lines.length) return "";
  return `<small class="item-use-route-status ${route.ready ? "ready" : "pending"}">${lines.slice(0, 2).join(" · ")}</small>`;
}

export function selectedPlotDetailSpecUi(deps) {
  return selectedPlotDetailSpecInternal(deps);
}
