export function spiritEventStageLabelData(stage = "intro") {
  const labels = {
    intro: "初见",
    evolve: "二阶进化",
    final: "终章陪伴",
  };
  return labels[stage] || stage;
}

export function spiritEventOwnedSpiritData(event, options = {}) {
  if (!event) return null;
  const spirits = options.spirits || [];
  const spiritLine = typeof options.spiritLine === "function" ? options.spiritLine : () => "spirit_line_luobo";
  return spirits.find((spirit) => (spirit.lineId || spiritLine(spirit.id)) === event.spirit_line_id) || null;
}

export function spiritEventUpgradeConfigData(event, spirits = []) {
  if (!event) return null;
  return spirits.find((entry) => entry.spirit_id === event.spirit_id)
    || spirits.find((entry) => entry.spirit_line_id === event.spirit_line_id && entry.stage === (event.event_stage === "final" ? "3" : event.event_stage === "evolve" ? "2" : "1"))
    || null;
}

export function spiritUpgradeSnapshotData(spirit, options = {}) {
  if (!spirit) return null;
  const spiritStageNumber = typeof options.spiritStageNumber === "function" ? options.spiritStageNumber : () => 1;
  return {
    id: spirit.id,
    name: spirit.name,
    workRangeX: spirit.workRangeX,
    workRangeY: spirit.workRangeY,
    stage: spiritStageNumber(spirit),
  };
}

export function spiritEventReadyData(event, options = {}) {
  const state = options.state || {};
  const conditionMet = typeof options.conditionMet === "function" ? options.conditionMet : () => true;
  const currentTermId = typeof options.currentTermId === "function" ? options.currentTermId : () => "";
  if (state.completedSpiritEvents?.has?.(event.spirit_event_id)) return false;
  const condition = event.trigger_condition || "";
  if (condition === "first_spirit_birth") return state.spirits?.some?.((spirit) => spirit.lineId === event.spirit_line_id) || false;
  if (condition === "first_auto_water_complete") return state.completed?.has?.("assist") || false;
  if (condition === "first_fire_machine_assign") return state.completed?.has?.("machine") || state.builtBuildings?.has?.("build_furnace_001") || false;
  if (condition === "first_auto_storage_complete") return state.builtBuildings?.has?.("build_storage_001") || false;
  if (condition === "first_cloth_recipe_complete") return (state.completed?.has?.("craft") || false) && String(state.shopShelfTheme || "").includes("gift");
  if (condition === "storage_box_count_2") return Number(state.builtBuildings?.size || 0) >= 3;
  if (condition === "has_dungeon_runs_5") return Number(state.dungeonClears?.size || 0) > 0 || state.completed?.has?.("dungeon_explore") || false;
  if (condition === "has_faction_order_active") return state.tradeRuns?.some?.((run) => run.status === "traveling") || state.completed?.has?.("trade_route_start") || false;
  if (condition.startsWith("current_term_")) return currentTermId() === `term_${condition.replace("current_term_", "")}`;
  if (condition.includes("chapter_3_complete")) {
    return state.completed?.has?.("chapter_3_complete")
      || state.completed?.has?.("fire_core_restored")
      || state.defeatedBosses?.has?.("boss_chiyan_xiehou")
      || state.claimedQuestRewards?.has?.("quest_main_0302_shanghui_laike")
      || false;
  }
  if (condition.includes("quest_main_0402")) return state.completed?.has?.("repair") || Number(state.dungeonClears?.size || 0) > 0 || false;
  if (condition.includes("quest_main_0403")) return state.completed?.has?.("solar_trial_complete") || Number(state.completedSolarTrials?.size || 0) > 0 || false;
  return conditionMet(condition);
}

export function spiritEventRewardTextData(event, options = {}) {
  const itemName = typeof options.itemName === "function" ? options.itemName : (itemId) => itemId;
  if (event.reward_type === "item") return itemName(event.reward_param);
  if (event.reward_type === "scene") return `演出 ${event.reward_param}`;
  if (event.reward_type === "buff") return `记忆效果 ${event.reward_param}`;
  return `${event.reward_type} ${event.reward_param}`;
}

export function spiritEventTriggerHintData(event, options = {}) {
  const conditionLabel = typeof options.conditionLabel === "function" ? options.conditionLabel : (condition) => condition;
  const localize = typeof options.localize === "function" ? options.localize : (key, fallback = key) => fallback;
  const solarTermsById = options.solarTermsById || new Map();
  const condition = String(event?.trigger_condition || "");
  if (!condition) return "继续推进洞天日常";
  if (condition === "first_spirit_birth") return "收获第一只作物精怪后会自动接上";
  if (condition === "first_auto_water_complete") return "先让精怪完成一次自动浇水";
  if (condition === "first_fire_machine_assign") return "先给工坊点起第一台火位";
  if (condition === "first_auto_storage_complete") return "先把仓房和自动入库接上";
  if (condition === "first_cloth_recipe_complete") return "先做出第一张布料配方并接上礼品主题";
  if (condition === "storage_box_count_2") return "继续扩仓，让仓位真正忙起来";
  if (condition === "has_dungeon_runs_5") return "再去几趟秘境，让护卫经验成型";
  if (condition === "has_faction_order_active") return "先让商路和势力订单真正跑起来";
  if (condition.startsWith("current_term_")) {
    const termId = `term_${condition.replace("current_term_", "")}`;
    const term = solarTermsById.get(termId);
    return `等到 ${localize(term?.term_name_key, termId)} 时节再来`;
  }
  if (condition.includes("chapter_3_complete")) return "推进第三章主线，等火位与终章前置接上";
  if (condition.includes("quest_main_0402")) return "推进第四章前段，让灵渠与水线接上";
  if (condition.includes("quest_main_0403")) return "推进终阵前的试炼与宴席准备";
  return conditionLabel(condition);
}

export function spiritEventSceneReadyData(event, cutsceneShots) {
  const shotsFor = typeof cutsceneShots === "function" ? cutsceneShots : () => [];
  return Boolean(event?.reward_type === "scene" && shotsFor(event.reward_param).length > 0);
}
