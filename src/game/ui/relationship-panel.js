export function renderRelationshipsPanelUi({
  refs,
  state,
  data,
  npcStoryEvents,
  syncCohabState,
  activeOrderDeliveryMoment,
  activeShopTownErrandFeedback,
  activeStoryVisitFeedback,
  activeBaizhiQuestStageFeedback,
  baizhiChapterFinishPanelHint,
  herbValleyUnlockPanelHint,
  spiritManorPanelHint,
  chapter3TradePanelHint,
  chapter4DroughtPanelHint,
  activeQinghePondEntryFeedback,
  activeQinghePondProgressFeedback,
  townLifeRows,
  currentWeatherConfig,
  currentTermConfig,
  canvasTownLifeFocusMarkup,
  shopTownErrandDisplaySpec,
  earlyNpcRoadmapMarkup,
  earlyNpcRoadmapSpec,
  townLifeOpportunityBoardMarkup,
  chapter4DroughtActive,
  currentTermId,
  clockMinuteText,
  localize,
  townLifeGreetingSeen,
  townLifeErrandStatus,
  latestTownLifeShopMoment,
  shopTownErrandPrimaryActionSpec,
  townLifeErrandRouteSpec,
  npcName,
  favorLevel,
  currentScheduleFor,
  cohabStatusFor,
  nextCohabEvent,
  festivalEventFor,
  cohabBuffSpec,
  sideDialogueHintFor,
  sideQuestClueForNpc,
  questTitle,
  sideQuestClueStatusText,
  stepLabel,
  activeNpcCompendiumRemark,
  recommendedNpcGift,
  townLifeGiftSeen,
  syncTownLifeInteractionState,
  townLifeGiftKey,
  conditionMet,
  currentCohabWeekKey,
  currentCohabFestivalKey,
  cohabMomentWindowText,
  cohabLifeSummary,
  cohabRequirementText,
  latestTownLifeMemory,
  townLifeUnlockedMemoryEntries,
  townLifeInteractionCounts,
  townLifeMemoryProgressText,
  townLifeShopMomentArchiveEntries,
  npcPortraitSrc,
  areaName,
  cohabSharedBonusText,
  favorRewardSummary,
}) {
  refs.relationshipPanel.innerHTML = "";
  syncCohabState();
  const liveOrderFeedback = activeOrderDeliveryMoment();
  const liveShopTownErrandFeedback = activeShopTownErrandFeedback();
  const liveStoryVisit = activeStoryVisitFeedback();
  const liveBaizhiStage = activeBaizhiQuestStageFeedback();
  const chapterFinishHint = baizhiChapterFinishPanelHint();
  const herbValleyHint = chapterFinishHint ? null : herbValleyUnlockPanelHint();
  const spiritManorHint = spiritManorPanelHint();
  const chapter3TradeHint = chapter3TradePanelHint();
  const chapter4DroughtHint = chapter4DroughtPanelHint();
  const qinghePondEntry = activeQinghePondEntryFeedback();
  const qinghePondProgress = activeQinghePondProgressFeedback();
  const visible = data.npcs.filter((npc) => npc.npc_id !== "npc_system").slice(0, 6);
  const townRows = townLifeRows(6);
  const townWeather = currentWeatherConfig();
  const townTerm = currentTermConfig();
  const canvasTownMarkup = canvasTownLifeFocusMarkup();
  const shopTownErrand = shopTownErrandDisplaySpec();
  if (canvasTownMarkup) refs.relationshipPanel.insertAdjacentHTML("beforeend", canvasTownMarkup);
  const earlyRoadmapMarkup = earlyNpcRoadmapMarkup(earlyNpcRoadmapSpec(townRows));
  if (earlyRoadmapMarkup) refs.relationshipPanel.insertAdjacentHTML("beforeend", earlyRoadmapMarkup);
  const opportunityMarkup = townLifeOpportunityBoardMarkup(townRows);
  if (opportunityMarkup) refs.relationshipPanel.insertAdjacentHTML("beforeend", opportunityMarkup);
  const townBoard = document.createElement("div");
  townBoard.className = `town-life-board ${chapter4DroughtActive() ? "urgent" : currentTermId() === "term_dongzhi" ? "festival" : ""}`;
  townBoard.innerHTML = `
    <div class="town-life-header">
      <strong>凡仙镇今日动线</strong>
      <span>第 ${state.day} 天 · ${clockMinuteText()} · ${localize(townTerm?.term_name_key, currentTermId())} · ${localize(townWeather.weather_name_key, townWeather.weather_id)}</span>
    </div>
    <div class="town-life-grid">
      ${townRows.map((row) => {
        const greeted = townLifeGreetingSeen(row.npc.npc_id);
        const rowErrand = townLifeErrandStatus(row);
        const rowShopMoment = latestTownLifeShopMoment(row.npc.npc_id);
        const rowShopAction = shopTownErrand?.npcId === row.npc.npc_id ? shopTownErrandPrimaryActionSpec(shopTownErrand) : null;
        const rowErrandRoute = greeted && rowErrand && !rowErrand.completed && !rowErrand.ready ? townLifeErrandRouteSpec(rowErrand) : null;
        return `
          <div class="town-life-row ${row.status.key}${greeted ? " greeted" : ""}">
            <b>${npcName(row.npc.npc_id)}</b>
            <span>${row.area} · ${row.action}</span>
            <em>${row.status.label} · 好感 Lv.${row.level}${greeted ? " · 今日已寒暄" : ""}</em>
            <small>${row.bark}</small>
            ${rowShopMoment ? `<small class="town-life-shop-moment ${rowShopMoment.day === state.day ? "fresh" : "archive"}">旧铺后话：${rowShopMoment.summary}</small>` : ""}
            ${shopTownErrand?.npcId === row.npc.npc_id ? `<small class="town-life-errand ${shopTownErrand.completed ? "done" : shopTownErrand.failed ? "pending" : shopTownErrand.ready ? "ready" : "pending"}">旧铺捎话：${shopTownErrand.requestItemName} ${shopTownErrand.have}/${shopTownErrand.count} · ${shopTownErrand.note}</small>` : ""}
            ${greeted && rowErrand ? `<small class="town-life-errand ${rowErrand.completed ? "done" : rowErrand.ready ? "ready" : "pending"}">今日小托付：${rowErrand.title} · ${rowErrand.itemName} ${rowErrand.have}/${rowErrand.count} · 回礼 ${rowErrand.rewardGold} 灵石${rowErrand.rewardFame ? ` / 声望 +${rowErrand.rewardFame}` : ""}</small>` : ""}
            ${rowErrandRoute ? `<small class="town-life-errand-route ${rowErrandRoute.type}">备货路线：${rowErrandRoute.label} · ${rowErrandRoute.title}</small>` : ""}
            <button type="button" data-town-life-greet="${row.npc.npc_id}" ${row.status.key === "away" || greeted ? "disabled" : ""}>${greeted ? "已寒暄" : "打个招呼"}</button>
            ${shopTownErrand?.npcId === row.npc.npc_id ? `<button type="button" data-shop-town-errand-action="${rowShopAction?.mode || "focus"}" data-shop-town-errand-route="${rowShopAction?.route?.action || ""}" data-shop-town-errand-recipe="${rowShopAction?.route?.recipeId || ""}" data-shop-town-errand-seed="${rowShopAction?.route?.seedId || ""}" data-shop-town-errand-tag="${rowShopAction?.route?.shopTag || ""}" data-shop-town-errand-item="${rowShopAction?.route?.itemId || shopTownErrand.requestItemId || ""}" ${shopTownErrand.completed || shopTownErrand.failed ? "disabled" : ""}>${shopTownErrand.completed ? "已送到" : shopTownErrand.failed ? "已落空" : rowShopAction?.label || "看镇上动线"}</button>` : ""}
            ${greeted && rowErrand ? `<button type="button" data-town-life-errand="${row.npc.npc_id}" ${rowErrand.completed || !rowErrand.ready ? "disabled" : ""}>${rowErrand.completed ? "已办妥" : rowErrand.ready ? "交付小托付" : "材料不足"}</button>` : ""}
            ${rowErrandRoute ? `<button type="button" data-town-life-errand-route="${row.npc.npc_id}">${rowErrandRoute.buttonLabel || "看备货路线"}</button>` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;
  refs.relationshipPanel.append(townBoard);
  for (const npc of visible) {
    const value = state.npcFavor[npc.npc_id] || 0;
    const level = favorLevel(value);
    const nextReward = data.favorRewards
      .filter((reward) => reward.npc_id === npc.npc_id && !state.claimedFavorRewards.has(reward.reward_id))
      .sort((a, b) => Number(a.favor_level) - Number(b.favor_level))[0];
    const schedule = currentScheduleFor(npc.npc_id);
    const cohab = cohabStatusFor(npc.npc_id);
    const cohabEvent = cohab ? nextCohabEvent(cohab.epilogue.epilogue_id) : null;
    const festival = cohab ? festivalEventFor(cohab.epilogue.epilogue_id) : null;
    const cohabHistory = cohab ? (state.cohabState.history || []).find((entry) => entry.epilogueId === cohab.epilogue.epilogue_id) : null;
    const activeCohabBuff = cohab ? Object.entries(state.cohabState.activeBuffs || {}).find(([, info]) => info.route === cohab.epilogue.epilogue_id) : null;
    const activeCohabBuffText = activeCohabBuff
      ? `${cohabBuffSpec(activeCohabBuff[0]).label} · 余 ${Math.max(0, Number(activeCohabBuff[1].expiresDay || state.day) - state.day + 1)} 天`
      : "";
    const sideHint = sideDialogueHintFor(npc.npc_id);
    const sideClue = sideQuestClueForNpc(npc.npc_id);
    const sideClueText = sideClue
      ? `${questTitle(sideClue.quest)} · ${sideQuestClueStatusText(sideClue)}${sideClue.currentStep ? ` · ${stepLabel(sideClue.currentStep)}` : ""}`
      : sideHint
        ? `${questTitle(sideHint.quest)} · ${sideHint.map.scene_key}`
        : "等待触发";
    const compendiumRemark = activeNpcCompendiumRemark(npc.npc_id);
    const orderFeedback = state.orderDeliveryFeedback?.npcId === npc.npc_id ? state.orderDeliveryFeedback : null;
    const orderFeedbackLive = orderFeedback && liveOrderFeedback?.npcId === npc.npc_id ? liveOrderFeedback : null;
    const shopErrandFeedback = state.shopTownErrandFeedback?.npcId === npc.npc_id ? state.shopTownErrandFeedback : null;
    const shopErrandFeedbackLive = shopErrandFeedback && liveShopTownErrandFeedback?.npcId === npc.npc_id ? liveShopTownErrandFeedback : null;
    const storyFeedback = liveStoryVisit?.npcId === npc.npc_id ? liveStoryVisit : null;
    const baizhiStageFeedback = npc.npc_id === "npc_baizhi" ? liveBaizhiStage : null;
    const herbValleyFeedback = npc.npc_id === "npc_baizhi" ? herbValleyHint : null;
    const chapterFinishFeedback = npc.npc_id === "npc_baizhi" ? chapterFinishHint : null;
    const spiritManorFeedback = npc.npc_id === "npc_atan" ? spiritManorHint : null;
    const chapter3TradeFeedback = npc.npc_id === "npc_hu_sihai" ? chapter3TradeHint : null;
    const chapter4DroughtFeedback = npc.npc_id === "npc_xubo" || npc.npc_id === "npc_qinghe" ? chapter4DroughtHint : null;
    const qinghePondFeedback = npc.npc_id === "npc_qinghe" ? qinghePondEntry : null;
    const qinghePondProgressFeedback = npc.npc_id === "npc_qinghe" ? qinghePondProgress : null;
    const sideFeedback = state.sideQuestFeedback?.npcId === npc.npc_id ? state.sideQuestFeedback : null;
    const npcEvents = npcStoryEvents.filter((event) => event.npcId === npc.npc_id);
    const eventProgress = npcEvents.length
      ? `${npcEvents.filter((event) => state.npcStoryEvents.has(event.id)).length}/${npcEvents.length} 基础事件`
      : "基础事件待扩展";
    const gift = recommendedNpcGift(npc.npc_id);
    const giftDone = townLifeGiftSeen(npc.npc_id);
    const giftText = giftDone
      ? `今日已赠礼：${syncTownLifeInteractionState().giftsByDay[townLifeGiftKey(npc.npc_id)]?.itemName || "一份心意"}`
      : gift
        ? `推荐赠礼：${gift.itemName} · ${gift.reason} · 好感 +${gift.favorGain}`
        : "推荐赠礼：背包里暂无合适礼物";
    const cohabManualDailySeen = cohab ? state.cohabState.dailySeen[`${cohab.epilogue.epilogue_id}:manual_daily`] === state.day : false;
    const cohabWeeklyReady = cohab?.unlocked
      ? (data.cohabWeeklyByEpilogue.get(cohab.epilogue.epilogue_id) || [])
        .some((entry) => conditionMet(entry.condition_group) && state.cohabState.weeklyClaims[entry.weekly_event_id] !== currentCohabWeekKey())
      : false;
    const cohabFestivalReady = cohab?.unlocked
      ? (data.cohabFestivalByEpilogue.get(cohab.epilogue.epilogue_id) || [])
        .some((entry) => conditionMet(entry.condition_group) && state.cohabState.festivalClaims[entry.festival_event_id] !== currentCohabFestivalKey())
      : false;
    const cohabSnapshotClass = cohab?.unlocked
      ? (cohabWeeklyReady || cohabFestivalReady ? "ready" : activeCohabBuffText ? "warm" : "warm")
      : "locked";
    const cohabSnapshotHtml = cohab
      ? `<div class="relationship-cohab-snapshot ${cohabSnapshotClass}">
        <strong>今日家况 · ${cohab.epilogue.route_name}</strong>
        <span>${cohab.unlocked ? cohabMomentWindowText(cohabLifeSummary([cohab.epilogue])) : cohabRequirementText(cohab)}</span>
        <small>${cohabHistory ? `最近小事：${cohabHistory.eventName} · 第 ${cohabHistory.day} 天` : "最近小事：还没有触发同住生活事件"}</small>
        <div class="relationship-cohab-chips">
          <span class="${cohab.unlocked ? "ready" : "locked"}">${cohab.unlocked ? "同住已开" : "同住未开"}</span>
          <span class="${cohabWeeklyReady ? "ready" : "idle"}">${cohabWeeklyReady ? "周常可推进" : "周常待机"}</span>
          <span class="${cohabFestivalReady ? "festival" : "idle"}">${cohabFestivalReady ? "节气小事可看" : "节庆待时"}</span>
          ${activeCohabBuffText ? `<span class="buff">余韵 ${activeCohabBuffText}</span>` : ""}
        </div>
      </div>`
      : "";
    const cohabActionsHtml = cohab
      ? `<div class="relationship-cohab-actions">
        <button type="button" data-cohab-daily="${npc.npc_id}" ${!cohab.unlocked || cohabManualDailySeen ? "disabled" : ""}>${cohab.unlocked ? cohabManualDailySeen ? "今日已聊" : "看同住日常" : "同住未开"}</button>
        <button type="button" data-cohab-weekly="${npc.npc_id}" ${!cohabWeeklyReady ? "disabled" : ""}>${cohabWeeklyReady ? "推进周常" : "周常待机"}</button>
        <button type="button" data-cohab-festival="${npc.npc_id}" ${!cohabFestivalReady ? "disabled" : ""}>${cohabFestivalReady ? "节气小事" : "节庆待时"}</button>
      </div>`
      : "";
    const memory = latestTownLifeMemory(npc.npc_id);
    const memoryArchive = townLifeUnlockedMemoryEntries(npc.npc_id);
    const counts = townLifeInteractionCounts(npc.npc_id);
    const memoryProgress = townLifeMemoryProgressText(npc.npc_id);
    const shopMoment = latestTownLifeShopMoment(npc.npc_id);
    const shopMomentArchive = townLifeShopMomentArchiveEntries(npc.npc_id, 4);
    const memoryText = memory
      ? `最近记忆：${memory.title} · ${memory.summary}`
      : "最近记忆：还没有留下能写进关系册的小事";
    const memoryArchiveHtml = memoryArchive.length
      ? `<div class="relationship-memory-archive">
        ${memoryArchive.map((entry) => `<button type="button" data-town-memory-npc="${npc.npc_id}" data-town-memory-id="${entry.memoryId}">${entry.level}心 · ${entry.title}</button>`).join("")}
      </div>`
      : `<div class="relationship-memory-archive empty"><span>关系册空白：先在镇上寒暄、帮托付或赠礼，写下第一段小事。</span></div>`;
    const shopMomentArchiveHtml = shopMomentArchive.length
      ? `<div class="relationship-shop-archive">
        ${shopMomentArchive.map((entry) => `<button type="button" data-town-shop-moment-npc="${npc.npc_id}" data-town-shop-moment-id="${entry.id}" ${state.activeTownLifeShopMomentPage?.momentId === entry.id ? "disabled" : ""}>第 ${entry.day} 天 · ${entry.sceneTag || entry.itemName}</button>`).join("")}
      </div>`
      : "";
    const portrait = npcPortraitSrc(npc.npc_id);
    const node = document.createElement("div");
    node.dataset.npcId = npc.npc_id;
    node.className = `relationship-card ${level > 0 ? "known" : "new"} ${orderFeedback ? "order-touched" : ""} ${orderFeedbackLive ? "order-live" : ""} ${shopErrandFeedback ? "shop-touched" : ""} ${shopErrandFeedbackLive ? "shop-live" : ""} ${storyFeedback || baizhiStageFeedback || herbValleyFeedback || chapterFinishFeedback || spiritManorFeedback || chapter3TradeFeedback || chapter4DroughtFeedback ? "story-touched" : ""} ${sideFeedback ? "side-touched" : ""}`;
    node.innerHTML = `
      <div class="relationship-card-hero">
        <img src="${portrait}" alt="${npcName(npc.npc_id)}头像" loading="lazy" />
        <div>
          <strong>${npcName(npc.npc_id)} · Lv.${level}</strong>
          <span>${npc.npc_role} · 好感 ${value}/100 · ${schedule ? `${areaName(schedule.area_id)} / ${schedule.action_type}` : "暂无日程"}</span>
        </div>
      </div>
      ${orderFeedback ? `<span class="relationship-order-feedback${orderFeedbackLive ? " live" : ""}">${orderFeedback.title}：${orderFeedback.response} ${orderFeedback.favorLeveled ? "新的关系档位已点亮。" : `当前 ${orderFeedback.favorAfter}/100。`}${orderFeedbackLive ? ` ${orderFeedback.npcLabel} 刚把这单记到账本下。` : ""}</span>` : ""}
      ${shopErrandFeedback ? `<span class="relationship-shop-feedback${shopErrandFeedbackLive ? " live" : ""}">${shopErrandFeedback.title}：${shopErrandFeedback.response} ${shopErrandFeedback.memoryTitle ? `关系册写下「${shopErrandFeedback.memoryTitle}」。` : shopErrandFeedback.favorLeveled ? "新的关系档位已点亮。" : `当前 ${shopErrandFeedback.favorAfter}/100。`}${shopErrandFeedbackLive ? ` ${shopErrandFeedback.line || ""}` : ""}</span>` : ""}
      ${storyFeedback ? `<span class="relationship-story-feedback${storyFeedback.fresh ? " live" : ""}">${storyFeedback.title}：${storyFeedback.detail} ${storyFeedback.questLabel} 已浮现。</span>` : ""}
      ${baizhiStageFeedback ? `<span class="relationship-story-feedback live">${baizhiStageFeedback.title}：${baizhiStageFeedback.detail} ${baizhiStageFeedback.cta}</span>` : ""}
      ${herbValleyFeedback ? `<span class="relationship-story-feedback live">${herbValleyFeedback.title}：${herbValleyFeedback.detail} ${herbValleyFeedback.cta}</span>` : ""}
      ${chapterFinishFeedback ? `<span class="relationship-story-feedback live">${chapterFinishFeedback.title}：${chapterFinishFeedback.detail} ${chapterFinishFeedback.cta}</span>` : ""}
      ${spiritManorFeedback ? `<span class="relationship-story-feedback live">${spiritManorFeedback.title}：${spiritManorFeedback.detail} ${spiritManorFeedback.cta}</span>` : ""}
      ${chapter3TradeFeedback ? `<span class="relationship-story-feedback live">${chapter3TradeFeedback.title}：${chapter3TradeFeedback.detail} ${chapter3TradeFeedback.cta}</span>` : ""}
      ${chapter4DroughtFeedback ? `<span class="relationship-story-feedback live">${chapter4DroughtFeedback.title}：${chapter4DroughtFeedback.detail} ${chapter4DroughtFeedback.cta}</span>` : ""}
      ${qinghePondFeedback ? `<span class="relationship-pond-feedback live">${qinghePondFeedback.questTitle}：${qinghePondFeedback.statusText} ${qinghePondFeedback.nextAdvice}</span>` : ""}
      ${qinghePondProgressFeedback ? `<span class="relationship-pond-progress-feedback live">${qinghePondProgressFeedback.title}：${qinghePondProgressFeedback.headline} ${qinghePondProgressFeedback.nextAdvice}</span>` : ""}
      ${sideFeedback ? `<span class="relationship-side-feedback">${sideFeedback.title}：${sideFeedback.phaseLabel} · ${sideFeedback.stepText}</span>` : ""}
      <span>剧情进度：${eventProgress}</span>
      <span>支线线索：${sideClueText}</span>
      <span>同居线：${cohab ? cohabRequirementText(cohab) : "未配置"}</span>
      <span>同住加成：${cohab ? `${cohabSharedBonusText(cohab.epilogue)}${activeCohabBuffText ? ` · 当前余韵 ${activeCohabBuffText}` : ""}` : "暂无"}</span>
      <span>事件预览：${cohabEvent ? cohabEvent.event_name || cohabEvent.scene_key : "暂无"}${festival ? ` · 节庆 ${festival.event_name}` : ""}</span>
      <span>生活近况：${cohabHistory ? `${cohabHistory.eventName} · 第 ${cohabHistory.day} 天` : "还没有触发同住生活事件"}</span>
      ${cohabSnapshotHtml}
      ${cohabActionsHtml}
      ${shopMoment ? `<span class="relationship-shop-moment ${shopMoment.day === state.day ? "fresh" : "archive"}">旧铺后话：${shopMoment.summary}${shopMoment.rewardText ? ` · ${shopMoment.rewardText}` : ""}</span>` : ""}
      ${shopMomentArchiveHtml}
      <span class="relationship-memory ${memory ? "unlocked" : "pending"}">${memoryText}</span>
      ${memoryArchiveHtml}
      <span class="relationship-memory-progress">来往 ${counts.total} 次（寒暄 ${counts.greet} / 托付 ${counts.errand} / 赠礼 ${counts.gift}） · ${memoryProgress}</span>
      <span class="relationship-gift-hint ${giftDone ? "done" : gift?.tone || "empty"}">${giftText}</span>
      ${compendiumRemark ? `<span class="relationship-compendium">印记点评：${compendiumRemark}</span>` : ""}
      <small>下一奖励：${nextReward ? `Lv.${nextReward.favor_level} · ${favorRewardSummary(nextReward)}` : "已领取当前全部奖励"}</small>
      <button type="button" data-npc-gift="${npc.npc_id}" ${giftDone || !gift ? "disabled" : ""}>${giftDone ? "今日已赠" : gift ? "赠送推荐礼物" : "无合适礼物"}</button>
    `;
    refs.relationshipPanel.append(node);
  }
}
