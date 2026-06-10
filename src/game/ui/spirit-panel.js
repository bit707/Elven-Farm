export function renderSpiritPanelUi({
  refs,
  state,
  data,
  clearCanvasSpiritCareFocus,
  firstSpiritPromiseMarkup,
  canvasSpiritCareFocusMarkup,
  spiritJobSynergyNetworkMarkup,
  spiritAutomationPromenadeMarkup,
  ensureSpiritJobs,
  syncRareSpiritLifeState,
  spiritVisualProfile,
  ecologyComboActive,
  spiritLine,
  rareSpiritMomentForSpirit,
  rareSpiritGiftStatusText,
  normalizeSpiritInteractionState,
  spiritSignatureSkillText,
  spiritJobPersonaSpec,
  spiritWorkRangeSpec,
  spiritVoiceMomentSpec,
  spiritJobSynergyForSpirit,
  jobName,
  spiritJobSpecialtyBonus,
  spiritEventReady,
  spiritEventSceneReady,
  spiritEventTriggerHint,
  spiritEventStageLabel,
  localize,
  spiritDailyChoreMarkup,
  rareSpiritCompanionCardMarkup,
  spiritIdentityMemoryMarkup,
  spiritCompanionCareMarkup,
  ecologyComboName,
  renderTradeRoutes,
}) {
  refs.spiritList.innerHTML = "";
  if (state.spirits.length === 0) {
    clearCanvasSpiritCareFocus();
    const promiseMarkup = firstSpiritPromiseMarkup();
    if (promiseMarkup) {
      const promiseNode = document.createElement("div");
      promiseNode.innerHTML = promiseMarkup.trim();
      refs.spiritList.append(promiseNode.firstElementChild);
    }
    const emptyNode = document.createElement("div");
    emptyNode.className = "spirit-row";
    emptyNode.innerHTML = "尚未有精怪入队";
    refs.spiritList.append(emptyNode);
    renderTradeRoutes();
    return;
  }

  const canvasCareMarkup = canvasSpiritCareFocusMarkup();
  if (canvasCareMarkup) {
    const focusNode = document.createElement("div");
    focusNode.innerHTML = canvasCareMarkup.trim();
    refs.spiritList.append(focusNode.firstElementChild);
  }

  const synergyNetworkMarkup = spiritJobSynergyNetworkMarkup();
  if (synergyNetworkMarkup) {
    const synergyNode = document.createElement("div");
    synergyNode.innerHTML = synergyNetworkMarkup.trim();
    refs.spiritList.append(synergyNode.firstElementChild);
  }

  const automationPromenadeMarkup = spiritAutomationPromenadeMarkup();
  if (automationPromenadeMarkup) {
    const automationNode = document.createElement("div");
    automationNode.innerHTML = automationPromenadeMarkup.trim();
    refs.spiritList.append(automationNode.firstElementChild);
  }

  for (const spirit of state.spirits) {
    ensureSpiritJobs(spirit);
    syncRareSpiritLifeState();
    const visual = spiritVisualProfile(spirit);
    const activeCombos = data.spiritEcologyCombos.filter(ecologyComboActive);
    const nextCombo = activeCombos[0] || data.spiritEcologyCombos[0];
    const lineEvents = (data.spiritEventsByLine.get(spirit.lineId || spiritLine(spirit.id)) || []).slice(0, 3);
    const memoryCount = data.spiritMemoryFlags.filter((memory) => memory.spirit_line_id === (spirit.lineId || spiritLine(spirit.id)) && state.spiritMemoryFlags.has(memory.memory_flag_id)).length;
    const rareMoment = rareSpiritMomentForSpirit(spirit);
    const rareGiftText = rareSpiritGiftStatusText(spirit);
    const interaction = normalizeSpiritInteractionState(state.spiritInteractionState).last;
    const signatureSkillText = spiritSignatureSkillText(spirit);
    const jobPersona = spiritJobPersonaSpec(spirit, spirit.job);
    const workRange = spiritWorkRangeSpec(spirit, spirit.job);
    const voiceMoment = spiritVoiceMomentSpec(spirit);
    const synergy = spiritJobSynergyForSpirit(spirit);
    const joinFeedback = state.spiritJoinFeedback?.spiritId === spirit.id ? state.spiritJoinFeedback : null;
    const evolutionFeedback = state.spiritEvolutionFeedback?.spiritId === spirit.id ? state.spiritEvolutionFeedback : null;
    const spiritLineId = spirit.lineId || spiritLine(spirit.id);
    const joinCard = joinFeedback
      ? `
        <div class="spirit-join-card">
          <strong>${joinFeedback.label} · ${joinFeedback.source === "first_join" ? "伙伴栏已开放" : "新伙伴响应"}</strong>
          <span>${joinFeedback.detail}</span>
          <small>${joinFeedback.cta} · 当前岗位 ${jobName(joinFeedback.job)}</small>
        </div>
      `
      : "";
    const evolutionCard = evolutionFeedback
      ? `
        <div class="spirit-join-card evolution-live">
          <strong>${evolutionFeedback.stageName} · 进化完成</strong>
          <span>${evolutionFeedback.previousName} -> ${evolutionFeedback.spiritName} · ${evolutionFeedback.rangeBefore} -> ${evolutionFeedback.rangeAfter}</span>
          <small>${evolutionFeedback.cta} · 留下 ${evolutionFeedback.rewardText}</small>
        </div>
      `
      : "";
    const interactionCard = interaction?.spiritId === spirit.id
      ? `
        <div class="spirit-interaction-card">
          <strong>伙伴回应 · ${interaction.type === "mood_repair" ? "安抚小事" : interaction.type === "theater" ? "小剧场" : interaction.type === "feed" ? "喂食" : "摸摸"}</strong>
          <span>${interaction.actionText}</span>
          <small>“${interaction.quote}” · ${interaction.floatingText || `羁绊 +${interaction.bondGain}`} · 心情 ${interaction.mood} · 饱腹 ${interaction.hunger}</small>
          ${interaction.extraText ? `<small>${interaction.extraText}</small>` : ""}
        </div>
      `
      : "";
    const jobButtons = ["farm", "workshop", "shop", "patrol", "expedition", "garden"].map((job) => {
      const specialty = spiritJobSpecialtyBonus(spirit, job);
      return `<button type="button" data-spirit-job="${job}" data-spirit-id="${spirit.id}">${jobName(job)}${specialty > 0 ? ` +${Math.round(specialty * 100)}%` : ""}${spirit.job === job ? " ✓" : ""}</button>`;
    }).join("");
    const eventRows = lineEvents.map((event) => {
      const ready = spiritEventReady(event);
      const done = state.completedSpiritEvents.has(event.spirit_event_id);
      const replayReady = done && spiritEventSceneReady(event);
      const statusText = done
        ? replayReady ? "可回看" : "已记忆"
        : ready ? "可触发" : spiritEventTriggerHint(event);
      const buttonMarkup = replayReady
        ? `<button type="button" data-spirit-event-scene="${event.spirit_event_id}">回看演出</button>`
        : `<button type="button" data-spirit-event="${event.spirit_event_id}" ${!ready ? "disabled" : ""}>${done ? "已完成" : "触发事件"}</button>`;
      return `
        <div class="spirit-event-row ${done ? "done" : ready ? "ready" : "locked"}" data-spirit-event-row="${event.spirit_event_id}">
          <span>${spiritEventStageLabel(event.event_stage)} · ${localize(event.dialogue_key, event.note)} · ${statusText}</span>
          ${buttonMarkup}
        </div>
      `;
    }).join("");
    const row = document.createElement("div");
    row.className = `spirit-row${joinFeedback ? " join-live" : ""}`;
    row.dataset.spiritId = spirit.id;
    row.dataset.spiritLine = spiritLineId;
    row.innerHTML = `
      <div class="spirit-title"><span class="spirit-glyph" style="--spirit-base:${visual.base};--spirit-accent:${visual.accent};">${visual.glyph}</span><strong>${spirit.name}</strong></div>
      <span>视觉定位：${visual.label} · 画面岗位：${jobName(spirit.job)} · ${spirit.job === "farm" ? "浇水灵珠" : spirit.job === "workshop" ? "灶火星屑" : spirit.job === "shop" ? "招客话牌" : spirit.job === "expedition" ? "探路虚线" : spirit.job === "patrol" ? "巡逻灯域" : "庭院花息"}</span>
      ${joinCard}
      ${evolutionCard}
      <div class="spirit-job-persona ${jobPersona.tone}">
        <strong>${jobPersona.label} · ${jobPersona.action}</strong>
        <span>关注：${jobPersona.focus} · 效率 ${jobPersona.efficiency} · 今日工作 ${spirit.assignments} 次</span>
        <small>${jobPersona.specialty} · ${jobPersona.advice}</small>
      </div>
      ${voiceMoment ? `
        <small class="spirit-voice-line companion">
          <b>${voiceMoment.label}</b>“${voiceMoment.text}” · ${voiceMoment.detail} · ${voiceMoment.candidates.map((entry) => `${entry.label}：${entry.text}`).join(" / ")}
        </small>
      ` : ""}
      ${spiritDailyChoreMarkup(spirit)}
      ${synergy ? `<div class="spirit-job-synergy"><strong>${synergy.label} · 昨夜搭班</strong><span>${synergy.spirits.join(" + ")} · ${synergy.rewardText}</span><small>${synergy.detail}</small></div>` : ""}
      <div class="spirit-work-range ${workRange.evolved ? "evolved" : "seed"}">
        <strong>${workRange.stageName} · ${workRange.jobHint}</strong>
        <span>${workRange.rangeLabel} · 面积 ${workRange.area} 格 · 基础工力 ${workRange.workPower.toFixed(2)}</span>
        <small>${workRange.deltaText} · ${workRange.nextText}</small>
      </div>
      ${rareSpiritCompanionCardMarkup(spirit)}
      ${spiritIdentityMemoryMarkup(spirit)}
      ${spiritCompanionCareMarkup(spirit)}
      <span>岗位熟练：农田 Lv.${spirit.jobLevels.farm || 0} / 工坊 Lv.${spirit.jobLevels.workshop || 0} / 店铺 Lv.${spirit.jobLevels.shop || 0} / 远征 Lv.${spirit.jobLevels.expedition || 0}</span>
      <span>羁绊 Lv.${spirit.bondLevel || 1} · EXP ${spirit.bondExp || 0} · 心情 ${Math.round(spirit.mood || 0)} · 饱腹 ${Math.round(spirit.hunger || 0)} · 体力 ${Math.round(spirit.stamina || 0)}</span>
      <div class="spirit-actions">
        <button type="button" data-spirit-action="pet" data-spirit-id="${spirit.id}">摸摸</button>
        <button type="button" data-spirit-action="feed" data-spirit-id="${spirit.id}">喂食</button>
        <button type="button" data-rare-spirit-theater="${spirit.id}" ${rareMoment ? "" : "disabled"}>${rareMoment ? "看今日小剧场" : "小剧场待触发"}</button>
        ${jobButtons}
        <button type="button" data-spirit-expedition="${data.spiritExpeditions[0]?.expedition_id || ""}" data-spirit-id="${spirit.id}">短途派遣</button>
      </div>
      <small>生态共鸣：${nextCombo ? `${ecologyComboName(nextCombo)} · ${activeCombos.length > 0 ? "已激活" : "待补齐建筑/精怪"}` : "等待生态配置"}</small>
      <small>个体记忆：${memoryCount}/${lineEvents.length} · 记忆会影响岗位效率与第二年试炼评分。</small>
      ${signatureSkillText ? `<small>${signatureSkillText}</small>` : ""}
      ${rareMoment ? `<small>稀有日常：${rareMoment.focus} · ${rareMoment.action} · “${rareMoment.quote}”</small>` : ""}
      ${rareGiftText ? `<small>${rareGiftText}</small>` : ""}
      ${interactionCard}
      <div class="spirit-event-list">${eventRows}</div>
    `;
    refs.spiritList.append(row);
  }
  renderTradeRoutes();
}
