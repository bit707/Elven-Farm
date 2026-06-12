export function spiritJobReportByJobRuntime(report = []) {
  return report.reduce((map, entry) => {
    const job = entry.job || "farm";
    if (!map.has(job)) map.set(job, []);
    map.get(job).push(entry);
    return map;
  }, new Map());
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
