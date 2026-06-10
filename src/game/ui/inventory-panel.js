export function renderInventoryPanelUi({
  refs,
  state,
  assetSrc,
  shopWeatherShelfRecommendationSpec,
  syncShopOpeningState,
  harvestUseRouteSafe,
  harvestUseRouteSpec,
  inventoryRouteActionsMarkup,
  inventoryRouteStatusMarkup,
  shopRestockTargetReady,
  inventoryWeatherShelfHintMarkup,
  itemName,
}) {
  refs.inventoryList.innerHTML = "";
  const entries = Object.entries(state.inventory);
  if (entries.length === 0) {
    refs.inventoryList.innerHTML = '<div class="item-row"><span>背包空空</span><strong>0</strong></div>';
    return;
  }

  const weatherShelf = shopWeatherShelfRecommendationSpec();
  for (const [itemId, count] of entries) {
    const row = document.createElement("div");
    const restockTarget = syncShopOpeningState().restockTarget;
    const restockMatch = restockTarget?.status === "active" && restockTarget.itemId === itemId ? restockTarget : null;
    const liveRoute = state.lastHarvestUseRoute?.itemId === itemId && state.lastHarvestUseRoute?.day === state.day
      ? harvestUseRouteSafe(state.lastHarvestUseRoute)
      : null;
    const route = liveRoute || harvestUseRouteSpec(itemId, count);
    row.className = `item-row${liveRoute ? " live-use-route" : ""}${restockMatch ? " shop-restock-inventory-target" : ""}`;
    const icon =
      itemId.includes("baicai")
        ? `<img class="mini-icon" src="${assetSrc("assets/crop-baicai.svg")}" alt="" />`
        : itemId.includes("bailuobo")
          ? `<img class="mini-icon" src="${assetSrc("assets/crop-bailuobo.svg")}" alt="" />`
          : "";
    const routeHint = route && route.type !== "stock"
      ? `<small class="item-use-route">${route.badge}：${route.targetName || route.cta}</small>`
      : liveRoute
        ? `<small class="item-use-route">收获去向：${liveRoute.cta || "先留作库存"}</small>`
        : "";
    const routeActions = route && route.type !== "stock" ? inventoryRouteActionsMarkup(route) : "";
    const routeStatus = route && route.type !== "stock" ? inventoryRouteStatusMarkup(route) : "";
    const restockHint = restockMatch
      ? `<small class="item-shop-restock-target">旧铺补货目标：${count}/${restockMatch.desiredCount}${shopRestockTargetReady(restockMatch) ? " · 可完成" : ` · 期限第 ${restockMatch.dueDay} 天`}<button type="button" data-inventory-shop-restock="${itemId}">看追踪</button></small>`
      : "";
    const weatherShelfHint = inventoryWeatherShelfHintMarkup(itemId, count, weatherShelf);
    row.innerHTML = `<span>${icon}<b>${itemName(itemId)}</b>${restockHint}${weatherShelfHint}${routeHint}${routeStatus}${routeActions}</span><strong>${count}</strong>`;
    refs.inventoryList.append(row);
  }
}
