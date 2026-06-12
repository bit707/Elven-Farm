export function workshopOpeningValueRuntimeData({
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
  shopTagLabel = (tag) => tag || "",
} = {}) {
  const activeJob = lineSpec?.activeJob || null;
  const safeRecipes = Array.isArray(recipes) ? recipes : [];
  const safeAvailableRecipes = Array.isArray(availableRecipes) ? availableRecipes : [];
  const activeRecipe = activeJob
    ? safeRecipes.find((recipe) => recipe.recipe_id === activeJob.recipeId)
    : null;
  const selectedRecipe = safeRecipes.find((recipe) => recipe.recipe_id === selectedRecipeId) || safeAvailableRecipes[0] || null;
  const recipe = activeRecipe || selectedRecipe;
  const preview = recipe ? recipePreviewSpec(recipe) : null;
  const outputItemId = activeJob?.outputItemId || preview?.outputItemId || "";
  const outputCount = Number(activeJob?.outputCount || preview?.outputCount || 1);
  const outputName = outputItemId ? itemName(outputItemId) : "";
  const orderMatch = outputItemId
    ? activeJob?.orderMatch || preview?.orderMatch || orderMatchSpec(outputItemId, outputCount)
    : null;
  const shopTags = outputItemId ? shopTagsForItem(outputItemId, ecologySummary) : [];
  const shopTag = prioritizeShopTag(shopTags, new Map(), "food");
  const shopTagText = shopTagLabel(shopTag);
  return {
    activeJob,
    activeRecipe,
    selectedRecipe,
    recipe,
    preview,
    outputItemId,
    outputCount,
    outputName,
    orderMatch,
    shopTag,
    shopTagText,
  };
}

export function workshopOpeningValueWorldCopyData({
  runtime = null,
  copySpec = null,
} = {}) {
  if (!runtime || typeof copySpec !== "function") return null;
  return copySpec({
    recipe: runtime.recipe,
    preview: runtime.preview,
    activeJob: runtime.activeJob,
    orderMatch: runtime.orderMatch,
    outputName: runtime.outputName,
    shopTagText: runtime.shopTagText,
  });
}

export function workshopOpeningValueWorldSpecData({
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
  shopTagLabel = (tag) => tag || "",
  copy = null,
  specFromRuntime = null,
} = {}) {
  if (typeof specFromRuntime !== "function") return null;
  return specFromRuntime({
    width,
    height,
    day,
    lineSpec,
    recipes,
    selectedRecipeId,
    availableRecipes,
    recipePreviewSpec,
    itemName,
    orderMatchSpec,
    shopTagsForItem,
    ecologySummary,
    prioritizeShopTag,
    shopTagLabel,
    copy,
  });
}

export function workshopOpeningValueWorldAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function workshopOpeningValueWorldFocusData(spec = null, day = 1) {
  if (!spec?.recipeId) return null;
  return {
    focus: {
      key: spec.key,
      day,
      recipeId: spec.recipeId,
      orderId: spec.orderId || "",
    },
    cue: "对话翻页",
    log: {
      title: "点选工坊开锅价值牌",
      message: `${spec.recipeName}：${spec.reason} 增值账 ${spec.rawValue} -> ${spec.outputValue}${spec.orderReward ? ` -> ${spec.orderReward}` : ""}。${spec.safety}。`,
    },
    recipeId: spec.recipeId,
    orderId: spec.orderId || "",
    shopTag: spec.shopTag,
    outputItemId: spec.outputItemId,
  };
}
