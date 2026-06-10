export function termLearningTagTextUi({ tags = "", fallback = "常规", splitTags, shopTagLabel }) {
  const entries = splitTags(tags).slice(0, 3);
  if (!entries.length) return fallback;
  return entries.map((tag) => {
    const map = {
      spring_seed: "春种",
      earth_crop: "土系作物",
      water_crop: "水生作物",
      growth_small: "小幅成长",
      pest_sensitive: "虫害敏感",
      balanced_growth: "平衡生长",
      wood_crop: "木系作物",
      spirit_up: "灵气活跃",
      fire_crop: "火系作物",
      yield_up: "产量提升",
      seed_discount: "种子折扣",
      basic_food: "基础食物",
      water_goods: "水鲜货",
      pest_goods: "防虫货",
      defense_goods: "防护货",
      tea_goods: "茶货",
      fire_goods: "火系货",
      grain_goods: "粮食货",
    };
    return map[tag] || shopTagLabel(tag);
  }).join(" / ");
}

export function weatherWaterLearningTextUi({ weather, signedPercent, multiplierText }) {
  const water = Number(weather?.water_bonus || 0);
  const growth = Number(weather?.crop_growth_modifier || 1);
  if (water >= 0.3) return `雨水充足，水分 ${signedPercent(water)}，但成长 ${multiplierText(growth)}；优先看低洼或水润田。`;
  if (water <= -0.2) return `天气偏干，水分 ${signedPercent(water)}，成长 ${multiplierText(growth)}；入夜前先补水。`;
  return `水分 ${signedPercent(water)}，成长 ${multiplierText(growth)}；按普通节奏浇水即可。`;
}

export function termLearningCardSpecUi({
  term = null,
  weather = null,
  fieldBoard = null,
  localize,
  plantedCropSolarAffinitySummary,
  termLearningTagText,
  weatherWaterLearningText,
}) {
  if (!term) return null;
  const termName = localize(term.term_name_key, term.term_id);
  const weatherName = localize(weather?.weather_name_key, weather?.weather_id || "weather_clear");
  const affinity = plantedCropSolarAffinitySummary();
  const riskRows = Array.isArray(fieldBoard?.allRows) ? fieldBoard.allRows.filter((row) => row.tone === "risk") : [];
  const topRow = fieldBoard?.rows?.[0] || null;
  const disaster = String(weather?.disaster_tag || "none");
  const riskText = riskRows.length > 0
    ? `${riskRows.length} 块风险田，先处理 ${riskRows[0].coord || "红色田块"}。`
    : disaster && disaster !== "none"
      ? `天气带有 ${disaster} 标签，先看节气风险面板。`
      : "暂无明显风险，适合推进播种、浇水或收获。";
  const fieldAction = topRow
    ? `${topRow.action}：${topRow.detail}`
    : "先清荒或播种一块灵田，让节气效果有落点。";
  const shopText = `${termLearningTagText(term.market_bonus_tags, "基础商品")} 更容易成为今日旧铺话题。`;
  return {
    termName,
    weatherName,
    headline: `${termName}读法 · ${weatherName}`,
    cropText: `${termLearningTagText(term.crop_bonus_tags, "普通作物")} 更吃香；已种适性：${affinity.text}。`,
    waterText: weatherWaterLearningText(weather),
    shopText,
    riskText,
    fieldAction,
    safetyText: "只解释今日节气读法；不会自动播种、浇水、收获、开铺或处理风险。",
  };
}

export function termLearningCardMarkupUi(spec = null) {
  if (!spec) return "";
  return `
    <div class="term-learning-card">
      <strong>${spec.headline}</strong>
      <div class="term-learning-grid">
        <span><b>种什么</b><small>${spec.cropText}</small></span>
        <span><b>怎么浇</b><small>${spec.waterText}</small></span>
        <span><b>卖什么</b><small>${spec.shopText}</small></span>
        <span><b>避什么</b><small>${spec.riskText}</small></span>
      </div>
      <small>今日第一判断：${spec.fieldAction}</small>
      <em>${spec.safetyText}</em>
    </div>
  `;
}

export function solarTermMoodSceneSpecUi({
  term = null,
  weather = null,
  fieldBoard = null,
  state,
  localize,
  solarTermAtmosphereProfile,
  weatherWorldMoodSpec,
  weatherLifeVignetteSpec,
  currentLivingWorldState,
  termLearningTagText,
  unresolvedRisks,
  spiritSeasonalWorkMomentSpec,
  jobName,
}) {
  if (!term) return null;
  const atmosphere = solarTermAtmosphereProfile(term, weather?.visual_fx_id || "");
  const mood = weatherWorldMoodSpec(weather, term, atmosphere);
  const life = weatherLifeVignetteSpec(weather, currentLivingWorldState(), mood);
  const termName = localize(term.term_name_key, term.term_id);
  const weatherName = mood.weatherName || localize(weather?.weather_name_key, weather?.weather_id || "weather_clear");
  const marketText = termLearningTagText(term.market_bonus_tags, "基础商品");
  const cropText = termLearningTagText(term.crop_bonus_tags, "普通作物");
  const spiritText = termLearningTagText(term.spirit_bonus_tags, "精怪日常");
  const riskRows = Array.isArray(fieldBoard?.allRows) ? fieldBoard.allRows.filter((row) => row.tone === "risk") : [];
  const risk = unresolvedRisks()[0] || null;
  const topField = fieldBoard?.rows?.[0] || null;
  const scene = life?.scenes?.[0] || null;
  const spirit = state.spirits.find((entry) => entry.job) || state.spirits[0] || null;
  const seasonalSpirit = spirit ? spiritSeasonalWorkMomentSpec(spirit, spirit.job || "farm", weather) : null;
  const fieldTarget = topField ? `${topField.x},${topField.y}` : "";
  const shopHasReport = state.shopReport.length > 0;
  const warning = riskRows.length > 0 || Boolean(risk) || mood.warning;
  const routes = [
    {
      key: "field",
      tone: topField?.tone || "seed",
      label: "田地画面",
      title: topField ? topField.action : "给天时一个落点",
      detail: topField ? `${topField.title}：${topField.detail}` : `${cropText}更吃今日天时，先选一块可照料灵田。`,
      cta: topField ? "定位田块" : "看灵田卡",
      action: "field",
      target: fieldTarget,
    },
    {
      key: "shop",
      tone: shopHasReport ? "harvest" : "seed",
      label: "旧铺画面",
      title: shopHasReport ? "回看天气货签" : `预备${marketText}`,
      detail: scene ? `${scene.label}：${scene.text}` : `${marketText}会成为今日门口话题，先把货架和价格想清楚。`,
      cta: shopHasReport ? "回看旧铺" : "看备货位",
      action: "shop",
      target: "",
    },
    {
      key: "spirit",
      tone: spirit ? "boost" : "clear",
      label: "精怪画面",
      title: spirit ? `${spirit.name}的${seasonalSpirit?.jobLabel || jobName(spirit.job || "farm")}小动作` : "等待第一只精怪",
      detail: spirit
        ? `${seasonalSpirit?.summary || `${weatherName}会影响精怪岗位表现。`} · ${spiritText}`
        : `${spiritText}会在精怪入队后变成岗位动作、语音和陪伴反馈。`,
      cta: spirit ? "看岗位线" : "看精怪入口",
      action: "spirit",
      target: spirit?.job || "",
    },
    {
      key: "risk",
      tone: warning ? "risk" : "season",
      label: "风险画面",
      title: warning ? "先确认天时异动" : "今日风险平稳",
      detail: risk
        ? `${risk.title || "节气风险"}：入夜前处理可避免田地损失。`
        : riskRows.length > 0
          ? `${riskRows.length} 块风险田，先看红色田块再入夜。`
          : `${mood.detail} 当前可把注意力放在田地、旧铺或精怪岗位。`,
      cta: warning ? "看风险" : "看节气",
      action: warning ? "risk" : "term",
      target: "",
    },
  ];
  return {
    key: `${state.day}:${term.term_id}:${weather?.weather_id || "weather_clear"}:${mood.kind}`,
    tone: mood.kind || "clear",
    glyph: mood.glyph || "节",
    termName,
    weatherName,
    title: `今日画境 · ${termName}`,
    subtitle: `${weatherName} / ${atmosphere.label || "天时"} / ${mood.title}`,
    ambience: mood.detail,
    lifeTitle: scene ? scene.label : life?.title || "天气生活小景",
    lifeText: scene ? scene.text : life?.summary || "今日天气先影响田垄、旧铺和精怪岗位的读法。",
    lifeTarget: scene?.key || "",
    routes,
    safetyText: "这些按钮只定位画面和面板；不会自动播种、浇水、收获、开铺、派工、处理风险、入夜或消耗资源。",
  };
}

export function solarTermMoodSceneMarkupUi({ spec = null, selectorDataValue }) {
  if (!spec) return "";
  return `
    <div class="solar-term-mood-scene ${spec.tone}">
      <div class="solar-term-mood-head">
        <b>${spec.glyph}</b>
        <span>
          <strong>${spec.title}</strong>
          <small>${spec.subtitle}</small>
        </span>
      </div>
      <p>${spec.ambience}</p>
      <button type="button" class="solar-term-mood-life" data-solar-term-mood-action="weather_life" data-solar-term-mood-target="${selectorDataValue(spec.lifeTarget)}">
        <strong>${spec.lifeTitle}</strong>
        <small>${spec.lifeText}</small>
      </button>
      <div class="solar-term-mood-routes">
        ${spec.routes.map((row) => `
          <button type="button" class="solar-term-mood-route ${row.tone}" data-solar-term-mood-route="${row.key}" data-solar-term-mood-action="${row.action}" data-solar-term-mood-target="${selectorDataValue(row.target)}">
            <b>${row.label}</b>
            <span>${row.title}</span>
            <small>${row.detail}</small>
            <em>${row.cta}</em>
          </button>
        `).join("")}
      </div>
      <em>${spec.safetyText}</em>
    </div>
  `;
}

export function renderTermPanelUi({
  refs,
  state,
  currentTermConfig,
  currentWeatherConfig,
  plantedCropSolarAffinitySummary,
  termLearningCardMarkup,
  solarTermMoodSceneMarkup,
  seasonalCropGuideMarkup,
  seasonalCropGuideSpec,
  solarFieldDecisionBoardMarkup,
  localize,
  signedPercent,
  multiplierText,
}) {
  const term = currentTermConfig();
  const weather = currentWeatherConfig();
  const affinitySummary = plantedCropSolarAffinitySummary();
  refs.termPanel.innerHTML = "";
  if (!term) {
    refs.termPanel.innerHTML = '<div class="term-item"><strong>节气未载入</strong>等待 CSV 配置。</div>';
    return;
  }

  const learningMarkup = termLearningCardMarkup();
  if (learningMarkup) {
    const learningNode = document.createElement("div");
    learningNode.innerHTML = learningMarkup.trim();
    refs.termPanel.append(learningNode.firstElementChild);
  }
  const moodMarkup = solarTermMoodSceneMarkup();
  if (moodMarkup) {
    const moodNode = document.createElement("div");
    moodNode.innerHTML = moodMarkup.trim();
    refs.termPanel.append(moodNode.firstElementChild);
  }
  const cropGuideMarkup = seasonalCropGuideMarkup(seasonalCropGuideSpec());
  if (cropGuideMarkup) refs.termPanel.insertAdjacentHTML("beforeend", cropGuideMarkup);

  const rows = [
    ["当前节气", localize(term.term_name_key, state.term)],
    ["当前天气", localize(weather.weather_name_key, weather.weather_id)],
    ["作物影响", term.crop_bonus_tags],
    ["水分影响", signedPercent(weather.water_bonus)],
    ["成长倍率", multiplierText(weather.crop_growth_modifier)],
    ["精怪心情", signedPercent(weather.mood_modifier)],
    ["灾害标签", weather.disaster_tag && weather.disaster_tag !== "none" ? weather.disaster_tag : "无"],
    ["已种适性", affinitySummary.text],
    ["市场影响", term.market_bonus_tags],
    ["精怪影响", term.spirit_bonus_tags],
    ["风险池", term.risk_pool_id],
  ];

  for (const [title, text] of rows) {
    const node = document.createElement("div");
    node.className = "term-item";
    node.innerHTML = `<strong>${title}</strong>${text || "无"}`;
    refs.termPanel.append(node);
  }
  const boardMarkup = solarFieldDecisionBoardMarkup();
  if (boardMarkup) {
    const boardNode = document.createElement("div");
    boardNode.innerHTML = boardMarkup.trim();
    refs.termPanel.append(boardNode.firstElementChild);
  }
  if (affinitySummary.detail) {
    const note = document.createElement("div");
    note.className = "term-item affinity";
    note.innerHTML = `<strong>田间提示</strong>${affinitySummary.detail}`;
    refs.termPanel.append(note);
  }
}
