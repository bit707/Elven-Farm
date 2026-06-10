export function renderGoalBookPanelUi({
  refs,
  state,
  data,
  uiPressureReliefMarkup,
  dailyIntentJournalRows,
  dailyIntentTrendMarkup,
  solarTermMoodStampArchiveSpec,
  solarTermMoodStampArchiveMarkup,
  careChainJournalRows,
  normalizeCareChainState,
  year2Unlocked,
  year2OpeningTenDayMarkup,
  year2TodayRecommendationMarkup,
  recommendedYear2Goals,
  year2GoalUnlocked,
  year2GoalReady,
  year2GoalClaimed,
  year2GoalProgress,
  year2GoalRewardText,
  year2GoalTitle,
  year2GoalPriorityScore,
  year2FirstWeekStatus,
  syncGoalBookState,
  metricProgress,
  rewardPoolEntries,
  applyRewardEntryPreview,
  freeplayPanelGuideMarkup,
  freeplayGoalGuidanceSpec,
  freeplayGoalUnlocked,
  freeplayGoalReady,
  freeplayGoalClaimed,
  postMainlineTenHourGoalMarkup,
  postMainlineRhythmMarkup,
  finalBanquetAfterwordBridgeMarkup,
  earlyRewardCadenceAuditMarkup,
  earlyRewardDone,
  syncFailureCodexState,
  failureCodexRows,
  failureCodexTypeLabel,
  failureLearningTriptychSpec,
  failureLearningTriptychMarkup,
  syncEcologyDailyState,
  ecologyCourtyardSummary,
  ecologyCourtyardGoalRows,
  ecologyDailyMemoryRows,
  ecologyInspectionMemoryRows,
  ecologyInspectionConfirmRows,
  ecologyDailyMemoryResonanceSnapshot,
  ecologyDailyMemoryResonanceText,
  dungeonCompendiumProgress,
  dungeonCompendiumMemoryPages,
  dungeonCompendiumEntrySummary,
  dungeonDayEchoArchiveRows,
  dungeonDayEchoArchiveScrollMarkup,
  missionCropCodexRows,
  missionCropCodexGoalActionsMarkup,
  rareSpiritLifeCodexRows,
  currentLifeCodexFilterId,
  lifeCodexFilterMatches,
  rareSpiritCharacterShowcaseSpec,
  rareSpiritCharacterShowcaseMarkup,
  rareSpiritLifeSnapshot,
  rareSpiritLifeSnapshotMarkup,
  rareSpiritActionPromenadeSpec,
  rareSpiritActionPromenadeMarkup,
  rareSpiritClueTrackerRows,
  rareSpiritEventReady,
  rareSpiritEventDone,
  rareSpiritEventRewardText,
  rareSpiritClueForEvent,
  rareSpiritLineId,
  rareSpiritMomentForSpirit,
  rareSpiritTheaterArchiveEntries,
  spiritEventGoalRows,
  spiritEventStageLabel,
  spiritLine,
  spiritJobGoalRows,
  spiritJobProgress,
  spiritJobGoalReady,
  spiritJobGoalClaimed,
  spiritJobGoalRewardText,
  spiritJobTaskReady,
  spiritJobTaskText,
  spiritJobTaskRewardText,
  spiritJobTaskPersistentEffectText,
  spiritFinaleEffectSummary,
  spiritFinaleEffectRows,
  spiritFinaleEffectCompactText,
  shopCrowdHeatUiSpec,
  syncShopOpeningState,
  conditionTarget,
  conditionLabel,
  areaName,
  orderTitle,
  itemName,
  jobName,
  localize,
  selectorDataValue,
  seasonalCropGuideKeyForTermId,
  currentTermId,
}) {
  refs.goalBookPanel.innerHTML = "";

  const uiPressureMarkup = uiPressureReliefMarkup();
  if (uiPressureMarkup) {
    const uiPressureNode = document.createElement("div");
    uiPressureNode.innerHTML = uiPressureMarkup.trim();
    refs.goalBookPanel.append(uiPressureNode.firstElementChild);
  }

  const intentJournalRows = dailyIntentJournalRows(3);
  const intentJournalActive = intentJournalRows.some((row) => row.score > 0);
  const intentJournalHeader = document.createElement("div");
  intentJournalHeader.className = `goal-summary ${intentJournalActive ? "pass" : "active"}`;
  intentJournalHeader.innerHTML = `<strong>每日主轴手账 ${intentJournalRows.filter((row) => row.score > 0).length}/3</strong><span>回看最近几天真正推进的是赚钱、建设、探索、关系还是稳田，让日常经营形成连续路线。</span>`;
  refs.goalBookPanel.append(intentJournalHeader);
  const trendNode = document.createElement("div");
  trendNode.innerHTML = dailyIntentTrendMarkup();
  refs.goalBookPanel.append(trendNode.firstElementChild);

  const solarMoodStampSpec = solarTermMoodStampArchiveSpec(6);
  const solarMoodStampHeader = document.createElement("div");
  solarMoodStampHeader.className = `goal-summary ${solarMoodStampSpec.stateClass === "done" ? "pass" : "active"}`;
  solarMoodStampHeader.innerHTML = `<strong>${solarMoodStampSpec.title}</strong><span>把今日画境合图印收进目标册，形成节气、天气、田地、旧铺、精怪和风险的长期收藏线。</span>`;
  refs.goalBookPanel.append(solarMoodStampHeader);
  const solarMoodStampMarkup = solarTermMoodStampArchiveMarkup(solarMoodStampSpec);
  if (solarMoodStampMarkup) {
    const solarMoodStampNode = document.createElement("div");
    solarMoodStampNode.innerHTML = solarMoodStampMarkup.trim();
    refs.goalBookPanel.append(solarMoodStampNode.firstElementChild);
  }

  const careChainJournal = careChainJournalRows(4);
  const careChainState = normalizeCareChainState(state.careChainState);
  const careChainHeader = document.createElement("div");
  careChainHeader.className = `goal-summary ${careChainJournal.length > 0 ? "pass" : "active"}`;
  careChainHeader.innerHTML = `<strong>洞天照应札记 ${careChainJournal.length}/4</strong><span>记录田地、精怪和旧铺连续照应的阶段事件；当前连续 ${careChainState.streak} 日，最佳 ${careChainState.bestStreak} 日。</span>`;
  refs.goalBookPanel.append(careChainHeader);
  if (careChainJournal.length === 0) {
    const emptyCareJournal = document.createElement("div");
    emptyCareJournal.className = "goal-card care-chain-journal pending";
    emptyCareJournal.innerHTML = `<strong>照应札记还没落页</strong><span>让田里成长、精怪岗位和旧铺门口至少两端在同一天接上，入夜后这里会留下第一笔照应。</span><small>提示：连续三日会触发阶段事件，并写进这本札记。</small><button type="button" data-care-chain-journal-event="">先续一条照应</button>`;
    refs.goalBookPanel.append(emptyCareJournal);
  } else {
    for (const row of careChainJournal) {
      const node = document.createElement("div");
      node.className = `goal-card care-chain-journal ${row.stateClass} ${row.type}`;
      node.innerHTML = `
        <strong>第 ${row.day} 天 · ${row.title}</strong>
        <span>${row.headline}</span>
        <small>${row.detail}</small>
        <small>${row.rewardText}</small>
        <button type="button" data-care-chain-journal-event="${row.eventId || ""}">${row.cta}</button>
      `;
      refs.goalBookPanel.append(node);
    }
  }
  if (!intentJournalActive) {
    const emptyIntentJournal = document.createElement("div");
    emptyIntentJournal.className = "goal-card daily-intent-journal pending";
    emptyIntentJournal.innerHTML = `<strong>今日主轴尚未落笔</strong><span>从每日三选目标里挑一个方向，完成任意行动后，这里会写下今日主轴、足迹和阶段。</span><small>提示：连续推进同一方向可触发起势、连势、成势奖励。</small><button type="button" data-daily-intent-journal-action="continue" data-daily-intent-journal-key="field">从今日稳田开始</button>`;
    refs.goalBookPanel.append(emptyIntentJournal);
  } else {
    for (const row of intentJournalRows) {
      const node = document.createElement("div");
      node.className = `goal-card daily-intent-journal ${row.score > 0 ? "done" : "pending"} ${row.tone}`;
      node.innerHTML = `
        <strong>第 ${row.day} 天 · ${row.title} · ${row.milestoneLabel}</strong>
        <span>${row.label} ${row.score} 点 · 足迹 ${row.count} 条</span>
        <small>${row.details.length ? row.details.join("；") : "这一天还没有留下明确足迹。"}</small>
        <button type="button" data-daily-intent-journal-action="continue" data-daily-intent-journal-key="${row.intent}">续走这条线</button>
        <button type="button" data-daily-intent-journal-action="weak" data-daily-intent-journal-key="${row.intent}">换线补短板</button>
      `;
      refs.goalBookPanel.append(node);
    }
  }

  const earlyHeader = document.createElement("div");
  const earlyDone = data.earlyRewardPacing.filter(earlyRewardDone).length;
  earlyHeader.className = `goal-summary ${earlyDone >= Math.min(10, data.earlyRewardPacing.length) ? "pass" : "active"}`;
  earlyHeader.innerHTML = `<strong>前三小时正反馈 ${earlyDone}/${data.earlyRewardPacing.length}</strong><span>把清理、播种、成精、加工、开铺、修复做成连续奖励节奏。</span>`;
  refs.goalBookPanel.append(earlyHeader);
  const cadenceMarkup = earlyRewardCadenceAuditMarkup();
  if (cadenceMarkup) {
    const cadenceNode = document.createElement("div");
    cadenceNode.innerHTML = cadenceMarkup.trim();
    refs.goalBookPanel.append(cadenceNode.firstElementChild);
  }

  for (const pace of data.earlyRewardPacing.slice(0, 10)) {
    const done = earlyRewardDone(pace);
    const live = state.earlyRewardFeedback?.paceId === pace.pace_id;
    const node = document.createElement("div");
    node.className = `goal-card ${done ? "done" : "pending"} ${live ? "live" : ""}`;
    node.innerHTML = `
      <strong>${pace.phase} · ${pace.time_min} 分钟</strong>
      <span>${pace.player_action} → ${pace.instant_feedback}</span>
      <small>${live ? `刚触发：${pace.delayed_feedback || pace.success_metric}` : done ? "已在当前 Demo 中触发" : `后续反馈：${pace.delayed_feedback || pace.success_metric}`}</small>
    `;
    refs.goalBookPanel.append(node);
  }

  const shopOpening = syncShopOpeningState();
  const shopCrowdRows = (shopOpening.history.length > 0 ? shopOpening.history : shopOpening.lastSession ? [shopOpening.lastSession] : [])
    .map((entry) => ({ entry, heat: shopCrowdHeatUiSpec(entry.liveFocus) }))
    .filter((row) => row.heat.active)
    .slice(0, 3);
  const shopCrowdHeader = document.createElement("div");
  shopCrowdHeader.className = `goal-summary ${shopCrowdRows.length > 0 ? "pass" : "active"}`;
  shopCrowdHeader.innerHTML = `<strong>旧铺门口热度回看 ${shopCrowdRows.length}/3</strong><span>把开铺后的排队、围观、热卖牌和犹豫离店写成复盘，帮助下一次陈列更像真正经营。</span>`;
  refs.goalBookPanel.append(shopCrowdHeader);
  if (shopCrowdRows.length === 0) {
    const emptyShopCrowd = document.createElement("div");
    emptyShopCrowd.className = "goal-card shop-crowd-memory pending";
    emptyShopCrowd.innerHTML = `<strong>旧铺还没有门口热度记录</strong><span>完成一次开铺后，门口排队、围观与热卖牌会写到这里。</span><small>提示：先准备一件标签明确的作物或加工品，再开铺测试第一批顾客。</small>`;
    refs.goalBookPanel.append(emptyShopCrowd);
  } else {
    for (const row of shopCrowdRows) {
      const focus = row.entry.liveFocus || {};
      const node = document.createElement("div");
      node.className = `goal-card shop-crowd-memory ${row.heat.stateClass === "warn" ? "pending" : "done"}`;
      node.innerHTML = `
        <strong>第 ${row.entry.day || state.day} 天 · ${row.heat.title}</strong>
        <span>${row.heat.headline} · ${row.heat.queueText}</span>
        <small>成交 ${focus.buyers || 0} · 犹豫离店 ${focus.leavers || 0} · 主题 ${focus.themeScore || 0}% · ${row.heat.mood}</small>
        <small>掌柜建议：${row.heat.nextAction}</small>
      `;
      refs.goalBookPanel.append(node);
    }
  }

  const failureCodex = syncFailureCodexState();
  const failureRows = failureCodexRows(4);
  const failureHeader = document.createElement("div");
  failureHeader.className = `goal-summary ${failureRows.length > 0 ? "pass" : "active"}`;
  failureHeader.innerHTML = `<strong>失败见闻册 ${failureCodex.total}/${Math.max(4, failureRows.length)} · 最近 ${failureRows.length}</strong><span>把订单缺口、旧铺差评、节气风险、秘境失利和商队险路变成可回看的学习与托底反馈。</span>`;
  refs.goalBookPanel.append(failureHeader);
  const failureTriptych = failureLearningTriptychMarkup(failureLearningTriptychSpec(failureRows, failureCodex));
  if (failureTriptych) {
    const triptychNode = document.createElement("div");
    triptychNode.innerHTML = failureTriptych;
    refs.goalBookPanel.append(triptychNode.firstElementChild);
  }
  if (failureRows.length === 0) {
    const emptyFailure = document.createElement("div");
    emptyFailure.className = "goal-card failure-codex-card pending";
    emptyFailure.innerHTML = `<strong>还没有失败见闻</strong><span>遇到订单缺口、旧铺补救、风险失守、秘境撤退或商队险路时，这里会记录原因、托底和下一步。</span><small>这不是惩罚册，是掌柜和洞天一起学会“下次怎么更稳”的账页。</small>`;
    refs.goalBookPanel.append(emptyFailure);
  } else {
    for (const entry of failureRows) {
      const node = document.createElement("div");
      node.className = `goal-card failure-codex-card ${entry.tone === "boss" ? "boss" : entry.tone === "support" ? "ready" : "done"}`;
      node.innerHTML = `
        <strong>${entry.icon} ${failureCodexTypeLabel(entry.type)} · ${entry.title}</strong>
        <span>${entry.headline}</span>
        ${entry.problem ? `<small>原因：${entry.problem}</small>` : ""}
        ${entry.insight ? `<small>见闻：${entry.insight}</small>` : ""}
        ${entry.nextAction ? `<small>下次：${entry.nextAction}</small>` : ""}
        ${entry.rewardText ? `<small>托底：${entry.rewardText}</small>` : ""}
      `;
      refs.goalBookPanel.append(node);
    }
  }

  syncGoalBookState();
  const isYear2Open = year2Unlocked();
  const year2AllGoals = isYear2Open ? data.year2GoalBook.filter((goal) => year2GoalUnlocked(goal)) : [];
  const year2ReadyCount = year2AllGoals.filter(year2GoalReady).length;
  const year2ClaimedCount = year2AllGoals.filter(year2GoalClaimed).length;
  const year2Header = document.createElement("div");
  year2Header.className = `goal-summary ${year2ReadyCount > 0 ? "pass" : "active"}`;
  year2Header.innerHTML = isYear2Open
    ? `<strong>第二年目标册 ${year2ClaimedCount}/${year2AllGoals.length} · 可领取 ${year2ReadyCount}</strong><span>把今日建议、本周推进、节气主题和长期追求整理成真正能完成的年鉴。</span>`
    : "<strong>第二年目标册 未开卷</strong><span>完成终章决战、重建二十四节气大阵，并亲手收获万年蟠桃后开启。</span>";
  refs.goalBookPanel.append(year2Header);

  const firstWeek = year2FirstWeekStatus();
  const year2Intro = document.createElement("div");
  year2Intro.className = `goal-card ${!isYear2Open ? "locked" : firstWeek.delivered ? "done" : firstWeek.ready ? "ready" : "pending"}`;
  if (isYear2Open) {
    const firstOrder = firstWeek.order;
    let introTitle = "第二年开局：宴后第一周";
    let introBody = "今日建议先接回精怪照料和店铺订单；名铺赛季看评分短板；同住后日谈与跨界商路会逐步把镇民、精怪和外界重新织起来。";
    let introDetail = "蟠桃大宴已经把“通关”变成新的经营起点，接下来追求的是长期陪伴、收藏和造景表达。";
    if (firstOrder && firstWeek.delivered) {
      introTitle = "第二年开局：宴后第一周已跑顺";
      introBody = "第一张名铺礼宴单已经交付，第二年现金流、赛季评分和目标册都接上了。接下来优先看名铺赛季短板，再挑一个今日建议或本周目标继续推进。";
      introDetail = `首周起笔：${orderTitle(firstOrder)} 已完成 · 后续重点转向赛季评分、关系线、收藏与造景表达。`;
    } else if (firstOrder && firstWeek.ready) {
      introBody = `许伯备好的三件套已经齐了，订单板上的“${orderTitle(firstOrder)}”现在就能交。交完这单，第二年经营会正式从宴席余温接成稳定开张。`;
      introDetail = `首周状态：三件套已备齐 · 可立即交付 · 奖励 ${Number(firstOrder.reward_gold || 0)} 灵石 / ${Number(firstOrder.reward_fame || 0)} 声望。`;
    } else if (firstOrder) {
      const missingText = firstWeek.needStatus?.missing.slice(0, 3).join("、") || "礼卷、宴食和灵酿";
      introBody = `第一张第二年名铺单已经压到账台上，还差 ${missingText}。先把这单备齐，第二年目标册和赛季评分才会真正开始滚动起来。`;
      introDetail = `首单：${orderTitle(firstOrder)} · 当前备货 ${firstWeek.needStatus?.readyCount || 0}/${firstWeek.needStatus?.totalCount || 0} · 交付后会把年二节奏正式接上。`;
    } else if (!firstWeek.starterClaimed) {
      introBody = "第二年入口已经亮起，但开局三件套还没到账。先完成蟠桃大宴后的交接，让许伯把首周要用的体面货压到账台上。";
      introDetail = "首周提示：补给到账后，会直接指向第一张名铺礼宴订单。";
    }
    year2Intro.innerHTML = `<strong>${introTitle}</strong><span>${introBody}</span><small>${introDetail}</small>`;
  } else {
    year2Intro.innerHTML = `<strong>还差一场蟠桃大宴</strong><span>当前年鉴先记录前三小时反馈、秘境图鉴、岗位修行和精怪事件；第二年日常、名铺赛季、同住后日谈与自由目标会在主线收束后一起亮起。</span><small>目标：击败噬灵螟母 → 建成终阵 → 种下并收获万年蟠桃。</small>`;
  }
  refs.goalBookPanel.append(year2Intro);

  if (isYear2Open) {
    const finalAfterwordBridgeMarkup = finalBanquetAfterwordBridgeMarkup();
    if (finalAfterwordBridgeMarkup) {
      const finalAfterwordBridgeNode = document.createElement("div");
      finalAfterwordBridgeNode.innerHTML = finalAfterwordBridgeMarkup.trim();
      refs.goalBookPanel.append(finalAfterwordBridgeNode.firstElementChild);
    }
  }

  if (isYear2Open) {
    const year2OpeningMarkup = year2OpeningTenDayMarkup();
    if (year2OpeningMarkup) {
      const year2OpeningNode = document.createElement("div");
      year2OpeningNode.innerHTML = year2OpeningMarkup.trim();
      refs.goalBookPanel.append(year2OpeningNode.firstElementChild);
    }
  }

  if (isYear2Open) {
    const year2RecommendMarkup = year2TodayRecommendationMarkup();
    if (year2RecommendMarkup) {
      const year2RecommendNode = document.createElement("div");
      year2RecommendNode.innerHTML = year2RecommendMarkup.trim();
      refs.goalBookPanel.append(year2RecommendNode.firstElementChild);
    }
  }

  if (isYear2Open) {
    const postMainlineRhythmCard = postMainlineRhythmMarkup();
    if (postMainlineRhythmCard) {
      const postMainlineRhythmNode = document.createElement("div");
      postMainlineRhythmNode.innerHTML = postMainlineRhythmCard.trim();
      refs.goalBookPanel.append(postMainlineRhythmNode.firstElementChild);
    }
  }

  const postMainlineRoute = document.createElement("div");
  postMainlineRoute.innerHTML = postMainlineTenHourGoalMarkup().trim();
  refs.goalBookPanel.append(postMainlineRoute.firstElementChild);

  const compendium = dungeonCompendiumProgress();
  const compendiumHeader = document.createElement("div");
  compendiumHeader.className = `goal-summary ${compendium.unlocked >= Math.max(1, Math.min(3, compendium.total)) ? "pass" : "active"}`;
  const seasonalGuideFocusKey = seasonalCropGuideKeyForTermId(currentTermId()) || "seasonal_crop_guyu_chaya";
  compendiumHeader.innerHTML = `<strong>秘境图鉴 ${compendium.unlocked}/${compendium.total} · 通关印记 ${compendium.cleared}</strong><span>节气印记会反馈到年轮试炼与长期收藏；碎片攒满 3 枚即可先拼成图鉴印记。</span><button type="button" class="solar-mood-stamp-guide" data-seasonal-crop-guide-focus="${seasonalGuideFocusKey}" data-seasonal-crop-guide-source="stamp">看节气作物导览</button>`;
  refs.goalBookPanel.append(compendiumHeader);

  if (compendium.entries.length > 0) {
    for (const entry of compendium.entries.slice(0, 4)) {
      const summary = dungeonCompendiumEntrySummary(entry);
      const node = document.createElement("div");
      node.className = `goal-card ${summary?.state === "done" ? "done" : summary?.state === "ready" ? "ready" : "pending"}`;
      node.innerHTML = `
        <strong>${summary?.title || entry.stampLabel}</strong>
        <span>${summary?.body || entry.dungeonLabel}</span>
        <small>${summary?.detail || entry.note || "继续探索秘境，补齐这枚节气印记。"}</small>
      `;
      refs.goalBookPanel.append(node);
    }
  }

  const missionCropRows = missionCropCodexRows();
  for (const row of missionCropRows) {
    const node = document.createElement("div");
    node.className = `goal-card mission-crop-codex ${row.stateClass}`;
    node.dataset.missionCropCodex = row.key;
    node.innerHTML = `
      <strong>任务作物图鉴 · ${row.cropName}</strong>
      <span>${row.headline}</span>
      <small><b>来源</b>${row.sourceText}</small>
      <small><b>节气</b>${row.termText}</small>
      <small><b>土层</b>${row.soilText}</small>
      <small><b>照看线索</b>${row.careText}</small>
      <small><b>实际入口</b>${row.taskText}</small>
      ${missionCropCodexGoalActionsMarkup(row)}
      <small class="mission-crop-codex-safe">${row.guideText}</small>
      <small class="mission-crop-codex-safe">${row.taskSafety}</small>
      <small class="mission-crop-codex-safe">${row.npcSafety}</small>
    `;
    refs.goalBookPanel.append(node);
  }

  const dungeonEchoRows = dungeonDayEchoArchiveRows(4);
  const dungeonEchoHeader = document.createElement("div");
  dungeonEchoHeader.className = `goal-summary ${dungeonEchoRows.length > 0 ? "pass" : "active"}`;
  dungeonEchoHeader.innerHTML = `<strong>秘境余烬手账 ${dungeonEchoRows.length}/4</strong><span>把最近秘境探索、撤离、失利或通关后的场规、精怪解法、带回内容和明日路线沉淀成长期可回看的洞天账页。</span>`;
  refs.goalBookPanel.append(dungeonEchoHeader);
  if (dungeonEchoRows.length === 0) {
    const emptyEchoArchive = document.createElement("div");
    emptyEchoArchive.className = "goal-card dungeon-echo-archive pending";
    emptyEchoArchive.innerHTML = `
      <strong>第一条秘境余烬仍待落笔</strong>
      <span>先在秘境里完成一次探索、撤离、失利或通关，入夜后的余烬会自动写进这本手账。</span>
      ${dungeonDayEchoArchiveScrollMarkup(null)}
      <small>这里是回看档案，不会自动进入秘境、探索、顺应节气或挑战 Boss，也不会消耗资源。</small>
      <button type="button" data-dungeon-echo-archive="" data-dungeon-echo-mode="panel">先看秘境入口</button>
    `;
    refs.goalBookPanel.append(emptyEchoArchive);
  } else {
    for (const row of dungeonEchoRows) {
      const stateClass = row.outcome === "clear" ? "done" : row.outcome === "failure" || row.tone === "warn" ? "pending" : "ready";
      const archiveKey = selectorDataValue(row.key);
      const node = document.createElement("div");
      node.className = `goal-card dungeon-echo-archive ${stateClass} ${row.tone || "note"}`;
      node.innerHTML = `
        <strong>第 ${row.day} 天 · ${row.dungeonName} · ${row.outcomeLabel}</strong>
        <span>${row.headline} · ${row.floorText}</span>
        ${dungeonDayEchoArchiveScrollMarkup(row)}
        <small><b>场规</b>${row.fieldRule}</small>
        <small><b>精怪解法</b>${row.solutionText}</small>
        <small><b>带回</b>${row.rewardText}</small>
        <small><b>下一步</b>${row.nextStepText}</small>
        <div class="dungeon-echo-archive-actions">
          <button type="button" data-dungeon-echo-archive="${archiveKey}" data-dungeon-echo-mode="panel">回看余烬</button>
          <button type="button" data-dungeon-echo-archive="${archiveKey}" data-dungeon-echo-mode="route">定位三联牌</button>
          <button type="button" data-dungeon-echo-archive="${archiveKey}" data-dungeon-echo-mode="memory" ${row.memoryKey ? "" : "disabled"}>翻回忆页</button>
        </div>
        <small class="dungeon-echo-archive-safe">${row.safety}</small>
      `;
      refs.goalBookPanel.append(node);
    }
  }

  const memoryPages = dungeonCompendiumMemoryPages(3);
  const memoryUnlockedCount = memoryPages.filter((page) => state.dungeonCompendium?.[page.key]?.unlocked).length;
  const memoryHeader = document.createElement("div");
  memoryHeader.className = `goal-summary ${memoryUnlockedCount > 0 ? "pass" : "active"}`;
  memoryHeader.innerHTML = `<strong>回忆页 ${memoryPages.length} 页 · 已点亮 ${compendium.cleared}</strong><span>最近收录的节气印记会翻成可回看的年鉴页，补上场景、奖励和年轮试炼共鸣。</span>`;
  refs.goalBookPanel.append(memoryHeader);

  if (memoryPages.length === 0) {
    const empty = document.createElement("div");
    empty.className = "goal-card pending memory-page-card";
    empty.innerHTML = `<strong>第一张回忆页仍待落笔</strong><small>先去秘境里留下节气碎片，年轮纪念碑才会开始记住这段见闻。</small>`;
    refs.goalBookPanel.append(empty);
  } else {
    for (const page of memoryPages) {
      const entry = state.dungeonCompendium?.[page.key];
      const stateClass = entry?.cleared ? "done" : entry?.unlocked ? "ready" : "pending";
      const node = document.createElement("div");
      node.className = `goal-card memory-page-card ${stateClass}`;
      node.innerHTML = `
        <strong>${page.title}</strong>
        <span>${page.subtitle}</span>
        <small>${page.scene}</small>
        <small>${page.caption} · ${page.resonance}</small>
        <small>${page.footer}</small>
        <button type="button" data-dungeon-memory-open="${page.key}" ${state.activeDungeonMemoryPage === page.key ? "disabled" : ""}>${state.activeDungeonMemoryPage === page.key ? "正在翻看" : "翻开回忆页"}</button>
      `;
      refs.goalBookPanel.append(node);
    }
  }

  if (isYear2Open) {
    const yearlyClaimCount = Object.keys(state.goalBookState.year2Claims || {}).length + Object.keys(state.goalBookState.freeplayClaims || {}).length;
    const dailyLimit = state.day <= 7 ? 3 : yearlyClaimCount >= 10 ? 5 : 4;
    const year2Sections = [
      { title: "今日建议", type: "daily", goals: recommendedYear2Goals("daily", dailyLimit), empty: "今天的短目标都做完了，可以去推进周目标或自由目标。" },
      { title: "本周目标", type: "weekly", goals: recommendedYear2Goals("weekly", 3), empty: "本周中期目标暂时清空了，说明你的经营节奏很稳。" },
      { title: "本月主题", type: "seasonal", goals: recommendedYear2Goals("seasonal", 2), empty: "当前节气没有激活专属主题，继续经营等下一轮时令变化。" },
      { title: "长期追求", type: "longterm", goals: year2AllGoals.filter((goal) => ["collection", "relationship", "challenge"].includes(goal.goal_type) && !year2GoalClaimed(goal)).sort((a, b) => year2GoalPriorityScore(b) - year2GoalPriorityScore(a)).slice(0, 4), empty: "长期目标暂时都已收录，洞天已经越来越像完整共同体了。" },
    ];

    for (const section of year2Sections) {
      const header = document.createElement("div");
      header.className = `goal-summary ${section.goals.some((goal) => year2GoalReady(goal)) ? "pass" : "active"}`;
      header.innerHTML = `<strong>${section.title}</strong><span>${section.type === "daily" ? "5 到 20 分钟的小目标" : section.type === "weekly" ? "1 到 3 天的推进方向" : section.type === "seasonal" ? "跟着节气和赛季走" : "通关后仍值得追的纪念线"}</span>`;
      refs.goalBookPanel.append(header);

      if (section.goals.length === 0) {
        const empty = document.createElement("div");
        empty.className = "goal-card done";
        empty.innerHTML = `<strong>${section.title} 已整理完</strong><small>${section.empty}</small>`;
        refs.goalBookPanel.append(empty);
        continue;
      }

      for (const goal of section.goals) {
        const progress = year2GoalProgress(goal);
        const target = conditionTarget(goal.complete_condition);
        const claimed = year2GoalClaimed(goal);
        const ready = year2GoalReady(goal);
        const node = document.createElement("div");
        node.className = `goal-card ${claimed ? "done" : ready ? "ready" : "pending"}`;
        node.innerHTML = `
          <strong>${year2GoalTitle(goal)}</strong>
          <span>${goal.note} · 预计 ${goal.estimated_minutes} 分钟</span>
          <small>当前进度 ${Math.min(progress, target)}/${target} · 奖励 ${year2GoalRewardText(goal)}</small>
          <button type="button" data-year2-goal="${goal.goal_id}" ${ready && !claimed ? "" : "disabled"}>${claimed ? "已收录" : ready ? "收进年鉴" : "继续推进"}</button>
        `;
        refs.goalBookPanel.append(node);
      }
    }
  }

  const jobGoals = spiritJobGoalRows();
  const claimedJobGoals = jobGoals.filter(spiritJobGoalClaimed).length;
  const readyJobGoals = jobGoals.filter((goal) => spiritJobGoalReady(goal) && !spiritJobGoalClaimed(goal)).length;
  const jobHeader = document.createElement("div");
  jobHeader.className = `goal-summary ${claimedJobGoals >= jobGoals.length ? "pass" : readyJobGoals ? "pass" : "active"}`;
  jobHeader.innerHTML = `<strong>精怪岗位修行 ${claimedJobGoals}/${jobGoals.length} · 可领取 ${readyJobGoals}</strong><span>把农田、工坊、店铺、巡逻、远征、庭院岗位培养成长期目标链。</span>`;
  refs.goalBookPanel.append(jobHeader);

  for (const goal of jobGoals) {
    const progress = spiritJobProgress(goal.job_type);
    const ready = spiritJobGoalReady(goal);
    const claimed = spiritJobGoalClaimed(goal);
    const milestone = (state.spiritJobMilestones || []).find((entry) => entry.masteryId === goal.mastery_id);
    const taskText = spiritJobTaskText(milestone);
    const taskDone = milestone && state.completedSpiritJobTasks.has(milestone.masteryId);
    const taskReady = milestone && spiritJobTaskReady(milestone);
    const node = document.createElement("div");
    node.className = `goal-card spirit-job-goal ${claimed ? "done" : ready ? "ready" : "locked"}`;
    node.innerHTML = `
      <strong>${jobName(goal.job_type)}修行 · Lv.${goal.level}</strong>
      <span>${progress.spirit ? `${progress.spirit.name} 当前 Lv.${progress.level} / EXP ${progress.exp}` : "暂无对应岗位精怪开始修行"} · 目标 EXP ${goal.exp_required}</span>
      <small>${goal.unlock_effect} · 奖励 ${spiritJobGoalRewardText(goal)}</small>
      <button type="button" data-spirit-job-goal="${goal.mastery_id}" ${!ready || claimed ? "disabled" : ""}>${claimed ? "已领取" : ready ? "领取修行奖励" : "继续修行"}</button>
      ${milestone ? `<div class="spirit-job-task ${taskDone ? "done" : taskReady ? "ready" : "locked"}"><span>${taskText.title} · ${taskDone ? "已完成" : taskText.hint}</span><small>奖励 ${spiritJobTaskRewardText(milestone)}</small>${taskDone && spiritJobTaskPersistentEffectText(milestone.job) ? `<small>${spiritJobTaskPersistentEffectText(milestone.job)}</small>` : ""}<button type="button" data-spirit-job-task="${milestone.masteryId}" ${taskDone || !taskReady ? "disabled" : ""}>${taskDone ? "已完成" : taskReady ? "完成岗位小事" : "待准备"}</button></div>` : ""}
    `;
    refs.goalBookPanel.append(node);
  }

  const spiritLineRows = spiritEventGoalRows(data.spiritEventsByLine.size || 6);
  const completedSpiritLines = spiritLineRows.filter((row) => row.events.length > 0 && row.completedEvents.length >= row.events.length).length;
  const readySpiritLines = spiritLineRows.filter((row) => row.readyEvent).length;
  const replaySpiritLines = spiritLineRows.filter((row) => row.replayEvent).length;
  const spiritLineHeader = document.createElement("div");
  spiritLineHeader.className = `goal-summary ${completedSpiritLines >= spiritLineRows.length ? "pass" : readySpiritLines ? "pass" : replaySpiritLines ? "pass" : "active"}`;
  spiritLineHeader.innerHTML = `<strong>伙伴记忆线 ${completedSpiritLines}/${spiritLineRows.length} · 可推进 ${readySpiritLines} · 可回看 ${replaySpiritLines}</strong><span>把普通精怪的初见、进化和终章陪伴整理成真正能追踪的伙伴线；进化镜头解锁后可随时回看。</span>`;
  refs.goalBookPanel.append(spiritLineHeader);

  const finaleEffects = spiritFinaleEffectSummary();
  const finaleRows = spiritFinaleEffectRows(finaleEffects);
  const activeFinaleRows = finaleRows.filter((row) => row.active);
  const finaleCard = document.createElement("div");
  finaleCard.className = `goal-card spirit-finale-effect-card ${activeFinaleRows.length >= finaleRows.length ? "done" : activeFinaleRows.length > 0 ? "ready" : "pending"}`;
  finaleCard.innerHTML = `
    <strong>终章伙伴常驻 ${activeFinaleRows.length}/${finaleRows.length}</strong>
    <span>${activeFinaleRows.length > 0 ? `已生效：${spiritFinaleEffectCompactText(finaleEffects, 6)}` : "完成普通精怪终章后，它们会把岗位真正留在洞天里，变成农田、工坊、巡逻和旧铺的长期加成。"}</span>
    <div class="spirit-finale-effect-grid">
      ${finaleRows.map((row) => `
        <span class="${row.active ? "active" : "locked"}" style="--finale-accent:${row.accent}">
          <b>${row.shortTitle}</b>
          <small>${row.loopLabel} · ${row.valueText}</small>
        </span>
      `).join("")}
    </div>
    <small>${activeFinaleRows.length > 0 ? activeFinaleRows.slice(0, 3).map((row) => `${row.anchorLabel}：${row.detail}`).join("；") : "下一步：继续推进上方伙伴记忆线，把初见、进化和终章陪伴依次收束。"}</small>
  `;
  refs.goalBookPanel.append(finaleCard);

  for (const row of spiritLineRows) {
    const latestCompleted = row.completedEvents[row.completedEvents.length - 1] || null;
    const focusEvent = row.readyEvent || row.nextEvent || row.replayEvent || latestCompleted || row.events[0] || null;
    const stageTrail = row.completedEvents.length > 0
      ? `已收录：${row.completedEvents.map((event) => spiritEventStageLabel(event.event_stage)).join(" / ")}`
      : row.ownedSpirit
        ? "已结缘，下一段会随时令与经营慢慢亮起。"
        : "尚未结缘，先让对应精怪入队。";
    let buttonMarkup = '<button type="button" disabled>等待亮起</button>';
    if (row.readyEvent) {
      buttonMarkup = `<button type="button" data-spirit-event="${row.readyEvent.spirit_event_id}">触发${spiritEventStageLabel(row.readyEvent.event_stage)}</button>`;
    } else if (row.replayEvent) {
      buttonMarkup = `<button type="button" data-spirit-event-scene="${row.replayEvent.spirit_event_id}">回看进化演出</button>`;
    } else if (!row.ownedSpirit) {
      buttonMarkup = '<button type="button" disabled>先结缘伙伴</button>';
    }
    const node = document.createElement("div");
    node.className = `goal-card spirit-line-event ${row.stateClass}`;
    node.setAttribute("data-spirit-line", row.lineId);
    node.innerHTML = `
      <strong>${row.spiritName} · ${row.headline}</strong>
      <span>伙伴记忆 ${row.completedEvents.length}/${row.events.length}${focusEvent?.area_id ? ` · ${areaName(focusEvent.area_id)}` : ""}</span>
      <small>${row.detail}</small>
      <small>${stageTrail}</small>
      ${buttonMarkup}
    `;
    refs.goalBookPanel.append(node);
  }

  const rareHeader = document.createElement("div");
  const doneRare = data.rareSpiritEvents.filter(rareSpiritEventDone).length;
  const readyRare = data.rareSpiritEvents.filter(rareSpiritEventReady).length;
  rareHeader.className = `goal-summary ${doneRare >= data.rareSpiritEvents.length ? "pass" : readyRare ? "pass" : "active"}`;
  rareHeader.innerHTML = `<strong>稀有精怪事件 ${doneRare}/${data.rareSpiritEvents.length} · 可触发 ${readyRare}</strong><span>精怪不只是岗位，也会通过节气、店铺和秘境事件进入长期陪伴。</span>`;
  refs.goalBookPanel.append(rareHeader);

  const clueTrackerRows = rareSpiritClueTrackerRows(6);
  const clueTrackerReady = clueTrackerRows.filter((row) => row.ready).length;
  const clueTrackerKnown = clueTrackerRows.filter((row) => row.clue || row.ready || row.done).length;
  const clueBoard = document.createElement("div");
  clueBoard.className = `goal-card rare-clue-tracker ${clueTrackerReady ? "ready" : clueTrackerKnown ? "clued" : "locked"}`;
  clueBoard.innerHTML = `
    <strong>稀有精怪线索追踪 · 可触发 ${clueTrackerReady} · 已知 ${clueTrackerKnown}</strong>
    <span>把秘境、店铺、节气和精怪羁绊里的稀有线索汇总成下一步行动，不再只看后台条件。</span>
    <div class="rare-clue-tracker-grid">
      ${clueTrackerRows.map((row) => `
        <div class="rare-clue-tracker-row ${row.stateClass}" data-rare-event-line="${row.lineId}">
          <b>${row.event.spirit_name} · ${row.stageLabel}</b>
          <span>${row.statusText} · ${row.sourceText}</span>
          <small>下一步：${row.nextAction}</small>
          <small>动作/回礼：${row.event.exclusive_action || "专属动作"} · ${row.rewardText}</small>
        </div>
      `).join("")}
    </div>
  `;
  refs.goalBookPanel.append(clueBoard);

  const lifeCodexRows = rareSpiritLifeCodexRows();
  const lifeCodexComplete = lifeCodexRows.filter((row) => row.owned && row.completedEvents.length >= row.events.length && row.theaterEntries.length > 0).length;
  const lifeCodexReady = lifeCodexRows.filter((row) => row.readyEvents.length > 0).length;
  const lifeHeader = document.createElement("div");
  lifeHeader.className = `goal-summary ${lifeCodexComplete >= lifeCodexRows.length ? "pass" : lifeCodexReady ? "pass" : "active"}`;
  lifeHeader.innerHTML = `<strong>精怪生活图鉴 ${lifeCodexComplete}/${lifeCodexRows.length} · 可推进 ${lifeCodexReady}</strong><span>按精怪线汇总事件、小剧场、回礼、生态共鸣和羁绊，帮助你判断哪条生活线还需要陪伴。</span>`;
  refs.goalBookPanel.append(lifeHeader);
  const activeLifeCodexFilter = currentLifeCodexFilterId();
  const activeFilterMeta = LIFE_CODEX_FILTERS.find((entry) => entry.id === activeLifeCodexFilter) || LIFE_CODEX_FILTERS[0];
  const filterBar = document.createElement("div");
  filterBar.className = "rare-life-codex-filter-bar";
  filterBar.innerHTML = LIFE_CODEX_FILTERS.map((filter) => {
    const count = lifeCodexRows.filter((row) => lifeCodexFilterMatches(row, filter.id)).length;
    return `
      <button type="button" class="rare-life-codex-filter-button" data-life-codex-filter="${filter.id}" aria-pressed="${filter.id === activeLifeCodexFilter ? "true" : "false"}">
        <strong>${filter.label}</strong>
        <span>${count} 条</span>
      </button>
    `;
  }).join("");
  refs.goalBookPanel.append(filterBar);
  const filteredLifeCodexRows = lifeCodexRows.filter((row) => lifeCodexFilterMatches(row, activeLifeCodexFilter));
  const filterNote = document.createElement("div");
  filterNote.className = `goal-card rare-life-codex-filter-note ${filteredLifeCodexRows.length === 0 ? "pending" : activeLifeCodexFilter === "complete" ? "done" : "ready"}`;
  filterNote.innerHTML = `
    <strong>${activeFilterMeta.label} · ${filteredLifeCodexRows.length}/${lifeCodexRows.length}</strong>
    <span>${activeFilterMeta.hint}</span>
    <small>${filteredLifeCodexRows.length > 0 ? filteredLifeCodexRows.slice(0, 3).map((row) => `${row.spiritName} · ${row.statusText}`).join("；") : activeFilterMeta.empty}</small>
  `;
  refs.goalBookPanel.append(filterNote);
  const actionPromenade = rareSpiritActionPromenadeMarkup(rareSpiritActionPromenadeSpec(lifeCodexRows));
  if (actionPromenade) {
    const promenadeNode = document.createElement("div");
    promenadeNode.innerHTML = actionPromenade;
    refs.goalBookPanel.append(promenadeNode.firstElementChild);
  }
  const characterShowcase = rareSpiritCharacterShowcaseMarkup(rareSpiritCharacterShowcaseSpec(lifeCodexRows));
  if (characterShowcase) {
    const showcaseNode = document.createElement("div");
    showcaseNode.innerHTML = characterShowcase;
    refs.goalBookPanel.append(showcaseNode.firstElementChild);
  }
  const theaterArchivePreview = rareSpiritTheaterArchiveEntries(6);

  if (filteredLifeCodexRows.length === 0) {
    const emptyLifeCodex = document.createElement("div");
    emptyLifeCodex.className = "goal-card rare-life-codex-empty pending";
    emptyLifeCodex.innerHTML = `<strong>${activeFilterMeta.label} 暂时没有条目</strong><span>${activeFilterMeta.empty}</span><small>你可以切回“全部生活线”查看总览，或先去精怪面板制造新的互动记录。</small>`;
    refs.goalBookPanel.append(emptyLifeCodex);
  }

  for (const row of filteredLifeCodexRows) {
    const latestTheaterText = row.latestTheater
      ? `最近小剧场：第 ${row.latestTheater.day} 天 · ${row.latestTheater.focus} · “${row.latestTheater.quote}”`
      : "小剧场：尚未主动收录";
    const latestGiftText = row.latestGift
      ? `最近回礼：${itemName(row.latestGift.itemId)}`
      : row.completedEvents.length > 0 ? "回礼：等待下一段事件或互动" : "回礼：尚未获得";
    const ecologyText = row.ecologyCombos.length > 0
      ? `生态共鸣 ${row.activeEcology.length}/${row.ecologyCombos.length} · ${row.ecologyCombos.slice(0, 2).map(ecologyComboName).join(" / ")}`
      : "生态共鸣：暂无专属组合";
    const archiveEntry = theaterArchivePreview.find((entry) => entry.lineId === row.lineId);
    const node = document.createElement("div");
    node.className = `goal-card rare-life-codex ${row.stateClass}`;
    node.setAttribute("data-life-codex-line", row.lineId);
    node.innerHTML = `
      <strong>${row.spiritName} · ${row.statusText}</strong>
      <span>生活进度 ${row.progressText} · 事件 ${row.completedEvents.length}/${row.events.length} · 羁绊 Lv.${row.bondLevel}</span>
      <small>${latestTheaterText}</small>
      <small>${latestGiftText} · ${ecologyText}</small>
      ${rareSpiritLifeSnapshotMarkup(rareSpiritLifeSnapshot(row))}
      <div class="rare-life-codex-actions">
        <button type="button" data-life-codex-focus="spirit" data-life-codex-line="${row.lineId}" ${row.owned ? "" : "disabled"}>定位精怪</button>
        <button type="button" data-life-codex-focus="event" data-life-codex-line="${row.lineId}" ${row.readyEvents.length > 0 ? "" : "disabled"}>定位事件</button>
        <button type="button" data-life-codex-focus="theater" data-life-codex-line="${row.lineId}" ${archiveEntry ? "" : "disabled"}>回看小剧场</button>
      </div>
      <div class="rare-life-codex-tags">
        <span class="${row.owned ? "done" : "missing"}">${row.owned ? "已结缘" : "待结缘"}</span>
        <span class="${row.completedEvents.length >= row.events.length ? "done" : row.readyEvents.length ? "ready" : "missing"}">${row.completedEvents.length >= row.events.length ? "事件收束" : row.readyEvents.length ? "事件可推" : "事件待触发"}</span>
        <span class="${row.theaterEntries.length > 0 ? "done" : "missing"}">${row.theaterEntries.length > 0 ? `小剧场 ${row.theaterEntries.length}` : "待收录小剧场"}</span>
        <span class="${row.activeEcology.length > 0 ? "done" : "missing"}">${row.activeEcology.length > 0 ? "生态已亮" : "生态待养"}</span>
      </div>
    `;
    refs.goalBookPanel.append(node);
  }

  for (const event of data.rareSpiritEvents) {
    const clue = rareSpiritClueForEvent(event);
    const done = rareSpiritEventDone(event);
    const ready = rareSpiritEventReady(event);
    const rewardText = rareSpiritEventRewardText(event);
    const lineId = rareSpiritLineId(event);
    const rareSpirit = state.spirits.find((spirit) => (spirit.lineId || spiritLine(spirit.id)) === lineId);
    const rareMoment = rareSpirit ? rareSpiritMomentForSpirit(rareSpirit) : null;
    const buttonLabel = done ? "已完成" : event.event_stage === "first_meet" ? "触发初见" : "领取回礼";
    const node = document.createElement("div");
    node.className = `goal-card rare-spirit-event ${done ? "done" : ready ? "ready" : "locked"}`;
    node.setAttribute("data-rare-event-id", event.entry_id);
    node.setAttribute("data-rare-event-line", lineId);
    node.innerHTML = `
      <strong>${event.spirit_name} · ${event.event_stage}</strong>
      <span>${event.scene_summary}</span>
      <small>${done ? "已收录进洞天记忆" : clue ? `秘境线索：${clue.sceneSummary}` : ready ? `可触发动作：${event.exclusive_action}` : `线索：${event.trigger_condition}`} · 奖励 ${rewardText}</small>
      ${rareMoment && event.event_stage === "first_meet" ? `<small>今日同行：${rareMoment.focus} · ${rareMoment.actionShort} · “${rareMoment.quote}”</small>` : ""}
      <button type="button" data-rare-spirit-event="${event.entry_id}" ${!ready || done ? "disabled" : ""}>${buttonLabel}</button>
    `;
    refs.goalBookPanel.append(node);
  }

  const theaterArchive = theaterArchivePreview;
  const theaterHeader = document.createElement("div");
  theaterHeader.className = `goal-summary ${theaterArchive.length > 0 ? "pass" : "active"}`;
  theaterHeader.innerHTML = `<strong>稀有小剧场回看 ${theaterArchive.length}/6</strong><span>把主动触发过的精怪日常沉淀成可回看的年鉴页，保留台词、地点和当日动作，不重复发放奖励。</span>`;
  refs.goalBookPanel.append(theaterHeader);
  if (theaterArchive.length === 0) {
    const emptyTheater = document.createElement("div");
    emptyTheater.className = "goal-card rare-theater-archive pending";
    emptyTheater.innerHTML = `<strong>还没有收录小剧场</strong><span>去精怪面板点击“看今日小剧场”，第一段稀有日常会自动写进这里。</span><small>回看页会重新点亮主场景演出，但不会重复给羁绊或回礼。</small>`;
    refs.goalBookPanel.append(emptyTheater);
  } else {
    for (const entry of theaterArchive) {
      const node = document.createElement("div");
      node.className = "goal-card rare-theater-archive done";
      node.setAttribute("data-theater-line", entry.lineId);
      node.innerHTML = `
        <strong>${entry.title}</strong>
        <span>${entry.subtitle}</span>
        <small>“${entry.quote || "这段小事，我还记得。"}” · ${entry.caption}</small>
        <button type="button" data-rare-theater-replay="${entry.archiveIndex}">回看小剧场</button>
      `;
      refs.goalBookPanel.append(node);
    }
  }

  const ecologyGoals = ecologyCourtyardGoalRows();
  const ecologyReady = ecologyGoals.filter((row) => row.ready).length;
  const ecologyClaimed = ecologyGoals.filter((row) => row.claimed).length;
  const ecologyGarden = ecologyCourtyardSummary();
  const ecologyMemoryResonance = ecologyGarden.scoreBreakdown?.memoryResonance || ecologyDailyMemoryResonanceSnapshot();
  const ecologyMemoryResonanceText = ecologyDailyMemoryResonanceText(ecologyMemoryResonance);
  const ecologyHeader = document.createElement("div");
  ecologyHeader.className = `goal-summary ${ecologyClaimed >= ecologyGoals.length ? "pass" : ecologyReady ? "pass" : "active"}`;
  ecologyHeader.innerHTML = `<strong>生态庭院造景 ${ecologyClaimed}/${ecologyGoals.length} · 可收录 ${ecologyReady} · ${ecologyGarden.tier?.shortLabel || "初成"} ${ecologyGarden.score} 分</strong><span>把精怪线、建筑标签和稀有事件接成可追踪的庭院共鸣，每完成一处都会在主场景留下长期画面反馈。</span>`;
  refs.goalBookPanel.append(ecologyHeader);
  const ecologyScoreCard = document.createElement("div");
  ecologyScoreCard.className = `goal-card ecology-score-card ${ecologyGarden.claimedGoalCount > 0 ? ecologyGarden.score >= 88 ? "done" : "ready" : "pending"}`;
  ecologyScoreCard.innerHTML = `
    <strong>${ecologyGarden.tier?.label || "待布置庭院"} · 庭院评分 ${ecologyGarden.score}</strong>
    <span>${ecologyGarden.tier?.note || "继续补精怪、造景和生活事件，让这片院子真正像有人住。"} </span>
    <div class="ecology-score-breakdown">
      <span>主题 ${ecologyGarden.scoreBreakdown?.themeConsistency || 0}/30</span>
      <span>功能 ${ecologyGarden.scoreBreakdown?.functionClosure || 0}/25</span>
      <span>舒适 ${ecologyGarden.scoreBreakdown?.spiritComfort || 0}/20</span>
      <span>稀景 ${ecologyGarden.scoreBreakdown?.rareDecor || 0}/15</span>
      <span>生活 ${ecologyGarden.scoreBreakdown?.lifeEvents || 0}/10</span>
    </div>
    <small>${ecologyGarden.sceneRows.length > 0 ? ecologyGarden.sceneRows.slice(0, 2).map((row) => `${row.name}：${row.text}`).join("；") : ecologyGarden.nextCombo ? `下一处造景：${ecologyGarden.nextCombo.name} · ${ecologyGarden.nextCombo.unlockHint}` : "先完成第一处生态共鸣，庭院就会开始显出自己的气质。"}</small>
    ${ecologyMemoryResonance.tier > 0 ? `<small>庭院记忆：${ecologyMemoryResonance.label} · 生活评分 +${ecologyMemoryResonance.lifeScoreBonus} · ${ecologyMemoryResonance.summary}</small>` : ""}
  `;
  refs.goalBookPanel.append(ecologyScoreCard);

  const ecologyState = syncEcologyDailyState();
  const ecologyMemoryRows = ecologyDailyMemoryRows(4);
  const ecologyInspectionRows = ecologyInspectionMemoryRows(4);
  const hasEcologyMemory = ecologyMemoryRows.length > 0 || ecologyInspectionRows.length > 0;
  const ecologyMemoryCard = document.createElement("div");
  ecologyMemoryCard.className = `goal-card ecology-memory-card ${hasEcologyMemory ? "done" : "pending"}`;
  ecologyMemoryCard.innerHTML = hasEcologyMemory
    ? `
      <strong>庭院夜事与巡看回看 · 夜事 ${ecologyState.history.length} / 巡看 ${ecologyState.inspectionHistory.length}</strong>
      <span>${ecologyMemoryResonance.summary}</span>
      ${ecologyMemoryResonanceText ? `<small class="ecology-memory-resonance">${ecologyMemoryResonanceText}</small>` : ""}
      <small>${ecologyMemoryResonance.nextHint}</small>
      ${ecologyMemoryRows.length > 0 ? `
        <div class="ecology-memory-list">
          ${ecologyMemoryRows.map((entry) => `
            <span>
              <b>${entry.dayText} · ${entry.title}</b>
              <small>${entry.comboName}：${entry.actionText || entry.moodText || "庭院在夜里留下动静"} · ${entry.detailText}</small>
            </span>
          `).join("")}
        </div>
      ` : `<small>夜事尚未落页：先收录生态造景，再入夜结算，庭院会自己记下小事。</small>`}
      ${ecologyInspectionRows.length > 0 ? `
        <div class="ecology-memory-list ecology-inspection-list">
          ${ecologyInspectionRows.map((entry) => `
            <span>
              <b>${entry.dayText} · ${entry.landmarkLabel} · ${entry.actionText}</b>
              <small>${entry.caretakerName}：${entry.summary} · ${entry.rewardText}</small>
            </span>
          `).join("")}
        </div>
      ` : `<small>今日巡看尚未记录：在主场景直接点击已点亮的生态地标，会打开生态巡看留签预览照料动作、巡看回报和夜事余韵，不会直接记录巡看或发放收益。</small>`}
    `
    : `
      <strong>庭院夜事与巡看回看 · 尚未落页</strong>
      <span>先收录一处生态造景，再入夜结算；也可以直接点击主场景生态地标查看生态巡看留签，先读懂白天照料会怎样接到夜事余韵。</span>
      <small>提示：让精怪驻进庭院岗、完成生态共鸣目标，夜间小事与白日巡看都会慢慢写成庭院记忆。</small>
    `;
  refs.goalBookPanel.append(ecologyMemoryCard);

  const ecologyInspectionConfirm = ecologyInspectionConfirmRows(6);
  const ecologyInspectionDone = ecologyInspectionConfirm.filter((row) => row.inspection.alreadyInspected).length;
  const ecologyInspectionConfirmCard = document.createElement("div");
  ecologyInspectionConfirmCard.className = `goal-card ecology-inspection-confirm-card ${ecologyInspectionDone > 0 ? ecologyInspectionDone >= ecologyInspectionConfirm.length ? "done" : "ready" : ecologyInspectionConfirm.length ? "ready" : "pending"}`;
  ecologyInspectionConfirmCard.innerHTML = ecologyInspectionConfirm.length
    ? `
      <strong>今日生态巡看确认 ${ecologyInspectionDone}/${ecologyInspectionConfirm.length}</strong>
      <span>主世界的生态巡看留签只负责预览；这里才是明确记录今日巡看、发放回报并写入庭院夜事照料线索的入口。</span>
      <div class="ecology-inspection-confirm-list">
        ${ecologyInspectionConfirm.map((row) => {
          const actionNode = row.nodes.find((node) => node.key === "action") || row.nodes[0];
          const nightNode = row.nodes.find((node) => node.key === "night") || row.nodes[2];
          return `
            <div class="ecology-inspection-confirm-row ${row.stateClass}" data-ecology-inspection-row="${row.combo.comboId}">
              <span>
                <b>${row.inspection.landmarkLabel} · ${actionNode?.title || row.inspection.actionText}</b>
                <small>${actionNode?.detail || row.inspection.summary}</small>
                <small>${row.rewardPreview} · ${nightNode?.title || "夜事余韵"}：${nightNode?.detail || "确认后才会接入夜间庭院小事。"}</small>
              </span>
              <button type="button" data-ecology-inspection-confirm="${row.combo.comboId}" ${row.inspection.alreadyInspected ? "disabled" : ""}>${row.buttonLabel}</button>
            </div>
          `;
        }).join("")}
      </div>
      <small>安全边界：场景点击不会自动巡看；只有本卡按钮会写入巡看记录、奖励和当晚照料线索。</small>
    `
    : `
      <strong>今日生态巡看确认 · 暂无可巡地标</strong>
      <span>先完成一处生态共鸣或收录生态庭院造景，主场景才会出现可预览的生态巡看留签。</span>
      <small>这条闭环会把精怪白天照料、目标册确认、夜事余韵和庭院记忆接起来。</small>
    `;
  refs.goalBookPanel.append(ecologyInspectionConfirmCard);

  for (const row of ecologyGoals) {
    const stateClass = row.claimed ? "done" : row.ready ? "ready" : row.active ? "ready" : "pending";
    const missing = row.missingText || "条件已齐，只差收录";
    const node = document.createElement("div");
    node.className = `goal-card ecology-goal ${stateClass}`;
    node.innerHTML = `
      <strong>${row.name} · ${row.active ? "生态共鸣已亮" : "造景筹备中"}</strong>
      <span>${row.effectText} · ${row.unlockHint}</span>
      <small>造景进度 ${row.progressText} · ${row.active ? "可收进生态庭院" : `还差 ${missing}`}</small>
      <div class="ecology-requirements">${row.requirements.slice(0, 4).map((entry) => `<span class="${entry.done ? "done" : "missing"}">${entry.done ? "已成" : "待补"} · ${entry.label}</span>`).join("")}</div>
      <button type="button" data-ecology-goal="${row.comboId}" ${row.ready ? "" : "disabled"}>${row.claimed ? "已收录" : row.ready ? "收进生态庭院" : "继续造景"}</button>
    `;
    refs.goalBookPanel.append(node);
  }

  if (!isYear2Open) {
    const freeLocked = document.createElement("div");
    freeLocked.className = "goal-summary active";
    freeLocked.innerHTML = "<strong>后主线自由目标 未开启</strong><span>蟠桃大宴后，这里会展开日常、周常、收藏、挑战和关系线奖励。</span>";
    refs.goalBookPanel.append(freeLocked);
    return;
  }

  const freeGoals = data.freeplayGoals.filter((goal) => freeplayGoalUnlocked(goal));
  const freeReadyCount = freeGoals.filter(freeplayGoalReady).length;
  const freeHeader = document.createElement("div");
  freeHeader.className = `goal-summary ${freeReadyCount > 0 ? "pass" : "active"}`;
  freeHeader.innerHTML = `<strong>后主线自由目标 ${freeGoals.filter(freeplayGoalClaimed).length}/${freeGoals.length} · 可领取 ${freeReadyCount}</strong><span>把日常、周常、收藏、挑战和关系线真正变成通关后的长期留存内容。</span>`;
  refs.goalBookPanel.append(freeHeader);

  const freeplayGuidance = freeplayGoalGuidanceSpec();
  if (freeplayGuidance) {
    const freeplayGuidanceNode = document.createElement("div");
    freeplayGuidanceNode.innerHTML = `
      <div class="goal-card freeplay-guide">
        <strong>${freeplayGuidance.title}</strong>
        <span>${freeplayGuidance.headline}</span>
        <div class="freeplay-goal-guide">
          ${freeplayGuidance.rows.map((row) => `
            <div class="freeplay-route-button ${row.ready ? "ready" : "active"}">
              <b>${row.title}</b>
              <small>${row.routeText}</small>
              <button type="button" data-freeplay-goal-route="${row.goalId}">${row.ready ? "去兑现" : "看路线"}</button>
            </div>
          `).join("")}
        </div>
        <small>${freeplayGuidance.safety}</small>
      </div>
    `.trim();
    refs.goalBookPanel.append(freeplayGuidanceNode.firstElementChild);
  }

  const freeplayPanelGuide = freeplayPanelGuideMarkup();
  if (freeplayPanelGuide) {
    const freeplayPanelGuideNode = document.createElement("div");
    freeplayPanelGuideNode.innerHTML = freeplayPanelGuide.trim();
    refs.goalBookPanel.append(freeplayPanelGuideNode.firstElementChild);
  }

  for (const goal of freeGoals) {
    const progress = metricProgress(goal.target_metric);
    const target = Number(goal.target_value || 1);
    const claimed = freeplayGoalClaimed(goal);
    const ready = freeplayGoalReady(goal);
    const rewardPreview = rewardPoolEntries(goal.reward_pool_id).slice(0, 2).map((entry) => applyRewardEntryPreview(entry)).join("、");
    const node = document.createElement("div");
    node.dataset.freeplayGoalId = goal.goal_id;
    node.className = `goal-card ${claimed ? "done" : ready ? "ready" : "pending"}`;
    node.innerHTML = `
      <strong>${localize(goal.goal_name_key, goal.goal_id)} · ${goal.goal_type}</strong>
      <span>${goal.retention_intent} · ${goal.cycle_type}</span>
      <small>当前进度 ${Math.min(progress, target)}/${target} · 奖励 ${rewardPreview || goal.reward_pool_id}</small>
      <button type="button" data-freeplay-goal="${goal.goal_id}" ${ready && !claimed ? "" : "disabled"}>${claimed ? "已领取" : ready ? "领取自由奖励" : "继续推进"}</button>
    `;
    refs.goalBookPanel.append(node);
  }
}
