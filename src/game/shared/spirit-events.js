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

export function spiritEventGoalRowsData(limit = 6, options = {}) {
  const data = options.data || {};
  const state = options.state || {};
  const localize = typeof options.localize === "function" ? options.localize : (key, fallback = key) => fallback;
  const spiritLine = typeof options.spiritLine === "function" ? options.spiritLine : () => "spirit_line_luobo";
  const spiritEventReady = typeof options.spiritEventReady === "function" ? options.spiritEventReady : () => false;
  const spiritEventSceneReady = typeof options.spiritEventSceneReady === "function" ? options.spiritEventSceneReady : () => false;
  const spiritEventStageLabel = typeof options.spiritEventStageLabel === "function" ? options.spiritEventStageLabel : spiritEventStageLabelData;
  const spiritEventTriggerHint = typeof options.spiritEventTriggerHint === "function" ? options.spiritEventTriggerHint : () => "继续推进洞天日常";
  const spiritEvents = data.spiritEvents || [];
  const spiritEventsByLine = data.spiritEventsByLine || new Map();
  const spiritCatalog = data.spirits || [];
  const completedSpiritEvents = state.completedSpiritEvents || new Set();
  const ownedSpirits = state.spirits || [];
  const lineIds = [...new Set(spiritEvents.map((event) => event.spirit_line_id))];
  return lineIds.map((lineId) => {
    const events = (spiritEventsByLine.get(lineId) || [])
      .slice()
      .sort((a, b) => Number(["intro", "evolve", "final"].indexOf(a.event_stage)) - Number(["intro", "evolve", "final"].indexOf(b.event_stage)));
    const ownedSpirit = ownedSpirits.find((spirit) => (spirit.lineId || spiritLine(spirit.id)) === lineId) || null;
    const baseConfig = spiritCatalog.find((entry) => entry.spirit_line_id === lineId && Number(entry.stage || 1) === 1)
      || spiritCatalog.find((entry) => entry.spirit_line_id === lineId)
      || null;
    const completedEvents = events.filter((event) => completedSpiritEvents.has(event.spirit_event_id));
    const readyEvent = events.find(spiritEventReady) || null;
    const nextEvent = events.find((event) => !completedSpiritEvents.has(event.spirit_event_id)) || null;
    const replayEvent = events.find((event) => completedSpiritEvents.has(event.spirit_event_id) && spiritEventSceneReady(event)) || null;
    const stateClass = completedEvents.length >= events.length
      ? "done"
      : readyEvent
        ? "ready"
        : ownedSpirit
          ? "pending"
          : "locked";
    const headline = readyEvent
      ? `${spiritEventStageLabel(readyEvent.event_stage)}可触发`
      : nextEvent
        ? `下一步：${spiritEventStageLabel(nextEvent.event_stage)}`
        : "伙伴线已收录完成";
    const detail = readyEvent
      ? `${localize(readyEvent.dialogue_key, readyEvent.note)} · ${spiritEventSceneReady(readyEvent) ? "完成后会收进一段进化镜头。" : "完成后会写进伙伴记忆。"}`
      : nextEvent
        ? spiritEventTriggerHint(nextEvent)
        : replayEvent
          ? "这段进化镜头已经收进年鉴，随时可以回看。"
          : "这一条伙伴线已经从初见走到终章陪伴。";
    return {
      lineId,
      spiritName: ownedSpirit?.name || localize(baseConfig?.spirit_name_key, lineId.replace("spirit_line_", "")),
      ownedSpirit,
      events,
      completedEvents,
      readyEvent,
      nextEvent,
      replayEvent,
      stateClass,
      headline,
      detail,
    };
  })
    .sort((a, b) => {
      const score = (row) => (row.readyEvent ? 30 : 0) + (row.ownedSpirit ? 10 : 0) + row.completedEvents.length;
      return score(b) - score(a);
    })
    .slice(0, limit);
}

const SPIRIT_FINALE_COMPANION_LINE_SPECS = {
  spirit_line_luobo: {
    title: "田心共守",
    anchorLabel: "田心土息",
    sceneText: "田垄边多了一圈厚实土光，成熟作物像被人从根上托住。",
    effectText: "农田终章：修复与成熟节奏更稳",
    nextDetail: "睡前回应它，田心土息会在主画面继续亮着。",
    glyph: "田",
    accent: "#286f58",
  },
  spirit_line_lajiao: {
    title: "镇火看灶",
    anchorLabel: "灶口镇火",
    sceneText: "工坊火口旁留下小小镇火纹，灶声比以前稳了半拍。",
    effectText: "工坊终章：火位事故被压到更低",
    nextDetail: "让它守着工坊，灶火会像有人看着一样安分。",
    glyph: "火",
    accent: "#be4f37",
  },
  spirit_line_suan: {
    title: "夜巡剑弧",
    anchorLabel: "院门剑线",
    sceneText: "篱笆外多出一圈淡淡剑弧，夜风吹过也不再空。",
    effectText: "巡逻终章：夜间风险有了长期护线",
    nextDetail: "点它回应一下，院门那道剑线会继续替洞天值夜。",
    glyph: "巡",
    accent: "#8f5f3f",
  },
  spirit_line_shui: {
    title: "灵渠共息",
    anchorLabel: "水脉常明",
    sceneText: "旧渠口浮着一盏水灯，灵田和终阵之间终于接上了气。",
    effectText: "水线终章：灌溉与终阵水脉稳定",
    nextDetail: "让它留在水线旁，灵渠会在画面里保持常明。",
    glyph: "水",
    accent: "#4d91a6",
  },
  spirit_line_yunshu: {
    title: "云仓守店",
    anchorLabel: "云箱账路",
    sceneText: "仓门外排起云箱小径，旧铺和仓房之间有了固定跑线。",
    effectText: "仓店终章：批量整理和店铺补货更连贯",
    nextDetail: "点点它，云箱账路会继续提示仓店联动。",
    glyph: "箱",
    accent: "#8f9c9a",
  },
  spirit_line_bucao: {
    title: "宴锦常明",
    anchorLabel: "锦灯门面",
    sceneText: "节庆灯棚边垂下一条流霞锦，旧铺门面终于有了体面。",
    effectText: "节庆终章：宴席与礼品主题更有表现力",
    nextDetail: "摸摸它，锦灯门面会在洞天里继续发光。",
    glyph: "锦",
    accent: "#d87f8d",
  },
};

export function spiritFinalEventForLineData(lineId = "", spiritEventsByLine = new Map()) {
  return (spiritEventsByLine.get(lineId) || []).find((event) => event.event_stage === "final") || null;
}

export function spiritFinaleCompanionSpecData(spirit, options = {}) {
  if (!spirit) return null;
  const spiritLine = typeof options.spiritLine === "function" ? options.spiritLine : () => "spirit_line_luobo";
  const spiritFinalEventForLine = typeof options.spiritFinalEventForLine === "function" ? options.spiritFinalEventForLine : () => null;
  const spiritVisualProfile = typeof options.spiritVisualProfile === "function" ? options.spiritVisualProfile : () => ({ glyph: "灵", accent: "#7ebf8e", glow: "rgba(126, 191, 142, 0.3)" });
  const areaName = typeof options.areaName === "function" ? options.areaName : (areaId) => areaId;
  const localize = typeof options.localize === "function" ? options.localize : (key, fallback = key) => fallback;
  const spiritEventRewardText = typeof options.spiritEventRewardText === "function" ? options.spiritEventRewardText : () => "";
  const spiritStageNumber = typeof options.spiritStageNumber === "function" ? options.spiritStageNumber : () => 1;
  const spiritStageLabel = typeof options.spiritStageLabel === "function" ? options.spiritStageLabel : (stage) => `阶段 ${stage}`;
  const completedSpiritEvents = options.completedSpiritEvents || new Set();
  const spiritMemoryByEvent = options.spiritMemoryByEvent || new Map();
  const lineId = spirit.lineId || spiritLine(spirit.id);
  const event = spiritFinalEventForLine(lineId);
  if (!event || !completedSpiritEvents.has(event.spirit_event_id)) return null;
  const profile = spiritVisualProfile(spirit);
  const memory = spiritMemoryByEvent.get(event.spirit_event_id);
  const spec = SPIRIT_FINALE_COMPANION_LINE_SPECS[lineId] || {
    title: "终章共守",
    anchorLabel: "洞天常驻",
    sceneText: "这只精怪把自己的岗位真正留在洞天里。",
    effectText: "伙伴终章：岗位与陪伴进入长期状态",
    nextDetail: "摸摸它，让这段终章陪伴继续留在主画面。",
    glyph: profile.glyph || "灵",
    accent: profile.accent,
  };
  return {
    ...spec,
    spiritId: spirit.id,
    spiritName: spirit.name,
    lineId,
    eventId: event.spirit_event_id,
    areaLabel: areaName(event.area_id),
    dialogueText: localize(event.dialogue_key, event.note),
    rewardText: spiritEventRewardText(event),
    memoryText: memory ? `记忆 ${memory.memory_flag_id}` : "终章记忆已收束",
    profile,
    accent: spec.accent || profile.accent,
    glow: profile.glow,
    stageLabel: spiritStageLabel(spiritStageNumber(spirit)),
  };
}

export function spiritFinaleCompanionSpecsData(spirits = [], spiritFinaleCompanionSpec) {
  const specFor = typeof spiritFinaleCompanionSpec === "function" ? spiritFinaleCompanionSpec : () => null;
  return spirits.map(specFor).filter(Boolean);
}

const SPIRIT_FINALE_EFFECT_ROW_SPECS = [
  {
    lineId: "spirit_line_luobo",
    key: "farmGrowthBonus",
    shortTitle: "根环催苗",
    fallbackSpirit: "萝卜精",
    loopLabel: "农田",
    effectLabel: "成长",
    panel: "farm",
    accent: "#7ba66c",
    detail: "夜间成长倍率提高，偶数夜会替未照料地块补一圈根须护田。",
  },
  {
    lineId: "spirit_line_shui",
    key: "waterCareBonus",
    shortTitle: "水滴巡田",
    fallbackSpirit: "水滴精",
    loopLabel: "农田",
    effectLabel: "水生照料",
    panel: "farm",
    accent: "#4d91a6",
    detail: "水生作物入夜视为被照料，雨水不足时也能续住一口灵水。",
  },
  {
    lineId: "spirit_line_lajiao",
    key: "workshopSpeedBonus",
    shortTitle: "灶火添星",
    fallbackSpirit: "辣椒精",
    loopLabel: "工坊",
    effectLabel: "效率",
    panel: "workshop",
    accent: "#be4f37",
    detail: "后厂排产和出锅结算速度提升，火候看板会直接计入效率。",
  },
  {
    lineId: "spirit_line_suan",
    key: "patrolGuardBonus",
    shortTitle: "夜巡剑弧",
    fallbackSpirit: "蒜头精",
    loopLabel: "巡逻",
    effectLabel: "守护",
    panel: "patrol",
    accent: "#d8c27a",
    detail: "入夜风险更容易被巡逻灵纹提前压下，未化解时也会减轻损失。",
  },
  {
    lineId: "spirit_line_yunshu",
    key: "shopBudgetBonus",
    shortTitle: "云箱账路",
    fallbackSpirit: "云薯精",
    loopLabel: "旧铺",
    effectLabel: "预算",
    panel: "shop",
    accent: "#8f9c9a",
    detail: "开铺时顾客有效预算提高，仓店联动让客人更敢下单。",
  },
  {
    lineId: "spirit_line_bucao",
    key: "festivalThemeBonus",
    shortTitle: "锦灯门面",
    fallbackSpirit: "补草精",
    loopLabel: "旧铺",
    effectLabel: "礼宴主题",
    panel: "shop",
    accent: "#d87f8d",
    detail: "礼品/宴席主题更容易成型，礼品货架还会额外吸引一位顾客。",
  },
];

export function spiritFinaleEffectSummaryData(spiritFinaleCompanionSpecs) {
  const specs = typeof spiritFinaleCompanionSpecs === "function" ? spiritFinaleCompanionSpecs() : [];
  const hasLine = (lineId) => specs.some((spec) => spec.lineId === lineId);
  const lines = new Set(specs.map((spec) => spec.lineId));
  const effects = {
    specs,
    lines,
    count: specs.length,
    farmGrowthBonus: hasLine("spirit_line_luobo") ? 0.08 : 0,
    waterCareBonus: hasLine("spirit_line_shui") ? 0.12 : 0,
    workshopSpeedBonus: hasLine("spirit_line_lajiao") ? 0.08 : 0,
    patrolGuardBonus: hasLine("spirit_line_suan") ? 0.12 : 0,
    shopBudgetBonus: hasLine("spirit_line_yunshu") ? 0.06 : 0,
    festivalThemeBonus: hasLine("spirit_line_bucao") ? 0.08 : 0,
  };
  effects.any = effects.count > 0;
  effects.totalLoopBonus = effects.farmGrowthBonus
    + effects.waterCareBonus
    + effects.workshopSpeedBonus
    + effects.patrolGuardBonus
    + effects.shopBudgetBonus
    + effects.festivalThemeBonus;
  effects.labels = specs.map((spec) => `${spec.spiritName}·${spec.anchorLabel}`);
  effects.text = specs.length
    ? specs.map((spec) => `${spec.anchorLabel}：${spec.effectText.replace(/^[^：]+：/, "")}`).join("；")
    : "";
  return effects;
}

export function spiritFinaleEffectRowsData(effects = {}, options = {}) {
  const percentText = typeof options.percentText === "function" ? options.percentText : (value) => `${Math.round(Number(value || 0) * 100)}%`;
  const specByLine = new Map((effects.specs || []).map((spec) => [spec.lineId, spec]));
  return SPIRIT_FINALE_EFFECT_ROW_SPECS.map((row) => {
    const spec = specByLine.get(row.lineId);
    const value = Number(effects[row.key] || 0);
    const active = value > 0;
    return {
      ...row,
      value,
      active,
      spiritName: spec?.spiritName || row.fallbackSpirit,
      anchorLabel: spec?.anchorLabel || row.shortTitle,
      label: spec ? `${spec.spiritName}·${spec.anchorLabel}` : `${row.fallbackSpirit}·${row.shortTitle}`,
      valueText: active ? `${row.effectLabel} +${percentText(value)}` : "终章未收束",
      accent: spec?.accent || row.accent,
    };
  });
}

export function spiritFinaleEffectPanelRowsData(effects = {}, panel = "", spiritFinaleEffectRows) {
  const rowsFor = typeof spiritFinaleEffectRows === "function" ? spiritFinaleEffectRows : spiritFinaleEffectRowsData;
  return rowsFor(effects).filter((row) => row.active && (!panel || row.panel === panel));
}

export function spiritFinaleEffectCompactTextData(effects = {}, limit = 3, spiritFinaleEffectRows) {
  const rowsFor = typeof spiritFinaleEffectRows === "function" ? spiritFinaleEffectRows : spiritFinaleEffectRowsData;
  const rows = Array.isArray(effects?.rows)
    ? effects.rows.filter((row) => row.active !== false && Number(row.value || 0) > 0)
    : rowsFor(effects).filter((row) => row.active);
  if (rows.length === 0) return "";
  const shown = rows.slice(0, limit).map((row) => `${row.shortTitle}：${row.valueText}`);
  const more = rows.length > limit ? `；另有 ${rows.length - limit} 条常驻线` : "";
  return `${shown.join("；")}${more}`;
}

export function spiritFinaleEffectPanelTextData(effects = {}, panel = "", limit = 2, options = {}) {
  const spiritFinaleEffectPanelRows = typeof options.spiritFinaleEffectPanelRows === "function" ? options.spiritFinaleEffectPanelRows : spiritFinaleEffectPanelRowsData;
  const rows = Array.isArray(effects?.rows)
    ? effects.rows.filter((row) => row.active !== false && Number(row.value || 0) > 0 && (!panel || row.panel === panel))
    : spiritFinaleEffectPanelRows(effects, panel);
  if (rows.length === 0) return "";
  const shown = rows.slice(0, limit).map((row) => `${row.shortTitle}：${row.valueText}`);
  const more = rows.length > limit ? `；另有 ${rows.length - limit} 条` : "";
  return `${shown.join("；")}${more}`;
}

export function spiritFinaleEffectSnapshotData(effects = {}, options = {}) {
  if (!effects) return null;
  const spiritFinaleEffectRows = typeof options.spiritFinaleEffectRows === "function" ? options.spiritFinaleEffectRows : spiritFinaleEffectRowsData;
  const spiritFinaleEffectCompactText = typeof options.spiritFinaleEffectCompactText === "function" ? options.spiritFinaleEffectCompactText : spiritFinaleEffectCompactTextData;
  const rows = Array.isArray(effects.rows)
    ? effects.rows.filter((row) => row.active !== false && Number(row.value || 0) > 0).map((row) => ({ ...row, active: true }))
    : spiritFinaleEffectRows(effects).filter((row) => row.active);
  if (rows.length === 0) return null;
  const totalLoopBonus = Number(effects.totalLoopBonus || rows.reduce((sum, row) => sum + Number(row.value || 0), 0));
  return {
    count: Number(effects.count || rows.length),
    labels: Array.isArray(effects.labels) && effects.labels.length ? [...effects.labels] : rows.map((row) => row.label),
    text: effects.text || rows.map((row) => `${row.anchorLabel}：${row.detail}`).join("；"),
    rows,
    farmGrowthBonus: Number(effects.farmGrowthBonus || 0),
    waterCareBonus: Number(effects.waterCareBonus || 0),
    workshopSpeedBonus: Number(effects.workshopSpeedBonus || 0),
    patrolGuardBonus: Number(effects.patrolGuardBonus || 0),
    shopBudgetBonus: Number(effects.shopBudgetBonus || 0),
    festivalThemeBonus: Number(effects.festivalThemeBonus || 0),
    totalLoopBonus,
    headline: `终章伙伴常驻 ${rows.length}/6`,
    detail: spiritFinaleEffectCompactText({ rows }, 4),
  };
}
