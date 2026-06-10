export function drawSleepPrepChecklistCardWorld({
  ctx,
  spec = null,
  reducedMotion = false,
  motionMs = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec) return false;
  const rows = (spec.topRows.length ? spec.topRows : spec.rows.slice(0, 2)).slice(0, 3);
  const width = 284;
  const height = 66 + rows.length * 21;
  const x = ctx.canvas.width - width - 42;
  const y = 128;
  const accent = spec.stateClass === "busy" ? "#be4f37" : spec.stateClass === "warn" ? "#b47d2f" : "#286f58";
  const bob = reducedMotion ? 0 : Math.sin(motionMs / 520) * 2;
  ctx.save();
  drawCanvasCard(ctx, x, y + bob, width, height, spec.stateClass === "ready" ? "rgba(237, 243, 223, 0.88)" : "rgba(255, 248, 232, 0.9)");
  ctx.fillStyle = `${accent}22`;
  ctx.beginPath();
  ctx.roundRect(x + 16, y + 16 + bob, 50, 42, 14);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.font = "800 18px Microsoft YaHei";
  ctx.fillText("暮", x + 31, y + 43 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 15px Microsoft YaHei";
  ctx.fillText(`入夜前准备 ${spec.readinessScore}`, x + 78, y + 31 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(spec.sleepAdvice.slice(0, 22), x + 78, y + 51 + bob);
  rows.forEach((row, index) => {
    const rowY = y + 78 + index * 21 + bob;
    ctx.fillStyle = row.status === "warn" ? "#be4f37" : row.status === "todo" ? "#8f5f3f" : "#286f58";
    ctx.font = "700 12px Microsoft YaHei";
    ctx.fillText(`${index + 1}. ${row.label}`.slice(0, 22), x + 22, rowY);
  });
  ctx.restore();
  return true;
}
