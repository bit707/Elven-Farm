export function drawBaizhiQuestPlantFeedbackWorld({
  ctx,
  width = 960,
  feedback = null,
  pulse = 0,
  activeCutscene = false,
  activeDialogueCount = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback || activeCutscene || activeDialogueCount > 0) return false;
  const x = width - 372;
  const y = 292 + pulse;
  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  drawCanvasCard(ctx, x, y, 328, 126, "rgba(255, 248, 232, 0.95)");
  ctx.fillStyle = "rgba(40, 111, 88, 0.14)";
  ctx.beginPath();
  ctx.arc(x + 286, y + 26, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#286f58";
  ctx.beginPath();
  ctx.roundRect(x + 22, y + 22, 72, 72, 18);
  ctx.fill();
  ctx.fillStyle = "#fff0d4";
  ctx.font = "700 32px Microsoft YaHei";
  ctx.fillText("药", x + 44, y + 70);

  ctx.fillStyle = "#b47d2f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText("白芷委托 · 第一批落田", x + 108, y + 26);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 18px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "").slice(0, 16), x + 108, y + 52);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(`灵田 ${feedback.plotX},${feedback.plotY} · 奖励 ${feedback.rewardPreview}`.slice(0, 24), x + 108, y + 74);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 30), x + 108, y + 96);
  ctx.fillText(String(feedback.cta || "").slice(0, 30), x + 108, y + 114);
  ctx.restore();
  return true;
}

export function drawBaizhiQuestStageFeedbackWorld({
  ctx,
  feedback = null,
  pulse = 0,
  activeCutscene = false,
  activeDialogueCount = 0,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !feedback || activeCutscene || activeDialogueCount > 0) return false;
  const x = 42;
  const y = 386 + pulse;
  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  drawCanvasCard(ctx, x, y, 348, 128, "rgba(255, 248, 232, 0.95)");
  ctx.fillStyle = "rgba(224, 182, 109, 0.16)";
  ctx.beginPath();
  ctx.arc(x + 304, y + 26, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8f5f3f";
  ctx.beginPath();
  ctx.roundRect(x + 22, y + 22, 70, 70, 18);
  ctx.fill();
  ctx.fillStyle = "#fff0d4";
  ctx.font = "700 30px Microsoft YaHei";
  ctx.fillText(feedback.phase === "favor_ready" ? "诊" : "药", x + 44, y + 68);

  ctx.fillStyle = "#b47d2f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.title || "").slice(0, 18), x + 108, y + 26);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 18px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "").slice(0, 16), x + 108, y + 52);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(`奖励预览 ${feedback.rewardPreview}`.slice(0, 24), x + 108, y + 74);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 30), x + 108, y + 96);
  ctx.fillText(String(feedback.cta || "").slice(0, 30), x + 108, y + 114);
  ctx.restore();
  return true;
}

export function drawHerbValleyUnlockFeedbackWorld({
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
  const x = Math.round(width / 2 - 240);
  const y = Math.round(height / 2 - 96 + pulse);
  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(x + 108, y + 92, 18, x + 108, y + 92, 220);
  glow.addColorStop(0, "rgba(202, 235, 210, 0.38)");
  glow.addColorStop(0.46, "rgba(77, 145, 166, 0.14)");
  glow.addColorStop(1, "rgba(202, 235, 210, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 108, y + 92, 220, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, 480, 172, "rgba(255, 253, 245, 0.95)");
  ctx.fillStyle = "rgba(202, 235, 210, 0.7)";
  ctx.beginPath();
  ctx.roundRect(x + 22, y + 30, 112, 108, 26);
  ctx.fill();
  ctx.strokeStyle = "rgba(40, 111, 88, 0.62)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 44, y + 122);
  ctx.bezierCurveTo(x + 70, y + 72, x + 98, y + 64, x + 122, y + 36);
  ctx.stroke();
  ctx.fillStyle = "rgba(77, 145, 166, 0.28)";
  ctx.beginPath();
  ctx.ellipse(x + 82, y + 116, 42 + pulse, 12, -0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.title || "").slice(0, 18), x + 160, y + 44);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 23px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "").slice(0, 18), x + 160, y + 78);
  ctx.fillStyle = "#286f58";
  ctx.font = "14px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 34), x + 160, y + 108);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.cta || "").slice(0, 38), x + 160, y + 136);
  ctx.restore();
  return true;
}

export function drawBaizhiChapterFinishFeedbackWorld({
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
  const x = Math.round(width / 2 - 246);
  const y = Math.round(height / 2 - 108 + pulse);
  ctx.save();
  ctx.globalAlpha = Number(feedback.fade ?? 1);
  const glow = ctx.createRadialGradient(x + 116, y + 104, 18, x + 116, y + 104, 236);
  glow.addColorStop(0, "rgba(224, 182, 109, 0.34)");
  glow.addColorStop(0.48, "rgba(202, 235, 210, 0.18)");
  glow.addColorStop(1, "rgba(224, 182, 109, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x + 116, y + 104, 236, 0, Math.PI * 2);
  ctx.fill();

  drawCanvasCard(ctx, x, y, 492, 184, "rgba(255, 253, 245, 0.96)");
  ctx.fillStyle = "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.roundRect(x + 22, y + 28, 122, 122, 30);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.beginPath();
  ctx.ellipse(x + 84, y + 114, 40 + pulse, 14, -0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 253, 245, 0.76)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + 84, y + 96, 26 + pulse / 3, 0.2, Math.PI * 1.74);
  ctx.stroke();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "700 28px Microsoft YaHei";
  ctx.fillText("露", x + 68, y + 108);

  ctx.fillStyle = "#b47d2f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.title || "").slice(0, 18), x + 170, y + 42);
  ctx.fillStyle = "#17231d";
  ctx.font = "700 24px Microsoft YaHei";
  ctx.fillText(String(feedback.headline || "").slice(0, 18), x + 170, y + 78);
  ctx.fillStyle = "#286f58";
  ctx.font = "14px Microsoft YaHei";
  ctx.fillText(String(feedback.detail || "").slice(0, 36), x + 170, y + 110);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "700 13px Microsoft YaHei";
  ctx.fillText(String(feedback.rewardHint || "").slice(0, 34), x + 170, y + 136);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(String(feedback.cta || "").slice(0, 40), x + 170, y + 160);
  ctx.restore();
  return true;
}
