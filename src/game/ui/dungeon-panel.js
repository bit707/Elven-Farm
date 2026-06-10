export function renderDungeonPanelUi({
  refs,
  state,
  data,
  baizhiChapterFinishPanelHint,
  herbValleyUnlockPanelHint,
  chapter3TradePanelHint,
  dengyingRevealedRotation,
  syncDengyingLanternState,
  currentDungeonConfig,
  currentDungeonMechanic,
  dungeonMechanicStatus,
  dungeonMechanicActionSpec,
  dungeonMechanicHudSpec,
  dungeonSpiritSolutionSpec,
  dungeonMechanicSolutionTriptychSpec,
  dungeonStructureRouteSpec,
  dungeonFirstMechanicTheaterSpec,
  itemName,
  dungeonHazards,
  bossHpPercent,
  dungeonBossId,
  bossSkillForTurn,
  dungeonBossTelegraphSpec,
  dungeonCompendiumEntry,
  dungeonCompendiumEntrySummary,
  dungeonFailureInsight,
  dungeonFailureInsightSummary,
  dungeonName,
  companionPower,
  bossName,
  bossPhaseForPercent,
  dungeonBossCounterMarkup,
  dungeonBossFamiliarityMarkup,
  dungeonMechanicSolutionTriptychMarkup,
  dungeonFirstMechanicTheaterMarkup,
  dungeonStructureRouteMarkup,
  dungeonMechanicHudMarkup,
  dungeonSpiritSolutionMarkup,
  enemyName,
  enemyAiLabel,
  enemyWeaknessText,
  fireRuinEntered,
  fireRuinUnlocked,
  dungeonSeasonPrimerMarkup,
  dungeonSeasonPrimerSpec,
  availableDungeons,
  herbValleyAreaId,
  fireRuinAreaId,
  activeHiddenRotationForDungeon,
  rewardPoolPreviewText,
  bossSkillsFor,
  skillName,
  dungeonRotationLabel,
  dungeonRotationEntryEffect,
}) {
  refs.dungeonPanel.innerHTML = "";
  const run = state.dungeon;
  const chapterFinishHint = baizhiChapterFinishPanelHint();
  const herbValleyHint = chapterFinishHint ? null : herbValleyUnlockPanelHint();
  const chapter3TradeHint = chapter3TradePanelHint();
  const revealedRotation = dengyingRevealedRotation();
  const revealedDungeon = data.dungeonsById.get(revealedRotation?.area_id || "");
  const lanternState = syncDengyingLanternState();
  const revealUsedToday = Number(lanternState.revealUsedDay || 0) === state.day;
  if (run && !run.finished) {
    const dungeon = currentDungeonConfig();
    const mechanic = currentDungeonMechanic(dungeon);
    const mechanicStatus = dungeonMechanicStatus(run, mechanic, dungeon);
    const mechanicAction = dungeonMechanicActionSpec(run, mechanic, dungeon);
    const mechanicHud = dungeonMechanicHudSpec(run, mechanic, dungeon);
    const spiritSolution = dungeonSpiritSolutionSpec(run, mechanic, dungeon);
    const solutionTriptych = dungeonMechanicSolutionTriptychSpec(run, mechanic, dungeon, spiritSolution);
    const structureRoute = dungeonStructureRouteSpec(run, mechanic, dungeon, mechanicHud, spiritSolution);
    const firstMechanicTheater = dungeonFirstMechanicTheaterSpec(run, mechanic, dungeon, mechanicHud, spiritSolution);
    const lootText = run.loot.slice(-4).map((entry) => `${itemName(entry.itemId)} x${entry.count}`).join("、") || "暂无";
    const skillText = run.skillLog?.[0] || "等待下一次技能交锋";
    const hazards = run.hazards?.length ? run.hazards : dungeonHazards(mechanic, run, dungeon);
    const playerHpPercent = Math.max(0, Math.min(100, run.hp));
    const bossPercent = Math.ceil(bossHpPercent(run, dungeon) * 100);
    const lastEnemy = data.enemiesById.get(run.lastEnemyId);
    const bossId = dungeonBossId(dungeon, run);
    const nextBossSkill = run.bossReady ? bossSkillForTurn(bossId, run.turn, bossHpPercent(run, dungeon)) : null;
    const bossTelegraph = run.bossReady ? dungeonBossTelegraphSpec(nextBossSkill, bossId, run) : null;
    const stampEntry = dungeonCompendiumEntry(dungeon, mechanic);
    const stampSummary = dungeonCompendiumEntrySummary(stampEntry);
    const failureInsight = (run.failureInsightKey && state.dungeonFailureInsights?.[run.failureInsightKey]) || dungeonFailureInsight(dungeon, mechanic);
    const failureSummary = dungeonFailureInsightSummary(failureInsight);
    const hiddenRevealText = run.hiddenReveal
      ? (!run.hiddenRevealConsumed
          ? `灯影先把入口照亮了，本层开局压力 -${Number(run.hiddenRevealPressureDown || 0)}。`
          : "灯影已经替你看清了入口前半段路。")
      : "";
    const rotationText = run.rotationLabel
      ? `${run.rotationLabel}${run.rotationRewardFocus ? ` · 奖励焦点 ${run.rotationRewardFocus}` : ""}${run.rotationRewards?.length ? ` · 回响 ${run.rotationRewards.join(" / ")}` : ""}`
      : "";
    const node = document.createElement("div");
    node.className = "dungeon-card active";
    node.innerHTML = `
      <strong>${dungeonName(dungeon)} · 第 ${run.floor}/${run.maxFloor} 层</strong>
      <span>HP ${run.hp}/100 · 随行战力 ${companionPower()} · 最近收获：${lootText}</span>
      <div class="dungeon-meter"><span style="width:${playerHpPercent}%"></span></div>
      ${run.bossReady ? `<span>Boss ${bossName(bossId)} · HP ${run.bossHp}/${run.bossMaxHp} · ${bossPercent}% · 阶段 P${run.bossPhase || bossPhaseForPercent(bossId, bossHpPercent(run, dungeon))}${run.bossShield ? ` · 护盾 ${run.bossShield}` : ""}</span><div class="dungeon-meter boss"><span style="width:${bossPercent}%"></span></div>` : ""}
      ${bossTelegraph ? `<div class="dungeon-boss-skill ${bossTelegraph.tier}"><strong>下一招 · ${bossTelegraph.skillLabel}</strong><span>${bossTelegraph.targetLabel} · 前摇 ${bossTelegraph.castLabel} · ${bossTelegraph.effectLabel}</span><small>${bossTelegraph.note}</small></div>` : ""}
      ${dungeonBossCounterMarkup(bossTelegraph)}
      ${stampSummary ? `<small>节气印记：${stampSummary.title} · ${stampSummary.detail}</small>` : `<small>节气印记：当前还没在这处秘境留下可收录的印记。</small>`}
      ${failureSummary ? `<div class="dungeon-failure-insight"><strong>${failureSummary.title}</strong><span>${failureSummary.body}</span><small>${failureSummary.detail}</small></div>` : ""}
      ${dungeonBossFamiliarityMarkup(failureInsight)}
      <small>${mechanic?.field_rule || "当前节气机制未记录"} · ${skillText}</small>
      ${dungeonMechanicSolutionTriptychMarkup(solutionTriptych)}
      ${dungeonFirstMechanicTheaterMarkup(firstMechanicTheater)}
      ${dungeonStructureRouteMarkup(structureRoute)}
      ${mechanicHud ? dungeonMechanicHudMarkup(mechanicHud) : mechanicStatus ? `<small>${mechanicStatus.label}：${mechanicStatus.summary} · ${mechanicStatus.detail}</small>` : ""}
      ${dungeonSpiritSolutionMarkup(spiritSolution)}
      ${!mechanicHud && mechanicAction ? `<small>顺应节气：${mechanicAction.detail}${mechanicAction.used ? "" : ` · 可用 ${mechanicAction.label}（体力 -${mechanicAction.cost}）`}</small>` : ""}
      ${rotationText ? `<small>${rotationText}</small>` : ""}
      <div class="dungeon-hazards">${hazards.map((hazard) => `<b>${hazard.label} ${hazard.severity}</b>`).join("")}</div>
      ${lastEnemy ? `<small>最近敌人：${enemyName(lastEnemy)} · ${enemyAiLabel(lastEnemy)} · 弱点 ${enemyWeaknessText(lastEnemy)}</small>` : ""}
      ${hiddenRevealText ? `<small>${hiddenRevealText}</small>` : ""}
      <div class="dungeon-actions">
        ${mechanicAction ? `<button type="button" data-dungeon-action="attune" ${mechanicAction.disabled ? "disabled" : ""}>${mechanicAction.label}</button>` : ""}
        <button type="button" data-dungeon-action="explore" ${run.bossReady ? "disabled" : ""}>探索一层</button>
        <button type="button" data-dungeon-action="boss" ${run.bossReady ? "" : "disabled"}>挑战 Boss</button>
        <button type="button" data-dungeon-action="leave">撤离</button>
      </div>
    `;
    refs.dungeonPanel.append(node);
    for (const line of run.log.slice(0, 3)) {
      const log = document.createElement("div");
      log.className = "dungeon-card";
      log.innerHTML = `<span>${line}</span>`;
      refs.dungeonPanel.append(log);
    }
    for (const line of (run.skillLog || []).slice(0, 2)) {
      const log = document.createElement("div");
      log.className = "dungeon-card skill";
      log.innerHTML = `<span>${line}</span>`;
      refs.dungeonPanel.append(log);
    }
    return;
  }

  if (revealedRotation) {
    const revealCard = document.createElement("div");
    const dungeonLabel = revealedDungeon ? dungeonName(revealedDungeon) : "今夜秘境";
    revealCard.className = "dungeon-card ready";
    revealCard.dataset.dungeonRevealCard = "hidden_rotation";
    revealCard.innerHTML = `
      <strong>今夜隐藏入口已显形</strong>
      <span>${dungeonLabel} · ${revealedRotation.theme_tag || "night_hidden_entry"}</span>
      <small>${revealUsedToday ? "这段灯路今晚已经被你走过一回，入口轮廓还留在眼前。" : "灯影先把入口照亮了，下一次进入会更容易看清前一段路。"}${revealedRotation.reward_focus ? ` · 奖励焦点 ${revealedRotation.reward_focus}` : ""}</small>
    `;
    refs.dungeonPanel.append(revealCard);
  }

  if ((state.dungeonWorldChanges || []).length > 0) {
    const summary = document.createElement("div");
    summary.className = "dungeon-card complete";
    summary.innerHTML = `
      <strong>秘境余波 ${state.dungeonWorldChanges.length}</strong>
      <span>${state.dungeonWorldChanges.slice(-3).map((change) => change.title).join("；")}</span>
      <small>稀有精怪线索 ${(state.rareSpiritClues || []).length} 条 · 这些变化会直接显示在洞天主场景。</small>
    `;
    refs.dungeonPanel.append(summary);
  }

  if (herbValleyHint) {
    const unlockNode = document.createElement("div");
    unlockNode.className = "dungeon-card ready herb-valley-unlock";
    unlockNode.innerHTML = `
      <strong>${herbValleyHint.title}：${herbValleyHint.headline}</strong>
      <span>${herbValleyHint.detail}</span>
      <small>${herbValleyHint.dungeonHint} · ${herbValleyHint.cta}</small>
    `;
    refs.dungeonPanel.append(unlockNode);
  }

  if (chapterFinishHint) {
    const finishNode = document.createElement("div");
    finishNode.className = "dungeon-card complete herb-valley-unlock";
    finishNode.innerHTML = `
      <strong>${chapterFinishHint.title}：${chapterFinishHint.headline}</strong>
      <span>${chapterFinishHint.detail}</span>
      <small>${chapterFinishHint.rewardHint} · ${chapterFinishHint.cta}</small>
    `;
    refs.dungeonPanel.append(finishNode);
  }

  if (chapter3TradeHint) {
    const tradeNode = document.createElement("div");
    tradeNode.className = `dungeon-card ${fireRuinEntered() ? "complete" : fireRuinUnlocked() ? "ready" : "locked"} herb-valley-unlock`;
    tradeNode.innerHTML = `
      <strong>${chapter3TradeHint.title}：${chapter3TradeHint.headline}</strong>
      <span>${chapter3TradeHint.detail}</span>
      <small>${chapter3TradeHint.dungeonHint} · ${chapter3TradeHint.cta}</small>
    `;
    refs.dungeonPanel.append(tradeNode);
  }

  const seasonPrimerMarkup = dungeonSeasonPrimerMarkup(dungeonSeasonPrimerSpec());
  if (seasonPrimerMarkup) refs.dungeonPanel.insertAdjacentHTML("beforeend", seasonPrimerMarkup);

  for (const dungeon of availableDungeons()) {
    const cleared = state.dungeonClears.has(dungeon.area_id);
    const change = (state.dungeonWorldChanges || []).find((entry) => entry.dungeonId === dungeon.area_id);
    const mechanic = currentDungeonMechanic(dungeon);
    const spiritSolution = dungeonSpiritSolutionSpec(null, mechanic, dungeon);
    const solutionTriptych = dungeonMechanicSolutionTriptychSpec(null, mechanic, dungeon, spiritSolution);
    const herbValleyFresh = herbValleyHint && dungeon.area_id === herbValleyAreaId && !cleared;
    const fireRuinFresh = chapter3TradeHint && dungeon.area_id === fireRuinAreaId && !cleared;
    const activeRotation = activeHiddenRotationForDungeon(dungeon);
    const stampEntry = dungeonCompendiumEntry(dungeon, mechanic);
    const stampSummary = dungeonCompendiumEntrySummary(stampEntry);
    const failureInsight = dungeonFailureInsight(dungeon, mechanic);
    const failureSummary = dungeonFailureInsightSummary(failureInsight);
    const bossId = dungeonBossId(dungeon);
    const revealNote = revealedRotation?.area_id === dungeon.area_id
      ? ` · 今夜灯影已照出隐藏入口${revealUsedToday ? "（已启用）" : ""}`
      : "";
    const rotationPreview = activeRotation ? rewardPoolPreviewText(activeRotation.rare_drop_pool) : "";
    const node = document.createElement("div");
    node.className = `dungeon-card ${cleared ? "complete" : ""}${herbValleyFresh || fireRuinFresh ? " ready herb-valley-unlock" : ""}`;
    node.dataset.dungeonCardId = dungeon.area_id;
    node.innerHTML = `
      <strong>${dungeonName(dungeon)}${cleared ? " · 已通关" : herbValleyFresh || fireRuinFresh ? " · 新入口" : ""}</strong>
      <span>${dungeon.dungeon_type} · ${dungeon.floor_start}-${dungeon.floor_end} 层 · Boss ${bossName(bossId)}</span>
      <small>${mechanic?.puzzle_core || "探索、战斗、带回材料。"} · ${change ? `已生效：${change.title}` : `外部变化：${mechanic?.external_change || "洞天生态变化"}`}${revealNote} · Boss 技能 ${bossSkillsFor(bossId).slice(0, 2).map(skillName).join(" / ") || "待配置"}</small>
      ${herbValleyFresh ? `<small class="dungeon-live-hint">${herbValleyHint.cta}</small>` : ""}
      ${fireRuinFresh ? `<small class="dungeon-live-hint">${chapter3TradeHint.cta}</small>` : ""}
      ${dungeonMechanicSolutionTriptychMarkup(solutionTriptych)}
      ${activeRotation ? `<small>隐藏轮换：${dungeonRotationLabel(activeRotation, dungeon)} · ${dungeonRotationEntryEffect(activeRotation).entryText}${rotationPreview ? ` · 回响奖励 ${rotationPreview}` : ""}</small>` : ""}
      ${stampSummary ? `<small>节气印记：${stampSummary.title} · ${stampSummary.detail}</small>` : `<small>节气印记：尚未留下这处秘境的碎片或印记。</small>`}
      ${failureSummary ? `<div class="dungeon-failure-insight stored"><strong>${failureSummary.title}</strong><span>${failureSummary.body}</span><small>${failureSummary.detail}</small></div>` : ""}
      ${dungeonBossFamiliarityMarkup(failureInsight)}
      <div class="dungeon-actions">
        <button type="button" data-dungeon-enter="${dungeon.area_id}">进入秘境</button>
      </div>
    `;
    refs.dungeonPanel.append(node);
  }
}
