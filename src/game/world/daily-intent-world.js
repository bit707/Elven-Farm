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
