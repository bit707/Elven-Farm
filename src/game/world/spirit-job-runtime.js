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
