export function renderBuildPanelUi({
  refs,
  state,
  data,
  syncPondState,
  updateWorkshopLiveFocus,
  workshopProductionLineSpec,
  recipeMachine,
  spiritFinaleEffectPanelRows,
  spiritFinaleEffectSummary,
  spiritManorPanelHint,
  buildableBuildings,
  buildingUiSpec,
  multiplierText,
  workshopMultiplier,
  workshopSpiritBonus,
  recipeName,
  machineName,
  workshopProductionLineMarkup,
  workshopOrderBoardMarkup,
  workshopOrderBoardSpec,
  visibleOrders,
  itemName,
  canalRepairPrepSpec,
  pondCatchReady,
  pondWaterLevelSpec,
  pondWaterControlUnlocked,
  pondWaterMasteryUnlocked,
  pondLotusStageText,
  rareSpiritEventReady,
  rareSpiritEventDone,
  spiritLine,
  localize,
  pondWaterLevelText,
  yuelianRestRespiteActive,
  yuelianRestRespiteSkill,
  questTitle,
  hasItem,
  spiritManorBuildingId,
  spiritManorResourceStatus,
  spiritManorBuilding,
  canBuild,
  buildingName,
}) {
  refs.buildPanel.innerHTML = "";
  syncPondState();
  const workshopFocus = updateWorkshopLiveFocus();
  const workshopLine = workshopProductionLineSpec();
  const selectedRecipe = data.recipes.find((entry) => entry.recipe_id === state.selectedRecipeId) || data.recipes[0];
  const selectedMachine = selectedRecipe ? recipeMachine(selectedRecipe) : null;
  const workshopOrderMatch = workshopFocus.orderMatch || state.workshopAromaState?.history?.[0]?.orderMatch || null;
  const workshopFinaleRows = spiritFinaleEffectPanelRows(spiritFinaleEffectSummary(), "workshop");
  const spiritManorHint = spiritManorPanelHint();
  const allBuildingSpecs = buildableBuildings().map((building) => buildingUiSpec(building)).filter(Boolean);
  const summary = document.createElement("div");
  summary.className = "build-card built";
  summary.innerHTML = `
    <strong>工坊效率 ${multiplierText(workshopMultiplier() * workshopSpiritBonus())}</strong>
    <span>已建 ${state.builtBuildings.size}/${data.buildings.length} · 设备 ${state.unlockedMachines.size}/${data.machines.length} · 队列 ${state.workshopQueue.length}</span>
    <span>当前排产：${selectedRecipe ? recipeName(selectedRecipe) : "未选配方"} · ${selectedMachine ? machineName(selectedMachine) : "缺少设备"}</span>
    <div class="workshop-live-focus"><strong>火候看板：${workshopFocus.headline}</strong><span>${workshopFocus.detail}</span><small>精怪帮工 ${workshopFocus.helperCount} · 效率 ${workshopFocus.speedText} · ${workshopFocus.advice}</small></div>
    ${workshopProductionLineMarkup(workshopLine)}
    ${workshopOrderBoardMarkup(workshopOrderBoardSpec(visibleOrders(), 3))}
    ${workshopFinaleRows.length > 0 ? `<div class="workshop-finale-boost"><strong>终章灶火常驻</strong><span>${workshopFinaleRows.map((row) => `${row.spiritName}·${row.shortTitle}：${row.valueText}`).join(" / ")}</span><small>${workshopFinaleRows.map((row) => row.detail).join(" · ")}</small></div>` : ""}
    ${workshopOrderMatch ? `<div class="workshop-order-match ${workshopOrderMatch.ready ? "ready" : "pending"}"><strong>${workshopOrderMatch.ready ? "这锅已让订单可交" : "这锅已接上订单"}</strong><span>${workshopOrderMatch.outputItemName} → ${workshopOrderMatch.orderTitle} · ${workshopOrderMatch.orderNpc}</span><small>${workshopOrderMatch.ready ? `可直接交付，奖励 ${workshopOrderMatch.rewardGold} 灵石 / 声望 +${workshopOrderMatch.rewardFame}` : `还差 ${workshopOrderMatch.missingText || "余料"}，补齐后即可交付。`}</small></div>` : ""}
    <button type="button" data-workshop-queue="true" ${selectedRecipe ? "" : "disabled"}>安排当前配方入夜生产</button>
  `;
  refs.buildPanel.append(summary);

  for (const job of state.workshopQueue) {
    const node = document.createElement("div");
    const progress = 1 - Number(job.remainingWork || 0) / Math.max(1, Number(job.totalWork || 1));
    node.className = "build-card ready";
    node.innerHTML = `
      <strong>${job.recipeName} · ${Math.max(0, Math.round(progress * 100))}%</strong>
      <span>${job.machineType} · 剩余工时 ${Math.ceil(job.remainingWork)} · 约 ${Math.max(1, Math.ceil(Number(job.remainingWork || 0) / Math.max(1, 60 * Number(job.speed || 1))))} 夜 · 效率 ${multiplierText(job.speed || 1)}</span>
      <small>${job.honeyInfused ? "蜂蜜精调蜜中 · " : ""}完成后产出 ${itemName(job.outputItemId)} x${job.outputCount}</small>
    `;
    refs.buildPanel.append(node);
  }

  if (allBuildingSpecs.length > 0) {
    const repairPrep = canalRepairPrepSpec();
    const readyBuildCount = allBuildingSpecs.filter((spec) => !spec.built && spec.ready).length;
    const blockedBuildCount = allBuildingSpecs.filter((spec) => !spec.built && !spec.ready).length;
    const builtBuildCount = allBuildingSpecs.filter((spec) => spec.built).length;
    const leadBuild = allBuildingSpecs.find((spec) => !spec.built && (spec.ready || spec.buildingId === "build_broken_bridge_repair"))
      || allBuildingSpecs.find((spec) => !spec.built)
      || allBuildingSpecs[0];
    const overviewNode = document.createElement("div");
    overviewNode.className = "build-card build-overview";
    overviewNode.innerHTML = `
      <strong>洞天建设总览</strong>
      <span>把资源缺口、建筑价值和补料路线放在同一页，避免只看到一排成本数字。</span>
      <div class="build-overview-chips">
        <b class="${repairPrep?.built ? "done" : repairPrep?.ready ? "ready" : "pending"}">灵渠 ${repairPrep?.built ? "已复流" : repairPrep?.ready ? "可修" : "待补料"}</b>
        <b class="${readyBuildCount > 0 ? "ready" : "idle"}">可立即动工 ${readyBuildCount}</b>
        <b class="${blockedBuildCount > 0 ? "pending" : "done"}">待补材料 ${blockedBuildCount}</b>
      </div>
      <small>已建 ${builtBuildCount}/${allBuildingSpecs.length} · ${leadBuild ? `当前优先：${leadBuild.title}，${leadBuild.nextStepText}` : "继续沿着建设线扩张洞天。"}</small>
    `;
    refs.buildPanel.append(overviewNode);
    if (repairPrep) {
      const repairNode = document.createElement("div");
      repairNode.className = `build-card build-repair-prep build-readability-card ${repairPrep.stateClass}`;
      repairNode.innerHTML = `
        <strong>${repairPrep.title}</strong>
        <span>${repairPrep.headline}</span>
        <small>${repairPrep.roleText} · ${repairPrep.progressText}</small>
        <div class="build-cost-grid">
          ${repairPrep.costRows.map((row) => `
            <button type="button" class="build-cost-chip ${row.ready ? "ready" : "missing"}" data-build-cost-focus="${row.key}" data-build-cost-building="${repairPrep.buildingId}">
              <b>${row.label}</b>
              <span>${Math.min(row.owned, row.need)}/${row.need}${row.missing > 0 ? ` · 差 ${row.missing}` : " · 已到位"}</span>
              <small>${row.detail}</small>
            </button>
          `).join("")}
        </div>
        <small>${repairPrep.safety}</small>
        <div class="build-card-actions">
          <button type="button" data-build-focus="${repairPrep.buildingId}">看修复入口</button>
          <button type="button" data-build-id="${repairPrep.buildingId}" ${repairPrep.built || !repairPrep.ready ? "disabled" : ""}>${repairPrep.actionLabel}</button>
        </div>
      `;
      refs.buildPanel.append(repairNode);
    }
  }

  const pondQuest = data.sideQuests.find((entry) => entry.quest_id === "quest_side_0205_qinghe_pond");
  const pondBuilt = state.builtBuildings.has("build_fishpond_lv1");
  const pondKnown = pondBuilt || state.activeSideQuests.has("quest_side_0205_qinghe_pond") || state.claimedQuestRewards.has("quest_side_0205_qinghe_pond");
  if (pondQuest && pondKnown) {
    const pondNode = document.createElement("div");
    const ready = pondCatchReady();
    const waterSpec = pondWaterLevelSpec(state.pondState.waterLevel);
    const waterControl = pondWaterControlUnlocked();
    const waterMastery = pondWaterMasteryUnlocked();
    const lotusText = pondLotusStageText(state.pondState.lotusStage);
    const yuelianEvent = data.rareSpiritEvents.find((entry) => entry.spirit_id === "spirit_yuelian" && entry.event_stage === "first_meet");
    const yuelianEvolutionEvent = data.rareSpiritEvents.find((entry) => entry.entry_id === "rsea_017");
    const yuelianBondFinalEvent = data.rareSpiritEvents.find((entry) => entry.entry_id === "rsea_006");
    const yuelianReady = rareSpiritEventReady(yuelianEvent);
    const yuelianEvolutionReady = yuelianEvolutionEvent && rareSpiritEventReady(yuelianEvolutionEvent);
    const yuelianEvolutionDone = yuelianEvolutionEvent && rareSpiritEventDone(yuelianEvolutionEvent);
    const yuelianOwned = state.spirits.some((spirit) => (spirit.lineId || spiritLine(spirit.id)) === "spirit_line_yuelian");
    const moonPondReady = yuelianBondFinalEvent && rareSpiritEventReady(yuelianBondFinalEvent);
    const moonPondDone = yuelianBondFinalEvent && rareSpiritEventDone(yuelianBondFinalEvent);
    const lastCatchText = state.pondState.lastCatch
      ? `上次捞起 ${state.pondState.lastCatch.itemName} x${state.pondState.lastCatch.count} · 第 ${state.pondState.lastCatch.day} 天`
      : "还没试过第一网。";
    const detailText = !pondBuilt
      ? localize("subtitle_side_0205_beat_01", "池底还没死透。")
      : ready
        ? localize("subtitle_side_0205_beat_02", "去吧。以后这池水里，也该有点会游的热闹了。")
        : "今天已经试过一网，等明天水口再聚鱼。";
    const waterStatusText = pondBuilt
      ? `当前水位：${pondWaterLevelText(state.pondState.waterLevel)}`
      : "";
    const waterEffectText = pondBuilt
      ? waterControl
        ? waterSpec.level === 0
          ? "浅水适合歇水，但会压低露珠芹收成。"
          : waterSpec.level === 1
            ? "平水最稳露珠芹收成，今夜也会替水生田续水。"
            : "丰水更利于回鱼，今夜会替水生田续水。"
        : "先把青禾这条池塘线收尾，才能学会调水。"
      : "";
    const waterMasteryText = pondBuilt && waterMastery ? "青禾已经把稳水看口的诀窍教给你了。" : "";
    const ecologyText = pondBuilt
      ? `静池生态：${lotusText} · 夜护水生田 ${Number(state.pondState.nightWaterCropCareDays || 0)} 夜 · 留白静养 ${Number(state.pondState.restRespiteNights || 0)}/2 夜${yuelianReady ? " · 月莲精初见已可触发" : yuelianEvolutionReady ? " · 凝露留白已可触发" : yuelianEvolutionDone ? " · 凝露莲席正在收露" : moonPondReady ? " · 无月之月已可触发" : moonPondDone ? " · 月池静养已经落成" : yuelianOwned ? " · 月莲已经在池边住下" : ""}`
      : "";
    const yuelianRestText = pondBuilt && yuelianOwned
      ? yuelianRestRespiteActive()
        ? `凝露留白：庭院岗精怪每日饱腹消耗 -${Math.round(Number(yuelianRestRespiteSkill()?.effect_param_1 || 0.08) * 100)}%。`
        : `留白静养：当有精怪体力≤26、心情≤52或饱腹≤36时直接入夜，月莲会记下这份休息。`
      : "";
    pondNode.className = `build-card ${ready ? "ready" : pondBuilt ? "built" : "locked"}`;
    pondNode.innerHTML = `
      <strong>${questTitle(pondQuest)}${pondBuilt ? " · 灵池已成" : " · 等待动工"}</strong>
      <span>${pondBuilt ? (state.pondState.firstCatchDone ? "第一尾灵鱼已经认路回来" : "池底刚养住第一口活水") : "青禾说这口旧池还没死透，只差有人把水口重新稳住。"}${hasItem("item_tool_fishing_net", 1) ? " · 引水鱼网已备" : ""}</span>
      <small>${detailText} · ${lastCatchText}</small>
      ${waterStatusText ? `<small>${waterStatusText}</small>` : ""}
      ${waterEffectText || waterMasteryText ? `<small>${[waterEffectText, waterMasteryText].filter(Boolean).join(" · ")}</small>` : ""}
      ${ecologyText ? `<small>${ecologyText}</small>` : ""}
      ${yuelianRestText ? `<small>${yuelianRestText}</small>` : ""}
      ${pondBuilt ? `
        <div class="dungeon-actions">
          <button type="button" data-pond-action="catch" ${ready ? "" : "disabled"}>${state.pondState.firstCatchDone ? "再试一网" : "试网捞鱼"}</button>
          ${waterControl ? `<button type="button" data-pond-action="level_0" ${waterSpec.level === 0 ? "disabled" : ""}>调成浅水</button>` : ""}
          ${waterControl ? `<button type="button" data-pond-action="level_1" ${waterSpec.level === 1 ? "disabled" : ""}>调回平水</button>` : ""}
          ${waterControl ? `<button type="button" data-pond-action="level_2" ${waterSpec.level === 2 ? "disabled" : ""}>蓄成丰水</button>` : ""}
        </div>
      ` : ""}
    `;
    refs.buildPanel.append(pondNode);
  }

  if (spiritManorHint && !state.builtBuildings.has(spiritManorBuildingId)) {
    const resource = spiritManorHint.resource || spiritManorResourceStatus();
    const building = spiritManorBuilding();
    const ready = canBuild(building);
    const manorNode = document.createElement("div");
    manorNode.className = `build-card spirit-manor-plan ${ready ? "ready" : "locked"}`;
    manorNode.innerHTML = `
      <strong>${buildingName(building)}蓝图 · ${resource.done}/${resource.total} 项就绪</strong>
      <span>${spiritManorHint.detail}</span>
      <small>${resource.missing ? `缺口：${resource.missing}` : "材料齐备，阿檀已经把榫卯线画好。"} · 建成后解锁岗位总览、宿舍分配与情绪管理。</small>
      <button type="button" data-build-id="${spiritManorBuildingId}" ${ready ? "" : "disabled"}>${ready ? "按蓝图建造" : "材料未齐"}</button>
    `;
    refs.buildPanel.append(manorNode);
  }

  const readabilityBuildingSpecs = allBuildingSpecs.filter((spec) => spec.buildingId !== "build_broken_bridge_repair")
    .filter((spec) => spec.buildingId !== spiritManorBuildingId || !spiritManorHint || state.builtBuildings.has(spiritManorBuildingId));
  for (const spec of readabilityBuildingSpecs) {
    const node = document.createElement("div");
    node.className = `build-card build-readability-card ${spec.stateClass}`;
    node.innerHTML = `
      <strong>${spec.title}${spec.built ? " · 已建成" : ""}</strong>
      <span>${spec.subtitle}</span>
      <small>${spec.roleText}</small>
      <small>${spec.progressText}</small>
      <div class="build-cost-grid">
        ${spec.costRows.map((row) => `
          <button type="button" class="build-cost-chip ${row.ready ? "ready" : "missing"}" data-build-cost-focus="${row.key}" data-build-cost-building="${spec.buildingId}">
            <b>${row.label}</b>
            <span>${Math.min(row.owned, row.need)}/${row.need}${row.missing > 0 ? ` · 差 ${row.missing}` : " · 已到位"}</span>
            <small>${row.detail}</small>
          </button>
        `).join("")}
      </div>
      <small>${spec.nextStepText}</small>
      <div class="build-card-actions">
        <button type="button" data-build-focus="${spec.buildingId}">看建设卡</button>
        <button type="button" data-build-id="${spec.buildingId}" ${spec.built || !spec.ready ? "disabled" : ""}>${spec.actionLabel}</button>
      </div>
      <small>${spec.safety}</small>
    `;
    refs.buildPanel.append(node);
  }
}
