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

export function cohabStatusForRuntime(npcId = "", {
  dataCohabByNpc = new Map(),
  stateNpcFavor = {},
  favorLevel = () => 0,
  conditionMet = () => false,
  cohabHouseReady = () => false,
} = {}) {
  const epilogue = dataCohabByNpc.get(npcId);
  if (!epilogue) return null;
  const level = favorLevel(stateNpcFavor[npcId] || 0);
  const unlocked = conditionMet(epilogue.unlock_condition_group) && cohabHouseReady(epilogue);
  return { epilogue, unlocked, level, bonusType: epilogue.shared_bonus_type, bonusValue: Number(epilogue.shared_bonus_value || 0) };
}

export function cohabRequirementTextRuntime(cohab = null, {
  dataBuildingsById = new Map(),
  conditionLabel = (conditionGroup) => conditionGroup,
  buildingName = (building) => building?.name || building?.building_name || "",
} = {}) {
  if (!cohab?.epilogue) return "未配置";
  if (cohab.unlocked) return `${cohab.epilogue.route_name} · 可推进`;
  const requirements = [];
  if (cohab.epilogue.unlock_condition_group) requirements.push(conditionLabel(cohab.epilogue.unlock_condition_group));
  if (cohab.epilogue.home_upgrade_required) {
    if (dataBuildingsById.has(cohab.epilogue.home_upgrade_required)) {
      requirements.push(buildingName(dataBuildingsById.get(cohab.epilogue.home_upgrade_required)));
    } else {
      requirements.push("居所升级完成（当前 Demo 以初始小屋/精怪居所代替）");
    }
  }
  return `${cohab.epilogue.route_name} · 需 ${requirements.join(" + ")}`;
}

export function nextCohabEventRuntime(epilogueId = "", {
  dataCohabWeeklyByEpilogue = new Map(),
  dataCohabFestivalByEpilogue = new Map(),
  dataCohabDialogueByEpilogue = new Map(),
} = {}) {
  return (dataCohabWeeklyByEpilogue.get(epilogueId) || [])[0]
    || (dataCohabFestivalByEpilogue.get(epilogueId) || [])[0]
    || (dataCohabDialogueByEpilogue.get(epilogueId) || [])[0]
    || null;
}

export function festivalEventForRuntime(epilogueId = "", {
  termId = "",
  dataCohabFestivalByEpilogue = new Map(),
} = {}) {
  return (dataCohabFestivalByEpilogue.get(epilogueId) || [])
    .find((event) => event.trigger_param === termId)
    || (dataCohabFestivalByEpilogue.get(epilogueId) || [])[0]
    || null;
}

export function cohabUnlockedRoutesRuntime(cohabEpilogues = [], {
  cohabStatusFor = () => null,
} = {}) {
  return cohabEpilogues.filter((epilogue) => cohabStatusFor(epilogue.npc_id)?.unlocked);
}

export function cohabSharedBonusValueRuntime(type = "", routes = []) {
  if (!type) return 0;
  return routes
    .filter((epilogue) => epilogue.shared_bonus_type === type)
    .reduce((sum, epilogue) => sum + Number(epilogue.shared_bonus_value || 0), 0);
}

export function cohabBuffSpecRuntime(buffId = "") {
  const specs = {
    buff_trade_margin_up: { label: "商路议价", value: 0.08, durationDays: 7 },
    buff_water_yield_up: { label: "水脉丰收", value: 1, durationDays: 7 },
    buff_night_guard_up: { label: "夜守巡灯", value: 0.12, durationDays: 7 },
  };
  return specs[buffId] || { label: buffId, value: 0.05, durationDays: 5 };
}

export function cohabBuffValueRuntime(buffId = "", {
  syncCohabState = () => ({}),
} = {}) {
  const cohabState = syncCohabState() || {};
  return Number(cohabState.activeBuffs?.[buffId]?.value || 0);
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

export function applyCohabRewardRuntime(event = null, epilogue = null, {
  stateDay = 1,
  stateCompleted = new Set(),
  syncCohabState = () => ({}),
  cohabBuffSpec = () => ({ label: "", value: 0, durationDays: 0 }),
  addItem = () => null,
  itemName = (itemId = "") => itemId,
  applyRewardEntry = () => "",
} = {}) {
  if (!event) return "无";
  if (event.reward_type === "item") {
    const count = Number(event.reward_count || 1);
    addItem(event.reward_param, count);
    return `${itemName(event.reward_param)} x${count}`;
  }
  if (event.reward_type === "buff") {
    const spec = cohabBuffSpec(event.reward_param);
    const cohabState = syncCohabState();
    cohabState.activeBuffs[event.reward_param] = {
      value: spec.value,
      expiresDay: stateDay + spec.durationDays,
      route: epilogue?.epilogue_id || "",
    };
    stateCompleted.add(`cohab_buff_${event.reward_param}`);
    return `${spec.label} ${spec.value >= 1 ? `+${spec.value}` : `+${Math.round(spec.value * 100)}%`}（持续 ${spec.durationDays} 天）`;
  }
  return applyRewardEntry({
    reward_type: event.reward_type,
    reward_param: event.reward_param,
    reward_count: event.reward_count,
  });
}

export function recordCohabHistoryRuntime(type = "", epilogue = null, eventName = "", rewardText = "", {
  stateDay = 1,
  syncCohabState = () => ({}),
  limit = 10,
} = {}) {
  const cohabState = syncCohabState();
  cohabState.history.unshift({
    type,
    epilogueId: epilogue?.epilogue_id || "",
    routeName: epilogue?.route_name || "",
    eventName,
    rewardText,
    day: stateDay,
  });
  cohabState.history = cohabState.history.slice(0, limit);
  return cohabState;
}

export function triggerCohabDailySceneRuntime(timing = "on_day_start", {
  stateDay = 1,
  cohabUnlockedRoutes = () => [],
  dataCohabDialogueByEpilogue = new Map(),
  syncCohabState = () => ({}),
  queueDialogueGroup = () => null,
  addLog = () => null,
  recordCohabHistory = () => null,
} = {}) {
  const maps = cohabUnlockedRoutes()
    .flatMap((epilogue) => (dataCohabDialogueByEpilogue.get(epilogue.epilogue_id) || []).map((map) => ({ epilogue, map })))
    .filter(({ map }) => map.trigger_timing === timing && map.repeat_cycle === "daily");
  if (!maps.length) return false;
  const pick = maps[(Math.max(1, stateDay) - 1) % maps.length];
  const cohabState = syncCohabState();
  const seenKey = `${pick.epilogue.epilogue_id}:${timing}`;
  if (cohabState.dailySeen[seenKey] === stateDay) return false;
  cohabState.dailySeen[seenKey] = stateDay;
  queueDialogueGroup(pick.map.dialogue_group_id);
  addLog("同住日常", `${pick.epilogue.route_name}：${pick.map.scene_key}`);
  recordCohabHistory("daily", pick.epilogue, pick.map.scene_key, "日常对话");
  return true;
}

export function cohabDailyMapForRuntime(epilogue = null, timing = "manual", {
  dataCohabDialogueByEpilogue = new Map(),
} = {}) {
  const maps = dataCohabDialogueByEpilogue.get(epilogue?.epilogue_id || "") || [];
  return maps.find((map) => map.trigger_timing === timing && map.repeat_cycle === "daily")
    || maps.find((map) => map.repeat_cycle === "daily")
    || maps[0]
    || null;
}

export function playCohabDailySceneRuntime(npcId = "", {
  stateDay = 1,
  cohabStatusFor = () => null,
  cohabRequirementText = () => "",
  cohabDailyMapFor = () => null,
  npcName = (id = "") => id,
  syncCohabState = () => ({}),
  queueDialogueGroup = () => null,
  recordCohabHistory = () => null,
  complete = () => null,
  addLog = () => null,
  render = () => null,
} = {}) {
  const cohab = cohabStatusFor(npcId);
  if (!cohab?.epilogue) return addLog("后日谈未配置", "这位角色暂时没有同住后日谈路线。");
  if (!cohab.unlocked) return addLog("后日谈未开启", `${npcName(npcId)} 还需要 ${cohabRequirementText(cohab)}。`);
  const map = cohabDailyMapFor(cohab.epilogue);
  if (!map) return addLog("后日谈暂无日常", `${cohab.epilogue.route_name} 还没有配置可播放的日常对话。`);
  const cohabState = syncCohabState();
  const seenKey = `${cohab.epilogue.epilogue_id}:manual_daily`;
  if (cohabState.dailySeen[seenKey] === stateDay) return addLog("今日已经聊过", `${cohab.epilogue.route_name} 今天已经留下过一段生活小事，明天再来听新的。`);
  cohabState.dailySeen[seenKey] = stateDay;
  queueDialogueGroup(map.dialogue_group_id);
  recordCohabHistory("daily", cohab.epilogue, map.scene_key, "主动日常");
  complete("cohab_daily_manual");
  addLog("同住日常", `${cohab.epilogue.route_name}：${map.scene_key}。`);
  render();
  return true;
}

export function playCohabWeeklyEventRuntime(npcId = "", {
  cohabStatusFor = () => null,
  cohabRequirementText = () => "",
  currentCohabWeekKey = () => "",
  dataCohabWeeklyByEpilogue = new Map(),
  cohabState = {},
  conditionMet = () => false,
  npcName = (id = "") => id,
  syncCohabState = () => ({}),
  queueDialogueGroup = () => null,
  applyCohabReward = () => "",
  recordCohabHistory = () => null,
  complete = () => null,
  addLog = () => null,
  render = () => null,
} = {}) {
  const cohab = cohabStatusFor(npcId);
  if (!cohab?.epilogue) return addLog("后日谈未配置", "这位角色暂时没有同住周常路线。");
  if (!cohab.unlocked) return addLog("后日谈未开启", `${npcName(npcId)} 还需要 ${cohabRequirementText(cohab)}。`);
  const syncedState = syncCohabState();
  const weeklyClaims = syncedState.weeklyClaims || cohabState.weeklyClaims || {};
  const cycleKey = currentCohabWeekKey();
  const event = (dataCohabWeeklyByEpilogue.get(cohab.epilogue.epilogue_id) || [])
    .find((entry) => conditionMet(entry.condition_group) && weeklyClaims[entry.weekly_event_id] !== cycleKey)
    || null;
  if (!event) return addLog("本周后日谈已稳", `${cohab.epilogue.route_name} 本周暂无新的周常事件，先推进商路、建设、秘境或入夜等自然触发。`);
  weeklyClaims[event.weekly_event_id] = cycleKey;
  if (event.dialogue_group_id) queueDialogueGroup(event.dialogue_group_id);
  const rewardText = applyCohabReward(event, cohab.epilogue);
  recordCohabHistory("weekly", cohab.epilogue, event.event_name, rewardText);
  complete(`cohab_weekly_${event.weekly_event_id}`);
  addLog("同住周常", `${npcName(npcId)} · ${event.event_name}：${rewardText}。`);
  render();
  return true;
}

export function triggerCohabWeeklyEventsRuntime(source = "", payload = {}, {
  cohabUnlockedRoutes = () => [],
  dataCohabWeeklyByEpilogue = new Map(),
  cohabState = {},
  currentCohabWeekKey = () => "",
  conditionMet = () => false,
  cohabEventTimingMet = () => false,
  npcName = (id = "") => id,
  syncCohabState = () => ({}),
  queueDialogueGroup = () => null,
  applyCohabReward = () => "",
  recordCohabHistory = () => null,
  complete = () => null,
  addLog = () => null,
} = {}) {
  let triggered = 0;
  const syncedState = syncCohabState();
  const weeklyClaims = syncedState.weeklyClaims || cohabState.weeklyClaims || {};
  const cycleKey = currentCohabWeekKey(payload.day);
  for (const epilogue of cohabUnlockedRoutes()) {
    const events = dataCohabWeeklyByEpilogue.get(epilogue.epilogue_id) || [];
    for (const event of events) {
      if (event.trigger_type !== source) continue;
      if (!conditionMet(event.condition_group)) continue;
      if (!cohabEventTimingMet(event.trigger_type, event.trigger_param, payload)) continue;
      if (weeklyClaims[event.weekly_event_id] === cycleKey) continue;
      weeklyClaims[event.weekly_event_id] = cycleKey;
      if (event.dialogue_group_id) queueDialogueGroup(event.dialogue_group_id);
      const rewardText = applyCohabReward(event, epilogue);
      addLog("同住周常", `${npcName(epilogue.npc_id)} · ${event.event_name}：${rewardText}。`);
      recordCohabHistory("weekly", epilogue, event.event_name, rewardText);
      complete(`cohab_weekly_${event.weekly_event_id}`);
      triggered += 1;
    }
  }
  return triggered;
}
