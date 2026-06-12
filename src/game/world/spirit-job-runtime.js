const SPIRIT_JOB_IDS = ["farm", "workshop", "shop", "patrol", "expedition", "garden"];

export function ensureSpiritJobsRuntime(spirit = null) {
  if (!spirit) return null;
  if (!spirit.job) spirit.job = "farm";
  if (!spirit.jobExp) spirit.jobExp = {};
  if (!spirit.jobLevels) spirit.jobLevels = {};
  for (const job of SPIRIT_JOB_IDS) {
    if (!spirit.jobExp[job]) spirit.jobExp[job] = 0;
    if (!spirit.jobLevels[job]) spirit.jobLevels[job] = 0;
  }
  return spirit;
}

export function jobLevelForRuntime(job, exp, masteryRows = []) {
  const levels = masteryRows
    .filter((entry) => entry.job_type === job)
    .sort((a, b) => Number(a.level) - Number(b.level));
  let level = 0;
  for (const entry of levels) {
    if (exp >= Number(entry.exp_required || 0)) level = Number(entry.level || 0);
  }
  return level;
}

export function jobEfficiencyRuntime(spirit, job = spirit?.job || "farm", {
  masteryRows = [],
  finale = {},
  memoryBonusForScope = () => 0,
  specialtyBonus = () => 0,
} = {}) {
  if (!spirit) return 1;
  ensureSpiritJobsRuntime(spirit);
  const level = spirit.jobLevels[job] || 0;
  const config = masteryRows
    .filter((entry) => entry.job_type === job && Number(entry.level) <= Math.max(1, level))
    .sort((a, b) => Number(b.level) - Number(a.level))[0];
  const memoryBonus = job === "farm"
    ? memoryBonusForScope("farm") * 0.02
    : job === "workshop"
      ? memoryBonusForScope("machine") * 0.02
      : job === "shop"
        ? memoryBonusForScope("shop") * 0.02
        : 0;
  const finaleBonus = job === "farm"
    ? Number(finale.farmGrowthBonus || 0) + Number(finale.waterCareBonus || 0) * 0.35
    : job === "workshop"
      ? Number(finale.workshopSpeedBonus || 0)
      : job === "shop"
        ? Number(finale.shopBudgetBonus || 0) + Number(finale.festivalThemeBonus || 0) * 0.45
        : job === "patrol"
          ? Number(finale.patrolGuardBonus || 0)
          : job === "garden"
            ? Number(finale.festivalThemeBonus || 0) * 0.25
            : 0;
  return 1 + Number(config?.efficiency_bonus || 0) + Math.max(0, level - 1) * 0.02 + memoryBonus + finaleBonus + specialtyBonus(spirit, job);
}

export function spiritJobWorkPowerRuntime(spirit, job = spirit?.job || "farm", {
  jobEfficiency = () => 1,
} = {}) {
  if (!spirit) return 0;
  const staminaFactor = Math.max(0.42, Math.min(1.2, Number(spirit.stamina || 0) / 86));
  const moodFactor = Math.max(0.5, Math.min(1.18, Number(spirit.mood || 0) / 82));
  const hungerFactor = Math.max(0.38, Math.min(1.08, Number(spirit.hunger || 0) / 76));
  return jobEfficiency(spirit, job) * staminaFactor * moodFactor * hungerFactor;
}

export function spendSpiritJobNeedsRuntime(spirit, job) {
  if (!spirit) return null;
  const cost = {
    farm: [9, 4, 5],
    workshop: [10, 5, 6],
    shop: [8, 3, 5],
    patrol: [8, 2, 4],
    expedition: [12, 5, 7],
    garden: [6, -3, 3],
  }[job] || [8, 3, 4];
  spirit.stamina = Math.max(0, Number(spirit.stamina || 0) - cost[0]);
  spirit.mood = Math.max(0, Math.min(100, Number(spirit.mood || 0) - cost[1]));
  spirit.hunger = Math.max(0, Number(spirit.hunger || 0) - cost[2]);
  spirit.assignments = (spirit.assignments || 0) + 1;
  return spirit;
}

export function spiritConfigForRuntime(spirit = null, spiritRows = []) {
  return spiritRows.find((entry) => entry.spirit_id === spirit?.id);
}

export function spiritMainJobRuntime(spirit = null, {
  spiritRows = [],
} = {}) {
  const config = spiritConfigForRuntime(spirit, spiritRows);
  const roleMap = {
    farm: "farm",
    workshop: "workshop",
    shop: "shop",
    expedition: "expedition",
    patrol: "patrol",
    garden: "garden",
    combat: "expedition",
    utility: "patrol",
  };
  return roleMap[config?.main_role] || "farm";
}

export function spiritLineJobAffinityRuntime(spirit = null, job = spirit?.job || "farm", {
  spiritLine = () => "",
} = {}) {
  const lineId = spirit?.lineId || spiritLine(spirit?.id);
  const affinityMap = {
    spirit_line_luobo: { farm: 0.08 },
    spirit_line_lajiao: { workshop: 0.1 },
    spirit_line_shui: { farm: 0.1, garden: 0.04 },
    spirit_line_yunshu: { patrol: 0.08, expedition: 0.04 },
    spirit_line_bucao: { workshop: 0.08, farm: 0.04 },
    spirit_line_caikuang: { expedition: 0.1, patrol: 0.04 },
    spirit_line_jieqi: { patrol: 0.08, garden: 0.06 },
    spirit_line_meishi: { workshop: 0.08, shop: 0.04 },
    spirit_line_yaoyuan: { farm: 0.08, workshop: 0.04 },
    spirit_line_hualing: { shop: 0.12, garden: 0.04 },
    spirit_line_leizhu: { expedition: 0.12, patrol: 0.04 },
    spirit_line_yuelian: { garden: 0.12, farm: 0.04 },
    spirit_line_dengying: { patrol: 0.12, expedition: 0.04 },
    spirit_line_shuqi: { shop: 0.1, patrol: 0.04 },
    spirit_line_fengmi: { farm: 0.1, shop: 0.04 },
  };
  return Number(affinityMap[lineId]?.[job] || 0);
}

export function spiritJobSpecialtyBonusRuntime(spirit = null, job = spirit?.job || "farm", {
  spiritRows = [],
  spiritLine = () => "",
} = {}) {
  if (!spirit) return 0;
  const mainBonus = spiritMainJobRuntime(spirit, { spiritRows }) === job ? 0.16 : 0;
  const lineBonus = spiritLineJobAffinityRuntime(spirit, job, { spiritLine });
  const stageBonus = Math.max(0, Number((String(spirit.id || "").match(/_(\d+)$/) || [0, 1])[1]) - 1) * 0.03;
  return mainBonus + lineBonus + stageBonus;
}

export function spiritJobSpecialtyLabelRuntime(spirit = null, job = spirit?.job || "farm", {
  spiritRows = [],
  spiritLine = () => "",
  jobName = (jobId = "") => jobId,
} = {}) {
  if (!spirit) return "";
  const mainJob = spiritMainJobRuntime(spirit, { spiritRows });
  const bonus = spiritJobSpecialtyBonusRuntime(spirit, job, { spiritRows, spiritLine });
  const lineBonus = spiritLineJobAffinityRuntime(spirit, job, { spiritLine });
  if (mainJob === job && lineBonus > 0) return `天赋契合 ${jobName(job)} +${Math.round(bonus * 100)}%`;
  if (mainJob === job) return `主职${jobName(job)} +${Math.round(bonus * 100)}%`;
  if (lineBonus > 0) return `副专长${jobName(job)} +${Math.round(bonus * 100)}%`;
  return `主职偏向${jobName(mainJob)}，当前无专长加成`;
}

export function spiritStageNumberRuntime(spirit = null, {
  spiritRows = [],
} = {}) {
  const config = spiritConfigForRuntime(spirit, spiritRows);
  const suffixStage = Number((String(spirit?.id || "").match(/_(\d+)$/) || [0, 1])[1] || 1);
  return Math.max(1, Number(config?.stage || suffixStage || 1));
}

export function spiritStageLabelRuntime(stage = 1) {
  if (Number(stage) >= 3) return "三阶究极";
  if (Number(stage) >= 2) return "二阶进化";
  return "一阶初生";
}

export function spiritWorkRangeSpecRuntime(spirit = null, job = spirit?.job || "farm", {
  spiritRows = [],
  spiritLine = () => "",
} = {}) {
  const config = spiritConfigForRuntime(spirit, spiritRows);
  const lineId = config?.spirit_line_id || spirit?.lineId || spiritLine(spirit?.id);
  const stage = spiritStageNumberRuntime(spirit, { spiritRows });
  const rangeX = Math.max(1, Number(spirit?.workRangeX || config?.work_range_x || 1));
  const rangeY = Math.max(1, Number(spirit?.workRangeY || config?.work_range_y || 1));
  const previousConfig = spiritRows.find((entry) => entry.spirit_line_id === lineId && Number(entry.stage || 1) === stage - 1);
  const nextConfig = spiritRows.find((entry) => entry.spirit_line_id === lineId && Number(entry.stage || 1) === stage + 1);
  const previousRangeX = Math.max(1, Number(previousConfig?.work_range_x || rangeX));
  const previousRangeY = Math.max(1, Number(previousConfig?.work_range_y || rangeY));
  const nextRangeX = Math.max(1, Number(nextConfig?.work_range_x || rangeX));
  const nextRangeY = Math.max(1, Number(nextConfig?.work_range_y || rangeY));
  const area = rangeX * rangeY;
  const previousArea = previousRangeX * previousRangeY;
  const deltaCells = Math.max(0, area - previousArea);
  const workPower = Number(config?.work_power_base || 1);
  const previousPower = Number(previousConfig?.work_power_base || workPower);
  const powerGain = Math.max(0, workPower - previousPower);
  const jobHintMap = {
    farm: "田间自动照看范围",
    workshop: "后厂投料与看火范围",
    shop: "货架补货与迎客范围",
    patrol: "夜巡灯线覆盖范围",
    expedition: "商路探旗响应范围",
    garden: "庭院安抚灵息范围",
  };
  const deltaText = stage >= 2 && deltaCells > 0
    ? `比上一阶多 ${deltaCells} 格，基础工力 +${Math.round(powerGain * 100)}%`
    : nextConfig
      ? `下一阶可扩到 ${nextRangeX}x${nextRangeY}`
      : "范围已稳定成型";
  const nextText = nextConfig
    ? `下一阶预览：${nextRangeX}x${nextRangeY} · 工力 ${Number(nextConfig.work_power_base || workPower).toFixed(2)}`
    : "已到当前配置最高阶，范围表现会持续留在场景中";
  return {
    stage,
    stageName: spiritStageLabelRuntime(stage),
    rangeX,
    rangeY,
    area,
    previousRangeX,
    previousRangeY,
    deltaCells,
    workPower,
    powerGain,
    rangeLabel: `${rangeX}x${rangeY} 覆盖`,
    jobHint: jobHintMap[job] || "岗位覆盖范围",
    deltaText,
    nextText,
    evolved: stage >= 2,
  };
}

export function spiritJobReportByJobRuntime(report = []) {
  return report.reduce((map, entry) => {
    const job = entry.job || "farm";
    if (!map.has(job)) map.set(job, []);
    map.get(job).push(entry);
    return map;
  }, new Map());
}

export function spiritJobSynergyLineRuntime(id, jobs, reportByJob, {
  state = {},
  addItem = () => null,
  itemName = (itemId = "") => itemId,
} = {}) {
  const entries = jobs.map((job) => reportByJob.get(job)?.[0]).filter(Boolean);
  if (entries.length < jobs.length) return null;
  const names = entries.map((entry) => entry.spirit).join(" + ");
  const baseImpact = entries.reduce((sum, entry) => sum + Math.max(0, Number(entry.impact || 0)), 0);
  const impact = Math.max(1, Math.round(baseImpact / Math.max(1, entries.length)));
  const spec = {
    farm_workshop: {
      label: "清晨备料链",
      title: "田垄把露水递进灶口",
      detail: `${names}把夜里补下的水和新鲜边料接进工坊，明早第一锅不再冷启动。`,
      reward: () => {
        addItem("item_material_clean_water", 1);
        const job = (state.workshopQueue || []).find((entry) => Number(entry.remainingWork || 0) > 0);
        if (job) job.remainingWork = Math.max(0, Number(job.remainingWork || 0) - 6);
        return job ? `${itemName("item_material_clean_water")} x1 · 工坊工时 -6` : `${itemName("item_material_clean_water")} x1`;
      },
      accent: "#4d91a6",
      glyph: "露",
      focus: "农田 -> 工坊",
    },
    workshop_shop: {
      label: "出锅上架链",
      title: "灶火直接烘热旧铺货签",
      detail: `${names}把工坊香气接到旧铺门口，熟客知道明早有热货可看。`,
      reward: () => {
        state.gold += 12;
        state.fame += 1;
        state.shopReport = [
          { name: "岗位协作", text: "工坊香气接上旧铺货签，熟客预订 +12 灵石。", reason: "spirit_synergy", detail: "出锅上架链 · 声望 +1" },
          ...(state.shopReport || []).slice(0, 5),
        ];
        return "灵石 +12 · 声望 +1";
      },
      accent: "#b47d2f",
      glyph: "签",
      focus: "工坊 -> 店铺",
    },
    shop_patrol: {
      label: "夜市护客链",
      title: "灯线沿着铺门走了一圈",
      detail: `${names}让夜客敢多停半刻，旧铺门前的安全感也算一种招牌。`,
      reward: () => {
        state.fame += 1;
        state.completed.add("buff_trade_risk_down_next");
        return "声望 +1 · 下次商路风险 -4%";
      },
      accent: "#e0b66d",
      glyph: "灯",
      focus: "店铺 -> 巡逻",
    },
    patrol_expedition: {
      label: "巡路探旗链",
      title: "巡夜灯把远路岔口照亮",
      detail: `${names}把镇口、旧桥和外域小路串成一条安全线，明天派商队会更稳。`,
      reward: () => {
        state.completed.add("buff_trade_risk_down_next");
        addItem("item_tool_signal_flare", 1);
        return `${itemName("item_tool_signal_flare")} x1 · 下次商路风险 -4%`;
      },
      accent: "#e6c65e",
      glyph: "旗",
      focus: "巡逻 -> 远征",
    },
    garden_farm: {
      label: "庭院养田链",
      title: "花息落回田垄",
      detail: `${names}让休息的灵息回到泥里，明早田埂边会有更软的露。`,
      reward: () => {
        const targets = state.plots.filter((plot) => plot.cropId && !plot.mature).slice(0, 2);
        targets.forEach((plot) => { plot.watered = true; });
        return targets.length ? `额外润田 ${targets.length} 格` : "全队心情维持稳定";
      },
      accent: "#7aa25a",
      glyph: "花",
      focus: "庭院 -> 农田",
    },
    garden_shop: {
      label: "花客引路链",
      title: "庭院香气绕到铺门口",
      detail: `${names}把庭院的好心情带到旧铺，明早第一波客人会更愿意听介绍。`,
      reward: () => {
        state.gold += 8;
        state.fame += 1;
        return "灵石 +8 · 声望 +1";
      },
      accent: "#d87f8d",
      glyph: "客",
      focus: "庭院 -> 店铺",
    },
  }[id];
  if (!spec) return null;
  return {
    id,
    jobs,
    entries,
    spirits: entries.map((entry) => entry.spirit),
    label: spec.label,
    title: spec.title,
    detail: spec.detail,
    rewardText: spec.reward(),
    accent: spec.accent,
    glyph: spec.glyph,
    focus: spec.focus,
    impact,
    day: state.day,
  };
}

export function applySpiritJobSynergiesRuntime(report = undefined, {
  state = {},
  complete = () => null,
  addLog = () => null,
  spiritJobReportByJob = spiritJobReportByJobRuntime,
  spiritJobSynergyLine = spiritJobSynergyLineRuntime,
  addItem = () => null,
  itemName = (itemId = "") => itemId,
} = {}) {
  const source = Array.isArray(report) ? report : state.lastSpiritJobReport || [];
  const reportByJob = spiritJobReportByJob(source.filter((entry) => Number(entry.impact || 0) > 0));
  const candidates = [
    ["farm_workshop", ["farm", "workshop"]],
    ["workshop_shop", ["workshop", "shop"]],
    ["shop_patrol", ["shop", "patrol"]],
    ["patrol_expedition", ["patrol", "expedition"]],
    ["garden_farm", ["garden", "farm"]],
    ["garden_shop", ["garden", "shop"]],
  ];
  const synergies = [];
  for (const [id, jobs] of candidates) {
    if (synergies.length >= 3) break;
    const synergy = spiritJobSynergyLine(id, jobs, reportByJob, {
      state,
      addItem,
      itemName,
    });
    if (synergy) synergies.push(synergy);
  }
  state.lastSpiritJobSynergy = synergies;
  if (synergies.length > 0) {
    complete("spirit_job_synergy");
    addLog("精怪协作链", synergies.map((entry) => `${entry.label}：${entry.rewardText}`).join("；"));
  }
  return synergies;
}

export function spiritNightWorkFeedbackSpecRuntime(report = [], {
  state = {},
  now = () => 0,
  jobName = (job = "") => job,
  spiritJobPersonaSpec = (spirit = {}, job = spirit.job || "farm") => ({ label: jobName(job), glyph: "灵", focus: "岗位夜勤" }),
  spiritJobStation = (_spirit = {}, jobIndex = 0, globalIndex = 0) => ({ x: 0, y: 0, size: 0, jobIndex, globalIndex }),
  spiritVisualProfile = () => ({ accent: "#286f58", glow: "rgba(246, 240, 182, 0.24)" }),
} = {}) {
  const spirits = Array.isArray(state.spirits) ? state.spirits : [];
  const entries = (Array.isArray(report) ? report : [])
    .slice(0, 6)
    .map((entry, index) => {
      const spirit = spirits.find((candidate) => candidate.name === entry.spirit) || spirits[index] || null;
      const job = entry.job || spirit?.job || "farm";
      const sameJobIndex = spirits
        .slice(0, Math.max(0, spirits.findIndex((candidate) => candidate.id === spirit?.id)))
        .filter((candidate) => (candidate.job || "farm") === job).length;
      const station = spirit ? spiritJobStation({ ...spirit, job }, sameJobIndex, index) : spiritJobStation({ job }, index, index);
      const persona = spirit ? spiritJobPersonaSpec(spirit, job) : { label: jobName(job), glyph: "灵", focus: entry.focus || "岗位夜勤" };
      const profile = spirit ? spiritVisualProfile(spirit) : { accent: "#286f58", glow: "rgba(246, 240, 182, 0.24)" };
      return {
        ...entry,
        spiritId: spirit?.id || "",
        spiritName: entry.spirit || spirit?.name || "精怪",
        job,
        jobName: persona.label || jobName(job),
        glyph: persona.glyph || profile.glyph || "灵",
        focus: entry.focus || persona.focus || "岗位夜勤",
        station,
        accent: profile.accent || "#286f58",
        glow: profile.glow || "rgba(246, 240, 182, 0.24)",
      };
    });
  if (!entries.length) return null;
  const totalImpact = entries.reduce((sum, entry) => sum + Math.max(0, Number(entry.impact || 0)), 0);
  const synergies = (state.lastSpiritJobSynergy || []).slice(0, 3);
  return {
    entries,
    synergies,
    totalImpact,
    headline: synergies.length > 0 ? `精怪夜勤 ${entries.length} 项 · 协作链 ${synergies.length}` : `精怪夜勤 ${entries.length} 项`,
    detail: synergies.length > 0
      ? synergies.map((entry) => `${entry.label}：${entry.rewardText}`).join("；")
      : entries.slice(0, 3).map((entry) => `${entry.spiritName}：${entry.text}`).join("；"),
    createdAt: now(),
    day: state.day,
  };
}

export function spiritJobSynergyForSpiritRuntime(spirit, {
  state = {},
} = {}) {
  if (!spirit) return null;
  return (state.lastSpiritJobSynergy || []).find((entry) =>
    entry.spirits?.includes(spirit.name) || entry.entries?.some((report) => report.spirit === spirit.name),
  ) || null;
}

export function spiritJobSynergyNetworkSpecRuntime(synergies = [], {
  state = {},
  jobName = (job = "") => job,
  spiritJobStation = (_spirit = {}, jobIndex = 0, globalIndex = 0) => ({ x: 0, y: 0, size: 0, jobIndex, globalIndex }),
} = {}) {
  const spirits = Array.isArray(state.spirits) ? state.spirits : [];
  const rows = (Array.isArray(synergies) ? synergies : [])
    .filter(Boolean)
    .slice(0, 3)
    .map((synergy, index) => {
      const nodes = (synergy.entries || [])
        .map((entry, entryIndex) => {
          const spirit = spirits.find((candidate) => candidate.name === entry.spirit);
          const job = entry.job || spirit?.job || synergy.jobs?.[entryIndex] || "farm";
          const spiritIndex = spirits.findIndex((candidate) => candidate.id === spirit?.id);
          const sameJobIndex = spirits
            .slice(0, Math.max(0, spiritIndex))
            .filter((candidate) => (candidate.job || "farm") === job).length;
          const globalIndex = Math.max(entryIndex, spiritIndex);
          const station = spiritJobStation(spirit ? { ...spirit, job } : { job }, sameJobIndex, globalIndex);
          return {
            spiritName: entry.spirit || spirit?.name || "精怪",
            job,
            jobName: jobName(job),
            text: entry.text || "",
            station,
            point: {
              x: station.x + station.size * 0.5,
              y: station.y + station.size * 0.52,
            },
          };
        });
      return {
        ...synergy,
        index,
        nodes,
        points: nodes.map((node) => node.point),
        jobNames: (synergy.jobs || nodes.map((node) => node.job)).map(jobName),
        spiritText: (synergy.spirits || nodes.map((node) => node.spiritName)).join(" + "),
        routeText: synergy.focus || nodes.map((node) => node.jobName).join(" -> "),
        rewardText: synergy.rewardText || "协作收益待结算",
        accent: synergy.accent || "#e0b66d",
      };
    })
    .filter((row) => row.nodes.length >= 2);
  if (!rows.length) return null;
  const jobs = [...new Set(rows.flatMap((row) => row.jobNames))];
  const spiritNames = [...new Set(rows.flatMap((row) => row.nodes.map((node) => node.spiritName)))];
  const nextSuggestion = rows.length >= 3
    ? "昨夜协作已经拉满三条，下一步可以把低心情精怪换去庭院休整，保持连续产线。"
    : "若想再亮一条搭班光轨，试着把农田、工坊、店铺、巡逻或庭院岗位错开安排。";
  return {
    title: "岗位协作网",
    subtitle: `搭班光轨 ${rows.length} 条 · 接力节点 ${spiritNames.length} 只`,
    jobs,
    spirits: spiritNames,
    rows,
    nextSuggestion,
  };
}

export function spiritJobSynergyNetworkMarkupRuntime(spec = null) {
  if (!spec?.rows?.length) return "";
  return `
    <div class="spirit-synergy-network">
      <div class="spirit-synergy-network-head">
        <strong>${spec.title}</strong>
        <span>${spec.subtitle}</span>
      </div>
      <small>覆盖岗位：${spec.jobs.join(" / ")} · ${spec.nextSuggestion}</small>
      ${spec.rows.map((row) => `
        <div class="spirit-synergy-network-row" style="--synergy-accent:${row.accent};">
          <strong>${row.label} · ${row.routeText}</strong>
          <div class="spirit-synergy-network-path">
            ${row.nodes.map((node) => `<span class="spirit-synergy-chip">${node.spiritName}<b>${node.jobName}</b></span>`).join("<i>→</i>")}
          </div>
          <small>协作收益：${row.rewardText}</small>
          <small>接力节点：${row.detail}</small>
        </div>
      `).join("")}
    </div>
  `;
}

export function spiritJobPersonaSpecRuntime(spirit, job = spirit?.job || "farm", {
  state = {},
  workshopFocus = null,
  shopFocus = null,
  riskCount = 0,
  jobName = (jobId = "") => jobId,
  multiplierText = (value = 1) => String(value),
  jobEfficiency = () => 1,
  spiritJobSpecialtyLabel = () => "",
} = {}) {
  const helperName = spirit?.name || "精怪";
  const plots = Array.isArray(state.plots) ? state.plots : [];
  const planted = plots.filter((plot) => plot.cropId);
  const mature = planted.filter((plot) => plot.mature);
  const unwatered = planted.filter((plot) => !plot.watered && !plot.mature);
  const workshopQueue = Array.isArray(state.workshopQueue) ? state.workshopQueue : [];
  const shopReport = Array.isArray(state.shopReport) ? state.shopReport : [];
  const traveling = (state.tradeRuns || []).filter((run) => run.status === "traveling").length;
  const spiritRows = Array.isArray(state.spirits) ? state.spirits : [];
  const gardenMoods = spiritRows.filter((entry) => entry.id !== spirit?.id).map((entry) => Number(entry.mood || 0));
  const lowestMood = gardenMoods.length ? Math.min(...gardenMoods) : Number(spirit?.mood || 0);
  const safeWorkshopFocus = workshopFocus || {};
  const specs = {
    farm: {
      glyph: "水",
      tone: "water",
      action: unwatered.length > 0 ? `巡田补水 ${unwatered.length} 格` : mature.length > 0 ? `守着 ${mature.length} 块成熟田` : planted.length > 0 ? "压稳田垄夜露" : "等你播下新种",
      focus: unwatered.length > 0 ? "缺水灵田" : mature.length > 0 ? "成熟作物" : "灵田土脉",
      advice: unwatered.length > 0 ? "入夜前或交给精怪补水，明早成长更稳。" : mature.length > 0 ? "先收成熟作物，把库存转成工坊原料。" : "继续播种，农田岗才有发挥空间。",
    },
    workshop: {
      glyph: "火",
      tone: "ember",
      action: workshopQueue.length > 0 ? `灶边稳火 ${safeWorkshopFocus.progress}%` : "擦亮锅铲等排产",
      focus: safeWorkshopFocus.outputItemName || "工坊火候",
      advice: workshopQueue.length > 0 ? safeWorkshopFocus.advice : "安排当前配方入夜生产，工坊岗会缩短等待。",
    },
    shop: {
      glyph: "铃",
      tone: "gold",
      action: shopFocus ? `复盘 ${shopFocus.buyers} 单成交` : shopReport.length > 0 ? "整理旧铺反馈" : "练习招客话术",
      focus: shopFocus?.topItemName || shopFocus?.hotTagLabel || "旧铺门口",
      advice: shopFocus?.shelfAdvice || "开铺后会记录顾客为什么买、为什么离开。",
    },
    patrol: {
      glyph: "灯",
      tone: "jade",
      action: riskCount > 0 ? `巡夜盯防 ${riskCount} 条风险` : "沿篱笆巡灯",
      focus: riskCount > 0 ? "节气风险" : "洞天边界",
      advice: riskCount > 0 ? "先处理风险，巡逻岗能帮你减轻入夜损失。" : "保持巡逻岗，可以在节气风险出现时更快响应。",
    },
    expedition: {
      glyph: "旗",
      tone: "sky",
      action: traveling > 0 ? `校点 ${traveling} 支商队` : "测风看路",
      focus: traveling > 0 ? "在途商路" : "可派遣路线",
      advice: traveling > 0 ? "等商队返航后查看收益，再决定下一条路线。" : "派遣精怪短途商路，可以把库存和探索转成额外收益。",
    },
    garden: {
      glyph: "花",
      tone: "flower",
      action: lowestMood < 60 ? "安抚低落伙伴" : "收拢庭院花息",
      focus: lowestMood < 60 ? "伙伴心情" : "庭院共鸣",
      advice: lowestMood < 60 ? "庭院岗能托住心情和体力，适合长线养成。" : "保持庭院岗，有助于稳定每日状态和同住事件。",
    },
  };
  const spec = specs[job] || specs.farm;
  return {
    ...spec,
    label: jobName(job),
    helperName,
    efficiency: multiplierText(jobEfficiency(spirit, job)),
    specialty: spiritJobSpecialtyLabel(spirit, job),
    shortLine: `${spec.glyph} · ${spec.action}`,
  };
}

export function spiritJobShiftFeedbackSpecRuntime(spirit, job = spirit?.job || "farm", persona = {}, {
  state = {},
  now = () => 0,
  jobName = (jobId = "") => jobId,
  spiritJobStation = (_spirit = {}, jobIndex = 0, globalIndex = 0) => ({ x: 0, y: 0, size: 0, jobIndex, globalIndex }),
  spiritVisualProfile = () => ({ accent: "#286f58", glow: "rgba(246, 240, 182, 0.24)" }),
} = {}) {
  if (!spirit) return null;
  const spirits = Array.isArray(state.spirits) ? state.spirits : [];
  const index = Math.max(0, spirits.findIndex((entry) => entry.id === spirit.id));
  const sameJobIndex = spirits.slice(0, index).filter((entry) => (entry.job || "farm") === job).length;
  const station = spiritJobStation({ ...spirit, job }, sameJobIndex, index);
  const profile = spiritVisualProfile(spirit);
  return {
    spiritId: spirit.id,
    spiritName: spirit.name,
    job,
    jobName: persona.label || jobName(job),
    action: persona.action,
    focus: persona.focus,
    efficiency: persona.efficiency,
    specialty: persona.specialty,
    advice: persona.advice,
    glyph: persona.glyph || profile.glyph,
    accent: profile.accent,
    glow: profile.glow,
    station,
    createdAt: now(),
    day: state.day,
  };
}

export function spiritAutomationLineTargetRuntime(job = "farm") {
  const targets = {
    farm: {
      selector: "#selectedPlotCard",
      fallbackSelector: "#spiritList",
      panelGroup: "core",
      targetLabel: "灵田与种植控件",
      cta: "定位田垄",
    },
    workshop: {
      selector: "#buildPanel",
      fallbackSelector: "#recipeSelect",
      panelGroup: "systems",
      targetLabel: "后厂工坊流水线",
      cta: "看后厂产线",
    },
    shop: {
      selector: "#shopReport",
      fallbackSelector: "#spiritList",
      panelGroup: "core",
      targetLabel: "旧铺经营复盘",
      cta: "看旧铺反馈",
    },
    patrol: {
      selector: "#riskPanel",
      fallbackSelector: "#spiritList",
      panelGroup: "systems",
      targetLabel: "节气风险面板",
      cta: "看巡逻风险",
    },
    expedition: {
      selector: ".trade-route-card",
      fallbackSelector: "#spiritList",
      panelGroup: "core",
      targetLabel: "跨界商路与商队",
      cta: "看商队路线",
    },
    garden: {
      selector: "#relationshipPanel",
      fallbackSelector: "#spiritList",
      panelGroup: "systems",
      targetLabel: "凡仙镇关系与庭院照应",
      cta: "看庭院照应",
    },
  };
  return targets[job] || targets.farm;
}

export function spiritAutomationLineFallbackRuntime(job = "farm", {
  state = {},
  workshopLine = {},
  shopFocus = null,
  risks = [],
  tradeRouteCount = 0,
  tradeRouteNameById = () => "",
} = {}) {
  const plots = Array.isArray(state.plots) ? state.plots : [];
  const planted = plots.filter((plot) => plot.cropId);
  const mature = planted.filter((plot) => plot.mature);
  const unwatered = planted.filter((plot) => !plot.watered && !plot.mature);
  const shopReport = Array.isArray(state.shopReport) ? state.shopReport : [];
  const traveling = (state.tradeRuns || []).filter((run) => run.status === "traveling");
  const spirits = Array.isArray(state.spirits) ? state.spirits : [];
  const lowSpirits = spirits.filter((spirit) => Number(spirit.mood || 0) < 60 || Number(spirit.stamina || 0) < 40);
  const safeRisks = Array.isArray(risks) ? risks : [];
  const fallback = {
    farm: {
      glyph: "水",
      tone: "water",
      action: unwatered.length > 0 ? `等待接管 ${unwatered.length} 格补水` : mature.length > 0 ? `等待守收 ${mature.length} 块成熟田` : "等待新种下田",
      focus: unwatered.length > 0 ? "缺水田垄" : mature.length > 0 ? "成熟作物" : "灵田土脉",
      metric: planted.length > 0 ? `种植 ${planted.length} · 成熟 ${mature.length}` : "尚未形成农田工作面",
      detail: "安排农田岗后，精怪会把补水和守田从重复劳动里接走。",
      impact: unwatered.length > 0 ? "可见收益：减少缺水漏处理" : "可见收益：稳定成长节奏",
    },
    workshop: {
      glyph: "火",
      tone: "ember",
      action: workshopLine.activeJob ? `产线跑到 ${workshopLine.activeJob.progress}%` : "空锅候火等排产",
      focus: workshopLine.activeJob?.currentStage?.label || workshopLine.title,
      metric: workshopLine.outputLine,
      detail: workshopLine.visualCue,
      impact: `可见收益：效率 ${workshopLine.speedText}`,
    },
    shop: {
      glyph: "铃",
      tone: "gold",
      action: shopFocus ? `复盘 ${shopFocus.buyers || 0} 单成交` : "等一次开铺后写入顾客动线",
      focus: shopFocus?.topItemName || shopFocus?.hotTagLabel || "旧铺门口",
      metric: shopFocus ? `成交 ${shopFocus.buyers || 0} · 离店 ${shopFocus.leavers || 0}` : `历史报告 ${shopReport.length}`,
      detail: shopFocus?.shelfAdvice || "店铺岗会把成交、犹豫和差评整理成下一次陈列建议。",
      impact: "可见收益：顾客原因更容易读懂",
    },
    patrol: {
      glyph: "灯",
      tone: "jade",
      action: safeRisks.length > 0 ? `盯防 ${safeRisks.length} 条未处理风险` : "巡灯线暂无警报",
      focus: safeRisks[0]?.title || safeRisks[0]?.event_name || "洞天边界",
      metric: safeRisks.length > 0 ? `风险 ${safeRisks.length} · 入夜前可处理` : "当前风险清空",
      detail: "巡逻岗会把节气风险从突然损失变成可提前看见的警示。",
      impact: safeRisks.length > 0 ? "可见收益：减少入夜损失" : "可见收益：保持风险安全线",
    },
    expedition: {
      glyph: "旗",
      tone: "sky",
      action: traveling.length > 0 ? `校点 ${traveling.length} 支在途商队` : "测风看路等派遣",
      focus: traveling[0] ? tradeRouteNameById(traveling[0].routeId) || "在途商队" : "跨界商路",
      metric: traveling.length > 0 ? `最近返程第 ${Math.min(...traveling.map((run) => Number(run.returnDay || state.day))) } 天` : `商路 ${tradeRouteCount} 条`,
      detail: "远征岗会把路线风险、补给和返程收益写成可复盘商路。",
      impact: "可见收益：库存转化为灵石和稀有返货",
    },
    garden: {
      glyph: "花",
      tone: "flower",
      action: lowSpirits.length > 0 ? `照应 ${lowSpirits.length} 位低状态伙伴` : "庭院花息稳定",
      focus: lowSpirits[0]?.name || "伙伴心情",
      metric: lowSpirits.length > 0 ? `低状态 ${lowSpirits.length}` : `伙伴 ${spirits.length} 位`,
      detail: "庭院岗把心情、体力和同住生活做成长期留存的暖线。",
      impact: lowSpirits.length > 0 ? "可见收益：降低伙伴低落断档" : "可见收益：维持日常陪伴",
    },
  };
  return fallback[job] || fallback.farm;
}

export function spiritAutomationPromenadeRowsRuntime({
  state = {},
  jobName = (jobId = "") => jobId,
  spiritJobPersonaSpec = () => null,
  spiritAutomationLineFallback = spiritAutomationLineFallbackRuntime,
  spiritAutomationLineTarget = spiritAutomationLineTargetRuntime,
} = {}) {
  const jobs = ["farm", "workshop", "shop", "patrol", "expedition", "garden"];
  const spirits = Array.isArray(state.spirits) ? state.spirits : [];
  return jobs.map((job, index) => {
    const helpers = spirits.filter((spirit) => (spirit.job || "farm") === job);
    const lead = helpers[0] || null;
    const fallback = spiritAutomationLineFallback(job);
    const persona = lead ? spiritJobPersonaSpec(lead, job) : null;
    const target = spiritAutomationLineTarget(job);
    return {
      job,
      index,
      label: jobName(job),
      glyph: persona?.glyph || fallback.glyph,
      tone: persona?.tone || fallback.tone,
      helperCount: helpers.length,
      helperText: helpers.length ? helpers.slice(0, 2).map((spirit) => spirit.name).join("、") : "空岗",
      action: persona?.action || fallback.action,
      focus: persona?.focus || fallback.focus,
      metric: fallback.metric,
      detail: persona?.advice || fallback.detail,
      impact: lead ? `${lead.name}：${persona.efficiency} · ${persona.specialty}` : fallback.impact,
      cta: target.cta,
      active: helpers.length > 0,
    };
  });
}

export function spiritAutomationPromenadeSpecRuntime(rows = [], {
  state = {},
} = {}) {
  const spirits = Array.isArray(state.spirits) ? state.spirits : [];
  if (!spirits.length) return null;
  const activeRows = rows.filter((row) => row.active);
  const workshopRow = rows.find((row) => row.job === "workshop");
  return {
    active: true,
    title: "精怪自动化巡演牌",
    headline: `六线岗位 ${activeRows.length}/6 已接管 · ${workshopRow?.metric || "后厂待命"}`,
    detail: "把农田、工坊、旧铺、巡逻、远征和庭院的后台效率翻译成可见动作、收益和缺口。",
    safety: "定位只辅助查看，不会自动切岗、派工、排产、开铺、发商队、处理风险、入夜或消耗资源。",
    rows,
  };
}

export function spiritAutomationPromenadeMarkupRuntime(spec = null) {
  if (!spec?.active) return "";
  return `
    <div class="spirit-automation-promenade">
      <strong>${spec.title} · ${spec.headline}</strong>
      <span>${spec.detail}</span>
      <div class="spirit-automation-grid">
        ${spec.rows.map((row) => `
          <div class="spirit-automation-card ${row.tone} ${row.active ? "active" : "idle"}" data-automation-line="${row.job}">
            <b>${row.glyph} ${row.label} · ${row.helperText}</b>
            <em>${row.action}</em>
            <small>${row.focus} · ${row.metric}</small>
            <small>${row.impact}</small>
            <small>${row.detail}</small>
            <button type="button" data-automation-job-line="${row.job}">${row.cta}</button>
          </div>
        `).join("")}
      </div>
      <small class="spirit-automation-safety">${spec.safety}</small>
    </div>
  `;
}

export function spiritSeasonalWorkMomentSpecRuntime(spirit = null, job = spirit?.job || "farm", weather = {}, term = {}, {
  localize = (_key, fallback = "") => fallback,
  jobName = (jobId = "") => jobId,
  splitTags = (tags = "") => String(tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
  shopTagLabel = (tag = "") => tag,
  signedPercent = (value = 0) => `${Math.round(Number(value || 0) * 100)}%`,
  multiplierText = (value = 1) => String(value),
} = {}) {
  if (!spirit) return null;
  const termName = localize(term?.term_name_key, term?.term_id || "节气");
  const weatherName = localize(weather?.weather_name_key, weather?.weather_id || "天气");
  const weatherId = weather?.weather_id || "";
  const disaster = weather?.disaster_tag || "none";
  const jobLabel = jobName(job);
  const marketTags = splitTags(term?.market_bonus_tags || "");
  const marketLabel = marketTags[0] ? shopTagLabel(marketTags[0]) : "应季气息";
  const byWeather = (() => {
    if (weatherId.includes("rain") || disaster === "waterlog") {
      return {
        tone: disaster === "waterlog" ? "rain-warn" : "rain",
        glyph: "叶",
        prop: disaster === "waterlog" ? "垫脚莲叶" : "挡雨大叶",
        action: job === "farm" ? "把雨水顺进田沟" : job === "shop" ? "把货签挪到檐下" : job === "workshop" ? "替灶口挡住湿气" : "撑叶沿路巡看",
        detail: disaster === "waterlog" ? "雨脚太重，它先把容易受潮的地方垫高。" : "细雨落下来，它把叶片当小伞用。",
        effect: `雨天水分 ${signedPercent(weather.water_bonus)}，${jobLabel}动作会更像在借天时。`,
      };
    }
    if (weatherId.includes("hot") || weatherId.includes("dry") || disaster === "heat" || disaster === "drought") {
      return {
        tone: disaster === "drought" ? "heat-warn" : "heat",
        glyph: "风",
        prop: disaster === "drought" ? "井水小瓢" : "蒲叶小扇",
        action: job === "farm" ? "给干田边缘补一圈凉气" : job === "workshop" ? "压住灶火别太燥" : job === "shop" ? "把凉口货摆到前排" : "一边扇风一边守岗",
        detail: disaster === "drought" ? "热风干得快，它会频频回头看水位。" : "日头晒得足，它把动作放慢一点，免得伙伴太累。",
        effect: `热天成长 ${multiplierText(weather.crop_growth_modifier)}，${jobLabel}更需要稳住节奏。`,
      };
    }
    if (weatherId.includes("mist") || disaster === "mist") {
      return {
        tone: "mist",
        glyph: "灯",
        prop: "雾里小灯",
        action: job === "expedition" ? "在路口点一粒雾灯" : job === "patrol" ? "把灯挂到篱笆转角" : "用小灯把岗位边界照出来",
        detail: "薄雾让路和货签都变软，它先把能认路的光点点起来。",
        effect: `${termName}雾气重，${jobLabel}会多一点辨路和认门的动作。`,
      };
    }
    if (weatherId.includes("frost") || weatherId.includes("snow") || weatherId.includes("cold") || disaster === "frost" || disaster === "cold" || disaster.includes("snow")) {
      return {
        tone: disaster === "frost" ? "cold-warn" : "cold",
        glyph: "炉",
        prop: disaster === "frost" ? "防霜小布" : "暖手小炉",
        action: job === "farm" ? "给嫩叶边缘盖一层暖息" : job === "garden" ? "把花息软垫挪到背风处" : "抱着小炉慢慢挪到岗位旁",
        detail: disaster === "frost" ? "霜气贴近地面，它会先护住最怕冷的角落。" : "冷风吹过来，它把自己缩成一团但还不肯离岗。",
        effect: `冷天成长 ${multiplierText(weather.crop_growth_modifier)}，${jobLabel}需要更多守护感。`,
      };
    }
    if (weatherId.includes("dew")) {
      return {
        tone: "dew",
        glyph: "露",
        prop: "晨露小盏",
        action: job === "farm" ? "把露珠一粒粒拨到苗根" : "把晨露收进小盏，留给今天的岗位",
        detail: "露气清亮，它做事会显得轻一点、亮一点。",
        effect: `${termName}的露气能托住心情，也让${marketLabel}更有鲜味。`,
      };
    }
    return {
      tone: "clear",
      glyph: "晴",
      prop: "节气小牌",
      action: `把${termName}的小牌摆到${jobLabel}旁`,
      detail: "天气清稳，它有余裕把今天的岗位整理得更像样。",
      effect: `当前节气偏好 ${marketLabel}，精怪会把这点写进小动作里。`,
    };
  })();
  return {
    ...byWeather,
    spiritId: spirit.id,
    spiritName: spirit.name || "精怪",
    job,
    jobLabel,
    termName,
    weatherName,
    marketLabel,
    title: `${weatherName} · ${byWeather.prop}`,
    line: `${spirit.name || "精怪"}${byWeather.action}，${byWeather.detail}`,
    summary: `${weatherName}里${byWeather.prop}：${byWeather.effect}`,
  };
}

export function spiritSeasonalWorkSceneProfileRuntime(tone = "clear") {
  if (tone.includes("rain")) return {
    mode: "rain",
    label: "雨天撑叶",
    accent: "#4d91a6",
    soft: "rgba(232, 246, 242, 0.78)",
    glyph: "叶",
  };
  if (tone.includes("heat")) return {
    mode: "heat",
    label: "热天扇风",
    accent: "#be4f37",
    soft: "rgba(255, 240, 232, 0.78)",
    glyph: "风",
  };
  if (tone.includes("mist")) return {
    mode: "mist",
    label: "雾天点灯",
    accent: "#5d6f65",
    soft: "rgba(255, 253, 245, 0.72)",
    glyph: "灯",
  };
  if (tone.includes("cold")) return {
    mode: "cold",
    label: "冷天护苗",
    accent: "#8f5f3f",
    soft: "rgba(232, 246, 242, 0.72)",
    glyph: "炉",
  };
  if (tone.includes("dew")) return {
    mode: "dew",
    label: "露天收露",
    accent: "#286f58",
    soft: "rgba(237, 243, 223, 0.76)",
    glyph: "露",
  };
  return {
    mode: "clear",
    label: "晴天挂牌",
    accent: "#b47d2f",
    soft: "rgba(255, 248, 232, 0.74)",
    glyph: "晴",
  };
}

export function spiritSeasonalWorkDaySummaryRowsRuntime(limit = 3, {
  state = {},
  spiritSeasonalWorkMomentSpec = () => null,
  spiritSeasonalWorkSceneProfile = spiritSeasonalWorkSceneProfileRuntime,
} = {}) {
  const spirits = Array.isArray(state.spirits) ? state.spirits : [];
  return spirits
    .slice(0, Math.max(0, limit))
    .map((spirit) => {
      const seasonal = spiritSeasonalWorkMomentSpec(spirit, spirit?.job || "farm");
      if (!seasonal) return null;
      const profile = spiritSeasonalWorkSceneProfile(seasonal.tone || "clear");
      return {
        spiritId: spirit.id,
        spiritName: spirit.name || seasonal.spiritName || "精怪",
        job: seasonal.job,
        jobLabel: seasonal.jobLabel,
        tone: seasonal.tone,
        label: profile.label,
        glyph: profile.glyph,
        prop: seasonal.prop,
        title: seasonal.title,
        weatherName: seasonal.weatherName,
        termName: seasonal.termName,
        detail: seasonal.detail,
        effect: seasonal.effect,
        line: seasonal.line,
        summary: seasonal.summary,
      };
    })
    .filter(Boolean);
}

export function spiritDailyChoreSpecRuntime(spirit, job = spirit?.job || "farm", {
  state = {},
  persona = {},
  rareMoment = null,
  care = {},
  synergy = null,
  seasonal = null,
  riskCount = 0,
} = {}) {
  const mood = Math.round(spirit?.mood || 0);
  const hunger = Math.round(spirit?.hunger || 0);
  const stationText = `${persona.focus}旁`;
  const plots = Array.isArray(state.plots) ? state.plots : [];
  const workshopQueue = Array.isArray(state.workshopQueue) ? state.workshopQueue : [];
  const shopReport = Array.isArray(state.shopReport) ? state.shopReport : [];
  const tradeRuns = Array.isArray(state.tradeRuns) ? state.tradeRuns : [];
  const jobChores = {
    farm: {
      action: plots.some((plot) => plot.cropId && !plot.watered && !plot.mature) ? "把水珠推到干裂田埂" : "蹲在叶影里数露珠",
      prop: "露珠小瓢",
      effect: "让农田岗的照料意图更清楚",
      glyph: "露",
      tone: "water",
    },
    workshop: {
      action: workshopQueue.length > 0 ? "拿木勺敲锅沿试火候" : "把空锅擦得能照出火星",
      prop: "灶边木勺",
      effect: "工坊排产时会显得更像有人在接手",
      glyph: "勺",
      tone: "ember",
    },
    shop: {
      action: shopReport.length > 0 ? "把今日买卖写成小货签" : "练习把货签摆得更显眼",
      prop: "迎客货签",
      effect: "旧铺经营反馈会落到具体动作上",
      glyph: "签",
      tone: "gold",
    },
    patrol: {
      action: riskCount > 0 ? "提灯照住风险来的方向" : "沿篱笆挂下一圈暖灯",
      prop: "巡夜灯钩",
      effect: "节气风险出现前有更强的守夜感",
      glyph: "灯",
      tone: "jade",
    },
    expedition: {
      action: tradeRuns.some((run) => run.status === "traveling") ? "给在途商队补画路标" : "在地上排出三粒探路石",
      prop: "小路旗",
      effect: "远征和商路不再只是按钮文字",
      glyph: "旗",
      tone: "sky",
    },
    garden: {
      action: mood < 65 ? "把蔫掉的花瓣重新扶起来" : "给伙伴们分一圈花息坐垫",
      prop: "花息软垫",
      effect: "庭院岗会更像在照顾全队状态",
      glyph: "花",
      tone: "flower",
    },
  };
  const base = jobChores[job] || jobChores.farm;
  const status = hunger < 40
    ? "边忙边偷看食盒"
    : mood < 60
      ? "动作慢一点，像是在等你安抚"
      : rareMoment
        ? `今天还惦记着${rareMoment.actionShort}`
        : synergy
          ? `昨夜搭班后还留着${synergy.label}的余光`
          : "状态稳，愿意继续待岗";
  return {
    ...base,
    job,
    jobName: persona.label,
    helperName: spirit?.name || "精怪",
    stationText,
    status,
    rareMoment,
    synergy,
    seasonal,
    careTone: care.tone,
    detail: `${spirit?.name || "精怪"}在${stationText}${base.action}，${status}。${seasonal ? ` ${seasonal.detail}` : ""}`,
    nextHint: rareMoment
      ? `看今日小剧场：${rareMoment.focus} · ${rareMoment.action}`
      : care.nextAction === "feed"
        ? "它现在更适合先喂食，再继续派工。"
        : care.nextAction === "repair"
          ? care.nextDetail
          : persona.advice,
  };
}

export function spiritDailyChoreMarkupRuntime(chore = null) {
  if (!chore) return "";
  return `
    <div class="spirit-daily-chore ${chore.tone}">
      <strong>${chore.glyph} 岗位小动作 · ${chore.prop}</strong>
      <span>${chore.detail}</span>
      ${chore.seasonal ? `<span class="spirit-seasonal-work ${chore.seasonal.tone}">${chore.seasonal.glyph} 天气小动作 · ${chore.seasonal.title}<small>${chore.seasonal.line} · ${chore.seasonal.effect}</small></span>` : ""}
      <small>${chore.effect} · ${chore.nextHint}</small>
    </div>
  `;
}

export function spiritBondRewardLabelRuntime(level = null, {
  localize = (_key, fallback = "") => fallback,
} = {}) {
  const rewardType = String(level?.reward_type || "");
  const rewardParam = String(level?.reward_param || "");
  const typeLabel = {
    dialogue: "新对话",
    event: "羁绊事件",
    buff: "伙伴加成",
    cosmetic: "外观",
    title: "称号",
  }[rewardType] || "羁绊奖励";
  if (rewardType === "dialogue") return `${typeLabel} · ${localize(rewardParam, rewardParam || "待配置")}`;
  if (rewardType === "event") return `${typeLabel} · ${rewardParam || "专属记忆"}`;
  if (rewardType === "buff") return `${typeLabel} · ${rewardParam || "岗位效率"}`;
  if (rewardType === "cosmetic") return `${typeLabel} · ${rewardParam || "新装束"}`;
  if (rewardType === "title") return `${typeLabel} · ${rewardParam || "伙伴名号"}`;
  return `${typeLabel}${rewardParam ? ` · ${rewardParam}` : ""}`;
}

export function spiritBondMilestoneSpecRuntime(spirit, {
  levels = [],
  interactionState = {},
  spiritLine = () => "",
  bondLevelFor = () => 1,
  spiritBondRewardLabel = spiritBondRewardLabelRuntime,
} = {}) {
  const lineId = spirit?.lineId || spiritLine(spirit?.id);
  const exp = Math.max(0, Number(spirit?.bondExp || 0));
  const sortedLevels = levels
    .filter((entry) => entry.spirit_line_id === lineId)
    .sort((a, b) => Number(a.exp_required || 0) - Number(b.exp_required || 0));
  const fallbackLevels = sortedLevels.length > 0
    ? sortedLevels
    : levels
      .filter((entry) => entry.spirit_line_id === "spirit_line_luobo")
      .sort((a, b) => Number(a.exp_required || 0) - Number(b.exp_required || 0));
  const reached = fallbackLevels.filter((entry) => exp >= Number(entry.exp_required || 0)).at(-1) || null;
  const next = fallbackLevels.find((entry) => exp < Number(entry.exp_required || 0)) || null;
  const currentThreshold = reached ? Number(reached.exp_required || 0) : 0;
  const nextThreshold = next ? Number(next.exp_required || 0) : Math.max(exp, currentThreshold);
  const span = Math.max(1, nextThreshold - currentThreshold);
  const progress = next ? Math.max(0, Math.min(100, Math.round(((exp - currentThreshold) / span) * 100))) : 100;
  const remaining = next ? Math.max(0, nextThreshold - exp) : 0;
  const recent = (interactionState.history || [])
    .filter((entry) => entry.spiritId === spirit?.id)
    .slice(0, 3);
  const recentText = recent.length
    ? recent.map((entry) => `${entry.type === "theater" ? "小剧场" : entry.type === "feed" ? "喂食" : entry.type === "mood_repair" ? "安抚" : "摸摸"} +${entry.bondGain}`).join(" / ")
    : "还没有牵挂记录";
  const suggestion = !next
    ? "这条羁绊档案已经全亮，继续互动会保留每日伙伴余温。"
    : remaining <= 12
      ? "再摸摸或喂食一次，就很可能点亮下一段牵挂。"
      : recent.length === 0
        ? "先摸摸一次，把今天第一条伙伴回应写进精怪面板。"
        : "继续用摸摸、喂食、小剧场或岗位协助，把羁绊从工具关系养成伙伴关系。";
  return {
    currentLevel: Number(spirit?.bondLevel || bondLevelFor(spirit, exp) || 1),
    nextLevel: next ? Number(next.bond_level || 1) : Number(spirit?.bondLevel || 1),
    exp,
    remaining,
    progress,
    rewardText: next ? spiritBondRewardLabel(next) : "全部羁绊档案已点亮",
    recentText,
    suggestion,
    complete: !next,
  };
}

export function spiritBondMilestoneMarkupRuntime(milestone = null) {
  if (!milestone) return "";
  return `
    <div class="spirit-bond-milestone ${milestone.complete ? "complete" : "active"}">
      <div class="spirit-bond-milestone-head">
        <strong>伙伴牵挂便笺 · ${milestone.complete ? "羁绊已圆满" : `下阶羁绊 Lv.${milestone.nextLevel}`}</strong>
        <span>${milestone.complete ? `当前 EXP ${milestone.exp}` : `还差 ${milestone.remaining} EXP · 当前 ${milestone.exp}`}</span>
      </div>
      <div class="spirit-bond-meter" style="--bond-progress:${milestone.progress}%"><i></i></div>
      <small>下一份牵挂：${milestone.rewardText}</small>
      <small>最近回应：${milestone.recentText}</small>
      <small>掌柜建议：${milestone.suggestion}</small>
      <em>只预告羁绊进度；不会自动摸摸、喂食、派工或消耗食物。</em>
    </div>
  `;
}

export function spiritIdentityMemorySpecRuntime(spirit, {
  day = 1,
  interactionState = {},
  rareMoment = null,
  profile = {},
  persona = {},
  jobName = (jobId = "") => jobId,
  spiritInteractionActionText = () => "",
  spiritVoice = () => "嗯嗯。",
} = {}) {
  if (!spirit) return null;
  const history = Array.isArray(interactionState.history) ? interactionState.history : [];
  const todayEntry = history.find((entry) => entry.spiritId === spirit.id && Number(entry.day || 0) === day) || null;
  const latestEntry = todayEntry
    || history.find((entry) => entry.spiritId === spirit.id)
    || (interactionState.last?.spiritId === spirit.id ? interactionState.last : null);
  const bondLevel = Number(spirit.bondLevel || 1);
  const actionLabel = latestEntry
    ? latestEntry.type === "theater" ? "今日小剧场"
      : latestEntry.type === "feed" ? "喂食转圈"
        : latestEntry.type === "mood_repair" ? "被认真安抚"
          : "蹭掌心"
    : rareMoment ? rareMoment.actionShort || "稀有小动作"
      : `${jobName(spirit.job)}岗小动作`;
  const memoryLine = todayEntry
    ? `我记得它：今天${String(todayEntry.actionText || spiritInteractionActionText(todayEntry.type, spirit)).replace(spirit.name, "")}`
    : rareMoment
      ? `我记得它：今天在${rareMoment.focus}${rareMoment.action}，这是它自己的小习惯。`
      : `我记得它：今天在${jobName(spirit.job)}岗${persona.action}，还等着第一句伙伴回应写进档案。`;
  const quote = latestEntry?.quote || rareMoment?.quote || spiritVoice(spirit.id, "idle");
  const behaviorNote = latestEntry
    ? `最近记录：第 ${latestEntry.day} 天 · ${actionLabel} · 羁绊 +${latestEntry.bondGain || 0}`
    : rareMoment
      ? `今日行为：${rareMoment.focus} · ${rareMoment.actionShort || rareMoment.action}`
      : `今日行为：${persona.focus} · ${persona.advice}`;
  const chips = [
    `名字 ${spirit.name}`,
    `岗位 ${jobName(spirit.job)}`,
    `行为 ${actionLabel}`,
    `羁绊 Lv.${bondLevel}`,
  ];
  const quoteShort = String(quote || "嗯嗯。").replace(/[“”]/g, "").slice(0, 16);
  const memoryHooks = [
    { label: "记住名字", text: spirit.name },
    { label: "记住动作", text: actionLabel },
    { label: "记住短台词", text: quoteShort },
  ];
  const recallLine = `记住它三件事：名字 ${spirit.name} / 动作 ${actionLabel} / 短台词「${quoteShort}」`;

  return {
    title: `伙伴名牌 · ${spirit.name}`,
    subtitle: `今日行为记忆 · ${profile.label}`,
    tone: todayEntry ? "fresh" : rareMoment ? "rare" : "quiet",
    memoryLine,
    behaviorNote,
    quote,
    quoteShort,
    memoryHooks,
    recallLine,
    chips,
    safeNote: "只帮助记住名字和行为；不会自动摸摸、喂食、派工或消耗食物。",
  };
}

export function spiritIdentityMemoryMarkupRuntime(memory = null) {
  if (!memory) return "";
  return `
    <div class="spirit-identity-memory ${memory.tone}">
      <div class="spirit-identity-memory-head">
        <strong>${memory.title}</strong>
        <span>${memory.subtitle}</span>
      </div>
      <p>${memory.memoryLine}</p>
      <div class="spirit-memory-recall">
        <strong>记忆三拍</strong>
        ${memory.memoryHooks.map((hook) => `<span><b>${hook.label}</b>${hook.text}</span>`).join("")}
      </div>
      <small>${memory.behaviorNote}</small>
      <em>“${memory.quote}”</em>
      <div class="spirit-identity-memory-tags">
        ${memory.chips.map((chip) => `<b>${chip}</b>`).join("")}
      </div>
      <small>${memory.safeNote}</small>
    </div>
  `;
}

export function spiritCompanionCareSpecRuntime(spirit, {
  interactionState = {},
  rareMoment = null,
  finale = null,
  hasFood = false,
  giftClaimed = false,
  giftReadyByCare = false,
  jobName = (jobId = "") => jobId,
} = {}) {
  const latestForSpirit = (interactionState.history || []).find((entry) => entry.spiritId === spirit.id)
    || (interactionState.last?.spiritId === spirit.id ? interactionState.last : null);
  const repairEvent = interactionState.moodRepairEvent && !interactionState.moodRepairEvent.repaired && interactionState.moodRepairEvent.spiritId === spirit.id
    ? interactionState.moodRepairEvent
    : null;
  const mood = Math.round(spirit.mood || 0);
  const hunger = Math.round(spirit.hunger || 0);
  const bondLevel = spirit.bondLevel || 1;

  let tone = "good";
  let status = "愿意贴近";
  let nextAction = "pet";
  let nextLabel = "摸摸";
  let nextDetail = "先摸摸它，让今日伙伴回应落到面板里。";
  if (repairEvent) {
    tone = "need";
    status = "低落小事待安抚";
    nextAction = "repair";
    nextLabel = "安抚小事";
    nextDetail = `${repairEvent.title}：${repairEvent.advice}`;
  } else if (hunger < 45) {
    tone = hasFood ? "warn" : "need";
    status = hasFood ? "有点饿" : "想吃东西";
    nextAction = hasFood ? "feed" : "pet";
    nextLabel = hasFood ? "喂食" : "先摸摸";
    nextDetail = hasFood ? "背包里有可喂食物，喂一次能补心情和羁绊。" : "先做白萝卜汤、清炒白菜，或留一份灵气白萝卜。";
  } else if (mood < 65) {
    tone = "warn";
    status = "需要安抚";
    nextAction = "pet";
    nextLabel = "摸摸";
    nextDetail = "心情偏低，摸摸比派工更适合把状态拉回来。";
  } else if (rareMoment) {
    tone = giftReadyByCare || giftClaimed ? "rare" : "good";
    status = giftClaimed ? "已送回礼" : giftReadyByCare ? "藏着回礼" : "今日有小动作";
    nextAction = "theater";
    nextLabel = "看今日小剧场";
    nextDetail = giftClaimed
      ? `今天已经收到 ${rareMoment.giftName || "小回礼"}，可以回看它在${rareMoment.focus}的动作。`
      : giftReadyByCare
        ? `先陪它看完${rareMoment.actionShort}，再摸摸或喂食，可能拿到 ${rareMoment.giftName}。`
        : `去看${rareMoment.actionShort}，把它今天在${rareMoment.focus}的生活片段收进记忆。`;
  } else if (finale) {
    tone = "finale";
    status = "终章陪伴";
    nextAction = "pet";
    nextLabel = "回应它";
    nextDetail = finale.nextDetail;
  } else if (bondLevel <= 1) {
    status = "还在熟悉你";
    nextAction = hasFood ? "feed" : "pet";
    nextLabel = hasFood ? "喂食" : "摸摸";
    nextDetail = hasFood ? "早期喂食能更快建立伙伴感。" : "没有食物时先摸摸，也会记录第一次伙伴回应。";
  } else {
    status = "状态稳定";
    nextAction = "pet";
    nextLabel = "摸摸";
    nextDetail = `${jobName(spirit.job)}可以继续工作，睡前摸摸能保留一天的陪伴感。`;
  }

  const lastText = latestForSpirit
    ? `上次回应：第 ${latestForSpirit.day} 天 ${latestForSpirit.type === "theater" ? "小剧场" : latestForSpirit.type === "feed" ? "喂食" : "摸摸"} · “${latestForSpirit.quote}” · 羁绊 +${latestForSpirit.bondGain}`
    : "上次回应：还没有单独记录，第一次摸摸会写入伙伴回应。";
  const momentText = rareMoment
    ? `今日小动作：${rareMoment.focus} · ${rareMoment.action} · “${rareMoment.quote}”`
    : finale
      ? `终章常驻：${finale.anchorLabel} · ${finale.sceneText}`
    : "今日小动作：普通岗位日常，先把主循环推进到更多稀有精怪线索。";
  const chips = [
    `心情 ${mood}`,
    `饱腹 ${hunger}`,
    `羁绊 Lv.${bondLevel}`,
    finale ? "终章常驻" : rareMoment ? rareMoment.actionShort : jobName(spirit.job),
  ];

  return {
    tone,
    status,
    nextAction,
    nextLabel,
    nextDetail,
    lastText,
    momentText,
    chips,
    rareMoment,
    finale,
    repairEvent,
  };
}

export function spiritCompanionCareMarkupRuntime(spirit, care = null, {
  spiritBondMilestoneMarkup = () => "",
} = {}) {
  if (!spirit || !care) return "";
  const actionButton = care.nextAction === "theater"
    ? `<button type="button" data-rare-spirit-theater="${spirit.id}" ${care.rareMoment ? "" : "disabled"}>${care.nextLabel}</button>`
    : care.nextAction === "repair"
      ? `<button type="button" data-spirit-mood-repair="${spirit.id}">${care.nextLabel}</button>`
    : care.nextAction === "feed"
      ? `<button type="button" data-spirit-action="feed" data-spirit-id="${spirit.id}">${care.nextLabel}</button>`
      : `<button type="button" data-spirit-action="pet" data-spirit-id="${spirit.id}">${care.nextLabel}</button>`;
  return `
    <div class="spirit-companion-care ${care.tone}">
      <div class="spirit-companion-care-head">
        <strong>今日陪伴 · ${care.status}</strong>
        <span>${care.chips.map((chip) => `<b>${chip}</b>`).join("")}</span>
      </div>
      <small>${care.lastText}</small>
      <small>${care.momentText}</small>
      ${care.finale ? `<div class="spirit-finale-memory-ticket"><strong>${care.finale.title} · ${care.finale.anchorLabel}</strong><span>${care.finale.effectText}</span><small>${care.finale.memoryText} · ${care.finale.areaLabel}</small><small>“${care.finale.dialogueText}”</small></div>` : ""}
      ${care.repairEvent ? `<div class="spirit-mood-repair-ticket"><strong>${care.repairEvent.title}</strong><span>${care.repairEvent.cause}</span><small>修复：${care.repairEvent.action}</small><small>建议：${care.repairEvent.advice}</small></div>` : ""}
      ${spiritBondMilestoneMarkup(spirit)}
      <div class="spirit-companion-next">
        <span>下一次照料：${care.nextDetail}</span>
        ${actionButton}
      </div>
    </div>
  `;
}

export function canvasSpiritCareFocusSpecRuntime({
  spirit = null,
  focus = null,
  day = 1,
  care = null,
  finaleRows = [],
  spiritVoice = () => "嗯嗯。",
} = {}) {
  if (!spirit || !focus || !care) return null;
  const moment = care.rareMoment;
  const finaleEffect = care.finale
    ? finaleRows.find((row) => row.lineId === care.finale.lineId && row.active)
    : null;
  const focusAge = Math.max(0, day - Number(focus.day || day));
  const seasonalFocus = focus.seasonal || null;
  const interactionEchoFocus = focus.interactionEcho || null;
  const moodRepairScene = focus.moodRepairScene || null;
  const careNeedScene = focus.careNeedScene || null;
  const shiftTheaterScene = focus.shiftTheaterScene || null;
  const identityNameplate = focus.identityNameplate || null;
  const memoryTriptych = focus.memoryTriptych || null;
  const sourceText = interactionEchoFocus
    ? "刚从伙伴回应签点到它"
    : memoryTriptych
      ? "刚从伙伴记忆三拍签点到它"
    : moodRepairScene
      ? "刚从低落小事点到它"
    : careNeedScene
      ? "刚从照料提醒牌点到它"
    : shiftTheaterScene
      ? "刚从岗位班次小剧场点到它"
    : identityNameplate
      ? "刚从场景伙伴名牌点到它"
    : focusAge > 0 ? `第 ${focus.day} 天点选，今天仍可继续照料` : "刚从主画面点到它";
  const directAction = care.nextAction === "theater" && moment
    ? { type: "theater", label: "看今日小剧场" }
    : care.nextAction === "repair"
      ? { type: "repair", label: "安抚小事" }
    : care.nextAction === "feed"
      ? { type: "feed", label: "喂食" }
      : { type: "pet", label: "摸摸" };
  const backupAction = directAction.type === "pet"
    ? { type: "feed", label: "喂食" }
    : { type: "pet", label: "摸摸" };
  return {
    spirit,
    care,
    sourceText,
    seasonalFocus,
    interactionEchoFocus,
    moodRepairScene,
    careNeedScene,
    shiftTheaterScene,
    identityNameplate,
    memoryTriptych,
    directAction,
    backupAction,
    detail: care.nextDetail,
    finaleEffect,
    quote: moment?.quote || spiritVoice(spirit.id, care.nextAction === "feed" ? "happy" : "idle"),
  };
}

export function canvasSpiritCareFocusMarkupRuntime(focus = null) {
  if (!focus) return "";
  const { spirit, care, directAction, backupAction, finaleEffect, seasonalFocus, interactionEchoFocus, moodRepairScene, careNeedScene, shiftTheaterScene, identityNameplate, memoryTriptych } = focus;
  const directButton = directAction.type === "theater"
    ? `<button type="button" data-rare-spirit-theater="${spirit.id}" ${care.rareMoment ? "" : "disabled"}>${directAction.label}</button>`
    : directAction.type === "repair"
      ? `<button type="button" data-spirit-mood-repair="${spirit.id}">${directAction.label}</button>`
    : `<button type="button" data-spirit-action="${directAction.type}" data-spirit-id="${spirit.id}">${directAction.label}</button>`;
  const backupButton = `<button type="button" data-spirit-action="${backupAction.type}" data-spirit-id="${spirit.id}">${backupAction.label}</button>`;
  const finaleButton = care.finale
    ? `<button type="button" data-spirit-finale-replay="${spirit.id}">回看终章落定</button>`
    : "";
  const finaleMarkup = care.finale
    ? `
      <div class="spirit-canvas-finale-ticket">
        <strong>${care.finale.title} · ${care.finale.anchorLabel}</strong>
        <span>${finaleEffect ? `${finaleEffect.valueText} · ${finaleEffect.detail}` : care.finale.effectText}</span>
        <small>${care.finale.memoryText} · ${care.finale.areaLabel} · “${care.finale.dialogueText}”</small>
      </div>
    `
    : "";
  const seasonalMarkup = seasonalFocus
    ? `
      <div class="spirit-canvas-seasonal-ticket">
        <strong>节气岗位小景 · ${seasonalFocus.label}</strong>
        <span>${seasonalFocus.weatherName || "今日天气"} · ${seasonalFocus.termName || "当前节气"} · ${seasonalFocus.prop}</span>
        <small>${seasonalFocus.detail} · ${seasonalFocus.effect}</small>
      </div>
    `
    : "";
  const interactionEchoMarkup = interactionEchoFocus
    ? `
      <div class="spirit-canvas-seasonal-ticket">
        <strong>${interactionEchoFocus.label}</strong>
        <span>${interactionEchoFocus.motionText} · ${interactionEchoFocus.bondText}</span>
        <small>“${interactionEchoFocus.quote}” · ${interactionEchoFocus.actionText}</small>
      </div>
    `
    : "";
  const memoryTriptychMarkup = memoryTriptych
    ? `
      <div class="spirit-canvas-seasonal-ticket">
        <strong>${memoryTriptych.title}</strong>
        <span>${memoryTriptych.routeText}</span>
        <small>${memoryTriptych.recallLine} · ${memoryTriptych.safeNote}</small>
      </div>
    `
    : "";
  const moodRepairMarkup = moodRepairScene
    ? `
      <div class="spirit-mood-repair-ticket">
        <strong>主世界低落小事 · ${moodRepairScene.headline}</strong>
        <span>${moodRepairScene.detail}</span>
        <small>安抚：${moodRepairScene.action} · ${moodRepairScene.advice}</small>
      </div>
    `
    : "";
  const careNeedMarkup = careNeedScene
    ? `
      <div class="spirit-canvas-seasonal-ticket">
        <strong>主世界照料提醒 · ${careNeedScene.actionLabel}</strong>
        <span>${careNeedScene.statusText}</span>
        <small>${careNeedScene.detail}</small>
      </div>
    `
    : "";
  const shiftTheaterMarkup = shiftTheaterScene
    ? `
      <div class="spirit-canvas-seasonal-ticket">
        <strong>岗位班次小剧场 · ${shiftTheaterScene.jobName}</strong>
        <span>${shiftTheaterScene.actionText} · ${shiftTheaterScene.levelText} · ${shiftTheaterScene.efficiencyText}</span>
        <small>${shiftTheaterScene.evidenceText} · ${shiftTheaterScene.nextHint}</small>
      </div>
    `
    : "";
  const identityMarkup = identityNameplate
    ? `
      <div class="spirit-canvas-seasonal-ticket">
        <strong>场景伙伴名牌 · ${identityNameplate.spiritName}</strong>
        <span>${identityNameplate.behaviorText} · ${identityNameplate.bondText}</span>
        <small>${identityNameplate.memoryLine} · ${identityNameplate.safeNote}</small>
      </div>
    `
    : "";
  return `
    <div class="spirit-canvas-care ${care.tone}" data-spirit-id="${spirit.id}">
      <div class="spirit-canvas-care-title">
        <strong>画面点选 · ${spirit.name}</strong>
        <span>${care.status}</span>
      </div>
      <small>${focus.sourceText} · ${focus.detail}</small>
      <small>它的回应：“${focus.quote}”</small>
      ${moodRepairMarkup}
      ${careNeedMarkup}
      ${shiftTheaterMarkup}
      ${identityMarkup}
      ${interactionEchoMarkup}
      ${memoryTriptychMarkup}
      ${seasonalMarkup}
      ${finaleMarkup}
      <div class="spirit-canvas-care-actions">
        ${directButton}
        ${backupButton}
        ${finaleButton}
      </div>
    </div>
  `;
}

export function settleFarmSpiritJobRuntime(spirit = {}, report = [], power = 0, {
  state = {},
  addJobExp = () => null,
  complete = () => null,
} = {}) {
  const plots = state.plots.filter((plot) => plot.cropId && !plot.watered);
  const watered = Math.min(plots.length, Math.max(1, Math.floor(1 + power * 2)));
  plots.slice(0, watered).forEach((plot) => {
    plot.watered = true;
  });
  if (watered > 0) {
    report.push({ spirit: spirit.name, job: "farm", text: `夜里补水 ${watered} 块灵田`, impact: watered });
    addJobExp(spirit, "farm", watered, "夜间补水");
    complete("spirit_job_settlement");
  }
}

export function settleWorkshopSpiritJobRuntime(spirit = {}, report = [], power = 0, {
  state = {},
  addItem = () => null,
  itemName = (itemId = "") => itemId,
  addJobExp = () => null,
  complete = () => null,
} = {}) {
  const queueBoost = Math.round(10 * power);
  let boosted = 0;
  for (const job of state.workshopQueue || []) {
    if (job.remainingWork <= 0) continue;
    const used = Math.min(job.remainingWork, queueBoost);
    job.remainingWork -= used;
    boosted += used;
    break;
  }
  if (boosted > 0) {
    report.push({ spirit: spirit.name, job: "workshop", text: `替工坊预热 ${boosted} 工时`, impact: boosted });
    addJobExp(spirit, "workshop", 2, "夜间预热工坊");
  } else {
    const waterGain = Math.max(1, Math.floor(power));
    addItem("item_material_clean_water", waterGain);
    report.push({ spirit: spirit.name, job: "workshop", text: `整理燃料与净水，获得${itemName("item_material_clean_water")} x${waterGain}`, impact: waterGain });
    addJobExp(spirit, "workshop", waterGain, "夜间整理工坊");
  }
  complete("spirit_job_settlement");
}

export function settleShopSpiritJobRuntime(spirit = {}, report = [], power = 0, {
  state = {},
  jobName = (job = "") => job,
  addJobExp = () => null,
  complete = () => null,
} = {}) {
  const fameGain = Math.max(1, Math.floor(power));
  const goldGain = Math.max(6, Math.round(8 * power));
  state.fame += fameGain;
  state.gold += goldGain;
  state.shopReport = [
    {
      name: spirit.name,
      text: `夜间擦亮货架，熟客预订 +${goldGain} 灵石。`,
      reason: "spirit_job",
      detail: `${jobName("shop")}自动经营 · 声望 +${fameGain}`,
    },
    ...(state.shopReport || []).slice(0, 5),
  ];
  report.push({ spirit: spirit.name, job: "shop", text: `熟客预订 +${goldGain} 灵石 / 声望 +${fameGain}`, impact: goldGain });
  addJobExp(spirit, "shop", fameGain + 1, "夜间招呼熟客");
  complete("spirit_job_settlement");
}

export function settlePatrolSpiritJobRuntime(spirit = {}, report = [], power = 0, {
  unresolvedRisks = () => [],
  recordResolvedRisk = () => null,
  addItem = () => null,
  itemName = (itemId = "") => itemId,
  addJobExp = () => null,
  complete = () => null,
} = {}) {
  const risk = unresolvedRisks()[0];
  if (risk && power >= 0.72) {
    risk.resolved = true;
    recordResolvedRisk(risk);
    report.push({ spirit: spirit.name, job: "patrol", text: `巡夜化解${risk.title}`, impact: risk.severity || 1 });
    addJobExp(spirit, "patrol", 3, "夜间巡逻化险");
    complete("spirit_job_settlement");
    return;
  }
  const shardGain = Math.max(1, Math.floor(power));
  addItem("item_stone_spirit_shard", shardGain);
  report.push({ spirit: spirit.name, job: "patrol", text: `巡夜拾得${itemName("item_stone_spirit_shard")} x${shardGain}`, impact: shardGain });
  addJobExp(spirit, "patrol", shardGain, "夜间巡逻");
  complete("spirit_job_settlement");
}

export function settleExpeditionSpiritJobRuntime(spirit = {}, report = [], power = 0, {
  state = {},
  addItem = () => null,
  itemName = (itemId = "") => itemId,
  addJobExp = () => null,
  complete = () => null,
} = {}) {
  const oreGain = Math.max(1, Math.floor(power));
  const itemId = state.dungeonClears.size > 0 || spirit.id.includes("leizhu") ? "item_ore_copper" : "item_wood_basic";
  addItem(itemId, oreGain);
  report.push({ spirit: spirit.name, job: "expedition", text: `短线巡路带回${itemName(itemId)} x${oreGain}`, impact: oreGain });
  addJobExp(spirit, "expedition", oreGain + 1, "夜间短线巡路");
  complete("spirit_job_settlement");
}

export function settleGardenSpiritJobRuntime(spirit = {}, report = [], power = 0, {
  state = {},
  addItem = () => null,
  addJobExp = () => null,
  complete = () => null,
} = {}) {
  const moodGain = Math.max(3, Math.round(4 * power));
  for (const other of state.spirits) {
    other.mood = Math.min(100, Number(other.mood || 0) + moodGain);
  }
  if (spirit.id.includes("fengmi") || spirit.id.includes("hualing")) addItem("item_material_clean_water", 1);
  report.push({ spirit: spirit.name, job: "garden", text: `庭院共鸣，全体心情 +${moodGain}`, impact: moodGain });
  addJobExp(spirit, "garden", 2, "夜间庭院共鸣");
  complete("spirit_job_settlement");
}
