export function drawChapter4DroughtFeedbackWorld({
  ctx,
  width = 960,
  height = 640,
  feedback = null,
  pulse = 0,
  activeCutscene = false,
  activeDialogueCount = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback || activeCutscene || activeDialogueCount > 0) return false;
  const x = Math.round(width / 2 - 260);
  const y = Math.round(height / 2 - 118 + pulse);
  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(x + 126, y + 108, 24, x + 126, y + 108, 260);
  glow.addColorStop(0, "rgba(190, 79, 55, 0.32)");
  glow.addColorStop(0.48, "rgba(224, 182, 109, 0.16)");
  glow.addColorStop(1, "rgba(190, 79, 55, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 126, y + 108, 260, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, 520, 196, "rgba(255, 248, 232, 0.96)");
  ctx.fillStyle = "rgba(190, 79, 55, 0.14)";
  ctx.beginPath();
  ctx.roundRect(x + 24, y + 30, 130, 132, 30);
  ctx.fill();
  ctx.strokeStyle = "rgba(143, 95, 63, 0.52)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(x + 88, y + 100, 40, 24, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(92, 60, 42, 0.62)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(x + 54 + i * 16, y + 108);
    ctx.lineTo(x + 42 + i * 18, y + 136 + (i % 2) * 10);
    ctx.stroke();
  }
  ctx.fillStyle = "#be4f37";
  ctx.font = "700 30px Microsoft YaHei";
  ctx.fillText("旱", x + 70, y + 88);

  ctx.fillStyle = "#be4f37";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.title || "").slice(0, 18), x + 180, y + 42);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 24px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "").slice(0, 18), x + 180, y + 78);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "14px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 38), x + 180, y + 110);
  ctx.fillStyle = "#286f58";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.rewardHint || "").slice(0, 38), x + 180, y + 138);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.cta || "").slice(0, 46), x + 180, y + 164);
  ctx.restore();
  return true;
}
