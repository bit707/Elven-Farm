export function orderSeedPrepTargetPlotData({
  crop = null,
  plots = [],
} = {}) {
  const safePlots = Array.isArray(plots) ? plots : [];
  const waterPreferred = crop?.element_type === "water";
  return safePlots.find((plot) => !plot.cropId && !plot.debris && waterPreferred && (plot.waterSoil || plot.newlyExpanded))
    || safePlots.find((plot) => !plot.cropId && !plot.debris)
    || null;
}

export function orderSeedPrepWorldRowsData({
  limit = 3,
  orders = [],
  cropsBySeed = new Map(),
  plots = [],
  inventory = {},
  craftPrepRows = [],
  canDeliverOrder = () => false,
  orderNeedStatus = () => ({ missing: [] }),
  orderProductionPlan = () => [],
  hasItem = () => false,
  seedProjectedHarvestSpec = () => ({ count: 1 }),
  seedUseRouteSpec = () => null,
  seedSolarRecommendation = () => ({}),
  orderTitle = (order) => order?.order_id || "订单",
  npcName = (npcId) => npcId || "来客",
  itemName = (itemId) => itemId,
  targetPlotForCrop = null,
} = {}) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const stock = inventory && typeof inventory === "object" ? inventory : {};
  const cropLookup = cropsBySeed instanceof Map ? cropsBySeed : new Map();
  const craftRows = Array.isArray(craftPrepRows) ? craftPrepRows : [];
  const plotForCrop = typeof targetPlotForCrop === "function"
    ? targetPlotForCrop
    : (crop) => orderSeedPrepTargetPlotData({ crop, plots });
  if (safeOrders.some((order) => canDeliverOrder(order))) return [];
  if (craftRows.length) return [];
  return safeOrders
    .filter((order) => !canDeliverOrder(order))
    .flatMap((order) => {
      const status = orderNeedStatus(order);
      const missingByItem = new Map((status.missing || []).map((entry) => [entry.itemId, entry]));
      return orderProductionPlan(order)
        .filter((entry) => missingByItem.has(entry.itemId) && entry.action?.type === "seed" && !entry.action.disabled)
        .map((entry) => {
          const crop = cropLookup.get(entry.action.id);
          if (!crop || !hasItem(crop.seed_item_id, 1)) return null;
          const plot = plotForCrop(crop);
          if (!plot) return null;
          const missing = missingByItem.get(entry.itemId);
          const projected = seedProjectedHarvestSpec(crop, plot);
          const route = seedUseRouteSpec(crop, plot);
          const recommendation = seedSolarRecommendation(crop, plot);
          const rewardGold = Number(order.reward_gold || 0);
          const rewardFame = Number(order.reward_fame || 0);
          const outputHave = Number(stock[entry.itemId] || 0);
          const projectedCount = Number(projected.count || 1);
          const enoughAfterHarvest = outputHave + projectedCount >= Number(missing.count || 1);
          const priority = (enoughAfterHarvest ? 72 : 44)
            + rewardGold / 28
            + rewardFame * 8
            + (recommendation.className === "boost" ? 18 : recommendation.className === "season" ? 10 : 0)
            + (plot.waterSoil ? 8 : 0)
            + (String(order.order_id || "").startsWith("order_year2_") ? 18 : 0);
          return {
            order,
            orderId: order.order_id,
            orderTitle: orderTitle(order),
            npc: npcName(order.issuer_id || order.reward_favor_npc),
            itemId: entry.itemId,
            itemName: itemName(entry.itemId),
            seedId: crop.seed_item_id,
            seedName: itemName(crop.seed_item_id),
            crop,
            plot,
            plotLabel: `(${plot.x + 1},${plot.y + 1})`,
            missingCount: Math.max(0, Number(missing.count || 1) - outputHave),
            haveText: `${outputHave}/${Number(missing.count || 1)}`,
            projectedCount,
            enoughAfterHarvest,
            growDays: Number(crop.grow_days || 1),
            recommendation,
            route,
            rewardText: [
              rewardGold ? `${rewardGold} 灵石` : "",
              rewardFame ? `声望 +${rewardFame}` : "",
            ].filter(Boolean).join(" / ") || "订单奖励",
            priority,
          };
        })
        .filter(Boolean);
    })
    .sort((a, b) => b.priority - a.priority || a.orderTitle.localeCompare(b.orderTitle, "zh-Hans-CN"))
    .slice(0, limit);
}

export function orderSeedPrepWorldBoardSpecData({
  width = 960,
  height = 640,
  day = 1,
  rows = [],
  metrics = null,
  copy = null,
  specWorld = null,
} = {}) {
  if (typeof specWorld !== "function") return null;
  return specWorld({
    width,
    height,
    day,
    rows,
    metrics,
    copy,
  });
}

export function orderSeedPrepWorldBoardAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function orderSeedPrepWorldBoardFocusData(spec = null, day = 1) {
  if (!spec?.top?.seedId) return null;
  const { top } = spec;
  return {
    focus: { key: spec.key, day, orderId: top.orderId, seedId: top.seedId },
    selected: { x: top.plot.x, y: top.plot.y },
    selectedSeedId: top.seedId,
    pulse: {
      plot: top.plot,
      kind: "plant",
      options: { useRoute: top.route, harvestText: spec.title },
    },
    log: {
      title: "点选订单缺口可下种",
      message: `${top.orderTitle} 还差 ${top.itemName} ${top.haveText}。${top.seedName} 已切到种植栏，并定位到 ${top.plotLabel} 号空田；种下后预计 ${top.growDays} 天成熟，收后去向：${top.route?.badge || "订单备货"}。`,
    },
    seedId: top.seedId,
  };
}
