export function drawDaySummaryLanternWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  activeRowId = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.anchor || !Array.isArray(spec.rows)) return false;
  const { rect } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.8) * 2.2;
  const glow = reducedMotion ? 0.18 : 0.18 + Math.max(0, Math.sin(motion * 2.4)) * 0.12;
  const cardY = rect.y + bob;
  const toneColors = {
    good: "#286f58",
    warn: "#be4f37",
    note: "#8f5f3f",
  };

  ctx.save();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.82)" : "rgba(224, 182, 109, 0.42)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([7, 8]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.quadraticCurveTo(rect.x + rect.width - 24, cardY + rect.height + 14, rect.x + rect.width - 34, cardY + rect.height - 14);
  ctx.stroke();
  ctx.setLineDash([]);

  const lanternGlow = ctx.createRadialGradient(spec.anchor.x, spec.anchor.y, 6, spec.anchor.x, spec.anchor.y, 72);
  lanternGlow.addColorStop(0, `rgba(246, 240, 182, ${0.42 + glow})`);
  lanternGlow.addColorStop(0.54, "rgba(224, 182, 109, 0.18)");
  lanternGlow.addColorStop(1, "rgba(224, 182, 109, 0)");
  ctx.fillStyle = lanternGlow;
  ctx.beginPath();
  ctx.arc(spec.anchor.x, spec.anchor.y, 72, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(190, 79, 55, 0.84)";
  ctx.beginPath();
  ctx.roundRect(spec.anchor.x - 15, spec.anchor.y - 24, 30, 40, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(246, 240, 182, 0.9)";
  ctx.beginPath();
  ctx.roundRect(spec.anchor.x - 9, spec.anchor.y - 16, 18, 25, 8);
  ctx.fill();

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.94)");
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.92)" : "rgba(180, 125, 47, 0.52)";
  ctx.lineWidth = active ? 2.8 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(224, 182, 109, 0.22)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, cardY + 13, 46, 42, 15);
  ctx.fill();
  ctx.fillStyle = "#b47d2f";
  ctx.font = "900 20px Microsoft YaHei";
  ctx.fillText("笺", rect.x + 27, cardY + 41);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 11px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 72, cardY + 25);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 15px Microsoft YaHei";
  ctx.fillText(`${spec.subtitle} · 明日建议`, rect.x + 72, cardY + 47);

  spec.rows.forEach((row) => {
    const rowActive = active && activeRowId === row.id;
    const color = toneColors[row.tone] || toneColors.note;
    const rowY = row.rect.y + bob;
    ctx.fillStyle = rowActive ? "rgba(255, 253, 245, 0.92)" : `${color}16`;
    ctx.strokeStyle = rowActive ? `${color}cc` : `${color}55`;
    ctx.lineWidth = rowActive ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(row.rect.x, rowY, row.rect.width, row.rect.height, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = "900 9px Microsoft YaHei";
    ctx.fillText(`${row.badge} ${row.label}`, row.rect.x + 8, rowY + 14);
    ctx.fillStyle = "#17231d";
    ctx.font = "800 9px Microsoft YaHei";
    ctx.fillText(String(row.value || "").slice(0, 12), row.rect.x + 8, rowY + 28);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "700 7px Microsoft YaHei";
    ctx.fillText(String(row.detail || "").slice(0, 13), row.rect.x + 8, rowY + 38);
  });

  ctx.fillStyle = "rgba(255, 253, 245, 0.84)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + rect.height - 32, rect.width - 32, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`明日建议：${spec.advice}`.slice(0, 39), rect.x + 26, cardY + rect.height - 17);
  ctx.fillStyle = active ? "#b47d2f" : "#5d6f65";
  ctx.font = "800 8px Microsoft YaHei";
  ctx.fillText(spec.note, rect.x + rect.width - 128, cardY + 18);
  ctx.restore();
  return true;
}
