export function drawNewPlayerTutorWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  reducedMotion = false,
  focusedNodeId = "",
  focused = false,
  drawCanvasCard = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.point || !spec.nodes?.length) return false;
  const { rect, point, nodes } = spec;
  const bob = reducedMotion ? 0 : Math.sin(motion * 1.6) * 1.8;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 4.1) * 2.4;
  ctx.save();

  ctx.strokeStyle = "rgba(141, 164, 98, 0.48)";
  ctx.lineWidth = focused ? 2.8 : 1.8;
  ctx.setLineDash([7, 7]);
  ctx.lineDashOffset = reducedMotion ? 0 : -motion * 12;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.width - 22, rect.y + rect.height - 24 + bob);
  ctx.quadraticCurveTo((rect.x + point.x) / 2, rect.y - 34, point.x, point.y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(141, 164, 98, 0.2)";
  ctx.beginPath();
  ctx.ellipse(point.x, point.y + 10, 34 + pulse, 14 + pulse * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#8da462";
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 14 + Math.max(0, pulse) * 0.35, 0, Math.PI * 2);
  ctx.stroke();

  drawCanvasCard(ctx, rect.x, rect.y + bob, rect.width, rect.height, "rgba(255, 253, 245, 0.93)");
  ctx.strokeStyle = focused ? "rgba(224, 182, 109, 0.86)" : "rgba(141, 164, 98, 0.58)";
  ctx.lineWidth = focused ? 2.6 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1.5, rect.y + 1.5 + bob, rect.width - 3, rect.height - 3, 18);
  ctx.stroke();

  ctx.fillStyle = "rgba(141, 164, 98, 0.18)";
  ctx.beginPath();
  ctx.roundRect(rect.x + 14, rect.y + 12 + bob, 54, 42, 14);
  ctx.fill();
  ctx.fillStyle = "#286f58";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText("授", rect.x + 32, rect.y + 39 + bob);
  ctx.fillStyle = "#286f58";
  ctx.font = "900 12px Microsoft YaHei";
  ctx.fillText(`${spec.title} ${spec.progress}`, rect.x + 82, rect.y + 26 + bob);
  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.headline.slice(0, 21), rect.x + 82, rect.y + 47 + bob);
  ctx.fillStyle = "#5d6f65";
  ctx.font = "11px Microsoft YaHei";
  ctx.fillText(spec.dialogue.slice(0, 36), rect.x + 18, rect.y + 68 + bob);

  ctx.strokeStyle = "rgba(141, 164, 98, 0.36)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  nodes.forEach((node, index) => {
    const x = node.point.x;
    const y = node.point.y + bob;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  nodes.forEach((node) => {
    const active = focused && focusedNodeId === node.id;
    const live = node.live || active;
    const x = node.point.x;
    const y = node.point.y + bob;
    const color = node.done ? "#8da462" : live ? "#b47d2f" : "#a8b2aa";
    ctx.fillStyle = node.done ? "rgba(141, 164, 98, 0.2)" : live ? "rgba(224, 182, 109, 0.22)" : "rgba(23, 35, 29, 0.1)";
    ctx.beginPath();
    ctx.arc(x, y, live ? 22 + Math.max(0, pulse) : 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, live ? 14 + Math.max(0, pulse) * 0.35 : 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 11px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.fillText(node.glyph, x, y + 4);
    ctx.fillStyle = live ? "#17231d" : "#5d6f65";
    ctx.font = live ? "900 10px Microsoft YaHei" : "800 9px Microsoft YaHei";
    ctx.fillText(node.label, x, rect.y + 116 + bob);
  });
  ctx.textAlign = "left";

  ctx.fillStyle = "rgba(255, 248, 232, 0.94)";
  ctx.beginPath();
  ctx.roundRect(rect.x + rect.width - 82, rect.y + rect.height - 27 + bob, 64, 18, 9);
  ctx.fill();
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "900 8px Microsoft YaHei";
  ctx.fillText("只定位不代劳", rect.x + rect.width - 75, rect.y + rect.height - 15 + bob);

  ctx.fillStyle = "#286f58";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.subtitle} · 点击看 ${spec.actionLabel}`.slice(0, 32), rect.x + 18, rect.y + rect.height - 12 + bob);

  ctx.restore();
  return true;
}
