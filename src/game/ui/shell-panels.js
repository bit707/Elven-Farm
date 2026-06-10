export function renderDemoGuideProgressUi({
  refs,
  guide,
  earlyRewardPacingGuideSpec,
}) {
  const reward = earlyRewardPacingGuideSpec();
  refs.demoGuideProgress.classList.toggle("reward-live", reward.mode === "live");
  refs.demoGuideProgress.classList.toggle("reward-complete", reward.mode === "complete");
  refs.demoGuideProgress.replaceChildren();

  const loopLine = document.createElement("span");
  loopLine.className = "demo-guide-progress-line core-loop";
  loopLine.textContent = `核心循环 ${guide.completedSteps}/${guide.totalSteps} · ${guide.advice}`;
  refs.demoGuideProgress.append(loopLine);

  const rewardLine = document.createElement("span");
  rewardLine.className = `demo-guide-progress-line early-reward ${reward.mode}`;
  rewardLine.textContent = reward.total
    ? `前三小时正反馈 ${reward.done}/${reward.total} · ${reward.label}`
    : "前三小时正反馈配置载入中";
  refs.demoGuideProgress.append(rewardLine);

  if (reward.total) {
    const detail = document.createElement("small");
    detail.className = "demo-guide-progress-detail";
    detail.textContent = reward.detail;
    refs.demoGuideProgress.append(detail);
  }
}

export function renderDemoGuideUi({
  refs,
  demoGuideStep,
  actionForGuideStep,
  newPlayerFirstStepsMarkup,
  newPlayerFirstStepsSpec,
  grottoRevivalDirectorMarkup,
  renderDemoGuideProgress,
  controlIdForGuideAction,
  focusGuideControl,
}) {
  const guide = demoGuideStep();
  const action = actionForGuideStep(guide);
  refs.demoGuidePanel.dataset.guideStep = guide.id;
  refs.demoGuideTitle.textContent = guide.title;
  refs.demoGuideText.textContent = guide.text;
  if (refs.demoGuideFirstSteps) refs.demoGuideFirstSteps.innerHTML = newPlayerFirstStepsMarkup(newPlayerFirstStepsSpec(guide, action));
  if (refs.demoGuideRevival) refs.demoGuideRevival.innerHTML = grottoRevivalDirectorMarkup();
  renderDemoGuideProgress(guide);
  refs.demoGuideActionButton.textContent = action.cta || guide.cta || "执行下一步";
  refs.demoGuideActionButton.disabled = Boolean(action.disabled);
  refs.demoGuideActionButton.dataset.guideAction = action.action || "";
  focusGuideControl(controlIdForGuideAction(action.action, guide.controlId));
}

export function renderPanelTabsUi({
  refs,
  panelGroups,
  activePanelGroup,
}) {
  const active = activePanelGroup();
  refs.panelGroupTabs.innerHTML = panelGroups.map((group) => {
    const pressed = group.id === active.id ? "true" : "false";
    return `
      <button type="button" data-panel-group="${group.id}" aria-pressed="${pressed}">
        <strong>${group.label}</strong>
        <span>${group.hint}</span>
      </button>
    `;
  }).join("");
}

export function renderSelectedPlotCardUi({
  refs,
  selectedPlotDetailSpec,
  selectedPlotRouteActionsMarkup,
}) {
  if (!refs.selectedPlotCard) return;
  const spec = selectedPlotDetailSpec();
  const actionButton = spec.actionId
    ? `<button type="button" data-selected-plot-action="${spec.actionId}">执行：${spec.action}</button>`
    : `<button type="button" disabled>先选地块</button>`;
  refs.selectedPlotCard.className = `selected-plot-card ${spec.state}`;
  refs.selectedPlotCard.innerHTML = `
    <strong>${spec.title}</strong>
    <span>${spec.subtitle}</span>
    ${spec.veinMemory ? `<small class="selected-plot-vein-memory"><b>${spec.veinMemory.title}</b>${spec.veinMemory.text} · ${spec.veinMemory.detail}</small>` : ""}
    ${spec.firstSeedMemory ? `<small class="selected-plot-first-seed-memory"><b>${spec.firstSeedMemory.title}</b>${spec.firstSeedMemory.text} · ${spec.firstSeedMemory.detail}</small>` : ""}
    ${spec.sproutMemory ? `<small class="selected-plot-sprout-memory${spec.sproutMemory.joined ? " joined" : ""}"><b>${spec.sproutMemory.title}</b>${spec.sproutMemory.text} · ${spec.sproutMemory.detail}</small>` : ""}
    ${spec.lines.map((line) => `<small>${line}</small>`).join("")}
    ${spec.seedRoute ? `<small class="selected-plot-seed-route">种后去向：${spec.seedRoute.badge} · ${spec.seedRoute.detail}</small>` : ""}
    ${selectedPlotRouteActionsMarkup(spec.seedRoute)}
    ${spec.growingRoute ? `<small class="selected-plot-growing-route">${spec.growingRoute.liveText}：${spec.growingRoute.badge} · ${spec.growingRoute.detail}</small>` : ""}
    ${selectedPlotRouteActionsMarkup(spec.growingRoute)}
    <div class="selected-plot-card-action">
      <em>建议：${spec.action}</em>
      ${actionButton}
    </div>
  `;
}
