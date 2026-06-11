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

function shopWeatherShelfProfileWorld(kind = "clear") {
  const profiles = {
    "soft-rain": {
      title: "雨棚天气主推货",
      tags: ["refreshing", "water_food", "clean_food", "food", "staple", "portable_food", "drink"],
      missingTags: ["refreshing", "food", "portable_food"],
      reason: "避雨客停得住，既会问清润小食，也会顺手带走热汤和路粮。",
      actionText: "清润货放干爽头排，热汤和纸包路粮靠近檐下货签。",
    },
    "storm-rain": {
      title: "暴雨刚需货架",
      tags: ["staple", "portable_food", "relief", "medicine", "herb", "warming", "food"],
      missingTags: ["staple", "portable_food", "medicine"],
      reason: "暴雨天顾客不愿久站，刚需、药草和能立刻带走的东西最容易成交。",
      actionText: "把刚需货集中成一排，价签写清用途，减少顾客犹豫。",
    },
    mist: {
      title: "雾灯故事货架",
      tags: ["gift", "premium", "festival", "route_rare", "spirit_crafted", "ecology_product", "clean_food"],
      missingTags: ["gift", "premium", "route_rare"],
      reason: "雾天适合慢逛，带传闻、礼性和精怪手作感的货更容易被多看一眼。",
      actionText: "稀奇货配一张故事货签，礼品和净食放在雾灯照得到的位置。",
    },
    "hot-wind": {
      title: "暑风清凉货架",
      tags: ["refreshing", "water_food", "food_cold", "clean_food", "cooling", "drink", "fresh_food"],
      missingTags: ["refreshing", "water_food", "drink"],
      reason: "热风天顾客先问清爽口，水生货、凉口菜和饮品会比厚重热食更亮眼。",
      actionText: "把清凉标签写大，头排避开燥热货，先卖能解暑的这一格。",
    },
    drought: {
      title: "旱天水润救急货",
      tags: ["water", "water_food", "refreshing", "relief", "portable_supply", "drink", "staple"],
      missingTags: ["water_food", "relief", "portable_supply"],
      reason: "旱天顾客会先问水和顶用，水润、救急、耐放货更像真正能帮上忙。",
      actionText: "水润货放第一格，旁边补耐放路粮，别只摆好看的礼货。",
    },
    frost: {
      title: "霜天炉边暖货",
      tags: ["warming", "food", "staple", "recover_sp", "medicine", "herb", "fire_food"],
      missingTags: ["warming", "staple", "medicine"],
      reason: "霜天顾客会往火盆边靠，温补、热汤和稳身药草更容易被问价。",
      actionText: "暖货靠炉边陈列，热食配温补标签，药草放在第二排稳住客心。",
    },
    snow: {
      title: "雪天归家货架",
      tags: ["warming", "food", "staple", "festival", "gift", "premium", "recover_sp"],
      missingTags: ["warming", "staple", "gift"],
      reason: "雪天顾客想带点暖东西回家，成套暖食、节礼和主食更容易连带成交。",
      actionText: "暖食做主推，旁边搭一件节礼，像一份能带回家的小包。",
    },
    dew: {
      title: "晨露鲜货头排",
      tags: ["fresh_food", "vegetable", "herb", "clean_food", "refreshing", "medicine", "crop"],
      missingTags: ["fresh_food", "herb", "refreshing"],
      reason: "晨露会让鲜货显得刚摘下，鲜食、药草和清润小食最有早市感。",
      actionText: "鲜货擦亮放头排，药草和清润食物贴上“今早新收”的货签。",
    },
    cloudy: {
      title: "阴天慢逛组合货",
      tags: ["premium", "gift", "festival", "staple", "fresh_food", "ecology_product", "spirit_crafted"],
      missingTags: ["premium", "gift", "staple"],
      reason: "阴天脚步不急，顾客愿意比较组合、价格理由和熟客推荐。",
      actionText: "做一组高低搭配：一件招牌货配一件平价耐用货。",
    },
    clear: {
      title: "晴日热卖头牌",
      tags: ["food", "fresh_food", "vegetable", "gift", "premium", "ecology_product", "spirit_crafted"],
      missingTags: ["food", "fresh_food", "gift"],
      reason: "晴天视线清楚，最适合把主题明确、卖相干净的货推成今日招牌。",
      actionText: "主推货签写清楚，旁边补同标签小货，让顾客一眼知道今天卖什么。",
    },
  };
  return profiles[kind] || profiles.clear;
}

function shopWeatherShelfRestockPlanWorld({
  desiredTags = [],
  missingTags = [],
  topGoods = [],
  ecologyGarden = null,
  day = 1,
  inventory = {},
  items = [],
  cropsById = null,
  availableSeedCrops = () => [],
  itemName = (itemId) => itemId || "",
  shopTagLabel = (tag) => tag || "",
  shopTagsForItem = () => [],
  shopTagsOverlap = () => false,
  bestRecipeForOutput = () => null,
  recipeCraftReady = () => false,
  recipeUnlocked = () => false,
  shopRestockRouteCandidates = () => [],
} = {}) {
  const focusTags = [...new Set([...(missingTags || []), ...(desiredTags || [])].filter(Boolean))];
  const topGood = topGoods[0] || null;
  if (topGood?.itemId) {
    const routes = shopRestockRouteCandidates({
      day,
      itemId: topGood.itemId,
      itemName: topGood.itemName,
      note: "天气主推货继续补厚",
    });
    const tag = topGood.matchedTags?.[0] || focusTags[0] || "";
    return {
      active: true,
      mode: "featured",
      itemId: topGood.itemId,
      itemName: topGood.itemName,
      desiredCount: Math.max(2, Number(topGood.count || 0) + 1),
      tag,
      tagLabel: shopTagLabel(tag),
      reason: `天气主推货：${topGood.itemName}`,
      note: "把已匹配天气的头排货补厚，下一次开铺更稳。",
      routes,
    };
  }

  const safeItems = Array.isArray(items) ? items : [];
  const safeInventory = inventory || {};
  const safeCropsById = cropsById instanceof Map ? cropsById : new Map();
  const candidate = safeItems
    .filter((item) => item?.item_id && item.sell_price_base !== "0" && item.item_type !== "seed")
    .map((item) => {
      const itemId = item.item_id;
      const tags = shopTagsForItem(item, ecologyGarden);
      const matchedTags = focusTags.filter((tag) => shopTagsOverlap(tags, [tag]));
      if (!matchedTags.length) return null;
      const count = Number(safeInventory[itemId] || 0);
      const recipe = bestRecipeForOutput(itemId);
      const crop = safeCropsById.get(itemId);
      const seedReady = crop && availableSeedCrops().some((entry) => entry.seed_item_id === crop.seed_item_id);
      const recipeScore = recipe ? (recipeCraftReady(recipe) ? 90 : recipeUnlocked(recipe) ? 68 : 32) : 0;
      const cropScore = crop ? (seedReady ? 78 : 34) : 0;
      const stockScore = count > 0 ? 120 : 0;
      const rarityEase = Math.max(0, 6 - Number(item.rarity || 1));
      const score = matchedTags.length * 12 + stockScore + recipeScore + cropScore + rarityEase;
      if (score <= 0 || (!count && !recipe && !crop)) return null;
      return {
        itemId,
        itemName: itemName(itemId),
        count,
        tags,
        matchedTags,
        score,
      };
    })
    .filter(Boolean)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0) || a.itemName.localeCompare(b.itemName, "zh-Hans-CN"))[0] || null;
  const tag = candidate?.matchedTags?.[0] || focusTags[0] || "";
  const routes = candidate
    ? shopRestockRouteCandidates({
      day,
      itemId: candidate.itemId,
      itemName: candidate.itemName,
      note: `补 ${shopTagLabel(tag)} 天气对口货`,
    })
    : [];
  return {
    active: Boolean(candidate || tag),
    mode: candidate ? "missing" : "generic",
    itemId: candidate?.itemId || "",
    itemName: candidate?.itemName || `${shopTagLabel(tag)}货`,
    desiredCount: 2,
    tag,
    tagLabel: shopTagLabel(tag),
    reason: candidate ? `补一件${shopTagLabel(tag)}天气对口货` : `先补${shopTagLabel(tag)}类可卖货`,
    note: candidate ? "从推荐路线里挑最顺手的一条补上。" : "先从田地、工坊或商路找一件同标签货。",
    routes,
  };
}

function shopWeatherShelfRestockPlanMarkupWorld(plan = null) {
  if (!plan?.active) return "";
  const routeRows = (plan.routes || []).slice(0, 3).map((route) => `
    <div class="shop-weather-shelf-route ${route.type}">
      <b>${route.label} · ${route.title}</b>
      <small>${route.detail}</small>
      <button type="button" data-shop-weather-route="${route.action}" data-shop-weather-recipe="${route.recipeId || ""}" data-shop-weather-seed="${route.seedId || ""}" data-shop-weather-tag="${route.shopTag || plan.tag || ""}" data-shop-weather-item="${route.itemId || plan.itemId || ""}">${route.action === "recipe" ? "看配方" : route.action === "seed" ? "看种子" : "看旧铺货签"}</button>
    </div>
  `).join("");
  return `
    <div class="shop-weather-shelf-plan">
      <strong>天气补货路线 · ${plan.itemName}</strong>
      <span>${plan.reason} · ${plan.note}</span>
      <div class="shop-weather-shelf-actions">
        <button type="button" data-shop-weather-restock="true" data-shop-weather-restock-item="${plan.itemId || ""}" data-shop-weather-restock-tag="${plan.tag || ""}">${plan.itemId ? "追踪这件补货" : `追踪${plan.tagLabel || "天气"}补货`}</button>
      </div>
      ${routeRows ? `<div class="shop-weather-shelf-routes">${routeRows}</div>` : `<small>暂无可定位路线，先从田地、工坊或商路找一件${plan.tagLabel || "应季"}货。</small>`}
    </div>
  `;
}

export function shopWeatherShelfRecommendationSpecWorld({
  weatherReaction = null,
  goods = [],
  ecologyGarden = null,
  day = 1,
  inventory = {},
  items = [],
  cropsById = null,
  availableSeedCrops = () => [],
  itemName = (itemId) => itemId || "",
  shopTagLabel = (tag) => tag || "",
  shopTagsForItem = () => [],
  shopTagsOverlap = () => false,
  isExpressiveShopTag = () => false,
  bestRecipeForOutput = () => null,
  recipeCraftReady = () => false,
  recipeUnlocked = () => false,
  shopRestockRouteCandidates = () => [],
} = {}) {
  if (!weatherReaction?.active) return null;
  const profile = shopWeatherShelfProfileWorld(weatherReaction.kind);
  const desiredTags = [...new Set(profile.tags || [])];
  const safeGoods = (Array.isArray(goods) ? goods : []).filter(({ item, count }) => item && Number(count || 0) > 0);
  const scoredGoods = safeGoods
    .map(({ item, itemId, count }) => {
      const tags = shopTagsForItem(item || itemId, ecologyGarden);
      const matchedTags = desiredTags.filter((tag) => shopTagsOverlap(tags, [tag]));
      const expressiveTags = tags.filter((tag) => isExpressiveShopTag(tag));
      const ecologyTags = tags.filter((tag) => ["ecology_product", "spirit_crafted", "route_rare"].includes(tag));
      const score = matchedTags.length * 8
        + expressiveTags.filter((tag) => desiredTags.includes(tag)).length * 3
        + ecologyTags.filter((tag) => desiredTags.includes(tag)).length * 3
        + Math.min(4, Number(count || 0))
        + Math.min(3, Number(item?.rarity || 1));
      const labelTags = [...new Set([...matchedTags, ...ecologyTags, ...expressiveTags, ...tags])]
        .filter(Boolean)
        .slice(0, 3);
      return {
        itemId,
        itemName: itemName(itemId),
        count: Number(count || 0),
        score,
        matchedTags,
        tagText: labelTags.map(shopTagLabel).join(" / ") || profile.title,
      };
    })
    .filter((entry) => entry.score > 0 && entry.matchedTags.length > 0)
    .sort((a, b) => Number(b.score || 0) - Number(a.score || 0) || Number(b.count || 0) - Number(a.count || 0))
    .slice(0, 3);
  const matchedTagSet = new Set(scoredGoods.flatMap((entry) => entry.matchedTags));
  const missingTags = (profile.missingTags || desiredTags)
    .filter((tag) => !matchedTagSet.has(tag))
    .slice(0, 4);
  const topGood = scoredGoods[0] || null;
  const hasGoods = scoredGoods.length > 0;
  const restockPlan = shopWeatherShelfRestockPlanWorld({
    desiredTags,
    missingTags,
    topGoods: scoredGoods,
    ecologyGarden,
    day,
    inventory,
    items,
    cropsById,
    availableSeedCrops,
    itemName,
    shopTagLabel,
    shopTagsForItem,
    shopTagsOverlap,
    bestRecipeForOutput,
    recipeCraftReady,
    recipeUnlocked,
    shopRestockRouteCandidates,
  });
  return {
    active: true,
    kind: weatherReaction.kind,
    title: profile.title,
    tone: hasGoods ? weatherReaction.tone || "good" : "warn",
    weatherName: weatherReaction.weatherName,
    desiredTags,
    topGoods: scoredGoods,
    missingTags,
    missingTagText: missingTags.map(shopTagLabel).join(" / "),
    restockPlan,
    reason: profile.reason,
    actionText: hasGoods
      ? `天气主推货：${topGood.itemName}。${profile.actionText}`
      : `缺少天气对口货：${missingTags.map(shopTagLabel).join(" / ") || "应季货"}。先从田地、工坊或商路补一件。`,
    headline: hasGoods
      ? `${topGood.itemName} x${topGood.count} 可以挂上“${weatherReaction.tagHint || "应季"}”货签。`
      : `${weatherReaction.weatherName}有客意，但货架缺少对口商品。`,
  };
}

export function shopWeatherShelfRecommendationMarkupWorld({
  spec = null,
  customerVignetteMarkup = "",
  shopTagLabel = (tag) => tag || "",
} = {}) {
  if (!spec?.active) return "";
  const goodsText = spec.topGoods.length
    ? spec.topGoods.map((good, index) => `
      <div class="shop-weather-shelf-row ${index === 0 ? "feature" : ""}">
        <b>${index === 0 ? "今日天气主推" : "顺手搭售"} · ${good.itemName} x${good.count}</b>
        <small>${good.tagText}</small>
      </div>
    `).join("")
    : `<div class="shop-weather-shelf-missing">缺少天气对口货：${spec.missingTagText || "应季货"}</div>`;
  const missingText = spec.missingTags.length
    ? `<small>待补标签：${spec.missingTags.map(shopTagLabel).join(" / ")}</small>`
    : "<small>天气对口标签已经接上，可以直接开铺试卖。</small>";
  const restockPlanText = shopWeatherShelfRestockPlanMarkupWorld(spec.restockPlan);
  return `
    <div class="shop-weather-shelf ${spec.tone}" data-shop-board="weather-shelf">
      <strong>${spec.title} · ${spec.weatherName}</strong>
      <span>${spec.headline}</span>
      <small>${spec.reason}</small>
      <div class="shop-weather-shelf-goods">${goodsText}</div>
      ${missingText}
      ${customerVignetteMarkup}
      ${restockPlanText}
      <small>掌柜建议：${spec.actionText}</small>
    </div>
  `;
}

export function inventoryWeatherShelfHintMarkupWorld({
  itemId = "",
  count = 0,
  shelf = null,
  support = null,
  shopTagLabel = (tag) => tag || "",
} = {}) {
  if (!itemId || Number(count || 0) <= 0 || !shelf?.active || !support?.active) return "";
  const topIndex = (shelf.topGoods || []).findIndex((good) => good.itemId === itemId);
  const matchedText = (support.matchedTags || [])
    .map((tag) => shopTagLabel(tag))
    .filter(Boolean)
    .slice(0, 2)
    .join(" / ");
  const isFeature = topIndex === 0;
  const label = isFeature ? "今日天气主推" : "天气对口货";
  const detail = isFeature
    ? `${shelf.weatherName}货签适合放头排，开铺时更容易被第一眼看见。`
    : `${shelf.weatherName}正合${matchedText || support.label || "应季货"}，可以做顺手搭售。`;
  const routeText = isFeature ? "可追踪天气补货" : "补厚天气对口货";
  return `
    <small class="item-weather-shelf-hint ${isFeature ? "good" : "warn"}">
      <b>背包天气货签：${label}</b>
      <span>${matchedText ? `${matchedText} · ` : ""}${detail}</span>
      <button type="button" data-inventory-weather-restock="${itemId}">${routeText}</button>
    </small>
  `;
}

export function shopWeatherCustomerReactionMarkupWorld({
  spec = null,
  shelfMarkup = "",
  signedPercent = (value) => `${Number(value || 0) >= 0 ? "+" : ""}${Math.round(Number(value || 0) * 100)}%`,
  multiplierText = (value) => `x${Number(value || 1).toFixed(2)}`,
} = {}) {
  if (!spec?.active) return "";
  const warningText = spec.warning && spec.disaster !== "none"
    ? `灾害 ${spec.disaster} · 更要把${spec.tagHint}货放到一眼能看到的位置。`
    : `水分 ${signedPercent(spec.waterBonus)} · 成长 ${multiplierText(spec.growthModifier)}。`;
  const heatText = spec.heatBoost > 0
    ? "天气帮你多留半步脚"
    : spec.heatBoost < 0
      ? "天气会缩短犹豫时间"
      : "天气让客人慢慢看";
  return `
    <div class="shop-weather-customer ${spec.tone}" data-shop-board="weather-customer">
      <strong>${spec.title} · ${spec.label}</strong>
      <span>${spec.customerLabel}：“${spec.bubble}”</span>
      <small>${spec.detail}</small>
      <div class="shop-weather-customer-chips">
        <b>${spec.weatherName}</b>
        <b>${spec.tagHint}</b>
        <b>${heatText}</b>
      </div>
      ${shelfMarkup}
      <small>掌柜建议：${spec.advice}</small>
      <small>${warningText}</small>
    </div>
  `;
}

export function shopWeatherShelfAfterglowSpecWorld({
  report = [],
  shelf = null,
  weatherName = "天气",
} = {}) {
  const entry = (Array.isArray(report) ? report : []).find((row) => row?.reason === "weather_shelf");
  if (!entry) return null;
  const count = Number((String(entry.text || "").match(/促成\s+(\d+)/) || [])[1] || 0);
  const success = count > 0;
  return {
    active: true,
    success,
    count,
    label: success ? `成交 ${count} 单` : "待补货",
    title: "天气货签余温",
    text: entry.text || "",
    detail: entry.detail || "",
    tone: success ? "good" : "warn",
    weatherName: shelf?.weatherName || weatherName,
    itemName: shelf?.topGoods?.[0]?.itemName || shelf?.restockPlan?.itemName || "",
  };
}

export function shopWeatherShelfCustomerVignetteSpecWorld({
  shelf = null,
  reaction = null,
  afterglow = null,
} = {}) {
  if (!shelf?.active || !reaction?.active) return { active: false };
  const hasGoods = shelf.topGoods.length > 0;
  const topGood = shelf.topGoods[0] || null;
  const status = afterglow?.success
    ? "attracted"
    : hasGoods
      ? "hesitate"
      : "missing";
  const accent = status === "attracted" ? "#286f58" : status === "missing" ? "#be4f37" : (reaction.accent || "#b47d2f");
  const label = status === "attracted"
    ? "被天气货签吸引"
    : status === "missing"
      ? "空位让客人回头"
      : "看见主推还在犹豫";
  const bubble = status === "attracted"
    ? `这件${topGood?.itemName || "主推货"}正合天色。`
    : status === "missing"
      ? `今天想找${shelf.missingTagText || "应季货"}。`
      : `${reaction.tagHint || "应季"}货签很亮，价格再想想。`;
  return {
    active: true,
    status,
    tone: status === "attracted" ? "good" : status === "missing" ? "warn" : "mid",
    accent,
    label,
    bubble,
    weatherName: shelf.weatherName,
    customerLabel: reaction.customerLabel || "看牌客",
    itemName: topGood?.itemName || shelf.restockPlan?.itemName || shelf.missingTagText || "天气对口货",
    good: topGood || { itemName: "待补", count: 0, missing: true },
    count: afterglow?.count || 0,
    detail: status === "attracted"
      ? `天气货签顾客小景：${shelf.weatherName}把${topGood?.itemName || "主推货"}推到客人眼前。`
      : status === "missing"
        ? `天气货签顾客小景：货架空位暴露了${shelf.missingTagText || "应季货"}缺口。`
        : "天气货签顾客小景：客人已经停下，但还需要补厚库存或给出价格理由。",
  };
}

export function shopWeatherShelfDaySummarySpecWorld({
  afterglow = null,
  shelf = null,
  vignette = null,
} = {}) {
  if (!afterglow?.active) return null;
  const plan = shelf?.restockPlan || null;
  const readyRoute = (plan?.routes || [])[0] || null;
  const followupAction = vignette?.status === "missing" ? "restock" : "review";
  const followupTone = vignette?.status === "attracted" ? "good" : vignette?.status === "missing" ? "warn" : "review";
  const nextAction = vignette?.status === "attracted"
    ? `明天继续补厚 ${afterglow.itemName || plan?.itemName || "天气主推货"}，别让头排断档。`
    : vignette?.status === "missing"
      ? plan?.reason || "明天先补一件天气对口货。"
      : `明天先复盘价格、陈列和库存厚度，让${vignette?.itemName || "天气主推货"}不只被看见，也能被买走。`;
  return {
    ...afterglow,
    status: vignette?.status || (afterglow.success ? "attracted" : "missing"),
    followupAction,
    followupTone,
    title: afterglow.success ? "天气货签接住了客人" : vignette?.status === "hesitate" ? "天气货签留住了脚步" : "天气货签还缺一口货",
    headline: afterglow.success
      ? `${afterglow.weatherName}促成 ${afterglow.count} 单天气对口成交。`
      : vignette?.status === "hesitate"
        ? `${afterglow.weatherName}货签已经把客人留住，但还差价格理由或库存厚度。`
        : `${afterglow.weatherName}货签已经挂出，但顾客还没被真正接住。`,
    nextAction,
    itemId: plan?.itemId || "",
    tag: plan?.tag || "",
    route: readyRoute,
    buttonLabel: followupAction === "restock"
      ? "补天气对口货"
      : afterglow.success
        ? "补厚天气主推货"
        : "复盘天气货签",
  };
}

export function shopWeatherShelfCustomerVignetteMarkupWorld({
  spec = null,
  vignette = null,
} = {}) {
  if (!vignette?.active) return "";
  const actionButtons = vignette.status === "missing"
    ? `<button type="button" data-shop-weather-restock="true" data-shop-weather-restock-item="${spec?.restockPlan?.itemId || ""}" data-shop-weather-restock-tag="${spec?.restockPlan?.tag || ""}">先补天气对口货</button>`
    : vignette.status === "attracted"
      ? `
        <button type="button" data-shop-weather-action="stock_mark" data-shop-weather-action-item="${spec?.topGoods?.[0]?.itemId || spec?.restockPlan?.itemId || ""}">补厚头排库存</button>
        <button type="button" data-shop-weather-action="display_review">看陈列诊断</button>
      `
      : `
        <button type="button" data-shop-weather-action="price_down">轻压价签</button>
        <button type="button" data-shop-weather-action="display_review">看陈列诊断</button>
      `;
  return `
    <div class="shop-weather-shelf-customer ${vignette.status}">
      <strong>顾客小景复盘 · ${vignette.label}</strong>
      <span>${vignette.customerLabel}：“${vignette.bubble}”</span>
      <small>${vignette.detail}</small>
      <div class="shop-weather-shelf-customer-actions">
        <b>${vignette.weatherName}</b>
        <b>${vignette.itemName}</b>
        ${vignette.status === "hesitate" ? "<b>复盘价格与陈列</b>" : ""}
        ${actionButtons}
      </div>
    </div>
  `;
}

export function shopWeatherShelfActionEchoSpecWorld(feedback = null) {
  if (!feedback || feedback.source !== "weather_shelf") return { active: false };
  const profileMap = {
    price: {
      label: "价签轻压",
      detail: "犹豫客脚步慢下来",
      icon: "价",
    },
    theme: {
      label: "陈列复盘",
      detail: "天气主推被重新照亮",
      icon: "诊",
    },
    stock: {
      label: "补货钉牌",
      detail: "明早路线已挂到门口",
      icon: "补",
    },
  };
  const profile = profileMap[feedback.kind] || {
    label: feedback.verb || "经营回响",
    detail: "天气货签动作已落到旧铺",
    icon: feedback.icon || "铺",
  };
  return {
    active: true,
    title: "天气货签动作回响",
    label: profile.label,
    detail: feedback.weatherShelfLabel || profile.detail,
    subline: `${feedback.weatherName || "今日天气"} · ${profile.detail}`,
    icon: profile.icon,
    kind: feedback.kind || "note",
    accent: feedback.accent || "#b47d2f",
    soft: feedback.soft || "rgba(255, 248, 232, 0.94)",
    age: Number(feedback.age || 0),
    fade: Number.isFinite(feedback.fade) ? feedback.fade : 1,
  };
}

export function shopWeatherShelfChoiceSupportWorld({
  choice = null,
  shelf = null,
  customer = null,
  ecologyGarden = null,
  runtimePlan = null,
  itemTags = [],
  itemName = (itemId) => itemId || "",
  shopTagLabel = (tag) => tag || "",
  shopTagsOverlap = () => false,
  customerDisplayName = (archetype) => archetype || "顾客",
} = {}) {
  const itemId = choice?.itemId || choice?.item?.item_id || "";
  if (runtimePlan) {
    if (!runtimePlan.active) return { active: false, budgetBonus: 0, note: "" };
    const label = runtimePlan.isTopGood ? "天气主推货" : shopTagLabel(runtimePlan.labelTag);
    const customerLabel = customer?.archetype ? customerDisplayName(customer.archetype) : "顾客";
    return {
      ...runtimePlan,
      label,
      note: runtimePlan.isTopGood
        ? `${shelf.weatherName}货签把${itemName(itemId)}推到头排，${customerLabel}愿意多停半步。`
        : `${shelf.weatherName}正合${shopTagLabel(runtimePlan.labelTag)}，${customerLabel}对这件货更有耐心。`,
    };
  }
  if (!choice || !shelf?.active) return { active: false, budgetBonus: 0, note: "" };
  const safeTags = Array.isArray(itemTags) ? itemTags : [];
  const topGood = (shelf.topGoods || []).find((good) => good.itemId === itemId) || null;
  const matchedTags = (shelf.desiredTags || []).filter((tag) => shopTagsOverlap(safeTags, [tag]));
  if (!topGood && matchedTags.length === 0) return { active: false, budgetBonus: 0, note: "" };
  const weatherKindBonus = ["hot-wind", "drought", "frost", "snow", "storm-rain"].includes(shelf.kind) ? 0.015 : 0;
  const topBonus = topGood ? 0.045 : 0;
  const tagBonus = Math.min(0.035, matchedTags.length * 0.018);
  const budgetBonus = Math.min(0.085, topBonus + tagBonus + weatherKindBonus);
  const labelTag = matchedTags[0] || topGood?.matchedTags?.[0] || shelf.desiredTags?.[0] || "";
  const label = topGood ? "天气主推货" : shopTagLabel(labelTag);
  const customerLabel = customer?.archetype ? customerDisplayName(customer.archetype) : "顾客";
  return {
    active: true,
    itemId,
    isTopGood: Boolean(topGood),
    matchedTags,
    label,
    labelTag,
    budgetBonus,
    priceRelief: Math.min(0.06, budgetBonus * 0.7),
    note: topGood
      ? `${shelf.weatherName}货签把${itemName(itemId)}推到头排，${customerLabel}愿意多停半步。`
      : `${shelf.weatherName}正合${shopTagLabel(labelTag)}，${customerLabel}对这件货更有耐心。`,
  };
}

export function shopWeatherShelfChoiceWeightWorld({
  support = { active: false },
  itemTags = [],
  preferredTags = [],
  runtimePlan = null,
  shopTagsOverlap = () => false,
} = {}) {
  if (runtimePlan) {
    const plan = runtimePlan;
    if (!plan.support.active) return { support: plan.support, score: 0, label: "" };
    return {
      support: plan.support,
      score: plan.score,
      label: plan.labelKind === "top" ? "天气主推" : support.label || "天气对口",
    };
  }
  if (!support.active) return { support, score: 0, label: "" };
  const preferredBridge = shopTagsOverlap(itemTags, preferredTags) ? 12 : 0;
  const topWeight = support.isTopGood ? 34 : 18;
  const budgetWeight = Math.round(Number(support.budgetBonus || 0) * 180);
  return {
    support,
    score: topWeight + budgetWeight + preferredBridge,
    label: support.isTopGood ? "天气主推" : support.label || "天气对口",
  };
}
