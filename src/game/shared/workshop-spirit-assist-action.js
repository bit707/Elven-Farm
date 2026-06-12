export function workshopSpiritAssistActionWorldSpecData({
  width = 960,
  height = 640,
  day = 1,
  helpers = [],
  lineSpec = null,
  sceneSpec = null,
  selectedRecipeId = "",
  availableRecipes = [],
  speedText = "",
  safetyText = "",
  copyForStage = () => null,
  panelCopyForRuntime = () => null,
  specFromRuntime = null,
} = {}) {
  const safeHelpers = Array.isArray(helpers) ? helpers : [];
  const activeJob = lineSpec?.activeJob || null;
  if (safeHelpers.length === 0 || typeof specFromRuntime !== "function") return null;
  const stageProps = sceneSpec?.stageProps || [];
  const activeStage = activeJob
    ? stageProps.find((prop) => prop.active) || stageProps[Math.max(0, Math.min(stageProps.length - 1, Number(activeJob.activeStageIndex || 0)))]
    : stageProps.find((prop) => prop.key === "heat") || stageProps[2] || { key: "idle", label: "Standby", x: 618, y: 502 };
  const helper = safeHelpers[0];
  const helperNames = safeHelpers.slice(0, 2).map((spirit) => spirit.name).join(" / ");
  const helperText = safeHelpers.length > 2 ? `${helperNames} +${safeHelpers.length}` : helperNames || helper.name || "Helper";
  const stageKey = activeJob ? activeStage?.key || "heat" : "idle";
  const copy = copyForStage(stageKey, helper.name || "Helper", activeJob);
  const orderMatch = activeJob?.orderMatch || null;
  const recipeId = activeJob?.recipeId || selectedRecipeId || availableRecipes[0]?.recipe_id || "";
  const panelCopy = panelCopyForRuntime({
    helper,
    helperText,
    activeJob,
    activeStage,
    copy,
    orderMatch,
  });
  return specFromRuntime({
    width,
    height,
    day,
    helpers: safeHelpers,
    activeJob,
    activeStage,
    helper,
    helperText,
    stageKey,
    copy,
    orderMatch,
    speedText,
    recipeId,
    safetyText,
    panelCopy,
  });
}

export function workshopSpiritAssistActionWorldAtPointData({
  px = 0,
  py = 0,
  spec = null,
  atPoint = null,
} = {}) {
  if (typeof atPoint !== "function") return null;
  return atPoint({ px, py, spec });
}

export function workshopSpiritAssistActionFocusData(spec = null, day = 1, selectorDataValue = (value) => value) {
  if (!spec?.helperId) return null;
  const spiritSelector = `[data-spirit-id="${selectorDataValue(spec.helperId)}"]`;
  return {
    worldFocus: {
      key: spec.key,
      day,
      spiritId: spec.helperId,
      recipeId: spec.recipeId || "",
    },
    canvasSpiritCareFocus: {
      spiritId: spec.helperId,
      day,
      seasonal: {
        label: "精怪帮火小动作",
        detail: spec.headline,
        effect: `${spec.detail} ${spec.summary}`,
      },
    },
    spiritFocusTarget: {
      selector: spiritSelector,
      spiritName: spec.helperName,
    },
    compassTarget: {
      selector: spec.active ? "[data-workshop-queue]" : spiritSelector,
      fallbackSelector: spec.active ? "#recipeSelect" : "#spiritList",
      panelGroup: spec.active ? "systems" : "core",
      label: "点选精怪帮火小动作",
      log: `${spec.headline}：${spec.actionText}。${spec.detail} 当前 ${spec.stageLabel} 路 帮工 ${spec.helperCount} 路 ${spec.speedText}。${spec.safety}`,
      missingTitle: "精怪帮火小动作",
      missingLog: `已读到 ${spec.helperName} 的工坊小动作，但面板暂时没有找到。${spec.safety}`,
    },
  };
}
