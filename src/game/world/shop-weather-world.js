export function shopSeasonalDoorstepSceneSpecWorld({
  opening = null,
  term = null,
  weather = null,
  reputationStage = null,
  doorstepScene = null,
  firstShopOpeningDone = false,
  shopDone = false,
  localize = (_key, fallback = "") => fallback,
  splitTags = () => [],
  shopTagLabel = (tag) => tag || "",
  signedPercent = (value) => `${Number(value || 0) >= 0 ? "+" : ""}${Math.round(Number(value || 0) * 100)}%`,
  multiplierText = (value) => `x${Number(value || 1).toFixed(2)}`,
} = {}) {
  const safeOpening = opening || {};
  const opened = safeOpening.opened || safeOpening.lastSession || firstShopOpeningDone || shopDone;
  if (!opened && !(reputationStage?.progressCount > 0)) return null;
  const termName = localize(term?.term_name_key, term?.term_id || "节气");
  const weatherName = localize(weather?.weather_name_key, weather?.weather_id || "天气");
  const marketTags = splitTags(term?.market_bonus_tags || "");
  const marketLabel = marketTags[0] ? shopTagLabel(marketTags[0]) : (reputationStage?.hotTagLabel || "应季货");
  const weatherId = weather?.weather_id || "";
  const disaster = weather?.disaster_tag || "none";
  const waterBonus = Number(weather?.water_bonus || 0);
  const growthModifier = Number(weather?.crop_growth_modifier || 1);
  const progress = Number(reputationStage?.progressCount || 0);
  const crowd = Number(doorstepScene?.crowdBoost || 0) + Math.max(0, Math.min(3, progress - 2));
  const byWeather = (() => {
    if (weatherId.includes("rain") || disaster === "waterlog") {
      return {
        tone: disaster === "waterlog" ? "rain-warn" : "rain",
        object: disaster === "waterlog" ? "垫高货箱" : "油纸雨棚",
        headline: disaster === "waterlog" ? "雨脚重，旧铺把货箱垫高，熟客进门先抖一抖伞。" : "雨声落在旧铺檐下，油纸棚把顺路客留住了半步。",
        detail: `水分 ${signedPercent(waterBonus)}，今日适合把${marketLabel}摆到干爽处。`,
        bubble: disaster === "waterlog" ? "先垫货箱" : "雨棚留客",
      };
    }
    if (weatherId.includes("hot") || weatherId.includes("dry") || disaster === "heat" || disaster === "drought") {
      return {
        tone: disaster === "drought" ? "heat-warn" : "heat",
        object: disaster === "drought" ? "井水陶盆" : "遮阳竹帘",
        headline: disaster === "drought" ? "热风压着街口，旧铺门边摆了井水陶盆，客人先缓一口气。" : "日头晒到招牌上，竹帘下的货签反倒更显眼。",
        detail: `成长倍率 ${multiplierText(growthModifier)}，今天要防断水，也要稳住${marketLabel}备货。`,
        bubble: disaster === "drought" ? "门前备水" : "竹帘挡晒",
      };
    }
    if (weatherId.includes("mist") || disaster === "mist") {
      return {
        tone: "mist",
        object: "雾灯货签",
        headline: "薄雾贴着青石路走，旧铺把货签挂到灯下，远处也能认得门。",
        detail: `${termName}的雾气让脚步慢下来，适合让${marketLabel}多一点故事味。`,
        bubble: "雾灯认门",
      };
    }
    if (weatherId.includes("frost") || weatherId.includes("snow") || weatherId.includes("cold") || disaster.includes("snow") || disaster === "frost" || disaster === "cold") {
      return {
        tone: disaster === "frost" ? "cold-warn" : "cold",
        object: disaster === "frost" ? "防霜布" : "暖炉小凳",
        headline: disaster === "frost" ? "霜气爬上门槛，旧铺先给怕冷的货盖上一层布。" : "冷风过街，旧铺门前的小炉火让人愿意停下来问一句。",
        detail: `天气偏冷，${marketLabel}要摆得暖一点，客人也会更愿意多看一眼。`,
        bubble: disaster === "frost" ? "盖布防霜" : "炉火留步",
      };
    }
    if (weatherId.includes("dew")) {
      return {
        tone: "dew",
        object: "晨露小碟",
        headline: "晨露还挂在门前草叶上，旧铺把清亮的小碟摆在货签旁。",
        detail: `露气温和，${marketLabel}可以借一点清晨的鲜亮。`,
        bubble: "晨露映货",
      };
    }
    return {
      tone: "clear",
      object: "节气货签",
      headline: `${termName}天色清稳，旧铺把${marketLabel}货签重新擦亮，门口看起来更像一天的起点。`,
      detail: `天气 ${weatherName}，水分 ${signedPercent(waterBonus)}，适合把当前节气偏好的货摆到头排。`,
      bubble: "货签擦亮",
    };
  })();
  const heatLabel = crowd >= 4 ? "人气很旺" : crowd >= 2 ? "脚步渐多" : progress >= 1 ? "有人认门" : "刚挂起牌";
  return {
    active: true,
    ...byWeather,
    title: `${termName}门口小景 · ${byWeather.object}`,
    termName,
    weatherName,
    marketLabel,
    marketTags,
    heatLabel,
    crowd,
    progress,
    metricsText: reputationStage?.metricsText || "",
    summary: `${byWeather.object} · ${weatherName} · ${heatLabel}`,
  };
}

export function shopWeatherCustomerReactionSpecWorld({
  opening = null,
  weatherMood = null,
  seasonalDoorstep = null,
  shopReportCount = 0,
  shopDone = false,
} = {}) {
  const safeOpening = opening || {};
  const safeWeatherMood = weatherMood || {};
  const weatherName = safeWeatherMood.weatherName;
  const liveFocus = safeOpening.liveFocus || safeOpening.lastSession?.liveFocus || null;
  const hotTagLabel = liveFocus?.hotTagLabel || seasonalDoorstep?.marketLabel || "应季货";
  const opened = Boolean(safeOpening.opened || safeOpening.lastSession || Number(shopReportCount || 0) > 0 || shopDone);
  if (!opened && !seasonalDoorstep?.active) return null;
  const byKind = {
    "soft-rain": {
      tone: "rain",
      label: "雨棚等伞客",
      customerLabel: "避雨客",
      bubble: "先躲会雨，再看货。",
      detail: `雨天脚步会在檐下慢下来，把${hotTagLabel}摆到干爽处更能留人。`,
      advice: "雨棚留客，适合卖清润货、热汤或能顺手带走的小件。",
      accent: "#4d91a6",
      tagHint: "清润/热汤",
    },
    "storm-rain": {
      tone: "warn",
      label: "暴雨压价脚步",
      customerLabel: "湿衣客",
      bubble: "雨太重，想快点买完。",
      detail: `暴雨天顾客更急，${hotTagLabel}要摆得清楚，价格理由要一眼看懂。`,
      advice: "重雨缩短停留，优先摆刚需、热食和防潮货。",
      accent: "#4d91a6",
      tagHint: "刚需/防潮",
    },
    mist: {
      tone: "mid",
      label: "雾灯认门客",
      customerLabel: "雾里客",
      bubble: "这盏灯下像有好货。",
      detail: `雾天脚步慢，适合让${hotTagLabel}多一点故事味和招牌记忆。`,
      advice: "雾天适合陈列稀奇货、礼物和带传闻的商品。",
      accent: "#8f5f3f",
      tagHint: "稀奇/礼物",
    },
    "hot-wind": {
      tone: "warn",
      label: "暑天讨凉饮",
      customerLabel: "汗巾客",
      bubble: "有凉口的吗？",
      detail: `热风天顾客更挑清爽口，${hotTagLabel}若偏厚重，容易多问价。`,
      advice: "暑天优先摆清润、饮品、水生货，少把燥热货放头排。",
      accent: "#be4f37",
      tagHint: "清凉/饮品",
    },
    drought: {
      tone: "warn",
      label: "旱天问水货",
      customerLabel: "井边客",
      bubble: "能解渴、能顶用吗？",
      detail: `大旱天门口先问水和实用货，${hotTagLabel}要能说清用途。`,
      advice: "大旱优先摆水润、救急、耐放货，别只摆好看的礼货。",
      accent: "#be4f37",
      tagHint: "水润/救急",
    },
    frost: {
      tone: "mid",
      label: "霜天围炉问热食",
      customerLabel: "搓手客",
      bubble: "有没有热乎的？",
      detail: `霜天顾客会往火盆边靠，${hotTagLabel}若带温补感更容易被问到。`,
      advice: "霜天适合热汤、温补、炉边小食和防寒用品。",
      accent: "#4d91a6",
      tagHint: "温补/热食",
    },
    snow: {
      tone: "mid",
      label: "雪天围炉客",
      customerLabel: "雪靴客",
      bubble: "炉边这排看着暖。",
      detail: `雪天停留更靠近火光，把${hotTagLabel}摆到炉边会更像顺手买。`,
      advice: "雪天适合暖食、节礼和能带回家的成套货。",
      accent: "#4d91a6",
      tagHint: "暖食/节礼",
    },
    dew: {
      tone: "good",
      label: "晨露看鲜客",
      customerLabel: "早市客",
      bubble: "这批看着新鲜。",
      detail: `露天让鲜货更好看，${hotTagLabel}摆到头排会更容易形成第一眼好感。`,
      advice: "露天适合鲜食、药草、清润小食和早市货。",
      accent: "#286f58",
      tagHint: "鲜货/药草",
    },
    cloudy: {
      tone: "mid",
      label: "云影慢逛客",
      customerLabel: "慢逛客",
      bubble: "今天不急，慢慢看。",
      detail: `阴云天脚步不急，适合让${hotTagLabel}靠故事、组合和价格理由留住人。`,
      advice: "阴天适合做组合陈列、慢卖高价货和熟客推荐。",
      accent: "#5d6f65",
      tagHint: "组合/熟客",
    },
    clear: {
      tone: "good",
      label: "晴日驻足客",
      customerLabel: "赶集客",
      bubble: "天好，顺路看看。",
      detail: `晴天门口视线清楚，${hotTagLabel}货签擦亮后更容易被第一眼看见。`,
      advice: "晴天适合晒货、热卖牌和明确主题陈列。",
      accent: "#b47d2f",
      tagHint: "热卖/主题",
    },
  };
  const profile = byKind[safeWeatherMood.kind] || byKind.clear;
  const heatBoost = profile.tone === "good" ? 1 : profile.tone === "warn" ? -1 : 0;
  return {
    active: true,
    kind: safeWeatherMood.kind,
    weatherName,
    waterBonus: safeWeatherMood.waterBonus,
    growthModifier: safeWeatherMood.growthModifier,
    disaster: safeWeatherMood.disaster,
    warning: safeWeatherMood.warning,
    hotTagLabel,
    heatBoost,
    title: `${weatherName}顾客天气反应`,
    ...profile,
    summary: `${profile.label}：${profile.detail}`,
  };
}
