export function orderCraftPrepWorldRowsData({
  limit = 3,
  orders = [],
  recipes = [],
  inventory = {},
  canDeliverOrder = () => false,
  orderNeedStatus = () => ({ missing: [] }),
  orderProductionPlan = () => [],
  recipeCraftReady = () => false,
  orderTitle = (order) => order?.order_id || "订单",
  npcName = (npcId) => npcId || "来客",
  itemName = (itemId) => itemId,
  recipeName = (recipe) => recipe?.recipe_id || "配方",
  recipeInputStatus = () => "",
  recipeMachineHint = () => "",
} = {}) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const stock = inventory && typeof inventory === "object" ? inventory : {};
  if (safeOrders.some((order) => canDeliverOrder(order))) return [];
  return safeOrders
    .filter((order) => !canDeliverOrder(order))
    .flatMap((order) => {
      const status = orderNeedStatus(order);
      const missingByItem = new Map((status.missing || []).map((entry) => [entry.itemId, entry]));
      return orderProductionPlan(order)
        .filter((entry) => missingByItem.has(entry.itemId) && entry.action?.type === "recipe" && !entry.action.disabled)
        .map((entry) => {
          const recipe = safeRecipes.find((candidate) => candidate.recipe_id === entry.action.id);
          if (!recipe || !recipeCraftReady(recipe)) return null;
          const missing = missingByItem.get(entry.itemId);
          const rewardGold = Number(order.reward_gold || 0);
          const rewardFame = Number(order.reward_fame || 0);
          const outputCount = Number(recipe.output_count || 1);
          const outputHave = Number(stock[entry.itemId] || 0);
          const enoughAfterCraft = outputHave + outputCount >= Number(missing.count || 1);
          const priority = (enoughAfterCraft ? 70 : 38)
            + rewardGold / 25
            + rewardFame * 9
            + (String(order.order_id || "").startsWith("order_year2_") ? 20 : 0)
            + Math.max(0, 18 - Number(recipe.base_process_time || 60) / 12);
          return {
            order,
            orderId: order.order_id,
            orderTitle: orderTitle(order),
            npc: npcName(order.issuer_id || order.reward_favor_npc),
            itemId: entry.itemId,
            itemName: itemName(entry.itemId),
            missingCount: Math.max(0, Number(missing.count || 1) - outputHave),
            haveText: `${outputHave}/${Number(missing.count || 1)}`,
            recipe,
            recipeId: recipe.recipe_id,
            recipeTitle: recipeName(recipe),
            outputCount,
            enoughAfterCraft,
            inputText: recipeInputStatus(recipe, 3) || "原料已齐",
            machineText: recipeMachineHint(recipe),
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

export function orderCraftPrepWorldBoardSpecData({
  width = 960,
  height = 640,
  day = 1,
  rows = [],
  copy = null,
  specWorld = null,
} = {}) {
  if (typeof specWorld !== "function") return null;
  return specWorld({
    width,
    height,
    day,
    rows,
    copy,
  });
}

export function orderCraftPrepWorldBoardAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function orderCraftPrepWorldBoardFocusData(spec = null, day = 1) {
  if (!spec?.top?.recipeId) return null;
  const { top } = spec;
  return {
    focus: { key: spec.key, day, orderId: top.orderId, recipeId: top.recipeId },
    log: {
      title: "点选订单缺口可入锅",
      message: `${top.orderTitle} 还差 ${top.itemName} ${top.haveText}，${top.recipeTitle} 已切到加工栏。做完这一锅后再回订单板看是否可交。`,
    },
    recipeId: top.recipeId,
  };
}
