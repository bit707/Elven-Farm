const WEATHER_FIELD_SCENE_KEYS = new Set(["water_jars", "dry_cracks", "warm_cloth", "dew_leaf_bowls"]);
const WEATHER_SHOP_SCENE_KEYS = new Set(["rain_awning", "shade_cloth", "fog_sign", "frost_brazier", "clear_bench", "drying_rack"]);
const WEATHER_TOWN_SCENE_KEYS = new Set(["rain_footprints", "window_frost", "mist_lanterns", "cloud_queue"]);

export function weatherLifeVignetteNeedsFieldPlotWorld(sceneKey = "") {
  return WEATHER_FIELD_SCENE_KEYS.has(sceneKey);
}

export function weatherLifeVignetteTargetsWorld({
  spec = null,
} = {}) {
  if (!spec?.active) return [];
  return (spec.scenes || []).map((scene) => ({
    id: `weather_life_${scene.key}`,
    type: "weather_life_vignette",
    sceneKey: scene.key,
    label: scene.label,
    text: scene.text,
    weatherName: spec.weatherName,
    kind: spec.kind,
    rect: { x: scene.x - 62, y: scene.y - 56, width: 126, height: 124 },
  }));
}

export function weatherLifeVignetteFocusSpecWorld({
  target = null,
  weatherSummaryText = "",
  hasFieldPlot = false,
} = {}) {
  if (!target) return null;
  const sceneKey = target.sceneKey || "";
  let selector = "#termPanel";
  let fallbackSelector = "#termPanel";
  let panelGroup = "systems";
  let advice = "先看节气影响与天气数值，再决定今天把体力投到田地、旧铺还是设施。";

  if (WEATHER_SHOP_SCENE_KEYS.has(sceneKey)) {
    selector = "#shopReport";
    fallbackSelector = "#shopReport";
    panelGroup = "core";
    advice = sceneKey === "drying_rack"
      ? "这类晴日小景适合检查工坊产物和旧铺备货，先把能卖、能交单的货摆出来。"
      : "这类铺前小景适合先看定价、货架主题和顾客反馈，天气会影响来客停留感。";
  } else if (WEATHER_FIELD_SCENE_KEYS.has(sceneKey)) {
    selector = hasFieldPlot ? "#selectedPlotCard" : "#riskPanel";
    fallbackSelector = "#riskPanel";
    panelGroup = "core";
    advice = sceneKey === "warm_cloth"
      ? "霜雪天先看怕冷作物和节气风险，护住正在长的田块比盲目入夜更稳。"
      : sceneKey === "dew_leaf_bowls"
        ? "露天适合顺手检查水润田和清润作物，把今日水分优势接到田地成长上。"
        : "干热或大旱天先定位未浇田、灵池和节气风险，别让水分缺口拖慢整日节奏。";
  } else if (sceneKey === "pond_overflow") {
    selector = '[data-pond-action="catch"]';
    fallbackSelector = ".build-panel";
    panelGroup = "systems";
    advice = "雨天池边溢水说明灵池水位值得看一眼，能调水时先确认今夜要稳水、丰水还是歇水。";
  } else if (sceneKey === "herb_dew") {
    selector = '[data-build-id="build_alchemy_001"]';
    fallbackSelector = ".build-panel";
    panelGroup = "systems";
    advice = "药草挂露说明清润货和药草线更容易被看见，先确认药房、工坊和旧铺是否能接上这批货。";
  } else if (WEATHER_TOWN_SCENE_KEYS.has(sceneKey)) {
    selector = "#relationshipPanel";
    fallbackSelector = "#relationshipPanel";
    panelGroup = "story";
    advice = "这类镇上天气小景适合看镇民动线和今日可交谈对象，天气会改变他们停留的位置和口气。";
  }

  return {
    selector,
    fallbackSelector,
    label: `点选天气小景：${target.label}`,
    log: `${target.label} 已被点亮。${target.text} 今日${weatherSummaryText || (target.weatherName || "天气")}。${advice}`,
    panelGroup,
    missingTitle: `点选天气小景：${target.label}`,
    missingLog: "对应的天气提示面板暂时没有找到，先从节气影响、旧铺经营或灵田卡片确认今天的重点。",
  };
}

export function weatherLifeVignetteFocusTargetWorld({
  target = null,
  moodSpec = null,
  hasFieldPlot = false,
  signedPercentFor = null,
  multiplierTextFor = null,
} = {}) {
  const signedPercent = typeof signedPercentFor === "function" ? signedPercentFor : (value) => String(value ?? 0);
  const multiplierText = typeof multiplierTextFor === "function" ? multiplierTextFor : (value) => String(value ?? 0);
  const weatherSummaryText = moodSpec
    ? `${moodSpec.weatherName}：水分 ${signedPercent(moodSpec.waterBonus)}，成长 ${multiplierText(moodSpec.growthModifier)}${moodSpec.warning ? `，灾害 ${moodSpec.disaster}` : ""}`
    : "";
  return weatherLifeVignetteFocusSpecWorld({
    target,
    weatherSummaryText,
    hasFieldPlot,
  });
}

export function shopWeatherShelfWorldTargetsWorld({
  shelf = null,
  vignette = null,
} = {}) {
  if (!shelf?.active) return [];
  const targets = [{
    id: "shop_weather_shelf_sign",
    type: "shop_weather_shelf",
    label: shelf.topGoods.length > 0 ? "天气主推货签" : "天气缺货牌",
    rect: { x: 314, y: 158, width: 198, height: 96 },
  }];
  if (vignette?.active) {
    targets.push({
      id: "shop_weather_shelf_customer",
      type: "shop_weather_shelf_customer",
      label: vignette.label || "天气货签顾客小景",
      status: vignette.status,
      rect: { x: 516, y: 198, width: 184, height: 130 },
    });
  }
  return targets;
}

export function shopWeatherShelfFocusSpecWorld({
  target = null,
  shelf = null,
  vignette = null,
} = {}) {
  if (!target) return null;

  if (target.type === "shop_weather_shelf") {
    return {
      selector: '[data-shop-board="weather-shelf"]',
      fallbackSelector: "#shopReport",
      label: `点选旧铺：${target.label || "天气主推货签"}`,
      log: shelf?.active
        ? `${shelf.title} 已在旧铺经营面板高亮。${shelf.topGoods.length > 0 ? `今日主推 ${shelf.topGoods[0].itemName} x${shelf.topGoods[0].count}，顺着 ${shelf.weatherName} 的客意把头排货签擦亮。` : `缺少 ${shelf.missingTagText || "应季货"}，先从田地、工坊或商路补一件天气对口货。`}`
        : "天气主推货签暂时没有可用建议，先确认旧铺是否已经开张并有可售库存。",
      panelGroup: "core",
      missingTitle: "点选旧铺：天气主推货签",
      missingLog: "旧铺天气货架卡暂时没有找到，先确认旧铺经营面板是否可见。",
    };
  }

  if (target.type === "shop_weather_shelf_customer") {
    return {
      selector: '[data-shop-board="weather-shelf"]',
      fallbackSelector: "#shopReport",
      label: `点选旧铺：${vignette?.label || target.label || "天气货签顾客小景"}`,
      log: vignette?.active
        ? `${vignette.label}：${vignette.customerLabel}在${vignette.weatherName}看向${vignette.itemName}。${vignette.detail} ${vignette.status === "missing" ? "先补天气对口货，别让空位把客人劝走。" : vignette.status === "attracted" ? "这条脚步已经被主推接住，明天继续补厚头排库存。" : "客人已经停下，继续补厚库存或给出价格理由。"}`
        : "天气货签顾客小景暂时没有可复盘的脚步，先确认旧铺天气货签和当天库存。",
      panelGroup: "core",
      missingTitle: "点选旧铺：天气货签顾客小景",
      missingLog: "旧铺天气货架卡暂时没有找到，先确认旧铺经营面板是否可见。",
    };
  }

  return null;
}

export function shopWeatherShelfFocusTargetWorld({
  target = null,
  shelf = null,
  vignette = null,
} = {}) {
  return shopWeatherShelfFocusSpecWorld({
    target,
    shelf,
    vignette,
  });
}
