export function drawEarlyRewardKeepsakeWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  focused = false,
  focusedNodeId = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length || !spec.point) return false;
  const { rect, point, nodes } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.45) * 1.8;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 4.5) * 2.2;

  ctx.save();

  ctx.strokeStyle = "rgba(180, 125, 47, 0.5)";
  ctx.lineWidth = focused ? 2.8 : 1.8;
  ctx.setLineDash([6, 6]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - 10);
  ctx.quadraticCurveTo((point.x + rect.x + 36) / 2, rect.y - 34, rect.x + 28, rect.y + rect.height - 18 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(224, 182, 109, 0.2)";
  ctx.beginPath();
  ctx.ellipse(point.x, point.y + 10, 34 + pulse, 13 + pulse * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#b47d2f";
  ctx.beginPath();
  ctx.roundRect(point.x - 16, point.y - 29 + bob, 32, 30, 10);
  ctx.fill();
  ctx.fillStyle = "#fffdf5";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText("奖", point.x, point.y - 10 + bob);
  ctx.textAlign = "left";

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 253, 245, 0.93)");
  ctx.fillStyle = "rgba(224, 182, 109, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 12 + bob, 128, 24, 12);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 13px Microsoft YaHei";
  ctx.fillText(`落袋回看 · ${spec.timeMin}m`, rect.x + 24, rect.y + 29 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 16px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 154, rect.y + 30 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 38), rect.x + 18, rect.y + 51 + bob);

  const lineY = rect.y + 73 + bob;
  ctx.strokeStyle = "rgba(141, 164, 98, 0.34)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  nodes.forEach((node, index) => {
    const x = node.point.x;
    if (index === 0) ctx.moveTo(x, lineY);
    else ctx.lineTo(x, lineY);
  });
  ctx.stroke();

  nodes.forEach((node) => {
    const active = focused && focusedNodeId === node.id;
    const x = node.point.x;
    const y = node.point.y + bob;
    ctx.fillStyle = `${node.tone}22`;
    ctx.beginPath();
    ctx.arc(x, y, active ? 23 + Math.max(0, pulse) : 21, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = node.tone;
    ctx.beginPath();
    ctx.arc(x, y, active ? 15 + Math.max(0, pulse) * 0.45 : 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 12px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(node.glyph, x, y + 4);
    ctx.fillStyle = active ? "#17231d" : "#5d6f65";
    ctx.font = active ? "900 11px Microsoft YaHei" : "800 10px Microsoft YaHei";
    ctx.fillText(node.title, x, rect.y + 105 + bob);
    ctx.fillStyle = "#6b766f";
    ctx.font = "700 9px Microsoft YaHei";
    ctx.fillText(node.detail.slice(0, 10), x, rect.y + 118 + bob);
  });
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(255, 248, 232, 0.94)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 78, rect.y + 12 + bob, 60, 22, 11);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 10px Microsoft YaHei";
  ctx.fillText("可点回看", rect.x + rect.width - 68, rect.y + 27 + bob);

  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.route} · 点击只定位`.slice(0, 38), rect.x + 18, rect.y + rect.height - 8 + bob);

  if (focused) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.76)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}

export function drawEarlyRewardWorldRoadsignWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  active = false,
  reducedMotion = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.point) return false;
  const { rect, point, palette } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.8) * 2;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 3.4) * 2;

  ctx.save();
  ctx.strokeStyle = `${palette.accent}66`;
  ctx.lineWidth = active ? 2.8 : 1.8;
  ctx.setLineDash([5, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 10;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - 8);
  ctx.quadraticCurveTo((point.x + rect.x) / 2, Math.min(point.y, rect.y) - 26, rect.x + 36, rect.y + rect.height - 18 + bob);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.ellipse(point.x, point.y + 12, 38 + pulse, 14 + pulse * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.roundRect(point.x - 17, point.y - 28 + bob, 34, 30, 10);
  ctx.fill();
  ctx.fillStyle = "rgba(255, 253, 245, 0.96)";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText(spec.target?.glyph || palette.glyph || "奖", point.x, point.y - 9 + bob);
  ctx.textAlign = "left";

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, palette.soft);
  ctx.fillStyle = palette.glow;
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 14 + bob, 46, 44, 14);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText(palette.glyph || "奖", rect.x + 28, rect.y + 42 + bob);
  ctx.fillStyle = palette.accent;
  ctx.font = "800 12px Microsoft YaHei";
  ctx.fillText(`${palette.label} · ${spec.timeMin} 分钟`, rect.x + 74, rect.y + 27 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "800 16px Microsoft YaHei";
  ctx.fillText(spec.title.slice(0, 17), rect.x + 74, rect.y + 50 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "12px Microsoft YaHei";
  ctx.fillText(spec.detail.slice(0, 32), rect.x + 18, rect.y + 78 + bob);
  ctx.fillStyle = palette.accent;
  ctx.font = "700 11px Microsoft YaHei";
  ctx.fillText(`前三小时奖励路标 ${spec.progress} · 点击定位 ${spec.actionLabel}`.slice(0, 34), rect.x + 18, rect.y + 96 + bob);

  const barWidth = 70;
  ctx.fillStyle = "rgba(23, 35, 29, 0.12)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - barWidth - 18, rect.y + 18 + bob, barWidth, 7, 4);
  ctx.fill();
  const [done, total] = spec.progress.split("/").map((value) => Number(value || 0));
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - barWidth - 18, rect.y + 18 + bob, Math.max(6, barWidth * Math.min(1, done / Math.max(1, total))), 7, 4);
  ctx.fill();

  if (active) {
    ctx.strokeStyle = "rgba(224, 182, 109, 0.78)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rect.x + 4, rect.y + 4 + bob, rect.width - 8, rect.height - 8, 18);
    ctx.stroke();
  }
  ctx.restore();
  return true;
}
