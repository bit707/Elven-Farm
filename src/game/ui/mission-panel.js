export function renderMissionPanelUi({
  refs,
  state,
  data,
  activeStoryVisitFeedback,
  syncShopOpeningState,
  shopVisitPledgeDisplaySpec,
  shopTownErrandDisplaySpec,
  shopWordOfMouthVisitLeadSpec,
  shopWordOfMouthDisplaySpec,
  activeBaizhiQuestStageFeedback,
  baizhiChapterFinishPanelHint,
  herbValleyUnlockPanelHint,
  spiritManorPanelHint,
  chapter3TradePanelHint,
  chapter4DroughtPanelHint,
  missionCropCodexRowByKey,
  baizhiQuestGuidanceActive,
  baizhiQuestGuidanceSpec,
  mainStoryCompassSpec,
  storyCompassActionLabel,
  mainStoryChapterRoadmapMarkup,
  mainStoryChapterRoadmapSpec,
  questTitle,
  npcName,
  mainStoryFullClearMarkup,
  mainStoryFullClearSpec,
  yearOneRhythmPanelMarkup,
  prologueJourneySpec,
  commerceJourneySpec,
  dailyIntentBoardMarkup,
  shopVisitPledgeRouteCandidates,
  shopTownErrandButtonsMarkup,
  fireRuinUnlocked,
  questProgress,
  stepProgress,
  stepLabel,
  localize,
  sideQuestVisible,
  activeQinghePondEntryFeedback,
  activeQinghePondProgressFeedback,
  missionCropCodexTaskActionsMarkup,
  configuredTriggerReady,
  triggerReadable,
  conditionLabel,
  sideQuestActionLabel,
  sideQuestRouteActionLabel,
  baizhiQuestId,
}) {
  refs.missionPanel.innerHTML = "";
  const storyVisit = activeStoryVisitFeedback();
  const opening = syncShopOpeningState();
  const shopVisitPledge = shopVisitPledgeDisplaySpec(opening);
  const shopTownErrand = shopTownErrandDisplaySpec(opening);
  const shopWordOfMouthVisit = opening.lastSession?.day === state.day
    ? opening.lastSession.shopWordOfMouthVisit || null
    : shopWordOfMouthVisitLeadSpec(shopWordOfMouthDisplaySpec());
  const baizhiStage = activeBaizhiQuestStageFeedback();
  const chapterFinishHint = baizhiChapterFinishPanelHint();
  const herbValleyHint = chapterFinishHint ? null : herbValleyUnlockPanelHint();
  const spiritManorHint = spiritManorPanelHint();
  const chapter3TradeHint = chapter3TradePanelHint();
  const chapter4DroughtHint = chapter4DroughtPanelHint();
  const missionCropRow = missionCropCodexRowByKey("quest_crop_qinghe_luzhu_qin");
  const baizhiQuestHintActive = baizhiQuestGuidanceActive();
  const baizhiQuestHint = baizhiQuestGuidanceSpec();
  const mainHeader = document.createElement("div");
  const completedMain = data.quests.filter((quest) => state.missionDone.has(quest.quest_id)).length;
  mainHeader.className = "mission-summary";
  mainHeader.innerHTML = `<strong>主线任务书 ${completedMain}/${data.quests.length}</strong><span>读取 quest_base.csv 与 quest_step.csv，当前 Demo 会自动推进前几段主线。</span>`;
  refs.missionPanel.append(mainHeader);

  const compass = mainStoryCompassSpec();
  const compassNode = document.createElement("div");
  compassNode.className = `mission-story-compass ${compass.mainComplete ? "complete" : "active"}`;
  const compassActionLabel = storyCompassActionLabel(compass.nextStep, compass.mainComplete);
  const roadmapMarkup = mainStoryChapterRoadmapMarkup(mainStoryChapterRoadmapSpec(compass));
  compassNode.innerHTML = `
    <div class="mission-story-compass-head">
      <strong>${compass.chapterLabel}</strong>
      <span>主线进度 ${compass.progressLabel} · ${compass.promise}</span>
    </div>
    <div class="mission-story-compass-track">
      ${compass.chapters.map((chapter) => `
        <span class="${chapter.stateClass}">
          <b>${chapter.shortTitle}</b>
          <small>${chapter.doneCount}/${chapter.total}</small>
        </span>
      `).join("")}
    </div>
    ${roadmapMarkup}
    <div class="mission-story-compass-focus">
      <strong>${compass.focusQuest ? `当前焦点：${questTitle(compass.focusQuest)}` : "当前焦点：等待主线开卷"}</strong>
      <span>${compass.focusQuest ? `${npcName(compass.focusQuest.issuer_id)} · 第 ${compass.focusQuest.chapter} 章 · 任务 ${compass.focusProgress.done}/${compass.focusProgress.total} 步` : "先完成序章清荒与播种，任务书会自动亮起。"}</span>
      <small>下一步：${compass.nextStepText}</small>
      <small>明日建议：${compass.advice}</small>
      <button type="button" data-story-compass-action="next">${compassActionLabel}</button>
    </div>
  `;
  refs.missionPanel.append(compassNode);

  const fullClearEvidence = mainStoryFullClearMarkup(mainStoryFullClearSpec(compass));
  const fullClearNode = document.createElement("div");
  fullClearNode.innerHTML = fullClearEvidence;
  refs.missionPanel.append(fullClearNode.firstElementChild);

  const yearOneRhythmMarkup = yearOneRhythmPanelMarkup();
  if (yearOneRhythmMarkup) {
    const rhythmNode = document.createElement("div");
    rhythmNode.innerHTML = yearOneRhythmMarkup;
    refs.missionPanel.append(rhythmNode.firstElementChild);
  }

  const prologueJourney = prologueJourneySpec();
  if (prologueJourney.visible) {
    const prologueNode = document.createElement("div");
    const prologueClass = prologueJourney.doneCount >= prologueJourney.total
      ? "done"
      : prologueJourney.active?.live
        ? "story-live"
        : "active";
    prologueNode.className = `mission-card prologue-journey ${prologueClass}`;
    prologueNode.innerHTML = `
      <strong>序章路标 ${prologueJourney.doneCount}/${prologueJourney.total}</strong>
      <span>${prologueJourney.headline}</span>
      <div class="prologue-journey-track">
        ${prologueJourney.rows.map((row) => `
          <span class="prologue-journey-step ${row.stateClass}" data-prologue-pace="${row.paceId}">
            <b>${row.phase}</b>
            <small>${row.label} · ${row.timeMin} 分钟</small>
            <em>${(row.live ? row.instant : row.note).slice(0, 26)}</em>
          </span>
        `).join("")}
      </div>
      <small>世界留痕：${prologueJourney.worldPromise}</small>
      ${prologueJourney.active ? `<small>当前一拍：${prologueJourney.active.beat} → ${prologueJourney.active.instant}</small>` : ""}
    `;
    refs.missionPanel.append(prologueNode);
  }

  const commerceJourney = commerceJourneySpec();
  if (commerceJourney.visible) {
    const commerceNode = document.createElement("div");
    const commerceClass = commerceJourney.doneCount >= commerceJourney.total
      ? "done"
      : commerceJourney.active?.live
        ? "story-live"
        : "active";
    commerceNode.className = `mission-card commerce-journey ${commerceClass}`;
    commerceNode.innerHTML = `
      <strong>经营路标 ${commerceJourney.doneCount}/${commerceJourney.total}</strong>
      <span>${commerceJourney.headline}</span>
      <div class="commerce-journey-track">
        ${commerceJourney.rows.map((row) => `
          <span class="commerce-journey-step ${row.stateClass}" data-commerce-pace="${row.paceId}">
            <b>${row.phase}</b>
            <small>${row.label} · ${row.timeMin} 分钟</small>
            <em>${(row.live ? row.instant : row.note).slice(0, 28)}</em>
          </span>
        `).join("")}
      </div>
      <small>经营留痕：${commerceJourney.worldPromise}</small>
      ${commerceJourney.active ? `<small>当前一拍：${commerceJourney.active.beat} → ${commerceJourney.active.instant}</small>` : ""}
    `;
    refs.missionPanel.append(commerceNode);
  }

  const dailyIntentNode = document.createElement("div");
  dailyIntentNode.innerHTML = dailyIntentBoardMarkup();
  refs.missionPanel.append(dailyIntentNode.firstElementChild);

  if (shopVisitPledge) {
    const route = shopVisitPledgeRouteCandidates(shopVisitPledge)[0] || null;
    const visitNode = document.createElement("div");
    visitNode.className = "mission-card story-live";
    visitNode.innerHTML = `
      <strong>铺前来帖小约：${shopVisitPledge.customerLabel}</strong>
      <span>${shopVisitPledge.statusLabel} · ${shopVisitPledge.targetItemName || shopVisitPledge.hotTagLabel || "对口货"} · ${shopVisitPledge.note}</span>
      <small>${shopVisitPledge.resultText || shopVisitPledge.detail} · ${shopVisitPledge.cta}</small>
      ${route ? `<button type="button" data-shop-restock-route="${route.action}" data-shop-restock-recipe="${route.recipeId || ""}" data-shop-restock-seed="${route.seedId || ""}" data-shop-restock-tag="${route.shopTag || ""}" data-shop-restock-item="${route.itemId || shopVisitPledge.targetItemId || ""}">${route.action === "recipe" ? "看配方" : route.action === "seed" ? "看种子" : "看旧铺货签"}</button>` : ""}
    `;
    refs.missionPanel.append(visitNode);
  }

  if (shopTownErrand) {
    const visitNode = document.createElement("div");
    visitNode.className = `mission-card story-live ${shopTownErrand.ready ? "story-visit-feedback" : ""}`;
    visitNode.innerHTML = `
      <strong>镇上捎话：${shopTownErrand.npcLabel}</strong>
      <span>${shopTownErrand.statusLabel} · ${shopTownErrand.areaLabel} · ${shopTownErrand.requestItemName} ${shopTownErrand.have}/${shopTownErrand.count}</span>
      <small>${shopTownErrand.resultText || shopTownErrand.detail} · ${shopTownErrand.note}</small>
      ${shopTownErrandButtonsMarkup(shopTownErrand, { includeFocus: true })}
    `;
    refs.missionPanel.append(visitNode);
  }

  if (shopWordOfMouthVisit) {
    const visitNode = document.createElement("div");
    visitNode.className = "mission-card story-live";
    visitNode.innerHTML = `
      <strong>${shopWordOfMouthVisit.title}：${shopWordOfMouthVisit.customerLabel}</strong>
      <span>${shopWordOfMouthVisit.preview ? "明日来认门" : shopWordOfMouthVisit.appeared ? "今日已到门前" : "今日口碑来客"} · ${shopWordOfMouthVisit.leadItemName || shopWordOfMouthVisit.hotTagLabel || "对口货"}</span>
      <small>${shopWordOfMouthVisit.appeared ? shopWordOfMouthVisit.resultText || shopWordOfMouthVisit.detail : shopWordOfMouthVisit.detail} · ${shopWordOfMouthVisit.cta}</small>
    `;
    refs.missionPanel.append(visitNode);
  }

  if (storyVisit) {
    const visitNode = document.createElement("div");
    visitNode.className = "mission-card story-visit-feedback";
    visitNode.innerHTML = `
      <strong>${storyVisit.title}：${storyVisit.questLabel}</strong>
      <span>${storyVisit.npcLabel} · ${storyVisit.areaText} · ${storyVisit.orderTitle}</span>
      <small>${storyVisit.detail} 奖励预览 ${storyVisit.rewardPreview} · ${storyVisit.cta}</small>
    `;
    refs.missionPanel.append(visitNode);
  }

  if (baizhiStage) {
    const stageNode = document.createElement("div");
    stageNode.className = "mission-card story-live";
    stageNode.innerHTML = `
      <strong>${baizhiStage.title}：${baizhiStage.headline}</strong>
      <span>${baizhiStage.detail}</span>
      <small>${baizhiStage.cta} · 奖励预览 ${baizhiStage.rewardPreview}</small>
    `;
    refs.missionPanel.append(stageNode);
  }

  if (herbValleyHint) {
    const valleyNode = document.createElement("div");
    valleyNode.className = "mission-card story-live herb-valley-live";
    valleyNode.innerHTML = `
      <strong>${herbValleyHint.title}：${herbValleyHint.headline}</strong>
      <span>${herbValleyHint.detail}</span>
      <small>${herbValleyHint.cta}</small>
    `;
    refs.missionPanel.append(valleyNode);
  }

  if (chapterFinishHint) {
    const finishNode = document.createElement("div");
    finishNode.className = "mission-card story-live herb-valley-live";
    finishNode.innerHTML = `
      <strong>${chapterFinishHint.title}：${chapterFinishHint.headline}</strong>
      <span>${chapterFinishHint.detail}</span>
      <small>${chapterFinishHint.rewardHint} · ${chapterFinishHint.cta}</small>
    `;
    refs.missionPanel.append(finishNode);
  }

  if (spiritManorHint) {
    const manorNode = document.createElement("div");
    manorNode.className = "mission-card story-live spirit-manor-live";
    manorNode.innerHTML = `
      <strong>${spiritManorHint.title}：${spiritManorHint.headline}</strong>
      <span>${spiritManorHint.detail}</span>
      <small>${spiritManorHint.cta} · ${spiritManorHint.rewardHint}</small>
    `;
    refs.missionPanel.append(manorNode);
  }

  if (chapter3TradeHint) {
    const tradeNode = document.createElement("div");
    tradeNode.className = `mission-card story-live ${fireRuinUnlocked() ? "herb-valley-live" : "spirit-manor-live"}`;
    tradeNode.innerHTML = `
      <strong>${chapter3TradeHint.title}：${chapter3TradeHint.headline}</strong>
      <span>${chapter3TradeHint.detail}</span>
      <small>${chapter3TradeHint.cta} · ${chapter3TradeHint.rewardHint}</small>
    `;
    refs.missionPanel.append(tradeNode);
  }

  if (chapter4DroughtHint) {
    const droughtNode = document.createElement("div");
    droughtNode.className = "mission-card story-live herb-valley-live";
    droughtNode.innerHTML = `
      <strong>${chapter4DroughtHint.title}：${chapter4DroughtHint.headline}</strong>
      <span>${chapter4DroughtHint.detail}</span>
      <small>${chapter4DroughtHint.cta} · ${chapter4DroughtHint.rewardHint}</small>
    `;
    refs.missionPanel.append(droughtNode);
  }

  const visibleMainQuests = data.quests.filter((quest, index) =>
    index < 6
      || state.missionDone.has(quest.quest_id)
      || state.completed.has(quest.quest_id)
      || quest.quest_id === spiritManorHint?.questId
      || quest.quest_id === chapter3TradeHint?.questId
      || quest.quest_id === chapter4DroughtHint?.questId,
  );
  for (const quest of visibleMainQuests) {
    const done = state.missionDone.has(quest.quest_id);
    const rewardClaimed = state.claimedQuestRewards.has(quest.quest_id);
    const progress = questProgress(quest);
    const nextStep = progress.steps.find((step) => stepProgress(step) < Number(step.target_count || 1));
    const liveStoryQuest = storyVisit?.questId === quest.quest_id ? storyVisit : null;
    const liveBaizhiStage = baizhiStage?.questId === quest.quest_id ? baizhiStage : null;
    const liveHerbValley = herbValleyHint?.questId === quest.quest_id ? herbValleyHint : null;
    const liveBaizhiFinish = chapterFinishHint?.questId === quest.quest_id ? chapterFinishHint : null;
    const liveSpiritManor = spiritManorHint?.questId === quest.quest_id ? spiritManorHint : null;
    const liveChapter3Trade = chapter3TradeHint?.questId === quest.quest_id ? chapter3TradeHint : null;
    const liveChapter4Drought = chapter4DroughtHint?.questId === quest.quest_id ? chapter4DroughtHint : null;
    const hintedStoryQuest = quest.quest_id === baizhiQuestId && baizhiQuestHintActive;
    const card = document.createElement("div");
    card.className = `mission-card${done ? " done" : ""}${liveStoryQuest || hintedStoryQuest || liveBaizhiStage || liveHerbValley || liveBaizhiFinish || liveSpiritManor || liveChapter3Trade || liveChapter4Drought ? " story-live" : ""}`;
    card.dataset.mainQuestId = quest.quest_id;
    card.innerHTML = `
      <strong>${questTitle(quest)}${done ? " · 已完成" : ""}${rewardClaimed ? " · 奖励已领" : ""}</strong>
      ${localize(`${quest.quest_id}_desc`, quest.quest_type === "main" ? "主线任务步骤来自配置表，正式版会逐步接入完整触发与奖励。" : "任务说明待本地化")}
      ${liveStoryQuest || liveBaizhiStage || liveHerbValley || liveBaizhiFinish || liveSpiritManor || liveChapter3Trade || liveChapter4Drought || hintedStoryQuest ? `<span class="mission-live-clue">${liveStoryQuest ? `${liveStoryQuest.title}：${liveStoryQuest.detail}` : liveBaizhiStage ? `${liveBaizhiStage.title}：${liveBaizhiStage.detail}` : liveHerbValley ? `${liveHerbValley.title}：${liveHerbValley.detail}` : liveBaizhiFinish ? `${liveBaizhiFinish.title}：${liveBaizhiFinish.detail}` : liveSpiritManor ? `${liveSpiritManor.title}：${liveSpiritManor.detail}` : liveChapter3Trade ? `${liveChapter3Trade.title}：${liveChapter3Trade.detail}` : liveChapter4Drought ? `${liveChapter4Drought.title}：${liveChapter4Drought.detail}` : baizhiQuestHint?.mission || "线索已亮：白芷已经注意到你能稳定做出干净稳当的灵植产出，去医馆谈谈铁皮石斛委托。"}</span>` : ""}
      <small>${npcName(quest.issuer_id)} · 第 ${quest.chapter} 章 · ${progress.done}/${progress.total} 步${nextStep ? ` · 下一步：${stepLabel(nextStep)}` : ""} · 奖励池 ${quest.complete_reward_group}${liveStoryQuest || liveBaizhiStage || liveHerbValley || liveBaizhiFinish || liveSpiritManor || liveChapter3Trade || liveChapter4Drought || hintedStoryQuest ? ` · 奖励预览 ${liveStoryQuest?.rewardPreview || liveBaizhiStage?.rewardPreview || liveSpiritManor?.rewardHint || liveChapter3Trade?.rewardHint || liveChapter4Drought?.rewardHint || "高级药园配方"}` : ""}${hintedStoryQuest && baizhiQuestHint ? ` · ${baizhiQuestHint.progress}` : ""}${liveBaizhiStage ? ` · ${liveBaizhiStage.cta}` : ""}${liveHerbValley ? ` · ${liveHerbValley.cta}` : ""}${liveBaizhiFinish ? ` · ${liveBaizhiFinish.cta}` : ""}${liveSpiritManor ? ` · ${liveSpiritManor.cta}` : ""}${liveChapter3Trade ? ` · ${liveChapter3Trade.cta}` : ""}${liveChapter4Drought ? ` · ${liveChapter4Drought.cta}` : ""}</small>
    `;
    refs.missionPanel.append(card);
  }

  const sideHeader = document.createElement("div");
  const visibleSide = data.sideQuests
    .filter(sideQuestVisible)
    .slice()
    .sort((a, b) => {
      const activeDelta = Number(state.activeSideQuests.has(b.quest_id)) - Number(state.activeSideQuests.has(a.quest_id));
      if (activeDelta !== 0) return activeDelta;
      return Number(b.priority || 0) - Number(a.priority || 0);
    });
  sideHeader.className = "mission-summary side";
  sideHeader.innerHTML = `<strong>支线触发线索 ${visibleSide.length}/${data.sideQuests.length}</strong><span>读取 side_quest_base.csv、side_quest_step.csv 与 side_quest_event_trigger.csv。</span>`;
  refs.missionPanel.append(sideHeader);

  const qinghePondEntry = activeQinghePondEntryFeedback();
  const qinghePondProgress = activeQinghePondProgressFeedback();
  if (qinghePondEntry) {
    const node = document.createElement("div");
    node.className = "mission-card side qinghe-pond-entry live-clue";
    node.innerHTML = `
      <strong>${qinghePondEntry.label}：${qinghePondEntry.questTitle}</strong>
      <span>${qinghePondEntry.statusText}</span>
      <small>${qinghePondEntry.firstStepText} · ${qinghePondEntry.secondStepText} · 奖励 ${qinghePondEntry.rewardText}</small>
    `;
    refs.missionPanel.append(node);
  }

  if (qinghePondProgress) {
    const node = document.createElement("div");
    node.className = `mission-card side qinghe-pond-progress live-clue ${qinghePondProgress.phase}`;
    node.innerHTML = `
      <strong>${qinghePondProgress.label}：${qinghePondProgress.title}</strong>
      <span>${qinghePondProgress.detail}</span>
      <small>${qinghePondProgress.rewardText} · ${qinghePondProgress.nextAdvice}</small>
      <small>灵池水鲜进度：${qinghePondProgress.routeText}</small>
      ${missionCropCodexTaskActionsMarkup(missionCropRow)}
    `;
    refs.missionPanel.append(node);
  }

  if (state.sideQuestFeedback) {
    const feedback = state.sideQuestFeedback;
    const node = document.createElement("div");
    node.className = `mission-card side side-quest-feedback ${feedback.phase}`;
    node.innerHTML = `
      <strong>${feedback.phaseLabel}：${feedback.title}</strong>
      <span>${feedback.npcLabel} · ${feedback.areaText} · ${feedback.progressText}</span>
      <small>${feedback.stepText} · ${feedback.hint}</small>
    `;
    refs.missionPanel.append(node);
  }

  for (const quest of visibleSide.slice(0, 4)) {
    const progress = questProgress(quest, true);
    const trigger = (data.sideQuestTriggersByQuest.get(quest.quest_id) || [])[0];
    const triggerStatus = trigger ? configuredTriggerReady(trigger) : { ready: true };
    const accepted = state.activeSideQuests.has(quest.quest_id) || quest.auto_accept === "true";
    const rewardClaimed = state.claimedQuestRewards.has(quest.quest_id);
    const liveFeedback = state.sideQuestFeedback?.questId === quest.quest_id ? state.sideQuestFeedback : null;
    const card = document.createElement("div");
    card.className = `mission-card side ${progress.done === progress.total && progress.total > 0 ? "done" : accepted || triggerStatus.ready ? "ready" : ""} ${liveFeedback ? "live-clue" : ""}`;
    card.dataset.sideQuestId = quest.quest_id;
    card.innerHTML = `
      <strong>${questTitle(quest)}${accepted ? " · 已承接" : triggerStatus.ready ? " · 可触发" : " · 线索未满足"}${rewardClaimed ? " · 奖励已领" : ""}</strong>
      ${trigger ? triggerReadable(trigger) : "自动承接支线"}
      ${liveFeedback ? `<span class="mission-live-clue">${liveFeedback.phaseLabel}：${liveFeedback.stepText}</span>` : ""}
      <small>${npcName(quest.issuer_id)} · ${quest.quest_type} · ${progress.done}/${progress.total} 步${progress.steps[0] ? ` · ${stepLabel(progress.steps[0])}` : ""}${trigger ? ` · 条件 ${conditionLabel(trigger.condition_group)}` : ""} · 奖励池 ${quest.complete_reward_group}</small>
      <div class="mission-side-actions">
        <button type="button" data-side-quest-action="${quest.quest_id}" ${rewardClaimed || (!accepted && !triggerStatus.ready) ? "disabled" : ""}>${rewardClaimed ? "已领取" : sideQuestActionLabel(quest)}</button>
        <button type="button" data-side-quest-route="${quest.quest_id}" ${rewardClaimed || (!accepted && !triggerStatus.ready) ? "disabled" : ""}>${sideQuestRouteActionLabel(quest)}</button>
      </div>
      ${quest.quest_id === missionCropRow?.questId ? missionCropCodexTaskActionsMarkup(missionCropRow) : ""}
    `;
    refs.missionPanel.append(card);
  }
}
