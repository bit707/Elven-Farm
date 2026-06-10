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
