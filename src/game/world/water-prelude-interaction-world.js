import { selectorDataValue } from "../shared/selectors.js";

function noteTitle(title = "") {
  return String(title || "").replace(" · 可点", "");
}

function addNoteTarget(targets, spec, type, extra = {}) {
  if (!spec) return;
  targets.push({
    id: spec.id,
    type,
    label: spec.title,
    ...extra,
    rect: spec.rect,
  });
}

export function waterPreludeInteractionTargetsWorld({
  lingqinDishRouteNote = null,
  qinghePondBridgeNote = null,
  qingheWaterTasteNote = null,
  pondOvernightNote = null,
  pondFirstCatchNote = null,
  qingboIngredientTriadNote = null,
  qingboDishRouteNote = null,
} = {}) {
  const targets = [];

  addNoteTarget(targets, lingqinDishRouteNote, "lingqin_dish_route_note", {
    orderReady: lingqinDishRouteNote?.orderReady,
  });
  addNoteTarget(targets, qinghePondBridgeNote, "qinghe_pond_bridge_note", {
    accepted: qinghePondBridgeNote?.accepted,
  });
  addNoteTarget(targets, qingheWaterTasteNote, "qinghe_water_taste_note", {
    questId: qingheWaterTasteNote?.questId,
    buildingId: qingheWaterTasteNote?.buildingId,
  });
  addNoteTarget(targets, pondOvernightNote, "pond_overnight_note", {
    ready: pondOvernightNote?.ready,
  });
  addNoteTarget(targets, pondFirstCatchNote, "pond_first_catch_note", {
    ready: pondFirstCatchNote?.ready,
  });
  addNoteTarget(targets, qingboIngredientTriadNote, "qingbo_ingredient_triad_note", {
    ready: qingboIngredientTriadNote?.readyToCraft,
  });
  addNoteTarget(targets, qingboDishRouteNote, "qingbo_dish_route_note", {
    phase: qingboDishRouteNote?.type,
    ready: Boolean(qingboDishRouteNote?.readyToCraft || qingboDishRouteNote?.type === "shop"),
  });

  return targets;
}

export function qingheWaterTasteFocusSpecWorld({
  spec = null,
  buildingCanBuild = false,
  questTitleText = "",
} = {}) {
  if (!spec) return null;
  const title = noteTitle(spec.title);
  const selector = spec.accepted
    ? `[data-build-id="${selectorDataValue(spec.buildingId)}"]`
    : `[data-side-quest-id="${selectorDataValue(spec.questId)}"]`;
  return {
    selector,
    fallbackSelector: spec.accepted ? ".build-panel" : ".mission-panel",
    label: `点选试水笺：${title}`,
    log: spec.accepted
      ? `${spec.questTitle} 已把 ${spec.buildingName} 定位到建造面板。${buildingCanBuild ? "材料已齐，可以直接动工，让旧池塘吃上第一口活水。" : `先补齐 ${spec.buildCostText}，再建灵池浅塘。`}建成后接 ${spec.secondStepText}，再把清波鱼脍做成旧铺水鲜。`
      : `${title} 已把 ${questTitleText || "青禾灵池线"} 定位到任务面板。清口单之后，青禾的水路会从新渠接到旧池：先承接支线，再建 ${spec.buildingName}，最后试第一网灵鱼。`,
    panelGroup: spec.accepted ? "systems" : "core",
    missingTitle: "点选试水笺：青禾灵池线",
    missingLog: "青禾支线卡或灵池建造卡暂时没有找到，先从任务面板、关系面板或建造面板确认青禾的池塘线。",
  };
}

export function pondFirstCatchFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  const title = noteTitle(spec.title);
  return {
    selector: '[data-pond-action="catch"]',
    fallbackSelector: ".build-panel",
    label: `点选灵池：${title}`,
    log: spec.ready
      ? `${title} 已把灵池试网按钮高亮。${spec.hasNet ? "引水鱼网已经备好，第一网会多带回一尾。" : "现在可以先用竹筛试网，后续再备引水鱼网提高回鱼。"}捞起 ${spec.fishName} 后，会继续接到清波鱼脍配方和水鲜上架。`
      : `${title} 已把灵池卡高亮。池口今天还没聚鱼，等明天水面回纹后再试第一网；下一步会接 ${spec.routeText}。`,
    panelGroup: "systems",
    missingTitle: "点选灵池：第一网",
    missingLog: "灵池试网按钮暂时没有找到，先确认系统深挖分组和建造面板是否可见。",
  };
}

export function qingboDishRouteFocusSpecWorld({ spec = null } = {}) {
  if (!spec) return null;
  const title = noteTitle(spec.title);
  const selector = spec.type === "reward"
    ? `[data-side-quest-id="${selectorDataValue("quest_side_0205_qinghe_pond")}"]`
    : spec.type === "shop"
      ? "#shopReport"
      : "#recipeSelect";
  const fallbackSelector = spec.type === "reward" ? ".mission-panel" : spec.type === "shop" ? "#shopReport" : ".build-panel";
  return {
    selector,
    fallbackSelector,
    label: `点选水鲜：${title}`,
    log: spec.type === "reward"
      ? `${title} 已把青禾灵池支线定位到任务面板。第一尾灵鱼已经回池，先收束任务领取 ${spec.recipeName} 配方，再把灵鱼、露珠芹和净水接上案板。`
      : spec.type === "shop"
        ? `${spec.dishName} 已在旧铺货路里高亮。库存 ${spec.dishCount}，基准价 ${spec.price} 灵石；开铺后第一位水鲜顾客会把这道菜从“能做”变成真正的水鲜招牌。`
        : spec.readyToCraft
          ? `${spec.recipeName} 已切到加工栏，原料已齐。先做出第一盘 ${spec.dishName}，再把它留给旧铺验证水鲜首卖。`
          : `${spec.recipeName} 已切到加工栏。当前还差 ${spec.missingText || "几味水鲜料"}；补齐后就能做第一盘 ${spec.dishName}。`,
    panelGroup: spec.type === "shop" ? "core" : spec.type === "reward" ? "core" : "systems",
    missingTitle: "点选水鲜：清波鱼脍",
    missingLog: "对应的任务、配方或旧铺面板暂时没有找到，先确认核心试玩和系统深挖分组是否可见。",
  };
}
