export function drawFirstSpiritAssistPrimerWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawSpiritSprite = () => {},
  colorWithAlpha = () => "rgba(202, 235, 210, 0.3)",
} = {}) {
  if (!ctx || !spec?.rect || !spec?.previewPlots?.length || !spec?.bounds || !spec?.profile || !spec?.spirit) return false;
  const { rect, bounds, profile, spirit } = spec;
  const takeoverPlots = spec.takeoverPlots?.length ? spec.takeoverPlots : spec.previewPlots;

  ctx.save();
  ctx.fillStyle = active ? "rgba(246, 240, 182, 0.18)" : "rgba(202, 235, 210, 0.13)";
  ctx.strokeStyle = active ? `${profile.accent}cc` : `${profile.accent}77`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([9, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 10, bounds.minY - 10, bounds.maxX - bounds.minX + 20, bounds.maxY - bounds.minY + 20, 18);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 4, bounds.minY - 34, 154, 24, 12);
  ctx.fill();
  ctx.strokeStyle = `${profile.accent}66`;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 4, bounds.minY - 34, 154, 24, 12);
  ctx.stroke();
  ctx.fillStyle = profile.accent;
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(`${spec.previewLabel || "3x3 预览"} · 3x3 接管范围`, bounds.minX + 8, bounds.minY - 18);

  if (takeoverPlots.length > 1) {
    ctx.strokeStyle = "rgba(77, 145, 166, 0.58)";
    ctx.lineWidth = active ? 3 : 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([6, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 20;
    ctx.beginPath();
    takeoverPlots.forEach((plot, index) => {
      const px = plot.screenX + spec.tile / 2;
      const py = plot.screenY + spec.tile * 0.52;
      if (index === 0) ctx.moveTo(px, py);
      else {
        const prev = takeoverPlots[index - 1];
        ctx.quadraticCurveTo((prev.screenX + plot.screenX) / 2 + spec.tile / 2, Math.min(prev.screenY, plot.screenY) + spec.tile * 0.32, px, py);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    const beadIndex = Math.floor((reducedMotion ? 0.55 : (motion * 0.82) % 1) * Math.max(1, takeoverPlots.length - 1));
    const beadPlot = takeoverPlots[Math.max(0, Math.min(takeoverPlots.length - 1, beadIndex))];
    if (beadPlot) {
      ctx.fillStyle = "rgba(159, 209, 223, 0.88)";
      ctx.beginPath();
      ctx.ellipse(beadPlot.screenX + spec.tile / 2, beadPlot.screenY + spec.tile * 0.52 + bob, 9 + pulse * 0.35, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 253, 245, 0.92)";
      ctx.font = "900 8px Microsoft YaHei";
      ctx.fillText("接管水脉", beadPlot.screenX + spec.tile * 0.18, beadPlot.screenY + spec.tile * 0.82);
    }
  }

  takeoverPlots.forEach((plot, index) => {
    const localPulse = plot.needsWater ? 0.3 + Math.max(0, Math.sin(motion * 2.2 + index * 0.55)) * 0.36 : 0.12;
    ctx.fillStyle = plot.needsWater ? colorWithAlpha([202, 235, 210], localPulse) : "rgba(255, 253, 245, 0.14)";
    ctx.beginPath();
    ctx.roundRect(plot.screenX + 5, plot.screenY + 5, spec.tile - 10, spec.tile - 10, 12);
    ctx.fill();
    ctx.strokeStyle = plot.x === spec.targetPlot.x && plot.y === spec.targetPlot.y ? profile.accent : `${profile.accent}55`;
    ctx.lineWidth = plot.x === spec.targetPlot.x && plot.y === spec.targetPlot.y ? 2.4 : 1.4;
    ctx.beginPath();
    ctx.roundRect(plot.screenX + 8, plot.screenY + 8, spec.tile - 16, spec.tile - 16, 10);
    ctx.stroke();
    ctx.fillStyle = plot.needsWater ? "#286f58" : plot.hasCrop ? "#8f5f3f" : "#7a8d80";
    ctx.font = "900 8px Microsoft YaHei";
    ctx.fillText(plot.needsWater ? "代劳" : plot.hasCrop ? "待命" : "接管", plot.screenX + spec.tile * 0.14, plot.screenY + spec.tile * 0.82);
    ctx.fillStyle = plot.needsWater ? "#4d91a6" : `${profile.accent}aa`;
    ctx.beginPath();
    ctx.arc(plot.screenX + spec.tile * 0.76, plot.screenY + spec.tile * 0.24, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(String(index + 1), plot.screenX + spec.tile * 0.76 - 3, plot.screenY + spec.tile * 0.24 + 3);
    if (plot.needsWater) {
      ctx.fillStyle = "#4d91a6";
      ctx.beginPath();
      ctx.ellipse(plot.screenX + spec.tile * 0.5, plot.screenY + spec.tile * 0.55, 7, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.strokeStyle = `${profile.accent}88`;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(bounds.maxX, (bounds.minY + bounds.maxY) / 2);
  ctx.quadraticCurveTo(rect.x + 20, rect.y + rect.height / 2 + bob, rect.x + 28, rect.y + rect.height - 24 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.95)");
  ctx.strokeStyle = active ? profile.accent : `${profile.accent}88`;
  ctx.lineWidth = active ? 3 : 2;
  ctx.beginPath();
  ctx.roundRect(rect.x, rect.y + bob, rect.width, rect.height, 20);
  ctx.stroke();

  ctx.fillStyle = `${profile.accent}22`;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 16 + bob, 76, 76, 20);
  ctx.fill();
  drawSpiritSprite(ctx, spirit, rect.x + 18, rect.y + 18 + bob + pulse / 2, 72);

  ctx.fillStyle = profile.accent;
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 106, rect.y + 24 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 17), rect.x + 106, rect.y + 48 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.coverageLabel || "这 9 格会被伙伴接手", rect.x + 106, rect.y + 67 + bob);
  ctx.fillText((spec.detail || "").slice(0, 34), rect.x + 106, rect.y + 81 + bob);

  ctx.fillStyle = "rgba(202, 235, 210, 0.68)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 106, rect.y + 92 + bob, rect.width - 122, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText(`伙伴代劳预演 · ${spec.benefitLabel || `预计省下 ${spec.staminaHint} 点体力`}`, rect.x + 118, rect.y + 107 + bob);

  ctx.fillStyle = "rgba(255, 253, 245, 0.86)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 123 + bob, rect.width - 28, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("只定位伙伴栏与示范格，不会自动协助浇水、不会消耗体力", rect.x + 22, rect.y + 136 + bob);

  ctx.restore();
  return true;
}

export function drawSpiritAssistTrailWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  bob = 0,
  pulse = 0,
  active = false,
  activePlotKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec?.points?.length || !spec?.bounds || !spec?.profile || !spec?.anchor) return false;
  const { rect, bounds, points, profile } = spec;

  ctx.save();

  ctx.fillStyle = active ? "rgba(202, 235, 210, 0.22)" : "rgba(202, 235, 210, 0.14)";
  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.74)" : "rgba(77, 145, 166, 0.42)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([10, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 16;
  ctx.beginPath();
  ctx.roundRect(bounds.minX - 9, bounds.minY - 9, bounds.maxX - bounds.minX + 18, bounds.maxY - bounds.minY + 18, 18);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = active ? "rgba(77, 145, 166, 0.86)" : "rgba(77, 145, 166, 0.58)";
  ctx.lineWidth = active ? 3 : 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.setLineDash([7, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 20;
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.screenX, point.screenY);
    else {
      const prev = points[index - 1];
      ctx.quadraticCurveTo((prev.screenX + point.screenX) / 2, Math.min(prev.screenY, point.screenY) - 18, point.screenX, point.screenY);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);

  points.forEach((point, index) => {
    const localActive = active && activePlotKey === `${point.x},${point.y}`;
    const step = reducedMotion ? 0.5 : (motion * 0.75 + index * 0.13) % 1;
    const shimmer = Math.sin(step * Math.PI) * 0.28;
    ctx.fillStyle = localActive ? "rgba(255, 253, 245, 0.46)" : `rgba(159, 209, 223, ${0.2 + shimmer})`;
    ctx.beginPath();
    ctx.roundRect(point.rect.x + 6, point.rect.y + 6, point.rect.width - 12, point.rect.height - 12, 13);
    ctx.fill();
    ctx.strokeStyle = localActive ? "rgba(224, 182, 109, 0.86)" : "rgba(77, 145, 166, 0.48)";
    ctx.lineWidth = localActive ? 3 : 1.6;
    ctx.beginPath();
    ctx.roundRect(point.rect.x + 9, point.rect.y + 9, point.rect.width - 18, point.rect.height - 18, 13);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 253, 245, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(point.screenX, point.screenY + 12 + pulse * 0.2, point.rect.width * (0.22 + shimmer * 0.18), point.rect.height * 0.07, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = localActive ? "#b47d2f" : "#4d91a6";
    ctx.beginPath();
    ctx.arc(point.screenX + point.rect.width * 0.22, point.screenY - point.rect.height * 0.22, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(String(index + 1), point.screenX + point.rect.width * 0.22 - 3, point.screenY - point.rect.height * 0.22 + 3);
  });

  const bead = points[Math.floor((reducedMotion ? 0.6 : (motion * 0.62) % 1) * Math.max(0, points.length - 1))] || points[0];
  ctx.fillStyle = profile.glow || "rgba(202, 235, 210, 0.7)";
  ctx.beginPath();
  ctx.ellipse(bead.screenX, bead.screenY + 20 + bob, 28 + pulse, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.strokeStyle = profile.accent || "#286f58";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(bead.screenX, bead.screenY - 8 + bob, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = profile.accent || "#286f58";
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText((profile.glyph || "灵").slice(0, 1), bead.screenX - 6, bead.screenY - 4 + bob);

  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.82)" : "rgba(77, 145, 166, 0.46)";
  ctx.lineWidth = active ? 2.5 : 1.8;
  ctx.setLineDash([6, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y - 8);
  ctx.quadraticCurveTo((spec.anchor.x + rect.x) / 2, rect.y + rect.height + 24 + bob, rect.x + 34, rect.y + rect.height - 12 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(236, 248, 243, 0.94)");
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.84)" : "rgba(77, 145, 166, 0.52)";
  ctx.lineWidth = active ? 2.6 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + 1 + bob, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(77, 145, 166, 0.2)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + bob, 48, 44, 15);
  ctx.fill();
  ctx.fillStyle = profile.accent || "#286f58";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("浇", rect.x + 28, rect.y + 42 + bob);
  ctx.fillStyle = "#4d91a6";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 18), rect.x + 74, rect.y + 24 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 18), rect.x + 74, rect.y + 47 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail, rect.x + 74, rect.y + 65 + bob);

  ctx.fillStyle = "rgba(255, 253, 245, 0.82)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, rect.y + rect.height - 28 + bob, rect.width - 32, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(spec.cta.slice(0, 36), rect.x + 26, rect.y + rect.height - 16 + bob);
  ctx.restore();
  return true;
}
