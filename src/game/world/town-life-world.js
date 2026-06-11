export function drawTownLifeErrandRouteWorldFocusWorld({
  ctx,
  width = 960,
  height = 640,
  focus = null,
  progress = 0,
  fade = 1,
  motion = 0,
  pulse = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !focus?.source || !focus?.target) return false;
  const source = focus.source;
  const target = focus.target;
  const safeProgress = Math.max(0, Math.min(1, Number(progress || 0)));
  const safeFade = Math.max(0, Math.min(1, Number(fade ?? 1)));
  const midX = (source.x + target.x) / 2;
  const midY = Math.min(source.y, target.y) - 76;
  const cardX = Math.max(24, Math.min(width - 250, target.x + 18));
  const cardY = Math.max(58, Math.min(height - 98, target.y - 74));

  ctx.save();
  ctx.globalAlpha = safeFade;
  ctx.strokeStyle = focus.accent || "#4d91a6";
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 18;
  ctx.beginPath();
  ctx.moveTo(source.x, source.y);
  ctx.quadraticCurveTo(midX, midY, target.x, target.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = focus.soft || "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.ellipse(target.x, target.y + 12, 54 + pulse, 22 + pulse * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = focus.accent || "#4d91a6";
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(target.x, target.y, 18 + pulse * 0.35, 0, Math.PI * 2);
  ctx.stroke();

  for (let index = 0; index < 5; index += 1) {
    const t = reducedMotion ? index / 4 : (safeProgress * 1.4 + index * 0.18) % 1;
    const x = (1 - t) * (1 - t) * source.x + 2 * (1 - t) * t * midX + t * t * target.x;
    const y = (1 - t) * (1 - t) * source.y + 2 * (1 - t) * t * midY + t * t * target.y;
    ctx.fillStyle = index % 2 ? "rgba(255, 253, 245, 0.86)" : focus.accent || "#4d91a6";
    ctx.beginPath();
    ctx.arc(x, y, index % 2 ? 3.2 : 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, cardX, cardY, 226, 82, "rgba(255, 248, 232, 0.94)");
  ctx.fillStyle = focus.soft || "rgba(77, 145, 166, 0.18)";
  ctx.beginPath();
  ctx.roundRect(cardX + 14, cardY + 14, 34, 34, 12);
  ctx.fill();
  ctx.fillStyle = focus.accent || "#4d91a6";
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(focus.glyph || "备", cardX + 24, cardY + 37);
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(`备货路线 · ${String(focus.label || "下一步").slice(0, 8)}`, cardX + 58, cardY + 28);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${String(focus.itemName || "托付物").slice(0, 8)} -> ${String(target.label || "目标").slice(0, 8)}`, cardX + 58, cardY + 48);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText((focus.missing > 0 ? `还差 ${focus.missing} 份 · ${focus.title}` : `已够数 · ${focus.title}`).slice(0, 24), cardX + 18, cardY + 70);
  ctx.restore();
  return true;
}

export function drawLivingWorldSummaryWorld({
  ctx,
  livingState = null,
  lineLimit = 7,
  builtStructureSlotCount = 0,
  shopReportCount = 0,
  careChainStage = null,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !livingState) return false;
  const lines = [];
  if (livingState.farmSpirits > 0 || livingState.wateredPlots > 0 || livingState.maturePlots > 0) {
    lines.push(`灵田 ${livingState.farmSpirits} 岗 · 已润 ${livingState.wateredPlots} 格 · 成熟 ${livingState.maturePlots} 格`);
  }
  if (livingState.visibleBuildings > 1) {
    const parts = [`建筑 ${livingState.visibleBuildings}/${builtStructureSlotCount}`];
    if (livingState.workshopBuildings > 0) parts.push(`工坊 ${livingState.workshopBuildings}`);
    if (livingState.shopBuildings > 0) parts.push(`铺面 ${livingState.shopBuildings}`);
    lines.push(parts.join(" · "));
  }
  if (livingState.queue.length > 0 || livingState.workshopSpirits > 0) {
    lines.push(`工坊 ${livingState.workshopSpirits} 岗 · 排产 ${livingState.queue.length} 条`);
  }
  if (livingState.shopSpirits > 0 || shopReportCount > 0) {
    lines.push(`旧铺 ${livingState.shopSpirits} 岗 · 主题 ${livingState.shopTheme?.note || livingState.shopTheme?.theme_tag || "陈列中"}`);
  }
  if (livingState.tradeRuns.length > 0 || livingState.returnedRuns.length > 0) {
    lines.push(`商路 在途 ${livingState.tradeRuns.length} 支 · 今日返航 ${livingState.returnedRuns.length} 支`);
  }
  if (livingState.cohabRoutes.length > 0) {
    const buffText = livingState.activeBuffs[0] ? ` · 余韵 ${livingState.activeBuffs[0].label}` : "";
    lines.push(`同住 ${livingState.cohabRoutes.length} 线安家${buffText}`);
  }
  if (livingState.ecologyGarden && (livingState.ecologyGarden.activeCount > 0 || livingState.ecologyGarden.claimedGoalCount > 0)) {
    const garden = livingState.ecologyGarden;
    lines.push(`庭院 ${garden.tier?.shortLabel || "初成"} ${garden.score} 分 · 已收 ${garden.claimedGoalCount}/${garden.totalCombos} · ${garden.topCombo?.name || garden.nextCombo?.name || "待起势"}`);
  }
  if (livingState.pondBuilt) {
    lines.push(`灵池 ${livingState.pondWaterLabel} · 夜护 ${livingState.pondNightWaterCropCareDays} 夜 · ${livingState.pondMoonPondActive ? "月池静养" : livingState.pondLotusText}`);
  }
  if (livingState.spiritManorReady) {
    lines.push(livingState.spiritManorBuilt ? "百怪大院已成 · 宿舍与岗位总览可用" : "百怪大院待建 · 精怪们仍挤在旧院角");
  }
  const safeCareChainStage = careChainStage || livingState.careChainStage || { streak: 0 };
  if (safeCareChainStage.streak > 0) {
    const nextText = safeCareChainStage.nextAt ? ` · 距下阶 ${safeCareChainStage.nextAt - safeCareChainStage.streak} 日` : " · 已传到镇上";
    lines.unshift(`连续照应 ${safeCareChainStage.streak} 日 · ${safeCareChainStage.stageName}${nextText}`);
  }
  if (lines.length === 0) return false;
  const shownLines = lines.slice(0, Math.max(1, Number(lineLimit || 7)));

  drawCanvasCard(ctx, 388, 42, 286, 34 + shownLines.length * 20);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 16px Microsoft YaHei";
  ctx.fillText("洞天运转", 408, 66);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  shownLines.forEach((line, index) => {
    ctx.fillText(line, 408, 88 + index * 18);
  });
  return true;
}
