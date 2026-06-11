export function drawWorkshopOutputRouteTriptychWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.nodes?.length) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2.6;
  const cardY = rect.y + pulse * 0.35;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.72)" : "rgba(224, 182, 109, 0.5)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width - 46, cardY - 24, rect.x + rect.width - 24, cardY + 32);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 253, 245, 0.94)");
  ctx.strokeStyle = active ? "rgba(190, 79, 55, 0.86)" : "rgba(180, 125, 47, 0.52)";
  ctx.lineWidth = active ? 2.6 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 54, 42, 14);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("锅", rect.x + 31, cardY + 42);
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 82, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 82, cardY + 43);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`${spec.outputLabel} x${spec.outputCount} · 库存 ${spec.haveCount}`.slice(0, 28), rect.x + 82, cardY + 58);

  const nodeY = cardY + 78;
  const nodeW = 92;
  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 18 + index * 102;
    ctx.fillStyle = node.soft;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 12, nodeW, 38, 13);
    ctx.fill();
    ctx.strokeStyle = `${node.accent}66`;
    ctx.lineWidth = active ? 1.8 : 1.1;
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 16, nodeY + 7, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge.slice(0, 1), nodeX + 11, nodeY + 11);
    ctx.fillStyle = node.accent;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 5), nodeX + 34, nodeY + 2);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(node.detail.slice(0, 10), nodeX + 34, nodeY + 17);
  });

  ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 18, rect.width - 32, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.safety}`.slice(0, 42), rect.x + 24, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function workshopOutputRouteTriptychWorldSpecFromRuntimeWorld({
  day = 1,
  aromaSpec = null,
  recipe = null,
  outputItemId = "",
  outputLabel = "",
  outputCount = 1,
  haveCount = 0,
  shopTag = "",
  shopTagText = "",
  recipeLabel = "Current recipe",
} = {}) {
  if (!aromaSpec?.aroma?.orderUnlocked) return null;
  if (!outputItemId) return null;

  const aroma = aromaSpec.aroma;
  const safeOutputLabel = outputLabel || aroma.itemName || outputItemId;
  const safeRecipeLabel = recipeLabel || "Current recipe";
  const safeShopTag = shopTag || "food";
  const safeShopTagText = shopTagText || "Shop shelf";
  const orderTitleText = aromaSpec.orderTitle || "First order";
  const orderDetail = aromaSpec.orderId
    ? aromaSpec.ready
      ? `${orderTitleText} is stocked`
      : `${orderTitleText} missing ${aromaSpec.orderMatch?.missingText || "materials"}`
    : "No linked order";
  const shopDetail = `${safeShopTagText} / stock ${Number(haveCount || 0)}`;

  return {
    key: `${day}:${aroma.recipeId || "recipe"}:${outputItemId}:${aromaSpec.orderId || "no_order"}:${Number(haveCount || 0)}:${aromaSpec.ready ? 1 : 0}:triptych`,
    day,
    aroma,
    recipe,
    recipeId: recipe?.recipe_id || aroma.recipeId || "",
    recipeLabel: safeRecipeLabel,
    outputItemId,
    outputLabel: safeOutputLabel,
    outputCount: Number(outputCount || 1),
    haveCount: Number(haveCount || 0),
    orderId: aromaSpec.orderId || "",
    orderTitle: orderTitleText,
    orderReady: Boolean(aromaSpec.ready),
    shopTag: safeShopTag,
    shopTagText: safeShopTagText,
    title: "Output route triptych - click",
    headline: `${safeOutputLabel} has three post-pot routes`,
    safety: "Will not auto-deliver, open shop, or continue crafting",
    cta: "Focus route only / no auto action",
    anchor: { x: 520, y: 428 },
    rect: { x: 286, y: 330, width: 330, height: 126 },
    nodes: [
      {
        key: "order",
        badge: "ORD",
        title: "Order route",
        detail: orderDetail,
        accent: aromaSpec.ready ? "#286f58" : "#b47d2f",
        soft: aromaSpec.ready ? "rgba(202, 235, 210, 0.28)" : "rgba(246, 240, 182, 0.26)",
        target: aromaSpec.orderId ? "order" : "recipe",
      },
      {
        key: "shop",
        badge: "SHP",
        title: "Shop route",
        detail: shopDetail,
        accent: "#8f5f3f",
        soft: "rgba(255, 248, 232, 0.64)",
        target: "shop",
      },
      {
        key: "stock",
        badge: "INV",
        title: "Stock prep",
        detail: `${safeRecipeLabel} / next pot`,
        accent: "#57756a",
        soft: "rgba(202, 235, 210, 0.2)",
        target: "recipe",
      },
    ],
  };
}

export function drawWorkshopIngredientReadyWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.potPoint || !spec?.inputItems?.length) return false;
  const { rect, anchor, potPoint } = spec;
  const accent = spec.firstAroma ? "#be4f37" : spec.orderReady ? "#286f58" : "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.85) * 2.2;
  const flicker = reducedMotion ? 0.5 : (Math.sin(motion * 5.4) + 1) / 2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y - 16);
  ctx.quadraticCurveTo(rect.x + rect.width - 54, cardY - 28, rect.x + rect.width - 34, cardY + 26);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = `rgba(190, 79, 55, ${0.12 + flicker * 0.08})`;
  ctx.beginPath();
  ctx.ellipse(potPoint.x, potPoint.y + 26, 58 + flicker * 6, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(91, 51, 40, 0.86)";
  ctx.beginPath();
  ctx.roundRect(potPoint.x - 32, potPoint.y + 6, 64, 34, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 248, 232, 0.9)";
  ctx.beginPath();
  ctx.ellipse(potPoint.x, potPoint.y + 8, 34, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `${accent}99`;
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let i = 0; i < 3; i += 1) {
    const steamX = potPoint.x - 18 + i * 18;
    ctx.strokeStyle = `rgba(255, 253, 245, ${0.38 + flicker * 0.22})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(steamX, potPoint.y + 2);
    ctx.quadraticCurveTo(steamX - 8, potPoint.y - 14 - i * 2, steamX + 4, potPoint.y - 26 - flicker * 5);
    ctx.stroke();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.7 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}20`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 52, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("火", rect.x + 33, cardY + 50);
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可做", rect.x + 30, cardY + 64);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 86, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 86, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.outputName} x${spec.outputCount} · ${spec.machineText}`.slice(0, 38), rect.x + 86, cardY + 63);

  spec.inputItems.forEach((item, index) => {
    const chipX = rect.x + 18 + index * 100;
    const chipY = cardY + 80;
    ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
    ctx.strokeStyle = `${accent}40`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY - 10, 90, 22, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(item.name.slice(0, 5), chipX + 8, chipY - 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(`${item.have}/${item.count}`, chipX + 58, chipY - 1);
    ctx.fillStyle = "#286f58";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText("齐", chipX + 8, chipY + 10);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 13, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, cardY + 26);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 15, rect.width - 36, 11, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 54), rect.x + 26, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function workshopIngredientReadyWorldSpecFromRuntimeWorld({
  width = 960,
  height = 640,
  day = 1,
  activeCutscene = false,
  activeDialogueLength = 0,
  workshopQueueLength = 0,
  craftCompleted = false,
  candidate = null,
  stateInventory = {},
  itemName = (itemId) => itemId,
  shopTagsForItem = () => [],
  ecologySummary = null,
  prioritizeShopTag = () => "",
  shopTagLabel = (tag) => tag || "",
  recipeInputs = () => [],
  orderMatchSafe = (match) => match,
  safetyText = "Focus only. No automatic craft, schedule, sell, deliver, shop open, night change, or resource spend.",
} = {}) {
  if (activeCutscene || Number(activeDialogueLength || 0) > 0) return null;
  if (Number(workshopQueueLength || 0) > 0 && !craftCompleted) return null;
  if (!candidate?.preview?.craftable) return null;

  const { recipe, preview } = candidate;
  if (!recipe || !preview) return null;

  const inventory = stateInventory && typeof stateInventory === "object" ? stateInventory : {};
  const orderMatch = orderMatchSafe(preview.orderMatch);
  const shopTags = shopTagsForItem(preview.outputItemId, ecologySummary);
  const shopTag = prioritizeShopTag(shopTags, new Map(), "food") || "food";
  const shopTagText = shopTagLabel(shopTag) || "Shop shelf";
  const routeText = orderMatch
    ? orderMatch.ready
      ? "Materials ready -> Manual craft -> Deliver order"
      : "Materials ready -> Manual craft -> Connect order"
    : `Materials ready -> Manual craft -> ${shopTagText}`;
  const headline = preview.firstAroma
    ? "First aroma ingredients ready"
    : orderMatch?.ready
      ? `${preview.outputName} can finish an order`
      : `${preview.recipeName} is ready to cook`;
  const detail = orderMatch
    ? orderMatch.ready
      ? `${orderMatch.orderTitle || "Order"} waits for this pot; reward ${Number(orderMatch.rewardGold || 0)} spirit stones.`
      : `${orderMatch.orderTitle || "Order"} will connect after cooking; missing ${orderMatch.missingText || "materials"}.`
    : preview.firstAroma
      ? "The first aroma will pin an order to the old shop board."
      : `${preview.outputName} can move to ${shopTagText} stock.`;
  const cardWidth = 326;
  const cardHeight = 120;
  const x = Math.max(366, Math.min(width - cardWidth - 28, 492));
  const y = Math.max(326, Math.min(height - cardHeight - 28, 344));
  const inputItems = recipeInputs(recipe).slice(0, 3).map(({ itemId, count }) => ({
    itemId,
    name: itemName(itemId),
    count: Number(count || 1),
    have: Number(inventory[itemId] || 0),
  }));

  return {
    key: `${day}:${recipe.recipe_id}:${preview.outputItemId}:${orderMatch?.orderId || shopTag}:${preview.valueGain}:${inputItems.map((entry) => `${entry.itemId}:${entry.have}`).join("|")}`,
    day,
    recipeId: recipe.recipe_id,
    recipeName: preview.recipeName,
    outputItemId: preview.outputItemId,
    outputName: preview.outputName,
    outputCount: preview.outputCount,
    firstAroma: Boolean(preview.firstAroma),
    orderId: orderMatch?.orderId || "",
    orderTitle: orderMatch?.orderTitle || "",
    orderReady: Boolean(orderMatch?.ready),
    shopTag,
    shopTagText,
    rawValue: Number(preview.rawValue || 0),
    outputValue: Number(preview.outputValue || 0),
    orderReward: Number(preview.orderReward || 0),
    valueGain: Number(preview.valueGain || 0),
    inputText: preview.inputText,
    machineText: preview.machineText,
    headline,
    detail,
    routeText,
    title: "Ingredient-ready tag - click",
    safety: safetyText,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 620, y: 484 },
    potPoint: { x: 640, y: 424 },
    inputItems,
  };
}

export function drawWorkshopOpeningValueWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor) return false;
  const { rect, anchor } = spec;
  const accent = spec.mode === "running"
    ? "#be4f37"
    : spec.mode === "ready"
      ? "#286f58"
      : "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 2.2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y - 28);
  ctx.quadraticCurveTo(rect.x + 64, cardY - 24, rect.x + 42, cardY + 24);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.mode === "blocked" ? "rgba(255, 248, 232, 0.94)" : "rgba(255, 253, 245, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 58, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText(spec.mode === "running" ? "火" : spec.mode === "ready" ? "值" : "候", rect.x + 33, cardY + 50);
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.mode === "running" ? "锅中" : spec.mode === "ready" ? "可做" : "补料", rect.x + 29, cardY + 66);

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.mode === "running" ? "排产中" : spec.craftable ? "可下锅" : "待补齐"}`.slice(0, 30), rect.x + 86, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 86, cardY + 46);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.outputName} x${spec.outputCount} · ${spec.machineText}`.slice(0, 36), rect.x + 86, cardY + 63);

  const barX = rect.x + 86;
  const barY = cardY + 72;
  const barW = rect.width - 114;
  const barH = 12;
  ctx.fillStyle = "rgba(23, 35, 29, 0.09)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 6);
  ctx.fill();
  ctx.fillStyle = "rgba(143, 95, 63, 0.44)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(8, barW * spec.rawRatio), barH, 6);
  ctx.fill();
  ctx.fillStyle = "rgba(224, 182, 109, 0.62)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(8, barW * spec.outputRatio), barH, 6);
  ctx.fill();
  if (spec.orderReward > 0) {
    ctx.fillStyle = `${accent}cc`;
    ctx.beginPath();
    ctx.roundRect(barX, barY, Math.max(8, barW * spec.orderRatio), barH, 6);
    ctx.fill();
  }
  if (!reducedMotion && spec.mode !== "blocked") {
    const shineX = barX + ((motion * 0.28) % 1) * Math.max(1, barW - 18);
    ctx.fillStyle = "rgba(255, 253, 245, 0.52)";
    ctx.beginPath();
    ctx.roundRect(shineX, barY + 2, 18, barH - 4, 5);
    ctx.fill();
  }

  const chips = [
    { label: "原料", value: `${spec.rawValue}` },
    { label: "出锅", value: `${spec.outputValue}` },
    { label: spec.orderReward ? "订单" : "旧铺", value: spec.orderReward ? `${spec.orderReward}` : spec.shopTagText.slice(0, 3) },
  ];
  chips.forEach((chip, index) => {
    const chipX = rect.x + 18 + index * 76;
    const chipY = cardY + 88;
    ctx.fillStyle = index === 2 ? `${accent}18` : "rgba(255, 248, 232, 0.82)";
    ctx.strokeStyle = `${accent}36`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 66, 22, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(chip.label, chipX + 8, chipY + 9);
    ctx.fillStyle = "#17231d";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(chip.value, chipX + 32, chipY + 16);
  });

  ctx.fillStyle = spec.mode === "blocked" ? "rgba(224, 182, 109, 0.14)" : "rgba(202, 235, 210, 0.42)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 246, cardY + 89, rect.width - 264, 21, 10);
  ctx.fill();
  ctx.fillStyle = spec.mode === "blocked" ? "#8f5f3f" : "#286f58";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText((spec.valueGain > 0 ? `多 ${spec.valueGain}` : spec.mode === "blocked" ? spec.missingText : "接去向").slice(0, 9), rect.x + 258, cardY + 103);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 18, rect.width - 36, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 46), rect.x + 26, cardY + rect.height - 8);

  ctx.restore();
  return true;
}

export function workshopOpeningValueWorldSpecFromRuntimeWorld({
  width = 960,
  height = 640,
  day = 1,
  lineSpec = null,
  recipes = [],
  selectedRecipeId = "",
  availableRecipes = [],
  recipePreviewSpec = () => null,
  itemName = (itemId) => itemId,
  orderMatchSpec = () => null,
  shopTagsForItem = () => [],
  ecologySummary = null,
  prioritizeShopTag = () => "",
  shopTagLabel = () => "",
} = {}) {
  const activeJob = lineSpec?.activeJob || null;
  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const safeAvailableRecipes = Array.isArray(availableRecipes) ? availableRecipes : [];
  const activeRecipe = activeJob
    ? safeRecipes.find((recipe) => recipe.recipe_id === activeJob.recipeId)
    : null;
  const selectedRecipe = safeRecipes.find((recipe) => recipe.recipe_id === selectedRecipeId) || safeAvailableRecipes[0] || null;
  const recipe = activeRecipe || selectedRecipe;
  if (!recipe) return null;
  const preview = recipePreviewSpec(recipe);
  if (!preview) return null;
  const outputItemId = activeJob?.outputItemId || preview.outputItemId;
  const outputCount = Number(activeJob?.outputCount || preview.outputCount || 1);
  const outputName = itemName(outputItemId);
  const orderMatch = activeJob?.orderMatch || preview.orderMatch || orderMatchSpec(outputItemId, outputCount);
  const shopTags = shopTagsForItem(outputItemId, ecologySummary);
  const shopTag = prioritizeShopTag(shopTags, new Map(), "food");
  const shopTagText = shopTagLabel(shopTag);
  const mode = activeJob ? "running" : preview.craftable ? "ready" : "blocked";
  const maxValue = Math.max(1, Number(preview.rawValue || 0), Number(preview.outputValue || 0), Number(preview.orderReward || 0));
  const rawRatio = Number(preview.rawValue || 0) / maxValue;
  const outputRatio = Number(preview.outputValue || 0) / maxValue;
  const orderRatio = Number(preview.orderReward || 0) / maxValue;
  const activeStage = activeJob?.currentStage?.label || "";
  const headline = activeJob
    ? `${activeJob.recipeName} running ${activeStage || "line"}`
    : preview.craftable
      ? `${preview.recipeName} ready to cook`
      : preview.headline;
  const reason = activeJob
    ? orderMatch?.ready
      ? `${outputName} will complete ${orderMatch.orderTitle || "order"} after this pot.`
      : orderMatch
        ? `${outputName} is connecting to ${orderMatch.orderTitle || "order"} and still needs ${orderMatch.missingText || "materials"}.`
        : `${outputName} can go to ${shopTagText || "shop shelf"} after cooking.`
    : preview.orderMatch
      ? preview.orderMatch.ready
        ? `${preview.outputName} can complete ${preview.orderMatch.orderTitle || "order"} after cooking.`
        : `${preview.outputName} will connect to ${preview.orderMatch.orderTitle || "order"} and still needs ${preview.orderMatch.missingText || "materials"}.`
      : preview.firstAroma
        ? "The first aroma will pull the first order onto the old shop board."
        : `${preview.outputName} can go to ${shopTagText || "shop shelf"} or stay as stock.`;
  const routeText = orderMatch?.orderId
    ? orderMatch.ready
      ? "Cook -> Finish pot -> Deliver order"
      : "Cook -> Finish pot -> Fill missing order items"
    : `Cook -> Finish pot -> ${shopTagText || "Shop shelf"}`;
  const cardWidth = 334;
  const cardHeight = 124;
  const x = Math.max(506, Math.min(width - cardWidth - 28, 566));
  const y = Math.max(408, Math.min(height - cardHeight - 28, 414));
  return {
    key: `${day}:${recipe.recipe_id}:${outputItemId}:${mode}:${activeJob?.progress || 0}:${orderMatch?.orderId || "shop"}:${preview.valueGain}`,
    day,
    mode,
    active: Boolean(activeJob),
    recipeId: recipe.recipe_id,
    recipeName: activeJob?.recipeName || preview.recipeName,
    outputItemId,
    outputName,
    outputCount,
    craftable: Boolean(preview.craftable),
    machineText: preview.machineText,
    inputText: preview.inputText,
    missingText: preview.missingText,
    rawValue: Number(preview.rawValue || 0),
    outputValue: Number(preview.outputValue || 0),
    orderReward: Number(preview.orderReward || 0),
    valueGain: Number(preview.valueGain || 0),
    rawRatio,
    outputRatio,
    orderRatio,
    orderId: orderMatch?.orderId || "",
    orderTitle: orderMatch?.orderTitle || preview.orderMatch?.orderTitle || "",
    orderReady: Boolean(orderMatch?.ready || preview.orderMatch?.ready),
    shopTag,
    shopTagText,
    headline,
    reason,
    routeText,
    title: "工坊开锅价值牌",
    cta: "工坊开锅价值牌 路 可点",
    safety: "只定位配方栏、订单板或旧铺货签，不会自动加工、排产、出锅、交单、开铺、入夜或消耗材料。",
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: activeJob
      ? { x: 618, y: 502 }
      : { x: 708, y: 470 },
  };
}

export function workshopSpiritAssistActionWorldSpecFromRuntimeWorld({
  width = 960,
  height = 640,
  day = 1,
  helpers = [],
  activeJob = null,
  activeStage = null,
  helper = null,
  helperText = "",
  stageKey = "idle",
  copy = null,
  orderMatch = null,
  speedText = "",
  recipeId = "",
  safetyText = "Focus only. No auto role change, craft, schedule, output, delivery, shop open, night change, or material spend.",
} = {}) {
  const safeHelpers = Array.isArray(helpers) ? helpers : [];
  if (safeHelpers.length === 0 || !helper || !copy) return null;

  const orderDetail = orderMatch?.orderId
    ? orderMatch.ready
      ? "Order becomes deliverable after this pot"
      : `Order connected / ${orderMatch.missingText || "still missing materials"}`
    : activeJob
      ? `${activeJob.outputItemName} will choose a route after stocking`
      : "Pick a recipe, then schedule manually";
  const cardWidth = 318;
  const cardHeight = 112;
  const x = Math.max(24, Math.min(width - cardWidth - 24, 72));
  const y = Math.max(360, Math.min(height - cardHeight - 24, 486));

  return {
    key: `${day}:${helper.id}:${stageKey}:${activeJob?.id || "idle"}:${activeJob?.progress || 0}:${safeHelpers.length}`,
    day,
    active: Boolean(activeJob),
    helper,
    helperId: helper.id,
    helperName: helper.name || "Helper",
    helperText: helperText || helper.name || "Helper",
    helperCount: safeHelpers.length,
    stageKey,
    stageLabel: activeJob ? activeStage?.label || activeJob.currentStage?.label || "Heat" : "Standby",
    actionTitle: copy.title,
    actionText: copy.action,
    detail: copy.detail,
    summary: copy.summary,
    recipeId,
    orderId: orderMatch?.orderId || "",
    orderReady: Boolean(orderMatch?.ready),
    orderDetail,
    speedText: speedText || "1.0x",
    title: "Spirit assist micro-action - click",
    headline: activeJob
      ? `${helper.name || "Helper"} is assisting ${activeStage?.label || activeJob.currentStage?.label || "the line"}`
      : `${helper.name || "Helper"} is waiting by the workshop`,
    cta: "Focus companion panel / workshop queue",
    safety: safetyText,
    accent: copy.accent,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: {
      x: activeStage?.x || 618,
      y: activeStage?.y || 502,
    },
    nodes: [
      {
        key: "helper",
        badge: "HLP",
        title: "Who helps",
        detail: helperText || helper.name || "Helper",
        accent: "#8f5f3f",
      },
      {
        key: "action",
        badge: copy.badge,
        title: copy.title,
        detail: copy.action,
        accent: copy.accent,
      },
      {
        key: "route",
        badge: orderMatch?.orderId ? "ORD" : activeJob ? "POT" : "IDL",
        title: activeJob ? "Next step" : "Queue next",
        detail: orderDetail,
        accent: orderMatch?.ready ? "#286f58" : "#b47d2f",
      },
    ],
  };
}

export function drawWorkshopSpiritAssistActionWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.nodes?.length) return false;
  const { rect, anchor } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 2.4;
  const cardY = rect.y + pulse * 0.45;
  const accent = spec.accent || "#b47d2f";

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y - 34);
  ctx.quadraticCurveTo((anchor.x + rect.x + 58) / 2, cardY - 46, rect.x + 58, cardY + 22);
  ctx.stroke();
  ctx.setLineDash([]);

  for (let i = 0; i < 5; i += 1) {
    const t = reducedMotion ? i / 4 : (motion * 0.13 + i * 0.19) % 1;
    const beadX = anchor.x + (rect.x + 58 - anchor.x) * t;
    const beadY = anchor.y - 34 + (cardY + 22 - anchor.y + 34) * t - Math.sin(t * Math.PI) * 34;
    ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.72)" : "rgba(202, 235, 210, 0.66)";
    ctx.beginPath();
    ctx.arc(beadX, beadY, 4 + (i % 2), 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, spec.active ? "rgba(255, 240, 232, 0.95)" : "rgba(255, 248, 232, 0.95)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 58, 58, 16);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("帮", rect.x + 32, cardY + 50);
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.arc(rect.x + 60, cardY + 26 - pulse * 0.35, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.beginPath();
  ctx.roundRect(rect.x + 33, cardY + 62, 28, 8, 4);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 86, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 86, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.actionText} · ${spec.stageLabel} · ${spec.speedText}`.slice(0, 38), rect.x + 86, cardY + 62);

  const nodeY = cardY + 80;
  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 16 + index * 100;
    ctx.fillStyle = index === 1 ? `${node.accent}18` : "rgba(255, 253, 245, 0.76)";
    ctx.strokeStyle = `${node.accent}55`;
    ctx.lineWidth = active && index === 1 ? 1.8 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 10, 88, 27, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 15, nodeY + 3, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge.slice(0, 1), nodeX + 11, nodeY + 6);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 4), nodeX + 30, nodeY - 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 8), nodeX + 30, nodeY + 12);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 18, rect.width - 36, 14, 7);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.safety}`.slice(0, 44), rect.x + 26, cardY + rect.height - 8);
  ctx.restore();
  return true;
}

export function workshopOrderQueueWorldBoardSpecFromRuntimeWorld({
  day = 1,
  activeJob = null,
  orderMatch = null,
  stagePoint = null,
} = {}) {
  if (!activeJob || !orderMatch?.orderId) return null;

  const safeStagePoint = stagePoint || { x: 618, y: 502 };
  const cardWidth = 318;
  const cardHeight = 78;
  return {
    key: `${day}:${activeJob.id}:${orderMatch.orderId}:${activeJob.progress}`,
    day,
    activeJob,
    orderMatch,
    rect: { x: 570, y: 492, width: cardWidth, height: cardHeight },
    anchor: { x: safeStagePoint.x, y: safeStagePoint.y },
    boardAnchor: { x: 790, y: 374 },
    title: "World order pot queue",
    headline: orderMatch.ready ? "This pot completes a delivery" : "This pot is connecting an order",
    detail: `${activeJob.outputItemName} ${orderMatch.haveOutput}/${orderMatch.neededCount} +${activeJob.outputCount}`,
    cta: "Order pot is heating - click",
  };
}

export function drawWorkshopOrderQueueWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.activeJob || !spec?.orderMatch || !spec?.anchor || !spec?.boardAnchor) return false;
  const { rect, activeJob, orderMatch, anchor, boardAnchor } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.9) * 2;
  const cardY = rect.y + bob;
  const accent = orderMatch.ready ? "#286f58" : "#be4f37";
  const progress = Math.max(0, Math.min(1, Number(activeJob.progress || 0) / 100));

  ctx.save();
  ctx.strokeStyle = orderMatch.ready ? "rgba(40, 111, 88, 0.55)" : "rgba(190, 79, 55, 0.48)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y - 34);
  ctx.quadraticCurveTo(rect.x + 24, cardY - 28, rect.x + 34, cardY + 18);
  ctx.moveTo(rect.x + rect.width - 18, cardY + 24);
  ctx.quadraticCurveTo(boardAnchor.x - 20, boardAnchor.y + 56, boardAnchor.x, boardAnchor.y);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, orderMatch.ready ? "rgba(237, 243, 223, 0.94)" : "rgba(255, 244, 232, 0.94)");
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = `${accent}24`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 52, 50, 15);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText(orderMatch.ready ? "交" : "锅", rect.x + 31, cardY + 45);
  for (let i = 0; i < 3; i += 1) {
    const lift = reducedMotion ? i * 4 : (motion * 16 + i * 13) % 32;
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.58)" : "rgba(246, 240, 182, 0.52)";
    ctx.beginPath();
    ctx.arc(rect.x + 28 + i * 11, cardY + 18 - lift * 0.45, 6 - i * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.headline}`, rect.x + 82, cardY + 23);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(orderMatch.orderTitle.slice(0, 18), rect.x + 82, cardY + 44);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${activeJob.recipeName} · ${spec.detail}`.slice(0, 34), rect.x + 82, cardY + 62);

  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 82, cardY + 66, rect.width - 126, 8, 4);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 82, cardY + 66, Math.max(10, (rect.width - 126) * progress), 8, 4);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 58, cardY + 14, 42, 20, 10);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 48, cardY + 28);
  ctx.restore();
  return true;
}

export function drawWorkshopValueLedgerWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.steps?.length) return false;
  const { rect } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 3;
  const cardY = rect.y + pulse * 0.4;

  ctx.save();
  ctx.strokeStyle = active ? `${spec.accent}cc` : `${spec.accent}77`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + 42, cardY - 30, rect.x + 34, cardY + 24);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? spec.accent : `${spec.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = spec.soft;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 56, 50, 16);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("账", rect.x + 32, cardY + 46);
  ctx.fillStyle = "rgba(255, 253, 245, 0.88)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 20, cardY + 53, 44, 15, 8);
  ctx.fill();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + 30, cardY + 64);

  ctx.fillStyle = spec.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 84, cardY + 22);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 84, cardY + 45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 36), rect.x + 84, cardY + 62);

  const barX = rect.x + 84;
  const barY = cardY + 70;
  const barW = rect.width - 112;
  const barH = 14;
  ctx.fillStyle = "rgba(23, 35, 29, 0.1)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 7);
  ctx.fill();
  ctx.fillStyle = "rgba(143, 95, 63, 0.42)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(10, barW * Number(spec.rawRatio || 0)), barH, 7);
  ctx.fill();
  ctx.fillStyle = "rgba(224, 182, 109, 0.62)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(10, barW * Number(spec.outputRatio || 0)), barH, 7);
  ctx.fill();
  ctx.fillStyle = `${spec.accent}cc`;
  ctx.beginPath();
  ctx.roundRect(barX, barY, Math.max(10, barW * Number(spec.orderRatio || 0)), barH, 7);
  ctx.fill();
  if (!reducedMotion) {
    const shimmerX = barX + ((motion * 0.32) % 1) * Math.max(1, barW - 20);
    ctx.fillStyle = "rgba(255, 253, 245, 0.58)";
    ctx.beginPath();
    ctx.roundRect(shimmerX, barY + 2, 20, barH - 4, 6);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 118, cardY + 66, 96, 22, 11);
  ctx.fill();
  ctx.strokeStyle = `${spec.accent}55`;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.fillStyle = spec.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.premiumLabel.slice(0, 10), rect.x + rect.width - 106, cardY + 80);

  ctx.fillStyle = spec.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("收益差条", barX, barY + 28);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.profitLabel} · ${spec.conclusion}`.slice(0, 28), barX + 56, barY + 28);

  const stepY = cardY + 98;
  ctx.strokeStyle = `${spec.accent}44`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(rect.x + 24, stepY);
  ctx.lineTo(rect.x + rect.width - 24, stepY);
  ctx.stroke();
  spec.steps.forEach((step, index) => {
    const dotX = rect.x + 34 + index * 104;
    ctx.fillStyle = index === 2 ? spec.accent : "rgba(255, 253, 245, 0.96)";
    ctx.strokeStyle = `${spec.accent}88`;
    ctx.lineWidth = index === 2 ? 2.4 : 1.5;
    ctx.beginPath();
    ctx.arc(dotX, stepY, index === 2 ? 8 : 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = index === 2 ? "#fffdf5" : spec.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(String(index + 1), dotX - 3, stepY + 3);
    ctx.fillStyle = index === 2 ? spec.accent : "#8f5f3f";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(step.label.slice(0, 5), dotX - 20, stepY - 12);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(step.value.slice(0, 9), dotX - 24, stepY + 18);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 20, rect.width - 32, 15, 8);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.safety}`.slice(0, 44), rect.x + 24, cardY + rect.height - 9);
  ctx.restore();
  return true;
}

export function workshopValueLedgerWorldSpecFromRuntimeWorld({
  day = 1,
  aromaSpec = null,
  recipe = null,
  outputItemId = "",
  outputCount = 1,
  inputTotals = [],
  rawValue = 0,
  outputValue = 0,
  order = null,
  rewardGold = 0,
  rewardFame = 0,
  inputText = "",
  recipeName = "Current recipe",
  outputLabel = "",
  orderTitle = "",
  firstOrderProfit = false,
} = {}) {
  if (!aromaSpec?.aroma?.orderUnlocked) return null;
  if (!recipe || !outputItemId) return null;

  const safeOutputCount = Number(outputCount || 1);
  const safeRawValue = Number(rawValue || 0);
  const safeOutputValue = Number(outputValue || 0);
  const safeRewardGold = Number(rewardGold || 0);
  const safeRewardFame = Number(rewardFame || 0);
  const valueGain = Math.max(0, safeRewardGold - safeRawValue);
  const orderPremium = safeRawValue > 0 ? Math.max(1, safeRewardGold / safeRawValue) : 1;
  const valueLiftPercent = safeRawValue > 0 ? Math.round((safeRewardGold - safeRawValue) / safeRawValue * 100) : 0;
  const outputGain = Math.max(0, safeOutputValue - safeRawValue);
  const orderGain = Math.max(0, safeRewardGold - safeRawValue);
  const orderVsOutputGain = Math.max(0, safeRewardGold - safeOutputValue);
  const maxLedgerValue = Math.max(1, safeRawValue, safeOutputValue, safeRewardGold);
  const rawRatio = safeRawValue / maxLedgerValue;
  const outputRatio = safeOutputValue / maxLedgerValue;
  const orderRatio = safeRewardGold / maxLedgerValue;
  const safeRecipeName = recipeName || "Current recipe";
  const safeOutputLabel = outputLabel || outputItemId;
  const safeOrderTitle = orderTitle || order?.title || "First order";
  const keyBase = `${day}:${recipe.recipe_id}:${outputItemId}:${aromaSpec.orderId || "no_order"}:value_ledger`;

  return {
    key: firstOrderProfit ? `${keyBase}:first_order_profit` : keyBase,
    day,
    recipe,
    recipeName: safeRecipeName,
    outputItemId,
    outputLabel: safeOutputLabel,
    outputCount: safeOutputCount,
    orderId: aromaSpec.orderId || "",
    orderTitle: safeOrderTitle,
    ready: Boolean(aromaSpec.ready),
    rawValue: safeRawValue,
    outputValue: safeOutputValue,
    rewardGold: safeRewardGold,
    rewardFame: safeRewardFame,
    valueGain,
    orderPremium,
    valueLiftPercent,
    rawRatio,
    outputRatio,
    orderRatio,
    premiumLabel: safeRewardGold > safeRawValue ? `Order ${orderPremium.toFixed(1)}x` : "Order value",
    profitLabel: safeRewardGold > safeRawValue ? `Gain ${valueGain}` : "Relationship value",
    conclusion: safeRewardGold > safeRawValue ? "Crafting order chain wins" : "Order chain is relationship-led",
    inputText,
    inputTotals,
    title: "First order profit comparison - click",
    legacyTitle: "First pot value ledger - click",
    routeText: "Raw sale -> Output value -> Order return",
    headline: `Raw ${safeRawValue} -> Order ${safeRewardGold}`,
    detail: safeRewardGold > safeRawValue
      ? `This order beats raw sale by ${valueGain}.`
      : `${safeOrderTitle} is linked; fame and relationship value make up the gap.`,
    cta: "Go to order board manually",
    safety: "Focus only. No automatic craft, order delivery, stock spend, reward grant, or resource spend.",
    rect: { x: 382, y: 486, width: 350, height: 144 },
    anchor: { x: 520, y: 432 },
    accent: safeRewardGold > safeRawValue ? "#286f58" : "#b47d2f",
    soft: safeRewardGold > safeRawValue ? "rgba(202, 235, 210, 0.26)" : "rgba(246, 240, 182, 0.24)",
    steps: [
      { label: "Raw sale", value: `${safeRawValue}`, note: inputText || "Inputs" },
      { label: "Output gain", value: `+${outputGain}`, note: `${safeRecipeName} x${safeOutputCount}` },
      { label: "Order return", value: `${safeRewardGold}`, note: safeRewardFame ? `Fame +${safeRewardFame}` : "Commission reward" },
    ],
    orderGain,
    orderVsOutputGain,
  };
}

export function drawWorkshopOutputStorageRouteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.nodes?.length) return false;
  const { rect, anchor } = spec;
  const accent = spec.orderVisible
    ? spec.orderReady ? "#286f58" : "#8f5f3f"
    : "#4d91a6";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.8) * 2.2;
  const shimmer = reducedMotion ? 0.5 : (Math.sin(motion * 2.8) + 1) / 2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? `${accent}dd` : `${accent}66`;
  ctx.lineWidth = active ? 3 : 1.8;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 22);
  ctx.quadraticCurveTo(rect.x + rect.width - 54, cardY - 22, rect.x + rect.width - 34, cardY + 28);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.strokeStyle = active ? `${accent}ee` : `${accent}84`;
  ctx.lineWidth = active ? 2.7 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(190, 79, 55, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 15, cardY + 16, 58, 52, 16);
  ctx.fill();
  ctx.fillStyle = "#be4f37";
  ctx.font = "900 22px Microsoft YaHei";
  ctx.fillText("锅", rect.x + 34, cardY + 50);
  ctx.fillStyle = `rgba(255, 253, 245, ${0.48 + shimmer * 0.28})`;
  ctx.beginPath();
  ctx.arc(rect.x + 60, cardY + 29 - shimmer * 4, 5 + shimmer * 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 88, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 88, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.recipeName} · ${spec.outputItemName} x${spec.outputCount}`.slice(0, 38), rect.x + 88, cardY + 64);

  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 18 + index * 102;
    const nodeY = cardY + 84;
    ctx.fillStyle = `${node.accent}1b`;
    ctx.strokeStyle = `${node.accent}55`;
    ctx.lineWidth = active && index === 2 ? 1.9 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY - 9, 92, 26, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 14, nodeY + 4, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge, nodeX + 10, nodeY + 7);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 4), nodeX + 28, nodeY + 1);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 9), nodeX + 28, nodeY + 12);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, cardY + 13, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, cardY + 26);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 15, rect.width - 36, 11, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · ${spec.safety}`.slice(0, 54), rect.x + 26, cardY + rect.height - 7);
  ctx.restore();
  return true;
}

export function workshopOutputStorageRouteWorldSpecFromRuntimeWorld({
  width = 960,
  height = 640,
  day = 1,
  feedback = null,
  stock = 0,
  orderVisible = false,
  copy = null,
  safetyText = "Focus only. No automatic delivery, shop open, shelf placement, sale, further crafting, scheduling, inventory spend, reward grant, night change, or resource spend.",
} = {}) {
  if (!feedback?.outputItemId || Number(feedback.day || 0) !== Number(day || 0)) return null;
  const currentStock = Number(stock || 0);
  if (currentStock <= 0) return null;

  const hasVisibleOrder = Boolean(feedback.orderId && orderVisible);
  const safeCopy = copy || {};
  const cardWidth = 334;
  const cardHeight = 128;
  const x = Math.max(32, Math.min(width - cardWidth - 32, 318));
  const y = Math.max(250, Math.min(height - cardHeight - 32, 468));
  const nodes = Array.isArray(safeCopy.nodes) && safeCopy.nodes.length > 0
    ? safeCopy.nodes
    : [
      { key: "pot", badge: "POT", title: "Output", detail: `${feedback.outputItemName}x${feedback.outputCount}`, accent: "#be4f37" },
      { key: "stock", badge: "INV", title: "Stock", detail: `Stock ${currentStock}`, accent: "#b47d2f" },
      hasVisibleOrder
        ? { key: "order", badge: "ORD", title: feedback.orderReady ? "Ready" : "Linked", detail: feedback.orderTitle || "Order board", accent: feedback.orderReady ? "#286f58" : "#8f5f3f" }
        : { key: "shop", badge: "SHP", title: "Shop", detail: feedback.shopTagText || "Shelf", accent: "#4d91a6" },
    ];

  return {
    ...feedback,
    key: `${feedback.key}:${currentStock}:${hasVisibleOrder ? "order" : "shop"}:${feedback.orderReady ? 1 : 0}`,
    title: safeCopy.title || "Output storage route - click",
    headline: safeCopy.headline || `${feedback.outputItemName} is ready for shop stock`,
    detail: safeCopy.detail || `Current stock ${currentStock}; keep it for ${feedback.shopTagText || "shop shelf"} or continue prep.`,
    routeText: safeCopy.routeText || "Manual craft -> Stock in",
    safety: feedback.safety || safetyText,
    orderVisible: hasVisibleOrder,
    stock: currentStock,
    nodes,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 404, y: 470 },
  };
}

export function workshopOutputStorageRouteWorldAtCanvasPointWorld({
  px,
  py,
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

export function workshopToShopStockBridgeWorldSpecFromRuntimeWorld({
  width = 960,
  height = 640,
  day = 1,
  feedback = null,
  item = null,
  stock = 0,
  shopOpened = false,
  bridgeGood = null,
  shopTag = "",
  shopTagText = "",
  goodsEye = null,
  shelfPrep = null,
  itemName = (itemId) => itemId,
  safeNote = "Focus only. No automatic craft, shelf placement, shop open, customer action, sale, repricing, restock, order delivery, inventory spend, or resource spend.",
} = {}) {
  if (!feedback?.outputItemId || Number(feedback.day || 0) !== Number(day || 0)) return null;
  const currentStock = Number(stock || 0);
  if (!item || currentStock <= 0 || item.item_type === "seed" || String(item.sell_price_base || "0") === "0") return null;
  if (shopOpened || !bridgeGood) return null;

  const safeItemName = feedback.outputItemName || itemName(feedback.outputItemId);
  const safeShopTag = shopTag || feedback.shopTag || "food";
  const safeShopTagText = shopTagText || feedback.shopTagText || "Shop shelf";
  const goodsEyeMatches = goodsEye?.itemId === feedback.outputItemId;
  const shelfPrepMatches = shelfPrep?.itemId === feedback.outputItemId;
  const customerName = goodsEyeMatches
    ? goodsEye.customerName
    : shelfPrepMatches
      ? shelfPrep.customerName
      : "First passerby";
  const reason = goodsEyeMatches
    ? goodsEye.headline
    : shelfPrepMatches
      ? shelfPrep.openingExpectation
      : `${safeShopTagText} helps customers understand this output before opening.`;
  const routeText = "Stock in -> Polish shelf tag -> Door sees it";
  const cardWidth = 328;
  const cardHeight = 122;
  const x = Math.max(46, Math.min(width - cardWidth - 34, 120));
  const y = Math.max(318, Math.min(height - cardHeight - 32, 342));
  const doorSelector = goodsEye?.selector || shelfPrep?.selector || '[data-shop-board="display-diagnosis"]';
  const nodes = [
    {
      key: "stock",
      badge: "INV",
      title: "Stock in",
      detail: `${safeItemName} x${currentStock}`,
      accent: "#be4f37",
      selector: "#inventoryList",
    },
    {
      key: "ticket",
      badge: "TAG",
      title: "Shelf tag",
      detail: safeShopTagText,
      accent: "#b47d2f",
      selector: "#shopReport",
    },
    {
      key: "door",
      badge: "EYE",
      title: "Door sees",
      detail: customerName || "Passerby",
      accent: "#4d91a6",
      selector: doorSelector,
    },
  ];

  return {
    active: true,
    key: `${day}:${feedback.outputItemId}:${currentStock}:${safeShopTag}:${goodsEye?.mode || "bridge"}:${shelfPrep?.tone || "stock"}`,
    day,
    title: "Workshop to shop stock bridge - click",
    headline: `${safeItemName} can become front-door stock`,
    detail: `Stock ${currentStock} / ${safeShopTagText} / ${reason || "Move this output from the pot story to the shop door."}`,
    routeText,
    itemId: feedback.outputItemId,
    itemName: safeItemName,
    recipeId: feedback.recipeId || "",
    recipeName: feedback.recipeName || "Current recipe",
    stock: currentStock,
    shopTag: safeShopTag,
    shopTagText: safeShopTagText,
    customerName,
    reason,
    goodsEye,
    shelfPrep,
    nodes,
    safeNote,
    rect: { x, y, width: cardWidth, height: cardHeight },
    anchor: { x: 404, y: 470 },
    shopAnchor: { x: 154, y: 232 },
  };
}

export function drawWorkshopToShopStockBridgeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  focused = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  pointOnPolyline = (points = []) => points[0] || { x: 0, y: 0 },
  drawShopWeatherShelfGoodIcon = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.anchor || !spec?.shopAnchor || !spec?.nodes?.length) return false;
  const { rect, anchor, shopAnchor } = spec;
  const accent = focused ? "#286f58" : "#4d91a6";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.45) * 2;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = focused ? "rgba(40, 111, 88, 0.78)" : "rgba(77, 145, 166, 0.48)";
  ctx.lineWidth = focused ? 3.2 : 2;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 15;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y + 14);
  ctx.bezierCurveTo(rect.x - 18, cardY + rect.height + 18, rect.x + rect.width + 20, cardY - 20, shopAnchor.x, shopAnchor.y + 22);
  ctx.stroke();
  ctx.setLineDash([]);

  const beadCount = 7;
  for (let i = 0; i < beadCount; i += 1) {
    const t = reducedMotion ? i / Math.max(1, beadCount - 1) : (motion * 0.09 + i / beadCount) % 1;
    const p1 = pointOnPolyline([
      { x: anchor.x, y: anchor.y + 14 },
      { x: rect.x + 40, y: cardY + rect.height - 8 },
      { x: rect.x + rect.width - 42, y: cardY + 20 },
      { x: shopAnchor.x, y: shopAnchor.y + 22 },
    ], t);
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.82)" : "rgba(224, 182, 109, 0.74)";
    ctx.beginPath();
    ctx.roundRect(p1.x - 7, p1.y - 5, 14, 10, 3);
    ctx.fill();
    ctx.strokeStyle = "rgba(77, 145, 166, 0.36)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(244, 250, 238, 0.96)");
  ctx.strokeStyle = focused ? "rgba(40, 111, 88, 0.92)" : "rgba(77, 145, 166, 0.72)";
  ctx.lineWidth = focused ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 16, 58, 58, 16);
  ctx.fill();
  drawShopWeatherShelfGoodIcon(ctx, {
    itemId: spec.itemId,
    itemName: spec.itemName,
    count: spec.stock,
  }, rect.x + 24, cardY + 25, 38, {
    accent,
    missing: false,
    pulse: reducedMotion ? 0 : Math.sin(motion * 2.1) * 1.1,
  });
  ctx.fillStyle = accent;
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("备货桥", rect.x + 22, cardY + 84);

  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 86, cardY + 24);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 20), rect.x + 86, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.recipeName} · 库存 ${spec.stock} · ${spec.shopTagText}`.slice(0, 36), rect.x + 86, cardY + 65);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(`门口理由：${String(spec.reason || "").slice(0, 24)}`, rect.x + 86, cardY + 81);

  spec.nodes.forEach((node, index) => {
    const nodeX = rect.x + 18 + index * 101;
    const nodeY = cardY + 94;
    ctx.fillStyle = index === 2 ? `${node.accent}1c` : "rgba(255, 253, 245, 0.82)";
    ctx.strokeStyle = `${node.accent}4f`;
    ctx.lineWidth = focused && index === 2 ? 1.8 : 1.1;
    ctx.beginPath();
    ctx.roundRect(nodeX, nodeY, 91, 20, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = node.accent;
    ctx.beginPath();
    ctx.arc(nodeX + 12, nodeY + 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.badge, nodeX + 8, nodeY + 13);
    ctx.fillStyle = node.accent;
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 5), nodeX + 25, nodeY + 8);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(node.detail || "").slice(0, 8), nodeX + 25, nodeY + 17);
  });

  ctx.fillStyle = focused ? "rgba(40, 111, 88, 0.14)" : "rgba(202, 235, 210, 0.55)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, cardY + rect.height - 25, rect.width - 36, 17, 9);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(`${spec.routeText} · 可点定位`.slice(0, 38), rect.x + 28, cardY + rect.height - 13);

  if (!reducedMotion) {
    ctx.fillStyle = focused ? "rgba(246, 240, 182, 0.88)" : "rgba(246, 240, 182, 0.52)";
    for (let i = 0; i < 4; i += 1) {
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 42 + i * 8, cardY + 22 + Math.sin(motion * 2 + i) * 2.4, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}

export function workshopReadyOrderDispatchWorldSpecFromRuntimeWorld({
  day = 1,
  aromaSpec = null,
  order = null,
  deliverable = false,
  orderMatch = null,
  rewardText = "Order reward",
} = {}) {
  if (!aromaSpec?.ready || !aromaSpec.orderId) return null;
  if (!order || !deliverable) return null;

  return {
    key: `${day}:${aromaSpec.orderId}:${aromaSpec.outputLabel}`,
    day,
    order,
    orderId: aromaSpec.orderId,
    orderTitle: aromaSpec.orderTitle,
    outputLabel: aromaSpec.outputLabel,
    outputCount: Number(orderMatch?.outputCount || aromaSpec.aroma?.outputCount || 1),
    rewardText,
    path: aromaSpec.path,
    rect: { x: 522, y: 314, width: 250, height: 92 },
    title: "World output ready for order",
    headline: "Delivery cart is loaded",
    detail: `${aromaSpec.outputLabel} -> ${aromaSpec.orderTitle}`,
    routeLabel: "Delivery route",
    boardLabel: "Order board cashier",
    manualLabel: "Confirm, then deliver manually",
    safety: "Will not auto-deliver or consume stock",
    cta: "Output order - click",
  };
}

export function drawWorkshopReadyOrderDispatchWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  pointOnPolyline = (points = []) => points[0] || { x: 0, y: 0 },
} = {}) {
  if (!ctx || !spec?.rect || !spec?.path?.length) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.4) * 3;
  const travel = reducedMotion ? 0.74 : 0.58 + (Math.sin(motion * 0.8) + 1) * 0.17;
  const cart = pointOnPolyline(spec.path, Math.max(0.05, Math.min(0.95, travel)));

  ctx.save();
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.78)" : "rgba(40, 111, 88, 0.5)";
  ctx.lineWidth = active ? 4 : 3;
  ctx.setLineDash([10, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 22;
  ctx.beginPath();
  spec.path.forEach((point, index) => {
    const y = point.y - 34;
    if (index === 0) ctx.moveTo(point.x, y);
    else ctx.lineTo(point.x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = active ? "rgba(237, 243, 223, 0.95)" : "rgba(255, 253, 245, 0.88)";
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.82)" : "rgba(40, 111, 88, 0.42)";
  ctx.lineWidth = active ? 2.4 : 1.4;
  ctx.beginPath();
  ctx.roundRect(780, 330 + pulse * 0.18, 132, 34, 13);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(spec.boardLabel, 794, 348 + pulse * 0.18);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText("交单路线终点", 804, 360 + pulse * 0.18);

  for (let bead = 0; bead < 7; bead += 1) {
    const point = pointOnPolyline(spec.path, reducedMotion ? bead / 6 : (motion * 0.12 + bead / 7) % 1);
    ctx.fillStyle = bead % 2 ? "rgba(246, 240, 182, 0.78)" : "rgba(202, 235, 210, 0.72)";
    ctx.beginPath();
    ctx.arc(point.x, point.y - 34 + Math.sin(motion * 2 + bead) * 3, 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(23, 35, 29, 0.18)";
  ctx.beginPath();
  ctx.ellipse(cart.x + 8, cart.y + 16, 42, 9, -0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.beginPath();
  ctx.roundRect(cart.x - 26, cart.y - 14, 54, 26, 7);
  ctx.fill();
  ctx.fillStyle = "#e0b66d";
  ctx.beginPath();
  ctx.roundRect(cart.x - 18, cart.y - 26 + pulse * 0.15, 38, 18, 6);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.beginPath();
  ctx.arc(cart.x - 14, cart.y + 16, 6, 0, Math.PI * 2);
  ctx.arc(cart.x + 24, cart.y + 16, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.beginPath();
  ctx.roundRect(cart.x + 24, cart.y - 36 + pulse * 0.2, 36, 22, 7);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("可交", cart.x + 31, cart.y - 21 + pulse * 0.2);
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(cart.x - 48, cart.y + 24 + pulse * 0.12, 96, 20, 10);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText(spec.routeLabel, cart.x - 34, cart.y + 38 + pulse * 0.12);

  const { rect } = spec;
  drawCanvasCard(ctx, rect.x, rect.y + pulse * 0.45, rect.width, rect.height, "rgba(237, 243, 223, 0.94)");
  ctx.strokeStyle = active ? "rgba(40, 111, 88, 0.9)" : "rgba(40, 111, 88, 0.58)";
  ctx.lineWidth = active ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, rect.y + 1.5 + pulse * 0.45, rect.width - 3, rect.height - 3, 16);
  ctx.stroke();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.cta} · ${spec.headline}`.slice(0, 24), rect.x + 16, rect.y + 21 + pulse * 0.45);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(`${spec.outputLabel} x${spec.outputCount}`.slice(0, 14), rect.x + 16, rect.y + 43 + pulse * 0.45);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "10px Microsoft YaHei";
  ctx.fillText(`${spec.orderTitle} · 奖励 ${spec.rewardText}`.slice(0, 34), rect.x + 16, rect.y + 59 + pulse * 0.45);

  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + 68 + pulse * 0.45, rect.width - 32, 17, 9);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText(`1 ${spec.boardLabel}  2 ${spec.manualLabel} · ${spec.safety}`.slice(0, 42), rect.x + 24, rect.y + 80 + pulse * 0.45);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 50, rect.y + 13 + pulse * 0.45, 36, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("可点", rect.x + rect.width - 42, rect.y + 26 + pulse * 0.45);
  ctx.restore();
  return true;
}
