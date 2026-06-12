export function patternMatchesKeyData(pattern = "", key = "") {
  return pattern.split("|").some((part) => {
    const normalized = part.trim();
    if (!normalized) return false;
    const regex = new RegExp(`^${normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*")}$`);
    return regex.test(key);
  });
}

export function collectLocalizationKeysForPlanData(plan = {}, context = {}) {
  const data = context.data || {};
  const patternMatchesKey = typeof context.patternMatchesKey === "function"
    ? context.patternMatchesKey
    : patternMatchesKeyData;
  const keys = new Set();
  const pushKey = (value) => {
    if (typeof value === "string" && value && patternMatchesKey(plan.key_pattern, value)) keys.add(value);
  };
  const scanRows = (rows) => {
    for (const row of rows || []) {
      for (const [field, value] of Object.entries(row)) {
        if (field.endsWith("_key") || field.includes("subtitle") || field.includes("toast")) pushKey(value);
      }
    }
  };

  for (const tableName of String(plan.source_table || "").split("|")) {
    const rows = data[tableName.trim()];
    if (rows) scanRows(rows);
  }
  for (const text of data.localization || []) pushKey(text.text_key);
  return [...keys];
}

export function localizationCoverageForData(plan = {}, context = {}) {
  const collectLocalizationKeysForPlan = typeof context.collectLocalizationKeysForPlan === "function"
    ? context.collectLocalizationKeysForPlan
    : () => [];
  const names = context.names instanceof Map ? context.names : new Map();
  const steamAssets = Array.isArray(context.steamAssets) ? context.steamAssets : [];
  const keys = collectLocalizationKeysForPlan(plan);
  const present = keys.filter((key) => names.has(key));
  const target = Number(plan.coverage_target || 100);
  const coverage = keys.length ? Math.round((present.length / keys.length) * 100) : 0;
  const missing = keys.filter((key) => !names.has(key)).slice(0, 5);
  const plannedOnly = keys.length === 0 && plan.content_area === "marketing";
  return {
    keys,
    present,
    target,
    coverage: plannedOnly ? target : coverage,
    missing,
    pass: plannedOnly ? plan.priority !== "P0" || steamAssets.length > 0 : coverage >= target,
    plannedOnly,
  };
}

export function localizationSummaryData(priority = "P0", context = {}) {
  const localizationCoverage = Array.isArray(context.localizationCoverage) ? context.localizationCoverage : [];
  const localizationCoverageFor = typeof context.localizationCoverageFor === "function"
    ? context.localizationCoverageFor
    : (plan) => localizationCoverageForData(plan, context);
  const plans = localizationCoverage.filter((plan) => plan.priority === priority);
  const results = plans.map((plan) => localizationCoverageFor(plan));
  return {
    total: plans.length,
    passed: results.filter((result) => result.pass).length,
    avg: results.length ? Math.round(results.reduce((sum, result) => sum + result.coverage, 0) / results.length) : 0,
  };
}

export function communityAssetReadyData(entry = {}, context = {}) {
  const steamAssets = Array.isArray(context.steamAssets) ? context.steamAssets : [];
  const completed = context.completed instanceof Set ? context.completed : new Set();
  const asset = String(entry.primary_asset || "");
  const relatedSteamAsset = steamAssets.find((plan) =>
    plan.asset_plan_id.includes(asset)
      || plan.asset_type === entry.format
      || plan.asset_name.includes(entry.content_theme)
      || plan.required_capture.includes(entry.content_theme),
  );
  const systemReady = {
    term_system_gif: (context.solarTerms?.length || 0) > 0 && (context.weather?.length || 0) > 0,
    spirit_birth_clip: completed.has("spirit") || (context.spirits?.length || 0) > 0,
    shop_workshop_clip: completed.has("shop") || (context.shopPriceRules?.length || 0) > 0,
    customer_tag_infographic: (context.customerSegments?.length || 0) > 0 && (context.customerProfiles?.length || 0) > 0,
    demo_route_card: (context.demoQa?.length || 0) > 0 && (context.verticalSlice?.length || 0) > 0,
    year2_trial_clip: (context.year2SolarTrials?.length || 0) > 0,
    feature_trailer_v1: steamAssets.some((plan) => plan.asset_type === "trailer"),
    year2_freeplay_graph: (context.freeplayGoals?.length || 0) > 0 && (context.year2GoalBook?.length || 0) > 0,
  }[asset];
  return {
    ready: Boolean(relatedSteamAsset || systemReady),
    asset: relatedSteamAsset,
    reason: relatedSteamAsset ? `${relatedSteamAsset.asset_name} · ${relatedSteamAsset.acceptance_criteria}` : systemReady ? "对应系统已接入，可录制临时素材。" : "缺少可直接对应的素材计划或实机系统。",
  };
}

export function communityCalendarSummaryData(context = {}) {
  const entries = Array.isArray(context.communityContentCalendar) ? context.communityContentCalendar : [];
  const communityAssetReady = typeof context.communityAssetReady === "function"
    ? context.communityAssetReady
    : (entry) => communityAssetReadyData(entry, context);
  const ready = entries.filter((entry) => communityAssetReady(entry).ready).length;
  const steamBeats = entries.filter((entry) => entry.target_channel.includes("steam")).length;
  const demoBeats = entries.filter((entry) => entry.cta === "download_demo").length;
  return { total: entries.length, ready, steamBeats, demoBeats };
}
