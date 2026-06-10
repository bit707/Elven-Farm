export function renderSolarTrialPanelUi({
  refs,
  state,
  data,
  dungeonCompendiumProgress,
  year2Unlocked,
  solarTrialName,
  solarTrialUnlocked,
  normalizeActiveSolarTrialRun,
  solarTrialRunProgress,
  evaluateSolarTrialScore,
  solarTrialRank,
  rewardPoolEntries,
  solarTrialCompendiumSupport,
  solarTrialActionCardsMarkup,
  solarTrialBreakdownMarkup,
  solarTrialRunLogMarkup,
  seasonalCropGuideKeyForTermId,
  localize,
  conditionLabel,
  splitTags,
}) {
  refs.solarTrialPanel.innerHTML = "";
  const active = state.activeSolarTrial;
  const compendium = dungeonCompendiumProgress();
  const summary = document.createElement("div");
  summary.className = "solar-trial-summary";
  if (!year2Unlocked()) {
    summary.innerHTML = `
      <strong>第二年节气试炼 未开卷</strong>
      <span>这些 3 天挑战会在蟠桃大宴后接住种植、店铺、秘境、风险和精怪养成，成为通关后的长期目标。</span>
      <small>当前可先积累节气印记 ${compendium.unlocked}/${compendium.total}、Boss 通关印记 ${compendium.cleared}；终章收束后，这些印记会转化为试炼共鸣。</small>
    `;
    refs.solarTrialPanel.append(summary);
    return;
  }
  summary.innerHTML = `
    <strong>第二年节气试炼 ${state.completedSolarTrials.size}/${data.year2SolarTrials.length}</strong>
    <span>${active ? `${solarTrialName(data.solarTrialsById.get(active.trialId))} 进行中，今天可手动写入一段年轮手账` : "选择一个试炼，将种植、店铺、风险、秘境和精怪培养压成 3 天挑战。"}</span>
    <small>节气印记 ${compendium.unlocked}/${compendium.total} · Boss 通关印记 ${compendium.cleared} · 尚存碎片 ${compendium.shards}</small>
  `;
  refs.solarTrialPanel.append(summary);

  for (const trial of data.year2SolarTrials) {
    const unlocked = solarTrialUnlocked(trial);
    const done = state.completedSolarTrials.has(trial.trial_id);
    const running = active?.trialId === trial.trial_id;
    const run = running ? normalizeActiveSolarTrialRun(trial) : null;
    const progress = solarTrialRunProgress(run, trial);
    const score = evaluateSolarTrialScore(trial);
    const rewardCount = rewardPoolEntries(trial.reward_pool_id).length;
    const compendiumSupport = solarTrialCompendiumSupport(trial);
    const actionMarkup = running ? solarTrialActionCardsMarkup(trial, run, progress) : "";
    const breakdownMarkup = running || unlocked ? solarTrialBreakdownMarkup(trial, run) : "";
    const logMarkup = running ? solarTrialRunLogMarkup(run) : "";
    const guideKey = seasonalCropGuideKeyForTermId(trial.term_id);
    const guideFocusLabel = guideKey === "seasonal_crop_bailu_yiner"
      ? "查看白露导览"
      : guideKey === "seasonal_crop_dongzhi_festival"
        ? "查看冬至导览"
        : "看节气作物导览";
    const guideFocusSource = guideKey === "seasonal_crop_bailu_yiner"
      ? "seasonal-crop-guide.bailu"
      : guideKey === "seasonal_crop_dongzhi_festival"
        ? "seasonal-crop-guide.dongzhi"
        : "year2_goal";
    const node = document.createElement("div");
    node.className = `solar-trial-card${running ? " active" : ""}${done ? " complete" : ""}${unlocked ? "" : " locked"}`;
    node.innerHTML = `
      <strong>${solarTrialName(trial)} · 预估 ${score} 分 / ${solarTrialRank(score)} 级${done ? " · 已完成" : ""}</strong>
      <span>${localize(data.solarTermsById.get(trial.term_id)?.term_name_key, trial.term_id)} · ${running ? `${progress.phaseLabel} ${progress.dayIndex}/${progress.totalDays} · ${progress.actedToday ? "今日已记录" : "今日待推进"} · 第 ${active.endDay} 天结算` : `准备 ${trial.prep_days} 天 · 挑战 ${trial.challenge_days} 天`} · ${conditionLabel(trial.unlock_condition_group)}</span>
      <span>推荐精怪：${splitTags(trial.recommended_spirit_lines).join(" / ")} · 循环标签：${splitTags(trial.required_loop_tags).join(" / ")}</span>
      <small>评分：${trial.score_formula} · 奖励池 ${trial.reward_pool_id} (${rewardCount} 项)</small>
      <small>节气印记：${compendiumSupport.summary}${compendiumSupport.bonus > 0 ? ` · 共鸣 +${compendiumSupport.bonus}` : " · 还未形成有效共鸣"}</small>
      ${running ? `<small class="solar-trial-phase-note">${progress.phaseNote}</small>` : ""}
      ${breakdownMarkup}
      ${actionMarkup}
      ${logMarkup}
      ${guideKey ? `<button type="button" class="solar-mood-stamp-guide" data-seasonal-crop-guide-focus="${guideKey}" data-seasonal-crop-guide-source="${guideFocusSource}">${guideFocusLabel}</button>` : ""}
      <button type="button" data-solar-trial="${trial.trial_id}" ${!unlocked || done || Boolean(active) ? "disabled" : ""}>开启试炼</button>
    `;
    refs.solarTrialPanel.append(node);
  }
}
