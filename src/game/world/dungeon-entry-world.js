export function drawDungeonEntranceSilhouetteWorldWorld({
  ctx,
  spec = null,
  motion = 0,
  activeNodeKey = "",
  reducedMotion = false,
  drawCanvasCard = () => {},
  drawGlyph = () => {},
} = {}) {
  if (!ctx || !spec?.rect || !spec.nodes?.length) return false;
  const { rect, anchor, theme } = spec;
  const pulse = reducedMotion ? 0 : Math.sin(motion * 1.9) * 2.4;

  ctx.save();

  if (anchor) {
    ctx.strokeStyle = `${theme.accent}55`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 8]);
    ctx.lineDashOffset = reducedMotion ? 0 : -motion * 7;
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y + 4);
    ctx.quadraticCurveTo(rect.x + rect.width * 0.72, rect.y + rect.height + 22, rect.x + rect.width - 28, rect.y + rect.height - 12);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCanvasCard(ctx, rect.x, rect.y + pulse, rect.width, rect.height, "rgba(255, 253, 245, 0.91)");
  ctx.strokeStyle = activeNodeKey ? `${theme.accent}ee` : `${theme.accent}77`;
  ctx.lineWidth = activeNodeKey ? 2.5 : 1.6;
  ctx.beginPath();
  ctx.roundRect(rect.x + 1, rect.y + pulse + 1, rect.width - 2, rect.height - 2, 20);
  ctx.stroke();

  ctx.fillStyle = "rgba(23, 35, 29, 0.08)";
  ctx.beginPath();
  ctx.ellipse(rect.x + 54, rect.y + 35 + pulse, 44, 17, -0.12, 0, Math.PI * 2);
  ctx.fill();
  drawGlyph(ctx, spec, rect.x + 24, rect.y + 15 + pulse, 42, motion);
  ctx.fillStyle = theme.accent;
  ctx.font = "900 9px Microsoft YaHei";
  ctx.fillText("入口辨识", rect.x + 24, rect.y + 58 + pulse);

  ctx.fillStyle = "#17231d";
  ctx.font = "900 14px Microsoft YaHei";
  ctx.fillText(spec.title, rect.x + 82, rect.y + 24 + pulse);
  ctx.fillStyle = "#8f5f3f";
  ctx.font = "800 10px Microsoft YaHei";
  ctx.fillText(`${spec.subtitle} · ${spec.note}`.slice(0, 38), rect.x + 82, rect.y + 43 + pulse);

  spec.nodes.forEach((node, index) => {
    const nodeRect = node.rect;
    const active = activeNodeKey === node.key;
    const isRule = node.key === "field_rule";
    const isSolution = node.key === "spirit_solution";
    const fill = isRule
      ? "rgba(236, 248, 243, 0.9)"
      : isSolution
        ? theme.soft
        : "rgba(255, 248, 232, 0.92)";
    const accent = isRule ? "#286f58" : isSolution ? theme.accent : "#b47d2f";
    const bob = active ? pulse / 1.7 : Math.sin(motion * 1.3 + index) * 0.8;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(nodeRect.x, nodeRect.y + bob, nodeRect.width, nodeRect.height, 15);
    ctx.fill();
    ctx.strokeStyle = active ? `${accent}ee` : `${accent}77`;
    ctx.lineWidth = active ? 2.4 : 1.4;
    ctx.stroke();

    ctx.fillStyle = active ? accent : `${accent}dd`;
    ctx.beginPath();
    ctx.arc(nodeRect.x + 21, nodeRect.y + 20 + bob, active ? 14 : 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fffdf5";
    ctx.font = "900 14px Microsoft YaHei";
    ctx.fillText(node.glyph, nodeRect.x + 14, nodeRect.y + 25 + bob);

    ctx.fillStyle = "#17231d";
    ctx.font = "900 10px Microsoft YaHei";
    ctx.fillText(node.label, nodeRect.x + 40, nodeRect.y + 18 + bob);
    ctx.fillStyle = active ? accent : "#5d6f65";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(node.title.slice(0, 8), nodeRect.x + 40, nodeRect.y + 33 + bob);
  });

  const focusNode = spec.nodes.find((node) => node.key === activeNodeKey) || spec.nodes[0];
  if (focusNode) {
    ctx.fillStyle = "rgba(236, 248, 243, 0.76)";
    ctx.beginPath();
    ctx.roundRect(rect.x + 18, rect.y + rect.height - 19 + pulse, rect.width - 36, 14, 7);
    ctx.fill();
    ctx.fillStyle = "#286f58";
    ctx.font = "800 8px Microsoft YaHei";
    ctx.fillText(`${focusNode.label}：${focusNode.text}`.slice(0, 51), rect.x + 30, rect.y + rect.height - 9 + pulse);
  }

  ctx.restore();
  return true;
}
