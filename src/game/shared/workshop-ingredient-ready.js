export function workshopIngredientReadyCandidateData({
  recipes = [],
  recipePreviewSpec = () => null,
  selectedRecipeId = "",
  inventory = {},
} = {}) {
  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const stock = inventory && typeof inventory === "object" ? inventory : {};
  const candidates = safeRecipes
    .map((recipe) => {
      const preview = recipePreviewSpec(recipe);
      if (!preview?.craftable) return null;
      const orderScore = preview.orderMatch?.ready ? 92 : preview.orderMatch ? 58 : 0;
      const selectedScore = recipe.recipe_id === selectedRecipeId ? 28 : 0;
      const firstScore = preview.firstAroma ? 80 : 0;
      const valueScore = Math.min(42, Math.max(0, Number(preview.valueGain || 0)) / 4);
      const outputStock = Number(stock[preview.outputItemId] || 0);
      return {
        recipe,
        preview,
        score: firstScore + orderScore + selectedScore + valueScore - Math.min(18, outputStock * 2),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.preview.recipeName.localeCompare(b.preview.recipeName, "zh-Hans-CN"));
  return candidates[0] || null;
}

export function workshopIngredientReadyWorldCopyData({
  candidate = null,
  inventory = {},
  itemName = (itemId) => itemId,
  shopTagsForItem = () => [],
  ecologySummary = null,
  prioritizeShopTag = () => "",
  shopTagLabel = (tag) => tag || "",
  recipeInputs = () => [],
  orderMatchSafe = (match) => match,
  routeGuideText = "原料已齐 -> 手动加工 -> 出锅去向",
  copySpec = null,
} = {}) {
  if (!candidate?.preview?.craftable || !candidate?.recipe || typeof copySpec !== "function") return null;
  const { recipe, preview } = candidate;
  const stock = inventory && typeof inventory === "object" ? inventory : {};
  const orderMatch = orderMatchSafe(preview.orderMatch);
  const shopTags = shopTagsForItem(preview.outputItemId, ecologySummary);
  const shopTag = prioritizeShopTag(shopTags, new Map(), "food");
  const shopTagText = shopTagLabel(shopTag);
  const inputItems = recipeInputs(recipe).slice(0, 3).map(({ itemId, count }) => ({
    itemId,
    name: itemName(itemId),
    count: Number(count || 1),
    have: Number(stock[itemId] || 0),
  }));
  return copySpec({
    candidate,
    orderMatch,
    shopTagText,
    routeGuideText,
    inputItems,
  });
}

export function workshopIngredientReadyWorldSpecData({
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
  safetyText = "",
  copy = null,
  specFromRuntime = null,
} = {}) {
  if (typeof specFromRuntime !== "function") return null;
  return specFromRuntime({
    width,
    height,
    day,
    activeCutscene,
    activeDialogueLength,
    workshopQueueLength,
    craftCompleted,
    candidate,
    stateInventory,
    itemName,
    shopTagsForItem,
    ecologySummary,
    prioritizeShopTag,
    shopTagLabel,
    recipeInputs,
    orderMatchSafe,
    safetyText,
    copy,
  });
}

export function workshopIngredientReadyWorldAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function workshopIngredientReadyWorldFocusData(spec = null, day = 1) {
  if (!spec?.recipeId) return null;
  return {
    focus: { key: spec.key, day, recipeId: spec.recipeId },
    selectedRecipeId: spec.recipeId,
    cue: "对话翻页",
    target: {
      selector: "#craftButton",
      fallbackSelector: "#recipeSelect",
      label: "点选原料齐火候签",
      log: `${spec.recipeName} 已切到加工栏。路线：${spec.routeText}。${spec.detail} ${spec.safety}。`,
      panelGroup: "core",
      missingTitle: "原料齐火候签",
      missingLog: `${spec.recipeName} 已选中，但加工按钮暂时没有找到。先看配方栏确认原料与设备；${spec.safety}。`,
    },
  };
}
