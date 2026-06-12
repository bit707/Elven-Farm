export function currentCohabWeekKeyRuntime(day = 1) {
  return `week:${Math.floor((Math.max(1, Number(day || 1)) - 1) / 7)}`;
}

export function currentCohabFestivalKeyRuntime(termId = "") {
  return `festival:${termId}`;
}

export function syncCohabStateRuntime(cohabState = {}, {
  normalizeCohabState = (value = {}) => value,
  stateDay = 0,
} = {}) {
  const normalized = normalizeCohabState(cohabState);
  for (const [buffId, info] of Object.entries(normalized.activeBuffs || {})) {
    if (info && Number(info.expiresDay || 0) < stateDay) delete normalized.activeBuffs[buffId];
  }
  normalized.history = normalized.history.slice(0, 12);
  return normalized;
}

export function cohabHouseReadyRuntime(epilogue = null, {
  stateBuiltBuildings = new Set(),
  dataBuildingsById = new Map(),
  hasCoreLoop = () => false,
} = {}) {
  if (!epilogue?.home_upgrade_required) return true;
  if (stateBuiltBuildings.has(epilogue.home_upgrade_required)) return true;
  if (!dataBuildingsById.has(epilogue.home_upgrade_required)) {
    return stateBuiltBuildings.has("build_house_start") || stateBuiltBuildings.has("build_spirit_manor") || hasCoreLoop();
  }
  return false;
}

export function cohabBuffSpecRuntime(buffId = "") {
  const specs = {
    buff_trade_margin_up: { label: "商路议价", value: 0.08, durationDays: 7 },
    buff_water_yield_up: { label: "水脉丰收", value: 1, durationDays: 7 },
    buff_night_guard_up: { label: "夜守巡灯", value: 0.12, durationDays: 7 },
  };
  return specs[buffId] || { label: buffId, value: 0.05, durationDays: 5 };
}

export function cohabSharedBonusTextRuntime(epilogue = null) {
  const value = Number(epilogue?.shared_bonus_value || 0);
  const type = epilogue?.shared_bonus_type || "";
  if (type === "medicine_output") return `工坊出货 +${Math.round(value * 100)}%`;
  if (type === "trade_margin") return `商路利润 +${Math.round(value * 100)}%`;
  if (type === "deco_score") return `店铺陈列 +${Math.round(value * 100)}%`;
  if (type === "water_yield") return `农田收获 +${Math.round(value * 100)}%`;
  if (type === "night_guard") return `夜间护场 +${Math.round(value * 100)}%`;
  return `${type} +${Math.round(value * 100)}%`;
}

export function cohabEventTimingMetRuntime(triggerType = "", triggerParam = "", payload = {}, {
  stateBuiltBuildings = new Set(),
  stateDungeonClears = new Set(),
} = {}) {
  if (triggerType === "on_day_start" || triggerType === "on_day_end") {
    const weekdayMatch = String(triggerParam || "").match(/^weekday_(\d+)/);
    if (!weekdayMatch) return true;
    const target = Number(weekdayMatch[1] || 1);
    return Number(payload.weekday || 1) === target;
  }
  if (triggerType === "on_trade_return") return !triggerParam || payload.routeId === triggerParam || payload.routeId;
  if (triggerType === "on_build_complete") return !triggerParam || payload.buildingId === triggerParam || stateBuiltBuildings.size >= 2;
  if (triggerType === "on_term_change") return !triggerParam || payload.termId === triggerParam;
  if (triggerType === "on_dungeon_return") return !triggerParam || payload.areaId === triggerParam || stateDungeonClears.size > 0;
  return false;
}
