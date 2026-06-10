export function renderDaySummaryPanelUi({
  refs,
  state,
  data,
  selectorDataValue,
  morningActionBoardSpec,
  morningActionBoardMarkup,
  sleepPrepChecklistMarkup,
  itemName,
  dailyIntentReviewMarkup,
  dailyIntentReviewSpec,
  solarMorningSignSummaryText,
  solarTermMoodDaySummaryInsight,
  solarTermMoodShopDisplayDaySummaryMarkup,
  normalizeCareChainState,
  careChainEchoSpec,
  shopSaleReflectionSpec,
  shopDoorstepSceneSummaryText,
  shopSeasonalDoorstepSceneSummaryText,
  shopReturningVisitDigestSummaryText,
  shopIntroducedCustomerDigestSummaryText,
  shopWordOfMouthSummaryText,
  shopWordOfMouthVisitSummaryText,
  shopVisitPledgeSummaryText,
  shopTownErrandSummaryText,
  shopRegularBoardSummaryText,
  shopReputationStageSummaryText,
  shopCustomerDayLessonMarkup,
  shopTownErrandDisplaySpec,
  shopTownErrandPrimaryActionSpec,
  failureCodexTypeLabel,
  localize,
  spiritFinaleEffectCompactText,
  daySummaryP0SnapshotMarkup,
  daySummaryVsa008EvidenceMarkup,
  daySummaryTomorrowFirstStepMarkup,
  earlyRewardNextDelightMarkup,
  earlyRewardNextDelightSpec,
  dungeonDayEchoDaySummaryMarkup,
  automationDayLedgerMarkup,
  automationDayLedgerSpec,
  postMainlineRhythmDaySummaryMarkup,
  postMainlineEveningEchoMarkup,
  postMainlineLongTailResonanceMarkup,
  rareSpiritTheaterDaySummaryMarkup,
}) {
  refs.daySummaryPanel.innerHTML = "";
  const morningBoard = morningActionBoardSpec();
  const morningMarkup = morningActionBoardMarkup(morningBoard);
  const prepMarkup = sleepPrepChecklistMarkup();
  const summary = state.lastDaySummary;
  if (!summary) {
    refs.daySummaryPanel.innerHTML = `
      ${morningMarkup}
      ${prepMarkup}
      <div class="day-summary-card pending">
        <strong>今晚还没有结算</strong>
        <span>点击“入夜结算”后，这里会汇总收入、成熟作物、风险、商队/试炼状态和明日建议。</span>
      </div>
    `;
    return;
  }

  const inventoryText = summary.inventoryDelta
    .slice(0, 4)
    .map((entry) => `${itemName(entry.itemId)} ${entry.delta > 0 ? "+" : ""}${entry.delta}`)
    .join("、") || "背包无明显变化";
  const spiritJobText = (summary.spiritJobs || [])
    .slice(0, 4)
    .map((entry) => `${entry.spirit}：${entry.text}${entry.focus ? `（关注 ${entry.focus}）` : ""}`)
    .join("；") || "暂无精怪夜勤";
  const spiritJobSynergyMarkup = (summary.spiritJobSynergy || []).length > 0
    ? `
      <div class="day-summary-spirit-synergy">
        <strong>自动化协作链 ${summary.spiritJobSynergy.length} 条</strong>
        ${(summary.spiritJobSynergy || []).slice(0, 3).map((entry) => `
          <span><b>${entry.label}</b>${entry.spirits.join(" + ")} · ${entry.rewardText}</span>
          <small>${entry.detail}</small>
        `).join("")}
      </div>
    `
    : "";
  const spiritSeasonalWorkMarkup = (summary.spiritSeasonalWork || []).length > 0
    ? `
      <div class="day-summary-spirit-seasonal-work">
        <strong>精怪顺应天时 ${summary.spiritSeasonalWork.length} 件</strong>
        ${(summary.spiritSeasonalWork || []).slice(0, 3).map((entry) => `
          <div class="day-summary-spirit-seasonal-row ${entry.tone || "clear"}">
            <span><b>${entry.glyph} ${entry.spiritName}</b>${entry.label} · ${entry.prop}</span>
            <small>${entry.weatherName} · ${entry.jobLabel} · ${entry.detail}</small>
            <button type="button" data-day-summary-spirit-seasonal="${entry.spiritId}">回看小景</button>
          </div>
        `).join("")}
      </div>
    `
    : "";
  const dailyIntentReviewMarkupText = dailyIntentReviewMarkup(summary.dailyIntentReview || dailyIntentReviewSpec(summary));
  const solarMorningSummaryText = solarMorningSignSummaryText(summary.solarMorningSign);
  const solarTermMoodInsight = solarTermMoodDaySummaryInsight(summary.solarTermMoodTrail || []);
  const solarTermMoodTrailMarkup = (summary.solarTermMoodTrail || []).length > 0
    ? `
      <div class="day-summary-solar-mood ${solarTermMoodInsight?.complete ? "complete" : "partial"}">
        <strong>今日画境回响 ${solarTermMoodInsight?.label || summary.solarTermMoodTrail.length}</strong>
        ${solarTermMoodInsight ? `<p><b>${solarTermMoodInsight.title}</b>${solarTermMoodInsight.detail}</p>` : ""}
        ${(summary.solarTermMoodTrail || []).slice(0, 4).map((entry) => `
          <div class="day-summary-solar-mood-row ${entry.tone || "clear"}">
            <span><b>${entry.label}</b>${entry.termName} · ${entry.weatherName} · ${entry.title}</span>
            <small>${entry.detail}</small>
            <button type="button" data-day-summary-solar-mood="${selectorDataValue(entry.key)}">回看画境</button>
          </div>
        `).join("")}
      </div>
    `
    : "";
  const solarTermMoodShopDisplaySummaryMarkup = solarTermMoodShopDisplayDaySummaryMarkup(summary.solarTermMoodShopDisplayEcho);
  const weatherLifeVignetteMarkup = (summary.weatherLifeVignettes || []).length > 0
    ? `
      <div class="day-summary-weather-life">
        <strong>天气生活小景 ${summary.weatherLifeVignettes.length} 处</strong>
        ${(summary.weatherLifeVignettes || []).slice(0, 3).map((entry) => `
          <div class="day-summary-weather-life-row ${entry.kind || "clear"}">
            <span><b>${entry.label}</b>${entry.weatherName} · ${entry.title}</span>
            <small>${entry.text}</small>
            <button type="button" data-day-summary-weather-life="${entry.sceneKey}">回看天气小景</button>
          </div>
        `).join("")}
      </div>
    `
    : "";
  const townLifeWeatherMomentMarkup = (summary.townLifeWeatherMoments || []).length > 0
    ? `
      <div class="day-summary-town-weather">
        <strong>镇上天气见闻 ${summary.townLifeWeatherMoments.length} 则</strong>
        ${(summary.townLifeWeatherMoments || []).slice(0, 3).map((entry) => `
          <div class="day-summary-town-weather-row ${entry.tone || "water"}">
            <span><b>${entry.npcName}</b>${entry.weatherName} · ${entry.label} · ${entry.area}</span>
            <small>${entry.text}</small>
            <button type="button" data-day-summary-town-weather="${entry.npcId}">回看镇民小景</button>
          </div>
        `).join("")}
      </div>
    `
    : "";
  const townLifeWeatherErrandMarkup = (summary.townLifeWeatherErrands || []).length > 0
    ? `
      <div class="day-summary-town-weather-errand">
        <strong>天气托付回响 ${summary.townLifeWeatherErrands.length} 件</strong>
        ${(summary.townLifeWeatherErrands || []).slice(0, 3).map((entry) => `
          <div class="day-summary-town-weather-errand-row ${entry.tone || "gold"}">
            <span><b>${entry.npcName}</b>${entry.label} · ${entry.itemName} x${entry.count}</span>
            <small>${entry.summary}</small>
            <button type="button" data-day-summary-town-weather-errand="${entry.npcId}">回看回响</button>
          </div>
        `).join("")}
      </div>
    `
    : "";
  const careChain = summary.careChain || null;
  const careChainStage = normalizeCareChainState(summary.careChainStage || state.careChainState);
  const careChainEcho = summary.careChainEcho || careChainEchoSpec(careChainStage);
  const careChainEvent = summary.careChainEvent || null;
  const careChainMarkup = careChain?.active
    ? `
      <div class="day-summary-care-chain ${careChain.complete ? "complete" : "partial"}">
        <strong>${careChain.title}</strong>
        <span>${careChain.headline}</span>
        ${careChainStage.streak > 0 ? `
          <em class="day-summary-care-chain-stage">连续照应：${careChainStage.stageName} · ${careChainStage.streak} 日${careChainStage.nextAt ? ` · 下阶还差 ${Math.max(0, careChainStage.nextAt - careChainStage.streak)} 日` : " · 镇上已听见"}</em>
        ` : ""}
        <div class="day-summary-care-chain-grid">
          ${(careChain.chips || []).map((chip) => `
            <small class="${chip.active ? "active" : "idle"}"><b>${chip.label}</b>${chip.text}</small>
          `).join("")}
        </div>
        ${careChainEcho ? `
          <small class="day-summary-care-chain-echo"><b>生机回声</b>${careChainEcho.townLine}<br />精怪：${careChainEcho.spiritLine}<br />旧铺：${careChainEcho.shopLine}</small>
        ` : ""}
        ${careChainEvent ? `
          <small class="day-summary-care-chain-event"><b>${careChainEvent.title}</b>${careChainEvent.detail}<em>奖励：${careChainEvent.rewardText || "洞天记住了这条照应线"}</em><button type="button" data-care-chain-recent-event="${careChainEvent.eventId || "latest"}">回看余温</button></small>
        ` : ""}
        ${careChain.reputationText ? `<small>旧铺名声：${careChain.reputationText}</small>` : ""}
      </div>
    `
    : "";
  const workshopText = (summary.completedWorkshopJobs || []).length > 0
    ? `工坊出货：${summary.completedWorkshopJobs.map((entry) => `${entry.outputItemName} x${entry.outputCount}`).join("、")}`
    : summary.workshopFocus
      ? `工坊火候：${summary.workshopFocus.headline} · ${summary.workshopFocus.detail}`
      : "";
  const workshopOrderMatchText = (summary.completedWorkshopJobs || [])
    .map((entry) => entry.orderMatch)
    .filter(Boolean)
    .slice(0, 2)
    .map((match) => `${match.outputItemName} 接上 ${match.orderTitle}，${match.ready ? "现在可交" : `还差 ${match.missingText || "余料"}`}`)
    .join("；");
  const cohabMomentText = (summary.cohabMoments || [])
    .slice(0, 3)
    .map((entry) => `${entry.routeName || "同住"}：${entry.eventName}`)
    .join("；");
  const cohabBuffText = (summary.cohabBuffs || [])
    .slice(0, 3)
    .map((entry) => `${entry.routeName || "同住"} · ${entry.label}（至第 ${entry.expiresDay} 天）`)
    .join("；");
  const rareSpiritText = (summary.rareSpiritMoments || [])
    .slice(0, 3)
    .map((entry) => `${entry.spiritName}：${entry.actionShort}`)
    .join("；");
  const rareGiftText = (summary.rareSpiritGifts || [])
    .slice(0, 2)
    .map((entry) => `${entry.spiritName} 留下 ${entry.detail}`)
    .join("；");
  const rareSpiritTheaterDaySummaryMarkupText = rareSpiritTheaterDaySummaryMarkup(summary.rareSpiritTheaterRows || []);
  const sproutMomentText = (summary.sproutMoments || [])
    .slice(0, 2)
    .map((entry) => `${entry.title}：${entry.detail}`)
    .join("；");
  const spiritInteractionText = summary.spiritInteraction
    ? `${summary.spiritInteraction.spiritName}：${summary.spiritInteraction.actionText}，${summary.spiritInteraction.floatingText || `羁绊 +${summary.spiritInteraction.bondGain}`}`
    : "";
  const townLifeGreetingText = (summary.townLifeGreetings || [])
    .slice(0, 4)
    .map((entry) => `${entry.npcName}在${entry.area}${entry.action ? ` ${entry.action}` : ""}`)
    .join("；");
  const townLifeErrandText = (summary.townLifeErrands || [])
    .slice(0, 4)
    .map((entry) => `${entry.npcName}：${entry.title}（${entry.itemName} x${entry.count}${entry.weatherLabel ? `，${entry.weatherLabel}` : ""}）`)
    .join("；");
  const townLifeGiftText = (summary.townLifeGifts || [])
    .slice(0, 4)
    .map((entry) => `${entry.npcName}收下${entry.itemName}（好感 +${entry.favorGain}）`)
    .join("；");
  const townLifeMemoryText = (summary.townLifeMemories || [])
    .slice(0, 4)
    .map((entry) => `${entry.npcName}「${entry.title}」`)
    .join("；");
  const townLifeShopMomentText = (summary.townLifeShopMoments || [])
    .slice(0, 4)
    .map((entry) => `${entry.npcName}：${entry.title}`)
    .join("；");
  const townLifeShopMomentFocus = (summary.townLifeShopMoments || [])[0] || null;
  const spiritMoodRepairText = summary.spiritMoodRepair
    ? `${summary.spiritMoodRepair.spiritName}：${summary.spiritMoodRepair.title}，建议 ${summary.spiritMoodRepair.advice}`
    : "";
  const canalRestorationText = summary.canalRestoration
    ? `${summary.canalRestoration.title}：新增 ${summary.canalRestoration.expandedPlots} 格灵田，解锁 ${summary.canalRestoration.unlockedSeedName} x${summary.canalRestoration.seedGiftCount}`
    : "";
  const pondSummaryText = summary.pondSummary
    ? `灵池水位 ${summary.pondSummary.waterLabel}${summary.pondSummary.autoWater ? " · 今晚会替水生田续水" : " · 明天要手动顾水"} · 夜护 ${summary.pondSummary.nightWaterCropCareDays} 夜 · ${summary.pondSummary.lotusText}${summary.pondSummary.lastCatch ? ` · 最近捞起 ${summary.pondSummary.lastCatch.itemName} x${summary.pondSummary.lastCatch.count}` : ""}${summary.pondSummary.ecologyEvent ? ` · ${summary.pondSummary.ecologyEvent.title}` : ""}${summary.pondSummary.mastery ? " · 青禾已经教会你稳水看口" : ""}${summary.pondSummary.moonPondActive ? " · 月池静养生效" : ""}`
    : "";
  const shopFirstSaleToday = summary.shopOpening?.firstSale && summary.shopOpening.firstSale.day === summary.day;
  const shopSessionToday = summary.shopOpening?.lastSession && summary.shopOpening.lastSession.day === summary.day;
  const shopFeaturedText = summary.shopOpening?.lastSession?.featuredMomentText || "";
  const shopReflection = shopSaleReflectionSpec(summary.shopOpening || {});
  const shopRegularBoard = summary.shopOpening?.regularBoard || null;
  const shopOpeningText = shopFirstSaleToday
    ? `${summary.shopOpening.firstSale.name} 买走 ${summary.shopOpening.firstSale.itemName}，因为：${summary.shopOpening.firstSale.reasonText}${shopFeaturedText ? `；${shopFeaturedText}` : ""}`
    : shopSessionToday
      ? `今日旧铺 ${summary.shopOpening.lastSession.visitors} 位顾客进店，热卖预告：${summary.shopOpening.hotTagLabel || summary.shopOpening.lastSession.hotTagLabel}${shopFeaturedText ? `；${shopFeaturedText}` : ""}`
      : "";
  const shopReviewText = shopReflection?.reviewQuote ? `顾客短评：${shopReflection.reviewQuote}` : "";
  const shopReturnPreviewText = shopReflection?.returnPreview
    ? `回头客预告：${shopReflection.returnPreview.summary}；${shopReflection.returnPreview.cta}`
    : "";
  const shopDoorstepText = shopDoorstepSceneSummaryText(summary.shopOpening || {});
  const shopSeasonalDoorstepText = shopSeasonalDoorstepSceneSummaryText(summary.shopSeasonalDoorstep || null);
  const shopReturningDigestText = shopReturningVisitDigestSummaryText(summary.shopOpening || {});
  const shopIntroducedText = shopIntroducedCustomerDigestSummaryText(summary.shopOpening || {});
  const shopWordOfMouthText = shopWordOfMouthSummaryText(summary.shopWordOfMouth || null);
  const shopWordVisitText = shopWordOfMouthVisitSummaryText(summary.shopOpening?.lastSession?.shopWordOfMouthVisit || null);
  const shopVisitPledgeText = shopVisitPledgeSummaryText(summary.shopOpening?.visitPledge || summary.shopOpening?.lastSession?.visitPledge || null);
  const shopTownErrandText = shopTownErrandSummaryText(summary.shopOpening?.townErrand || summary.shopOpening?.lastSession?.townErrand || null);
  const shopRegularBoardText = shopRegularBoardSummaryText(shopRegularBoard);
  const shopReputationText = shopReputationStageSummaryText(summary.shopReputationStage || null);
  const shopCustomerLessonMarkupText = shopCustomerDayLessonMarkup(summary.shopCustomerLesson || null);
  const shopRestock = summary.shopRestock || null;
  const shopWeatherShelf = summary.shopWeatherShelf || null;
  const shopWaterwayStandingOrder = summary.shopWaterwayStandingOrder || null;
  const canalPlan = summary.canalDaySummaryPlan || null;
  const canalPlanMarkup = canalPlan
    ? `
      <div class="day-summary-canal-plan ${canalPlan.yuelianClued ? "clued" : "active"}">
        <strong>${canalPlan.title}</strong>
        <span>${canalPlan.headline}</span>
        <div class="day-summary-canal-plan-grid">
          ${(canalPlan.steps || []).map((step) => `
            <button type="button" class="${step.stateClass || "pending"}" data-day-summary-canal-plan="${step.key}">
              <b>${step.label}</b>
              <small>${step.detail}</small>
              <em>${step.buttonLabel}</em>
            </button>
          `).join("")}
        </div>
        <small>明日建议：${canalPlan.advice}</small>
      </div>
    `
    : "";
  const liveShopTownErrand = shopTownErrandDisplaySpec();
  const liveShopTownErrandPrimary = shopTownErrandPrimaryActionSpec(liveShopTownErrand);
  const shopTownErrandMarkup = liveShopTownErrand
    ? `
      <div class="day-summary-shop-town-errand ${liveShopTownErrand.completed ? "ready" : liveShopTownErrand.failed ? "overdue" : liveShopTownErrand.ready ? "ready" : "active"}">
        <strong>镇上捎话 · ${liveShopTownErrand.npcLabel}</strong>
        <span>${liveShopTownErrand.statusLabel} · ${liveShopTownErrand.requestItemName} ${liveShopTownErrand.have}/${liveShopTownErrand.count} · ${liveShopTownErrand.note}</span>
        <small>${liveShopTownErrand.resultText || liveShopTownErrand.detail}</small>
        ${liveShopTownErrand.completed || liveShopTownErrand.failed ? "" : `
          <div class="day-summary-shop-town-errand-actions">
            <button type="button" data-shop-town-errand-action="${liveShopTownErrandPrimary?.mode || "focus"}" data-shop-town-errand-route="${liveShopTownErrandPrimary?.route?.action || ""}" data-shop-town-errand-recipe="${liveShopTownErrandPrimary?.route?.recipeId || ""}" data-shop-town-errand-seed="${liveShopTownErrandPrimary?.route?.seedId || ""}" data-shop-town-errand-tag="${liveShopTownErrandPrimary?.route?.shopTag || ""}" data-shop-town-errand-item="${liveShopTownErrandPrimary?.route?.itemId || liveShopTownErrand.requestItemId || ""}">${liveShopTownErrandPrimary?.label || "看镇上动线"}</button>
            ${liveShopTownErrandPrimary?.mode === "focus" ? "" : '<button type="button" data-shop-town-errand-action="focus">看镇上动线</button>'}
          </div>
        `}
      </div>
    `
    : "";
  const shopRestockMarkup = shopRestock
    ? `
      <div class="day-summary-shop-restock ${shopRestock.ready ? "ready" : shopRestock.overdue ? "overdue" : "active"}">
        <strong>${shopRestock.sourceLabel || "旧铺补货"}小抄 · ${shopRestock.itemName}</strong>
        <span>进度 ${shopRestock.have}/${shopRestock.desiredCount} · 期限第 ${shopRestock.dueDay} 天 · ${shopRestock.statusText}</span>
        <small>下一步：${shopRestock.routeText}${shopRestock.note ? ` · ${shopRestock.note}` : ""}</small>
        <button type="button" data-day-summary-shop-restock="${shopRestock.nextAction}" data-day-summary-restock-recipe="${shopRestock.recipeId || ""}" data-day-summary-restock-seed="${shopRestock.seedId || ""}" data-day-summary-restock-tag="${shopRestock.shopTag || ""}" data-day-summary-restock-item="${shopRestock.itemId || ""}">看补货追踪</button>
      </div>
    `
    : "";
  const shopWeatherShelfMarkup = shopWeatherShelf
    ? `
      <div class="day-summary-shop-weather-shelf ${shopWeatherShelf.success ? "ready" : "overdue"}">
        <strong>${shopWeatherShelf.title}</strong>
        <span>${shopWeatherShelf.headline}</span>
        <small>明日建议：${shopWeatherShelf.nextAction}</small>
        <div class="day-summary-shop-weather-actions">
          <button type="button" ${shopWeatherShelf.followupAction === "restock" ? `data-shop-weather-restock="true" data-shop-weather-restock-item="${shopWeatherShelf.itemId || ""}" data-shop-weather-restock-tag="${shopWeatherShelf.tag || ""}"` : 'data-shop-weather-review="true"'}>${shopWeatherShelf.buttonLabel || "追踪天气补货"}</button>
          ${shopWeatherShelf.route ? `<button type="button" data-shop-weather-route="${shopWeatherShelf.route.action}" data-shop-weather-recipe="${shopWeatherShelf.route.recipeId || ""}" data-shop-weather-seed="${shopWeatherShelf.route.seedId || ""}" data-shop-weather-tag="${shopWeatherShelf.route.shopTag || shopWeatherShelf.tag || ""}" data-shop-weather-item="${shopWeatherShelf.route.itemId || shopWeatherShelf.itemId || ""}">${shopWeatherShelf.route.action === "recipe" ? "看配方" : shopWeatherShelf.route.action === "seed" ? "看种子" : "看旧铺货签"}</button>` : ""}
        </div>
      </div>
    `
    : "";
  const shopWaterwayStandingOrderMarkup = shopWaterwayStandingOrder
    ? `
      <div class="day-summary-waterway-standing ${shopWaterwayStandingOrder.ready ? "ready" : "overdue"}">
        <strong>${shopWaterwayStandingOrder.title}</strong>
        <span>${shopWaterwayStandingOrder.focusItemName} ${shopWaterwayStandingOrder.focusHave}/${shopWaterwayStandingOrder.focusTarget} · 常单备货 ${shopWaterwayStandingOrder.stockedKinds} 类 / ${shopWaterwayStandingOrder.totalStock} 件</span>
        <small>${shopWaterwayStandingOrder.detail}</small>
        <small>明日建议：${shopWaterwayStandingOrder.nextAction}</small>
        <div class="day-summary-waterway-standing-actions">
          <button type="button" data-day-summary-waterway-standing="focus">回看常单牌</button>
          ${shopWaterwayStandingOrder.route ? `<button type="button" data-day-summary-waterway-standing="${shopWaterwayStandingOrder.route.action}" data-day-summary-waterway-recipe="${shopWaterwayStandingOrder.route.recipeId || ""}" data-day-summary-waterway-seed="${shopWaterwayStandingOrder.route.seedId || ""}" data-day-summary-waterway-tag="${shopWaterwayStandingOrder.route.shopTag || ""}" data-day-summary-waterway-item="${shopWaterwayStandingOrder.route.itemId || shopWaterwayStandingOrder.focusItemId || ""}">${shopWaterwayStandingOrder.route.action === "recipe" ? "看配方" : shopWaterwayStandingOrder.route.action === "seed" ? "看种子" : "看旧铺货签"}</button>` : ""}
        </div>
      </div>
    `
    : "";
  const failureCodexText = summary.failureCodex
    ? `${failureCodexTypeLabel(summary.failureCodex.type)} · ${summary.failureCodex.title}：${summary.failureCodex.insight || summary.failureCodex.problem}；下次：${summary.failureCodex.nextAction || "按见闻册调整"}${summary.failureCodex.rewardText ? `；托底：${summary.failureCodex.rewardText}` : ""}`
    : "";
  const weather = data.weatherById.get(summary.weather);
  const term = data.solarTermsById.get(summary.term);
  const nightGrowthText = summary.nightGrowth
    ? `夜间成长：新成熟 ${summary.nightGrowth.maturedCount} 块，继续生长 ${summary.nightGrowth.grownCount} 块${summary.nightGrowth.caredCount > 0 ? `，雨水/灵池代顾 ${summary.nightGrowth.caredCount} 块` : ""}${summary.nightGrowth.termChanged ? `；节气转入 ${summary.nightGrowth.termName}` : ""}`
    : "";
  const maturedPlotActionRows = (summary.maturedPlotActions || [])
    .slice(0, 3)
    .map((entry) => `
      <div class="day-summary-mature-route ${entry.route?.type || "stock"}">
        <span><b>${entry.cropName}</b> · 灵田 (${Number(entry.x) + 1}, ${Number(entry.y) + 1})</span>
        <small>${entry.routeBadge} → ${entry.routeTarget} · ${entry.detail}</small>
        <button type="button" data-day-summary-mature-plot="${entry.x},${entry.y}">定位收获</button>
      </div>
    `)
    .join("");
  const harvestUseRouteText = summary.harvestUseRoute
    ? `${summary.harvestUseRoute.itemName} x${summary.harvestUseRoute.count} → ${summary.harvestUseRoute.headline || summary.harvestUseRoute.badge}；${summary.harvestUseRoute.detail || summary.harvestUseRoute.cta}`
    : "";
  const ecologyInspectionCareText = summary.ecologyDailyEvent?.inspectionCare?.active
    ? `；巡看照料：${summary.ecologyDailyEvent.inspectionCare.landmarkLabel} · 心情 +${summary.ecologyDailyEvent.inspectionCare.moodBonus} / 灵石 +${summary.ecologyDailyEvent.inspectionCare.goldBonus}`
    : "";
  const ecologyDailyText = summary.ecologyDailyEvent
    ? `${summary.ecologyDailyEvent.tierLabel} · ${summary.ecologyDailyEvent.title}：${summary.ecologyDailyEvent.actionText}${ecologyInspectionCareText}${summary.ecologyDailyEvent.rewards?.length ? `；收获 ${summary.ecologyDailyEvent.rewards.map((reward) => reward.text).join("、")}` : ""}${summary.ecologyDailyEvent.targetSpiritNames?.length ? `；安抚 ${summary.ecologyDailyEvent.targetSpiritNames.join("、")}` : ""}${summary.ecologyDailyEvent.memoryResonance?.tier > 0 ? `；${summary.ecologyDailyEvent.memoryResonance.label}余韵生效` : ""}`
    : "";
  const ecologyMemoryText = summary.ecologyMemoryResonance?.tier > 0
    ? `${summary.ecologyMemoryResonance.label}：已记 ${summary.ecologyMemoryResonance.nights} 夜 / ${summary.ecologyMemoryResonance.comboCount} 类，后续夜事心情 +${summary.ecologyMemoryResonance.moodBonus}、灵石 +${summary.ecologyMemoryResonance.goldBonus}`
    : "";
  const spiritFinaleText = summary.spiritFinaleEffects
    ? spiritFinaleEffectCompactText(summary.spiritFinaleEffects, 4)
    : "";
  const spiritFinaleDetailText = summary.spiritFinaleEffects?.rows?.length
    ? summary.spiritFinaleEffects.rows.slice(0, 3).map((row) => row.detail).join("；")
    : "";
  const p0SnapshotMarkup = daySummaryP0SnapshotMarkup(summary, morningBoard);
  const vsa008EvidenceMarkup = daySummaryVsa008EvidenceMarkup(summary, morningBoard);
  const tomorrowFirstStepMarkup = daySummaryTomorrowFirstStepMarkup(morningBoard, summary);
  const earlyRewardNextDelightMarkupText = earlyRewardNextDelightMarkup(summary.earlyRewardNextDelight || earlyRewardNextDelightSpec());
  const dungeonDayEchoMarkupText = dungeonDayEchoDaySummaryMarkup(summary.dungeonDayEcho || null);
  const automationDayLedgerMarkupText = automationDayLedgerMarkup(summary.automationDayLedger || automationDayLedgerSpec(summary));
  const postMainlineRhythmDaySummaryMarkupText = postMainlineRhythmDaySummaryMarkup();
  const postMainlineEveningEchoMarkupText = postMainlineEveningEchoMarkup();
  const postMainlineLongTailMarkupText = postMainlineLongTailResonanceMarkup();
  const node = document.createElement("div");
  node.className = "day-summary-card ready";
  node.innerHTML = `
    ${vsa008EvidenceMarkup}
    ${p0SnapshotMarkup}
    ${morningMarkup}
    ${prepMarkup}
    ${tomorrowFirstStepMarkup}
    ${earlyRewardNextDelightMarkupText}
    ${postMainlineRhythmDaySummaryMarkupText}
    <strong>第 ${summary.day} 天结束 → 第 ${summary.nextDay} 天</strong>
    <span>${localize(term?.term_name_key, summary.term)} · ${localize(weather?.weather_name_key, summary.weather)} · 灵石 ${summary.goldDelta >= 0 ? "+" : ""}${summary.goldDelta} · 声望 ${summary.fameDelta >= 0 ? "+" : ""}${summary.fameDelta}</span>
    <span>${inventoryText}</span>
    ${dailyIntentReviewMarkupText}
    ${solarMorningSummaryText ? `<small class="day-summary-solar-morning">今日天时复盘：${solarMorningSummaryText}</small>` : ""}
    ${solarTermMoodTrailMarkup}
    ${solarTermMoodShopDisplaySummaryMarkup}
    ${weatherLifeVignetteMarkup}
    ${townLifeWeatherMomentMarkup}
    ${townLifeWeatherErrandMarkup}
    ${careChainMarkup}
    ${nightGrowthText ? `<small>${nightGrowthText}</small>` : ""}
    ${maturedPlotActionRows ? `<div class="day-summary-mature-list"><strong>明早先收</strong>${maturedPlotActionRows}</div>` : ""}
    ${harvestUseRouteText ? `<small class="day-summary-harvest-route">收获去向：${harvestUseRouteText}</small>` : ""}
    ${canalPlanMarkup}
    ${shopRestockMarkup}
    ${shopWeatherShelfMarkup}
    ${shopWaterwayStandingOrderMarkup}
    ${dungeonDayEchoMarkupText}
    ${failureCodexText ? `<small class="day-summary-failure-codex">失败见闻：${failureCodexText}</small>` : ""}
    ${ecologyDailyText ? `<small class="day-summary-ecology">${ecologyDailyText}</small>` : ""}
    ${ecologyMemoryText ? `<small class="day-summary-ecology-memory">${ecologyMemoryText}</small>` : ""}
    ${spiritFinaleText ? `<small class="day-summary-spirit-finale"><b>终章伙伴常驻</b>${spiritFinaleText}<em>${spiritFinaleDetailText}</em></small>` : ""}
    <small>精怪夜勤：${spiritJobText}</small>
    ${spiritSeasonalWorkMarkup}
    ${spiritJobSynergyMarkup}
    ${automationDayLedgerMarkupText}
    ${workshopText ? `<small>${workshopText}</small>` : ""}
    ${workshopOrderMatchText ? `<small class="day-summary-workshop-order">工坊接单：${workshopOrderMatchText}</small>` : ""}
    <small>成熟地块 ${summary.matured} · 未处理风险 ${summary.unresolved} · 商队返程 ${summary.returnedRuns} · ${summary.activeTrial ? `试炼：${summary.activeTrial}` : "暂无进行中试炼"}</small>
    ${shopOpeningText ? `<small>旧铺日结：${shopOpeningText}</small>` : ""}
    ${shopReviewText ? `<small>${shopReviewText}</small>` : ""}
    ${shopReturnPreviewText ? `<small>${shopReturnPreviewText}</small>` : ""}
    ${shopDoorstepText ? `<small>门口小景：${shopDoorstepText}</small>` : ""}
    ${shopSeasonalDoorstepText ? `<small>节气门口：${shopSeasonalDoorstepText}</small>` : ""}
    ${shopReturningDigestText ? `<small>熟脸回门：${shopReturningDigestText}</small>` : ""}
    ${shopIntroducedText ? `<small>熟客带新客：${shopIntroducedText}</small>` : ""}
    ${shopWordOfMouthText ? `<small>铺前市闻：${shopWordOfMouthText}</small>` : ""}
    ${shopWordVisitText ? `<small>铺前来帖：${shopWordVisitText}</small>` : ""}
    ${shopVisitPledgeText ? `<small>来帖小约：${shopVisitPledgeText}</small>` : ""}
    ${shopTownErrandText ? `<small>镇上捎话：${shopTownErrandText}</small>` : ""}
    ${shopRegularBoardText ? `<small>熟客留言墙：${shopRegularBoardText}</small>` : ""}
    ${shopReputationText ? `<small class="day-summary-shop-reputation">旧铺名声：${shopReputationText}</small>` : ""}
    ${shopCustomerLessonMarkupText}
    ${shopTownErrandMarkup}
    ${summary.shopSeason ? `<small>名铺月评：${summary.shopSeason.seasonName} · ${String(summary.shopSeason.rankTier).toUpperCase()} 档 · ${summary.shopSeason.score} 分</small>` : ""}
    ${cohabMomentText ? `<small>同住生活：${cohabMomentText}</small>` : ""}
    ${cohabBuffText ? `<small>同住余韵：${cohabBuffText}</small>` : ""}
    ${postMainlineEveningEchoMarkupText}
    ${rareSpiritTheaterDaySummaryMarkupText}
    ${rareSpiritText ? `<small>稀有精怪：${rareSpiritText}</small>` : ""}
    ${rareGiftText ? `<small>精怪回礼：${rareGiftText}</small>` : ""}
    ${townLifeGreetingText ? `<small>镇上见闻：${townLifeGreetingText}</small>` : ""}
    ${townLifeErrandText ? `<small>镇民托付：${townLifeErrandText}</small>` : ""}
    ${townLifeShopMomentText ? `<small>旧铺后话：${townLifeShopMomentText}</small>` : ""}
    ${townLifeShopMomentFocus ? `<button type="button" data-town-shop-moment-npc="${townLifeShopMomentFocus.npcId}" data-town-shop-moment-id="${townLifeShopMomentFocus.id}">翻开这页后话</button>` : ""}
    ${townLifeGiftText ? `<small>今日赠礼：${townLifeGiftText}</small>` : ""}
    ${townLifeMemoryText ? `<small>关系记忆：${townLifeMemoryText}</small>` : ""}
    ${spiritInteractionText ? `<small>伙伴回应：${spiritInteractionText}</small>` : ""}
    ${spiritMoodRepairText ? `<small>低落小事：${spiritMoodRepairText}</small>` : ""}
    ${postMainlineLongTailMarkupText}
    ${canalRestorationText ? `<small>洞天扩张：${canalRestorationText}</small>` : ""}
    ${pondSummaryText ? `<small>灵池近况：${pondSummaryText}</small>` : ""}
    ${summary.sproutSummary ? `<small>成精预告：${summary.sproutSummary}</small>` : ""}
    ${sproutMomentText ? `<small>田垄异动：${sproutMomentText}</small>` : ""}
    <small>明日建议：${summary.advice}</small>
  `;
  refs.daySummaryPanel.append(node);
}
