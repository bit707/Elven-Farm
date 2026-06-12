export function automationDayLedgerReportTextData(rows = []) {
  const safeRows = Array.isArray(rows) ? rows : [];
  if (!safeRows.length) return "自动化日账本还没有接起第一条岗位线。";
  return safeRows.map((row) => `${row.label}：${row.value}`).join(" / ");
}

export function automationDayLedgerRowsData({
  summary = null,
  workshopLine = null,
  restock = null,
  activeRisks = [],
  spirits = [],
  plots = [],
  tradeRuns = [],
  ecologyRows = [],
  day = 1,
} = {}) {
  if (!summary) return [];
  const line = workshopLine || { activeJob: null };
  const completedWorkshopJobs = Array.isArray(summary.completedWorkshopJobs) ? summary.completedWorkshopJobs : [];
  const restockSpec = restock || summary.shopRestock || null;
  const weatherShelf = summary.shopWeatherShelf || null;
  const waterwayStanding = summary.shopWaterwayStandingOrder || null;
  const risks = Array.isArray(activeRisks) ? activeRisks : [];
  const riskCount = Math.max(Number(summary.unresolved || 0), risks.length);
  const spiritJobs = Array.isArray(summary.spiritJobs) ? summary.spiritJobs : [];
  const synergy = Array.isArray(summary.spiritJobSynergy) ? summary.spiritJobSynergy : [];
  const safeSpirits = Array.isArray(spirits) ? spirits : [];
  const fieldSpirits = safeSpirits.filter((spirit) => (spirit.job || "farm") === "farm");
  const workshopSpirits = safeSpirits.filter((spirit) => (spirit.job || "") === "workshop");
  const patrolSpirits = safeSpirits.filter((spirit) => (spirit.job || "") === "patrol");
  const expeditionSpirits = safeSpirits.filter((spirit) => (spirit.job || "") === "expedition");
  const gardenSpirits = safeSpirits.filter((spirit) => (spirit.job || "") === "garden");
  const unwatered = (Array.isArray(plots) ? plots : []).filter((plot) => plot.cropId && !plot.mature && !plot.watered).length;
  const latestRun = (Array.isArray(tradeRuns) ? tradeRuns : [])
    .slice()
    .sort((a, b) => Number(b.returnedDay || b.returnDay || 0) - Number(a.returnedDay || a.returnDay || 0))[0] || null;
  const tradeReturnDay = latestRun
    ? Number(latestRun.returnedDay || latestRun.returnDay || 0)
    : 0;
  const safeEcologyRows = Array.isArray(ecologyRows) ? ecologyRows : [];
  const readyEcology = safeEcologyRows.find((row) => row.ready) || safeEcologyRows.find((row) => row.active) || null;
  const moodCareText = summary.cohabBuffs?.[0]
    ? `${summary.cohabBuffs[0].routeName || "同住"} · ${summary.cohabBuffs[0].label}`
    : summary.ecologyMemoryResonance?.tier > 0
      ? `${summary.ecologyMemoryResonance.label} · 连记 ${summary.ecologyMemoryResonance.nights} 夜`
      : gardenSpirits[0]
        ? `${gardenSpirits[0].name} 在庭院托住伙伴心情`
        : "庭院还没接起稳定的情绪托底线";
  const rows = [
    {
      key: "field",
      label: "田里被接手",
      value: fieldSpirits.length > 0
        ? `${fieldSpirits[0].name} 接了 ${Math.max(1, Math.min(unwatered || fieldSpirits.length * 3, fieldSpirits.length * 3))} 格活`
        : `还有 ${Math.max(0, unwatered)} 格待接手`,
      detail: fieldSpirits.length > 0
        ? (unwatered > 0 ? `今晚还剩 ${unwatered} 格待润，明早先看精怪与田垄。` : "浇水和守熟已经不必全靠手点。")
        : "先把一位伙伴调到农田岗，自动化日账本才会写下第一笔。",
      selector: "#spiritList",
      fallbackSelector: "#selectedPlotCard",
      panelGroup: "core",
      tone: fieldSpirits.length > 0 ? "ready" : "pending",
      cta: "看田垄接手",
    },
    {
      key: "workshop",
      label: "后厂在烧",
      value: line.activeJob
        ? `${line.activeJob.currentStage.label} ${line.activeJob.progress}%`
        : workshopSpirits.length > 0
          ? `${workshopSpirits[0].name} 在灶边候工`
          : "后厂还没跑起来",
      detail: completedWorkshopJobs[0]
        ? `${completedWorkshopJobs[0].outputItemName || "成品"} 已出锅入线。`
        : line.activeJob
          ? `这锅 ${line.activeJob.outputItemName} 正在接向 ${line.activeJob.orderText || "库存/旧铺"}`
          : "排进一锅生产后，后厂会从备料一路亮到入仓。",
      selector: line.activeJob ? "[data-workshop-queue]" : ".workshop-production-line",
      fallbackSelector: "#buildPanel",
      panelGroup: "systems",
      tone: line.activeJob || workshopSpirits.length > 0 ? "ready" : "pending",
      cta: "看后厂跑线",
    },
    {
      key: "stock",
      label: "入仓/补货",
      value: restockSpec
        ? `${restockSpec.itemName} ${restockSpec.have}/${restockSpec.desiredCount}`
        : weatherShelf?.itemName
          ? `${weatherShelf.itemName} 等着补到头排`
          : completedWorkshopJobs[0]
            ? `${completedWorkshopJobs[0].outputItemName || "成品"} 已可转库存`
            : "今晚暂时没有新补货线",
      detail: restockSpec
        ? `${restockSpec.sourceLabel || "旧铺补货"} · ${restockSpec.statusText}`
        : weatherShelf?.nextAction
          ? `天气货签建议：${weatherShelf.nextAction}`
          : "从后厂到库存、再到旧铺补货的线已经能被记住。",
      selector: restockSpec ? "#shopReport" : "#inventoryList",
      fallbackSelector: "#goalBookPanel",
      panelGroup: "core",
      tone: restockSpec?.ready || completedWorkshopJobs.length > 0 ? "ready" : "active",
      cta: "看补货去向",
    },
    {
      key: "patrol",
      label: "巡灯压风险",
      value: patrolSpirits.length > 0
        ? (riskCount > 0 ? `${patrolSpirits[0].name} 盯着 ${riskCount} 条风险` : `${patrolSpirits[0].name} 在守夜路`)
        : (riskCount > 0 ? `还有 ${riskCount} 条风险待压` : "今晚没有风险压上来"),
      detail: riskCount > 0
        ? "先看风险面板，再决定明早是巡灯还是亲自补处理。"
        : "巡逻岗能把夜里最容易漏掉的风险提前记下来。",
      selector: "#riskPanel",
      fallbackSelector: "#spiritList",
      panelGroup: "core",
      tone: riskCount > 0 ? "warn" : patrolSpirits.length > 0 ? "ready" : "active",
      cta: "看巡灯线",
    },
    {
      key: "expedition",
      label: "商队/远路",
      value: latestRun
        ? `${latestRun.routeName || "商路"} · 第 ${tradeReturnDay || day} 天`
        : waterwayStanding?.focusItemName
          ? `${waterwayStanding.focusItemName} 常单备货 ${waterwayStanding.focusHave}/${waterwayStanding.focusTarget}`
          : expeditionSpirits.length > 0
            ? `${expeditionSpirits[0].name} 守着远路时刻`
            : "远路暂时还没接上线",
      detail: latestRun
        ? `${latestRun.status === "returned" ? "今天返程落账" : "还在路上"}${latestRun.routeName ? ` · ${latestRun.routeName}` : ""}`
        : waterwayStanding?.detail || "商队回来时，这条线会把返程、补货和下次远行连成一页。",
      selector: "#orderPanel",
      fallbackSelector: "#goalBookPanel",
      panelGroup: "core",
      tone: latestRun || waterwayStanding || expeditionSpirits.length > 0 ? "ready" : "active",
      cta: "看远路线",
    },
    {
      key: "garden",
      label: "庭院托心情",
      value: moodCareText,
      detail: readyEcology
        ? `${readyEcology.name} 已接近可收录。`
        : synergy[0]?.detail || "照应、同住和庭院共鸣会把自动化从省事变成生活感。",
      selector: "#relationshipPanel",
      fallbackSelector: "#goalBookPanel",
      panelGroup: "story",
      tone: readyEcology || gardenSpirits.length > 0 || summary.ecologyMemoryResonance?.tier > 0 ? "ready" : "active",
      cta: "看庭院照应",
    },
  ];
  return rows.filter((row) => row.value || row.detail);
}

export function automationDayLedgerSpecData(summary = null, rows = [], reportText = "") {
  const safeRows = Array.isArray(rows) ? rows : [];
  if (!summary || !safeRows.length) return null;
  return {
    active: true,
    title: "自动化日终流水账",
    headline: "田里被接手 -> 后厂在烧 -> 入仓/补货 -> 旧铺/商队/巡灯",
    reportText: reportText || automationDayLedgerReportTextData(safeRows),
    rows: safeRows,
    safety: "只定位自动化岗位线，不会自动切岗、派工、排产、开铺、发商队、处理风险、入夜或消耗资源",
  };
}

export function automationDayLedgerFocusData(spec = null, lineKey = "field") {
  if (!spec?.rows?.length) {
    return {
      type: "empty",
      title: "自动化日终流水账",
      message: "今晚还没有可回看的自动化岗位线，先让第一位伙伴接手重复劳动。",
    };
  }
  const row = spec.rows.find((entry) => entry.key === lineKey) || spec.rows[0];
  const jobMap = {
    field: "farm",
    workshop: "workshop",
    patrol: "patrol",
    expedition: "expedition",
    garden: "garden",
  };
  if (jobMap[row.key]) {
    return {
      type: "job",
      job: jobMap[row.key],
      title: "点选自动化日账本",
      message: `${row.label}：${row.value}。${row.detail} ${spec.safety}`,
    };
  }
  return {
    type: "compass",
    compassTarget: {
      selector: row.selector,
      fallbackSelector: row.fallbackSelector || "#goalBookPanel",
      label: `点选自动化日账本：${row.label}`,
      log: `${row.label}：${row.value}。${row.detail} ${spec.safety}`,
      panelGroup: row.panelGroup || "core",
      missingTitle: `点选自动化日账本：${row.label}`,
      missingLog: "自动化岗位线已经写入日终流水账，但对应面板暂时没有找到。",
    },
  };
}
