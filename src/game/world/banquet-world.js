export function drawFinalBanquetAfterwordBridgeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect) return false;
  const { rect } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 2.1) * 2.5;
  const cardY = rect.y + bob;

  ctx.save();
  ctx.strokeStyle = active ? "rgba(224, 182, 109, 0.82)" : "rgba(224, 182, 109, 0.42)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash([8, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 14;
  ctx.beginPath();
  ctx.moveTo(spec.anchor.x, spec.anchor.y);
  ctx.bezierCurveTo(spec.anchor.x + 104, spec.anchor.y - 82, rect.x - 34, cardY + rect.height * 0.8, rect.x + 12, cardY + rect.height * 0.6);
  ctx.stroke();
  ctx.setLineDash([]);

  drawCanvasCard(ctx, rect.x, cardY, rect.width, rect.height, "rgba(255, 248, 232, 0.92)");
  ctx.strokeStyle = active ? "rgba(180, 125, 47, 0.78)" : "rgba(180, 125, 47, 0.34)";
  ctx.lineWidth = active ? 2.5 : 1.5;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, cardY + 1, rect.width - 2, rect.height - 2, 18);
  ctx.stroke();

  ctx.fillStyle = "#b47d2f";
  ctx.beginPath();
  ctx.roundRect(rect.x + 16, cardY + 15, 46, 38, 14);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 17px Microsoft YaHei";
  ctx.fillText("卷", rect.x + 29, cardY + 40);

  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 76, cardY + 28);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 11px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 22), rect.x + 76, cardY + 47);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 31), rect.x + 16, cardY + 70);

  spec.rows.slice(0, 4).forEach((row, index) => {
    const chipX = rect.x + 16 + index * 72;
    const chipY = cardY + 84;
    ctx.fillStyle = row.stateClass === "ready" ? "rgba(224, 182, 109, 0.22)" : row.stateClass === "done" ? "rgba(40, 111, 88, 0.16)" : "rgba(255, 253, 245, 0.76)";
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, 64, 18, 9);
    ctx.fill();
    ctx.fillStyle = row.stateClass === "ready" ? "#b47d2f" : row.stateClass === "done" ? "#286f58" : "#8f5f3f";
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(row.label.slice(0, 4), chipX + 10, chipY + 13);
  });

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 9px Microsoft YaHei";
  ctx.fillText(spec.safety.slice(0, 30), rect.x + 16, cardY + rect.height - 9);
  ctx.restore();
  return true;
}
