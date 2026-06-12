export function orderBuildPrepWorldRowsData({
  limit = 3,
  orders = [],
  inventory = {},
  buildingsById = new Map(),
  builtBuildings = new Set(),
  buildableBuildings = [],
  craftPrepRows = [],
  seedPrepRows = [],
  seedRestockRows = [],
  marketPrepRows = [],
  canDeliverOrder = () => false,
  orderNeedStatus = () => ({ missing: [] }),
  bestRecipeForOutput = () => null,
  recipeUnlocked = () => false,
  recipeMachine = () => null,
  machineForRecipe = () => null,
  canBuild = () => false,
  costText = () => "",
  orderTitle = (order) => order?.order_id || "订单",
  npcName = (npcId) => npcId || "来客",
  itemName = (itemId) => itemId,
  recipeName = (recipe) => recipe?.recipe_id || "配方",
  machineName = (machine) => machine?.machine_id || "设备",
  buildingName = (building) => building?.building_id || "工坊",
  recipeInputStatus = () => "",
} = {}) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const stock = inventory && typeof inventory === "object" ? inventory : {};
  const buildingLookup = buildingsById instanceof Map ? buildingsById : new Map();
  const builtSet = builtBuildings instanceof Set ? builtBuildings : new Set(builtBuildings || []);
  const visibleBuildingIds = new Set((Array.isArray(buildableBuildings) ? buildableBuildings : []).map((building) => building.building_id));
  const blockers = [craftPrepRows, seedPrepRows, seedRestockRows, marketPrepRows];
  if (safeOrders.some((order) => canDeliverOrder(order))) return [];
  if (blockers.some((rows) => Array.isArray(rows) && rows.length)) return [];
  return safeOrders
    .filter((order) => !canDeliverOrder(order))
    .flatMap((order) => {
      const status = orderNeedStatus(order);
      return (status.missing || [])
        .map((missing) => {
          const recipe = bestRecipeForOutput(missing.itemId);
          if (!recipe || !recipeUnlocked(recipe) || recipeMachine(recipe) || recipe.machine_type === "kitchen") return null;
          const machine = machineForRecipe(recipe);
          const building = machine?.building_unlock_id ? buildingLookup.get(machine.building_unlock_id) : null;
          if (!machine || !building || !visibleBuildingIds.has(building.building_id) || builtSet.has(building.building_id)) return null;
          const rewardGold = Number(order.reward_gold || 0);
          const rewardFame = Number(order.reward_fame || 0);
          const outputHave = Number(stock[missing.itemId] || 0);
          const outputNeed = Number(missing.count || 1);
          const buildReady = canBuild(building);
          const priority = 32
            + (buildReady ? 24 : 0)
            + rewardGold / 36
            + rewardFame * 6
            + Math.max(0, 16 - Number(recipe.base_process_time || 60) / 12)
            + (String(order.order_id || "").startsWith("order_year2_") ? 14 : 0);
          return {
            order,
            orderId: order.order_id,
            orderTitle: orderTitle(order),
            npc: npcName(order.issuer_id || order.reward_favor_npc),
            itemId: missing.itemId,
            itemName: itemName(missing.itemId),
            outputHave,
            outputNeed,
            missingCount: Math.max(0, outputNeed - outputHave),
            recipe,
            recipeId: recipe.recipe_id,
            recipeTitle: recipeName(recipe),
            machine,
            machineId: machine.machine_id,
            machineLabel: machineName(machine),
            building,
            buildingId: building.building_id,
            buildingLabel: buildingName(building),
            buildReady,
            costLine: costText(building),
            inputText: recipeInputStatus(recipe, 3) || "原料后续再备",
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

export function orderBuildPrepWorldBoardSpecData({
  width = 960,
  height = 640,
  day = 1,
  rows = [],
  slot = null,
  copy = null,
  specWorld = null,
} = {}) {
  if (typeof specWorld !== "function") return null;
  return specWorld({
    width,
    height,
    day,
    rows,
    slot,
    copy,
  });
}

export function orderBuildPrepWorldBoardAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function orderBuildPrepWorldBoardFocusData(
  spec = null,
  day = 1,
  selectorDataValue = (value) => String(value ?? ""),
) {
  if (!spec?.top?.buildingId) return null;
  const { top } = spec;
  return {
    focus: {
      key: spec.key,
      day,
      orderId: top.orderId,
      recipeId: top.recipeId,
      buildingId: top.buildingId,
    },
    selectedRecipeId: top.recipeId,
    target: {
      selector: `[data-build-id="${selectorDataValue(top.buildingId)}"]`,
      fallbackSelector: ".build-panel",
      label: "点选订单工坊缺口",
      log: `${top.orderTitle} 需要 ${top.itemName} ${top.outputHave}/${top.outputNeed}。${top.recipeTitle} 要用 ${top.machineLabel}，先建 ${top.buildingLabel}。${top.buildReady ? "材料已齐，可以在建造面板确认建造；建成后回配方栏排产。" : `建造材料还没齐：${top.costLine}。先补齐材料，再回来建工坊。`}`,
      panelGroup: "systems",
      missingTitle: "订单工坊缺口",
      missingLog: `${top.recipeTitle} 已选中，但 ${top.buildingLabel} 的建造卡暂时没有找到。先确认系统深挖分组里的洞天建设面板。`,
    },
  };
}
