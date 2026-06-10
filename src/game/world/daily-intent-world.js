export function drawDailyIntentWorldGuideWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motion = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec) return false;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2.2) * 4;
  const { cardX, cardY, target, palette } = spec;
  const recentTrail = (spec.trail || []).slice(0, 2);
  const trend = spec.trend || null;
  const trendActive = Number(trend?.count || 0) >= 2 || trend?.pendingToday;
  const cardHeight = recentTrail.length ? trendActive ? 150 : 132 : trendActive ? 130 : 112;

  ctx.save();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 7]);
  ctx.globalAlpha = 0.52;
  ctx.beginPath();
  ctx.moveTo(cardX + 14, cardY + 88);
  ctx.quadraticCurveTo(cardX - 92, cardY + 40, target.x, target.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.arc(target.x, target.y, 28 + pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(target.x, target.y, 12 + pulse * 0.3, 0, Math.PI * 2);
  ctx.stroke();

  for (let index = 0; index < Math.min(5, spec.trailCount); index += 1) {
    const angle = motion * 0.8 + index * 1.76;
    const radius = 36 + (index % 2) * 9;
    const x = target.x + Math.cos(angle) * radius;
    const y = target.y + Math.sin(angle) * radius * 0.58;
    ctx.fillStyle = index % 2 ? "rgba(255, 253, 245, 0.78)" : palette.accent;
    ctx.beginPath();
    ctx.arc(x, y, index % 2 ? 3 : 4, 0, Math.PI * 2);
    ctx.fill();
  }

  if (trendActive) {
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = trend.activeToday ? 0.72 : 0.38;
    for (let ring = 0; ring < Math.min(3, Math.max(1, Number(trend.count || 1))); ring += 1) {
      ctx.beginPath();
      ctx.ellipse(target.x, target.y, 46 + ring * 12 + pulse * 0.28, 22 + ring * 5, motion * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  drawCanvasCard(ctx, target.x + 18, target.y - 18, 94, 30, "rgba(255, 253, 245, 0.86)");
  ctx.fillStyle = palette.accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(target.label.slice(0, 6), target.x + 32, target.y + 1);

  drawCanvasCard(ctx, cardX, cardY, 306, cardHeight, spec.trailCount || trendActive ? "rgba(255, 248, 232, 0.92)" : "rgba(248, 252, 247, 0.88)");
  ctx.fillStyle = palette.soft;
  ctx.beginPath();
  ctx.roundRect(cardX + 16, cardY + 16, 52, 46, 16);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "800 18px Microsoft YaHei";
  ctx.fillText("签", cardX + 32, cardY + 45);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 15px Microsoft YaHei";
  ctx.fillText(`今日主轴 · ${spec.title}`, cardX + 82, cardY + 31);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(`${spec.tag || palette.label} · 足迹 ${spec.trailCount} 条`, cardX + 82, cardY + 51);
  ctx.fillStyle = palette.accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`下一手：${spec.cta || "看目标"}`.slice(0, 20), cardX + 22, cardY + 82);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText((spec.rewardText || spec.detail || palette.label).slice(0, 34), cardX + 22, cardY + 101);
  if (trendActive) {
    ctx.fillStyle = trend.activeToday ? palette.accent : "#8f5f3f";
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(`${trend.title}：${trend.activeToday ? `已连 ${trend.count} 日` : "今天续上可成线"}`.slice(0, 30), cardX + 22, cardY + 120);
  }
  recentTrail.forEach((entry, index) => {
    ctx.fillStyle = index === 0 ? palette.accent : "#8f5f3f";
    ctx.font = "700 11px Microsoft YaHei";
    ctx.fillText(`足迹：${entry.detail}`.slice(0, 30), cardX + 22, cardY + (trendActive ? 138 : 121) + index * 17);
  });
  ctx.restore();
  return true;
}

export function drawDailyIntentFeedbackWorld({
  ctx,
  width = 960,
  height = 640,
  feedback = null,
  palette = null,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback) return false;
  const safePalette = palette || feedback.palette || { accent: "#8da462", soft: "rgba(141, 164, 98, 0.2)", label: "灵田根脉" };
  const progress = Math.max(0, Math.min(1, Number(feedback.age || 0) / Math.max(1, Number(feedback.duration || 3400))));
  const fade = Number(feedback.fade ?? 1);
  const lift = reducedMotion ? 0 : Math.sin(progress * Math.PI) * 10;
  const x = Math.max(44, width - 384);
  const y = Math.max(318, height - 226) - lift;

  ctx.save();
  ctx.globalAlpha = fade;
  for (let index = 0; index < 8; index += 1) {
    const angle = progress * Math.PI * 2 + index * 0.78;
    const radius = 42 + index * 8;
    const mx = x + 48 + Math.cos(angle) * radius;
    const my = y + 48 + Math.sin(angle) * radius * 0.44;
    ctx.fillStyle = index % 2 ? "rgba(255, 253, 245, 0.74)" : safePalette.accent;
    ctx.globalAlpha = fade * (0.16 + (index % 3) * 0.08);
    ctx.beginPath();
    ctx.arc(mx, my, 5 + (index % 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = fade;

  drawCanvasCard(ctx, x, y, 332, 132, feedback.fresh ? "rgba(255, 248, 232, 0.96)" : "rgba(255, 253, 245, 0.9)");
  ctx.fillStyle = safePalette.soft || "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.roundRect(x + 18, y + 18, 58, 54, 18);
  ctx.fill();
  ctx.strokeStyle = safePalette.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x + 47, y + 45, 17 + (reducedMotion ? 0 : Math.sin(progress * Math.PI) * 4), 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = safePalette.accent;
  ctx.font = "800 18px Microsoft YaHei";
  ctx.fillText("回", x + 33, y + 52);

  ctx.fillStyle = "#17231d";
  ctx.font = "700 16px Microsoft YaHei";
  ctx.fillText(`主轴回响 · ${feedback.title}`, x + 92, y + 34);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(`${feedback.label || "今日推进"} · +${Number(feedback.amount || 1)} 足迹`, x + 92, y + 55);
  ctx.fillStyle = safePalette.accent;
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "今日行动已经写入日终回顾。").slice(0, 30), x + 22, y + 90);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText((feedback.rewardText || "入夜后会汇总到今日目标回顾").slice(0, 34), x + 22, y + 113);
  ctx.restore();
  return true;
}

export function drawDailyIntentWorldEchoWorld({
  ctx,
  feedback = null,
  point = null,
  palette = null,
  reducedMotion = false,
  motion = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback || !point) return false;
  const safePalette = palette || feedback.palette || { accent: "#8da462", soft: "rgba(141, 164, 98, 0.2)", label: "灵田根脉" };
  const duration = Math.max(1, Number(feedback.duration || 3400));
  const progress = Math.max(0, Math.min(1, Number(feedback.age || 0) / duration));
  const fade = Number(feedback.fade ?? 1);
  const pulse = reducedMotion ? 0 : Math.sin(progress * Math.PI) * 10;

  ctx.save();
  ctx.globalAlpha = fade;
  ctx.fillStyle = safePalette.soft || "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.arc(point.x, point.y, 30 + pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = safePalette.accent;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 16 + pulse * 0.36, 0, Math.PI * 2);
  ctx.stroke();

  if (feedback.intent === "money") {
    for (let index = 0; index < 7; index += 1) {
      const coinX = point.x - 34 + index * 11;
      const coinY = point.y - 10 - Math.sin(motion * 3 + index) * 9 - progress * 16;
      ctx.fillStyle = index % 2 ? "rgba(246, 240, 182, 0.9)" : "#b47d2f";
      ctx.beginPath();
      ctx.ellipse(coinX, coinY, 5, 7, 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (feedback.intent === "build") {
    ctx.strokeStyle = "#8f5f3f";
    ctx.lineWidth = 3;
    for (let index = 0; index < 4; index += 1) {
      const sparkX = point.x - 24 + index * 16;
      const sparkY = point.y - 18 + (index % 2) * 10;
      ctx.beginPath();
      ctx.moveTo(sparkX - 6, sparkY);
      ctx.lineTo(sparkX + 7 + progress * 6, sparkY - 7);
      ctx.stroke();
      ctx.fillStyle = "rgba(240, 165, 78, 0.82)";
      ctx.beginPath();
      ctx.arc(sparkX + 10, sparkY - 8, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (feedback.intent === "explore") {
    ctx.strokeStyle = "#4d91a6";
    ctx.lineWidth = 2;
    for (let index = 0; index < 3; index += 1) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 24 + index * 12 + progress * 18, -0.8, 1.1 + index * 0.2);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255, 253, 245, 0.72)";
    ctx.beginPath();
    ctx.moveTo(point.x + 34, point.y - 18);
    ctx.lineTo(point.x + 50, point.y - 4);
    ctx.lineTo(point.x + 30, point.y + 2);
    ctx.closePath();
    ctx.fill();
  } else if (feedback.intent === "relationship") {
    for (let index = 0; index < 5; index += 1) {
      const heartX = point.x - 22 + index * 11;
      const heartY = point.y - 22 - Math.sin(motion * 2.4 + index) * 5 - progress * 10;
      ctx.fillStyle = index % 2 ? "rgba(216, 127, 141, 0.88)" : "rgba(255, 248, 232, 0.88)";
      ctx.beginPath();
      ctx.arc(heartX - 3, heartY, 4, 0, Math.PI * 2);
      ctx.arc(heartX + 3, heartY, 4, 0, Math.PI * 2);
      ctx.lineTo(heartX, heartY + 9);
      ctx.closePath();
      ctx.fill();
    }
  } else {
    ctx.strokeStyle = "#8da462";
    ctx.lineWidth = 2.2;
    for (let index = 0; index < 4; index += 1) {
      const waveY = point.y + 14 + index * 5;
      ctx.beginPath();
      ctx.moveTo(point.x - 34, waveY);
      ctx.bezierCurveTo(point.x - 16, waveY - 10, point.x + 12, waveY + 10, point.x + 34, waveY - 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#48a868";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y - 20, 6, 14, -0.5, 0, Math.PI * 2);
    ctx.ellipse(point.x + 12, point.y - 19, 6, 13, 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  drawCanvasCard(ctx, point.x + 18, point.y - 48, 126, 34, "rgba(255, 253, 245, 0.86)");
  ctx.fillStyle = safePalette.accent;
  ctx.font = "700 12px Microsoft YaHei";
  ctx.fillText(`${point.label} · ${feedback.title}`.slice(0, 12), point.x + 30, point.y - 27);
  ctx.restore();
  return true;
}
