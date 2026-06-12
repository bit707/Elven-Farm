export function orderMarketPrepWorldRowsData({
  limit = 3,
  orders = [],
  inventory = {},
  gold = 0,
  craftPrepRows = [],
  seedPrepRows = [],
  seedRestockRows = [],
  canDeliverOrder = () => false,
  orderNeedStatus = () => ({ missing: [] }),
  bestRecipeForOutput = () => null,
  recipeUnlocked = () => false,
  recipeMachine = () => null,
  recipeCraftReady = () => false,
  aggregatedRecipeInputs = () => [],
  buyPrice = () => 0,
  orderTitle = (order) => order?.order_id || "订单",
  npcName = (npcId) => npcId || "来客",
  itemName = (itemId) => itemId,
  recipeName = (recipe) => recipe?.recipe_id || "配方",
  recipeMachineHint = () => "",
  recipeInputStatus = () => "",
} = {}) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const stock = inventory && typeof inventory === "object" ? inventory : {};
  const craftRows = Array.isArray(craftPrepRows) ? craftPrepRows : [];
  const seedRows = Array.isArray(seedPrepRows) ? seedPrepRows : [];
  const restockRows = Array.isArray(seedRestockRows) ? seedRestockRows : [];
  if (safeOrders.some((order) => canDeliverOrder(order))) return [];
  if (craftRows.length || seedRows.length || restockRows.length) return [];
  return safeOrders
    .filter((order) => !canDeliverOrder(order))
    .flatMap((order) => {
      const status = orderNeedStatus(order);
      return (status.missing || [])
        .map((missing) => {
          const recipe = bestRecipeForOutput(missing.itemId);
          if (!recipe || !recipeUnlocked(recipe) || !recipeMachine(recipe) || recipeCraftReady(recipe)) return null;
          const missingInputs = aggregatedRecipeInputs(recipe)
            .map(({ itemId, count }) => ({
              itemId,
              count: Number(count || 1),
              have: Number(stock[itemId] || 0),
              price: buyPrice(itemId),
            }))
            .filter((entry) => entry.have < entry.count && entry.price > 0 && !String(entry.itemId || "").startsWith("seed_"));
          if (!missingInputs.length) return null;
          const input = missingInputs[0];
          const missingCount = Math.max(1, input.count - input.have);
          const totalCost = input.price * missingCount;
          if (Number(gold || 0) < totalCost) return null;
          const rewardGold = Number(order.reward_gold || 0);
          const rewardFame = Number(order.reward_fame || 0);
          const outputHave = Number(stock[missing.itemId] || 0);
          const priority = 44
            + rewardGold / 32
            + rewardFame * 7
            + Math.max(0, 18 - Number(recipe.base_process_time || 60) / 12)
            + (String(order.order_id || "").startsWith("order_year2_") ? 16 : 0);
          return {
            order,
            orderId: order.order_id,
            orderTitle: orderTitle(order),
            npc: npcName(order.issuer_id || order.reward_favor_npc),
            itemId: missing.itemId,
            itemName: itemName(missing.itemId),
            outputHave,
            outputNeed: Number(missing.count || 1),
            recipe,
            recipeId: recipe.recipe_id,
            recipeTitle: recipeName(recipe),
            inputId: input.itemId,
            inputName: itemName(input.itemId),
            inputHave: input.have,
            inputNeed: input.count,
            missingCount,
            price: input.price,
            totalCost,
            machineText: recipeMachineHint(recipe),
            inputText: recipeInputStatus(recipe, 3) || "原料已齐",
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

export function orderMarketPrepWorldBoardSpecData({
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

export function orderMarketPrepWorldBoardAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function orderMarketPrepWorldBoardFocusData(spec = null, day = 1) {
  if (!spec?.top?.recipeId) return null;
  const { top } = spec;
  return {
    focus: {
      key: spec.key,
      day,
      orderId: top.orderId,
      recipeId: top.recipeId,
      inputId: top.inputId,
    },
    selectedRecipeId: top.recipeId,
    target: {
      selector: "#recipeSelect",
      fallbackSelector: "#inventoryList",
      label: "点选订单市集备料",
      log: `${top.orderTitle} 需要 ${top.itemName} ${top.outputHave}/${top.outputNeed}。${top.recipeTitle} 已切到加工栏，但还差 ${top.inputName} ${top.inputHave}/${top.inputNeed}；市集估价 ${top.price} 灵石/份，补 ${top.missingCount} 份约 ${top.totalCost} 灵石。`,
      panelGroup: "core",
      missingTitle: "订单市集备料",
      missingLog: `${top.recipeTitle} 已选中，但配方栏暂时没有找到。先从背包和订单生产路线确认 ${top.inputName} 来源。`,
    },
  };
}
