export function automationHubWorldNoteSpecData({
  spirits = [],
  plots = [],
  livingState = {},
  lineSpec = {},
  aromaSpec = null,
  focus = {},
  orderBoard = null,
  risks = [],
  tradeRuns = [],
  builtWorkshop = false,
  workshopAromaState = {},
  shopOpeningState = {},
} = {}) {
  const safeSpirits = Array.isArray(spirits) ? spirits : [];
  const workshopHelpers = safeSpirits.filter((spirit) => spirit.job === "workshop");
  const fieldHelpers = safeSpirits.filter((spirit) => spirit.job === "farm");
  const shopHelpers = safeSpirits.filter((spirit) => spirit.job === "shop");
  const patrolHelpers = safeSpirits.filter((spirit) => spirit.job === "patrol");
  const expeditionHelpers = safeSpirits.filter((spirit) => spirit.job === "expedition");
  const gardenHelpers = safeSpirits.filter((spirit) => spirit.job === "garden");
  const activeJob = lineSpec.activeJob || null;
  const activeRisks = Array.isArray(risks) ? risks : [];
  const activeTradeRun = (Array.isArray(tradeRuns) ? tradeRuns : []).find((run) => !run.completed) || null;
  const lowMoodSpirit = safeSpirits.find((spirit) => Number(spirit.mood || 0) < 55) || null;
  const queue = Array.isArray(livingState.queue) ? livingState.queue : [];
  const hasAutomationSignal = safeSpirits.length > 0
    && (
      builtWorkshop
      || queue.length > 0
      || workshopHelpers.length > 0
      || fieldHelpers.length > 0
      || shopHelpers.length > 0
      || patrolHelpers.length > 0
      || expeditionHelpers.length > 0
      || gardenHelpers.length > 0
      || workshopAromaState.orderUnlocked
    );
  if (!hasAutomationSignal) return null;

  const fieldUnwatered = (Array.isArray(plots) ? plots : []).filter((plot) => plot.cropId && !plot.watered && !plot.mature).length;
  const shopSession = shopOpeningState.liveFocus || null;
  const lines = [
    {
      key: "field",
      label: fieldHelpers.length > 0 ? "田垄有人接手" : "田垄待派工",
      text: fieldHelpers.length > 0
        ? `${fieldHelpers[0].name}盯着${fieldUnwatered || "今日"}格水分`
        : "把一只精怪调到农田岗",
      active: fieldHelpers.length > 0,
    },
    {
      key: "workshop",
      label: activeJob ? "后厂正在跑线" : workshopHelpers.length > 0 ? "灶边候工" : "后厂待派工",
      text: activeJob
        ? `${activeJob.currentStage.label} ${activeJob.progress}% · ${activeJob.outputItemName}`
        : workshopHelpers.length > 0
          ? `${workshopHelpers[0].name}候在灶边`
          : focus.advice,
      active: Boolean(activeJob || workshopHelpers.length > 0),
    },
    {
      key: "shop",
      label: shopSession ? "旧铺有反馈" : shopHelpers.length > 0 ? "铺前练招呼" : "旧铺待接线",
      text: shopSession
        ? `${shopSession.buyers || 0}单成交 · ${shopSession.topItemName || shopSession.hotTagLabel || "顾客反馈"}`
        : shopHelpers.length > 0
          ? `${shopHelpers[0].name}整理货签`
          : "开铺后看顾客泡泡",
      active: Boolean(shopSession || shopHelpers.length > 0),
    },
    {
      key: "patrol",
      label: patrolHelpers.length > 0 ? "巡灯有人守夜" : "巡灯待接线",
      text: patrolHelpers.length > 0
        ? activeRisks.length > 0
          ? `${patrolHelpers[0].name}盯着${activeRisks[0].title}`
          : `${patrolHelpers[0].name}把夜路先照亮`
        : activeRisks.length > 0
          ? `还有${activeRisks.length}条风险可压`
          : "派巡逻岗后会显出灯路",
      active: patrolHelpers.length > 0 || activeRisks.length > 0,
    },
    {
      key: "expedition",
      label: expeditionHelpers.length > 0 || activeTradeRun ? "远征旗路在动" : "远征待派工",
      text: activeTradeRun
        ? `商队第${activeTradeRun.returnDay}天返程`
        : expeditionHelpers.length > 0
          ? `${expeditionHelpers[0].name}在看商路补给`
          : "短途派遣后会亮旗路",
      active: expeditionHelpers.length > 0 || Boolean(activeTradeRun),
    },
    {
      key: "garden",
      label: gardenHelpers.length > 0 ? "庭院有人安抚" : "庭院待入驻",
      text: gardenHelpers.length > 0
        ? lowMoodSpirit
          ? `${gardenHelpers[0].name}照看${lowMoodSpirit.name}`
          : `${gardenHelpers[0].name}维持庭院心情`
        : "庭院岗会把疲惫养回来",
      active: gardenHelpers.length > 0,
    },
  ];
  const activeCount = lines.filter((line) => line.active).length;
  const title = activeJob
    ? "自动化中枢 · 产线运转"
    : activeCount >= 4
      ? "自动化中枢 · 六线巡回"
      : activeCount >= 2
        ? "自动化中枢 · 多线接手"
        : "自动化中枢 · 待派工";
  const headline = activeJob
    ? `${activeJob.recipeName} 正沿后厂五段走线`
    : activeCount >= 4
      ? "精怪岗位把生产、经营和生活接成一圈"
      : activeCount >= 2
        ? "精怪岗位已经在画面里接上多条线"
        : "把精怪调到岗位，自动化会从这里亮起来";
  const detail = activeJob
    ? `${activeJob.currentStage.cue} 出锅后会接入旧铺、订单或库存。`
    : workshopAromaState.orderUnlocked
      ? `${workshopAromaState.itemName || "上一锅香气"}已经把旧铺/订单线点亮。`
      : `${focus.stageSummary || focus.advice || "田地、后厂和旧铺会随着岗位逐段留下动作。"}`
  const primaryAction = activeJob
    ? "workshop_queue"
    : aromaSpec?.orderId
      ? "order"
      : workshopHelpers.length > 0 || builtWorkshop
        ? "workshop"
        : "spirit";
  return {
    id: "automation_hub_world_note",
    type: "automation",
    title: `${title} · 可点`,
    headline,
    detail,
    routeText: "田垄 -> 后厂 -> 旧铺 -> 巡灯 -> 远征 -> 庭院",
    primaryAction,
    activeCount,
    helperCount: safeSpirits.length,
    workshopHelperCount: workshopHelpers.length,
    fieldHelperCount: fieldHelpers.length,
    shopHelperCount: shopHelpers.length,
    patrolHelperCount: patrolHelpers.length,
    expeditionHelperCount: expeditionHelpers.length,
    gardenHelperCount: gardenHelpers.length,
    queueCount: queue.length,
    orderId: aromaSpec?.orderId || orderBoard?.top?.orderId || "",
    orderTitle: aromaSpec?.orderTitle || orderBoard?.top?.title || "",
    outputItemName: activeJob?.outputItemName || focus.outputItemName || workshopAromaState.itemName || "",
    activeStageLabel: activeJob?.currentStage.label || "",
    progress: Number(activeJob?.progress || focus.progress || 0),
    lines,
    rect: { x: 442, y: 506, width: 392, height: 132 },
  };
}

export function automationHubAtPointData(spec = null, px = 0, py = 0) {
  if (!spec?.rect) return null;
  const { rect } = spec;
  return px >= rect.x && px <= rect.x + rect.width && py >= rect.y && py <= rect.y + rect.height
    ? spec
    : null;
}

export function automationHubFocusData(spec = null) {
  if (!spec) return null;
  if (spec.primaryAction === "order" && spec.orderId) {
    return {
      type: "order",
      orderId: spec.orderId,
    };
  }
  const selector = spec.primaryAction === "workshop_queue"
    ? "[data-workshop-queue]"
    : spec.primaryAction === "workshop"
      ? ".workshop-production-line"
      : "#spiritList";
  const fallbackSelector = spec.primaryAction === "spirit" ? "#spiritList" : ".build-panel";
  return {
    type: "compass",
    compassTarget: {
      selector,
      fallbackSelector,
      label: `点选自动化：${spec.title.replace(" · 可点", "")}`,
      log: `${spec.headline}。${spec.detail} 当前六线巡回：${spec.lines.map((line) => `${line.label}：${line.text}`).join(" / ")}。${spec.primaryAction === "workshop_queue" ? "先查看工坊队列和五段产线，确认下一锅是否需要补料或等入夜。" : spec.primaryAction === "workshop" ? "先看工坊效率、帮工和排产入口，让后厂从候工变成跑线。" : "先看精怪岗位，把伙伴调到农田、工坊、旧铺、巡逻、远征或庭院，自动化动作会落到主世界。"}这里只定位面板，不会自动派工、排产、入夜或消耗资源。`,
      panelGroup: spec.primaryAction === "spirit" ? "core" : "systems",
      missingTitle: "点选自动化：中枢定位",
      missingLog: "自动化中枢已经判断出下一步，但对应面板暂时没有找到。先确认核心试玩或系统深挖分组是否可见。",
    },
  };
}
