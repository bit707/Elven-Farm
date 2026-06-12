export function spendStaminaRuntime(value = 0, {
  state = {},
  addLog = () => null,
} = {}) {
  if (state.stamina < value) {
    addLog("体力不足", "入夜结算可以恢复体力。");
    return false;
  }
  state.stamina -= value;
  return true;
}

export function gridMetricsRuntime(plotCount = 0) {
  const cols = plotCount > 36 ? 8 : 6;
  return {
    cols,
    tile: cols === 8 ? 62 : 72,
    gap: 8,
    originX: cols === 8 ? 260 : 300,
    originY: 142,
  };
}

export function moveSelectionRuntime(dx = 0, dy = 0, {
  state = {},
  render = () => null,
} = {}) {
  const next = {
    x: state.selected.x + dx,
    y: state.selected.y + dy,
  };
  const plot = state.plots.find((entry) => entry.x === next.x && entry.y === next.y);
  if (!plot) return false;
  state.selected = next;
  render();
  return true;
}

export function primaryActionRuntime({
  selectedPlot = () => null,
  activeDialogue = [],
  skipCutscene = () => null,
  clearDebris = () => null,
  plant = () => null,
  harvest = () => null,
  water = () => null,
  sleep = () => null,
} = {}) {
  const plot = selectedPlot();
  if (activeDialogue.length > 0) return skipCutscene();
  if (!plot) return undefined;
  if (plot.debris) return clearDebris();
  if (!plot.cropId) return plant();
  if (plot.mature) return harvest();
  if (!plot.watered) return water();
  return sleep();
}
