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

export function drawCareChainWorldBloomWorld({
  ctx,
  livingState = null,
  chain = null,
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  const safeChain = chain || livingState?.careChainStage || null;
  if (!ctx || !safeChain || Number(safeChain.streak || 0) <= 0) return false;
  const bloom = Math.max(0, Math.min(5, Number(safeChain.bloom || safeChain.tier || 0)));
  if (bloom <= 0) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 3;
  const alpha = Math.min(0.72, 0.18 + bloom * 0.1);
  const fieldPoints = [
    [324, 236],
    [382, 300],
    [454, 248],
    [520, 334],
    [590, 278],
    [660, 368],
  ];

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  fieldPoints.slice(0, Math.min(fieldPoints.length, bloom + 2)).forEach(([x, y], index) => {
    const radius = 6 + bloom * 1.8 + Math.sin(motion * 1.7 + index) * 1.8;
    ctx.fillStyle = `rgba(246, 240, 182, ${alpha * (0.48 + index * 0.04)})`;
    ctx.beginPath();
    ctx.arc(x, y, radius + pulse * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(202, 235, 210, ${alpha * 0.68})`;
    ctx.beginPath();
    ctx.arc(x + 6, y - 4, Math.max(2.4, radius * 0.32), 0, Math.PI * 2);
    ctx.fill();
  });

  if (bloom >= 2) {
    ctx.strokeStyle = `rgba(202, 235, 210, ${0.28 + bloom * 0.08})`;
    ctx.lineWidth = 2 + bloom * 0.22;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(340, 338);
    ctx.bezierCurveTo(230, 300 + pulse, 176, 238 - pulse, 116, 194);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (bloom >= 3) {
    ctx.strokeStyle = `rgba(224, 182, 109, ${0.28 + bloom * 0.06})`;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(588, 292);
    ctx.bezierCurveTo(514, 238 - pulse, 402, 210 + pulse, 332, 244);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";

  if (bloom >= 4) {
    drawCanvasCard(ctx, 702, 228, 190, 62, "rgba(237, 243, 223, 0.86)");
    ctx.fillStyle = "#286f58";
    ctx.font = "700 14px Microsoft YaHei";
    ctx.fillText(String(safeChain.stageName || "").slice(0, 10), 722, 252);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "12px Microsoft YaHei";
    ctx.fillText(`连续照应 ${safeChain.streak} 日`, 722, 272);
  }

  if (bloom >= 5) {
    drawCanvasCard(ctx, 112, 244, 176, 50, "rgba(255, 248, 232, 0.84)");
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText("镇上也听见了", 130, 265);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "11px Microsoft YaHei";
    ctx.fillText("旧铺、灵田、精怪成了话头", 130, 282);
  }

  if (livingState?.careChainRecentEvent) {
    const event = livingState.careChainRecentEvent;
    drawCanvasCard(ctx, 678, 304, 224, 82, "rgba(255, 248, 232, 0.88)");
    ctx.fillStyle = "#be4f37";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText("照应阶段余温", 700, 328);
    ctx.fillStyle = "#17231d";
    ctx.font = "700 13px Microsoft YaHei";
    ctx.fillText(String(event.title || "洞天照应事件").slice(0, 14), 700, 350);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "11px Microsoft YaHei";
    ctx.fillText(String(event.rewardText || "奖励已入账").slice(0, 24), 700, 370);
  }
  ctx.restore();
  return true;
}

export function drawTownLifeWeatherMomentWorld({
  ctx,
  moment = null,
  point = null,
  index = 0,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !moment || !point) return false;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.8 + index * 0.72) * 1.8;
  const x = point.x + 48;
  const y = point.y + 12 + bob;
  const accent = moment.accent || "#4d91a6";
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.strokeStyle = `${accent}66`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x - 9, y - 9, 38, 34, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.ellipse(x + 10, y + 30, 24, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (moment.key === "rain_eaves" || moment.key === "storm_eaves") {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 2);
    ctx.quadraticCurveTo(x + 10, y - 16, x + 27, y + 2);
    ctx.lineTo(x + 20, y + 7);
    ctx.quadraticCurveTo(x + 10, y + 1, x + 1, y + 7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(77, 145, 166, 0.58)";
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 4);
    ctx.lineTo(x + 10, y + 22);
    ctx.quadraticCurveTo(x + 15, y + 25, x + 18, y + 19);
    ctx.stroke();
    ctx.fillStyle = "rgba(77, 145, 166, 0.36)";
    for (let i = 0; i < 3; i += 1) {
      ctx.fillRect(x - 4 + i * 11, y + 10 + i % 2 * 3, 2, 8);
    }
  } else if (moment.key === "hot_well" || moment.key === "drought_well") {
    ctx.fillStyle = "#8f5f3f";
    ctx.beginPath();
    ctx.roundRect(x + 1, y + 1, 20, 24, 7);
    ctx.fill();
    ctx.fillStyle = "rgba(159, 209, 223, 0.78)";
    ctx.fillRect(x + 5, y + 8, 12, 4);
    ctx.strokeStyle = "#5b3928";
    ctx.beginPath();
    ctx.moveTo(x - 4, y + 2);
    ctx.quadraticCurveTo(x + 7, y - 8, x + 18, y + 1);
    ctx.stroke();
  } else if (moment.key === "mist_lamp") {
    ctx.strokeStyle = "#5b3928";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x + 10, y - 8);
    ctx.lineTo(x + 10, y + 26);
    ctx.stroke();
    ctx.fillStyle = "rgba(246, 240, 182, 0.86)";
    ctx.beginPath();
    ctx.arc(x + 10, y + 3, 11 + (reducedMotion ? 0 : Math.sin(motion + index) * 1.5), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.32)";
    ctx.fillRect(x - 8, y + 10, 36, 6);
  } else if (moment.key === "frost_brazier" || moment.key === "snow_brazier") {
    ctx.fillStyle = "#5b3928";
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 18, 17, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.82)" : "rgba(190, 79, 55, 0.82)";
      ctx.beginPath();
      ctx.moveTo(x - 2 + i * 7, y + 16);
      ctx.quadraticCurveTo(x + 2 + i * 6, y + 1 - Math.max(0, Math.sin(motion + i)) * 5, x + 7 + i * 5, y + 16);
      ctx.closePath();
      ctx.fill();
    }
  } else if (moment.key === "dew_greeting") {
    ctx.fillStyle = "#286f58";
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 14, 22, 9, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(x + 2 + i * 8, y + 7 - i % 2 * 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (moment.key === "cloud_slow") {
    ctx.fillStyle = "rgba(255, 253, 245, 0.62)";
    ctx.beginPath();
    ctx.ellipse(x + 4, y + 1, 18, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 20, y + 3, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5d6f65";
    ctx.beginPath();
    ctx.moveTo(x - 2, y + 20);
    ctx.quadraticCurveTo(x + 9, y + 12, x + 24, y + 20);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#8f5f3f";
    ctx.fillRect(x - 2, y + 9, 26, 5);
    ctx.fillRect(x + 1, y + 17, 20, 4);
    ctx.fillStyle = "rgba(246, 240, 182, 0.78)";
    ctx.beginPath();
    ctx.arc(x + 24, y - 1, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = accent;
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText((moment.glyph || "天").slice(0, 1), x + 1, y - 14);
  ctx.restore();
  return true;
}

export function drawTownLifeWeatherErrandEchoWorld({
  ctx,
  echo = null,
  point = null,
  index = 0,
  motion = 0,
  currentDay = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !echo || echo.day !== currentDay || !point) return false;
  const bob = reducedMotion ? 0 : Math.sin(motion * 2.4 + index * 0.9) * 2;
  const x = point.x - 14;
  const y = point.y + 28 + bob;
  const accent = echo.tone === "ember" ? "#be4f37" : echo.tone === "water" ? "#4d91a6" : echo.tone === "jade" ? "#286f58" : "#b47d2f";
  ctx.save();
  ctx.globalAlpha = 0.94;
  ctx.fillStyle = "rgba(255, 253, 245, 0.9)";
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(x - 4, y - 18, 42, 34, 11);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(x + 2, y - 12, 30, 22, 8);
  ctx.fill();
  ctx.strokeStyle = `${accent}aa`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 6, y - 3);
  ctx.lineTo(x + 13, y + 5);
  ctx.lineTo(x + 29, y - 10);
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText("妥", x + 10, y + 2);
  ctx.fillStyle = "rgba(255, 248, 232, 0.96)";
  ctx.beginPath();
  ctx.roundRect(x - 10, y + 19, 58, 17, 8);
  ctx.fill();
  ctx.strokeStyle = `${accent}55`;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "700 9px Microsoft YaHei";
  ctx.fillText((echo.label || "天气托付").slice(0, 5), x - 4, y + 31);
  ctx.restore();
  return true;
}

export function drawTownLifeErrandRouteCueWorld({
  ctx,
  cue = null,
  point = null,
  index = 0,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !cue || !point) return false;
  const bob = reducedMotion ? 0 : Math.sin(motion * 2 + index * 0.6) * 1.7;
  const x = point.x + 42;
  const y = point.y + 54 + bob;
  const accent = cue.accent || "#4d91a6";
  const label = `${cue.shortLabel}·${String(cue.itemName || "备货").slice(0, 4)}`;
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.strokeStyle = `${accent}55`;
  ctx.lineWidth = 1.3;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  ctx.moveTo(point.x + 28, point.y + 48);
  ctx.quadraticCurveTo(point.x + 44, point.y + 60, x + 7, y + 12);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(23, 35, 29, 0.16)";
  ctx.beginPath();
  ctx.ellipse(x + 34, y + 28, 32, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.94)";
  ctx.strokeStyle = `${accent}88`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(x, y, 72, 28, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(x + 5, y + 5, 21, 18, 7);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(cue.glyph || "备", x + 10, y + 19);
  ctx.font = "800 9px Microsoft YaHei";
  ctx.fillText(cue.plaqueLabel || "备货牌", x + 32, y + 11);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 9px Microsoft YaHei";
  ctx.fillText(label, x + 32, y + 22);
  if (cue.missing > 0) {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(x + 67, y + 5, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(String(Math.min(9, cue.missing)), x + 64.5, y + 8);
  }
  ctx.restore();
  return true;
}

export function drawTownLifeRouteWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  activeEntryKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.entries?.length) return false;
  const { rect } = spec;
  const palettes = {
    shop: { accent: "#8f5f3f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(224, 182, 109, 0.24)" },
    ready: { accent: "#286f58", soft: "rgba(237, 243, 223, 0.95)", glow: "rgba(40, 111, 88, 0.18)" },
    route: { accent: "#4d91a6", soft: "rgba(241, 249, 251, 0.95)", glow: "rgba(77, 145, 166, 0.18)" },
    greet: { accent: "#286f58", soft: "rgba(255, 253, 245, 0.94)", glow: "rgba(40, 111, 88, 0.14)" },
    urgent: { accent: "#be4f37", soft: "rgba(255, 240, 232, 0.96)", glow: "rgba(190, 79, 55, 0.2)" },
    festival: { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(224, 182, 109, 0.22)" },
    archive: { accent: "#5d6f65", soft: "rgba(255, 253, 245, 0.92)", glow: "rgba(93, 111, 101, 0.12)" },
    daily: { accent: "#5d6f65", soft: "rgba(255, 253, 245, 0.92)", glow: "rgba(93, 111, 101, 0.12)" },
  };
  const mainPalette = palettes[spec.main?.tone] || palettes.daily;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 1.5;

  ctx.save();
  if (spec.main?.point) {
    ctx.strokeStyle = `${mainPalette.accent}44`;
    ctx.lineWidth = active ? 2.4 : 1.4;
    ctx.setLineDash([4, 6]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 9;
    ctx.beginPath();
    ctx.moveTo(rect.x + 24, rect.y + rect.height - 8 + bob);
    ctx.quadraticCurveTo(rect.x - 18, rect.y + rect.height + 18, spec.main.point.x + 16, spec.main.point.y + 52);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, mainPalette.soft);
  ctx.fillStyle = mainPalette.glow;
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 36, 14);
  ctx.fill();
  ctx.fillStyle = mainPalette.accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 32, 24, 10);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.main?.badge || "见", rect.x + 28, rect.y + 35 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("镇民动线 · 可点", rect.x + 60, rect.y + 30 + bob);
  ctx.fillStyle = mainPalette.accent;
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 13), rect.x + 60, rect.y + 44 + bob);

  spec.entries.forEach((entry, index) => {
    const rowRect = entry.rect;
    const palette = palettes[entry.tone] || palettes.daily;
    const rowBob = reducedMotion ? 0 : Math.sin(motion * 2 + index * 0.6) * 0.8;
    const rowActive = activeEntryKey === entry.key;
    ctx.fillStyle = rowActive ? "rgba(255, 248, 232, 0.78)" : index === 0 ? "rgba(255, 253, 245, 0.58)" : "rgba(255, 253, 245, 0.34)";
    ctx.strokeStyle = rowActive ? "rgba(224, 182, 109, 0.72)" : `${palette.accent}33`;
    ctx.lineWidth = rowActive ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(rowRect.x, rowRect.y + bob + rowBob, rowRect.width, rowRect.height, 9);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = `${palette.accent}22`;
    ctx.beginPath();
    ctx.roundRect(rowRect.x + 6, rowRect.y + 4 + bob + rowBob, 22, 16, 6);
    ctx.fill();
    ctx.fillStyle = palette.accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(entry.badge, rowRect.x + 12, rowRect.y + 16 + bob + rowBob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 11px Microsoft YaHei";
    ctx.fillText(`${entry.npcName} · ${entry.shortTitle}`.slice(0, 15), rowRect.x + 34, rowRect.y + 12 + bob + rowBob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText(entry.shortDetail, rowRect.x + 34, rowRect.y + 22 + bob + rowBob);
    ctx.fillStyle = palette.accent;
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(entry.nextLabel.slice(0, 5), rowRect.x + rowRect.width - 42, rowRect.y + 17 + bob + rowBob);
  });

  ctx.fillStyle = active ? "#8f5f3f" : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(`${spec.subtitle} · 点选只定位`, rect.x + 18, rect.y + rect.height - 10 + bob);
  ctx.restore();
  return true;
}

export function drawTownLifeRelationshipWorldBoardWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect, palette } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.9) * 2;
  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = `${palette.accent}55`;
    ctx.lineWidth = active ? 2.6 : 1.6;
    ctx.setLineDash([4, 6]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    ctx.moveTo(rect.x + 28, rect.y + rect.height - 6 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 26, spec.point.x + 18, spec.point.y + 28);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = palette.glow;
    ctx.beginPath();
    ctx.ellipse(spec.point.x + 16, spec.point.y + 52, active ? 42 : 34, active ? 14 : 11, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, palette.soft);
  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 42, 16);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 34, 28, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(palette.badge || "见", rect.x + 28, rect.y + 38 + bob);
  ctx.fillStyle = palette.ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("今日关系机会", rect.x + 62, rect.y + 31 + bob);
  ctx.fillStyle = palette.accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${spec.count} 条动线 · ${spec.actionLabel}`, rect.x + 62, rect.y + 47 + bob);

  ctx.fillStyle = "#17231d";
  ctx.font = "800 16px Microsoft YaHei";
  ctx.fillText(`${spec.npcName} · ${spec.shortTitle}`, rect.x + 18, rect.y + 78 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(`${spec.area} · 好感 Lv.${spec.favorLv} / ${Math.round(spec.favorValue)}`, rect.x + 18, rect.y + 98 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(spec.shortDetail, rect.x + 18, rect.y + 116 + bob);
  ctx.fillStyle = palette.accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(spec.shortCohab, rect.x + 18, rect.y + 132 + bob);
  if (active) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawTownLifeMemoryKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  npcPortraitImage = () => null,
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect, palette } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.55) * 1.8;
  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = `${palette.accent}44`;
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([3, 7]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 7;
    ctx.beginPath();
    ctx.moveTo(rect.x + 36, rect.y + rect.height - 8 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 18, spec.point.x + 16, spec.point.y + 30);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, palette.soft);
  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 44, 18);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 34, 28, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(palette.badge || "心", rect.x + 28, rect.y + 38 + bob);
  const portrait = npcPortraitImage(spec.npcId);
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30, 10);
    ctx.clip();
    ctx.drawImage(portrait, rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30);
    ctx.restore();
  }
  ctx.fillStyle = palette.ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("镇民关系心签", rect.x + 62, rect.y + 31 + bob);
  ctx.fillStyle = palette.accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${spec.npcName} · Lv.${spec.favorLv} · 来往 ${spec.counts.total} 次`, rect.x + 62, rect.y + 47 + bob);

  ctx.fillStyle = "#17231d";
  ctx.font = "800 15px Microsoft YaHei";
  ctx.fillText(`最近记忆 · ${spec.shortLatest}`, rect.x + 18, rect.y + 76 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.shortSummary, rect.x + 18, rect.y + 91 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.92)" : "rgba(255, 253, 245, 0.62)";
    ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : `${palette.accent}33`;
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = `${palette.accent}22`;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = palette.accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawTownLifeMemoryNewPageWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  npcPortraitImage = () => null,
  shortText = (text) => String(text || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const accent = "#286f58";
  const gold = "#c9953d";
  const ink = "#17231d";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.72) * 2.2;
  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = activeNodeKey ? "rgba(40, 111, 88, 0.78)" : "rgba(40, 111, 88, 0.42)";
    ctx.lineWidth = activeNodeKey ? 2.5 : 1.5;
    ctx.setLineDash([2, 6]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.width - 36, rect.y + rect.height - 14 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 18, spec.point.x + 16, spec.point.y + 34);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(40, 111, 88, 0.16)";
    ctx.beginPath();
    ctx.ellipse(spec.point.x + 16, spec.point.y + 50, 42, 13, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.97)");
  ctx.fillStyle = activeNodeKey ? "rgba(40, 111, 88, 0.2)" : "rgba(40, 111, 88, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 49, 18);
  ctx.fill();
  ctx.fillStyle = "rgba(201, 149, 61, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 102, rect.y + 17 + bob, 74, 30, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 38, 30, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("新", rect.x + 29, rect.y + 39 + bob);
  ctx.fillStyle = gold;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText("新页", rect.x + rect.width - 82, rect.y + 37 + bob);
  const portrait = npcPortraitImage(spec.npcId);
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 54, rect.y + 68 + bob, 34, 34, 12);
    ctx.clip();
    ctx.drawImage(portrait, rect.x + rect.width - 54, rect.y + 68 + bob, 34, 34);
    ctx.restore();
  }
  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("关系记忆新页 · 可点", rect.x + 66, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 20), rect.x + 66, rect.y + 48 + bob);

  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText(`新页写入 · ${spec.shortTitle}`, rect.x + 18, rect.y + 78 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.shortSummary, rect.x + 18, rect.y + 94 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.96)" : "rgba(255, 253, 245, 0.68)";
    ctx.strokeStyle = active ? "rgba(201, 149, 61, 0.88)" : "rgba(40, 111, 88, 0.28)";
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(201, 149, 61, 0.26)" : "rgba(40, 111, 88, 0.16)";
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = ink;
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText("只定位回看入口 · 不自动播放", rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(201, 149, 61, 0.82)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawTownLifeMemoryThresholdKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  npcPortraitImage = () => null,
  shortText = (text) => String(text || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const accent = spec.needInteractions <= 0 ? "#286f58" : "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.56) * 1.8;
  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = `${accent}66`;
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([4, 7]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    ctx.moveTo(rect.x + (spec.point.x > rect.x ? 24 : rect.width - 24), rect.y + 12 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y - 28, spec.point.x + 16, spec.point.y + 36);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = spec.needInteractions <= 0 ? "rgba(40, 111, 88, 0.18)" : "rgba(224, 182, 109, 0.18)";
    ctx.beginPath();
    ctx.ellipse(spec.point.x + 16, spec.point.y + 52, 40, 13, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, spec.needInteractions <= 0 ? "rgba(237, 243, 223, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.fillStyle = spec.needInteractions <= 0 ? "rgba(40, 111, 88, 0.16)" : "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 46, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 36, 28, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("忆", rect.x + 29, rect.y + 38 + bob);
  const portrait = npcPortraitImage(spec.npcId);
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30, 10);
    ctx.clip();
    ctx.drawImage(portrait, rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30);
    ctx.restore();
  }
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("关系记忆临门签 · 可点", rect.x + 64, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 18), rect.x + 64, rect.y + 47 + bob);

  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.summaryText, rect.x + 18, rect.y + 78 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.progressText} · ${spec.action?.label || "看关系卡"}`, rect.x + 18, rect.y + 93 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.94)" : "rgba(255, 253, 245, 0.66)";
    ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : `${accent}44`;
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.28)" : `${accent}22`;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? "#b47d2f" : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.safety, rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawTownLifeShopMomentKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  npcPortraitImage = () => null,
  shortText = (text) => String(text || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const accent = "#8f5f3f";
  const gold = "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.7) * 1.8;

  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = "rgba(180, 125, 47, 0.54)";
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([5, 6]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    ctx.moveTo(rect.x + (spec.point.x > rect.x ? 22 : rect.width - 22), rect.y + rect.height - 10 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 22, spec.point.x + 16, spec.point.y + 24);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(224, 182, 109, 0.22)";
    ctx.beginPath();
    ctx.ellipse(spec.point.x + 16, spec.point.y + 52, 38, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.96)");
  ctx.fillStyle = "rgba(224, 182, 109, 0.22)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 46, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 36, 28, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("铺", rect.x + 30, rect.y + 38 + bob);
  const portrait = npcPortraitImage(spec.npcId);
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30, 10);
    ctx.clip();
    ctx.drawImage(portrait, rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30);
    ctx.restore();
  }
  ctx.fillStyle = "#5b3928";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("旧铺后话留签 · 可点", rect.x + 64, rect.y + 31 + bob);
  ctx.fillStyle = gold;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 18), rect.x + 64, rect.y + 47 + bob);

  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.shortSummary, rect.x + 18, rect.y + 78 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.tradeLine, rect.x + 18, rect.y + 93 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.94)" : "rgba(255, 253, 245, 0.66)";
    ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : "rgba(143, 95, 63, 0.26)";
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.28)" : "rgba(143, 95, 63, 0.12)";
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.safety, rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawTownLifeErrandDeliveryKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  npcPortraitImage = () => null,
  shortText = (text) => String(text || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const accent = "#286f58";
  const gold = "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.65) * 1.8;

  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = "rgba(40, 111, 88, 0.52)";
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([5, 6]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    ctx.moveTo(rect.x + (spec.point.x > rect.x ? 24 : rect.width - 24), rect.y + rect.height - 10 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 22, spec.point.x + 16, spec.point.y + 44);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(40, 111, 88, 0.18)";
    ctx.beginPath();
    ctx.ellipse(spec.point.x + 16, spec.point.y + 52, 40, 13, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(237, 243, 223, 0.96)");
  ctx.fillStyle = "rgba(40, 111, 88, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 46, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 36, 28, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("托", rect.x + 29, rect.y + 38 + bob);
  const portrait = npcPortraitImage(spec.npcId);
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30, 10);
    ctx.clip();
    ctx.drawImage(portrait, rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30);
    ctx.restore();
  }
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("小托付交付留签 · 可点", rect.x + 64, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 18), rect.x + 64, rect.y + 47 + bob);

  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.requestText, rect.x + 18, rect.y + 78 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${spec.haveText} · ${spec.rewardText}`, rect.x + 18, rect.y + 93 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.94)" : "rgba(255, 253, 245, 0.66)";
    ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : "rgba(40, 111, 88, 0.26)";
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.28)" : "rgba(40, 111, 88, 0.12)";
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.safety, rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawTownLifeGreetingKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  npcPortraitImage = () => null,
  shortText = (text) => String(text || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const accent = spec.tone === "urgent" ? "#be4f37" : spec.tone === "festival" ? "#b47d2f" : "#4d91a6";
  const gold = "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.52) * 1.8;

  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = `${accent}88`;
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([4, 7]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    ctx.moveTo(rect.x + (spec.point.x > rect.x ? 24 : rect.width - 24), rect.y + rect.height - 10 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 20, spec.point.x + 16, spec.point.y + 32);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = spec.tone === "urgent" ? "rgba(190, 79, 55, 0.16)" : "rgba(77, 145, 166, 0.16)";
    ctx.beginPath();
    ctx.ellipse(spec.point.x + 16, spec.point.y + 52, 38, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, spec.tone === "urgent" ? "rgba(255, 240, 232, 0.96)" : "rgba(241, 249, 251, 0.96)");
  ctx.fillStyle = spec.tone === "urgent" ? "rgba(190, 79, 55, 0.16)" : "rgba(77, 145, 166, 0.16)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 46, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 36, 28, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("聊", rect.x + 29, rect.y + 38 + bob);
  const portrait = npcPortraitImage(spec.npcId);
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30, 10);
    ctx.clip();
    ctx.drawImage(portrait, rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30);
    ctx.restore();
  }
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("今日寒暄留签 · 可点", rect.x + 64, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 18), rect.x + 64, rect.y + 47 + bob);

  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.lineText, rect.x + 18, rect.y + 78 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.routeText, rect.x + 18, rect.y + 93 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.94)" : "rgba(255, 253, 245, 0.66)";
    ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : `${accent}44`;
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.28)" : `${accent}22`;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.safety, rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawTownLifeGiftKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  npcPortraitImage = () => null,
  shortText = (text) => String(text || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const accent = spec.tone === "liked" ? "#d87f8d" : spec.tone === "bad" ? "#be4f37" : "#8f5f3f";
  const gold = "#b47d2f";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.58) * 1.8;

  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = `${accent}88`;
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([4, 7]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    ctx.moveTo(rect.x + (spec.point.x > rect.x ? 24 : rect.width - 24), rect.y + rect.height - 10 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 20, spec.point.x + 16, spec.point.y + 38);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = spec.tone === "liked" ? "rgba(216, 127, 141, 0.18)" : "rgba(143, 95, 63, 0.15)";
    ctx.beginPath();
    ctx.ellipse(spec.point.x + 16, spec.point.y + 52, 38, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, spec.tone === "liked" ? "rgba(255, 240, 238, 0.96)" : "rgba(255, 248, 232, 0.96)");
  ctx.fillStyle = spec.tone === "liked" ? "rgba(216, 127, 141, 0.18)" : "rgba(143, 95, 63, 0.14)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 46, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 36, 28, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("礼", rect.x + 29, rect.y + 38 + bob);
  const portrait = npcPortraitImage(spec.npcId);
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30, 10);
    ctx.clip();
    ctx.drawImage(portrait, rect.x + rect.width - 52, rect.y + 17 + bob, 30, 30);
    ctx.restore();
  }
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("今日赠礼留签 · 可点", rect.x + 64, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 18), rect.x + 64, rect.y + 47 + bob);

  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.reasonText, rect.x + 18, rect.y + 78 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.giftLine, rect.x + 18, rect.y + 93 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.94)" : "rgba(255, 253, 245, 0.66)";
    ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : `${accent}44`;
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.28)" : `${accent}22`;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.safety, rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawTownLifePassalongLanternWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  npcPortraitImage = () => null,
  shortText = (text) => String(text || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect } = spec;
  const tone = spec.passalong?.tone || "daily";
  const palette = {
    water: { accent: "#4d91a6", soft: "rgba(241, 249, 251, 0.96)", glow: "rgba(77, 145, 166, 0.2)" },
    sprout: { accent: "#286f58", soft: "rgba(237, 243, 223, 0.96)", glow: "rgba(40, 111, 88, 0.18)" },
    warm: { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.97)", glow: "rgba(224, 182, 109, 0.24)" },
    linked: { accent: "#286f58", soft: "rgba(237, 243, 223, 0.96)", glow: "rgba(40, 111, 88, 0.18)" },
    woven: { accent: "#8f5f3f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(143, 95, 63, 0.18)" },
    rooted: { accent: "#5d6f65", soft: "rgba(255, 253, 245, 0.94)", glow: "rgba(93, 111, 101, 0.14)" },
    town: { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.97)", glow: "rgba(224, 182, 109, 0.24)" },
    start: { accent: "#b47d2f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(224, 182, 109, 0.22)" },
    return: { accent: "#286f58", soft: "rgba(237, 243, 223, 0.96)", glow: "rgba(40, 111, 88, 0.18)" },
    spread: { accent: "#4d91a6", soft: "rgba(241, 249, 251, 0.96)", glow: "rgba(77, 145, 166, 0.2)" },
    trust: { accent: "#8f5f3f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(143, 95, 63, 0.18)" },
    complete: { accent: "#8f5f3f", soft: "rgba(255, 248, 232, 0.97)", glow: "rgba(224, 182, 109, 0.24)" },
    afterword: { accent: "#8f5f3f", soft: "rgba(255, 248, 232, 0.97)", glow: "rgba(143, 95, 63, 0.2)" },
  }[tone] || { accent: "#8f5f3f", soft: "rgba(255, 248, 232, 0.96)", glow: "rgba(143, 95, 63, 0.16)" };
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.55) * 1.8;

  ctx.save();
  if (spec.point) {
    ctx.strokeStyle = `${palette.accent}66`;
    ctx.lineWidth = activeNodeKey ? 2.4 : 1.4;
    ctx.setLineDash([4, 7]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 8;
    ctx.beginPath();
    ctx.moveTo(rect.x + (spec.point.x > rect.x ? 24 : rect.width - 24), rect.y + rect.height - 12 + bob);
    ctx.quadraticCurveTo((rect.x + spec.point.x) / 2, rect.y + rect.height + 22, spec.point.x + 92, spec.point.y + 8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = palette.glow;
    ctx.beginPath();
    ctx.ellipse(spec.point.x + 108, spec.point.y + 8, 42, 14, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, palette.soft);
  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 48, 18);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 19 + bob, 36, 28, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.passalong?.badge || "话", rect.x + 29, rect.y + 39 + bob);
  const portrait = npcPortraitImage(spec.npcId);
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 52, rect.y + 18 + bob, 30, 30, 10);
    ctx.clip();
    ctx.drawImage(portrait, rect.x + rect.width - 52, rect.y + 18 + bob, 30, 30);
    ctx.restore();
  }
  ctx.fillStyle = "#17231d";
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("镇民顺路捎话灯 · 可点", rect.x + 64, rect.y + 32 + bob);
  ctx.fillStyle = palette.accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(shortText(spec.subtitle, 20), rect.x + 64, rect.y + 49 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText(spec.shortLine, rect.x + 18, rect.y + 80 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.shortDetail, rect.x + 18, rect.y + 95 + bob);
  const gold = "#b47d2f";
  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.94)" : "rgba(255, 253, 245, 0.66)";
    ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : `${palette.accent}44`;
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(224, 182, 109, 0.28)" : `${palette.accent}22`;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : palette.accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }
  ctx.fillStyle = activeNodeKey ? palette.accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(spec.safety, rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawEarlyNpcWorldRoadsignWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  activeNpcId = "",
  activeRowKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  npcName = (value) => String(value || ""),
} = {}) {
  if (!ctx || !spec?.rect || !spec.entries?.length) return false;
  const { rect } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.45) * 1.6;
  ctx.save();
  for (const entry of spec.entries) {
    if (!entry.point) continue;
    const rowActive = active && activeNpcId === entry.npcId;
    ctx.strokeStyle = `${entry.accent}${rowActive ? "88" : "36"}`;
    ctx.lineWidth = rowActive ? 2.2 : 1.2;
    ctx.setLineDash(rowActive ? [5, 4] : [3, 7]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 7;
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.width - 12, rect.y + 70 + bob);
    ctx.quadraticCurveTo((rect.x + rect.width + entry.point.x) / 2, rect.y + 78, entry.point.x + 16, entry.point.y + 34);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.92)");
  ctx.fillStyle = "rgba(143, 95, 63, 0.12)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 38, 16);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText("三位早期镇民路标", rect.x + 20, rect.y + 31 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${spec.doneMilestones}/${spec.totalMilestones} 个记忆钩子 · 点选只定位`, rect.x + 20, rect.y + 47 + bob);

  for (const [index, entry] of spec.entries.entries()) {
    const rowRect = entry.rowRect;
    const y = rowRect.y + bob;
    const rowActive = active && activeRowKey === entry.key;
    ctx.fillStyle = rowActive ? "rgba(255, 253, 245, 0.88)" : index % 2 ? "rgba(255, 253, 245, 0.5)" : "rgba(237, 243, 223, 0.46)";
    ctx.strokeStyle = rowActive ? "rgba(224, 182, 109, 0.78)" : `${entry.accent}33`;
    ctx.lineWidth = rowActive ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(rowRect.x, y, rowRect.width, rowRect.height, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = `${entry.accent}22`;
    ctx.beginPath();
    ctx.roundRect(rowRect.x + 6, y + 4, 30, 18, 8);
    ctx.fill();
    ctx.fillStyle = entry.accent;
    ctx.font = "900 11px Microsoft YaHei";
    ctx.fillText(entry.badge, rowRect.x + 15, y + 17);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 12px Microsoft YaHei";
    ctx.fillText(`${npcName(entry.npcId)} · ${entry.shortRoute}`, rowRect.x + 44, y + 12);
    ctx.fillStyle = entry.accent;
    ctx.font = "700 10px Microsoft YaHei";
    ctx.fillText(`${entry.doneCount}/${entry.totalCount}`, rowRect.x + rowRect.width - 36, y + 12);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "10px Microsoft YaHei";
    ctx.fillText(`下一步：${entry.shortNext}`, rowRect.x + 44, y + 24);
  }
  if (active) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawTownLifeErrandFeedbackWorld({
  ctx,
  width = 960,
  height = 640,
  feedback = null,
  pulse = 0,
  accent = "#b47d2f",
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const x = Math.max(48, Math.min(width - 386, width - 418));
  const y = 142 + pulse;

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(x + 190, y + 54, 12, x + 190, y + 54, 172);
  glow.addColorStop(0, `${accent}33`);
  glow.addColorStop(0.5, "rgba(224, 182, 109, 0.12)");
  glow.addColorStop(1, "rgba(224, 182, 109, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 190, y + 54, 172, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, 366, 132, "rgba(255, 248, 232, 0.96)");
  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(x + 18, y + 18, 58, 58, 18);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 30, y + 48);
  ctx.lineTo(x + 42, y + 60);
  ctx.lineTo(x + 64, y + 34);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = "800 13px Microsoft YaHei";
  ctx.fillText("妥", x + 37, y + 45);

  ctx.fillStyle = accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${feedback.title} · ${feedback.weatherLabel || feedback.areaLabel}`.slice(0, 22), x + 92, y + 28);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 18px Microsoft YaHei";
  ctx.fillText(`${feedback.headline}：${feedback.npcName}`.slice(0, 18), x + 92, y + 52);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${feedback.itemName} x${feedback.count} · ${feedback.areaLabel}`.slice(0, 28), x + 92, y + 73);

  const chips = [
    { text: `+${feedback.rewardGold} 灵石`, fill: "rgba(224, 182, 109, 0.2)", color: "#8f5f3f", width: 86 },
    ...(feedback.rewardFame ? [{ text: `声望 +${feedback.rewardFame}`, fill: "rgba(40, 111, 88, 0.16)", color: "#286f58", width: 78 }] : []),
    { text: `好感 +${feedback.rewardFavor}`, fill: "rgba(190, 79, 55, 0.14)", color: "#be4f37", width: 78 },
  ];
  let chipX = x + 20;
  const chipY = y + 88;
  for (const chip of chips) {
    ctx.fillStyle = chip.fill;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, chip.width, 22, 11);
    ctx.fill();
    ctx.fillStyle = chip.color;
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(chip.text, chipX + 10, chipY + 15);
    chipX += chip.width + 8;
  }

  ctx.fillStyle = feedback.memoryTitle ? "#286f58" : feedback.favorLeveled ? "#be4f37" : "#5d6f65";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(String(feedback.response || "").slice(0, 24), chipX + 2, chipY + 15);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  const echoText = feedback.memorySummary || feedback.weatherSummary || feedback.detail || "镇上的来往又稳了一点。";
  ctx.fillText(echoText.slice(0, 38), x + 20, y + 122);
  ctx.restore();
  return true;
}

export function drawTownLifeFeaturedBubbleWorld({
  ctx,
  bubble = null,
  motion = 0,
  reducedMotion = false,
  npcName = (value) => String(value || ""),
} = {}) {
  if (!ctx || !bubble?.rect || !bubble?.point || !bubble?.featured?.npc?.npc_id) return false;
  const {
    featured,
    point: featurePoint,
    rect,
    shortBark,
    weatherErrandForFeatured,
    shopMomentBark,
    careChainBark,
    reputationBark,
  } = bubble;
  ctx.fillStyle = weatherErrandForFeatured
    ? "rgba(255, 248, 232, 0.97)"
    : shopMomentBark
      ? "rgba(255, 248, 232, 0.97)"
      : careChainBark
        ? "rgba(237, 243, 223, 0.96)"
        : reputationBark
          ? "rgba(255, 248, 232, 0.96)"
          : featured.status.key === "urgent" ? "rgba(255, 248, 232, 0.96)" : "rgba(255, 253, 245, 0.92)";
  ctx.strokeStyle = weatherErrandForFeatured
    ? "rgba(224, 182, 109, 0.48)"
    : shopMomentBark
      ? "rgba(180, 125, 47, 0.46)"
      : careChainBark
        ? "rgba(40, 111, 88, 0.42)"
        : reputationBark
          ? "rgba(180, 125, 47, 0.42)"
          : featured.status.key === "urgent" ? "rgba(190, 79, 55, 0.32)" : "rgba(77, 145, 166, 0.24)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = weatherErrandForFeatured
    ? "#8f5f3f"
    : shopMomentBark
      ? "#8f5f3f"
      : careChainBark
        ? "#286f58"
        : reputationBark
          ? "#8f5f3f"
          : featured.status.key === "urgent" ? "#be4f37" : "#286f58";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(
    weatherErrandForFeatured
      ? `天气托付 · ${npcName(featured.npc.npc_id)}：`
      : shopMomentBark
        ? `旧铺后话 · ${npcName(featured.npc.npc_id)}：`
        : careChainBark
          ? `生机传话 · ${npcName(featured.npc.npc_id)}：`
          : reputationBark
            ? `旧铺传话 · ${npcName(featured.npc.npc_id)}：`
            : `${npcName(featured.npc.npc_id)}：`,
    featurePoint.x + 56,
    featurePoint.y + 26,
  );
  if (shopMomentBark) {
    const glow = reducedMotion ? 0 : Math.sin(motion * 2.4) * 0.08 + 0.12;
    ctx.fillStyle = `rgba(224, 182, 109, ${0.22 + glow})`;
    ctx.beginPath();
    ctx.roundRect(rect.x + rect.width - 44, rect.y + 8, 32, 18, 8);
    ctx.fill();
    ctx.fillStyle = "#8f5f3f";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText("可翻", rect.x + rect.width - 38, rect.y + 21);
  }
  ctx.fillStyle = "#17231d";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(shortBark, featurePoint.x + 56, featurePoint.y + 43);
  return true;
}

export function drawCohabCourtyardWorld({
  ctx,
  routeFlags = null,
  activeBuffRouteIds = [],
  routeCount = 0,
  motion = 0,
  reducedMotion = false,
} = {}) {
  if (!ctx || !routeFlags || routeCount <= 0) return false;
  const activeBuffRouteIdSet = new Set(activeBuffRouteIds);
  const routeGlow = (routeId, color, x, y, radiusX, radiusY) => {
    if (!activeBuffRouteIdSet.has(routeId)) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  ctx.save();
  if (routeFlags.baizhi) {
    routeGlow("cohab_baizhi_01", "rgba(202, 235, 210, 0.28)", 222, 266, 54, 18);
    ctx.strokeStyle = "#8f5f3f";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(188, 220);
    ctx.lineTo(188, 280);
    ctx.lineTo(246, 280);
    ctx.lineTo(246, 220);
    ctx.stroke();
    ["#5d8b52", "#9fd1df", "#e0b66d"].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(200 + index * 18, 238 + (index % 2) * 10, 8, 14, index * 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#caebd2";
    ctx.beginPath();
    ctx.roundRect(256, 258, 16, 18, 4);
    ctx.fill();
  }

  if (routeFlags.hu) {
    routeGlow("cohab_hu_01", "rgba(230, 198, 94, 0.24)", 306, 334, 64, 20);
    ctx.fillStyle = "#8f5f3f";
    ctx.beginPath();
    ctx.roundRect(272, 290, 36, 26, 6);
    ctx.roundRect(314, 300, 34, 22, 6);
    ctx.fill();
    ctx.strokeStyle = "#b47d2f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(332, 258);
    ctx.lineTo(332, 302);
    ctx.stroke();
    ctx.fillStyle = "#e6c65e";
    ctx.beginPath();
    ctx.moveTo(332, 258);
    ctx.lineTo(362, 268);
    ctx.lineTo(332, 282);
    ctx.closePath();
    ctx.fill();
  }

  if (routeFlags.atan) {
    routeGlow("cohab_atan_01", "rgba(242, 210, 139, 0.2)", 250, 198, 54, 18);
    ctx.fillStyle = "#8f5f3f";
    ctx.fillRect(218, 176, 52, 10);
    ctx.fillRect(224, 186, 8, 28);
    ctx.fillRect(256, 186, 8, 28);
    ctx.strokeStyle = "#e0b66d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(272, 166);
    ctx.lineTo(294, 146);
    ctx.lineTo(316, 176);
    ctx.stroke();
  }

  if (routeFlags.qinghe) {
    routeGlow("cohab_qinghe_01", "rgba(159, 209, 223, 0.24)", 674, 548, 78, 24);
    ctx.fillStyle = "rgba(77, 145, 166, 0.34)";
    ctx.beginPath();
    ctx.ellipse(664, 550, 64, 20, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5d8b52";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(718, 524, 18, 0, Math.PI * 2);
    ctx.moveTo(718, 506);
    ctx.lineTo(718, 542);
    ctx.moveTo(700, 524);
    ctx.lineTo(736, 524);
    ctx.stroke();
    ctx.fillStyle = "#fffdf5";
    ctx.beginPath();
    ctx.arc(640, 540, 8, 0, Math.PI * 2);
    ctx.arc(682, 556, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  if (routeFlags.shen) {
    routeGlow("cohab_shen_01", "rgba(246, 240, 182, 0.24)", 560, 302, 64, 22);
    ctx.fillStyle = "#5b3328";
    ctx.fillRect(540, 260, 8, 48);
    ctx.fillRect(584, 268, 8, 42);
    ctx.fillStyle = "rgba(246, 240, 182, 0.68)";
    ctx.beginPath();
    ctx.arc(544, 274, 10, 0, Math.PI * 2);
    ctx.arc(588, 282, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#be4f37";
    ctx.beginPath();
    ctx.moveTo(564, 296);
    ctx.lineTo(582, 330);
    ctx.lineTo(544, 330);
    ctx.closePath();
    ctx.fill();
  }

  if (routeCount >= 2) {
    const steamBob = reducedMotion ? 0 : Math.sin(motion * 3.125) * 2;
    ctx.fillStyle = "#8f5f3f";
    ctx.beginPath();
    ctx.roundRect(154, 316, 92, 18, 8);
    ctx.fill();
    ctx.fillRect(166, 334, 8, 18);
    ctx.fillRect(226, 334, 8, 18);
    ctx.fillStyle = "#fffdf5";
    [174, 194, 214, 234].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, 312, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(23, 35, 29, 0.18)";
      ctx.stroke();
    });
    ctx.fillStyle = "rgba(255, 253, 245, 0.46)";
    [182, 218].forEach((x, index) => {
      ctx.beginPath();
      ctx.arc(x, 300 - index * 6 + steamBob, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
  return true;
}

export function drawCohabLifeNoteWorld({
  ctx,
  spec = null,
  activeNodeKey = "",
  motion = 0,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { life, rect, palette } = spec;
  const buff = life.activeBuff;
  const x = rect.x;
  const y = rect.y;
  const width = rect.width;
  const height = rect.height;
  const accent = palette.accent;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.4) * 1.5;

  ctx.save();
  ctx.fillStyle = "rgba(23, 35, 29, 0.13)";
  ctx.beginPath();
  ctx.ellipse(x + width / 2, y + height + 10 + bob, width * 0.43, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  drawCanvasCard(ctx, x, y + bob, width, height, palette.soft);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(x + 14, y + 14 + bob, 54, 70, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.22)";
  ctx.stroke();
  const homeX = x + 24;
  const homeY = y + 46 + bob;
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.moveTo(homeX, homeY);
  ctx.lineTo(homeX + 17, homeY - 18);
  ctx.lineTo(homeX + 34, homeY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.beginPath();
  ctx.roundRect(homeX + 5, homeY, 24, 24, 5);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.fillRect(homeX + 14, homeY + 10, 6, 14);
  if (life.routeCount >= 2) {
    ctx.fillStyle = "rgba(224, 182, 109, 0.78)";
    ctx.beginPath();
    ctx.arc(homeX + 33 + Math.sin(motion * 2) * 2, homeY - 16, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`同住后日谈窗灯 · ${life.routeCount} 线`, x + 82, y + 28 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), x + 82, y + 50 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 26), x + 82, y + 68 + bob);

  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.roundRect(x + 82, y + 78 + bob, width - 100, 20, 10);
  ctx.fill();
  ctx.fillStyle = buff ? "#b47d2f" : "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  const buffText = buff
    ? `余韵 ${buff.label} 至第 ${buff.expiresDay} 天`
    : spec.nextEvent
      ? `下一件小事：${spec.nextRoute?.route_name || "同住"} · ${spec.nextEvent.event_name || spec.nextEvent.scene_key || "日常"}`
      : "下一件小事：等下一次日夜流转";
  ctx.fillText(buffText.slice(0, 28), x + 92, y + 92 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.94)" : "rgba(255, 253, 245, 0.64)";
    ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.86)" : `${accent}33`;
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = `${accent}22`;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 5, nodeRect.y + 6 + bob, 19, 16, 7);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 10, nodeRect.y + 18 + bob);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 29, nodeRect.y + 14 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "8px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 29, nodeRect.y + 24 + bob);
  }

  for (let i = 0; i < Math.min(5, life.routeCount); i += 1) {
    ctx.fillStyle = i % 2 ? "rgba(202, 235, 210, 0.78)" : "rgba(224, 182, 109, 0.72)";
    ctx.beginPath();
    ctx.arc(x + 22 + i * 9, y + height - 8 + bob + Math.sin(motion * 1.8 + i) * 1.5, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 4, y + 4 + bob, width - 8, height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}
