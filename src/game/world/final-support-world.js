export function drawFinalSupportOverviewWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect, stats } = spec;
  const accent = stats.stageReady > 0 ? "#8f1f1f" : stats.supportReady > 0 ? "#be4f37" : stats.prepReady > 0 ? "#b47d2f" : "#8f5f3f";
  const gold = "#c9953d";
  const ink = "#17231d";
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.42) * 1.7;

  ctx.save();
  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 248, 232, 0.97)");
  ctx.fillStyle = "rgba(143, 31, 31, 0.11)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 12, rect.y + 12 + bob, rect.width - 24, 46, 18);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 18 + bob, 38, 29, 12);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText("总", rect.x + 29, rect.y + 39 + bob);
  ctx.fillStyle = ink;
  ctx.font = "800 14px Microsoft YaHei";
  ctx.fillText("终阵进度总览牌 · 可点", rect.x + 66, rect.y + 31 + bob);
  ctx.fillStyle = accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(spec.subtitle, rect.x + 66, rect.y + 48 + bob);

  ctx.fillStyle = "rgba(255, 253, 245, 0.72)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 68 + bob, rect.width - 36, 12, 7);
  ctx.fill();
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.roundRect(rect.x + 18, rect.y + 68 + bob, Math.max(10, Math.round((rect.width - 36) * spec.percent / 100)), 12, 7);
  ctx.fill();
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.shortSummary, rect.x + 18, rect.y + 92 + bob);

  for (const node of spec.nodes) {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    ctx.fillStyle = active ? "rgba(255, 253, 245, 0.96)" : "rgba(255, 253, 245, 0.68)";
    ctx.strokeStyle = active ? "rgba(201, 149, 61, 0.84)" : "rgba(143, 31, 31, 0.26)";
    ctx.lineWidth = active ? 1.8 : 1;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 11);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = active ? "rgba(201, 149, 61, 0.28)" : "rgba(143, 31, 31, 0.14)";
    ctx.beginPath();
    ctx.roundRect(nodeRect.x + 6, nodeRect.y + 7 + bob, 20, 18, 8);
    ctx.fill();
    ctx.fillStyle = active ? gold : accent;
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.badge, nodeRect.x + 11, nodeRect.y + 20 + bob);
    ctx.fillStyle = ink;
    ctx.font = "800 10px Microsoft YaHei";
    ctx.fillText(node.shortLabel, nodeRect.x + 31, nodeRect.y + 15 + bob);
    ctx.fillStyle = "#5d6f65";
    ctx.font = "9px Microsoft YaHei";
    ctx.fillText(node.shortTitle, nodeRect.x + 31, nodeRect.y + 27 + bob);
  }

  ctx.fillStyle = activeNodeKey ? accent : "#5d6f65";
  ctx.font = "700 10px Microsoft YaHei";
  ctx.fillText("只定位总览 · 不自动领取 / 激活 / 应用", rect.x + 18, rect.y + rect.height - 8 + bob);
  if (activeNodeKey) {
    ctx.strokeStyle = "rgba(201, 149, 61, 0.82)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}
