export function plotClearedVeinMemoryUi({ plot = null, restoredGrottoVeinPlots }) {
  if (!plot || (!plot.clearedDebris && !plot.clearedDay)) return null;
  const veinIndex = restoredGrottoVeinPlots().findIndex((entry) => entry.x === plot.x && entry.y === plot.y);
  const index = veinIndex >= 0 ? veinIndex + 1 : 1;
  const debrisLabel = plot.clearedDebris === "stone" ? "碎石" : plot.clearedDebris ? "荒草" : "旧障碍";
  return {
    title: `复苏灵纹 #${index}`,
    text: `清开${debrisLabel}后留下的地面灵纹，洞天灵息从这里回流 +1。`,
    detail: plot.clearedDay ? `第 ${plot.clearedDay} 天露纹` : "第一处灵纹已经可见",
  };
}

export function plotFirstSeedMemoryUi({ plot = null, itemName }) {
  if (!plot?.firstSeeded) return null;
  const seedName = itemName(plot.firstSeededSeedId || plot.seedItemId || "");
  const cropName = itemName(plot.firstSeededCropId || plot.cropId || "");
  const dayText = plot.firstSeededDay ? `第 ${plot.firstSeededDay} 天入土` : "第一次播种";
  return {
    title: "第一籽入土",
    text: `${seedName || cropName || "第一粒种子"}从这里接住土气，第一块田的生产循环由此开始。`,
    detail: dayText,
  };
}

export function plotSpiritSproutMemoryUi({
  plot = null,
  state,
  syncSpiritSproutState,
  currentSpiritSproutPlot,
  spiritSproutAnomalyCopy,
}) {
  if (!plot) return null;
  syncSpiritSproutState();
  const sprout = state.spiritSproutState;
  if (!["tremble", "peek", "born"].includes(sprout.stage)) return null;
  const sproutPlot = currentSpiritSproutPlot();
  const samePlot = sproutPlot
    ? sproutPlot.x === plot.x && sproutPlot.y === plot.y
    : sprout.lastPlot?.x === plot.x && sprout.lastPlot?.y === plot.y;
  if (!samePlot) return null;
  const luoboJoined = state.completed.has("spirit")
    || state.spirits.some((spirit) => spirit.id === "spirit_luobo_01" || spirit.lineId === "spirit_line_luobo");
  if (sprout.stage === "born" && luoboJoined) {
    return {
      title: "第一只精怪入队",
      text: "萝卜精就是从这块田转身露出小脸，伙伴栏已经开放，生产循环从手动劳作变成可以请伙伴接手。",
      detail: "下一步：选中待浇田格，到伙伴栏点「让精怪协助」看 3x3 自动浇水；这里只解释，不会自动协助或消耗体力。",
      joined: true,
    };
  }
  const copy = spiritSproutAnomalyCopy(sprout.stage);
  const stageLabel = sprout.stage === "born" ? "即将入队" : sprout.stage === "peek" ? "探头待收" : "轻颤预告";
  return {
    title: "成精预告",
    text: `${stageLabel}：${copy.headline}。${copy.body}`,
    detail: `${copy.action} · 只解释这块田，不会自动收获、入夜或触发成精。`,
  };
}
