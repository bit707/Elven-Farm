export function spiritAutomationBenefitRowsData(groups = {}, options = {}) {
  const state = options.state || {};
  const spiritJobWorkPower = typeof options.spiritJobWorkPower === "function" ? options.spiritJobWorkPower : () => 0;
  const sellableInventoryGoods = typeof options.sellableInventoryGoods === "function" ? options.sellableInventoryGoods : () => [];
  const unresolvedRisks = typeof options.unresolvedRisks === "function" ? options.unresolvedRisks : () => [];
  const workshopProductionLineSpec = typeof options.workshopProductionLineSpec === "function" ? options.workshopProductionLineSpec : () => ({ activeJob: null });
  const workshopSpiritBonus = typeof options.workshopSpiritBonus === "function" ? options.workshopSpiritBonus : () => 0;
  const multiplierText = typeof options.multiplierText === "function" ? options.multiplierText : (value) => `${value}`;
  const unwatered = (state.plots || []).filter((plot) => plot.cropId && !plot.mature && !plot.watered).length;
  const queue = state.workshopQueue || [];
  const sellable = sellableInventoryGoods();
  const risks = unresolvedRisks();
  const rows = [];
  const jobPower = (job) => (groups[job] || []).reduce((sum, entry) => sum + Number(entry.power || 0), 0);
  const firstName = (job) => groups[job]?.[0]?.spirit?.name || "";

  if (groups.farm?.length) {
    const waterCount = Math.max(1, Math.min(unwatered || groups.farm.length * 3, Math.round(jobPower("farm") * 3)));
    rows.push({
      job: "farm",
      tone: unwatered ? "ready" : "stable",
      glyph: "田",
      title: "农田代劳",
      value: `省体力 ${waterCount * 2}`,
      detail: unwatered
        ? `${firstName("farm")} 可接手 ${waterCount}/${unwatered} 格补水`
        : `${firstName("farm")} 巡田，今晚少漏一格水`,
      selector: "#spiritList",
      panelGroup: "core",
      priority: unwatered ? 92 : 50,
    });
  }

  if (groups.workshop?.length) {
    const savedWork = Math.max(6, Math.round(jobPower("workshop") * 12));
    const activeJob = workshopProductionLineSpec(queue).activeJob;
    rows.push({
      job: "workshop",
      tone: queue.length ? "hot" : "ready",
      glyph: "炊",
      title: queue.length ? "后厂跑线" : "灶边候工",
      value: queue.length ? `工时 -${savedWork}` : `速度 ${multiplierText(workshopSpiritBonus())}`,
      detail: activeJob
        ? `${firstName("workshop")} 正看 ${activeJob.currentStage.label} · ${activeJob.outputItemName}`
        : `${firstName("workshop")} 候在灶边，排产后立刻投料`,
      selector: queue.length ? "[data-workshop-queue]" : ".workshop-production-line",
      fallbackSelector: "#buildPanel",
      panelGroup: "systems",
      priority: queue.length ? 90 : 68,
    });
  }

  if (groups.shop?.length) {
    const expectedGold = Math.max(8, Math.round(jobPower("shop") * 10));
    rows.push({
      job: "shop",
      tone: sellable.length ? "gold" : "stable",
      glyph: "铺",
      title: "铺前招呼",
      value: `预订 +${expectedGold}`,
      detail: sellable.length
        ? `${firstName("shop")} 可替 ${sellable[0]?.itemName || "货架"} 挂热卖签`
        : `${firstName("shop")} 整理空货架，等第一件货`,
      selector: "#shopReport",
      fallbackSelector: "#shopButton",
      panelGroup: "core",
      priority: sellable.length ? 84 : 46,
    });
  }

  if (groups.patrol?.length) {
    rows.push({
      job: "patrol",
      tone: risks.length ? "urgent" : "stable",
      glyph: "巡",
      title: "巡灯护场",
      value: risks.length ? `风险 ${risks.length}` : "夜路稳定",
      detail: risks.length
        ? `${firstName("patrol")} 盯着 ${risks[0].title}`
        : `${firstName("patrol")} 把夜路先照了一遍`,
      selector: risks.length ? "#riskPanel" : "#spiritList",
      fallbackSelector: "#spiritList",
      panelGroup: risks.length ? "systems" : "core",
      priority: risks.length ? 96 : 48,
    });
  }

  if (groups.expedition?.length) {
    rows.push({
      job: "expedition",
      tone: "water",
      glyph: "旗",
      title: "短途探路",
      value: `线索 +${groups.expedition.length}`,
      detail: `${firstName("expedition")} 可先看商路、秘境和补给缺口`,
      selector: "#spiritList",
      fallbackSelector: "#spiritList",
      panelGroup: "core",
      priority: 54,
    });
  }

  if (groups.garden?.length) {
    const moodGain = Math.max(4, Math.round(jobPower("garden") * 4));
    rows.push({
      job: "garden",
      tone: "flower",
      glyph: "院",
      title: "庭院安抚",
      value: `心情 +${moodGain}`,
      detail: `${firstName("garden")} 可把疲惫伙伴往回养`,
      selector: "#spiritList",
      fallbackSelector: "#spiritList",
      panelGroup: "core",
      priority: (state.spirits || []).some((spirit) => Number(spirit.mood || 0) < 45) ? 78 : 52,
    });
  }

  return rows.sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
}

export function spiritAutomationNextAssignmentAdviceData(groups = {}, options = {}) {
  const state = options.state || {};
  const sellableInventoryGoods = typeof options.sellableInventoryGoods === "function" ? options.sellableInventoryGoods : () => [];
  const unresolvedRisks = typeof options.unresolvedRisks === "function" ? options.unresolvedRisks : () => [];
  const plots = Array.isArray(state.plots) ? state.plots : [];
  const spirits = Array.isArray(state.spirits) ? state.spirits : [];
  const unwatered = plots.filter((plot) => plot.cropId && !plot.mature && !plot.watered).length;
  const queue = Array.isArray(state.workshopQueue) ? state.workshopQueue : [];
  const sellable = sellableInventoryGoods();
  const risks = unresolvedRisks();
  const idle = spirits.find((spirit) => !spirit.job);
  if (idle) return { job: "farm", label: `${idle.name} 还没定岗，先放到农田岗把第一条代劳线点亮。` };
  if (unwatered > 0 && !groups.farm?.length) return { job: "farm", label: `还有 ${unwatered} 格缺水，调一只精怪去农田岗最立刻省体力。` };
  if (queue.length > 0 && !groups.workshop?.length) return { job: "workshop", label: "工坊有排产但没人看火，调一只精怪去工坊岗能让产线更像真正自动化。" };
  if (sellable.length > 0 && !groups.shop?.length) return { job: "shop", label: "背包已有可卖货，调一只精怪去店铺岗，门口会出现补货和招呼动作。" };
  if (risks.length > 0 && !groups.patrol?.length) return { job: "patrol", label: "节气风险还没处理，巡逻岗能把夜间损失变成可见防线。" };
  if (groups.farm?.length && groups.workshop?.length) return { job: "workshop", label: "农田和工坊已经接线，今晚容易打出“清晨备料链”。" };
  if (groups.workshop?.length && groups.shop?.length) return { job: "shop", label: "工坊和旧铺已经接线，下一步冲“出锅上架链”。" };
  return { job: "farm", label: "岗位已覆盖，继续观察主世界里的搬运、补货、巡灯和庭院动作。" };
}
