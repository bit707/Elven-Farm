export function shopCanvasTargetsWorld({
  opening = null,
  state,
  selectorDataValue = (value) => String(value ?? ""),
  sellableInventoryGoods = () => [],
  currentShelfTheme = () => ({}),
  activeShopCompendiumDisplays = () => [],
  activeEcologyShopAura = () => null,
  ecologyCourtyardSummary = () => ({}),
  reputationStage = null,
  shopDoorstepCustomerVignetteSpec = () => null,
  shopWaterwayBrokerSceneSpec = () => null,
  shopWaterwayShelfSpotlightSpec = () => null,
  shopWaterwayCustomerBrowseSpec = () => null,
  shopWaterwayReorderFollowupSceneSpec = () => null,
  waterwayStandingOrderSupplySpec = () => null,
  shopCustomerJourneySpec = () => null,
  shopFirstSaleReceiptWorldSpec = () => null,
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
  shopFirstSaleLessonWorldSpec = () => null,
  shopReturningTrailWorldSpec = () => null,
  shopThoughtBubbleChainSpec = () => null,
  shopLeaveRecoveryWorldSpec = () => null,
  shopCustomerForecastWorldSpec = () => null,
  shopCustomerForecastCanvasTarget = () => null,
  shopTrialTheaterWorldSpec = () => null,
  shopFirstCustomerThresholdWorldSpec = () => null,
  shopDiagnosisWorldBoardSpec = () => null,
  shopThoughtBubbleEntries = () => [],
  thoughtBubblePositions = [],
} = {}) {
  const safeOpening = opening || {};
  const goods = sellableInventoryGoods();
  const hasShopActivity = safeOpening.opened
    || safeOpening.lastSession
    || safeOpening.liveFocus
    || safeOpening.restockTarget
    || state.shopReport.length > 0
    || goods.length > 0
    || activeShopCompendiumDisplays(goods, currentShelfTheme(), 2).length > 0
    || Boolean(activeEcologyShopAura(state.day, ecologyCourtyardSummary(), goods));
  const targets = [];
  if (safeOpening.restockTarget?.status === "active") {
    targets.push({
      type: "restock",
      label: "旧铺补货牌",
      selector: '[data-shop-board="restock-tracker"]',
      rect: { x: 220, y: 278, width: 168, height: 76 },
    });
  }
  if (hasShopActivity) {
    targets.push({
      type: "board",
      label: "旧铺看板",
      selector: '[data-shop-board="opening"]',
      rect: { x: 52, y: 184, width: 324, height: 150 },
    });
  }

  const doorstepVignette = shopDoorstepCustomerVignetteSpec(safeOpening);
  if (doorstepVignette?.active) {
    targets.push({
      type: "doorstep_vignette",
      label: "旧铺门口顾客小景",
      selector: '[data-shop-board="customer-journey"]',
      fallbackSelector: '[data-shop-board="opening"]',
      doorstepVignette,
      rect: { x: 54, y: 248, width: 360, height: 146 },
    });
  }
  if (shopWaterwayBrokerSceneSpec(safeOpening)?.active) {
    targets.push({
      type: "waterway_broker",
      label: "莲泽客船到店",
      selector: '[data-shop-board="waterway-broker"]',
      rect: { x: 218, y: 186, width: 188, height: 94 },
    });
  }
  if (shopWaterwayShelfSpotlightSpec()?.active) {
    targets.push({
      type: "waterway_shelf",
      label: "水航水鲜货架",
      selector: '[data-shop-board="waterway-shelf"]',
      rect: { x: 70, y: 236, width: 172, height: 96 },
    });
  }
  if (shopWaterwayCustomerBrowseSpec(safeOpening)?.active) {
    targets.push({
      type: "waterway_browse",
      label: "水航客挑货",
      selector: '[data-shop-board="waterway-browse"]',
      rect: { x: 142, y: 250, width: 172, height: 118 },
    });
  }
  if (shopWaterwayReorderFollowupSceneSpec(safeOpening)?.active) {
    targets.push({
      type: "waterway_reorder_followup",
      label: "莲泽熟路回访",
      selector: '[data-shop-board="waterway-reorder-followup"]',
      rect: { x: 286, y: 276, width: 184, height: 104 },
    });
  }
  if (waterwayStandingOrderSupplySpec()?.active) {
    targets.push({
      type: "waterway_standing_order",
      label: "莲泽常单备货",
      selector: '[data-shop-board="waterway-standing-order"]',
      rect: { x: 420, y: 238, width: 184, height: 124 },
    });
  }
  if (reputationStage?.progressCount > 0) {
    targets.push({
      type: "reputation",
      label: "旧铺名声招牌",
      selector: `[data-shop-reputation-stage="${selectorDataValue(reputationStage.stageKey)}"]`,
      rect: { x: 56, y: 164, width: 256, height: reputationStage.progressCount >= 5 ? 100 : 84 },
    });
  }
  if (safeOpening.customerDecisionLedger || safeOpening.lastSession?.customerDecisionLedger) {
    targets.push({
      type: "ledger",
      label: "顾客决策账页",
      selector: '[data-shop-board="decision-ledger"]',
      rect: { x: 52, y: 258, width: 170, height: 86 },
    });
  }

  const journeySpec = shopCustomerJourneySpec(safeOpening);
  if (journeySpec?.active) {
    targets.push({
      type: "journey_board",
      label: "旧铺旅线总览",
      selector: '[data-shop-board="customer-journey"]',
      journeySpec,
      rect: { x: 386, y: 342, width: 252, height: 146 },
    });
  }
  const firstSaleReceipt = shopFirstSaleReceiptWorldSpec(safeOpening);
  if (firstSaleReceipt) {
    targets.push({
      type: "first_sale_receipt",
      label: "首单成交小票",
      selector: firstSaleReceipt.reportIndex >= 0
        ? `[data-shop-report-index="${Number(firstSaleReceipt.reportIndex)}"]`
        : '[data-shop-board="decision-ledger"]',
      entry: firstSaleReceipt.reportEntry,
      firstSaleReceipt,
      rect: firstSaleReceipt.rect,
    });
  }
  const firstSaleKeepsake = shopFirstSaleKeepsakeWorldSpec(safeOpening);
  if (firstSaleKeepsake) {
    targets.push({
      type: "first_sale_keepsake",
      label: firstSaleKeepsake.title,
      selector: firstSaleKeepsake.selector,
      fallbackSelector: firstSaleKeepsake.fallbackSelector,
      firstSaleKeepsake,
      firstSaleReceipt: firstSaleKeepsake.receipt,
      entry: firstSaleKeepsake.receipt?.reportEntry || null,
      rect: firstSaleKeepsake.rect,
    });
  }
  const firstSaleActionTrail = shopFirstSaleActionTrailWorldSpec(safeOpening);
  if (firstSaleActionTrail) {
    targets.push({
      type: "first_sale_action_trail",
      label: firstSaleActionTrail.title,
      selector: firstSaleActionTrail.selector,
      fallbackSelector: firstSaleActionTrail.fallbackSelector,
      firstSaleActionTrail,
      firstSaleLesson: shopFirstSaleLessonWorldSpec(safeOpening),
      rect: firstSaleActionTrail.rect,
    });
  }
  const wordOfMouthSaleEcho = shopWordOfMouthSaleEchoWorldSpec(safeOpening);
  if (wordOfMouthSaleEcho) {
    targets.push({
      type: "shop_word_of_mouth_sale_echo",
      label: wordOfMouthSaleEcho.title,
      selector: wordOfMouthSaleEcho.selector,
      fallbackSelector: wordOfMouthSaleEcho.fallbackSelector,
      shopWordOfMouthSaleEcho: wordOfMouthSaleEcho,
      entry: wordOfMouthSaleEcho.reportIndex >= 0 ? state.shopReport[wordOfMouthSaleEcho.reportIndex] : null,
      rect: wordOfMouthSaleEcho.rect,
    });
  }
  const wordOfMouthSaleReason = shopWordOfMouthSaleReasonWorldSpec(safeOpening);
  if (wordOfMouthSaleReason) {
    targets.push({
      type: "shop_word_of_mouth_sale_reason",
      label: wordOfMouthSaleReason.title,
      selector: wordOfMouthSaleReason.selector,
      fallbackSelector: wordOfMouthSaleReason.fallbackSelector,
      shopWordOfMouthSaleReason: wordOfMouthSaleReason,
      entry: wordOfMouthSaleReason.reportIndex >= 0 ? state.shopReport[wordOfMouthSaleReason.reportIndex] : null,
      rect: wordOfMouthSaleReason.rect,
    });
  }
  const wordOfMouthFollowupRestock = shopWordOfMouthFollowupRestockWorldSpec(safeOpening);
  if (wordOfMouthFollowupRestock) {
    targets.push({
      type: "shop_word_of_mouth_followup_restock",
      label: wordOfMouthFollowupRestock.title,
      selector: wordOfMouthFollowupRestock.selector,
      fallbackSelector: wordOfMouthFollowupRestock.fallbackSelector,
      shopWordOfMouthFollowupRestock: wordOfMouthFollowupRestock,
      entry: wordOfMouthFollowupRestock.reportIndex >= 0 ? state.shopReport[wordOfMouthFollowupRestock.reportIndex] : null,
      rect: wordOfMouthFollowupRestock.rect,
    });
  }
  const wordOfMouthMorningFollowup = shopWordOfMouthMorningFollowupWorldSpec();
  if (wordOfMouthMorningFollowup) {
    targets.push({
      type: "shop_word_of_mouth_morning_followup",
      label: wordOfMouthMorningFollowup.title,
      selector: wordOfMouthMorningFollowup.selector,
      fallbackSelector: wordOfMouthMorningFollowup.fallbackSelector,
      shopWordOfMouthMorningFollowup: wordOfMouthMorningFollowup,
      rect: wordOfMouthMorningFollowup.rect,
    });
  }
  const thoughtRouteMorningFollowup = shopThoughtRouteMorningFollowupWorldSpec();
  if (thoughtRouteMorningFollowup) {
    targets.push({
      type: "shop_thought_route_morning_followup",
      label: thoughtRouteMorningFollowup.title,
      selector: thoughtRouteMorningFollowup.selector,
      fallbackSelector: thoughtRouteMorningFollowup.fallbackSelector,
      shopThoughtRouteMorningFollowup: thoughtRouteMorningFollowup,
      rect: thoughtRouteMorningFollowup.rect,
    });
  }
  const thoughtRouteReadyMorning = shopThoughtRouteReadyMorningWorldSpec();
  if (thoughtRouteReadyMorning) {
    targets.push({
      type: "shop_thought_route_ready_morning",
      label: thoughtRouteReadyMorning.title,
      selector: thoughtRouteReadyMorning.selector,
      fallbackSelector: thoughtRouteReadyMorning.fallbackSelector,
      shopThoughtRouteReadyMorning: thoughtRouteReadyMorning,
      rect: thoughtRouteReadyMorning.rect,
    });
  }
  const thoughtRouteCaught = shopThoughtRouteCaughtWorldSpec();
  if (thoughtRouteCaught) {
    targets.push({
      type: "shop_thought_route_caught",
      label: thoughtRouteCaught.title,
      selector: thoughtRouteCaught.selector,
      fallbackSelector: thoughtRouteCaught.fallbackSelector,
      shopThoughtRouteCaught: thoughtRouteCaught,
      entry: thoughtRouteCaught.reportIndex >= 0 ? state.shopReport[thoughtRouteCaught.reportIndex] : null,
      rect: thoughtRouteCaught.rect,
    });
  }
  const thoughtRouteMissed = shopThoughtRouteMissedWorldSpec();
  if (thoughtRouteMissed) {
    targets.push({
      type: "shop_thought_route_missed",
      label: thoughtRouteMissed.title,
      selector: thoughtRouteMissed.selector,
      fallbackSelector: thoughtRouteMissed.fallbackSelector,
      shopThoughtRouteMissed: thoughtRouteMissed,
      entry: thoughtRouteMissed.reportIndex >= 0 ? state.shopReport[thoughtRouteMissed.reportIndex] : null,
      rect: thoughtRouteMissed.rect,
    });
  }
  const wordOfMouthRestockedMorning = shopWordOfMouthRestockedMorningWorldSpec();
  if (wordOfMouthRestockedMorning) {
    targets.push({
      type: "shop_word_of_mouth_restocked_morning",
      label: wordOfMouthRestockedMorning.title,
      selector: wordOfMouthRestockedMorning.selector,
      fallbackSelector: wordOfMouthRestockedMorning.fallbackSelector,
      shopWordOfMouthRestockedMorning: wordOfMouthRestockedMorning,
      rect: wordOfMouthRestockedMorning.rect,
    });
  }
  const wordOfMouthRestockCaught = shopWordOfMouthRestockCaughtWorldSpec(undefined, safeOpening);
  if (wordOfMouthRestockCaught) {
    targets.push({
      type: "shop_word_of_mouth_restock_caught",
      label: wordOfMouthRestockCaught.title,
      selector: wordOfMouthRestockCaught.selector,
      fallbackSelector: wordOfMouthRestockCaught.fallbackSelector,
      shopWordOfMouthRestockCaught: wordOfMouthRestockCaught,
      entry: wordOfMouthRestockCaught.reportIndex >= 0 ? state.shopReport[wordOfMouthRestockCaught.reportIndex] : null,
      rect: wordOfMouthRestockCaught.rect,
    });
  }
  const firstSaleLesson = shopFirstSaleLessonWorldSpec(safeOpening);
  if (firstSaleLesson) {
    targets.push({
      type: "first_sale_lesson",
      label: firstSaleLesson.title,
      selector: firstSaleLesson.selector,
      fallbackSelector: firstSaleLesson.fallbackSelector,
      firstSaleLesson,
      firstSaleReceipt: firstSaleLesson.receipt,
      entry: firstSaleLesson.receipt?.reportEntry || null,
      rect: firstSaleLesson.rect,
    });
  }
  const returningTrail = shopReturningTrailWorldSpec(safeOpening);
  if (returningTrail) {
    targets.push({
      type: "returning_trail",
      label: returningTrail.title,
      selector: returningTrail.selector,
      fallbackSelector: returningTrail.fallbackSelector,
      returningTrail,
      rect: returningTrail.rect,
    });
  }
  const thoughtChain = shopThoughtBubbleChainSpec(safeOpening);
  if (thoughtChain) {
    targets.push({
      type: "thought_chain",
      label: thoughtChain.title,
      selector: thoughtChain.selector,
      fallbackSelector: thoughtChain.fallbackSelector,
      thoughtChain,
      rect: thoughtChain.rect,
    });
  }
  const leaveRecovery = shopLeaveRecoveryWorldSpec(safeOpening);
  if (leaveRecovery) {
    targets.push({
      type: "leave_recovery",
      label: "离店补救路线",
      selector: '[data-shop-board="leave-recovery"]',
      fallbackSelector: '[data-shop-board="decision-ledger"]',
      leaveRecoverySpec: leaveRecovery,
      rect: leaveRecovery.rect,
    });
  }
  const forecastTarget = shopCustomerForecastCanvasTarget(shopCustomerForecastWorldSpec(safeOpening));
  if (forecastTarget) targets.push(forecastTarget);
  const trialTheater = shopTrialTheaterWorldSpec(safeOpening);
  if (trialTheater) {
    targets.push({
      type: "shop_trial_theater",
      label: trialTheater.title,
      selector: trialTheater.selector,
      fallbackSelector: trialTheater.fallbackSelector,
      trialTheater,
      rect: trialTheater.rect,
    });
  }
  const firstCustomerThreshold = shopFirstCustomerThresholdWorldSpec(safeOpening);
  if (firstCustomerThreshold) {
    targets.push({
      type: "first_customer_threshold",
      label: firstCustomerThreshold.title,
      selector: firstCustomerThreshold.selector,
      fallbackSelector: firstCustomerThreshold.fallbackSelector,
      firstCustomerThreshold,
      entry: firstCustomerThreshold.reportIndex >= 0 ? state.shopReport[firstCustomerThreshold.reportIndex] : null,
      rect: firstCustomerThreshold.rect,
    });
  }
  const diagnosisBoard = shopDiagnosisWorldBoardSpec(safeOpening);
  if (diagnosisBoard) {
    targets.push({
      type: "shop_diagnosis_world",
      label: "旧铺诊断挂签",
      selector: diagnosisBoard.selector,
      fallbackSelector: diagnosisBoard.fallbackSelector,
      diagnosisBoard,
      rect: diagnosisBoard.rect,
    });
  }

  shopThoughtBubbleEntries().forEach((entry, index) => {
    const position = thoughtBubblePositions[index];
    if (!position) return;
    targets.push({
      type: "customer",
      label: entry.name || "顾客想法",
      entry,
      index,
      selector: entry.reason === "need"
        ? '[data-shop-board="opening"]'
        : `[data-shop-report-index="${Number(entry.reportIndex || 0)}"]`,
      rect: { x: position.x, y: position.y, width: 184, height: 78 },
    });
  });
  return targets;
}

export function shopAtCanvasPointWorld({ px, py, targets = [] } = {}) {
  return (targets || [])
    .slice()
    .reverse()
    .find(({ rect }) => (
      px >= rect.x
      && px <= rect.x + rect.width
      && py >= rect.y
      && py <= rect.y + rect.height
    )) || null;
}
