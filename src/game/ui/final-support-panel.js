export function renderFinalSupportPanelUi({
  refs,
  state,
  data,
  finalSupportPower,
  finalSupportEffectText,
  finalSupportReady,
  finalSupportForeshadow,
  finalSupportPrepTiers,
  finalSupportStages,
  conditionMet,
  cutsceneTitle,
  npcName,
  conditionLabel,
}) {
  refs.finalSupportPanel.innerHTML = "";
  const bundles = data.finalSupportBundles;
  const unlockedCount = bundles.filter((bundle) => state.unlockedFinalSupports.has(bundle.bundle_id)).length;
  const stageCount = data.finalSupportStages.length;
  const appliedStageCount = state.appliedFinalSupportStages.size;
  const summary = document.createElement("div");
  summary.className = `final-support-summary ${unlockedCount >= 4 ? "ready" : "pending"}`;
  summary.innerHTML = `
    <strong>终阵准备 ${unlockedCount}/${bundles.length} · 阶段 ${appliedStageCount}/${stageCount}</strong>
    <span>累计支援强度 ${finalSupportPower().toFixed(2)} · 激活 NPC 支援后可将好感、店铺、建设与演出转化为最终战准备。</span>
  `;
  refs.finalSupportPanel.append(summary);

  const effects = Object.entries(state.finalSupportEffects || {});
  if (effects.length) {
    const effectNode = document.createElement("div");
    effectNode.className = "final-support-effects";
    effectNode.innerHTML = effects
      .map(([target, value]) => `<span>${finalSupportEffectText(target, value)}</span>`)
      .join("");
    refs.finalSupportPanel.append(effectNode);
  }

  for (const bundle of bundles) {
    const unlocked = state.unlockedFinalSupports.has(bundle.bundle_id);
    const ready = finalSupportReady(bundle);
    const foreshadow = finalSupportForeshadow(bundle);
    const prepTiers = finalSupportPrepTiers(bundle);
    const stages = finalSupportStages(bundle.bundle_id);
    const node = document.createElement("div");
    node.dataset.finalSupportBundle = bundle.bundle_id;
    node.className = `final-support-card ${unlocked ? "unlocked" : ready ? "ready" : "locked"} foreshadow-${foreshadow.tone}`;
    const stageHtml = stages.map((stage) => {
      const stageReady = conditionMet(stage.trigger_condition_group);
      const applied = state.appliedFinalSupportStages.has(stage.stage_id);
      const playable = unlocked && stageReady && !applied;
      return `
        <div class="final-support-stage ${applied ? "applied" : stageReady ? "ready" : "locked"}">
          <span>${stage.stage_phase} · ${finalSupportEffectText(stage.effect_target, stage.effect_value)} · ${cutsceneTitle(stage.cutscene_id)}</span>
          <button type="button" data-final-support-stage="${stage.stage_id}" ${!playable ? "disabled" : ""}>${applied ? "已写入" : "应用阶段"}</button>
        </div>
      `;
    }).join("");
    const prepHtml = prepTiers.length
      ? `<div class="final-support-prep-list">${prepTiers.map((tier) => `
        <div class="final-support-prep ${tier.claimed ? "claimed" : tier.ready ? "ready" : "locked"}">
          <span>${tier.label} · 需 ${tier.required} 段记忆 · ${finalSupportEffectText(tier.effectTarget, tier.effectValue)}</span>
          <button type="button" data-final-support-prep="${bundle.bundle_id}" data-final-support-prep-tier="${tier.tier}" ${tier.claimed || !tier.ready ? "disabled" : ""}>${tier.claimed ? "已写入" : tier.ready ? "领取预备支援" : "伏笔不足"}</button>
        </div>
      `).join("")}</div>`
      : "";
    node.innerHTML = `
      <strong>${npcName(bundle.npc_id)} · ${bundle.support_type}</strong>
      <span>${bundle.note}</span>
      <div class="final-support-foreshadow ${foreshadow.tone}">
        <b>${foreshadow.label} · ${foreshadow.percent}%</b>
        <span>${foreshadow.detail}</span>
        <small>${foreshadow.nextText || "终章群像支援将读取全队关系铺垫"}</small>
        <i style="--support-progress:${foreshadow.percent}%"></i>
      </div>
      <small>条件：${conditionLabel(bundle.require_condition_group)} · 效果：${finalSupportEffectText(bundle.effect_target, bundle.effect_value)} · VFX ${bundle.vfx_id}</small>
      ${prepHtml}
      <button type="button" data-final-support="${bundle.bundle_id}" ${!ready || unlocked ? "disabled" : ""}>${unlocked ? "支援已到位" : ready ? "激活支援" : "条件未满足"}</button>
      <div class="final-support-stage-list">${stageHtml}</div>
    `;
    refs.finalSupportPanel.append(node);
  }
}
