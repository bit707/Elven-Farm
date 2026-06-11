function createWorldFocus(spec = null, day = 1) {
  return spec ? { key: spec.key, day } : null;
}

function cloneTitleTextRows(rows = []) {
  return (Array.isArray(rows) ? rows : []).map((row) => ({
    title: row.title,
    text: row.text,
  }));
}

const SHOP_FOCUS_TAG_HINTS = [
  ["refreshing", "清口"],
  ["water_food", "水系"],
  ["clean_food", "清润"],
  ["cooling", "凉口"],
  ["dessert", "甜"],
  ["gift", "礼"],
  ["premium", "上品"],
  ["portable_food", "路粮"],
  ["medicine", "药"],
  ["fresh_food", "鲜"],
];

function resolveShopFocusWorldSpecs({
  day = 1,
  target = null,
  opening = null,
  state = {},
  shopCustomerForecastWorldSpec = () => null,
  shopDiagnosisWorldBoardSpec = () => null,
  shopCustomerReasonCompassWorldSpec = () => null,
  shopTrialTheaterWorldSpec = () => null,
  shopFirstCustomerThresholdWorldSpec = () => null,
  shopDoorstepCustomerVignetteSpec = () => null,
  shopFirstSaleLessonWorldSpec = () => null,
  shopFirstSaleKeepsakeWorldSpec = () => null,
  shopFirstSaleActionTrailWorldSpec = () => null,
  shopWordOfMouthSaleEchoWorldSpec = () => null,
  shopWordOfMouthSaleReasonWorldSpec = () => null,
  shopWordOfMouthFollowupRestockWorldSpec = () => null,
  shopWordOfMouthMorningFollowupWorldSpec = () => null,
  shopThoughtRouteMorningFollowupWorldSpec = () => null,
  shopThoughtRouteReadyMorningWorldSpec = () => null,
  shopThoughtRouteCaughtWorldSpec = () => null,
  shopThoughtRouteMissedWorldSpec = () => null,
  shopWordOfMouthRestockedMorningWorldSpec = () => null,
  shopWordOfMouthRestockCaughtWorldSpec = () => null,
  shopReturningTrailWorldSpec = () => null,
  shopThoughtBubbleChainSpec = () => null,
} = {}) {
  const safeOpening = opening || {};
  const shopReport = Array.isArray(state.shopReport) ? state.shopReport : [];
  const fallbackSelector = target?.fallbackSelector || (shopReport.length > 0 ? '[data-shop-report-index="0"]' : "#shopReport");
  const selector = target?.selector || '[data-shop-board="opening"]';
  const reportEntry = target?.entry
    && target.entry.reason !== "need"
    && target?.type !== "first_sale_lesson"
    && target?.type !== "first_sale_keepsake"
    && target?.type !== "shop_word_of_mouth_sale_echo"
    && target?.type !== "shop_word_of_mouth_sale_reason"
    && target?.type !== "shop_word_of_mouth_followup_restock"
    && target?.type !== "shop_word_of_mouth_morning_followup"
    && target?.type !== "shop_word_of_mouth_restocked_morning"
    && target?.type !== "shop_word_of_mouth_restock_caught"
    && target?.type !== "returning_trail"
    ? target.entry
    : null;
  const forecast = target?.type === "customer_forecast"
    ? target.forecastSpec || shopCustomerForecastWorldSpec(safeOpening)
    : null;
  const diagnosisBoard = target?.type === "shop_diagnosis_world"
    ? target.diagnosisBoard || shopDiagnosisWorldBoardSpec(safeOpening)
    : null;
  const customerReasonCompass = target?.type === "customer_reason_compass"
    ? target.customerReasonCompass || shopCustomerReasonCompassWorldSpec()
    : null;
  const trialTheater = target?.type === "shop_trial_theater"
    ? target.trialTheater || shopTrialTheaterWorldSpec(safeOpening)
    : null;
  const firstCustomerThreshold = target?.type === "first_customer_threshold"
    ? target.firstCustomerThreshold || shopFirstCustomerThresholdWorldSpec(safeOpening)
    : null;
  const doorstepVignette = target?.type === "doorstep_vignette"
    ? target.doorstepVignette || shopDoorstepCustomerVignetteSpec(safeOpening)
    : null;
  const firstSaleLesson = target?.type === "first_sale_lesson"
    ? target.firstSaleLesson || shopFirstSaleLessonWorldSpec(safeOpening)
    : null;
  const firstSaleKeepsake = target?.type === "first_sale_keepsake"
    ? target.firstSaleKeepsake || shopFirstSaleKeepsakeWorldSpec(safeOpening)
    : null;
  const firstSaleActionTrail = target?.type === "first_sale_action_trail"
    ? target.firstSaleActionTrail || shopFirstSaleActionTrailWorldSpec(safeOpening)
    : null;
  const wordOfMouthSaleEcho = target?.type === "shop_word_of_mouth_sale_echo"
    ? target.shopWordOfMouthSaleEcho || shopWordOfMouthSaleEchoWorldSpec(safeOpening)
    : null;
  const wordOfMouthSaleReason = target?.type === "shop_word_of_mouth_sale_reason"
    ? target.shopWordOfMouthSaleReason || shopWordOfMouthSaleReasonWorldSpec(safeOpening)
    : null;
  const wordOfMouthFollowupRestock = target?.type === "shop_word_of_mouth_followup_restock"
    ? target.shopWordOfMouthFollowupRestock || shopWordOfMouthFollowupRestockWorldSpec(safeOpening)
    : null;
  const wordOfMouthMorningFollowup = target?.type === "shop_word_of_mouth_morning_followup"
    ? target.shopWordOfMouthMorningFollowup || shopWordOfMouthMorningFollowupWorldSpec()
    : null;
  const thoughtRouteMorningFollowup = target?.type === "shop_thought_route_morning_followup"
    ? target.shopThoughtRouteMorningFollowup || shopThoughtRouteMorningFollowupWorldSpec()
    : null;
  const thoughtRouteReadyMorning = target?.type === "shop_thought_route_ready_morning"
    ? target.shopThoughtRouteReadyMorning || shopThoughtRouteReadyMorningWorldSpec()
    : null;
  const thoughtRouteCaught = target?.type === "shop_thought_route_caught"
    ? target.shopThoughtRouteCaught || shopThoughtRouteCaughtWorldSpec()
    : null;
  const thoughtRouteMissed = target?.type === "shop_thought_route_missed"
    ? target.shopThoughtRouteMissed || shopThoughtRouteMissedWorldSpec()
    : null;
  const wordOfMouthRestockedMorning = target?.type === "shop_word_of_mouth_restocked_morning"
    ? target.shopWordOfMouthRestockedMorning || shopWordOfMouthRestockedMorningWorldSpec()
    : null;
  const wordOfMouthRestockCaught = target?.type === "shop_word_of_mouth_restock_caught"
    ? target.shopWordOfMouthRestockCaught || shopWordOfMouthRestockCaughtWorldSpec(undefined, safeOpening)
    : null;
  const returningTrail = target?.type === "returning_trail"
    ? target.returningTrail || shopReturningTrailWorldSpec(safeOpening)
    : null;
  const thoughtChain = target?.type === "thought_chain"
    ? target.thoughtChain || shopThoughtBubbleChainSpec(safeOpening)
    : null;
  return {
    day,
    selector,
    fallbackSelector,
    reportEntry,
    forecast,
    diagnosisBoard,
    customerReasonCompass,
    trialTheater,
    firstCustomerThreshold,
    doorstepVignette,
    firstSaleLesson,
    firstSaleKeepsake,
    firstSaleActionTrail,
    wordOfMouthSaleEcho,
    wordOfMouthSaleReason,
    wordOfMouthFollowupRestock,
    wordOfMouthMorningFollowup,
    thoughtRouteMorningFollowup,
    thoughtRouteReadyMorning,
    thoughtRouteCaught,
    thoughtRouteMissed,
    wordOfMouthRestockedMorning,
    wordOfMouthRestockCaught,
    returningTrail,
    thoughtChain,
    focusState: {
      shopCustomerForecastWorldFocus: createWorldFocus(forecast, day),
      shopDiagnosisWorldBoardFocus: createWorldFocus(diagnosisBoard, day),
      shopCustomerReasonCompassWorldFocus: createWorldFocus(customerReasonCompass, day),
      shopTrialTheaterWorldFocus: createWorldFocus(trialTheater, day),
      shopFirstCustomerThresholdWorldFocus: createWorldFocus(firstCustomerThreshold, day),
      shopDoorstepCustomerVignetteFocus: createWorldFocus(doorstepVignette, day),
      shopThoughtBubbleChainWorldFocus: createWorldFocus(thoughtChain, day),
      shopFirstSaleLessonWorldFocus: createWorldFocus(firstSaleLesson, day),
      shopFirstSaleKeepsakeWorldFocus: createWorldFocus(firstSaleKeepsake, day),
      shopFirstSaleActionTrailWorldFocus: createWorldFocus(firstSaleActionTrail, day),
      shopWordOfMouthSaleEchoWorldFocus: createWorldFocus(wordOfMouthSaleEcho, day),
      shopWordOfMouthSaleReasonWorldFocus: createWorldFocus(wordOfMouthSaleReason, day),
      shopWordOfMouthFollowupRestockWorldFocus: createWorldFocus(wordOfMouthFollowupRestock, day),
      shopWordOfMouthMorningFollowupWorldFocus: createWorldFocus(wordOfMouthMorningFollowup, day),
      shopThoughtRouteMorningFollowupWorldFocus: createWorldFocus(thoughtRouteMorningFollowup, day),
      shopThoughtRouteReadyMorningWorldFocus: createWorldFocus(thoughtRouteReadyMorning, day),
      shopThoughtRouteCaughtWorldFocus: createWorldFocus(thoughtRouteCaught, day),
      shopThoughtRouteMissedWorldFocus: createWorldFocus(thoughtRouteMissed, day),
      shopWordOfMouthRestockedMorningWorldFocus: createWorldFocus(wordOfMouthRestockedMorning, day),
      shopWordOfMouthRestockCaughtWorldFocus: createWorldFocus(wordOfMouthRestockCaught, day),
      shopReturningTrailWorldFocus: createWorldFocus(returningTrail, day),
    },
  };
}

function shopCanvasCustomerFocusSnapshotWorld({
  day = 1,
  target = null,
  reportEntry = null,
  forecast = null,
  diagnosisBoard = null,
  trialTheater = null,
  firstCustomerThreshold = null,
  doorstepVignette = null,
  thoughtChain = null,
  firstSaleLesson = null,
  firstSaleKeepsake = null,
  firstSaleActionTrail = null,
  wordOfMouthSaleEcho = null,
  wordOfMouthSaleReason = null,
  wordOfMouthFollowupRestock = null,
  wordOfMouthMorningFollowup = null,
  thoughtRouteMorningFollowup = null,
  thoughtRouteReadyMorning = null,
  thoughtRouteCaught = null,
  thoughtRouteMissed = null,
  wordOfMouthRestockedMorning = null,
  wordOfMouthRestockCaught = null,
  returningTrail = null,
} = {}) {
  return {
    day,
    type: target?.type || "board",
    label: target?.label || "旧铺看板",
    reportIndex: firstSaleLesson ? Number(firstSaleLesson.reportIndex ?? -1) : reportEntry ? Number(reportEntry.reportIndex ?? -1) : -1,
    entry: target?.entry ? { ...target.entry } : null,
    forecastSpec: forecast ? {
      key: forecast.key,
      day: forecast.day,
      tone: forecast.tone,
      title: forecast.title,
      customerName: forecast.customerName,
      hotTagLabel: forecast.hotTagLabel,
      itemText: forecast.itemText,
      weatherLine: forecast.weatherLine,
      themeLine: forecast.themeLine,
      openingLine: forecast.openingLine,
      advice: forecast.advice,
    } : null,
    diagnosisBoard: diagnosisBoard ? {
      key: diagnosisBoard.key,
      title: diagnosisBoard.title,
      headline: diagnosisBoard.headline,
      evidence: diagnosisBoard.evidence,
      nextAction: diagnosisBoard.nextAction,
      tone: diagnosisBoard.tone,
      buyers: diagnosisBoard.buyers,
      leavers: diagnosisBoard.leavers,
      visitors: diagnosisBoard.visitors,
      conversion: diagnosisBoard.conversion,
      hotTagLabel: diagnosisBoard.hotTagLabel,
      mainCustomer: diagnosisBoard.mainCustomer,
    } : null,
    trialTheater: trialTheater ? {
      key: trialTheater.key,
      title: trialTheater.title,
      headline: trialTheater.headline,
      leadCustomer: trialTheater.leadCustomer,
      leadItem: trialTheater.leadItem,
      hotTagLabel: trialTheater.hotTagLabel,
      resultText: trialTheater.resultText,
      reasonText: trialTheater.reasonText,
      nextAction: trialTheater.nextAction,
      tone: trialTheater.tone,
    } : null,
    firstCustomerThreshold: firstCustomerThreshold ? {
      key: firstCustomerThreshold.key,
      title: firstCustomerThreshold.title,
      headline: firstCustomerThreshold.headline,
      customerName: firstCustomerThreshold.customerName,
      hotTagLabel: firstCustomerThreshold.hotTagLabel,
      itemName: firstCustomerThreshold.itemName,
      resultLabel: firstCustomerThreshold.resultLabel,
      resultText: firstCustomerThreshold.resultText,
      reasonText: firstCustomerThreshold.reasonText,
      nextAction: firstCustomerThreshold.nextAction,
      bought: firstCustomerThreshold.bought,
      warned: firstCustomerThreshold.warned,
      reportIndex: firstCustomerThreshold.reportIndex,
      steps: cloneTitleTextRows(firstCustomerThreshold.steps),
    } : null,
    doorstepVignette: doorstepVignette ? {
      key: doorstepVignette.key,
      title: doorstepVignette.title,
      summary: doorstepVignette.summary,
      reviewLine: doorstepVignette.reviewLine,
      leadName: doorstepVignette.leadRow?.name || "",
      leadLabel: doorstepVignette.leadRow?.label || "",
      leadBubble: doorstepVignette.leadRow?.bubble || "",
      leadDetail: doorstepVignette.leadRow?.detail || "",
      buyers: doorstepVignette.buyers,
      warnCount: doorstepVignette.warnCount,
    } : null,
    thoughtChain: thoughtChain ? {
      key: thoughtChain.key,
      title: thoughtChain.title,
      headline: thoughtChain.headline,
      summary: thoughtChain.summary,
      cta: thoughtChain.cta,
      buyers: thoughtChain.buyers,
      leavers: thoughtChain.leavers,
      rows: (Array.isArray(thoughtChain.rows) ? thoughtChain.rows : []).map((row) => ({
        name: row.name || "顾客",
        reason: row.reason || "",
        text: row.text || "",
        statusLabel: row.statusLabel || "",
      })),
    } : null,
    firstSaleLesson: firstSaleLesson ? {
      key: firstSaleLesson.key,
      title: firstSaleLesson.title,
      headline: firstSaleLesson.headline,
      customerName: firstSaleLesson.customerName,
      itemName: firstSaleLesson.itemName,
      price: firstSaleLesson.price,
      reasonText: firstSaleLesson.reasonText,
      reviewQuote: firstSaleLesson.reviewQuote,
      returnChance: firstSaleLesson.returnChance,
      returnText: firstSaleLesson.returnText,
      nextAction: firstSaleLesson.nextAction,
      reportIndex: firstSaleLesson.reportIndex,
    } : null,
    firstSaleKeepsake: firstSaleKeepsake ? {
      key: firstSaleKeepsake.key,
      title: firstSaleKeepsake.title,
      headline: firstSaleKeepsake.headline,
      customerName: firstSaleKeepsake.customerName,
      itemName: firstSaleKeepsake.itemName,
      price: firstSaleKeepsake.price,
      reasonText: firstSaleKeepsake.reasonText,
      reviewQuote: firstSaleKeepsake.reviewQuote,
      returnChance: firstSaleKeepsake.returnChance,
      returnText: firstSaleKeepsake.returnText,
      nextAction: firstSaleKeepsake.nextAction,
      reportIndex: firstSaleKeepsake.reportIndex,
      hotTagLabel: firstSaleKeepsake.hotTagLabel,
    } : null,
    firstSaleActionTrail: firstSaleActionTrail ? {
      key: firstSaleActionTrail.key,
      title: firstSaleActionTrail.title,
      headline: firstSaleActionTrail.headline,
      customerName: firstSaleActionTrail.customerName,
      itemName: firstSaleActionTrail.itemName,
      price: firstSaleActionTrail.price,
      reasonText: firstSaleActionTrail.reasonText,
      reviewText: firstSaleActionTrail.reviewText,
      returnText: firstSaleActionTrail.returnText,
      reportIndex: firstSaleActionTrail.reportIndex,
      steps: cloneTitleTextRows(firstSaleActionTrail.steps),
    } : null,
    shopWordOfMouthSaleEcho: wordOfMouthSaleEcho ? {
      key: wordOfMouthSaleEcho.key,
      title: wordOfMouthSaleEcho.title,
      headline: wordOfMouthSaleEcho.headline,
      customerName: wordOfMouthSaleEcho.customerName,
      sourceLabel: wordOfMouthSaleEcho.sourceLabel,
      itemName: wordOfMouthSaleEcho.itemName,
      price: wordOfMouthSaleEcho.price,
      resultText: wordOfMouthSaleEcho.resultText,
      reportIndex: wordOfMouthSaleEcho.reportIndex,
      steps: cloneTitleTextRows(wordOfMouthSaleEcho.steps),
    } : null,
    shopWordOfMouthSaleReason: wordOfMouthSaleReason ? {
      key: wordOfMouthSaleReason.key,
      title: wordOfMouthSaleReason.title,
      headline: wordOfMouthSaleReason.headline,
      customerName: wordOfMouthSaleReason.customerName,
      sourceLabel: wordOfMouthSaleReason.sourceLabel,
      itemName: wordOfMouthSaleReason.itemName,
      price: wordOfMouthSaleReason.price,
      nextText: wordOfMouthSaleReason.nextText,
      reportIndex: wordOfMouthSaleReason.reportIndex,
      reasons: cloneTitleTextRows(wordOfMouthSaleReason.reasons),
    } : null,
    shopWordOfMouthFollowupRestock: wordOfMouthFollowupRestock ? {
      key: wordOfMouthFollowupRestock.key,
      title: wordOfMouthFollowupRestock.title,
      headline: wordOfMouthFollowupRestock.headline,
      customerName: wordOfMouthFollowupRestock.customerName,
      sourceLabel: wordOfMouthFollowupRestock.sourceLabel,
      itemName: wordOfMouthFollowupRestock.itemName,
      price: wordOfMouthFollowupRestock.price,
      reportIndex: wordOfMouthFollowupRestock.reportIndex,
      steps: cloneTitleTextRows(wordOfMouthFollowupRestock.steps),
    } : null,
    shopWordOfMouthMorningFollowup: wordOfMouthMorningFollowup ? {
      key: wordOfMouthMorningFollowup.key,
      title: wordOfMouthMorningFollowup.title,
      headline: wordOfMouthMorningFollowup.headline,
      customerName: wordOfMouthMorningFollowup.customerName,
      sourceLabel: wordOfMouthMorningFollowup.sourceLabel,
      itemName: wordOfMouthMorningFollowup.itemName,
      price: wordOfMouthMorningFollowup.price,
      reportIndex: wordOfMouthMorningFollowup.reportIndex,
      morningDetail: wordOfMouthMorningFollowup.morningDetail,
      steps: cloneTitleTextRows(wordOfMouthMorningFollowup.steps),
    } : null,
    shopThoughtRouteMorningFollowup: thoughtRouteMorningFollowup ? {
      key: thoughtRouteMorningFollowup.key,
      title: thoughtRouteMorningFollowup.title,
      headline: thoughtRouteMorningFollowup.headline,
      customerName: thoughtRouteMorningFollowup.customerName,
      itemName: thoughtRouteMorningFollowup.itemName,
      routeLabel: thoughtRouteMorningFollowup.routeLabel,
      routeDetail: thoughtRouteMorningFollowup.routeDetail,
      steps: cloneTitleTextRows(thoughtRouteMorningFollowup.steps),
    } : null,
    shopThoughtRouteReadyMorning: thoughtRouteReadyMorning ? {
      key: thoughtRouteReadyMorning.key,
      title: thoughtRouteReadyMorning.title,
      headline: thoughtRouteReadyMorning.headline,
      itemName: thoughtRouteReadyMorning.itemName,
      have: thoughtRouteReadyMorning.have,
      routeLabel: thoughtRouteReadyMorning.routeLabel,
      steps: cloneTitleTextRows(thoughtRouteReadyMorning.steps),
    } : null,
    shopThoughtRouteCaught: thoughtRouteCaught ? {
      key: thoughtRouteCaught.key,
      title: thoughtRouteCaught.title,
      headline: thoughtRouteCaught.headline,
      customerName: thoughtRouteCaught.customerName,
      itemName: thoughtRouteCaught.itemName,
      price: thoughtRouteCaught.price,
      resultText: thoughtRouteCaught.resultText,
      steps: cloneTitleTextRows(thoughtRouteCaught.steps),
    } : null,
    shopThoughtRouteMissed: thoughtRouteMissed ? {
      key: thoughtRouteMissed.key,
      title: thoughtRouteMissed.title,
      headline: thoughtRouteMissed.headline,
      itemName: thoughtRouteMissed.itemName,
      routeDetail: thoughtRouteMissed.routeDetail,
      steps: cloneTitleTextRows(thoughtRouteMissed.steps),
    } : null,
    shopWordOfMouthRestockedMorning: wordOfMouthRestockedMorning ? {
      key: wordOfMouthRestockedMorning.key,
      title: wordOfMouthRestockedMorning.title,
      headline: wordOfMouthRestockedMorning.headline,
      customerName: wordOfMouthRestockedMorning.customerName,
      sourceLabel: wordOfMouthRestockedMorning.sourceLabel,
      itemId: wordOfMouthRestockedMorning.itemId,
      itemName: wordOfMouthRestockedMorning.itemName,
      have: wordOfMouthRestockedMorning.have,
      targetCount: wordOfMouthRestockedMorning.targetCount,
      reportIndex: wordOfMouthRestockedMorning.reportIndex,
      steps: cloneTitleTextRows(wordOfMouthRestockedMorning.steps),
    } : null,
    shopWordOfMouthRestockCaught: wordOfMouthRestockCaught ? {
      key: wordOfMouthRestockCaught.key,
      title: wordOfMouthRestockCaught.title,
      headline: wordOfMouthRestockCaught.headline,
      customerName: wordOfMouthRestockCaught.customerName,
      sourceLabel: wordOfMouthRestockCaught.sourceLabel,
      itemId: wordOfMouthRestockCaught.itemId,
      itemName: wordOfMouthRestockCaught.itemName,
      price: wordOfMouthRestockCaught.price,
      resultText: wordOfMouthRestockCaught.resultText,
      reportIndex: wordOfMouthRestockCaught.reportIndex,
      steps: cloneTitleTextRows(wordOfMouthRestockCaught.steps),
    } : null,
    returningTrail: returningTrail ? {
      key: returningTrail.key,
      title: returningTrail.title,
      headline: returningTrail.headline,
      customerLabel: returningTrail.customerLabel,
      itemText: returningTrail.itemText,
      chance: returningTrail.chance,
      realized: returningTrail.realized,
      resultText: returningTrail.resultText,
      detailText: returningTrail.detailText,
      nextAction: returningTrail.nextAction,
    } : null,
  };
}

function shopFocusLogWorld({
  target = null,
  opening = null,
  liveFocus = null,
  restockTarget = null,
  reputationStage = null,
  state = {},
  reportEntry = null,
  forecast = null,
  diagnosisBoard = null,
  customerReasonCompass = null,
  trialTheater = null,
  firstCustomerThreshold = null,
  doorstepVignette = null,
  thoughtChain = null,
  firstSaleLesson = null,
  firstSaleKeepsake = null,
  firstSaleActionTrail = null,
  wordOfMouthSaleEcho = null,
  wordOfMouthSaleReason = null,
  wordOfMouthFollowupRestock = null,
  wordOfMouthMorningFollowup = null,
  thoughtRouteMorningFollowup = null,
  thoughtRouteReadyMorning = null,
  thoughtRouteCaught = null,
  thoughtRouteMissed = null,
  wordOfMouthRestockedMorning = null,
  wordOfMouthRestockCaught = null,
  returningTrail = null,
  sellableInventoryGoods = () => [],
  shopRestockTargetReady = () => false,
  shopWaterwayBrokerSceneSpec = () => null,
  shopWaterwayBrokerSceneSummaryText = () => "",
  shopWaterwayShelfSpotlightSpec = () => null,
  shopWaterwayShelfSpotlightSummaryText = () => "",
  shopWaterwayCustomerBrowseSpec = () => null,
  shopWaterwayCustomerBrowseSummaryText = () => "",
  shopWaterwayReorderFollowupSceneSpec = () => null,
  shopWaterwayReorderFollowupSummaryText = () => "",
  waterwayStandingOrderSupplySpec = () => null,
  waterwayStandingOrderSupplySummaryText = () => "",
} = {}) {
  const safeOpening = opening || {};
  const shopReport = Array.isArray(state.shopReport) ? state.shopReport : [];
  const inventory = state.inventory || {};
  const needBubbles = Array.isArray(safeOpening.needBubbles) ? safeOpening.needBubbles : [];
  const goods = Array.isArray(sellableInventoryGoods()) ? sellableInventoryGoods() : [];
  const boardLog = liveFocus
    ? target?.type === "ledger"
      ? `顾客决策账页已高亮：主客群、成交链、流失短板和明日建议都写在右侧。${liveFocus.shelfAdvice}`
      : `今日焦点：${liveFocus.headline}；${liveFocus.shelfAdvice}`
    : needBubbles.length > 0
      ? `门口顾客在想：${needBubbles.slice(0, 2).map((entry) => `${entry.name}想要${entry.text}`).join("；")}`
      : shopReport.length > 0
        ? "今日旧铺反馈已经记在右侧，适合复盘定价、主题和缺货。"
        : goods.length > 0
          ? "已有可卖货，先看热卖标签预告，再决定什么时候开铺。"
          : "旧铺还没营业，先从田里、工坊或订单线准备一批能上架的货。";
  const restockLog = restockTarget
    ? `${restockTarget.itemName} 补货目标：${restockTarget.itemId ? Number(inventory[restockTarget.itemId] || 0) : goods.length}/${restockTarget.desiredCount}，${shopRestockTargetReady(restockTarget) ? "已经够数，可以完成补货。" : `期限第 ${restockTarget.dueDay} 天，继续按路线卡准备。`}`
    : "";
  const reputationLog = reputationStage?.progressCount > 0
    ? `旧铺名声到了「${reputationStage.stageName}」：${reputationStage.metricsText}。${reputationStage.recentProofs.length ? `最近证据：${reputationStage.recentProofs.join("；")}。` : ""}下一步：${reputationStage.nextGoal}`
    : "";
  const journeyBoardLog = target?.type === "journey_board" && target.journeySpec
    ? `旧铺旅线总览已高亮：主客 ${target.journeySpec.mainCustomer}，成交率 ${target.journeySpec.conversion}%，成交 ${target.journeySpec.buyers}/${target.journeySpec.visitors}，短板 ${target.journeySpec.blockerText}。明日建议：${target.journeySpec.nextAction}`
    : "";
  const leaveRecoveryLog = target?.type === "leave_recovery" && target.leaveRecoverySpec
    ? `离店补救路线已高亮：${target.leaveRecoverySpec.routeSteps.map((step) => `${step.label}：${step.text}`).join("；")}。明日改法：${target.leaveRecoverySpec.nextAction}`
    : "";
  const doorstepVignetteLog = target?.type === "doorstep_vignette"
    ? `点选门口小景：${doorstepVignette?.reviewLine || "旧铺顾客旅线已高亮。"}${doorstepVignette?.summary ? ` ${doorstepVignette.summary}` : ""}只定位旧铺旅线和经营报告，不会自动开铺、改价或补货。`
    : "";
  const thoughtChainLog = thoughtChain
    ? `点选门口想法串：${thoughtChain.headline}。${thoughtChain.summary}。明日改法：${thoughtChain.cta}。这里只定位旧铺旅线和经营报告，不会自动开铺、调价、补货或消耗资源。`
    : "";
  const waterwayBrokerLog = target?.type === "waterway_broker"
    ? shopWaterwayBrokerSceneSummaryText(shopWaterwayBrokerSceneSpec(safeOpening))
    : "";
  const waterwayShelfLog = target?.type === "waterway_shelf"
    ? shopWaterwayShelfSpotlightSummaryText(shopWaterwayShelfSpotlightSpec())
    : "";
  const waterwayBrowseLog = target?.type === "waterway_browse"
    ? shopWaterwayCustomerBrowseSummaryText(shopWaterwayCustomerBrowseSpec(safeOpening))
    : "";
  const waterwayReorderFollowupLog = target?.type === "waterway_reorder_followup"
    ? shopWaterwayReorderFollowupSummaryText(shopWaterwayReorderFollowupSceneSpec(safeOpening))
    : "";
  const waterwayStandingOrderLog = target?.type === "waterway_standing_order"
    ? waterwayStandingOrderSupplySummaryText(waterwayStandingOrderSupplySpec())
    : "";
  const firstSaleReceiptLog = target?.type === "first_sale_receipt" && target.firstSaleReceipt
    ? `首单成交小票：${target.firstSaleReceipt.customerName} 买走 ${target.firstSaleReceipt.itemName}${target.firstSaleReceipt.price ? `，成交 ${target.firstSaleReceipt.price} 灵石` : ""}。购买原因：${target.firstSaleReceipt.reasonText} 顾客短评：${target.firstSaleReceipt.reviewQuote}${target.firstSaleReceipt.returnPreview ? ` 回头客预告：${target.firstSaleReceipt.returnSummary || target.firstSaleReceipt.returnPreview.summary}；${target.firstSaleReceipt.returnCta || target.firstSaleReceipt.returnPreview.cta}` : ""}`
    : "";
  const firstSaleKeepsakeLog = firstSaleKeepsake
    ? `点选首单钱签余温：${firstSaleKeepsake.customerName} 买走 ${firstSaleKeepsake.itemName} 的顾客脚印已经留在门口。购买原因：${firstSaleKeepsake.reasonText}。短评：${firstSaleKeepsake.reviewQuote}。回头苗头 ${firstSaleKeepsake.returnChance || 0}%：${firstSaleKeepsake.returnText}。下轮建议：${firstSaleKeepsake.nextAction}。这里只定位旧铺报告，不会自动开铺、补货或改价。`
    : "";
  const firstSaleActionTrailLog = firstSaleActionTrail
    ? `点选首单成交动作线：${firstSaleActionTrail.customerName} 的第一笔成交已按动作线高亮：想法泡泡 -> 伸手拿货 -> 价签成立 -> 灵石入账。${firstSaleActionTrail.itemName} 成交 ${firstSaleActionTrail.price || 0} 灵石；原因：${firstSaleActionTrail.reasonText}。这里只定位旧铺报告，不会自动开铺、补货或改价。`
    : "";
  const wordOfMouthSaleEchoLog = wordOfMouthSaleEcho
    ? `点选来帖成交回响：${wordOfMouthSaleEcho.sourceLabel}传来的话已经落成买卖，${wordOfMouthSaleEcho.customerName} 买走 ${wordOfMouthSaleEcho.itemName}${wordOfMouthSaleEcho.price ? `，成交 ${wordOfMouthSaleEcho.price} 灵石` : ""}。传话 -> 认门 -> 头排接货 -> 成交入账已高亮；这里只回看旧铺报告和市闻来帖，不会自动开铺、接客、成交、改价、补货或消耗库存。`
    : "";
  const wordOfMouthSaleReasonLog = wordOfMouthSaleReason
    ? `点选来帖成交三因签：这单能成是因为 ${wordOfMouthSaleReason.reasons.map((reason) => `${reason.title}：${reason.text}`).join("；")}。明日复用：${wordOfMouthSaleReason.nextText}。这里只复盘成交原因和定位旧铺报告，不会自动开铺、接客、成交、改价、补货或消耗库存。`
    : "";
  const wordOfMouthFollowupRestockLog = wordOfMouthFollowupRestock
    ? `点选来帖续货明日签：${wordOfMouthFollowupRestock.steps.map((step) => `${step.title}：${step.text}`).join("；")}。这张牌只提示明日续货和定位旧铺报告，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存。`
    : "";
  const wordOfMouthMorningFollowupLog = wordOfMouthMorningFollowup
    ? `点选来帖续货清晨灯：${wordOfMouthMorningFollowup.headline}。${wordOfMouthMorningFollowup.morningDetail} ${wordOfMouthMorningFollowup.steps.map((step) => `${step.title}：${step.text}`).join("；")}。这张清晨灯只定位旧铺报告和来帖续货复盘，不会自动制作、播种、补货、开铺、接客、成交、改价或消耗库存。`
    : "";
  const thoughtRouteMorningFollowupLog = thoughtRouteMorningFollowup
    ? `点选旧铺想法续路线签：${thoughtRouteMorningFollowup.actionTitle || "清晨行动牌：旧铺想法续路线"}。${thoughtRouteMorningFollowup.headline}。${thoughtRouteMorningFollowup.steps.map((step) => `${step.title}：${step.text}`).join("；")}。${thoughtRouteMorningFollowup.cta || "只延续旧铺顾客想法、标签判断和备货路线，不会自动制作、播种、补货、开铺、调价或消耗资源"}。`
    : "";
  const thoughtRouteReadyMorningLog = thoughtRouteReadyMorning
    ? `点选旧铺想法备妥签：${thoughtRouteReadyMorning.itemName} 已备在手 ${thoughtRouteReadyMorning.have}。${thoughtRouteReadyMorning.steps.map((step) => `${step.title}：${step.text}`).join("；")}。只确认这条想法路线已备到位并定位旧铺报告，不会自动上架、补货、开铺、接客、成交、改价或消耗库存。`
    : "";
  const thoughtRouteCaughtLog = thoughtRouteCaught
    ? `点选旧铺想法接住签：${thoughtRouteCaught.steps.map((step) => `${step.title}：${step.text}`).join("；")}。${thoughtRouteCaught.resultText}。只回看这条想法路线如何接住成交并定位旧铺报告，不会自动上架、开铺、接客、成交、改价、补货或消耗库存。`
    : "";
  const thoughtRouteMissedLog = thoughtRouteMissed
    ? `点选旧铺想法落空签：${thoughtRouteMissed.steps.map((step) => `${step.title}：${step.text}`).join("；")}。只回看这条想法路线今天卡在什么地方并定位旧铺报告，不会自动上架、开铺、接客、成交、改价、补货或消耗库存。`
    : "";
  const wordOfMouthRestockedMorningLog = wordOfMouthRestockedMorning
    ? `点选来帖续货备回签：${wordOfMouthRestockedMorning.itemName} 已备到 ${wordOfMouthRestockedMorning.have}/${wordOfMouthRestockedMorning.targetCount}。${wordOfMouthRestockedMorning.steps.map((step) => `${step.title}：${step.text}`).join("；")}。这里只确认库存已备回并定位旧铺报告，不会自动上架、补货、开铺、接客、成交、改价或消耗库存。`
    : "";
  const wordOfMouthRestockCaughtLog = wordOfMouthRestockCaught
    ? `点选来帖续货接住签：${wordOfMouthRestockCaught.steps.map((step) => `${step.title}：${step.text}`).join("；")}。${wordOfMouthRestockCaught.customerName} 再次买走 ${wordOfMouthRestockCaught.itemName}${wordOfMouthRestockCaught.price ? `，成交 ${wordOfMouthRestockCaught.price} 灵石` : ""}，昨天的口碑今天续上了。这里只回看续货成交和定位旧铺报告，不会自动上架、开铺、接客、成交、改价、补货或消耗库存。`
    : "";
  const firstSaleLessonLog = firstSaleLesson
    ? `点选首单原因续航牌：成交原因四格已高亮，想法泡泡「${firstSaleLesson.needText}」、买了 ${firstSaleLesson.itemName}、价签 ${firstSaleLesson.price || 0} 灵石、明日补货 ${firstSaleLesson.nextAction}。玩家能说出首单原因：${firstSaleLesson.reasonText}。${firstSaleLesson.safety || "只定位旧铺报告，不会自动补货或开铺"}。`
    : "";
  const returningTrailLog = returningTrail
    ? `点选熟脸回门路牌：${returningTrail.customerLabel} 与 ${returningTrail.itemText} 的回头路已高亮。${returningTrail.resultText}；原因：${returningTrail.detailText} 下一步：${returningTrail.nextAction}。这里只定位旧铺报告，不会自动开铺、补货或改价。`
    : "";
  const forecastLog = forecast
    ? `点选顾客风向：${forecast.customerName} 今日更看重 ${forecast.hotTagLabel}；主推 ${forecast.itemText}。${forecast.advice}`
    : "";
  const diagnosisLog = diagnosisBoard
    ? `点选旧铺诊断挂签：${diagnosisBoard.headline}。证据：${diagnosisBoard.evidence} 明日改法：${diagnosisBoard.nextAction}。这里只定位账页，不会自动改价、补货或开铺。`
    : "";
  const customerReasonCompassLog = customerReasonCompass
    ? `顾客三因罗盘 · 可点：${customerReasonCompass.rows.map((row) => `${row.title}：${row.text}`).join("；")}。${customerReasonCompass.safety}。`
    : "";
  const trialTheaterLog = trialTheater
    ? `点选旧铺试营业小剧场：${trialTheater.headline}。${trialTheater.resultText}。原因：${trialTheater.reasonText} 下一步：${trialTheater.nextAction}。这里只定位旧铺报告，不会自动开铺、改价、补货或交付订单。`
    : "";
  const firstCustomerThresholdLog = firstCustomerThreshold
    ? `点选首客过门三步桥：${firstCustomerThreshold.customerName} 的门口判断已高亮：跨过门槛 -> 先看货签 -> ${firstCustomerThreshold.resultLabel}。结果：${firstCustomerThreshold.resultText}。原因：${firstCustomerThreshold.reasonText}。下一步：${firstCustomerThreshold.nextAction}。${firstCustomerThreshold.safety}。`
    : "";
  return reportEntry
    ? `${reportEntry.name} 的反馈已在经营报告里高亮：${reportEntry.text}${reportEntry.detail ? ` · ${reportEntry.detail}` : ""}`
    : `${target?.label || "旧铺看板"}已在经营报告里高亮。${customerReasonCompassLog || diagnosisLog || firstCustomerThresholdLog || trialTheaterLog || thoughtChainLog || returningTrailLog || thoughtRouteCaughtLog || thoughtRouteMissedLog || thoughtRouteReadyMorningLog || thoughtRouteMorningFollowupLog || wordOfMouthRestockCaughtLog || wordOfMouthRestockedMorningLog || wordOfMouthMorningFollowupLog || wordOfMouthFollowupRestockLog || wordOfMouthSaleReasonLog || wordOfMouthSaleEchoLog || firstSaleActionTrailLog || firstSaleKeepsakeLog || firstSaleLessonLog || forecastLog || firstSaleReceiptLog || leaveRecoveryLog || waterwayStandingOrderLog || waterwayReorderFollowupLog || waterwayBrowseLog || waterwayShelfLog || waterwayBrokerLog || journeyBoardLog || doorstepVignetteLog || (target?.type === "reputation" && reputationLog ? reputationLog : target?.type === "restock" && restockLog ? restockLog : boardLog)}`;
}

export function shopFocusWorldData(options = {}) {
  const resolved = resolveShopFocusWorldSpecs(options);
  return {
    ...resolved,
    snapshot: shopCanvasCustomerFocusSnapshotWorld({
      day: resolved.day,
      target: options.target,
      reportEntry: resolved.reportEntry,
      forecast: resolved.forecast,
      diagnosisBoard: resolved.diagnosisBoard,
      trialTheater: resolved.trialTheater,
      firstCustomerThreshold: resolved.firstCustomerThreshold,
      doorstepVignette: resolved.doorstepVignette,
      thoughtChain: resolved.thoughtChain,
      firstSaleLesson: resolved.firstSaleLesson,
      firstSaleKeepsake: resolved.firstSaleKeepsake,
      firstSaleActionTrail: resolved.firstSaleActionTrail,
      wordOfMouthSaleEcho: resolved.wordOfMouthSaleEcho,
      wordOfMouthSaleReason: resolved.wordOfMouthSaleReason,
      wordOfMouthFollowupRestock: resolved.wordOfMouthFollowupRestock,
      wordOfMouthMorningFollowup: resolved.wordOfMouthMorningFollowup,
      thoughtRouteMorningFollowup: resolved.thoughtRouteMorningFollowup,
      thoughtRouteReadyMorning: resolved.thoughtRouteReadyMorning,
      thoughtRouteCaught: resolved.thoughtRouteCaught,
      thoughtRouteMissed: resolved.thoughtRouteMissed,
      wordOfMouthRestockedMorning: resolved.wordOfMouthRestockedMorning,
      wordOfMouthRestockCaught: resolved.wordOfMouthRestockCaught,
      returningTrail: resolved.returningTrail,
    }),
    log: shopFocusLogWorld({
      ...options,
      ...resolved,
    }),
  };
}

export function shopCustomerFocusReviewSpecWorld({
  focus = null,
  day = 1,
  opening = null,
  shopWaterwayCustomerBrowseSpec = () => null,
  shopCustomerForecastWorldSpec = () => null,
  shopDiagnosisWorldBoardSpec = () => null,
  shopTrialTheaterWorldSpec = () => null,
  shopFirstSaleLessonWorldSpec = () => null,
  shopFirstSaleKeepsakeWorldSpec = () => null,
  shopReturningTrailWorldSpec = () => null,
  shopCustomerDecisionChains = () => [],
  shopTagLabel = (tag) => tag,
} = {}) {
  if (!focus || focus.day !== day) return null;
  const safeOpening = opening || {};
  const liveFocus = safeOpening.liveFocus || safeOpening.lastSession?.liveFocus || null;
  const entry = focus.entry || null;
  const blockers = liveFocus ? `成交 ${liveFocus.buyers} · 犹豫 ${liveFocus.leavers} · 主题 ${liveFocus.themeScore}%` : "";
  if (focus.type === "waterway_browse") {
    const browse = shopWaterwayCustomerBrowseSpec(safeOpening);
    if (browse?.active) {
      return {
        name: browse.customerLabel,
        title: browse.title,
        need: browse.headline,
        result: browse.bubble,
        reason: browse.detail,
        advice: browse.nextAction,
        tone: browse.tone,
        reportIndex: browse.reportIndex,
        hotTagLabel: browse.targetGood?.tagText || "水航货",
        blockers,
      };
    }
  }
  if (focus.type === "customer_forecast") {
    const forecast = focus.forecastSpec || shopCustomerForecastWorldSpec(safeOpening);
    if (forecast) {
      return {
        name: forecast.customerName,
        title: forecast.title,
        need: `${forecast.customerName} 今日更看重 ${forecast.hotTagLabel}`,
        result: `主推：${forecast.itemText}`,
        reason: `${forecast.weatherLine} · ${forecast.themeLine} · ${forecast.openingLine}`,
        advice: forecast.advice,
        tone: forecast.tone === "warn" ? "warn" : forecast.tone === "ready" ? "good" : forecast.tone === "empty" ? "note" : "mid",
        reportIndex: -1,
        hotTagLabel: forecast.hotTagLabel,
        blockers: forecast.openingLine,
      };
    }
  }
  if (focus.type === "shop_diagnosis_world") {
    const diagnosis = focus.diagnosisBoard || shopDiagnosisWorldBoardSpec(safeOpening);
    if (diagnosis) {
      return {
        name: diagnosis.mainCustomer || "旧铺顾客",
        title: diagnosis.title || "主世界旧铺诊断挂签",
        need: `${diagnosis.mainCustomer || "路过客"} · ${diagnosis.hotTagLabel || "今日客需"}`,
        result: `成交 ${diagnosis.buyers}/${diagnosis.visitors} · 离店 ${diagnosis.leavers} · 成交率 ${diagnosis.conversion}%`,
        reason: diagnosis.evidence,
        advice: diagnosis.nextAction,
        tone: diagnosis.tone === "warn" ? "warn" : diagnosis.tone === "good" ? "good" : "note",
        reportIndex: -1,
        hotTagLabel: diagnosis.hotTagLabel,
        blockers: diagnosis.headline,
      };
    }
  }
  if (focus.type === "shop_trial_theater") {
    const theater = focus.trialTheater || shopTrialTheaterWorldSpec(safeOpening);
    if (theater) {
      return {
        name: theater.leadCustomer || "第一批顾客",
        title: theater.title || "旧铺试营业小剧场",
        need: `${theater.leadCustomer || "顾客"}想看 ${theater.hotTagLabel || "热卖标签"}`,
        result: theater.resultText,
        reason: theater.reasonText,
        advice: theater.nextAction,
        tone: theater.tone === "warn" ? "warn" : theater.tone === "good" ? "good" : theater.tone === "empty" ? "note" : "mid",
        reportIndex: -1,
        hotTagLabel: theater.hotTagLabel,
        blockers: theater.headline,
      };
    }
  }
  if (focus.type === "first_sale_lesson") {
    const lesson = focus.firstSaleLesson || shopFirstSaleLessonWorldSpec(safeOpening);
    if (lesson) {
      return {
        name: lesson.customerName || "第一位买客",
        title: lesson.title || "首单原因续航牌",
        need: `${lesson.customerName || "顾客"}为什么买单？`,
        result: `${lesson.itemName || "第一件货"} 成交 ${lesson.price || 0} 灵石 · 回头苗头 ${lesson.returnChance || 0}%`,
        reason: `${lesson.reasonText || "商品、价格和热卖标签刚好对上。"} · 顾客短评：${lesson.reviewQuote || "这家旧铺，像是会记得客人要什么。"}`,
        advice: `${lesson.returnText || "下轮继续摆同类货，顾客更容易记住这扇门。"} ${lesson.nextAction || "继续补同标签货。"}`,
        tone: Number(lesson.returnChance || 0) >= 60 ? "good" : Number(lesson.returnChance || 0) >= 35 ? "mid" : "note",
        reportIndex: Number.isFinite(Number(lesson.reportIndex)) ? Number(lesson.reportIndex) : -1,
        hotTagLabel: safeOpening.hotTagLabel || "",
        blockers: "只定位旧铺报告，不会自动补货或开铺",
      };
    }
  }
  if (focus.type === "first_sale_keepsake") {
    const keepsake = focus.firstSaleKeepsake || shopFirstSaleKeepsakeWorldSpec(safeOpening);
    if (keepsake) {
      return {
        name: keepsake.customerName || "第一位买客",
        title: keepsake.title || "首单钱签余温",
        need: `${keepsake.customerName || "顾客"}已经把旧铺和${keepsake.itemName || "第一件货"}记在一起`,
        result: `${keepsake.headline} · 成交 ${keepsake.price || 0} 灵石 · 回头苗头 ${keepsake.returnChance || 0}%`,
        reason: `购买原因：${keepsake.reasonText || "商品、价格和热卖标签刚好对上。"} · 顾客短评：${keepsake.reviewQuote || "这家旧铺，像是会记得客人要什么。"}`,
        advice: `${keepsake.returnText || "把这条脚印接成明天的熟脸路。"} ${keepsake.nextAction || "继续补同标签货。"}`,
        tone: Number(keepsake.returnChance || 0) >= 60 ? "good" : Number(keepsake.returnChance || 0) >= 40 ? "mid" : "note",
        reportIndex: Number.isFinite(Number(keepsake.reportIndex)) ? Number(keepsake.reportIndex) : -1,
        hotTagLabel: keepsake.hotTagLabel || safeOpening.hotTagLabel || "",
        blockers: "只定位旧铺报告，不会自动开铺、补货或改价",
      };
    }
  }
  if (focus.type === "returning_trail") {
    const trail = focus.returningTrail || shopReturningTrailWorldSpec(safeOpening);
    if (trail) {
      return {
        name: trail.customerLabel || "熟脸顾客",
        title: trail.title || "熟脸回门路牌",
        need: `${trail.customerLabel || "熟脸顾客"}正在认 ${trail.itemText || "旧铺货架"}`,
        result: trail.resultText || `${trail.customerLabel || "顾客"} 回头苗头 ${trail.chance || 0}%`,
        reason: trail.detailText || "昨天被记住的货、价格和陈列，让这条路有了回头可能。",
        advice: trail.nextAction || "明天继续把熟脸记住的那件货留在显眼处。",
        tone: trail.realized || Number(trail.chance || 0) >= 60 ? "good" : Number(trail.chance || 0) >= 45 ? "mid" : "note",
        reportIndex: -1,
        hotTagLabel: safeOpening.hotTagLabel || trail.regularBoard?.hotTagLabel || "",
        blockers: "只定位旧铺报告，不会自动开铺、补货或改价",
      };
    }
  }
  const isNeed = focus.type === "need" || entry?.reason === "need";
  const decision = !isNeed && entry
    ? shopCustomerDecisionChains(safeOpening, [entry])[0]
    : null;
  const needText = entry?.detail || entry?.text || liveFocus?.hotTagLabel || "先观察门口来客";
  const result = decision?.result
    || (isNeed ? "尚未买单：这是进店前的需求气泡" : entry?.text || "还没有形成明确反馈");
  const reason = decision?.reason
    || (isNeed ? `偏好线索：${needText}` : entry?.detail || liveFocus?.topBlockerLabel || "原因待观察");
  const advice = decision?.advice
    || (isNeed
      ? `围绕 ${entry?.tag ? shopTagLabel(entry.tag) : liveFocus?.hotTagLabel || "门口需求"} 准备一件更对口的货，再开铺更稳。`
      : liveFocus?.shelfAdvice || "先看顾客话里的需求，再调整货架和价格。");
  const tone = decision?.tone
    || (entry?.reason === "buy" ? "good" : entry?.reason === "price" ? "warn" : isNeed ? "note" : "mid");
  return {
    name: focus.label || decision?.name || entry?.name || "旧铺看板",
    title: isNeed ? "顾客进店前想法" : entry?.reason === "buy" ? "顾客成交复盘" : focus.type === "board" ? "旧铺看板复盘" : "顾客离店复盘",
    need: decision?.need || needText,
    result,
    reason,
    advice,
    tone,
    reportIndex: Number.isFinite(focus.reportIndex) ? focus.reportIndex : Number(entry?.reportIndex ?? -1),
    hotTagLabel: liveFocus?.hotTagLabel || safeOpening.hotTagLabel || "",
    blockers,
  };
}

export function shopFocusPreferredTagsWorld({
  entry = null,
  spec = null,
  opening = null,
} = {}) {
  const tags = [];
  if (entry?.tag) tags.push(entry.tag);
  const needBubbles = Array.isArray(opening?.needBubbles) ? opening.needBubbles : [];
  const bubble = needBubbles.find((item) => (
    (entry?.customerArchetype && item.customerArchetype === entry.customerArchetype)
    || (entry?.name && item.name === entry.name)
  ));
  if (bubble?.tag) tags.push(bubble.tag);
  const text = `${entry?.detail || ""} ${entry?.text || ""} ${spec?.need || ""} ${spec?.advice || ""}`;
  for (const [tag, label] of SHOP_FOCUS_TAG_HINTS) {
    if (text.includes(label)) tags.push(tag);
  }
  return [...new Set(tags.filter(Boolean))];
}

export function shopThemeForFocusWorld({
  entry = null,
  spec = null,
  opening = null,
  shopShelfThemes = [],
  currentThemeTag = "",
  shopTagsOverlap = () => false,
  splitTags = () => [],
} = {}) {
  const preferredTags = shopFocusPreferredTagsWorld({ entry, spec, opening });
  if (!preferredTags.length) return null;
  return (Array.isArray(shopShelfThemes) ? shopShelfThemes : []).find((theme) => (
    theme.theme_tag !== currentThemeTag
    && preferredTags.some((tag) => shopTagsOverlap([tag], splitTags(theme.required_item_tags)))
  )) || null;
}

export function shopCustomerFocusActionsWorld({
  spec = null,
  entry = null,
  opening = null,
  shopPriceMultiplier = 1,
  shopShelfThemes = [],
  currentThemeTag = "",
  shopTagsOverlap = () => false,
  splitTags = () => [],
  shopTagLabel = (tag) => tag,
  inventoryGoods = [],
  shuqiLowStockGoods = () => [],
  itemName = (itemId) => itemId,
} = {}) {
  if (!spec) return [];
  const actions = [];
  const reason = entry?.reason || "";
  if (reason === "price" || spec.tone === "warn") {
    const nextPrice = Math.max(0.75, Number((shopPriceMultiplier - 0.05).toFixed(2)));
    if (nextPrice < shopPriceMultiplier) {
      actions.push({
        id: "price_down",
        label: `降价到 ${Math.round(nextPrice * 100)}%`,
        detail: "先把犹豫客留下，等口碑和主题稳定后再抬价。",
      });
    }
  }
  const theme = shopThemeForFocusWorld({
    entry,
    spec,
    opening,
    shopShelfThemes,
    currentThemeTag,
    shopTagsOverlap,
    splitTags,
  });
  if (theme) {
    actions.push({
      id: "theme_fit",
      label: `换成${theme.note || theme.theme_tag}`,
      detail: `围绕 ${shopFocusPreferredTagsWorld({ entry, spec, opening }).slice(0, 2).map(shopTagLabel).join(" / ")} 重摆货架。`,
      themeTag: theme.theme_tag,
    });
  }
  const safeGoods = Array.isArray(inventoryGoods) ? inventoryGoods : [];
  if (reason === "stock" || spec.tone === "note") {
    const lowStock = (shuqiLowStockGoods(safeGoods, 2) || [])[0]
      || safeGoods.slice().sort((a, b) => Number(a.count || 0) - Number(b.count || 0))[0]
      || null;
    actions.push({
      id: "stock_mark",
      label: lowStock ? `标记补 ${itemName(lowStock.itemId)}` : "标记明日补货",
      detail: lowStock ? `当前库存 ${lowStock.count}，先把薄货架补厚。` : "先从田地或工坊准备一件可卖货。",
      itemId: lowStock?.itemId || entry?.itemId || "",
    });
  }
  if (entry?.reason === "buy") {
    actions.push({
      id: "theme_fit",
      label: "沿用成交标签",
      detail: "把这次成交理由沉淀成下一轮陈列主题。",
      themeTag: shopThemeForFocusWorld({
        entry,
        spec,
        opening,
        shopShelfThemes,
        currentThemeTag,
        shopTagsOverlap,
        splitTags,
      })?.theme_tag || currentThemeTag,
    });
  }
  return actions.slice(0, 2);
}

export function shopCustomerFocusActionsMarkupWorld({
  actions = [],
} = {}) {
  if (!Array.isArray(actions) || !actions.length) return "";
  return `
    <div class="shop-customer-focus-actions">
      ${actions.map((action) => `<button type="button" data-shop-focus-action="${action.id}" data-shop-focus-theme="${action.themeTag || ""}" data-shop-focus-item="${action.itemId || ""}" title="${action.detail}">${action.label}</button>`).join("")}
    </div>
  `;
}

export function shopCustomerFocusReviewMarkupWorld({
  spec = null,
  restockMarkup = "",
  actionsMarkup = "",
  reportLink = "",
} = {}) {
  if (!spec) return "";
  return `
    <div class="shop-customer-focus ${spec.tone}" data-shop-board="customer-focus">
      <strong>${spec.title} · ${spec.name}</strong>
      <span>进店线索：${spec.need}</span>
      <span>结果：${spec.result}</span>
      <small>原因：${spec.reason}</small>
      <small>下一步：${spec.advice}${spec.blockers ? ` · 今日盘面：${spec.blockers}` : ""}${spec.hotTagLabel ? ` · 热点：${spec.hotTagLabel}` : ""}</small>
      ${restockMarkup}
      ${actionsMarkup}
      ${reportLink}
    </div>
  `;
}
