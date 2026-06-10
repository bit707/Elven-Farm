export function drawSpiritAuraWorld({
  ctx,
  x = 0,
  y = 0,
  label = "",
  pulse = 0,
} = {}) {
  if (!ctx) return false;
  ctx.save();
  ctx.fillStyle = "rgba(246, 240, 182, 0.22)";
  ctx.beginPath();
  ctx.ellipse(x + 60, y + 88, 72 + pulse, 24 + pulse / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.78)";
  ctx.beginPath();
  ctx.roundRect(x + 10, y + 118, 152, 34, 14);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "700 16px Microsoft YaHei";
  ctx.fillText(label, x + 24, y + 141);
  ctx.restore();
  return true;
}

export function drawSpiritCropScoutWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  active = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.row) return false;
  const { rect, copy, plotPoint, spiritPoint, row } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 2 + spec.index) * 2.2;
  const cardY = rect.y + pulse;

  ctx.save();
  ctx.strokeStyle = active ? `${copy.accent}dd` : `${copy.accent}88`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([6, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 13;
  ctx.beginPath();
  ctx.moveTo(spiritPoint.x, spiritPoint.y);
  ctx.quadraticCurveTo((spiritPoint.x + plotPoint.x) / 2, Math.min(spiritPoint.y, plotPoint.y) - 42, plotPoint.x, plotPoint.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = `${copy.accent}26`;
  ctx.beginPath();
  ctx.ellipse(plotPoint.x, plotPoint.y + 20, 54 + Math.abs(pulse), 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `${copy.accent}99`;
  ctx.lineWidth = active ? 2.6 : 1.8;
  ctx.beginPath();
  ctx.arc(plotPoint.x, plotPoint.y, 17 + Math.abs(pulse), 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = copy.accent;
  ctx.font = "900 13px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(copy.glyph, plotPoint.x, plotPoint.y + 5);

  const beadProgress = reducedMotion ? 0.55 : (motion * 0.24 + spec.index * 0.13) % 1;
  const beadX = spiritPoint.x + (plotPoint.x - spiritPoint.x) * beadProgress;
  const beadY = spiritPoint.y + (plotPoint.y - spiritPoint.y) * beadProgress - Math.sin(beadProgress * Math.PI) * 36;
  ctx.fillStyle = copy.fill;
  ctx.strokeStyle = copy.accent;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(beadX, beadY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, copy.fill);
  ctx.strokeStyle = active ? `${copy.accent}dd` : `${copy.accent}88`;
  ctx.lineWidth = active ? 2.8 : 1.7;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, cardY + 1.5, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = copy.accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 14, 42, 34, 13);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(copy.glyph, rect.x + 35, cardY + 36);
  ctx.textAlign = "left";
  ctx.fillStyle = "#17231d";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 66, cardY + 25);
  ctx.fillStyle = copy.accent;
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 22), rect.x + 66, cardY + 42);

  ctx.fillStyle = "#5d6f65";
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`${copy.action} · ${row.cropName}`.slice(0, 26), rect.x + 18, cardY + 66);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText(copy.line.slice(0, 30), rect.x + 18, cardY + 84);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 9px Microsoft YaHei";
  ctx.fillText(spec.safetyText.slice(0, 34), rect.x + 18, cardY + rect.height - 10);

  if (!reducedMotion) {
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i % 2 ? "rgba(255, 253, 245, 0.88)" : `${copy.accent}66`;
      ctx.beginPath();
      ctx.arc(rect.x + rect.width - 22 - i * 16, cardY + 18 + Math.sin(motion * 2 + i) * 3, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
  return true;
}
