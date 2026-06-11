export function drawEcologyOrderFeedbackWorld({
  ctx,
  width = 960,
  height = 640,
  feedback = null,
  motion = 0,
  pulse = 0,
  anchor = { x: 760, y: 406 },
  routeEnd = { x: 462, y: 326 },
  accent = "#286f58",
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawEcologyComboMotif = () => false,
} = {}) {
  if (!ctx || !feedback) return false;

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(anchor.x, anchor.y, 10, anchor.x, anchor.y, 148 + Math.max(0, pulse));
  glow.addColorStop(0, "rgba(246, 240, 182, 0.42)");
  glow.addColorStop(0.46, "rgba(202, 235, 210, 0.18)");
  glow.addColorStop(1, "rgba(202, 235, 210, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, 150 + Math.max(0, pulse), 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(246, 240, 182, 0.72)";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.setLineDash([18, 12]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 34;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.bezierCurveTo(anchor.x - 48, anchor.y - 78, routeEnd.x + 64, routeEnd.y - 56, routeEnd.x, routeEnd.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.bezierCurveTo(anchor.x - 48, anchor.y - 78, routeEnd.x + 64, routeEnd.y - 56, routeEnd.x, routeEnd.y);
  ctx.stroke();

  for (let i = 0; i < 7; i += 1) {
    const t = (motion * 0.16 + i / 7) % 1;
    const inv = 1 - t;
    const trailX = inv ** 3 * anchor.x
      + 3 * inv ** 2 * t * (anchor.x - 48)
      + 3 * inv * t ** 2 * (routeEnd.x + 64)
      + t ** 3 * routeEnd.x;
    const trailY = inv ** 3 * anchor.y
      + 3 * inv ** 2 * t * (anchor.y - 78)
      + 3 * inv * t ** 2 * (routeEnd.y - 56)
      + t ** 3 * routeEnd.y;
    ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.9)" : "rgba(224, 182, 109, 0.84)";
    ctx.beginPath();
    ctx.arc(trailX, trailY, 3.2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  drawEcologyComboMotif(ctx, feedback.comboId, anchor.x, anchor.y - 24 + pulse * 0.2, 0, motion);

  const cardX = Math.max(34, Math.min(width - 348, anchor.x - 292));
  const cardY = Math.max(132, Math.min(height - 132, anchor.y - 128));
  drawCanvasCard(ctx, cardX, cardY, 328, 112, "rgba(255, 248, 232, 0.94)");
  ctx.fillStyle = "rgba(202, 235, 210, 0.26)";
  ctx.beginPath();
  ctx.roundRect(cardX + 16, cardY + 16, 58, 72, 18);
  ctx.fill();
  drawEcologyComboMotif(ctx, feedback.comboId, cardX + 45, cardY + 48, 1, motion);

  ctx.fillStyle = accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${feedback.tierLabel} · 订单回响`, cardX + 88, cardY + 28);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 17px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "生态契合").slice(0, 18), cardX + 88, cardY + 54);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${feedback.orderTitle} · ${feedback.npcLabel}`.slice(0, 30), cardX + 88, cardY + 76);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(`${feedback.matchedTagText} · ${feedback.focusText}`.slice(0, 36), cardX + 88, cardY + 96);
  ctx.restore();
  return true;
}

export function drawEcologyDailyFeedbackWorld({
  ctx,
  width = 960,
  height = 640,
  feedback = null,
  motion = 0,
  pulse = 0,
  anchor = { x: 760, y: 406 },
  accent = "#286f58",
  drawCanvasCard = () => {},
  drawEcologyComboMotif = () => false,
  drawEcologyDailyVisualAccent = () => false,
} = {}) {
  if (!ctx || !feedback) return false;

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(anchor.x, anchor.y, 8, anchor.x, anchor.y, 116 + Math.max(0, pulse));
  glow.addColorStop(0, "rgba(255, 253, 245, 0.48)");
  glow.addColorStop(0.48, "rgba(202, 235, 210, 0.2)");
  glow.addColorStop(1, "rgba(202, 235, 210, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, 120 + Math.max(0, pulse), 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 10; i += 1) {
    const angle = (Math.PI * 2 * i) / 10 + motion * 0.35;
    const radius = 32 + (i % 3) * 10 + Math.max(0, pulse);
    ctx.fillStyle = i % 2 ? "rgba(246, 240, 182, 0.78)" : "rgba(202, 235, 210, 0.72)";
    ctx.beginPath();
    ctx.arc(anchor.x + Math.cos(angle) * radius, anchor.y + Math.sin(angle) * radius * 0.62, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }
  drawEcologyDailyVisualAccent(ctx, feedback, anchor, motion, pulse, accent);
  drawEcologyComboMotif(ctx, feedback.comboId, anchor.x - 0, anchor.y - 20 + pulse * 0.2, 1, motion);

  const cardX = Math.max(36, Math.min(width - 314, anchor.x - 254));
  const cardY = Math.max(86, Math.min(height - 112, anchor.y - 112));
  drawCanvasCard(ctx, cardX, cardY, 294, 92, "rgba(248, 252, 247, 0.94)");
  ctx.fillStyle = accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${feedback.tierLabel || "生态庭院"} · 夜间小事`, cardX + 20, cardY + 26);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 17px Microsoft YaHei";
  ctx.fillText(`${feedback.title} · ${feedback.comboName}`.slice(0, 18), cardX + 20, cardY + 52);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  const rewardText = feedback.rewards?.length ? `收获 ${feedback.rewards.map((reward) => reward.text).join("、")}` : feedback.moodText;
  ctx.fillText(String(rewardText || "").slice(0, 32), cardX + 20, cardY + 74);
  ctx.restore();
  return true;
}

export function drawEcologyInspectionFeedbackWorld({
  ctx,
  width = 960,
  height = 640,
  feedback = null,
  motion = 0,
  pulse = 0,
  anchor = { x: 760, y: 406 },
  accent = "#286f58",
  previewNodes = [],
  cardWidth = 308,
  cardHeight = 106,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawEcologyComboMotif = () => false,
  drawEcologyDailyVisualAccent = () => false,
} = {}) {
  if (!ctx || !feedback) return false;

  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(anchor.x, anchor.y, 8, anchor.x, anchor.y, 118 + Math.max(0, pulse));
  glow.addColorStop(0, "rgba(246, 240, 182, 0.44)");
  glow.addColorStop(0.45, "rgba(202, 235, 210, 0.2)");
  glow.addColorStop(1, "rgba(202, 235, 210, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, 122 + Math.max(0, pulse), 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 26;
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, 34 + Math.max(0, pulse), 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  drawEcologyDailyVisualAccent(ctx, feedback, anchor, motion, pulse, accent);
  drawEcologyComboMotif(ctx, feedback.comboId, anchor.x, anchor.y - 22 + pulse * 0.15, 2, motion);

  const cardX = Math.max(32, Math.min(width - cardWidth - 28, anchor.x - 232));
  const cardY = Math.max(92, Math.min(height - cardHeight - 28, anchor.y - 118));
  drawCanvasCard(ctx, cardX, cardY, cardWidth, cardHeight, "rgba(255, 248, 232, 0.95)");
  ctx.fillStyle = accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${feedback.landmarkLabel || "生态庭院"} · ${feedback.previewOnly ? "生态巡看留签" : "今日巡看"}`, cardX + 20, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 17px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "庭院有新动静").slice(0, 18), cardX + 20, cardY + 50);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(`${feedback.caretakerName || "精怪"}：${feedback.actionText || "照看庭院"}`.slice(0, 28), cardX + 20, cardY + 72);
  ctx.fillStyle = feedback.previewOnly ? "#286f58" : feedback.alreadyInspected ? "#8f5f3f" : "#b47d2f";
  ctx.font = "700 11px Microsoft YaHei";
  const rewardText = feedback.previewOnly
    ? "只预览定位 · 不记录巡看 / 不发奖励"
    : feedback.alreadyInspected
      ? "今日已巡看 · 可继续观察但不重复收益"
      : `灵石 +${feedback.rewardGold || 0} · 全体心情 +${feedback.rewardMood || 0}`;
  ctx.fillText(rewardText.slice(0, 34), cardX + 20, cardY + 92);

  if (previewNodes.length) {
    const nodeY = cardY + 108;
    const nodeWidth = 94;
    previewNodes.forEach((node, index) => {
      const nodeX = cardX + 18 + index * 104;
      const focused = feedback.activeNodeKey === node.key;
      ctx.fillStyle = focused ? `${accent}22` : "rgba(255, 253, 245, 0.82)";
      ctx.strokeStyle = focused ? `${accent}88` : "rgba(143, 95, 63, 0.18)";
      ctx.lineWidth = focused ? 1.8 : 1;
      ctx.beginPath();
      ctx.roundRect(nodeX, nodeY, nodeWidth, 28, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = focused ? accent : "#8f5f3f";
      ctx.font = "800 9px Microsoft YaHei";
      ctx.fillText(String(node.label || "").slice(0, 5), nodeX + 8, nodeY + 12);
      ctx.fillStyle = "#5d6f65";
      ctx.font = "8px Microsoft YaHei";
      ctx.fillText(String(node.title || "").slice(0, 8), nodeX + 8, nodeY + 23);
    });
  }

  ctx.restore();
  return true;
}
