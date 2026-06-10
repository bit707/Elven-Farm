export function renderShopPanelUi({
  refs,
  state,
  data,
  syncShopOpeningState,
  ecologyCourtyardSummary,
  sellableInventoryGoods,
  currentShelfTheme,
  shopHotTag,
  activeShopCompendiumDisplays,
  shopCompendiumDisplayEffect,
  activeEcologyShopAura,
  qingboWaterFreshSignatureAura,
  shopWordOfMouthDisplaySpec,
  shopWordOfMouthVisitLeadSpec,
  shopVisitPledgeDisplaySpec,
  shopTownErrandDisplaySpec,
  shopDisplayDiagnosisSpec,
  shopDisplayDiagnosisMarkup,
  shopThoughtShelfBridgeMarkup,
  shopThoughtShelfBridgeSpec,
  shopCustomerFocusReviewMarkup,
  shopRestockTrackerMarkup,
  shopWaterwayBrokerSceneSpec,
  shopWaterwayShelfSpotlightSpec,
  shopWaterwayCustomerBrowseSpec,
  shopWaterwayReorderFollowupSceneSpec,
  waterwayReorderFollowupSpec,
  waterwayLongOrderLedgerSpec,
  waterwayStandingOrderSupplySpec,
  shopCustomerJourneySpec,
  shopCustomerReasonCardsMarkup,
  shopCustomerReasonCardsSpec,
  shopSaleReflectionMarkup,
  shopSaleReflectionSpec,
  shopReturningVisitDigestMarkup,
  shopReturningVisitDigestSpec,
  shopIntroducedCustomerDigestMarkup,
  shopIntroducedCustomerDigestSpec,
  shopWordOfMouthMarkup,
  shopWordOfMouthVisitMarkup,
  qingboWaterFreshSignatureMarkup,
  shopVisitPledgeMarkup,
  shopTownErrandMarkup,
  shopRegularBoardMarkup,
  shopRegularBoardSpec,
  shopReputationStageMarkup,
  shopReputationStageSpec,
  shopSeasonalDoorstepSceneMarkup,
  shopSeasonalDoorstepSceneSpec,
  shopWeatherCustomerReactionMarkup,
  shopWeatherCustomerReactionSpec,
  spiritFinaleEffectSnapshot,
  spiritFinaleEffectSummary,
  spiritFinaleEffectPanelText,
  shopCustomerDecisionChainsMarkup,
  shopDoorstepSceneSpec,
  shopDoorstepSceneMarkup,
  shopWaterwayBrokerSceneMarkup,
  shopWaterwayShelfSpotlightMarkup,
  shopWaterwayCustomerBrowseMarkup,
  shopWaterwayReorderFollowupMarkup,
  waterwayLongOrderLedgerMarkup,
  waterwayStandingOrderSupplyMarkup,
  shopCustomerDecisionLedgerMarkup,
  shopCustomerJourneyMarkup,
  shopLeaveRecoveryMarkup,
  shopCrowdHeatUiSpec,
  solarTermMoodShopDisplayMarkup,
  renderShopSeasonPanel,
}) {
  refs.shopReport.innerHTML = "";
  const opening = syncShopOpeningState();
  const ecologyGarden = ecologyCourtyardSummary();
  const liveGoods = sellableInventoryGoods();
  const liveTheme = currentShelfTheme();
  const liveHotTag = shopHotTag(liveGoods, liveTheme, ecologyGarden);
  const liveCompendiumDisplays = activeShopCompendiumDisplays(liveGoods, liveTheme, 2, liveHotTag);
  const liveCompendiumEffect = shopCompendiumDisplayEffect(liveCompendiumDisplays, liveTheme, liveHotTag);
  const liveEcologyShopAura = activeEcologyShopAura(state.day, ecologyGarden, liveGoods);
  const liveQingboSignatureAura = qingboWaterFreshSignatureAura(liveGoods, liveTheme);
  const shopWordOfMouth = shopWordOfMouthDisplaySpec(state.day);
  const shopWordOfMouthVisit = opening.lastSession?.day === state.day
    ? opening.lastSession.shopWordOfMouthVisit || null
    : shopWordOfMouthVisitLeadSpec(shopWordOfMouth);
  const visitPledge = shopVisitPledgeDisplaySpec(opening);
  const townErrand = shopTownErrandDisplaySpec(opening);
  const displayDiagnosisSpec = shopDisplayDiagnosisSpec(liveGoods, liveTheme, data.customers, ecologyGarden);
  const displayDiagnosis = shopDisplayDiagnosisMarkup(displayDiagnosisSpec);
  const thoughtShelfBridge = shopThoughtShelfBridgeMarkup(shopThoughtShelfBridgeSpec({
    opening,
    goods: liveGoods,
    theme: liveTheme,
    ecologyGarden,
    display: displayDiagnosisSpec,
  }));
  const saleFeedback = state.shopSaleFeedback;
  const restockFulfillmentFeedback = state.shopRestockFulfillmentFeedback;
  const focusReview = shopCustomerFocusReviewMarkup();
  if (focusReview) refs.shopReport.insertAdjacentHTML("beforeend", focusReview);
  if (thoughtShelfBridge) refs.shopReport.insertAdjacentHTML("beforeend", thoughtShelfBridge);
  const restockTracker = shopRestockTrackerMarkup();
  if (restockTracker) refs.shopReport.insertAdjacentHTML("beforeend", restockTracker);
  if (opening.opened || opening.lastSession || liveCompendiumDisplays.length > 0 || liveEcologyShopAura || liveQingboSignatureAura || displayDiagnosis) {
    const board = document.createElement("div");
    const qingboSignatureAura = opening.lastSession?.day === state.day
      ? opening.lastSession?.qingboSignatureAura || liveQingboSignatureAura
      : liveQingboSignatureAura || opening.lastSession?.qingboSignatureAura || null;
    const waterwayBrokerScene = opening.lastSession?.day === state.day ? shopWaterwayBrokerSceneSpec(opening) : null;
    const waterwayShelfSpotlight = shopWaterwayShelfSpotlightSpec(liveGoods, liveTheme, waterwayBrokerScene);
    const waterwayBrowse = shopWaterwayCustomerBrowseSpec(opening, state.shopReport, waterwayShelfSpotlight);
    const waterwayReorderFollowupScene = shopWaterwayReorderFollowupSceneSpec(opening, state.shopReport, waterwayReorderFollowupSpec(liveGoods, liveTheme));
    const waterwayLongOrderLedger = waterwayLongOrderLedgerSpec(state.shopReport, waterwayReorderFollowupSpec(liveGoods, liveTheme));
    const waterwayStandingOrderSupply = waterwayStandingOrderSupplySpec(liveGoods, liveTheme);
    board.className = `shop-opening-card ${opening.summaryUnlocked ? "summary" : "opening"}${saleFeedback?.firstSale ? " sale-live" : ""}${saleFeedback?.qingboFirstSale ? " qingbo-live" : ""}${restockFulfillmentFeedback ? " restock-live" : ""}${restockFulfillmentFeedback?.waterFresh ? " water-fresh-restock" : ""}${qingboSignatureAura ? " water-fresh-signature" : ""}${waterwayBrokerScene?.active ? " waterway-broker-live" : ""}${waterwayShelfSpotlight?.active ? " waterway-shelf-live" : ""}${waterwayReorderFollowupScene?.active ? " waterway-reorder-live" : ""}${waterwayLongOrderLedger?.active ? " waterway-long-order-live" : ""}${waterwayStandingOrderSupply?.active ? " waterway-standing-order-live" : ""}`;
    board.dataset.shopBoard = "opening";
    const needs = opening.needBubbles.map((entry) => `${entry.name}${entry.returningCustomer ? "（回门）" : entry.introducedCustomer ? "（熟客带来）" : ""}：${entry.text}`).join(" · ") || "等第一批顾客进店";
    const firstSale = opening.firstSale ? `${opening.firstSale.name} 买走 ${opening.firstSale.itemName}，成交 ${opening.firstSale.price} 灵石` : "首单尚未成交";
    const featuredMoment = opening.lastSession?.featuredMomentText || "";
    const liveFocus = opening.liveFocus || opening.lastSession?.liveFocus || null;
    const crowdHeat = liveFocus ? shopCrowdHeatUiSpec(liveFocus) : null;
    const doorstepScene = opening.lastSession?.day === state.day ? shopDoorstepSceneSpec(opening) : null;
    const displaySummary = opening.lastSession?.compendiumDisplaySummary || liveCompendiumEffect.summary;
    const displayDetail = opening.lastSession?.compendiumDisplayDetail || liveCompendiumEffect.detail;
    const restockFulfillment = opening.lastSession?.restockFulfillment || null;
    const failureRecovery = opening.failureRecovery || opening.lastSession?.failureRecovery || null;
    const decisionLedger = opening.customerDecisionLedger || opening.lastSession?.customerDecisionLedger || null;
    const journeySpec = shopCustomerJourneySpec(opening);
    const reasonCards = shopCustomerReasonCardsMarkup(shopCustomerReasonCardsSpec(opening, state.shopReport, decisionLedger, journeySpec, failureRecovery));
    const saleReflection = shopSaleReflectionMarkup(shopSaleReflectionSpec(opening));
    const returningDigest = opening.lastSession?.day === state.day
      ? shopReturningVisitDigestMarkup(shopReturningVisitDigestSpec(opening))
      : "";
    const introducedDigest = opening.lastSession?.day === state.day
      ? shopIntroducedCustomerDigestMarkup(shopIntroducedCustomerDigestSpec(opening))
      : "";
    const wordOfMouthMarkup = shopWordOfMouthMarkup(shopWordOfMouth);
    const wordOfMouthVisitMarkup = shopWordOfMouthVisitMarkup(shopWordOfMouthVisit);
    const qingboSignatureMarkup = qingboWaterFreshSignatureMarkup(qingboSignatureAura);
    const visitPledgeMarkup = shopVisitPledgeMarkup(visitPledge);
    const townErrandMarkup = shopTownErrandMarkup(townErrand, { includeFocus: true });
    const regularBoard = shopRegularBoardMarkup(opening.regularBoard || opening.lastSession?.regularBoard || shopRegularBoardSpec(opening));
    const reputationStage = shopReputationStageMarkup(shopReputationStageSpec(opening));
    const seasonalDoorstep = shopSeasonalDoorstepSceneMarkup(shopSeasonalDoorstepSceneSpec({ opening }));
    const weatherCustomerReaction = shopWeatherCustomerReactionMarkup(shopWeatherCustomerReactionSpec({ opening }));
    const shopFinaleEffects = opening.lastSession?.spiritFinaleEffects || spiritFinaleEffectSnapshot(spiritFinaleEffectSummary());
    const shopFinaleText = spiritFinaleEffectPanelText(shopFinaleEffects, "shop", 2);
    const shopFinaleRows = Array.isArray(shopFinaleEffects?.rows)
      ? shopFinaleEffects.rows.filter((row) => row.panel === "shop" && Number(row.value || 0) > 0)
      : [];
    const ecologyShopAura = opening.lastSession?.day === state.day
      ? opening.lastSession?.ecologyShopAura
      : liveEcologyShopAura;
    const decisionChains = shopCustomerDecisionChainsMarkup(opening);
    board.innerHTML = `
      <strong>${opening.summaryUnlocked ? "第一次成交日结已解锁" : "旧铺试营业看板"}</strong>
      <span>热卖标签预告：${opening.hotTagLabel || "等待陈列"} · ${needs}</span>
      <small>${firstSale}</small>
      ${reputationStage}
      ${seasonalDoorstep}
      ${weatherCustomerReaction}
      ${saleReflection}
      ${doorstepScene ? shopDoorstepSceneMarkup(doorstepScene) : ""}
      ${waterwayBrokerScene ? shopWaterwayBrokerSceneMarkup(waterwayBrokerScene) : ""}
      ${waterwayShelfSpotlight ? shopWaterwayShelfSpotlightMarkup(waterwayShelfSpotlight) : ""}
      ${waterwayBrowse ? shopWaterwayCustomerBrowseMarkup(waterwayBrowse) : ""}
      ${waterwayReorderFollowupScene ? shopWaterwayReorderFollowupMarkup(waterwayReorderFollowupScene) : ""}
      ${waterwayLongOrderLedger ? waterwayLongOrderLedgerMarkup(waterwayLongOrderLedger) : ""}
      ${waterwayStandingOrderSupply ? waterwayStandingOrderSupplyMarkup(waterwayStandingOrderSupply) : ""}
      ${returningDigest}
      ${introducedDigest}
      ${wordOfMouthMarkup}
      ${wordOfMouthVisitMarkup}
      ${qingboSignatureMarkup}
      ${visitPledgeMarkup}
      ${townErrandMarkup}
      ${regularBoard}
      ${displayDiagnosis}
      ${shopCustomerDecisionLedgerMarkup(decisionLedger)}
      ${reasonCards}
      ${shopCustomerJourneyMarkup(journeySpec)}
      ${decisionChains}
      ${liveFocus ? `<div class="shop-live-focus"><strong>今日焦点：${liveFocus.headline}</strong><span>成交 ${liveFocus.buyers} · 犹豫离店 ${liveFocus.leavers} · 主题 ${liveFocus.themeScore}%</span><small>短板：${liveFocus.topBlockerLabel} · ${liveFocus.shelfAdvice}</small></div>` : ""}
      ${shopLeaveRecoveryMarkup(failureRecovery)}
      ${crowdHeat?.active ? `<div class="shop-crowd-heat ${crowdHeat.stateClass}"><strong>${crowdHeat.title}</strong><span>${crowdHeat.detail}</span><div class="shop-crowd-heat-chips">${crowdHeat.chips.map((chip) => `<b class="${chip.tone}">${chip.label} ${chip.value}</b>`).join("")}</div><small>画面反馈：${crowdHeat.queueText} · ${crowdHeat.mood}</small><small>掌柜建议：${crowdHeat.nextAction}</small></div>` : ""}
      ${featuredMoment ? `<small>${featuredMoment}</small>` : ""}
      ${shopFinaleText ? `<div class="shop-finale-boost"><strong>终章伙伴常驻</strong><span>${shopFinaleText}</span><small>${shopFinaleRows.map((row) => row.detail).join(" · ")}</small></div>` : ""}
      ${ecologyShopAura ? `<small>庭院夜事余韵：${ecologyShopAura.title} · ${ecologyShopAura.focusText} · 来客 +${ecologyShopAura.visitorBonus}，相关预算 +${Math.round(Number(ecologyShopAura.budgetBonus || 0) * 100)}%</small>` : ""}
      ${ecologyShopAura?.matchedGoodsText ? `<small>货架呼应：${ecologyShopAura.matchedGoodsText}</small>` : ""}
      ${displaySummary ? `<small>节气印记陈设：${displaySummary}</small>` : ""}
      ${displayDetail ? `<small>${displayDetail}</small>` : ""}
      ${restockFulfillment ? `<small>补货兑现：${restockFulfillment.summary} · ${restockFulfillment.detail}${restockFulfillmentFeedback ? " · 货签刚兑现" : ""}</small>` : ""}
    `;
    refs.shopReport.append(board);
  }
  const solarMoodShopDisplayMarkup = solarTermMoodShopDisplayMarkup();
  if (solarMoodShopDisplayMarkup) {
    const solarMoodShopDisplayNode = document.createElement("div");
    solarMoodShopDisplayNode.innerHTML = solarMoodShopDisplayMarkup.trim();
    refs.shopReport.append(solarMoodShopDisplayNode.firstElementChild);
  }
  renderShopSeasonPanel();
  if (state.shopReport.length === 0) {
    const empty = document.createElement("div");
    empty.className = "sale-row";
    empty.dataset.shopBoard = "empty";
    empty.innerHTML = "<span>今日未营业</span><strong>--</strong>";
    refs.shopReport.append(empty);
    return;
  }

  for (const [index, sale] of state.shopReport.entries()) {
    const liveSale = sale.reason === "buy"
      && saleFeedback
      && saleFeedback.itemId === sale.itemId
      && saleFeedback.customerName === sale.name;
    const row = document.createElement("div");
    row.className = `sale-row ${sale.reason || "note"}${sale.customerArchetype === "waterway_broker" ? " waterway" : ""}${liveSale ? " live" : ""}${liveSale && saleFeedback.qingboFirstSale ? " qingbo-live" : ""}`;
    row.dataset.shopReportIndex = String(index);
    row.dataset.shopReportReason = sale.reason || "note";
    const liveRestock = sale.reason === "restock" && restockFulfillmentFeedback && sale.name === "补货兑现";
    row.innerHTML = `<span>${sale.name}<small>${sale.detail || ""}</small>${sale.returningCustomer ? `<small class="sale-returning-note">熟脸回门：${sale.returnVisitText || sale.returnVisitLabel || "昨天被记住的人又来了。"}${sale.returnVisitChance ? ` · 回头苗头 ${sale.returnVisitChance}%` : ""}</small>` : ""}${sale.introducedCustomer ? `<small class="sale-introduced-note">熟客带新客：${sale.introducedVisitText || `${sale.introducedByLabel || "熟客"}把新脚步领进门了。`}</small>` : ""}${sale.wordOfMouthLead ? `<small class="sale-introduced-note">铺前来帖：${sale.wordOfMouthLeadText || "这位来客正是顺着昨天传出去的话头找来的。"}</small>` : ""}${liveSale ? `<small class="sale-live-hint">${saleFeedback.qingboFirstSale ? "灵池水鲜首卖" : saleFeedback.firstSale ? "首单刚成交" : saleFeedback.returningCustomer ? "熟脸刚回门成交" : saleFeedback.introducedCustomer ? "熟客刚带新客成交" : saleFeedback.wordOfMouthLead ? "来帖刚兑现成交" : "刚完成一笔成交"} · ${saleFeedback.reasonText}</small>${saleFeedback.reviewQuote ? `<small class="sale-live-review">顾客短评：${saleFeedback.reviewQuote}</small>` : ""}${(saleFeedback.firstSale || saleFeedback.qingboFirstSale) && saleFeedback.returnPreview ? `<small class="sale-live-review">回头客预告：${saleFeedback.returnPreview.summary} · ${saleFeedback.returnPreview.cta}</small>` : ""}` : ""}${liveRestock ? `<small class="sale-live-hint">货签刚兑现 · ${restockFulfillmentFeedback.headline}</small>` : ""}</span><strong>${sale.text}</strong>`;
    refs.shopReport.append(row);
  }
}
